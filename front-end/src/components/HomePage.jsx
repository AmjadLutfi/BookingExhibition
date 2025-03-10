import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import './homepage.css'


export default function HomePage(){
    const navigate = useNavigate();

    return(
        <>
            <div className="parallax">
                <div className="content">
                    <h1 className="animate__animated animate__fadeInDown">TMMIN Quality Exhibition 2025</h1>
                    <p className="animate__animated animate__fadeInUp animate__delay-1s">Customer First, Quality First</p>
                    <button onClick={() => navigate("/booking")} className="btn btn-primary btn-lg animate__animated animate__bounceIn animate__delay-2s">Booking Now</button>
                </div>
            </div>
        </>
    )
}