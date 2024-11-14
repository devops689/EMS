
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Employee = sequelize.define('Employee', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subjects: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    attendance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    role: {
      type: DataTypes.ENUM('admin', 'employee'),
      defaultValue: 'employee',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  module.exports = Employee;