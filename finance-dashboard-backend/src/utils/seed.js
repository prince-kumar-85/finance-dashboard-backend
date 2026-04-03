require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const FinancialRecord = require('../models/FinancialRecord');

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await FinancialRecord.deleteMany({});

    const passwordHash = await bcrypt.hash('Password@123', 10);

    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash,
        role: 'admin',
        status: 'active',
      },
      {
        name: 'Analyst User',
        email: 'analyst@example.com',
        passwordHash,
        role: 'analyst',
        status: 'active',
      },
      {
        name: 'Viewer User',
        email: 'viewer@example.com',
        passwordHash,
        role: 'viewer',
        status: 'active',
      },
    ]);

    const adminUser = users[0];

    await FinancialRecord.insertMany([
      {
        amount: 50000,
        type: 'income',
        category: 'Salary',
        date: new Date('2026-03-01'),
        notes: 'March salary',
        createdBy: adminUser._id,
      },
      {
        amount: 12000,
        type: 'expense',
        category: 'Rent',
        date: new Date('2026-03-02'),
        notes: 'Monthly rent',
        createdBy: adminUser._id,
      },
      {
        amount: 3000,
        type: 'expense',
        category: 'Food',
        date: new Date('2026-03-03'),
        notes: 'Groceries',
        createdBy: adminUser._id,
      },
      {
        amount: 8000,
        type: 'income',
        category: 'Freelance',
        date: new Date('2026-03-10'),
        notes: 'Project payment',
        createdBy: adminUser._id,
      },
      {
        amount: 2500,
        type: 'expense',
        category: 'Travel',
        date: new Date('2026-03-12'),
        notes: 'Cab and train',
        createdBy: adminUser._id,
      },
    ]);

    console.log('Seed data inserted successfully');
    console.log('Admin: admin@example.com / Password@123');
    console.log('Analyst: analyst@example.com / Password@123');
    console.log('Viewer: viewer@example.com / Password@123');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
