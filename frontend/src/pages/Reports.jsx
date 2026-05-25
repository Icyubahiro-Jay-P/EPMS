import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Reports() {
  const [report, setReport] = useState([]);
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async (selectedMonth) => {
    setLoading(true);
    try {
      const params = selectedMonth ? { month: selectedMonth } : {};
      const res = await axios.get('/api/salaries/report', { params, withCredentials: true });
      setReport(res.data);
    } catch {
      setReport([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchReport(month);
  };

  const totalNet = report.reduce((sum, r) => sum + r.NetSalary, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Payroll Report</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleFilter} className="flex items-end gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Month</label>
            <input type="month" value={month}
              onChange={e => setMonth(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-900">
            Filter
          </button>
          {month && (
            <button type="button" onClick={() => { setMonth(''); fetchReport(''); }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400">
              Clear
            </button>
          )}
        </form>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">First Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Last Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Position</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Department</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Net Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {report.map((r, i) => (
                  <tr key={r._id || i} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{r.FirstName}</td>
                    <td className="px-4 py-3">{r.LastName}</td>
                    <td className="px-4 py-3">{r.Position}</td>
                    <td className="px-4 py-3">{r.Department}</td>
                    <td className="px-4 py-3 text-right font-semibold">{r.NetSalary?.toLocaleString()}</td>
                  </tr>
                ))}
                {report.length === 0 && (
                  <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-400">No salary records found</td></tr>
                )}
              </tbody>
              {report.length > 0 && (
                <tfoot className="bg-gray-100 font-bold">
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-right">Total:</td>
                    <td className="px-4 py-3 text-right">{totalNet.toLocaleString()}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
