import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    employeeNumber: '', FirstName: '', LastName: '', Position: '',
    Address: '', Telephone: '', Gender: 'Male', hiredDate: '', Department: ''
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
    axios.get('/api/departments', { withCredentials: true })
      .then(res => setDepartments(res.data))
      .catch(() => {});
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get('/api/employees', { withCredentials: true });
    setEmployees(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await axios.put(`/api/employees/${form.employeeNumber}`, form, { withCredentials: true });
      } else {
        await axios.post('/api/employees', form, { withCredentials: true });
      }
      resetForm();
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving employee');
    }
  };

  const editEmployee = (emp) => {
    setForm({
      employeeNumber: emp.employeeNumber,
      FirstName: emp.FirstName,
      LastName: emp.LastName,
      Position: emp.Position,
      Address: emp.Address || '',
      Telephone: emp.Telephone || '',
      Gender: emp.Gender,
      hiredDate: emp.hiredDate ? emp.hiredDate.split('T')[0] : '',
      Department: emp.Department
    });
    setEditing(true);
  };

  const deleteEmployee = async (empNo) => {
    if (!confirm('Delete this employee?')) return;
    await axios.delete(`/api/employees/${empNo}`, { withCredentials: true });
    fetchEmployees();
  };

  const resetForm = () => {
    setForm({
      employeeNumber: '', FirstName: '', LastName: '', Position: '',
      Address: '', Telephone: '', Gender: 'Male', hiredDate: '', Department: ''
    });
    setEditing(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Employee Management</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit' : 'Add'} Employee</h3>
          {error && <div className="bg-red-50 text-red-600 px-3 py-2 rounded mb-3 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" placeholder="Employee Number" required
              value={form.employeeNumber}
              onChange={e => setForm({ ...form, employeeNumber: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
              disabled={editing} />
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="First Name" required
                value={form.FirstName}
                onChange={e => setForm({ ...form, FirstName: e.target.value })}
                className="px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Last Name" required
                value={form.LastName}
                onChange={e => setForm({ ...form, LastName: e.target.value })}
                className="px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <input type="text" placeholder="Position" required
              value={form.Position}
              onChange={e => setForm({ ...form, Position: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Address"
              value={form.Address}
              onChange={e => setForm({ ...form, Address: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Telephone"
                value={form.Telephone}
                onChange={e => setForm({ ...form, Telephone: e.target.value })}
                className="px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <select value={form.Gender}
                onChange={e => setForm({ ...form, Gender: e.target.value })}
                className="px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <input type="date" required
              value={form.hiredDate}
              onChange={e => setForm({ ...form, hiredDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={form.Department} required
              onChange={e => setForm({ ...form, Department: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Department</option>
              {departments.map(d => (
                <option key={d.DepartementCode} value={d.DepartementCode}>{d.DepartementCode} - {d.DepartementName}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-800 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-900">
                {editing ? 'Update' : 'Save'}
              </button>
              {editing && (
                <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Emp#</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Position</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Dept</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Gender</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Hired</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {employees.map(emp => (
                  <tr key={emp.employeeNumber} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{emp.employeeNumber}</td>
                    <td className="px-4 py-3">{emp.FirstName} {emp.LastName}</td>
                    <td className="px-4 py-3">{emp.Position}</td>
                    <td className="px-4 py-3">{emp.Department}</td>
                    <td className="px-4 py-3">{emp.Gender}</td>
                    <td className="px-4 py-3">{emp.hiredDate?.split('T')[0]}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => editEmployee(emp)}
                        className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                      <button onClick={() => deleteEmployee(emp.employeeNumber)}
                        className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-400">No employees yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
