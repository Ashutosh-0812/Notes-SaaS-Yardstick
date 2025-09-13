const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-saas';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define models directly in the seed script for simplicity
const tenantSchema = new mongoose.Schema({
  name: String,
  slug: String,
  plan: String
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Tenant = mongoose.model('Tenant', tenantSchema);
const User = mongoose.model('User', userSchema);

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Tenant.deleteMany({});
    await User.deleteMany({});

    // Create tenants
    const acmeTenant = await Tenant.create({
      name: 'Acme',
      slug: 'acme',
      plan: 'free'
    });

    const globexTenant = await Tenant.create({
      name: 'Globex',
      slug: 'globex',
      plan: 'free'
    });

    // Create users with hashed passwords
    const users = [
      {
        email: 'admin@acme.test',
        password: 'password',
        role: 'admin',
        tenant: acmeTenant._id
      },
      {
        email: 'user@acme.test',
        password: 'password',
        role: 'member',
        tenant: acmeTenant._id
      },
      {
        email: 'admin@globex.test',
        password: 'password',
        role: 'admin',
        tenant: globexTenant._id
      },
      {
        email: 'user@globex.test',
        password: 'password',
        role: 'member',
        tenant: globexTenant._id
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.email}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();