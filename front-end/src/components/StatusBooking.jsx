import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import './statusbooking.css';
import {QRCodeCanvas} from 'qrcode.react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { FaSearch, FaEdit, FaArrowLeft } from "react-icons/fa";


export default function StatusBooking(){
  const [noreg, setNoreg] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newSession, setNewSession] = useState('');
  const [sessions, setSessions] = useState([
    { time: '08:30 - 10:00', available: true },
    { time: '10:00 - 11:30', available: true },
    { time: '13:00 - 14:30', available: true },
    { time: '14:30 - 16:00', available: true },
  ]);

  const navigate = useNavigate(); 
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (newDate) {
      setLoading(true);
      axios.get(`https://backendbooking-production.up.railway.app/api/slots?date=${newDate}&department=${encodeURIComponent(bookingData.department)}`).then((res) => {
        const updatedSessions = sessions.map((session) => ({
          ...session,
          available: res.data[session.time]?.available || false,
          departAvailable: res.data[session.time]?.deptRemaining > 0 // Jika slot tersedia, sesi tetap aktif
        }));
        // console.log(date,"===> ini tanggal");
        // console.log(department,"===> ini tanggal");
        
        setSessions(updatedSessions);
        setLoading(false);
        // console.log(updatedSessions, "==> ini updated session");
      });
    }
  }, [newDate]);


  const handleCancelEdit = () => {
    setNewDate(''); 
    setNewSession(''); 
    setIsEditing(false); 
  };
  const handleCheckStatus = async () => {
    if (!noreg) {
      toast.error('Harap masukkan Noreg!');
      return;
    }
    // console.log(`https://backendbooking-production.up.railway.app/api/check-status?employeeId=${noreg}`, "ini noreg!");
    
    setLoading(true);
    setBookingData(null);

    // axios.get(`https://backendbooking-production.up.railway.app/api/check-status?employeeId=${noreg}`)
    try {
      const res = await axios.get(`https://backendbooking-production.up.railway.app/api/check-status?employeeId=${noreg}`);
      console.log(res.data);
      setBookingData(res.data);
    } catch (err) {
      setBookingData(null);
      toast.error(err.response?.data?.message || 'Data booking tidak ditemukan.');
    }

    setLoading(false);
  };

  const handleUpdateDate = async () => {
    if (!newDate || !newSession) {
      toast.error("Pilih tanggal dan sesi baru terlebih dahulu!");
      return;
    }

    await axios.put("https://backendbooking-production.up.railway.app/api/update-booking-date", {
      employeeId: bookingData.employeeId,
      newDate: newDate,
      newSession: newSession
    })
    .then((res) => {
      toast.success(res.data.message);
      setBookingData((prevData) => ({ ...prevData, date: newDate }));
      setNewDate(''); 
      setNewSession(''); 
      setIsEditing(false);
    })
    .catch((err) => {
      console.error("🔥 Error update:", err);
      toast.error("Gagal memperbarui tanggal booking.");
    });
  };

  return (
    // <div className="container mt-5">
    //   <div className="row justify-content-center">
    //     <div className="col-lg-6 col-md-8 col-sm-12">
    //       <div className="card shadow-lg">
    //         <div className="card-body">
    //           <h3 className="card-title text-center mb-4">Cek Status Booking</h3>
              
    //           <input
    //             type="text"
    //             placeholder="Masukkan Noreg"
    //             value={noreg}
    //             onChange={(e) => setNoreg(e.target.value)}
    //             className="form-control mb-3"
    //           />
    //           <button onClick={handleCheckStatus} className="btn btn-primary w-100" disabled={loading}>
    //             {loading ? 'Mengecek...' : 'Cek Status'}
    //           </button>

    //           {bookingData ? (
    //             <div className="mt-4 p-3 border rounded">
    //               <h5>Status Booking</h5>
    //               <p><strong>Nama:</strong> {bookingData.name}</p>
    //               <p><strong>Divisi:</strong> {bookingData.division}</p>
    //               <p><strong>Departemen:</strong> {bookingData.department}</p>
    //               <p><strong>Tanggal:</strong> {bookingData.date}</p>
    //               <p><strong>Sesi:</strong> {bookingData.session}</p>

    //               {/* Tombol Edit Tanggal */}
    //               {!isEditing ? (
    //                 <button onClick={() => setIsEditing(true)} className="btn btn-warning mt-2">
    //                   Edit Tanggal Booking
    //                 </button>
    //               ) : (
    //                 <div className="mt-3">
    //                   <input
    //                     type="date"
    //                     value={newDate}
    //                     onChange={(e) => setNewDate(e.target.value)}
    //                     className="form-control mb-2"
    //                     required
    //                     min={new Date().toISOString().split("T")[0]}
    //                   />
    //                     {newDate && !loading && (
    //                       <div className="sessions">                            
    //                         {sessions.map((session) => (
    //                           <button
    //                             key={session.time}
    //                             disabled={!session.available}
    //                             className={newSession === session.time ? 'selected' : ''}
    //                             onClick={() => setNewSession(session.time)}
    //                           >
    //                             {session.time} {session.available ? '' : (session.departAvailable? '(Full)' : '(Dept. Full)' ) }
    //                           </button>
    //                         ))}
    //                       </div>
    //                     )}
    //                   <div className="d-flex gap-2">
    //                     <button onClick={handleUpdateDate} className="btn btn-success">Submit</button>
    //                     <button onClick={handleCancelEdit} className="btn btn-secondary">Cancel</button>
    //                   </div>
    //                 </div>
    //               )}
    //             </div>
    //           ) : null}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="container mt-5">
      <button className="btn btn-light mb-3 d-flex align-items-center" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" /> Kembali
      </button>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="card shadow-lg p-4">
            <h3 className="text-center mb-4">Cek Status Booking</h3>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control p-2 m-0"
                placeholder="Masukkan Noreg"
                value={noreg}
                onChange={(e) => setNoreg(e.target.value)}
              />
              <button 
                    className="btn btn-warning d-flex align-items-center px-3" 
                    onClick={handleCheckStatus} 
                    disabled={loading}
                    style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
                >
                    <FaSearch className="me-2" /> {loading ? "Mengecek..." : "Cek Status"}
                </button>
            </div>

            {bookingData && (
              <div className="border rounded p-3 position-relative">
                {/* QR Code di kanan atas */}
                <div className="position-absolute end-0 me-3 mt-3">
                  <QRCodeCanvas value={bookingData.employeeId} size={80} />
                </div>

                <h5 className="mb-3" style={{fontWeight: "bold", color: "gold"}}>Status Booking</h5>
                <p><strong>Nama:</strong> {bookingData.name}</p>
                <p><strong>Divisi:</strong> {bookingData.division}</p>
                <p><strong>Departemen:</strong> {bookingData.department}</p>

                <div className="d-flex justify-content-between align-items-center">
                  <p><strong>Tanggal:</strong> {bookingData.date}</p>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setIsEditing(true)} disabled={bookingData.date < today}>
                    <FaEdit />
                  </button>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <p><strong>Sesi:</strong> {bookingData.session}</p>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setIsEditing(true)} disabled={bookingData.date < today}>
                    <FaEdit />
                  </button>
                </div>

                {bookingData.date < today && (
                <p className="text-danger fw-bold mt-2">⚠️ Booking sudah lewat dan tidak dapat diubah! Silahkan hubungi panitia.</p>
                )}

                {isEditing && (
                  <div className="mt-3">
                    <label className="form-label">Pilih Tanggal Baru:</label>
                    <input
                      type="date"
                      className="form-control mb-2"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />

                    {newDate && (
                      <>
                        <label className="form-label">Pilih Sesi:</label>
                        <div className="d-flex gap-2">
                          {["Pagi", "Siang", "Sore"].map((session) => (
                            <button
                              key={session}
                              className={`btn ${newSession === session ? "btn-primary" : "btn-outline-secondary"}`}
                              onClick={() => setNewSession(session)}
                            >
                              {session}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-success" onClick={handleUpdateDate}>Submit</button>
                      <button className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}