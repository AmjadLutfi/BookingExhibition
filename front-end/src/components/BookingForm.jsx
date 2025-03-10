import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingForm = () => {
  const [date, setDate] = useState('');
  const [sessions, setSessions] = useState([
    { time: '08:30 - 10:00', available: true },
    { time: '10:00 - 11:30', available: true },
    { time: '13:00 - 14:30', available: true },
    { time: '14:30 - 16:00', available: true },
  ]);
  const [selectedSession, setSelectedSession] = useState('');
  const [form, setForm] = useState({ employeeId: '', name: '', email: '' });

  // Fetch ketersediaan sesi ketika tanggal dipilih
  useEffect(() => {
    if (date) {
      axios.get(`http://localhost:5000/api/slots?date=${date}`).then((res) => {
        const updatedSessions = sessions.map((session) => ({
          ...session,
          available: res.data[session.time] > 0, // Jika slot tersedia, sesi tetap aktif
        }));
        setSessions(updatedSessions);
        console.log(updatedSessions, "==> ini updated session");
      });
    }
  }, [date]);

  const isFormValid = date && selectedSession && form.employeeId && form.name && form.email;

  // Fungsi untuk menangani submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
        toast.error('Harap isi semua field sebelum submit.');
        return;
      }
  
    // if (!selectedSession) {
    //   toast.error('Harap pilih sesi terlebih dahulu.');
    //   return;
    // }

    try {
      await axios.post('http://localhost:5000/api/book', {
        ...form,
        date,
        session: selectedSession,
      });
      toast.success('Booking berhasil! Silakan cek email Anda.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan.');
    }
  };

  return (
    <div className="booking-container">
      <h2>TMMIN Quality Exhibition 2025</h2>

      {/* Input Tanggal */}
      <label>Pilih Tanggal:</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required/>

      {/* Pilihan Sesi */}
      {date && (
        <div className="sessions">
          <h3>Pilih Sesi:</h3>
          {sessions.map((session) => (
            <button
              key={session.time}
              disabled={!session.available}
              className={selectedSession === session.time ? 'selected' : ''}
              onClick={() => setSelectedSession(session.time)}
            >
              {session.time} {session.available ? '' : '(Penuh)'}
            </button>
          ))}
        </div>
      )}

      {/* Form Input User */}
      {selectedSession && (
        <div className="user-form">
          <input type="text" placeholder="Nomor Karyawan" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
          <input type="text" placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <button onClick={handleSubmit} disabled={!isFormValid}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
