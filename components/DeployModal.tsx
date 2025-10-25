
import React, { useState } from 'react';
import DeployIcon from './icons/DeployIcon';
import CheckIcon from './icons/CheckIcon';

interface DeployModalProps {
    onClose: () => void;
    onDeploy: () => Promise<{ url: string | null, error: string | null }>;
}

const DeployModal: React.FC<DeployModalProps> = ({ onClose, onDeploy }) => {
    const [status, setStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
    const [url, setUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleDeployClick = async () => {
        setStatus('deploying');
        setError(null);
        setUrl(null);
        
        const result = await onDeploy();

        if (result.url) {
            setStatus('success');
            setUrl(result.url);
        } else {
            setStatus('error');
            setError(result.error || 'An unknown error occurred.');
        }
    };

    const handleCopy = () => {
        if (!url) return;
        navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const renderContent = () => {
        switch (status) {
            case 'idle':
                return (
                    <>
                        <div className="text-center">
                            <DeployIcon className="mx-auto h-12 w-12 text-accent" />
                            <h3 className="mt-4 text-2xl font-semibold">Deploy to Vercel</h3>
                            <p className="mt-2 text-gray-300">
                                Host your portfolio on Vercel with a single click to get a live, shareable URL.
                            </p>
                        </div>
                        <button 
                            onClick={handleDeployClick} 
                            className="mt-6 w-full bg-accent text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent/50"
                        >
                            Deploy Now
                        </button>
                    </>
                );
            case 'deploying':
                return (
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent animate-spin"></div>
                        <h3 className="mt-6 text-2xl font-semibold">Deployment in Progress...</h3>
                        <p className="mt-2 text-gray-300">
                            Please wait while we build and deploy your site. This may take a moment.
                        </p>
                    </div>
                );
            case 'success':
                return (
                    <div className="text-center">
                        <CheckIcon className="mx-auto h-12 w-12 text-green-400" />
                        <h3 className="mt-4 text-2xl font-semibold">Deployment Successful!</h3>
                        <p className="mt-2 text-gray-300">
                            Your portfolio is now live. You can share it using the link below.
                        </p>
                        <div className="mt-6 flex items-center bg-black/20 border border-white/10 rounded-lg p-2">
                            <input
                                type="text"
                                readOnly
                                value={url || ''}
                                className="flex-grow bg-transparent text-gray-200 focus:outline-none"
                            />
                            <button onClick={handleCopy} className="bg-accent text-white px-4 py-2 rounded-md font-semibold w-24">
                                {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                         <a href={url || '#'} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block w-full bg-white/10 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors hover:bg-white/20">
                            Visit Site
                        </a>
                    </div>
                );
            case 'error':
                 return (
                    <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-4 text-2xl font-semibold">Deployment Failed</h3>
                        <p className="mt-2 text-red-300 bg-red-500/10 p-3 rounded-md text-sm">
                            {error}
                        </p>
                        <button 
                            onClick={handleDeployClick} 
                            className="mt-6 w-full bg-accent text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
                        >
                            Try Again
                        </button>
                    </div>
                 );
        }
    };

    return (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-secondary/50 backdrop-blur-2xl border border-white/10 text-white rounded-2xl shadow-2xl w-full max-w-lg p-8 m-4 transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl -mt-4 -mr-4" aria-label="Close modal">&times;</button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default DeployModal;