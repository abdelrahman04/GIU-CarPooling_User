import { PrismaClient } from '@prisma/client';
import { authService } from './services/auth.service.js';
import { emailService } from './services/email.service.js';
import { jwtService } from './services/jwt.service.js';
import { carService } from './services/car.service.js';
import { driverService } from './services/driver.service.js';
import userResolvers from './resolvers/user.resolver.js';
import driverResolvers from './resolvers/driver.resolver.js';
import authResolvers from './resolvers/auth.resolver.js';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...driverResolvers.Query,
    ...authResolvers.Query,
    myCar: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return carService.getCar(user.id);
    },
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...driverResolvers.Mutation,
    ...authResolvers.Mutation,
    addCar: async (_, { input }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return carService.addCar(user.id, input);
    },

    updateCar: async (_, { input }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return carService.updateCar(user.id, input);
    },

    deleteCar: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return carService.deleteCar(user.id);
    },
  },

  User: {
    ...userResolvers.User,
  },

  Driver: {
    ...driverResolvers.Driver,
  },
}; 