import React from 'react';
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import LocaleSwitcher from './LocaleSwitcher';

function Footer() {
    return (
        <footer className="bg-secondaryBg-light dark:bg-secondaryBg-dark py-8 w-full">
            <div className="flex flex-wrap justify-center items-center gap-16 text-center sm:text-left px-2 sm:px-6">
                {/* Column 1: Quick Links */}
                <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                    <h3 className="text-base font-semibold mb-2">Quick Links</h3>
                    <ul className="space-y-1">
                        <li>
                            <a
                                href="/privacy-policy"
                                className="text-gray-400 hover:text-white text-xs sm:text-sm"
                            >
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a
                                href="/contact"
                                className="text-gray-400 hover:text-white text-xs sm:text-sm"
                            >
                                Contact Us
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Column 2: Newsletter */}
                <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                    <h3 className="text-base font-semibold mb-2">Newsletter</h3>
                    <form className="flex w-full max-w-xs space-x-2">
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="flex-1 px-2 py-1 text-xs sm:text-sm bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-md text-white text-xs sm:text-sm"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>

                {/* Column 3: Social Media */}
                <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                    <h3 className="text-base font-semibold mb-2">Follow Us</h3>
                    <div className="flex space-x-3 mb-2 justify-center sm:justify-start">
                        <a
                            href="https://x.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white text-lg"
                        >
                            <FaXTwitter />
                        </a>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white text-lg"
                        >
                            <FaFacebookF />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white text-lg"
                        >
                            <FaInstagram />
                        </a>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 space-y-1">
                        <p>
                            <FaMapMarkerAlt className="inline mr-1" />
                            2 rue Victor Ferrant, 6122 Junglinster
                        </p>
                        <p>
                            <FaPhoneAlt className="inline mr-1" />
                            +1 234 567 890
                        </p>
                    </div>
                </div>

                {/* Column 4: Locale Switcher */}
                <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                    <h3 className="text-base font-semibold mb-2">Language</h3>
                    <LocaleSwitcher />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-6 text-center text-gray-400 border-t border-gray-700 pt-4">
                <p className="text-xs sm:text-sm">
                    &copy; {new Date().getFullYear()} Keeping Up With LLIS. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
