import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { Session } from '@supabase/supabase-js';

import { useResumeParser } from './hooks/useResumeParser';
import { useHistoryState } from './hooks/useHistoryState';
import type { ResumeData, TemplateTheme, Deployment } from './types';
import { supabase, supabaseError } from './lib/supabaseClient';

import Loader from './components/Loader';
import PortfolioLayout from './components/portfolio/PortfolioLayout';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import PortfolioExport from './components/portfolio/PortfolioExport';
import DownloadModal from './components/portfolio/DownloadModal';
import DeployModal from './components/DeployModal';
import ConfirmationModal from './components/ConfirmationModal';
import UploadScreen from './components/UploadScreen';
import Notification from './components/Notification';
import ProfilePage from './components/ProfilePage';
import LogoIcon from './components/icons/LogoIcon';
import SignOutIcon from './components/icons/SignOutIcon';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
export type NotificationType = { message: string; type: 'success' | 'error'; };

// IMPORTANT SECURITY WARNING: This token is exposed on the client-side for demonstration
// purposes only. In a real-world application, this should be handled by a secure
// backend proxy (e.g., a Vercel Serverless Function) to protect the token.
const VERCEL_API_TOKEN = 'ZAw9NRqx5Spn1ZGjuiSiIdPY';
const VERCEL_TEAM_ID = ''; // Optional: Add your Vercel Team ID if you have one

