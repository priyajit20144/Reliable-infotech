import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { store, persistStoreState } from '../seed/seedData.js';
import { ProjectModel } from '../models/Project.js';
import { SystemMetaModel } from '../models/SystemMeta.js';
import { isConnectedToMongo } from '../config/db.js';

export const getProjects = async (req: Request, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const { category, search, featured, tech } = req.query;

    // Retrieve active tombstoned / deleted IDs
    let deletedIds = store.deletedProjectIds || [];
    if (isConnectedToMongo) {
      try {
        const meta = await SystemMetaModel.findOne({ key: 'devcraft_system_state' });
        if (meta && Array.isArray(meta.deletedProjectIds)) {
          deletedIds = Array.from(new Set([...deletedIds, ...meta.deletedProjectIds]));
          store.deletedProjectIds = deletedIds;
        }
      } catch {}
    }
    const deletedSet = new Set(deletedIds);

    if (isConnectedToMongo) {
      try {
        const query: any = {
          status: 'PUBLISHED',
          _id: { $nin: Array.from(deletedSet) },
          slug: { $nin: Array.from(deletedSet) },
        };

        if (category && category !== 'All') {
          query.category = category;
        }
        if (featured === 'true') {
          query.featured = true;
        }
        if (tech) {
          query.technologies = { $in: [tech] };
        }
        if (search) {
          query.$or = [
            { title: { $regex: search as string, $options: 'i' } },
            { shortDescription: { $regex: search as string, $options: 'i' } },
            { description: { $regex: search as string, $options: 'i' } },
          ];
        }
        const projects = await ProjectModel.find(query).sort({ featured: -1, createdAt: -1 });
        return res.json({ success: true, count: projects.length, data: projects });
      } catch (e) {
        console.warn('[MongoDB find projects failed, falling back to memory store]:', e);
      }
    }

    // Memory fallback
    let list = store.projects.filter(
      (p) => p.status === 'PUBLISHED' && !deletedSet.has(p._id) && !deletedSet.has(p.slug)
    );
    if (category && category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase().includes((category as string).toLowerCase()));
    }
    if (featured === 'true') {
      list = list.filter((p) => p.featured === true);
    }
    if (tech) {
      list = list.filter((p) =>
        p.technologies.some((t: string) => t.toLowerCase() === (tech as string).toLowerCase())
      );
    }
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo) {
      let project = await ProjectModel.findById(id);
      if (!project) {
        project = await ProjectModel.findOne({ slug: id });
      }
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found.' });
      }
      return res.json({ success: true, data: project });
    }

    const project = store.projects.find((p) => p._id === id || p.slug === id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    return res.json({ success: true, data: project });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      description,
      category,
      technologies,
      features,
      images,
      thumbnail,
      demoUrl,
      githubUrl,
      price,
      featured,
    } = req.body;

    if (!title || !shortDescription || !description || !category) {
      return res.status(400).json({ success: false, message: 'Required fields missing.' });
    }

    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newProjectData = {
      _id: `proj_${Date.now()}`,
      title,
      slug: finalSlug,
      shortDescription,
      description,
      category,
      technologies: Array.isArray(technologies) ? technologies : [],
      features: Array.isArray(features) ? features : [],
      images: Array.isArray(images) ? images : [],
      thumbnail: thumbnail || (images && images[0]) || '',
      demoUrl: demoUrl || '',
      githubUrl: githubUrl || '',
      price: price ? Number(price) : 0,
      status: 'PUBLISHED',
      featured: Boolean(featured),
      createdBy: req.user?.id || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isConnectedToMongo) {
      const created = await ProjectModel.create(newProjectData);
      // Un-tombstone if re-created
      try {
        await SystemMetaModel.findOneAndUpdate(
          { key: 'devcraft_system_state' },
          { $pull: { deletedProjectIds: { $in: [finalSlug, created._id] } } }
        );
      } catch {}
      store.deletedProjectIds = (store.deletedProjectIds || []).filter(
        (id) => id !== finalSlug && id !== created._id
      );
      persistStoreState();
      return res.status(201).json({ success: true, data: created });
    }

    store.deletedProjectIds = (store.deletedProjectIds || []).filter(
      (id) => id !== finalSlug && id !== newProjectData._id
    );
    store.projects.unshift(newProjectData);
    persistStoreState();
    return res.status(201).json({ success: true, data: newProjectData });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo) {
      const updated = await ProjectModel.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Project not found.' });
      persistStoreState();
      return res.json({ success: true, data: updated });
    }

    const idx = store.projects.findIndex((p) => p._id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    store.projects[idx] = { ...store.projects[idx], ...req.body, updatedAt: new Date() };
    persistStoreState();
    return res.json({ success: true, data: store.projects[idx] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, message: 'Project identifier is required.' });
    }

    const targetId = id.trim();
    const identifiers = new Set<string>([targetId]);

    // Check memory store for matching slug or _id to collect all aliases
    const inMemProj = store.projects.find((p) => p._id === targetId || p.slug === targetId);
    if (inMemProj) {
      if (inMemProj._id) identifiers.add(String(inMemProj._id));
      if (inMemProj.slug) identifiers.add(String(inMemProj.slug));
    }

    if (isConnectedToMongo) {
      try {
        const conditions: any[] = [{ _id: targetId }, { slug: targetId }];
        if (mongoose.Types.ObjectId.isValid(targetId)) {
          conditions.push({ _id: new mongoose.Types.ObjectId(targetId) });
        }

        const deletedDoc = await ProjectModel.findOneAndDelete({ $or: conditions });
        if (deletedDoc) {
          if (deletedDoc._id) identifiers.add(String(deletedDoc._id));
          if (deletedDoc.slug) identifiers.add(String(deletedDoc.slug));
        }

        // Permanent tombstone in MongoDB system metadata so seeder never resurrects it
        await SystemMetaModel.findOneAndUpdate(
          { key: 'devcraft_system_state' },
          {
            $set: { hasSeededProjects: true },
            $addToSet: { deletedProjectIds: { $each: Array.from(identifiers) } },
          },
          { upsert: true }
        );
      } catch (mongoErr) {
        console.warn('[MongoDB delete project error]:', mongoErr);
      }
    }

    // Add to in-memory deleted tombstone list
    const idList = Array.from(identifiers);
    store.deletedProjectIds = Array.from(new Set([...(store.deletedProjectIds || []), ...idList]));

    // Remove from in-memory fallback store
    store.projects = store.projects.filter(
      (p) => !identifiers.has(String(p._id)) && !identifiers.has(String(p.slug))
    );

    // Persist changes to disk storage immediately
    persistStoreState();

    return res.json({
      success: true,
      message: 'Showcase project deleted permanently.',
      deletedId: targetId,
      tombstones: idList,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
