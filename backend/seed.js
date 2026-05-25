require('dotenv').config();
const mongoose = require('mongoose');
const Department = require('./models/Department');
const Employee = require('./models/Employee');
const Salary = require('./models/Salary');

const departments = [
  { DepartementCode: 'CW', DepartementName: 'Carwash', GrossSalary: 300000, TotalDeduction: 20000 },
  { DepartementCode: 'ST', DepartementName: 'Stock', GrossSalary: 200000, TotalDeduction: 5000 },
  { DepartementCode: 'MC', DepartementName: 'Mechanic', GrossSalary: 450000, TotalDeduction: 40000 },
  { DepartementCode: 'ADMS', DepartementName: 'Admin', GrossSalary: 600000, TotalDeduction: 70000 }
];

const employees = [
  { employeeNumber: 'EMP001', FirstName: 'John', LastName: 'Doe', Position: 'Washer', Address: '123 St', Telephone: '555-0101', Gender: 'Male', hiredDate: '2023-01-15', Department: 'CW' },
  { employeeNumber: 'EMP002', FirstName: 'Jane', LastName: 'Smith', Position: 'Clerk', Address: '456 Ave', Telephone: '555-0102', Gender: 'Female', hiredDate: '2023-02-20', Department: 'ST' },
  { employeeNumber: 'EMP003', FirstName: 'Mike', LastName: 'Johnson', Position: 'Mechanic', Address: '789 Rd', Telephone: '555-0103', Gender: 'Male', hiredDate: '2023-03-10', Department: 'MC' },
  { employeeNumber: 'EMP004', FirstName: 'Sarah', LastName: 'Williams', Position: 'Manager', Address: '321 Blvd', Telephone: '555-0104', Gender: 'Female', hiredDate: '2023-04-05', Department: 'ADMS' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped');

    await Department.insertMany(departments);
    console.log('Departments seeded');

    await Employee.insertMany(employees);
    console.log('Employees seeded');

    const salaries = employees.map(e => {
      const dept = departments.find(d => d.DepartementCode === e.Department);
      return {
        Employee: e.employeeNumber,
        GrossSalary: dept.GrossSalary,
        TotalDeduction: dept.TotalDeduction,
        NetSalary: dept.GrossSalary - dept.TotalDeduction,
        month: '2024-01'
      };
    });
    await Salary.insertMany(salaries);
    console.log('Salaries seeded');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
