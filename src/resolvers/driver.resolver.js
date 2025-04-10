import { driverService } from '../services/driver.service.js';

const resolvers = {
  Query: {
    myDriverCar: async (_, __, { req }) => {
      if (!req.user) {
        throw new Error('Not authenticated');
      }
      return driverService.getDriverCar(req.user.id);
    }
  },

  Mutation: {
    addDriverCar: async (_, { input }, { req }) => {
      if (!req.user) {
        throw new Error('Not authenticated');
      }
      return driverService.addDriverCar(req.user.id, input);
    },

    updateDriverCar: async (_, { input }, { req }) => {
      if (!req.user) {
        throw new Error('Not authenticated');
      }
      return driverService.updateDriverCar(req.user.id, input);
    },

    deleteDriverCar: async (_, __, { req }) => {
      if (!req.user) {
        throw new Error('Not authenticated');
      }
      return driverService.deleteDriverCar(req.user.id);
    },

    uploadLicense: async (_, { file }, { req }) => {
      if (!req.user) {
        throw new Error('Not authenticated');
      }
      return driverService.uploadLicense(req.user.id, file);
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