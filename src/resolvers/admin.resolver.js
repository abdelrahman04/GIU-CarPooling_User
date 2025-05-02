import { adminService } from '../services/admin.service.js';

const resolvers = {
  Query: {
    pendingDrivers: async (_, __, context) => {
      if (!context || !context.user) {
        throw new Error('Not authenticated');
      }
      if (!context.user.isAdmin) {
        throw new Error('Not authorized: Admin access required');
      }
      return adminService.getPendingDrivers();
    }
  }
};

export default resolvers; 