const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const { parsedData, isLoading: isParsing, error: parseError, parseResume, clearError } = useResumeParser();
    const [resumeData, setResumeData, undo, redo, canUndo, canRedo, resetHistory] = useHistoryState<ResumeData | null>(null);

    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [template, setTemplate] = useState<TemplateTheme>('tech');
    const [isDarkMode, setIsDarkMode] = useState(true);
    
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeFilePath, setResumeFilePath] = useState<string | null>(null);
    const [notification, setNotification] = useState<NotificationType | null>(null);
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [portfolioId, setPortfolioId] = useState<string | null>(null);
    
     const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    // Auth and data loading effect
    useEffect(() => {
        if (supabaseError) {
            setAuthLoading(false);
            return;
        }
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setAuthLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (session && !resumeData) {
            loadPortfolioData();
        }
        if (!session && resumeData) {
            // User signed out, reset app state
            resetToInitialState(true);
        }
    }, [session]);
    
     useEffect(() => {
        if (parsedData) {
            resetHistory(parsedData);
            if (resumeFile) {
                handleSave(parsedData, resumeFile);
            }
             setCurrentView('app');
        }
    }, [parsedData, resumeFile]);

    useEffect(() => {
        if (parseError) {
             const timer = setTimeout(() => clearError(), 5000);
             return () => clearTimeout(timer);
        }
    }, [parseError, clearError]);

    const resetToInitialState = (shouldGoToLanding: boolean) => {
        setResumeData(null);
        setResumeFile(null);
        setResumeFilePath(null);
        setDeployments([]);
        setPortfolioId(null);
        if (shouldGoToLanding) {
            setCurrentView('landing');
        }
        resetHistory(null);
    };

    const loadPortfolioData = async () => {
        if (!session?.user || !supabase) return;

        // --- NEW ROBUST LOADING LOGIC ---
        // Step 1: Always attempt to load deployment history for a logged-in user.
        const { data: deploymentHistory, error: deploymentError } = await supabase
            .from('deployments')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (deploymentError) {
            console.error("Error loading deployment history:", deploymentError);
            showNotification('Could not load deployment history.', 'error');
        } else if (deploymentHistory) {
            setDeployments(deploymentHistory);
        }

        // Step 2: Attempt to load the main portfolio draft.
        const { data: portfolio, error: portfolioError } = await supabase
            .from('portfolios')
            .select('id, resume_data, resume_file_path, theme, is_dark_mode')
            .eq('user_id', session.user.id)
            .single();

        // Handle errors but don't block the UI, as deployments might have loaded.
        if (portfolioError && portfolioError.code !== 'PGRST116') { // PGRST116 means no row found, which is not an error here.
            console.error("Error loading portfolio data:", portfolioError);
            showNotification('Could not load portfolio draft.', 'error');
        }

        if (portfolio) {
            // If a portfolio draft exists, load it into state.
            resetHistory(portfolio.resume_data);
            setResumeFilePath(portfolio.resume_file_path);
            setPortfolioId(portfolio.id);
            if (portfolio.theme) {
                setTemplate(portfolio.theme as TemplateTheme);
            }
            if (typeof portfolio.is_dark_mode === 'boolean') {
                setIsDarkMode(portfolio.is_dark_mode);
            }
        }
        
        // Always transition to the main app view for a logged-in user.
        // The view will correctly show either the portfolio or the upload screen.
        setCurrentView('app');
    };
    
    const handleFileUpload = (file: File) => {
        if (!session) {
            alert("Please sign in to create a portfolio.");
            return;
        }
        setResumeFile(file);
        parseResume(file);
    };

    const handleSave = async (dataToSave?: ResumeData | null, fileToSave?: File | null) => {
        if (!session?.user || !supabase) {
            showNotification('You must be signed in to save.', 'error');
            return;
        }

        const currentData = dataToSave || resumeData;
        if (!currentData) return;

        setSaveStatus('saving');
        
        let newResumePath = resumeFilePath;

        // Upload resume file if a new one is provided
        if (fileToSave) {
            const filePath = `${session.user.id}/${Date.now()}-${fileToSave.name}`;
            const { error: uploadError } = await supabase.storage.from('resumes').upload(filePath, fileToSave);
            if (uploadError) {
                console.error('Error uploading resume:', uploadError);
                setSaveStatus('error');
                showNotification(`Error uploading resume: ${uploadError.message}`, 'error');
                return;
            }
            newResumePath = filePath;
            setResumeFilePath(newResumePath);
        }

        // Check if a portfolio already exists
        const { data: existingPortfolio, error: selectError } = await supabase
            .from('portfolios')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

        if (selectError && selectError.code !== 'PGRST116') { // PGRST116: "exact one row not found"
            console.error('Error checking for portfolio:', selectError);
            setSaveStatus('error');
            showNotification(`Error saving: ${selectError.message}`, 'error');
            return;
        }
        
        let currentPortfolioId = existingPortfolio?.id || portfolioId;

        if (currentPortfolioId) {
            // UPDATE existing portfolio
            const { error: updateError } = await supabase
                .from('portfolios')
                .update({
                    resume_data: currentData,
                    resume_file_path: newResumePath,
                    theme: template,
                    is_dark_mode: isDarkMode,
                })
                .eq('id', currentPortfolioId);

             if (updateError) {
                console.error('Error updating data:', updateError);
                setSaveStatus('error');
                showNotification(`Error saving data: ${updateError.message}`, 'error');
            } else {
                setSaveStatus('saved');
            }
        } else {
            // INSERT new portfolio
            const { data: newPortfolio, error: insertError } = await supabase
                .from('portfolios')
                .insert({
                    user_id: session.user.id,
                    resume_data: currentData,
                    resume_file_path: newResumePath,
                    theme: template,
                    is_dark_mode: isDarkMode,
                })
                .select('id')
                .single();
            
            if (insertError) {
                console.error('Error inserting data:', insertError);
                setSaveStatus('error');
                showNotification(`Error saving data: ${insertError.message}`, 'error');
            } else if (newPortfolio) {
                setPortfolioId(newPortfolio.id);
                setSaveStatus('saved');
            }
        }

        setTimeout(() => setSaveStatus('idle'), 2000);
    };

    const handleSignOut = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        resetToInitialState(true);
    };

    const handleDownloadResume = async () => {
        if (!resumeFilePath || !supabase) return;
        const { data, error } = await supabase.storage.from('resumes').download(resumeFilePath);
        if (error) {
            console.error("Error downloading file: ", error.message);
            showNotification(`Error downloading file: ${error.message}`, 'error');
            return;
        }
        if (data) {
            const originalFilename = resumeFilePath.split('-').slice(1).join('-');
            saveAs(data, originalFilename);
        }
    };

    const handleDeletePortfolio = async () => {
        if (!session?.user || !supabase) return;
        
        setIsDeleteModalOpen(false);

        // Delete from portfolios table (cascades to deployments)
        const { error: dbError } = await supabase.from('portfolios').delete().eq('user_id', session.user.id);
        if (dbError) {
            console.error('Error deleting portfolio data:', dbError);
            showNotification(`Error deleting portfolio: ${dbError.message}`, 'error');
            return; // Stop if DB deletion fails
        }

        // Delete SPECIFIC resume file from storage
        if (resumeFilePath) {
            const { error: storageError } = await supabase.storage.from('resumes').remove([resumeFilePath]);
            if (storageError) {
                // Log but don't block UI reset, as the primary data is gone.
                console.error('Error deleting resume file:', storageError);
            }
        }
        
        resetToInitialState(false); // Reset data but don't go to landing page
        setCurrentView('app'); // Stay in app view to allow re-upload
        showNotification('Portfolio deleted successfully.', 'success');
    };


    const handleDownload = async (downloadTemplate: TemplateTheme, downloadIsDarkMode: boolean) => {
        if (!resumeData) return;
        setIsDownloadModalOpen(false);

        const zip = new JSZip();
        
        const htmlContent = renderToStaticMarkup(
            <PortfolioExport 
                resumeData={resumeData}
                template={downloadTemplate}
                isDarkMode={downloadIsDarkMode}
            />
        );
        
        zip.file("index.html", `<!DOCTYPE html>${htmlContent}`);

        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, "portfolio.zip");
    };
    
    const handleDeploy = async (): Promise<{ url: string | null, error: string | null }> => {
        if (!resumeData || !session) return { url: null, error: 'No portfolio data to deploy.' };
        if (!portfolioId) {
             return { url: null, error: 'Please save your portfolio at least once before deploying.' };
        }

        try {
            const htmlContent = `<!DOCTYPE html>${renderToStaticMarkup(
                <PortfolioExport resumeData={resumeData} template={template} isDarkMode={isDarkMode} />
            )}`;

            const projectName = `portfolio-${resumeData.name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(7)}`;

            // Step 1: Deploy the files to Vercel
            const deployRes = await fetch(`https://api.vercel.com/v13/deployments${VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: projectName,
                    files: [{ file: 'index.html', data: htmlContent }],
                    projectSettings: {
                        framework: null,
                    },
                }),
            });
            
            const deployData = await deployRes.json();
            
            if (!deployRes.ok) {
                 throw new Error(deployData.error?.message || 'Failed to create deployment.');
            }

            const newDeploymentUrl = `https://${deployData.url}`;

            // Save new deployment record to the database
            const { data: newDeployment, error: insertError } = await supabase
                .from('deployments')
                .insert({
                    portfolio_id: portfolioId,
                    user_id: session.user.id,
                    url: newDeploymentUrl,
                })
                .select()
                .single();
            
            if (insertError) {
                console.error('Failed to save deployment URL:', insertError);
                // Even if saving fails, the deployment was successful, so show the user the URL.
                // The error notification is critical for them to understand it wasn't saved to their profile.
                showNotification('Deployment successful, but failed to save URL to profile.', 'error');
            } else if (newDeployment) {
                 // Add new deployment to the top of the local state for instant UI update
                 setDeployments(prev => [newDeployment, ...prev]);
            }

            // Step 2: Disable Vercel's deployment protection to make it public
            const projectUpdateRes = await fetch(`https://api.vercel.com/v9/projects/${projectName}${VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ssoProtection: null
                }),
            });
            
            if (!projectUpdateRes.ok) {
                const errorData = await projectUpdateRes.json();
                console.warn('Could not disable deployment protection, the link may require a login.', errorData.error?.message);
            }

            return { url: newDeploymentUrl, error: null };

        } catch (error: any) {
            console.error('Deployment failed:', error);
            return { url: null, error: error.message || 'An unknown error occurred during deployment.' };
        }
    };
    
    if (authLoading || isParsing) {
        return <Loader />;
    }

    if (supabaseError) {
        return <Auth configurationError={supabaseError} />;
    }

    if (!session) {
         if (currentView === 'app') {
            return <Auth onBackToHome={() => setCurrentView('landing')} />;
        }
        return <LandingPage onGetStarted={() => setCurrentView('app')} />;
    }

    const NoDataProfilePageWrapper = (
        <div className="bg-primary text-gray-200 min-h-screen">
            <header className="no-print fixed top-0 left-0 right-0 z-50 border-b bg-primary/50 backdrop-blur-lg border-white/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                         <NavLink to="/" className="flex items-center gap-3">
                            <LogoIcon className="h-7 w-7 text-accent" />
                            <span className="text-xl font-bold text-white">Reflect</span>
                        </NavLink>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                             <button onClick={handleSignOut} className="p-2 rounded-full text-gray-300 hover:bg-white/10 hover:text-white" aria-label="Sign Out">
                                <SignOutIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <ProfilePage
                    session={session}
                    resumeFilePath={resumeFilePath}
                    onSignOut={handleSignOut}
                    onDownloadResume={handleDownloadResume}
                    onDeletePortfolio={() => setIsDeleteModalOpen(true)}
                    deployments={deployments}
                />
            </main>
        </div>
    );
    
    return (
        <HashRouter>
            <Notification notification={notification} />
            {!resumeData ? (
                <Routes>
                    <Route path="/profile" element={NoDataProfilePageWrapper} />
                    <Route path="*" element={<UploadScreen onFileUpload={handleFileUpload} error={parseError} onSignOut={handleSignOut} />} />
                </Routes>
            ) : (
                <PortfolioLayout
                    resumeData={resumeData}
                    setResumeData={setResumeData}
                    onSignOut={handleSignOut}
                    onSave={() => handleSave()}
                    saveStatus={saveStatus}
                    template={template}
                    setTemplate={setTemplate}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    undo={undo}
                    redo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onDownload={() => setIsDownloadModalOpen(true)}
                    onDeploy={() => setIsDeployModalOpen(true)}
                    session={session}
                    resumeFilePath={resumeFilePath}
                    onDownloadResume={handleDownloadResume}
                    onDeletePortfolio={() => setIsDeleteModalOpen(true)}
                    deployments={deployments}
                />
            )}
            {isDownloadModalOpen && resumeData && (
                <DownloadModal 
                    onClose={() => setIsDownloadModalOpen(false)}
                    onDownload={handleDownload}
                    currentTemplate={template}
                    isDarkMode={isDarkMode}
                />
            )}
             {isDeployModalOpen && resumeData && (
                <DeployModal
                    onClose={() => setIsDeployModalOpen(false)}
                    onDeploy={handleDeploy}
                />
            )}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeletePortfolio}
                title="Delete Portfolio?"
                message="This action is irreversible. All your portfolio data, your deployment history, and your uploaded resume will be permanently deleted."
                confirmText="Yes, Delete Everything"
            />
        </HashRouter>
    );
};

export default App;