import React from 'react';
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import LocaleSwitcher from './LocaleSwitcher';
import { getTranslations } from 'next-intl/server';
import SubscribeFooter from './newsletter/subscribeFooter';

async function Footer() {
    const t = await getTranslations('Footer');

    return (
        <footer className="bg-secondaryBg-light dark:bg-secondaryBg-dark py-8 w-full">
            <div className="flex flex-wrap justify-center items-start gap-16 text-center sm:text-left px-2 sm:px-6">
                {/* Column 1: Quick Links */}
                <div className="flex flex-col items-start w-full sm:w-auto">
                    <h3 className="text-base font-semibold mb-2">{t('quickLinks')}</h3>
                    <ul className="space-y-1">
                        <li>
                            <a
                                href="/privacy-policy"
                                className="text-gray-400 hover:text-white text-xs sm:text-sm"
                            >
                                {t('privacyPolicy')}
                            </a>
                        </li>
                        <li>
                            <a
                                href="/contact"
                                className="text-gray-400 hover:text-white text-xs sm:text-sm"
                            >
                                {t('contactUs')}
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Column 2: Newsletter */}
                <SubscribeFooter />

                {/* Column 3: Social Media */}
                <div className="flex flex-col items-start w-full sm:w-auto">
                    <h3 className="text-base font-semibold mb-2">{t('followUs')}</h3>
                    <div className="flex space-x-3 mb-2 justify-start">
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
                            {t('address')}
                        </p>
                        <p>
                            <FaPhoneAlt className="inline mr-1" />
                            {t('phone')}
                        </p>
                    </div>
                </div>

                {/* Column 4: Locale Switcher */}
                <div className="flex flex-col items-start w-full sm:w-auto">
                    <h3 className="text-base font-semibold mb-2">{t('language')}</h3>
                    <LocaleSwitcher />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-6 text-center text-gray-400 border-t border-gray-700 pt-4">
                <p
                    className="text-xs sm:text-sm"
                    dangerouslySetInnerHTML={{ __html: t('copyright', { year: new Date().getFullYear() }) }}
                />
            </div>
        </footer>
    );
}

export default Footer;
