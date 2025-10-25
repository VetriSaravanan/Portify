import React, { Suspense, lazy, useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import type { ResumeData, TemplateTheme, SectionType, Deployment } from '../../types';
import type { SaveStatus } from '../../App';
import Header from './Header';
import Loader from '../Loader';
import PortfolioEditor from './PortfolioEditor';

const HomePage = lazy(() => import('./HomePage'));
const ExperiencePage = lazy(() => import('./ExperiencePage'));
const EducationPage = lazy(() => import('./EducationPage'));
const DetailsPage = lazy(() => import('./SkillsProjectsPage'));
const ProfilePage = lazy(() => import('../ProfilePage'));

interface PortfolioLayoutProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
    onSignOut: () => void;
    onSave: () => void;
    saveStatus: SaveStatus;
    template: TemplateTheme;
    setTemplate: (theme: TemplateTheme) => void;
    isDarkMode: boolean;
    setIsDarkMode: (isDark: boolean) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onDownload: () => void;
    onDeploy: () => void;
    session: Session | null;
    resumeFilePath: string | null;
    onDownloadResume: () => void;
    onDeletePortfolio: () => void;
    deployments: Deployment[];
}

const PortfolioLayout: React.FC<PortfolioLayoutProps> = (props) => {
    const { resumeData, setResumeData, template, isDarkMode, deployments } = props;
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const location = useLocation();
    
    useEffect(() => {
        if (resumeData) {
            const { name, title, summary } = resumeData;
            document.title = `${name} | ${title}`;
            
            const updateMeta = (id: string, content: string) => {
                 document.getElementById(id)?.setAttribute('content', content);
            }
            
            updateMeta('meta-description', summary);
            updateMeta('og-title', `${name} | ${title}`);
            updateMeta('og-description', summary);
            updateMeta('twitter-title', `${name} | ${title}`);
            updateMeta('twitter-description', summary);
        }
    }, [resumeData]);

    // Handles dynamic theme and dark/light mode switching for the live app
    useEffect(() => {
        const body = document.body;
        const html = document.documentElement;

        // Reset classes for accurate theme switching
        html.className = '';
        body.className = '';

        if (isDarkMode) {
            html.classList.add('dark');
        }

        let bodyClasses = '';
        switch (template) {
            case 'tech':
                bodyClasses = 'bg-tech-secondary text-tech-light font-sans';
                break;
            case 'professional':
                bodyClasses = isDarkMode 
                    ? 'bg-prof-dark-secondary text-gray-200 font-serif' 
                    : 'bg-prof-secondary text-prof-dark font-serif';
                break;
            case 'creative':
                bodyClasses = isDarkMode
                    ? 'bg-creative-dark-secondary text-gray-200 font-sans'
                    : 'bg-creative-secondary text-creative-dark font-sans';
                break;
            case 'minimal':
                 bodyClasses = isDarkMode
                    ? 'bg-minimal-dark-secondary text-gray-200 font-sans'
                    : 'bg-minimal-secondary text-minimal-dark font-sans';
                break;
            case 'executive':
                bodyClasses = isDarkMode
                    ? 'bg-executive-secondary text-executive-light font-serif'
                    : 'bg-executive-light text-executive-primary font-serif';
                break;
            case 'matrix':
                bodyClasses = 'matrix-bg text-matrix-text font-mono';
                break;
            default:
                bodyClasses = 'bg-primary text-gray-200'; // Fallback
        }

        body.classList.add(...bodyClasses.split(' '));

    }, [template, isDarkMode]);

    // This is the definitive fix for the Matrix theme's animations.
    // It runs after the component renders and when the route or template changes.
    useEffect(() => {
        if (template !== 'matrix') return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            },
            { threshold: 0.1 } // Trigger when 10% of the element is visible
        );

        // A small timeout ensures that the elements are in the DOM before we try to observe them.
        const timer = setTimeout(() => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach((el) => observer.observe(el));
        }, 100);


        // Cleanup function to disconnect the observer
        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [location, template]); // Re-run this effect when the page (location) or template changes


    const handleSectionOrderChange = useCallback((newOrder: SectionType[]) => {
        setResumeData(prevData => prevData ? { ...prevData, sectionOrder: newOrder } : null);
    }, [setResumeData]);

    const navLinks = [
        { to: "/", text: "Home" },
        ...resumeData.sectionOrder.map(sectionId => ({
            to: `/${sectionId}`,
            text: sectionId.charAt(0).toUpperCase() + sectionId.slice(1)
        }))
    ];

    return (
        <div className="animate-fade-in">
            <Header 
                name={resumeData.name} 
                onSignOut={props.onSignOut}
                onSave={props.onSave}
                saveStatus={props.saveStatus}
                template={template} 
                navLinks={navLinks}
                isEditorOpen={isEditorOpen}
                setIsEditorOpen={setIsEditorOpen}
                undo={props.undo}
                redo={props.redo}
                canUndo={props.canUndo}
                canRedo={props.canRedo}
                onDownload={props.onDownload}
                onDeploy={props.onDeploy}
            />
            <div className="flex">
                <PortfolioEditor 
                    isOpen={isEditorOpen}
                    {...props}
                    onSectionOrderChange={handleSectionOrderChange}
                />
                <main className={`container mx-auto px-4 sm:px-6 lg:px-8 py-24 transition-all duration-300 ${isEditorOpen ? 'lg:ml-[320px]' : 'ml-0'}`}>
                    <Suspense fallback={<Loader />}>
                        <Routes>
                            <Route path="/" element={<HomePage data={resumeData} setResumeData={setResumeData} template={template} isEditing={isEditorOpen} />} />
                            {resumeData.sectionOrder.map(sectionId => {
                                switch (sectionId) {
                                    case 'experience':
                                        return <Route 
                                            key={sectionId} 
                                            path={`/${sectionId}`} 
                                            element={
                                                <ExperiencePage 
                                                    data={resumeData.experience} 
                                                    setResumeData={setResumeData} 
                                                    template={template} 
                                                    isEditing={isEditorOpen} 
                                                    resumeData={resumeData}
                                                />
                                            } 
                                        />;
                                    case 'education':
                                        return <Route 
                                            key={sectionId} 
                                            path={`/${sectionId}`} 
                                            element={
                                                <EducationPage 
                                                    data={resumeData.education} 
                                                    setResumeData={setResumeData} 
                                                    template={template} 
                                                    isEditing={isEditorOpen} 
                                                    resumeData={resumeData}
                                                />
                                            } 
                                        />;
                                    case 'details':
                                        return <Route 
                                            key={sectionId} 
                                            path={`/${sectionId}`} 
                                            element={
                                                <DetailsPage 
                                                    data={resumeData} 
                                                    setResumeData={setResumeData} 
                                                    template={template} 
                                                    isEditing={isEditorOpen} 
                                                    resumeData={resumeData}
                                                />
                                            } 
                                        />;
                                    default:
                                        return null;
                                }
                            })}
                             <Route 
                                path="/profile" 
                                element={
                                    <ProfilePage 
                                        session={props.session}
                                        resumeFilePath={props.resumeFilePath}
                                        onSignOut={props.onSignOut}
                                        onDownloadResume={props.onDownloadResume}
                                        onDeletePortfolio={props.onDeletePortfolio}
                                        deployments={deployments}
                                    />
                                } 
                            />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </div>
    );
};

export default PortfolioLayout;