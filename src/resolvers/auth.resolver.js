import { authService } from '../services/auth.service.js';
import { usersService } from '../services/users.service.js';

const resolvers = {
  Query: {
    validateToken: async (_, { token }) => {
      return authService.validateToken(token);
    },
    validateRefreshToken: async (_, { token }) => {
      return authService.validateRefreshToken(token);
    },
    isAdmin: async (_, { token }) => {
      return authService.isAdmin(token);
    },
    isDriver: async (_, { token }) => {
      return authService.isDriver(token);
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
    },

    validateAccessToken: async (_, { input }) => {
      try {
        await authService.validateToken(input.token);
        return true;
      } catch (error) {
        return false;
      }
    }
  }
};

export default resolvers; 