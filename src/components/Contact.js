import React, { useState } from "react";
import "../css/Contact.css";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: "",
        source: "",
    });

    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.email) {
            alert("Please fill in all required fields.");
            return;
        }

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                access_key: "eb192ac8-524a-44c3-9af6-b85888f1fc99",
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                message: formData.message,
                source: formData.source,
            }),
        });

        const result = await response.json();

        if (result.success) {
            setSuccess(true);
            setFormData({
                name: "",
                phone: "",
                email: "",
                message: "",
                source: "",
            });
        } else {
            setSuccess(false);
        }
    };

    return (
        <div className="contact-wrapper">
            <div className="contact-form">
                <h2>Get in Touch</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                    <input type="tel" name="phone" placeholder="Phone No." value={formData.phone} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <select name="source" value={formData.source} onChange={handleChange}>
                        <option value="">How did you hear about us?</option>
                        <option value="google">Google</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="referral">Referral</option>
                    </select>
                    <textarea name="message" placeholder="Leave us a Message" value={formData.message} onChange={handleChange}></textarea>
                    <button type="submit">Submit</button>
                </form>
                {success === true && <p style={{ color: "green", marginTop: "10px" }}>Message sent successfully!</p>}
                {success === false && <p style={{ color: "red", marginTop: "10px" }}>Something went wrong. Please try again.</p>}
            </div>
        </div>
    );
};

export default ContactPage;