import React from "react";
import './UnAuthorized.css'
import unauthorized from  '../assets/images/error.png'
export default function UnAuthorized() {
    return (
        <section className="page_404">
            <div className="page_404-container">

                <div className="four_zero_four_bg">
                    <img src={unauthorized} alt="Error" className="page_404-img" />
                </div>

                <div className="contant_box_404">
                    <p className="four_zero_four_bg-h3"> Look like you're lost</p>
                    <p>The page you are looking for not available!</p>
                    <a href="/" className="link_404">Go to Home</a>
                </div>
            </div>

        </section>
    )
}