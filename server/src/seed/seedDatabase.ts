import { UserModel } from '../models/User.js';
import { ProjectModel } from '../models/Project.js';
import { CustomRequestModel } from '../models/CustomRequest.js';
import { ProjectInquiryModel } from '../models/ProjectInquiry.js';
import { ConversationModel } from '../models/Conversation.js';
import { MessageModel } from '../models/Message.js';
import { NotificationModel } from '../models/Notification.js';
import { SystemMetaModel } from '../models/SystemMeta.js';
import { store, persistStoreState } from './seedData.js';

export const seedDatabaseIfEmpty = async () => {
  try {
    // 1. Fetch or initialize system metadata to track seeder lifecycle
    let meta = await SystemMetaModel.findOne({ key: 'devcraft_system_state' });
    const existingProjectCount = await ProjectModel.countDocuments();

    if (!meta) {
      meta = await SystemMetaModel.create({
        key: 'devcraft_system_state',
        hasSeededProjects: existingProjectCount > 0,
        deletedProjectIds: Array.from(new Set(store.deletedProjectIds || [])),
      });
    }

    // Two-way sync of deletedProjectIds between MongoDB and memory store
    const mergedDeleted = Array.from(
      new Set([...(meta.deletedProjectIds || []), ...(store.deletedProjectIds || [])])
    );
    meta.deletedProjectIds = mergedDeleted;
    store.deletedProjectIds = mergedDeleted;
    persistStoreState();

    // Purge any project from MongoDB that was marked as deleted
    if (mergedDeleted.length > 0) {
      await ProjectModel.deleteMany({
        $or: [
          { _id: { $in: mergedDeleted } },
          { slug: { $in: mergedDeleted } },
        ],
      });
    }

    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('[MongoDB Seeder] Seeding initial users...');
      await UserModel.insertMany(store.users);
      console.log(`[MongoDB Seeder] Successfully seeded ${store.users.length} users.`);
    }

    // Showcase projects are strictly and exclusively managed by administrators through the dashboard
    meta.hasSeededProjects = true;
    await meta.save();

    const requestCount = await CustomRequestModel.countDocuments();
    if (requestCount === 0 && store.customRequests.length > 0) {
      await CustomRequestModel.insertMany(store.customRequests);
      console.log(`[MongoDB Seeder] Seeded ${store.customRequests.length} custom requests.`);
    }

    const inquiryCount = await ProjectInquiryModel.countDocuments();
    if (inquiryCount === 0 && store.projectInquiries.length > 0) {
      await ProjectInquiryModel.insertMany(store.projectInquiries);
      console.log(`[MongoDB Seeder] Seeded ${store.projectInquiries.length} project inquiries.`);
    }



    const notifCount = await NotificationModel.countDocuments();
    if (notifCount === 0 && store.notifications.length > 0) {
      await NotificationModel.insertMany(store.notifications);
      console.log(`[MongoDB Seeder] Seeded ${store.notifications.length} notifications.`);
    }
  } catch (error) {
    console.error('[MongoDB Seeder] Error during database initialization:', (error as Error).message);
  }
};
