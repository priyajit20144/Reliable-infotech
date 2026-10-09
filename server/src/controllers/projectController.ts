import { Request, Response } from 'express';
import { store } from '../seed/seedData.js';
import { ProjectModel } from '../models/Project.js';
import { isConnectedToMongo } from '../config/db.js';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { category, search, featured, tech } = req.query;

    if (isConnectedToMongo) {
      try {
        const query: any = { status: 'PUBLISHED' };
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
    let list = store.projects.filter((p) => p.status === 'PUBLISHED');
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
      return res.status(201).json({ success: true, data: created });
    }

    store.projects.unshift(newProjectData);
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
      return res.json({ success: true, data: updated });
    }

    const idx = store.projects.findIndex((p) => p._id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    store.projects[idx] = { ...store.projects[idx], ...req.body, updatedAt: new Date() };
    return res.json({ success: true, data: store.projects[idx] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo) {
      await ProjectModel.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Project deleted successfully.' });
    }

    const idx = store.projects.findIndex((p) => p._id === id);
    if (idx !== -1) {
      store.projects.splice(idx, 1);
    }
    return res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
