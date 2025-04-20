import { usersService } from '../services/users.service.js';
import prisma from '../lib/prisma.js';

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      console.log(context);
      console.log(context.user);
      if (!context || !context.user) {
        throw new Error('Not authenticated');
      }
      return usersService.getProfile(context.user.id);
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
    driver: async (parent) => {
      return prisma.driver.findUnique({
        where: { userId: parent.id },
        include: { car: true }
      });
    },
    isDriver: async (parent) => {
      const driver = await prisma.driver.findUnique({
        where: { userId: parent.id }
      });
      return !!driver;
    }
  }
};

export default resolvers; 