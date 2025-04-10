import { usersService } from '../services/users.service.js';
import prisma from '../lib/prisma.js';

const resolvers = {
  Query: {
    me: async (_, __, { req }) => {
      if (!req.user) {
        throw new Error('Not authenticated');
      }
      return usersService.getProfile(req.user.id);
    }
  },

  Mutation: {
    register: async (_, { input }) => {
      return usersService.register(input);
    },

    verifyRegistration: async (_, { input }) => {
      return usersService.verifyRegistration(input);
    },

    login: async (_, { input }) => {
      return usersService.login(input);
    },

    verifyLogin: async (_, { input }) => {
      return usersService.verifyLogin(input);
    },

    refreshToken: async (_, { token }) => {
      return usersService.refreshToken(token);
    },

    revokeToken: async (_, { token }) => {
      return usersService.revokeToken(token);
    }
  },

  User: {
    car: async (parent) => {
      return prisma.car.findUnique({
        where: { userId: parent.id }
      });
    },
    driver: async (parent) => {
      return prisma.driver.findUnique({
        where: { userId: parent.id },
        include: { car: true }
      });
    }
  }
};

export default resolvers; 