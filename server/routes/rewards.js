import express from 'express';
import Reward from '../models/Reward.js';
import { authenticate, requireEmployee } from '../middleware/auth.js';

const router = express.Router();

// Get client's rewards (client only)
router.get('/me', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Only clients can view their rewards.' });
    }

    let reward = await Reward.findOne({ clientId: req.user._id });
    
    // Create reward record if it doesn't exist
    if (!reward) {
      reward = new Reward({ clientId: req.user._id });
      await reward.save();
    }

    // Calculate next reward threshold
    const pointsToNextReward = calculateNextReward(reward.totalPoints);

    res.json({
      reward: {
        totalPoints: reward.totalPoints,
        lifetimePoints: reward.lifetimePoints,
        pointsRedeemed: reward.pointsRedeemed,
        tier: reward.tier,
        pointsToNextReward,
        nextRewardThreshold: getNextRewardThreshold(reward.totalPoints)
      }
    });
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ error: 'Failed to fetch rewards.' });
  }
});

// Get client rewards by ID (employee/admin only)
router.get('/client/:clientId', authenticate, requireEmployee, async (req, res) => {
  try {
    let reward = await Reward.findOne({ clientId: req.params.clientId });
    
    if (!reward) {
      reward = new Reward({ clientId: req.params.clientId });
      await reward.save();
    }

    res.json({ reward });
  } catch (error) {
    console.error('Get client rewards error:', error);
    res.status(500).json({ error: 'Failed to fetch client rewards.' });
  }
});

// Adjust points (employee/admin only)
router.post('/adjust', authenticate, requireEmployee, async (req, res) => {
  try {
    const { clientId, points, reason } = req.body;

    if (!clientId || points === undefined) {
      return res.status(400).json({ error: 'Client ID and points are required.' });
    }

    let reward = await Reward.findOne({ clientId });
    if (!reward) {
      reward = new Reward({ clientId });
    }

    if (points > 0) {
      await reward.addPoints(points, reason || 'Manual adjustment');
    } else if (points < 0) {
      // Deduct points
      const pointsToDeduct = Math.abs(points);
      if (pointsToDeduct > reward.totalPoints) {
        return res.status(400).json({ error: 'Insufficient points to deduct.' });
      }
      reward.totalPoints -= pointsToDeduct;
      reward.pointsRedeemed += pointsToDeduct;
      await reward.save();
    }

    res.json({
      message: 'Points adjusted successfully',
      reward: {
        totalPoints: reward.totalPoints,
        lifetimePoints: reward.lifetimePoints,
        pointsRedeemed: reward.pointsRedeemed,
        tier: reward.tier
      }
    });
  } catch (error) {
    console.error('Adjust points error:', error);
    res.status(500).json({ error: 'Failed to adjust points.' });
  }
});

// Redeem points (client only)
router.post('/redeem', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Only clients can redeem points.' });
    }

    const { points } = req.body;

    if (!points || points <= 0) {
      return res.status(400).json({ error: 'Invalid points amount.' });
    }

    let reward = await Reward.findOne({ clientId: req.user._id });
    if (!reward) {
      return res.status(404).json({ error: 'No reward account found.' });
    }

    if (points > reward.totalPoints) {
      return res.status(400).json({ error: 'Insufficient points.' });
    }

    await reward.redeemPoints(points);

    res.json({
      message: 'Points redeemed successfully',
      reward: {
        totalPoints: reward.totalPoints,
        pointsRedeemed: reward.pointsRedeemed
      }
    });
  } catch (error) {
    console.error('Redeem points error:', error);
    res.status(500).json({ error: 'Failed to redeem points.' });
  }
});

// Helper functions
function calculateNextReward(currentPoints) {
  const thresholds = [50, 100, 200, 500, 1000];
  for (const threshold of thresholds) {
    if (currentPoints < threshold) {
      return threshold - currentPoints;
    }
  }
  return 0; // Max tier reached
}

function getNextRewardThreshold(currentPoints) {
  const thresholds = [
    { points: 50, reward: '$5 off' },
    { points: 100, reward: '$10 off' },
    { points: 200, reward: '$20 off' },
    { points: 500, reward: '$50 off' },
    { points: 1000, reward: '$100 off' }
  ];
  
  for (const threshold of thresholds) {
    if (currentPoints < threshold.points) {
      return threshold;
    }
  }
  return { points: 1000, reward: 'Max tier reached' };
}

export default router;

