

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { TemplateTheme } from '../../types';
import type { SaveStatus } from '../../App';
import HomeIcon from '../icons/HomeIcon';
import BriefcaseIcon from '../icons/BriefcaseIcon';
import GraduationCapIcon from '../icons/GraduationCapIcon';
import CodeIcon from '../icons/CodeIcon';
import EditIcon from '../icons/EditIcon';
import UndoIcon from '../icons/UndoIcon';
import RedoIcon from '../icons/RedoIcon';
import DownloadIcon from '../icons/DownloadIcon';
import DeployIcon from '../icons/DeployIcon';
import SignOutIcon from '../icons/SignOutIcon';
import SaveIcon from '../icons/SaveIcon';
import CheckIcon from '../icons/CheckIcon';
import LogoIcon from '../icons/LogoIcon';
import UserIcon from '../icons/UserIcon';


interface HeaderProps {
    name: string;
    onSignOut: () => void;
    onSave: () => void;
    saveStatus: SaveStatus;
    template: TemplateTheme;
    navLinks: { to: string, text: string }[];
    isEditorOpen: boolean;
    setIsEditorOpen: (isOpen: boolean) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onDownload: () => void;
    onDeploy: () => void;
    isExporting?: boolean;
}

export const themeStyles: Record<TemplateTheme, {
    headerBg: string; border: string; nameText: string; linkHover: string; linkActive: string; linkInactive: string; linkActiveText: string;
}> = {
    tech: { headerBg: 'bg-primary/50 backdrop-blur-lg', border: 'border-white/10', nameText: 'text-white', linkHover: 'hover:bg-white/10 hover:text-white', linkActive: 'bg-accent', linkInactive: 'text-gray-300', linkActiveText: 'text-white' },
    professional: { headerBg: 'bg-prof-secondary/80 dark:bg-prof-dark-secondary/80 backdrop-blur-lg', border: 'border-prof-primary dark:border-prof-dark-primary', nameText: 'text-prof-accent', linkHover: 'hover:bg-prof-primary dark:hover:bg-prof-dark-primary', linkActive: 'bg-prof-accent', linkInactive: 'text-gray-600 dark:text-gray-300', linkActiveText: 'text-prof-secondary' },
    creative: { headerBg: 'bg-creative-secondary/80 dark:bg-creative-dark-secondary/80 backdrop-blur-lg', border: 'border-creative-primary dark:border-creative-dark-primary', nameText: 'text-creative-accent', linkHover: 'hover:bg-creative-primary dark:hover:bg-creative-dark-primary', linkActive: 'bg-creative-accent', linkInactive: 'text-gray-600 dark:text-gray-300', linkActiveText: 'text-creative-secondary' },
    minimal: { headerBg: 'bg-minimal-secondary/80 dark:bg-minimal-dark-secondary/80 backdrop-blur-lg', border: 'border-minimal-primary dark:border-minimal-dark-primary', nameText: 'text-minimal-accent dark:text-gray-200', linkHover: 'hover:bg-minimal-primary dark:hover:bg-minimal-dark-primary', linkActive: 'bg-minimal-accent dark:bg-gray-200', linkInactive: 'text-gray-600 dark:text-gray-300', linkActiveText: 'text-minimal-secondary dark:text-minimal-dark' },
    executive: { headerBg: 'bg-executive-light/80 dark:bg-executive-secondary/80 backdrop-blur-lg', border: 'border-gray-200 dark:border-executive-primary', nameText: 'text-executive-accent', linkHover: 'hover:bg-gray-200 dark:hover:bg-executive-primary', linkActive: 'bg-executive-accent', linkInactive: 'text-executive-primary dark:text-gray-300', linkActiveText: 'text-white' },
    matrix: { headerBg: 'bg-matrix-bg/50 backdrop-blur-lg', border: 'border-matrix-accent/20', nameText: 'text-matrix-accent', linkHover: 'hover:bg-matrix-accent/10 hover:text-matrix-accent', linkActive: 'bg-matrix-accent text-matrix-bg', linkInactive: 'text-matrix-text-secondary', linkActiveText: 'text-matrix-bg' },
};

const getIconForLink = (text: string) => {
    switch(text.toLowerCase()) {
        case 'home': return <HomeIcon />;
        case 'experience': return <BriefcaseIcon />;
        case 'education': return <GraduationCapIcon />;
        case 'details': return <CodeIcon />;
        default: return null;
    }
}

