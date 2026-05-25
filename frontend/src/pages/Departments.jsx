import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ DepartementCode: '', DepartementName: '', GrossSalary: '', TotalDeduction: '' });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    const res = await axios.get('/api/departments', { withCredentials: true });
    setDepartments(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        GrossSalary: Number(form.GrossSalary),
        TotalDeduction: Number(form.TotalDeduction)
      };
      if (editing) {
        await axios.put(`/api/departments/${form.DepartementCode}`, payload, { withCredentials: true });
      } else {
        await axios.post('/api/departments', payload, { withCredentials: true });
      }
      resetForm();
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving department');
    }
  };

  const editDept = (d) => {
    setForm({
      DepartementCode: d.DepartementCode,
      DepartementName: d.DepartementName,
      GrossSalary: d.GrossSalary,
      TotalDeduction: d.TotalDeduction
    });
    setEditing(true);
  };

  const deleteDept = async (code) => {
    if (!confirm('Delete this department?')) return;
    await axios.delete(`/api/departments/${code}`, { withCredentials: true });
    fetchDepartments();
  };

  const resetForm = () => {
    setForm({ DepartementCode: '', DepartementName: '', GrossSalary: '', TotalDeduction: '' });
    setEditing(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Department Management</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit' : 'Add'} Department</h3>
          {error && <div className="bg-red-50 text-red-600 px-3 py-2 rounded mb-3 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" placeholder="Department Code" required
              value={form.DepartementCode}
              onChange={e => setForm({ ...form, DepartementCode: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
              disabled={editing} />
            <input type="text" placeholder="Department Name" required
              value={form.DepartementName}
              onChange={e => setForm({ ...form, DepartementName: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="number" placeholder="Gross Salary" required
              value={form.GrossSalary}
              onChange={e => setForm({ ...form, GrossSalary: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="number" placeholder="Total Deduction"
              value={form.TotalDeduction}
              onChange={e => setForm({ ...form, TotalDeduction: e.target.value })}
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
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Code</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Gross Salary</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Deduction</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Net</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {departments.map(d => (
                  <tr key={d.DepartementCode} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{d.DepartementCode}</td>
                    <td className="px-4 py-3">{d.DepartementName}</td>
                    <td className="px-4 py-3 text-right">{d.GrossSalary?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{d.TotalDeduction?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold">{(d.GrossSalary - d.TotalDeduction)?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => editDept(d)}
                        className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                      <button onClick={() => deleteDept(d.DepartementCode)}
                        className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                ))}
                {departments.length === 0 && (
                  <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-400">No departments yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
