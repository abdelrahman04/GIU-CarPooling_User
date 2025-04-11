import { driverService } from '../services/driver.service.js';
import prisma from '../lib/prisma.js';

const resolvers = {
  Query: {
    myDriverCar: async (_, __, context) => {
      if (!context || !context.user) {
        throw new Error('Not authenticated');
      }
      const driver = await driverService.getDriverCar(context.user.id);
      return driver.car;
    },
    
    downloadLicense: async (_, __, context) => {
      if (!context || !context.user) {
        throw new Error('Not authenticated');
      }
      return driverService.downloadLicense(context.user.id);
    }
  },

  Mutation: {
    activateDriver: async (_, { userId }, context) => {
      if (!context || !context.user) {
        throw new Error('Not authenticated');
      }
      if (!context.user.isAdmin) {
        throw new Error('Not authorized: Admin access required');
      }
      return driverService.activateDriver(userId);
    },

    addDriverCar: async (_, { input }, context) => {
      if (!context || !context.user) {
        throw new Error('Not authenticated');
      }
      return await driverService.addDriverCar(context.user.id, input);
    },

    updateDriverCar: async (_, { input }, context) => {
      if (!context || !context.user) {
        throw new Error('Not authenticated');
      }
      return await driverService.updateDriverCar(context.user.id, input);
    },

    deleteDriverCar: async (_, __, context) => {
      if (!context || !context.user) {
        throw new Error('Not authenticated');
      }
      return driverService.deleteDriverCar(context.user.id);
    },

    uploadLicense: async (_, { file }, context) => {
      if (!context || !context.user) {
        throw new Error('Not authenticated');
      }
      return driverService.uploadLicense(context.user.id, file);
    }
  },

  Driver: {
    car: async (parent) => {
      return prisma.carDetails.findUnique({
        where: { driverId: parent.id }
      });
    }
  },

  User: {
    driver: async (parent) => {
      return prisma.driver.findUnique({
        where: { userId: parent.id }
      });
    }
  }
};

export default resolvers; 