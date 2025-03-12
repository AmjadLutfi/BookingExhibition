import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './bookingform.css'


const divisionsData = {
  "APPD": ["-", "Assy & Painting Maintenance Dept", "Assy Production #1 & PIO Dept", "Painting Production #2 Dept", "Quality Inspection 1 Dept", "Assy Production #2 Dept", "Painting Production #1 Dept", "Quality Inspection 2 Dept", "Assy & Painting Eng. Service Dept"],
  "CC": ["-", "Future Skill Development"],
  "CPLO": ["-", "Legal Office Dept", "Corporate Comm & Secretary Dept", "Strategic Planning & Alignment Dept"],
  "EAD": ["-", "Government Facility & Admin. Dept", "Corporate Public Relations Dept", "Government Strategic Planning Dept", "Corporate Social Responsibility Dept", "Rep. to Association & Ext. Party Dept"],
  "EPK3D": ["-", "Engineering Service Dept", "Production Dept", "Maintenance Dept", "(C)(M)(K) Quality Dept"],
  "EPSD": ["-", "Casting Production Dept", "TR Production Dept", "Maintenance Dept", "TR Engineering Service Dept", "Casting Engineering Service Dept", "Quality Control Dept"],
  "FD": ["-", "Accounting & Tax Planning Dept", "Profit & Cost Kaizen Dept", "Cost Planning & Asset Management Dept", "Financial Control Dept"],
  "GAD": ["-", "General Procurement Dept", "Toyota ID Management Service Dept", "General Affairs Administration Dept", "Office Facility & Eng. Service Dept", "Security Operation Sunter & KRW Dept"],
  "HRD": ["-", "Human Capital Strategic Management Dept", "People Development & Data Con.Dept", "IR & Employee Wellbeing Dept", "Company Doctor", "Talent Mgmnt & People Analytics Dept", "Employee Services Transformation Dept", "Employee Cooperative"],
  "IA": ["-", "Internal Audit"],
  "ISTD": ["-", "Compact & Intelligent Office Dept", "Smart & Connected Mfg. System Dept", "Infra-Security & Standardization Dept", "New Business & Workstyle Dept", "Smart & Seamless Logistic Dept"],
  "OMDD": ["-", "Manufacturing Support Dept", "Tier-1 & Tier-2 Supp Operation Dept", "TPS Promotion & People Dev't Dept", "Non Manufacturing Support Dept"],
  "PAD": ["-", "PPIC & Warehouse Dept", "Smart Plant Facility Manufacturing Dept", "PGA & SHE Dept", "Logistic Operation Vehicle Plant Dept", "Logistics Operation Unit Plant Dept", "TPS Group, Prod. & Shopfloor Dev. Dept", "Plant Mgt. & DMCI Dept"],
  "PBMD": ["-", "UIO Refurbishment & Conversion Dept", "Pricing Mgmt, Business Plan, Export Dept", "Value Chain (MLM & Acc) Dept"],
  "PBOD": ["-", "Engineering, Maintenance & Quality Dept", "Procurement & Logistic Operation Dept", "KRW Packing Operation Dept", "STR Packing Operation Dept", "Warehouse Managemenet Dept", "Export Admin. & Logistic Plan Dept", "S/P Procurement Dept"],
  "PCD": ["-", "Project Planning & Management Dept", "Unit & Part Supply Management Dept", "Production & Sourcing Planning Dept", "Vehicle Supply Management Dept", "Business Opr & Startegic Planning Dept"],
  "PED": ["-", "Tooling Business Dept", "Press Production Engineering Dept", "Tooling Production Dept", "Safety & Health Dept", "Body & Frame Production Eng. Dept", "Jig Development Dept", "Assy Production Engineering Dept", "Environment Dept", "Utility & Plant Building Eng. Dept", "Manufacturing Transformation Dept", "Painting Production Engineering Dept"],
  "PUD": ["-", "Best Cost Component #1 Dept", "Supplier Performance & Development Dept", "Best Cost Component #2 Dept", "Facility, Consumable & Material Dept", "Project & Cost Competitiveness Dept", "Strategic Operation Management Dept", "Purchasing Part Engineering Dept"],
  "PWPD": ["-", "Body Production & Insp P#2 Dept", "Press & Weld Engineering Service Dept", "Body Production & Insp P#1 Dept", "Press Production Karawang Dept", "Press Welding Maintenance & Workshop Dep", "Frame Production Dept", "Press Production Sunter Dept"],
  "QD": ["-", "Quality Planning Dept", "Vehicle & Process Audit Dept", "Material Assurance & Quality Imprv. Dept", "Customer Quality Engineering Dept", "Manufacturing Quality Development Dept", "Part-Vehicle Quality Eng & Pjt Dept"],
  "SPCEFBO": ["-"],
  "TGAO": ["-", "Technical Regulation No.1", "Technical Regulation No.2", "Technical Regulation No.3"],
  "TIA": ["-", "Toyota Learning Center", "AKTI Program Study Development Dept", "TIA Strategic Mgmt & Student Services"],
  "VPLD": ["-", "Regulation, Facility & Compliance Dept", "Export Vehicle & Cost Management Dept", "Export Import Part Dept", "Planning Dept", "External Logistic Management Dept"],
  "-": ["-", "Compliance & ESG"]
};

