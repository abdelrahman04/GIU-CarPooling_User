import prisma from '../lib/prisma.js';
import { BadRequestException, NotFoundException } from '../exceptions/index.js';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { mkdir } from 'fs/promises';

class DriverService {
  async getDriverCar(userId) {
    const driver = await prisma.driver.findUnique({
      where: { userId },
      include: { car: true }
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async addDriverCar(userId, carData) {
    const existingDriver = await prisma.driver.findUnique({
      where: { userId }
    });

    if (existingDriver) {
      throw new BadRequestException('Driver already exists');
    }

    const driver = await prisma.driver.create({
      data: {
        userId,
        car: {
          create: carData
        }
      },
      include: { car: true }
    });

    return driver;
  }

  async updateDriverCar(userId, carData) {
    const driver = await prisma.driver.findUnique({
      where: { userId },
      include: { car: true }
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    if (!driver.car) {
      throw new NotFoundException('Car not found');
    }

    const updatedDriver = await prisma.driver.update({
      where: { userId },
      data: {
        car: {
          update: carData
        }
      },
      include: { car: true }
    });

    return updatedDriver;
  }

  async deleteDriverCar(userId) {
    const driver = await prisma.driver.findUnique({
      where: { userId },
      include: { car: true }
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    if (!driver.car) {
      throw new NotFoundException('Car not found');
    }

    const updatedDriver = await prisma.driver.update({
      where: { userId },
      data: {
        car: {
          delete: true
        }
      },
      include: { car: true }
    });

    return updatedDriver;
  }

  async uploadLicense(userId, file) {
    const driver = await prisma.driver.findUnique({
      where: { userId },
      include: { car: true }
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    if (!driver.car) {
      throw new NotFoundException('Car not found');
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads', 'licenses');
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const filename = `${driver.id}-${Date.now()}-${file.filename}`;
    const filepath = join(uploadDir, filename);

    // Save file
    const writeStream = createWriteStream(filepath);
    await new Promise((resolve, reject) => {
      file.createReadStream()
        .pipe(writeStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    // Update car with license picture path
    const updatedDriver = await prisma.driver.update({
      where: { userId },
      data: {
        car: {
          update: {
            licensePicture: `/uploads/licenses/${filename}`
          }
        }
      },
      include: { car: true }
    });

    return updatedDriver;
  }
}

export const driverService = new DriverService(); 