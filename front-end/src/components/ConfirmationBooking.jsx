import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import './confirmationbooking.css';
import {QRCodeCanvas} from 'qrcode.react';


export default function ConfirmatioBooking(){
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) return <div className="error-message">Data tidak ditemukan!</div>;

    return(
        <>
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-10 col-md-12 col-sm-12">
                    <div className="card shadow-lg">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Konfirmasi Booking</h3>
                            <h2 className="success-title">🎉 Selamat! Booking Anda Berhasil 🎉</h2>
                            
                            {/* <p>Nama: {state.name}</p>
                            <p>Noreg: {state.employeeId}</p>
                            <p>Divisi: {state.division}</p>
                            <p>Departemen: {state.department}</p>
                            <p>Tanggal: {state.date}</p>
                            <p>Waktu: {state.selectedSession}</p>
                            <QRCodeCanvas value={`${state.employeeId}`} />
                            <button onClick={() => navigate('/')}>Kembali ke Home</button> */}
                            <div className="booking-content">
                                {/* QR Code di kiri */}
                                <div className="qr-container">
                                    <QRCodeCanvas value={`${state.employeeId}`} size={180} />
                                </div>

                                {/* Informasi booking di kanan */}
                                <div className="booking-details">
                                    <p><strong>Nama:</strong> {state.name}</p>
                                    <p><strong>Noreg:</strong> {state.employeeId}</p>
                                    <p><strong>Divisi:</strong> {state.division}</p>
                                    <p><strong>Departemen:</strong> {state.department}</p>
                                    <p><strong>Tanggal:</strong> {state.date}</p>
                                    <p><strong>Waktu:</strong> {state.selectedSession}</p>
                                </div>
                            </div>
                            <br />
                            <p className="note">Screenshoot bukti booking ini atau simpan barcode diatas <br /> Dan bawalah bukti booking diatas pada saat exhibition !</p>
                            {/* Tombol kembali */}
                            <button className="btn-back" onClick={() => navigate("/booking")}>
                                ⬅ Selesai
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
        </>
    )
}