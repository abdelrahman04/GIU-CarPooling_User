import { authService } from '../services/auth.service.js';
import { usersService } from '../services/users.service.js';

const resolvers = {
  Query: {
    validateToken: async (_, { token }) => {
      return authService.validateToken(token);
    },
    validateRefreshToken: async (_, { token }) => {
      return authService.validateRefreshToken(token);
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

    refreshToken: async (_, { input }) => {
      return usersService.refreshToken(input.token);
    },

    revokeToken: async (_, { input }) => {
      return usersService.revokeToken(input.token);
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