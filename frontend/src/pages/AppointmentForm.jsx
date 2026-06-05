import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const COUNTRY_CODES = [
  { name: 'Australia', code: '+61' },
  { name: 'Brazil', code: '+55' },
  { name: 'Canada', code: '+1' },
  { name: 'China', code: '+86' },
  { name: 'France', code: '+33' },
  { name: 'Germany', code: '+49' },
  { name: 'India', code: '+91' },
  { name: 'Italy', code: '+39' },
  { name: 'Japan', code: '+81' },
  { name: 'Mexico', code: '+52' },
  { name: 'New Zealand', code: '+64' },
  { name: 'Nigeria', code: '+234' },
  { name: 'Russia', code: '+7' },
  { name: 'Saudi Arabia', code: '+966' },
  { name: 'Singapore', code: '+65' },
  { name: 'South Africa', code: '+27' },
  { name: 'Spain', code: '+34' },
  { name: 'UAE', code: '+971' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'United States', code: '+1' }
];

export default function AppointmentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    countryCode: '+91',
    phone: '',
    appointmentTime: ''
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Submit appointment to backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation — appointment must be in the future
    if (new Date(formData.appointmentTime) <= new Date()) {
      setError('Appointment time must be in the future');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName.trim(),
          phone: `${formData.countryCode}${formData.phone}`,
          appointmentTime: new Date(formData.appointmentTime).toISOString()
        })
      });

      const data = await res.json();
      if (!data.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }

      navigate('/dashboard');
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[1000px] mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      
      {/* Left Side Typography / Visual offset */}
      <div className="text-white pr-8 hidden md:block">
        <div className="w-16 h-16 bg-white/20 rounded-2xl mb-8 flex items-center justify-center backdrop-blur-md shadow-lg border border-white/30">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <h1 className="text-5xl font-extrabold leading-[1.1] mb-6 drop-shadow-md tracking-tight">
          Schedule a New Appointment
        </h1>
        <p className="text-white/90 text-lg leading-relaxed font-medium">
          Enter the customer details below. The system will automatically queue and send a WhatsApp confirmation.
        </p>
      </div>

      {/* Right Side Form Card */}
      <div className="bg-white p-10 md:p-12 rounded-[var(--radius-card)] shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/5 rounded-bl-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-blue/10 rounded-tr-[100px] -z-10"></div>

        <h2 className="text-3xl font-extrabold text-dark-navy mb-2 tracking-tight">Book a Slot</h2>
        <p className="text-gray-500 mb-8 font-medium">Fill in the details below to schedule.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-dark-navy ml-1 uppercase tracking-wider">Customer Name</label>
            <input 
              type="text" 
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full p-4 bg-light-gray border-2 border-border-color rounded-[var(--radius-input)] text-dark-navy font-medium focus:outline-none focus:border-primary-blue focus:bg-white transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-dark-navy ml-1 uppercase tracking-wider">Phone Number (WhatsApp)</label>
            <div className="flex gap-3">
              <select 
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="w-40 p-4 bg-light-gray border-2 border-border-color rounded-[var(--radius-input)] text-dark-navy font-bold focus:outline-none focus:border-primary-blue focus:bg-white transition-all duration-300 cursor-pointer"
              >
                {COUNTRY_CODES.map(country => (
                  <option key={country.name} value={country.code}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="234 567 8900"
                required
                className="flex-1 p-4 bg-light-gray border-2 border-border-color rounded-[var(--radius-input)] text-dark-navy font-medium focus:outline-none focus:border-primary-blue focus:bg-white transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-dark-navy ml-1 uppercase tracking-wider">Appointment Time</label>
            <input 
              type="datetime-local" 
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
              className="w-full p-4 bg-light-gray border-2 border-border-color rounded-[var(--radius-input)] text-dark-navy font-medium focus:outline-none focus:border-primary-blue focus:bg-white transition-all duration-300"
            />
          </div>
          {error && (
            <p className="text-red-500 font-semibold text-sm bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-5 bg-dark-navy text-white rounded-[var(--radius-input)] font-extrabold uppercase tracking-widest hover:bg-primary-blue hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_20px_rgba(11,9,20,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  )
}
