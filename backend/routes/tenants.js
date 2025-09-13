const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const Tenant = require('../models/Tenant');

const router = express.Router();

// Upgrade tenant to Pro plan
router.post('/:slug/upgrade', auth, requireRole('admin'), async (req, res) => {
  try {
    if (req.user.tenant.slug !== req.params.slug) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tenant = await Tenant.findByIdAndUpdate(
      req.user.tenant._id,
      { plan: 'pro' },
      { new: true }
    );

    res.json({ message: 'Plan upgraded to Pro successfully', tenant });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Downgrade tenant to Free plan
router.post('/:slug/downgrade', auth, requireRole('admin'), async (req, res) => {
  try {
    if (req.user.tenant.slug !== req.params.slug) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tenant = await Tenant.findByIdAndUpdate(
      req.user.tenant._id,
      { plan: 'free' },
      { new: true }
    );

    res.json({ message: 'Plan downgraded to Free successfully', tenant });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;