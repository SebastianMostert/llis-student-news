"use client";
import React from 'react';
import CookieConsent from "react-cookie-consent";
import { toast } from 'sonner';

const CookieConsentBanner = () => {
    return (
        <CookieConsent
            acceptOnOverlayClick={true}
            onAccept={() => {
                toast.success('Cookies accepted!', { position: 'top-center' });
            }}
            buttonClasses='hidden'
            overlay
            style={{
                fontSize: '18px', 
                padding: '20px', 
                textAlign: 'center',
                backgroundColor: '#333',
                color: 'white',
            }}
            contentStyle={{
                fontSize: '20px',
                lineHeight: '1.6',
            }}
            buttonStyle={{
                display: 'none',
            }}
        >
            We use cookies to enhance your experience. Our site uses cookies for authentication, remembering your activity, 
            and ensuring a smoother browsing experience. By continuing to browse, you consent to our use of cookies.
            <br />
            For more information, please see our <a href="/privacy-policy" className="underline text-blue-400">Privacy Policy</a>.
            <br />
            <span className="mt-2 block">Click anywhere to accept or close the page to deny.</span>
        </CookieConsent>
    );
};

export default CookieConsentBanner;
