import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Client ID is required'],
    unique: true // One reward record per client
  },
  // Total points accumulated
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  // Lifetime points (never decreases, for tracking)
  lifetimePoints: {
    type: Number,
    default: 0,
    min: 0
  },
  // Points redeemed
  pointsRedeemed: {
    type: Number,
    default: 0,
    min: 0
  },
  // Reward tier (optional)
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  // Last updated
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
rewardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to add points
rewardSchema.methods.addPoints = function(points, reason = '') {
  this.totalPoints += points;
  this.lifetimePoints += points;
  this.updatedAt = Date.now();
  
  // Update tier based on lifetime points
  if (this.lifetimePoints >= 1000) {
    this.tier = 'platinum';
  } else if (this.lifetimePoints >= 500) {
    this.tier = 'gold';
  } else if (this.lifetimePoints >= 200) {
    this.tier = 'silver';
  } else {
    this.tier = 'bronze';
  }
  
  return this.save();
};

// Method to redeem points
rewardSchema.methods.redeemPoints = function(points) {
  if (points > this.totalPoints) {
    throw new Error('Insufficient points');
  }
  this.totalPoints -= points;
  this.pointsRedeemed += points;
  this.updatedAt = Date.now();
  return this.save();
};

export default mongoose.model('Reward', rewardSchema);

