const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const listEmployees = async (_, { page = 1, limit = 10, sortField = 'name', sortOrder = 'asc' }) => {
  const offset = (page - 1) * limit;
  const order = [[sortField, sortOrder.toUpperCase()]];

  return Employee.findAll({ offset, limit, order });
};

const getEmployee = async (_, { id }) => {
  return Employee.findByPk(id);
};

const addEmployee = async (_, { name, age, class: empClass, subjects, role, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const employee = await Employee.create({ name, age, class: empClass, subjects, role, password: hashedPassword });
  return employee;
};

const updateEmployee = async (_, { id, ...args }) => {
  const employee = await Employee.findByPk(id);
  if (!employee) throw new Error('Employee not found');

  await employee.update(args);
  return employee;
};

const login = async (_, { name, password }) => {
  const employee = await Employee.findOne({ where: { name } });
  if (!employee) throw new Error('User not found');

  const valid = await bcrypt.compare(password, employee.password);
  if (!valid) throw new Error('Invalid password');

  const token = jwt.sign({ id: employee.id, role: employee.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { token, employee };
};

module.exports = {
  Query: { listEmployees, getEmployee },
  Mutation: { addEmployee, updateEmployee, login },
};
