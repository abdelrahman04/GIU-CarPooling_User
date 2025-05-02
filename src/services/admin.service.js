import prisma from '../lib/prisma.js';

export const adminService = {
  async getPendingDrivers() {
    return prisma.user.findMany({
      where: {
        drivers: {
          is: {
            approved: false
          }
        }
      },
      include: {
        drivers: {
          include: {
            car: true
          }
        }
      }
    });
  },

  async getDriverDetails(userId) {
    return prisma.driver.findFirst({
      where: {
        userId: userId
      },
      include: {
        user: true,
        car: true
      }
    });
  }
}; 