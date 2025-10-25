import React, { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { Deployment } from '../../types';
import DownloadIcon from './icons/DownloadIcon';
import TrashIcon from './icons/TrashIcon';
import SignOutIcon from './icons/SignOutIcon';
import HomeIcon from './icons/HomeIcon';
import { NavLink } from 'react-router-dom';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import DeployIcon from './icons/DeployIcon';

interface ProfilePageProps {
    session: Session | null;
    resumeFilePath: string | null;
    deployments: Deployment[];
    onSignOut: () => void;
    onDownloadResume: () => void;
    onDeletePortfolio: () => void;
}

const DeploymentItem: React.FC<{ deployment: Deployment }> = ({ deployment }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(deployment.url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-grow mb-3 sm:mb-0">
                    <p className="text-gray-400 text-xs">Deployed on {new Date(deployment.created_at).toLocaleString()}</p>
                    <a href={deployment.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">{deployment.url}</a>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                     <a href={deployment.url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-sm rounded-md bg-white/10 hover:bg-white/20 transition-colors">
                        Visit
                    </a>
                    <button onClick={handleCopy} className="px-3 py-2 text-sm rounded-md bg-accent hover:bg-accent/90 transition-colors w-24">
                        {isCopied ? 'Copied!' : 'Copy Link'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const ProfilePage: React.FC<ProfilePageProps> = ({
    session,
    resumeFilePath,
    deployments,
    onSignOut,
    onDownloadResume,
    onDeletePortfolio
}) => {
    const originalFilename = resumeFilePath?.split('-').slice(1).join('-') || 'resume';

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-bold mb-8 border-b-2 pb-4 text-accent border-white/10">
                My Profile
            </h1>

            <div className="bg-white/5 border border-white/10 rounded-lg shadow-lg p-8 space-y-8">
                
                 {/* Deployment History */}
                <section>
                    <h2 className="text-2xl font-semibold text-gray-200 mb-4">Deployment History</h2>
                     {deployments && deployments.length > 0 ? (
                         <div className="space-y-4">
                            {deployments.map(dep => <DeploymentItem key={dep.id} deployment={dep} />)}
                         </div>
                     ) : (
                         <div className="bg-black/20 p-6 rounded-lg text-center border border-white/10">
                            <DeployIcon className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                            <p className="text-gray-300">You haven't deployed your portfolio yet.</p>
                            <p className="text-gray-400 text-sm">Deploy it from the main header to get a shareable link.</p>
                         </div>
                     )}
                </section>

                {/* Account Details */}
                <section>
                    <h2 className="text-2xl font-semibold text-gray-200 mb-4">Account Details</h2>
                    <div className="flex items-center bg-black/20 p-4 rounded-md border border-white/10">
                        <span className="text-gray-400 mr-4">Email:</span>
                        <span className="font-mono text-accent">{session?.user?.email}</span>
                    </div>
                </section>
                
                {/* Resume Management */}
                {resumeFilePath && (
                     <section>
                         <h2 className="text-2xl font-semibold text-gray-200 mb-4">Resume Management</h2>
                         <div className="space-y-4">
                            <div className="bg-black/20 p-4 rounded-md flex justify-between items-center border border-white/10">
                                <div>
                                    <p className="text-gray-400">Current Resume:</p>
                                    <p className="text-gray-200 font-medium">{originalFilename}</p>
                                </div>
                                <button 
                                    onClick={onDownloadResume}
                                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent/80 hover:bg-accent text-white font-semibold transition-colors"
                                >
                                    <DownloadIcon /> Download
                                </button>
                            </div>
                         </div>
                     </section>
                )}


                {/* Actions */}
                <section>
                    <h2 className="text-2xl font-semibold text-gray-200 mb-4">Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NavLink 
                            to="/"
                            className="flex items-center justify-center gap-2 w-full text-center px-4 py-3 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
                        >
                           <HomeIcon /> {resumeFilePath ? 'Back to Portfolio' : 'Create New Portfolio'}
                        </NavLink>
                        <button 
                            onClick={onSignOut}
                            className="flex items-center justify-center gap-2 w-full text-center px-4 py-3 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
                        >
                            <SignOutIcon /> Sign Out
                        </button>
                         {resumeFilePath && (
                             <button 
                                onClick={onDeletePortfolio}
                                className="md:col-span-2 flex items-center justify-center gap-2 w-full text-center px-4 py-3 rounded-md bg-red-600/20 border border-red-500/50 hover:bg-red-500/30 text-red-300 hover:text-red-200 font-semibold transition-colors"
                            >
                                <TrashIcon /> Delete Portfolio & Start Over
                            </button>
                         )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;
