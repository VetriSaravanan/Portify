import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Warming up the AI...",
    "Parsing your resume with Gemini...",
    "Extracting key achievements...",
    "Designing your portfolio layout...",
    "Building your personal website...",
    "Almost there..."
];

const Loader: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent animate-spin"></div>
            <p className="mt-6 text-xl text-gray-300 transition-opacity duration-500">
                {loadingMessages[messageIndex]}
            </p>
        </div>
    );
};

export default Loader;