import express from 'express';
import { prisma } from '../index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get settings
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.settings.create({
        data: {
          webhookUrl: '',
          notificationEmail: '',
          autoApprove: true,
          minRating: 1
        }
      });
    }

    res.json({
      webhookUrl: settings.webhookUrl,
      notificationEmail: settings.notificationEmail,
      autoApprove: settings.autoApprove,
      minRating: settings.minRating
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings
router.put('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { webhookUrl, notificationEmail, autoApprove, minRating } = req.body;

    // Validate minRating
    if (minRating && (minRating < 1 || minRating > 5)) {
      return res.status(400).json({ error: 'Minimum rating must be between 1 and 5' });
    }

    let settings = await prisma.settings.findFirst();

    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          webhookUrl: webhookUrl || settings.webhookUrl,
          notificationEmail: notificationEmail || settings.notificationEmail,
          autoApprove: autoApprove !== undefined ? autoApprove : settings.autoApprove,
          minRating: minRating !== undefined ? minRating : settings.minRating
        }
      });
    } else {
      settings = await prisma.settings.create({
        data: {
          webhookUrl: webhookUrl || '',
          notificationEmail: notificationEmail || '',
          autoApprove: autoApprove !== undefined ? autoApprove : true,
          minRating: minRating !== undefined ? minRating : 1
        }
      });
    }

    res.json({
      webhookUrl: settings.webhookUrl,
      notificationEmail: settings.notificationEmail,
      autoApprove: settings.autoApprove,
      minRating: settings.minRating
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
