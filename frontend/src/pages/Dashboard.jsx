import React, { useState, useEffect, useCallback } from 'react'

const LIMIT = 10;

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filterName, setFilterName] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch appointments from backend
  const fetchAppointments = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (filterName) params.append('customerName', filterName);
      if (filterDate) params.append('date', filterDate);

      const res = await fetch(`/api/appointments?${params}`);
      const data = await res.json();

      if (!data.ok) {
        setError(data.message || 'Failed to fetch appointments');
        return;
      }

      setAppointments(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, [filterName, filterDate]);

  // Refetch on filter change
  useEffect(() => {
    fetchAppointments(1);
  }, [fetchAppointments]);

  // Page navigation
  const goToPage = (page) => {
    fetchAppointments(page);
  };

  return (
    <div className="max-w-[900px] mx-auto bg-white p-10 md:p-12 rounded-[var(--radius-card)] shadow-premium relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/5 rounded-bl-[200px] -z-10"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-dark-navy mb-2 tracking-tight">Live Dashboard</h1>
          <p className="text-gray-500 font-medium">Manage and track your upcoming appointments in real-time.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center bg-light-gray p-4 rounded-[var(--radius-input)] border-2 border-border-color">
          <input 
            type="text" 
            placeholder="Search Name..." 
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="px-4 py-2.5 rounded-[10px] border border-border-color font-medium focus:border-primary-blue focus:bg-white outline-none text-sm w-40 transition-colors"
          />
          <input 
            type="date" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2.5 rounded-[10px] border border-border-color font-medium focus:border-primary-blue focus:bg-white outline-none text-sm transition-colors"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-500 font-semibold text-sm bg-red-50 p-3 rounded-lg mb-6">{error}</p>
      )}

      <div className="flex flex-col gap-5">
        {loading ? (
          <div className="text-center py-16 text-gray-500 font-medium">Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-medium bg-light-gray rounded-[var(--radius-input)] border-2 border-dashed border-border-color">
            No appointments found matching your criteria.
          </div>
        ) : (
          appointments.map(appt => (
            <div key={appt._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-2 border-[#CBD5E1] shadow-sm rounded-[var(--radius-input)] hover:border-primary-blue hover:shadow-[0_10px_25px_rgba(59,96,228,0.15)] transition-all duration-300 bg-white group">
              <div className="flex flex-col">
                <h3 className="font-extrabold text-xl text-dark-navy group-hover:text-primary-blue transition-colors tracking-tight">{appt.customerName}</h3>
                <span className="text-sm font-semibold text-gray-500 mt-1">{appt.phone}</span>
                <div className="mt-3">
                  <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm ${appt.reminderSent ? 'bg-[#10B981] text-white' : 'bg-[#F59E0B] text-white'}`}>
                    {appt.reminderSent ? 'Reminder Sent' : 'Pending'}
                  </span>
                </div>
              </div>
              <div className="text-right flex flex-col items-end mt-4 sm:mt-0">
                <span className="font-extrabold text-2xl text-primary-blue tracking-tight">
                  {new Date(appt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-sm text-gray-600 font-bold uppercase tracking-wider mt-1">
                  {new Date(appt.appointmentTime).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination — only show if more than one page */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => goToPage(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-5 py-2.5 rounded-[10px] font-bold text-sm bg-dark-navy text-white hover:bg-primary-blue transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="font-bold text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => goToPage(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-5 py-2.5 rounded-[10px] font-bold text-sm bg-dark-navy text-white hover:bg-primary-blue transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
