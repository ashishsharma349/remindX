import React, { useState, useEffect } from 'react'

const DUMMY_DATA = [
  { id: 1, customerName: 'Alice Smith', phone: '+1234567890', appointmentTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(), reminderSent: false },
  { id: 2, customerName: 'Bob Johnson', phone: '+1987654321', appointmentTime: new Date(Date.now() + 1000 * 60 * 120).toISOString(), reminderSent: false },
  { id: 3, customerName: 'Charlie Brown', phone: '+1122334455', appointmentTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), reminderSent: true },
];

export default function Dashboard() {
  const [appointments, setAppointments] = useState(DUMMY_DATA);
  const [filterName, setFilterName] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [withinOneHour, setWithinOneHour] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Polling backend for new appointments...");
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredAppointments = appointments.filter(appt => {
    const apptDate = new Date(appt.appointmentTime);
    const now = new Date();
    
    if (filterName && !appt.customerName.toLowerCase().includes(filterName.toLowerCase())) return false;
    if (filterDate) {
      const selectedDate = new Date(filterDate).toDateString();
      if (apptDate.toDateString() !== selectedDate) return false;
    }
    if (withinOneHour) {
      const diffMs = apptDate - now;
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 0 || diffMins > 60) return false;
    }
    return true;
  });

  return (
    <div className="max-w-[900px] mx-auto bg-white p-10 md:p-12 rounded-[var(--radius-card)] shadow-premium relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/5 rounded-bl-[200px] -z-10"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-dark-navy mb-2 tracking-tight">Live Dashboard</h1>
          <p className="text-gray-500 font-medium">Manage and track your upcoming appointments in real-time.</p>
        </div>
        
        {/* Filters */}
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
          <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-dark-navy cursor-pointer ml-2">
            <input 
              type="checkbox" 
              checked={withinOneHour}
              onChange={(e) => setWithinOneHour(e.target.checked)}
              className="w-5 h-5 accent-primary-blue rounded"
            />
            &lt; 1 Hour
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-medium bg-light-gray rounded-[var(--radius-input)] border-2 border-dashed border-border-color">
            No appointments found matching your criteria.
          </div>
        ) : (
          filteredAppointments.map(appt => (
            <div key={appt.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-2 border-[#CBD5E1] shadow-sm rounded-[var(--radius-input)] hover:border-primary-blue hover:shadow-[0_10px_25px_rgba(59,96,228,0.15)] transition-all duration-300 bg-white group">
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
    </div>
  )
}
