import React, { useState, useRef } from 'react';
import LogoIcon from './icons/LogoIcon';
import SparklesIcon from './icons/SparklesIcon';
import { NavLink } from 'react-router-dom';
import UserIcon from './icons/UserIcon';
import SignOutIcon from './icons/SignOutIcon';

interface UploadScreenProps {
    onFileUpload: (file: File) => void;
    error: string | null;
    onSignOut: () => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onFileUpload, error, onSignOut }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-fade-in">
             <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <LogoIcon className="h-8 w-8 text-white"/>
                    <span className="text-xl font-bold text-white">Reflect</span>
                </div>
                <div className="flex items-center space-x-2">
                    <NavLink to="/profile" className="p-2 rounded-full text-gray-300 hover:bg-white/10 hover:text-white" aria-label="My Profile">
                        <UserIcon />
                    </NavLink>
                    <button onClick={onSignOut} className="p-2 rounded-full text-gray-300 hover:bg-white/10 hover:text-white" aria-label="Sign Out">
                        <SignOutIcon />
                    </button>
                </div>
             </header>

            <div className="flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1.5 rounded-full mb-6 text-sm">
                <SparklesIcon className="w-4 h-4 text-accent" />
                <span>Powered by Google's Gemini AI</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                Your Portfolio, Reimagined
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
                Upload your resume to instantly generate a beautiful, multi-page portfolio website.
                Your career story is waiting to be told.
            </p>
            
            <div className="w-full max-w-md">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                />
                <button
                    onClick={handleButtonClick}
                    className="w-full bg-accent text-white hover:bg-accent/90 font-bold py-3 px-6 rounded-lg text-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent/50"
                >
                    Upload Your Resume
                </button>
                {error && <p className="mt-4 text-red-400 font-semibold">{error}</p>}
            </div>

            <footer className="absolute bottom-4 text-gray-500 text-sm">
                Your data is saved securely to your account.
            </footer>
        </div>
    );
};

export default UploadScreen;