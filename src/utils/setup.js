const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee'); // Ensure this path matches where Employee is defined
const jwt = require('jsonwebtoken');


const createInitialAdmin = async () => {
  const existingAdmin = await Employee.findOne({ where: { role: 'admin' } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin', 10); // Set a secure password

    const adminUser = await Employee.create({
      name: 'Admin',
      age: 30,
      class: 'Management',
      subjects: ['Admin'],
      attendance: 100,
      role: 'admin',
      password: hashedPassword,
    });

    console.log('Initial admin created with username: Admin and password: admin');

    // Generate JWT token for the new admin user
    const token = jwt.sign({ id: adminUser.id, role: adminUser.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log('Admin JWT token:', token); // Log the token for immediate use
  } else {
    console.log('Admin user already exists');
  }
};

module.exports = createInitialAdmin;
