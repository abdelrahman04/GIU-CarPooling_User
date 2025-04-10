import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class CarService {
  async addCar(userId, input) {
    // Check if user already has a car
    const existingCar = await prisma.car.findUnique({
      where: { userId },
    });

    if (existingCar) {
      throw new Error('User already has a car registered');
    }

    // Check if license plate is already registered
    const existingLicensePlate = await prisma.car.findUnique({
      where: { licensePlate: input.licensePlate },
    });

    if (existingLicensePlate) {
      throw new Error('License plate already registered');
    }

    return prisma.car.create({
      data: {
        ...input,
        userId,
      },
    });
  }

  async updateCar(userId, input) {
    const car = await prisma.car.findUnique({
      where: { userId },
    });

    if (!car) {
      throw new Error('Car not found');
    }

    // Check if new license plate is already registered by another user
    if (input.licensePlate !== car.licensePlate) {
      const existingLicensePlate = await prisma.car.findUnique({
        where: { licensePlate: input.licensePlate },
      });

      if (existingLicensePlate) {
        throw new Error('License plate already registered');
      }
    }

    return prisma.car.update({
      where: { userId },
      data: input,
    });
  }

  async deleteCar(userId) {
    const car = await prisma.car.findUnique({
      where: { userId },
    });

    if (!car) {
      throw new Error('Car not found');
    }

    await prisma.car.delete({
      where: { userId },
    });

    return true;
  }

  async getCar(userId) {
    return prisma.car.findUnique({
      where: { userId },
    });
  }
}

export const carService = new CarService(); 