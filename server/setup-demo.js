const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const usersFile = path.join(__dirname, 'data/users.json');
const JWT_SECRET = 'women-safety-guardian-secret-key-2024';

async function createDemoUsers() {
  try {
    const data = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    
    const policeExists = data.users.find(u => u.email === 'police@guardian.com');
    const userExists = data.users.find(u => u.email === 'user@guardian.com');

    if (!policeExists) {
      const hashedPassword = await bcrypt.hash('police123', 10);
      data.users.push({
        id: uuidv4(),
        name: 'Police Officer',
        email: 'police@guardian.com',
        password: hashedPassword,
        role: 'police',
        createdAt: new Date().toISOString()
      });
      console.log('✅ Police account created');
    } else {
      console.log('ℹ️  Police account already exists');
    }

    if (!userExists) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      data.users.push({
        id: uuidv4(),
        name: 'Test User',
        email: 'user@guardian.com',
        password: hashedPassword,
        role: 'user',
        createdAt: new Date().toISOString()
      });
      console.log('✅ User account created');
    } else {
      console.log('ℹ️  User account already exists');
    }

    fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
    console.log('🎉 Demo users setup complete!');

  } catch (error) {
    console.error('❌ Error creating demo users:', error);
  }
}

createDemoUsers();