const Header: React.FC<HeaderProps> = ({ name, onSignOut, onSave, saveStatus, template, navLinks, isEditorOpen, setIsEditorOpen, undo, redo, canUndo, canRedo, onDownload, onDeploy, isExporting }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const styles = themeStyles[template];
    const baseLinkClass = "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
    
    return (
        <header className={`${styles.headerBg} fixed top-0 left-0 right-0 z-50 border-b ${styles.border} ${isExporting ? '' : 'no-print'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <LogoIcon className={`h-7 w-7 ${template === 'matrix' ? 'text-matrix-accent' : 'text-accent'}`} />
                        <span className={`text-xl font-bold ${styles.nameText}`}>
                            {name.split(' ')[0]}
                        </span>
                    </div>
                    <div className="hidden md:block">
                        <nav className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link, index) => {
                                if (isExporting) {
                                    // For SPA export, first link is active, rest are inactive by default. JS will handle changes.
                                    const linkClasses = `${baseLinkClass} ${index === 0 ? `${styles.linkActive} ${styles.linkActiveText}` : `${styles.linkInactive} ${styles.linkHover}`}`;
                                    return (
                                         <a key={link.to} href={link.to} className={linkClasses}>
                                            {getIconForLink(link.text)} <span>{link.text}</span>
                                        </a>
                                    );
                                }
                                return (
                                    <NavLink key={link.to} to={link.to} className={({ isActive }) => `${baseLinkClass} ${isActive ? `${styles.linkActive} ${styles.linkActiveText}` : `${styles.linkInactive} ${styles.linkHover}`}`}>
                                        {getIconForLink(link.text)} <span>{link.text}</span>
                                    </NavLink>
                                )
                            })}
                        </nav>
                    </div>
                    {!isExporting && (
                         <div className="flex items-center space-x-1 sm:space-x-2">
                            <button onClick={() => setIsEditorOpen(!isEditorOpen)} className={`p-2 rounded-full ${isEditorOpen ? `${styles.linkActive} ${styles.linkActiveText}` : `${styles.linkInactive} ${styles.linkHover}`}`} aria-label="Edit Portfolio">
                               <EditIcon />
                            </button>
                            <button onClick={undo} disabled={!canUndo} className={`p-2 rounded-full ${styles.linkInactive} ${styles.linkHover} disabled:opacity-50 disabled:cursor-not-allowed`} aria-label="Undo">
                               <UndoIcon />
                            </button>
                            <button onClick={redo} disabled={!canRedo} className={`p-2 rounded-full ${styles.linkInactive} ${styles.linkHover} disabled:opacity-50 disabled:cursor-not-allowed`} aria-label="Redo">
                               <RedoIcon />
                            </button>

                            <button 
                                onClick={onSave}
                                disabled={saveStatus !== 'idle'}
                                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${saveStatus === 'saved' ? 'bg-green-500 text-white' : `bg-white/5 ${styles.linkInactive} ${styles.linkHover} disabled:opacity-70`}`}
                            >
                                {saveStatus === 'saving' && <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>}
                                {saveStatus === 'saved' && <CheckIcon />}
                                {saveStatus === 'idle' && <SaveIcon />}
                                <span className="hidden sm:inline">
                                    {saveStatus === 'idle' ? 'Save' : saveStatus === 'saving' ? 'Saving...' : 'Saved!'}
                                </span>
                            </button>

                            <div className={`h-6 w-px ${template === 'matrix' ? 'bg-matrix-accent/20' : 'bg-white/20'}`}></div>

                            <button onClick={onDownload} className={`p-2 rounded-full ${styles.linkInactive} ${styles.linkHover}`} aria-label="Download Portfolio">
                                <DownloadIcon />
                            </button>
                            <button onClick={onDeploy} className={`p-2 rounded-full ${styles.linkInactive} ${styles.linkHover}`} aria-label="Deploy Portfolio">
                                <DeployIcon />
                            </button>
                            
                            <div className={`h-6 w-px ${template === 'matrix' ? 'bg-matrix-accent/20' : 'bg-white/20'}`}></div>

                            <NavLink to="/profile" className={({ isActive }) => `p-2 rounded-full ${isActive ? `${styles.linkActive} ${styles.linkActiveText}` : `${styles.linkInactive} ${styles.linkHover}`}`} aria-label="My Profile">
                                <UserIcon />
                            </NavLink>
                            <button onClick={onSignOut} className={`p-2 rounded-full ${styles.linkInactive} ${styles.linkHover}`} aria-label="Sign Out">
                                <SignOutIcon />
                            </button>

                            <div className="-mr-2 flex md:hidden">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 rounded-md inline-flex items-center justify-center ${styles.linkInactive} ${styles.linkHover}`}>
                                    <span className="sr-only">Open main menu</span>
                                    <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                                    <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isMenuOpen && !isExporting && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(link => (
                           <NavLink key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `${baseLinkClass} w-full ${isActive ? `${styles.linkActive} ${styles.linkActiveText}` : `${styles.linkInactive} ${styles.linkHover}`}`}>
                               {getIconForLink(link.text)} <span>{link.text}</span>
                           </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;