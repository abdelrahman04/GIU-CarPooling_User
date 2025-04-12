import prisma from '../lib/prisma.js';
import { BadRequestException, NotFoundException } from '../exceptions/index.js';
import { createWriteStream, readFileSync } from 'fs';
import { join } from 'path';
import { mkdir } from 'fs/promises';

class DriverService {
  async activateDriver(userId) {
    const driver = await prisma.driver.findUnique({
      where: { id: parseInt(userId) },
      include: { car: true }
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const updatedDriver = await prisma.driver.update({
      where: { id: parseInt(userId) },
      data: {
        approved: true
      },
      include: { car: true }
    });

    return updatedDriver;
  }

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

    return driver.car;
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
    console.log('carData');
    console.log(carData);
    const updatedDriver = await prisma.driver.update({
      where: { userId },
      data: {
        car: {
          update: carData
        }
      },
      include: { car: true }
    });
    console.log('updatedDriver');
    console.log(updatedDriver);
    return updatedDriver.car;
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

  async downloadLicense(userId) {
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

    if (!driver.car.licensePicture) {
      throw new NotFoundException('License picture not found');
    }

    // Get the file path from the stored path
    // The path stored in the database is relative to the project root
    const filePath = join(process.cwd(), driver.car.licensePicture);
    
    try {
      // Read the file content
      const fileContent = readFileSync(filePath);
      
      // Get the file extension
      const fileExtension = driver.car.licensePicture.split('.').pop();
      
      // Determine the MIME type based on file extension
      let mimeType = 'application/octet-stream';
      if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
        mimeType = 'image/jpeg';
      } else if (fileExtension === 'png') {
        mimeType = 'image/png';
      } else if (fileExtension === 'pdf') {
        mimeType = 'application/pdf';
      }
      
      return {
        fileContent: fileContent.toString('base64'),
        filename: driver.car.licensePicture.split('/').pop(),
        mimeType
      };
    } catch (error) {
      console.error('Error reading license file:', error);
      throw new NotFoundException('License file not found or cannot be read');
    }
  }
}

export const driverService = new DriverService(); 