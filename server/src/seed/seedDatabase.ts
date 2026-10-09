import { UserModel } from '../models/User.js';
import { ProjectModel } from '../models/Project.js';
import { CustomRequestModel } from '../models/CustomRequest.js';
import { ProjectInquiryModel } from '../models/ProjectInquiry.js';
import { ConversationModel } from '../models/Conversation.js';
import { MessageModel } from '../models/Message.js';
import { NotificationModel } from '../models/Notification.js';
import { store } from './seedData.js';

export const seedDatabaseIfEmpty = async () => {
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('[MongoDB Seeder] Seeding initial users...');
      await UserModel.insertMany(store.users);
      console.log(`[MongoDB Seeder] Successfully seeded ${store.users.length} users.`);
    }

    const projectCount = await ProjectModel.countDocuments();
    if (projectCount === 0) {
      console.log('[MongoDB Seeder] Seeding initial projects...');
      await ProjectModel.insertMany(store.projects);
      console.log(`[MongoDB Seeder] Successfully seeded ${store.projects.length} showcase projects.`);
    }

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

    // Ensure all seed conversations exist in MongoDB
    for (const conv of store.conversations) {
      const exists = await ConversationModel.findById(conv._id);
      if (!exists) {
        await ConversationModel.create(conv);
      } else {
        await ConversationModel.findByIdAndUpdate(conv._id, {
          clientName: conv.clientName,
          clientEmail: conv.clientEmail,
          clientAvatar: conv.clientAvatar,
          projectSubject: conv.projectSubject,
          time: conv.time,
        });
      }
    }

    // Ensure initial showcase seed messages exist in MongoDB
    for (const msg of store.messages) {
      const exists = await MessageModel.findById(msg._id);
      if (!exists) {
        await MessageModel.create(msg);
      }
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
