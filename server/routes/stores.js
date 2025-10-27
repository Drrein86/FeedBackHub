import express from 'express';
import { prisma } from '../index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all stores with translations for a specific language
router.get('/', async (req, res) => {
  try {
    const { language = 'en' } = req.query;

    const stores = await prisma.store.findMany({
      include: {
        translations: {
          where: { language }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform to match frontend expectations
    const transformedStores = stores.map(store => {
      const translation = store.translations[0];
      return {
        id: store.id,
        name: translation?.name || 'Untitled Store',
        location: translation?.location || 'No location',
        createdAt: store.createdAt.toISOString().split('T')[0]
      };
    });

    res.json(transformedStores);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// Create store (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, location, language = 'en' } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required' });
    }

    const store = await prisma.store.create({
      data: {
        translations: {
          create: {
            language,
            name,
            location
          }
        }
      },
      include: {
        translations: true
      }
    });

    res.status(201).json({
      id: store.id,
      name,
      location,
      createdAt: store.createdAt.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ error: 'Failed to create store' });
  }
});

// Update store (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, language = 'en' } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required' });
    }

    // Update or create translation
    await prisma.storeTranslation.upsert({
      where: {
        storeId_language: {
          storeId: id,
          language
        }
      },
      update: {
        name,
        location
      },
      create: {
        storeId: id,
        language,
        name,
        location
      }
    });

    const updatedStore = await prisma.store.findUnique({
      where: { id },
      include: {
        translations: {
          where: { language }
        }
      }
    });

    res.json({
      id: updatedStore.id,
      name,
      location,
      createdAt: updatedStore.createdAt.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ error: 'Failed to update store' });
  }
});

// Delete store (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.store.delete({
      where: { id }
    });

    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ error: 'Failed to delete store' });
  }
});

export default router;
