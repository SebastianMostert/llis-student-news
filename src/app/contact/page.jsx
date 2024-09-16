'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { gsap } from 'gsap';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        gsap.fromTo('.contactItem', 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, stagger: 0.2, duration: 1 }
        );

        gsap.fromTo('.formField', 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, stagger: 0.2, duration: 1, delay: 0.5 }
        );
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
        setFormSubmitted(true);
    };

    return (
        <Container
            sx={{
                backgroundColor: 'var(--bg)',
                color: 'var(--textColor)',
                padding: '2rem',
                maxWidth: '800px',
                margin: '0 auto',
                textAlign: 'center',
            }}
        >
            <Typography variant="h4" sx={{ marginBottom: '1.5rem' }}>
                Contact Us
            </Typography>
            <div className="contactList">
                <div className="contactItem" style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
                    <FaEnvelope style={{ fontSize: '1.5rem', marginRight: '0.5rem', color: '#0070f3' }} />
                    <Typography>email@example.com</Typography>
                </div>
                <div className="contactItem" style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
                    <FaPhone style={{ fontSize: '1.5rem', marginRight: '0.5rem', color: '#0070f3' }} />
                    <Typography>+123 456 7890</Typography>
                </div>
                <div className="contactItem" style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
                    <FaMapMarkerAlt style={{ fontSize: '1.5rem', marginRight: '0.5rem', color: '#0070f3' }} />
                    <Typography>1234 Street Name, City, Country</Typography>
                </div>
            </div>
            <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
                <div className="formField" style={{ marginBottom: '1rem' }}>
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        required
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: 'var(--softTextColor)', // Label color
                            },
                            '& .MuiInputBase-root': {
                                backgroundColor: 'var(--softBg)',
                                color: 'var(--textColor)',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--softTextColor)', // Border color
                            },
                        }}
                    />
                </div>
                <div className="formField" style={{ marginBottom: '1rem' }}>
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        required
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: 'var(--softTextColor)', // Label color
                            },
                            '& .MuiInputBase-root': {
                                backgroundColor: 'var(--softBg)',
                                color: 'var(--textColor)',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--softTextColor)', // Border color
                            },
                        }}
                    />
                </div>
                <div className="formField" style={{ marginBottom: '1rem' }}>
                    <TextField
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        fullWidth
                        required
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: 'var(--softTextColor)', // Label color
                            },
                            '& .MuiInputBase-root': {
                                backgroundColor: 'var(--softBg)',
                                color: 'var(--textColor)',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--softTextColor)', // Border color
                            },
                        }}
                    />
                </div>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        backgroundColor: '#0070f3',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#005bb5',
                        },
                    }}
                >
                    Submit
                </Button>
            </form>
            {formSubmitted && <Typography sx={{ marginTop: '1rem', color: '#0070f3' }}>Thank you for contacting us!</Typography>}
        </Container>
    );
};

export default ContactPage;