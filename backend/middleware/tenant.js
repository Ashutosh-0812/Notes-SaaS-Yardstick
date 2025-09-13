const Note = require('../models/Note');

const checkNoteLimit = async (req, res, next) => {
  try {
    if (req.user.tenant.plan === 'pro') {
      return next();
    }

    const noteCount = await Note.countDocuments({ tenant: req.user.tenant._id });
    
    if (noteCount >= 3) {
      return res.status(403).json({ 
        message: 'Free plan limit reached. Upgrade to Pro to add more notes.' 
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { checkNoteLimit };