const BookingForm = () => {
  const [division, setDivision] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [date, setDate] = useState('');
  const [sessions, setSessions] = useState([
    { time: '08:30 - 10:00', available: true },
    { time: '10:00 - 11:30', available: true },
    { time: '13:00 - 14:30', available: true },
    { time: '14:30 - 16:00', available: true },
  ]);
  const [selectedSession, setSelectedSession] = useState('');
  const [form, setForm] = useState({ employeeId: '', name: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (division) {
      setDepartments(divisionsData[division] || []);
      setDepartment('');
    }
  }, [division]);

  // Fetch ketersediaan sesi ketika tanggal dipilih
  useEffect(() => {
    if (date && department) {
      setLoading(true);
      axios.get(`https://backendbooking-production.up.railway.app/api/slots?date=${date}&department=${encodeURIComponent(department)}`).then((res) => {
        const updatedSessions = sessions.map((session) => ({
          ...session,
          available: res.data[session.time]?.available || false,
          departAvailable: res.data[session.time]?.deptRemaining > 0 // Jika slot tersedia, sesi tetap aktif
        }));
        // console.log(date,"===> ini tanggal");
        // console.log(department,"===> ini tanggal");
        
        setSessions(updatedSessions);
        setLoading(false);
        console.log(updatedSessions, "==> ini updated session");
      });
    }
  }, [date, department]);

  // useEffect(() => {
  //   // Perbarui validasi form setiap kali form atau session berubah
  //   // console.log(isFormValid,"ini isform");
  //   setIsFormValid(
  //     form.employeeId.trim() !== '' &&
  //     form.name.trim() !== '' &&
  //     form.email.trim() !== '' &&
  //     selectedSession !== ''
  //   );
  // }, [form, selectedSession]);

  const isFormValid = division && department && date && selectedSession && form.employeeId &&  form.employeeId.length > 6 && form.name ;

  // Fungsi untuk menangani submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(isFormValid,"ini isform");
    

     if (!isFormValid) {
      console.log("Error nyaa dsasdas");
      toast.error('Harap isi semua field dengan benar sebelum submit!');
      return;
    };
  
    // if (!selectedSession) {
    //   toast.error('Harap pilih sesi terlebih dahulu.');
    //   return;
    // }

    try {
      await axios.post('https://backendbooking-production.up.railway.app/api/book', {
        ...form,
        division,
        department,
        date,
        session: selectedSession,
      });
      toast.success('Booking berhasil! Jangan Lupa untuk Screenshoot atau simpan Bukti Booking Anda!');
      // setTimeout(() => navigate("/"), 2000);
      const bookingData = { division, department, date, selectedSession, ...form };
      setTimeout(() => navigate('/confirmbooking', { state: bookingData }), 1000);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan.');
    }
  };

  return (
    <>
    <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-lg-10 col-md-12 col-sm-12">
                <div className="card shadow-lg">
                    <div className="card-body">
                        <h3 className="card-title text-center mb-4">TMMIN Quality Exhibition 2025</h3>

                        {/* Pilihan Divisi */}
                        <label>Pilih Divisi:</label>
                        <select value={division} onChange={(e) => setDivision(e.target.value)}>
                          <option value="">-- Pilih Divisi --</option>
                          {Object.keys(divisionsData).map((div) => (
                            <option key={div} value={div}>{div}</option>
                          ))}
                        </select>

                        {/* Pilihan Departemen */}
                        {division && (
                          <>
                            <label>Pilih Departemen:</label>
                            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                              <option value="">-- Pilih Departemen --</option>
                              {departments.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                              ))}
                            </select>
                          </>
                        )}

                        {/* Input Tanggal */}
                        {department && (
                          <>
                            <label>Pilih Tanggal:</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                            min={new Date().toISOString().split("T")[0]}
                            />
                          </>
                        )}


                        <p className="note1">Silakan pilih sesi yang tersedia (sesi yang penuh akan berwarna abu-abu) <br /> Kuota Setiap Department persesi Maksimal 3 Orang </p> 
                        {/* Pilihan Sesi */}
                        {date && !loading && (
                          <div className="sessions">                            
                            {sessions.map((session) => (
                              <button
                                key={session.time}
                                disabled={!session.available}
                                className={selectedSession === session.time ? 'selected' : ''}
                                onClick={() => setSelectedSession(session.time)}
                              >
                                {session.time} {session.available ? '' : (session.departAvailable? '(Full)' : '(Dept. Full)' ) }
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Form Input User */}
                        {selectedSession && (
                          <div className="user-form">
                            <p className="note">Pastikan Noreg yang dimasukkan benar (minimal 7 digit, ex: 0212345)</p>
                            <input type="text" placeholder="Noreg" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} 
                            className={form.employeeId.length > 0 && form.employeeId.length < 7 ? "input-error" : ""} />
                            {form.employeeId.length > 0 && form.employeeId.length < 7 && (
                            <p className="error-message">Noreg harus minimal 7 digit!</p>)}
                            <input type="text" placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            {/* <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            <p className="note">Masukkan email pribadi/gmail, agar dapat menerima konfirmasi booking! <br></br> Cek email anda dan bawalah QRCode yang dikirim pada saat exhibition</p> */}
                            <button onClick={handleSubmit}>Submit</button>
                          </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div> 
    </>

  );
};

export default BookingForm;
