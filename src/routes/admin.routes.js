import express from 'express';
import { driverService } from '../services/driver.service.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Admin middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};

// Download driver's license
router.get('/download-license', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const userIdInt = parseInt(userId, 10);
    if (isNaN(userIdInt)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const license = await driverService.downloadLicense(userIdInt);
    
    // Set appropriate headers for file download
    res.setHeader('Content-Type', license.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${license.filename}"`);
    
    // Send the file content
    res.send(Buffer.from(license.fileContent, 'base64'));
  } catch (error) {
    console.error('Error downloading license:', error);
    res.status(500).json({ error: 'Failed to download license' });
  }
});

export default router; 