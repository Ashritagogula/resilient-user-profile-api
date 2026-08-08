const User = require('../models/User');

const seedDatabase = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('Seeding database with initial data...');
      await User.insertMany([
        { name: 'Alice Smith', email: 'alice@example.com' },
        { name: 'Bob Johnson', email: 'bob@example.com' },
        { name: 'Charlie Davis', email: 'charlie@example.com' }
      ]);
      console.log('Database seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

module.exports = seedDatabase;
