import { authService } from './services/auth.service.js';
import { emailService } from './services/email.service.js';
import { jwtService } from './services/jwt.service.js';
import { driverService } from './services/driver.service.js';
import userResolvers from './resolvers/user.resolver.js';
import driverResolvers from './resolvers/driver.resolver.js';
import authResolvers from './resolvers/auth.resolver.js';
import prisma from './lib/prisma.js';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...driverResolvers.Query,
    ...authResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...driverResolvers.Mutation,
    ...authResolvers.Mutation,
  },

  User: {
    ...userResolvers.User,
  },

  Driver: {
    ...driverResolvers.Driver,
  },
}; 