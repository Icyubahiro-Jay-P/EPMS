import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Salaries() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ Employee: '', GrossSalary: '', TotalDeduction: '', NetSalary: '', month: '' });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSalaries();
    axios.get('/api/employees', { withCredentials: true })
      .then(res => setEmployees(res.data))
      .catch(() => {});
  }, []);

  const fetchSalaries = async () => {
    const res = await axios.get('/api/salaries', { withCredentials: true });
    setSalaries(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        GrossSalary: Number(form.GrossSalary),
        TotalDeduction: Number(form.TotalDeduction),
        NetSalary: Number(form.GrossSalary) - Number(form.TotalDeduction)
      };
      if (editing) {
        await axios.put(`/api/salaries/${editing}`, payload, { withCredentials: true });
      } else {
        await axios.post('/api/salaries', payload, { withCredentials: true });
      }
      resetForm();
      fetchSalaries();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving salary');
    }
  };

  const editSalary = (s) => {
    setForm({
      Employee: s.Employee,
      GrossSalary: s.GrossSalary,
      TotalDeduction: s.TotalDeduction,
      NetSalary: s.NetSalary,
      month: s.month
    });
    setEditing(s._id);
  };

  const deleteSalary = async (id) => {
    if (!confirm('Delete this salary record?')) return;
    await axios.delete(`/api/salaries/${id}`, { withCredentials: true });
    fetchSalaries();
  };

  const resetForm = () => {
    setForm({ Employee: '', GrossSalary: '', TotalDeduction: '', NetSalary: '', month: '' });
    setEditing(null);
  };

  const handleEmployeeChange = (empNo) => {
    const emp = employees.find(e => e.employeeNumber === empNo);
    setForm(prev => ({
      ...prev,
      Employee: empNo,
      GrossSalary: emp ? '' : prev.GrossSalary,
      TotalDeduction: emp ? '' : prev.TotalDeduction
    }));
  };

  const empName = (empNo) => {
    const e = employees.find(emp => emp.employeeNumber === empNo);
    return e ? `${e.FirstName} ${e.LastName}` : empNo;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Salary Management</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit' : 'Add'} Salary</h3>
          {error && <div className="bg-red-50 text-red-600 px-3 py-2 rounded mb-3 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <select value={form.Employee} required
              onChange={e => handleEmployeeChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Employee</option>
              {employees.map(e => (
                <option key={e.employeeNumber} value={e.employeeNumber}>
                  {e.employeeNumber} - {e.FirstName} {e.LastName}
                </option>
              ))}
            </select>
            <input type="number" placeholder="Gross Salary" required
              value={form.GrossSalary}
              onChange={e => setForm({ ...form, GrossSalary: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="number" placeholder="Total Deduction"
              value={form.TotalDeduction}
              onChange={e => setForm({ ...form, TotalDeduction: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="bg-gray-50 px-3 py-2 rounded-md text-sm">
              <span className="text-gray-600">Net Salary: </span>
              <span className="font-bold text-blue-800">
                {(Number(form.GrossSalary) - Number(form.TotalDeduction || 0)).toLocaleString()}
              </span>
            </div>
            <input type="month" required
              value={form.month}
              onChange={e => setForm({ ...form, month: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" />
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
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Employee</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Gross</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Deduction</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Net</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">Month</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {salaries.map(s => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{empName(s.Employee)}</td>
                    <td className="px-4 py-3 text-right">{s.GrossSalary?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{s.TotalDeduction?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold">{s.NetSalary?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">{s.month}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => editSalary(s)}
                        className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                      <button onClick={() => deleteSalary(s._id)}
                        className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                ))}
                {salaries.length === 0 && (
                  <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-400">No salary records yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
