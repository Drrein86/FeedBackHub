import express from 'express';
import { prisma } from '../index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Submit feedback/review
router.post('/', async (req, res) => {
  try {
    const { storeId, rating, comment, language = 'en' } = req.body;

    if (!storeId || !comment) {
      return res.status(400).json({ error: 'Store ID and comment are required' });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId }
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const review = await prisma.review.create({
      data: {
        storeId,
        rating: rating || null,
        comment,
        language
      },
      include: {
        store: {
          include: {
            translations: {
              where: { language }
            }
          }
        }
      }
    });

    res.status(201).json({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      language: review.language,
      createdAt: review.createdAt.toISOString().split('T')[0],
      storeName: review.store.translations[0]?.name || 'Unknown Store'
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Get all reviews (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { language = 'en', page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await prisma.review.findMany({
      skip,
      take: parseInt(limit),
      include: {
        store: {
          include: {
            translations: {
              where: { language }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.review.count();

    const transformedReviews = reviews.map(review => ({
      id: review.id,
      storeName: review.store.translations[0]?.name || 'Unknown Store',
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt.toISOString().split('T')[0],
      isApproved: review.isApproved
    }));

    res.json({
      reviews: transformedReviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Update review approval status (Admin only)
router.patch('/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const review = await prisma.review.update({
      where: { id },
      data: { isApproved }
    });

    res.json({
      id: review.id,
      isApproved: review.isApproved
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete review (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.review.delete({
      where: { id }
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;
