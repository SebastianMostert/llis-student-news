import React, { useState, useEffect, useRef } from 'react';
import styles from './modal.module.css';
import Comment from '../Comment/Comment';

// Define the initial options and suboptions (nested levels)
const OPTIONS_DATA = {
    "Report comment": {
        "I don't like it": null,
        "Spam": null,
        "Abuse or harassment": {
            "Verbally harassing me or someone else": null,
            "Using rude, vulgar or offensive language": null,
            "Promoting hate based on identity or vulnerability": null,
            "Explicit, graphic or unwanted sexual content": {
                "Gore, animal cruelty or violent shock content": null,
                "Unwanted adult sexual images": null,
                "Degrading adult pornography": null,
                "Revenge porn or a threat to share it": null,
                "Sexual content or behaviour involving minors": {
                    "This person is talking about minors in a sexual way": null,
                    "This person is sending suggestive or sexual messages to a minor": null,
                    "A minor is sending sexual messages": null,
                },
            },
            "Threatening violence or real world harm": {
                "A threat to physically hurt me or someone else": null,
                "Celebrating or glorifying acts of violence": null,
            },
            "Content targeting or involving minors": {
                "This person is talking about minors in a sexual way": null,
                "This person is sending suggestive or sexual messages to a minor": null,
                "A minor is sending sexual messages": null,
            },
        },
        "Harmful misinformation or glorifying violence": {
            "Spreading misinformation or conspiracy theories": {
                "They are saying bad things about me or someone I know": null,
                "Spreading fake news or harmful conspiracy theories": null,
            },
            "Celebrating or glorifying acts of violence": null,
            "Promoting hate based on identity or vulnerability": null,
        },
        "Something else": {
            "It mentions self-harm or suicide": {
                "I'm worried they are planning to self harm": null,
                "They are encouraging others to self harm": null,
            },
            "Harmful misinformation or glorifying violence": {
                "Spreading misinformation or conspiracy theories": {
                    "They are saying bad things about me or someone I know": null,
                    "Spreading fake news or harmful conspiracy theories": null,
                },
                "Celebrating or glorifying acts of violence": null,
                "Promoting hate based on identity or vulnerability": null,
            },
            "Impersonation, scam or fraud": {
                "Impersonating me or someone I know": null,
                "Impersonating a celebrity or public figure": null,
                "Impersonating a business or organization": null,
                "Scamming or defrauding": null,
            },
            "Distributing stolen accounts or credit cards": null,
            "Selling drugs or other illegal goods": null,
            "Hacks, cheats, phishing or malicious links": null,
        },
    }
};

const STEPS = {
    OPTIONS: 0,
    SUBOPTIONS: 1,
    SUMMARY: 2,
};

const Modal = ({ isOpen, onClose, onReport, comment }) => {
    const [currentStep, setCurrentStep] = useState(STEPS.OPTIONS);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState(OPTIONS_DATA["Report comment"]);
    const [history, setHistory] = useState([]);
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
                resetModalState();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const resetModalState = () => {
        setCurrentStep(STEPS.OPTIONS);
        setSelectedOptions([]);
        setOptions(OPTIONS_DATA["Report comment"]);
        setHistory([]);
    };

    const handleOptionClick = (option) => {
        const nextOptions = options[option];
        setHistory(prev => [...prev, { options, step: currentStep }]);
        setSelectedOptions(prev => [...prev, option]);

        if (nextOptions && typeof nextOptions === 'object' && !Array.isArray(nextOptions)) {
            setOptions(nextOptions);
            setCurrentStep(STEPS.SUBOPTIONS);
        } else {
            setCurrentStep(STEPS.SUMMARY);
        }
    };

    const handleBack = () => {
        if (history.length > 0) {
            const { options: prevOptions, step: prevStep } = history.pop();
            setOptions(prevOptions);
            setCurrentStep(prevStep);
            setSelectedOptions(prev => prev.slice(0, -1));
        } else {
            resetModalState();
        }
    };

    const handleSubmit = () => {
        onReport(selectedOptions);
        onClose();
    };

    const renderOptions = () => (
        <div className={styles.optionsContainer}>
            {Object.keys(options).map(option => (
                <button
                    key={option}
                    className={styles.optionButton}
                    onClick={() => handleOptionClick(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    );

    const renderContent = () => {
        const titles = {
            [STEPS.OPTIONS]: <h2 className={styles.title}>Report comment</h2>,
            [STEPS.SUBOPTIONS]: <h2 className={styles.title}>Suboptions</h2>,
            [STEPS.SUMMARY]: <h2 className={styles.title}>Report summary</h2>,
        };
        const descriptions = {
            [STEPS.OPTIONS]: <p className={styles.description}>Please select the option that best describes the problem.</p>,
            [STEPS.SUBOPTIONS]: <p className={styles.description}>Please select a more specific category.</p>,
            [STEPS.SUMMARY]: (
                <div>
                    <p className={styles.mutedDescription}>Review your report before submitting.</p>
                    <p className={styles.description}>By submitting this report you confirm that it is truthful and made in good faith. Please do not submit false or duplicate reports.</p>
                </div>
            ),
        };

        return (
            <div className={styles.contentContainer}>

                {currentStep !== STEPS.SUMMARY ? (
                    <>
                        {titles[currentStep]}
                        {descriptions[currentStep]}
                        <div className={styles.commentWrapper}>
                            <Comment item={comment} hasModButtons={false} hasEngagementButtons={false} />
                        </div>
                        <div className={styles.optionsContainer}>
                            {renderOptions()}
                        </div>
                    </>

                ) : (
                    <>
                        {titles[currentStep]}
                        {descriptions[currentStep]}
                        <div className={styles.summary}>
                            <h3 className={styles.summaryTitle}>Report Category</h3>
                            <p className={styles.summaryText}>{selectedOptions.join(' -> ')}</p>
                        </div>
                        <div className={styles.commentWrapper}>
                            <p className={styles.commentTitle}>Selected Comment</p>
                            <Comment item={comment} hasModButtons={false} hasEngagementButtons={false} />
                        </div>
                    </>
                )}
            </div>
        );

    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} aria-labelledby="modal-title" role="dialog">
            <div className={styles.modal} aria-modal="true" ref={modalRef}>
                <button
                    className={styles.closeButton}
                    onClick={() => { onClose(); resetModalState(); }}
                    aria-label="Close modal"
                >
                    &times;
                </button>
                {renderContent()}
                <div className={styles.actions}>
                    {currentStep > STEPS.OPTIONS && (
                        <button
                            className={`${styles.button} ${styles.back}`}
                            onClick={handleBack}
                        >
                            Back
                        </button>
                    )}
                    {currentStep === STEPS.SUMMARY && (
                        <button
                            className={`${styles.button} ${styles.submit}`}
                            onClick={handleSubmit}
                        >
                            Submit Report
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
