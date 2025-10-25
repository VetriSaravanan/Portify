
import React from 'react';
import type { ResumeData, TemplateTheme, SectionType } from '../../types';
import Header, { themeStyles } from './Header';
import HomePage from './HomePage';
import ExperiencePage from './ExperiencePage';
import EducationPage from './EducationPage';
import SkillsProjectsPage from './SkillsProjectsPage';

interface PortfolioExportProps {
    resumeData: ResumeData;
    template: TemplateTheme;
    isDarkMode: boolean;
}

const getSPARouterScript = (template: TemplateTheme): string => {
    const styles = themeStyles[template];
    const activeClasses = `${styles.linkActive} ${styles.linkActiveText}`.trim();
    const inactiveClasses = `${styles.linkInactive} ${styles.linkHover}`.trim();

    const allClasses = new Set<string>();
    Object.values(themeStyles).forEach(theme => {
        `${theme.linkActive} ${theme.linkActiveText} ${theme.linkInactive} ${theme.linkHover}`
            .split(' ')
            .filter(Boolean)
            .forEach(cls => allClasses.add(cls));
    });
    const allPossibleClasses = JSON.stringify(Array.from(allClasses));

    return `
function showPage(pageId) {
    var targetPageId = pageId || 'home';
    document.querySelectorAll('[data-page]').forEach(function(p) {
        p.style.display = p.getAttribute('data-page') === targetPageId ? 'block' : 'none';
    });
    
    var navLinks = document.querySelectorAll('header nav a');
    var activeClasses = '${activeClasses}'.split(' ').filter(Boolean);
    var inactiveClasses = '${inactiveClasses}'.split(' ').filter(Boolean);
    var allPossibleClasses = ${allPossibleClasses};

    navLinks.forEach(function(link) {
        var linkHref = link.getAttribute('href') || '';
        var linkPageId = linkHref.replace('#/', '') || 'home';
        
        link.classList.remove.apply(link.classList, allPossibleClasses);

        if (linkPageId === targetPageId) {
            link.classList.add.apply(link.classList, activeClasses);
        } else {
            link.classList.add.apply(link.classList, inactiveClasses);
        }
    });
    window.scrollTo(0, 0);
}

function handleRouteChange() {
    var hash = window.location.hash || '#/';
    var pageId = hash.substring(2);
    showPage(pageId);
}

window.addEventListener('hashchange', handleRouteChange);
document.addEventListener('DOMContentLoaded', function() {
    handleRouteChange();
});
    `;
};


const PortfolioExport: React.FC<PortfolioExportProps> = ({ resumeData, template, isDarkMode }) => {
    const { name, title, sectionOrder } = resumeData;

    const backgroundClass = (() => {
        switch (template) {
            case 'tech':
                return 'bg-tech-secondary text-tech-light font-sans';
            case 'professional':
                return isDarkMode
                    ? 'bg-prof-dark-secondary text-gray-200 font-serif'
                    : 'bg-prof-secondary text-prof-dark font-serif';
            case 'creative':
                return isDarkMode
                    ? 'bg-creative-dark-secondary text-gray-200 font-sans'
                    : 'bg-creative-secondary text-creative-dark font-sans';
            case 'minimal':
                return isDarkMode
                    ? 'bg-minimal-dark-secondary text-gray-200 font-sans'
                    : 'bg-minimal-secondary text-minimal-dark font-sans';
            case 'executive':
                return isDarkMode
                    ? 'bg-executive-secondary text-executive-light font-serif'
                    : 'bg-executive-light text-executive-primary font-serif';
            case 'matrix':
                return 'matrix-bg text-matrix-text font-mono';
            default:
                return 'bg-primary text-gray-200'; // Fallback
        }
    })();
    
    const spaNavLinks = [{ to: "#/", text: "Home" }];
    sectionOrder.forEach(sectionId => {
        switch(sectionId) {
            case 'experience':
                if (resumeData.experience?.length > 0) spaNavLinks.push({ to: '#/experience', text: 'Experience' });
                break;
            case 'education':
                if (resumeData.education?.length > 0) spaNavLinks.push({ to: '#/education', text: 'Education' });
                break;
            case 'details':
                spaNavLinks.push({ to: '#/details', text: 'Details' });
                break;
        }
    });

    const htmlClass = isDarkMode ? 'dark' : '';
    
    const renderPageContent = (page: 'home' | SectionType) => {
        switch(page) {
            case 'home':
                return <HomePage data={resumeData} setResumeData={() => {}} template={template} isEditing={false} isExporting={true} />;
            case 'experience':
                 if (!resumeData.experience?.length) return null;
                return <ExperiencePage data={resumeData.experience} resumeData={resumeData} setResumeData={() => {}} template={template} isEditing={false} isExporting={true} />;
            case 'education':
                if (!resumeData.education?.length) return null;
                return <EducationPage data={resumeData.education} resumeData={resumeData} setResumeData={() => {}} template={template} isEditing={false} isExporting={true} />;
            case 'details':
                return <SkillsProjectsPage data={resumeData} resumeData={resumeData} setResumeData={() => {}} template={template} isEditing={false} isExporting={true} />;
            default:
                return null;
        }
    };

    return (
        <html lang="en" className={htmlClass}>
        <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{`${name} | ${title}`}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400..700;1,400..700&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
            <script src="https://cdn.tailwindcss.com"></script>
            <script dangerouslySetInnerHTML={{ __html: `
                tailwind.config = {
                    darkMode: 'class',
                    theme: {
                        extend: {
                            fontFamily: {
                                sans: ['Inter', 'sans-serif'],
                                serif: ['Lora', 'serif'],
                                mono: ['Roboto Mono', 'monospace'],
                            },
                             colors: {
                                // Tech Theme
                                'tech-primary': '#1c1827',    
                                'tech-secondary': '#030014', 
                                'tech-accent': '#8b5cf6',     
                                'tech-light': '#F9FAFB',
                                'accent': '#8b5cf6',

                                // Professional Theme
                                'prof-primary': '#E5E7EB',    
                                'prof-secondary': '#FFFFFF', 
                                'prof-accent': '#3B82F6',     
                                'prof-dark': '#1F2937', 
                                'prof-dark-primary': '#4B5563',
                                'prof-dark-secondary': '#374151',
                                
                                // Creative Theme
                                'creative-primary': '#F3E8FF', 
                                'creative-secondary': '#FFFFFF',
                                'creative-accent': '#9333EA',  
                                'creative-dark': '#1E293B',
                                'creative-dark-primary': '#5B21B6',
                                'creative-dark-secondary': '#4C1D95',
                                
                                // Minimal Theme
                                'minimal-primary': '#F3F4F6',
                                'minimal-secondary': '#FFFFFF',
                                'minimal-accent': '#111827', 
                                'minimal-dark': '#111827',
                                'minimal-dark-primary': '#374151',
                                'minimal-dark-secondary': '#1F2937',
                                
                                // Executive Theme
                                'executive-primary': '#1E293B',    
                                'executive-secondary': '#0F172A',  
                                'executive-accent': '#F59E0B',     
                                'executive-light': '#F1F5F9',

                                // Matrix Theme
                                'matrix-bg': '#010402',
                                'matrix-bg-secondary': '#0a0a0a',
                                'matrix-accent': '#00ff41',
                                'matrix-text': '#c5fbd1',
                                'matrix-text-secondary': '#8c8c8c',
                            },
                        }
                    }
                }
            `}} />
            {/* Fix: Using dangerouslySetInnerHTML for the style tag to prevent JSX parsing issues with CSS syntax. */}
            <style dangerouslySetInnerHTML={{ __html: `
                body {
                    font-family: 'Inter', sans-serif;
                }
                 .matrix-bg {
                    background-color: #010402;
                    background-image: 
                        linear-gradient(rgba(0, 255, 65, 0.07) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 255, 65, 0.07) 1px, transparent 1px);
                    background-size: 3rem 3rem;
                    background-position: center center;
                }
            `}} />
        </head>
        <body className={`min-h-screen ${backgroundClass}`}>
            <Header 
                name={resumeData.name} 
                onSignOut={() => {}}
                onSave={() => {}}
                saveStatus='idle'
                template={template} 
                navLinks={spaNavLinks}
                isEditorOpen={false}
                setIsEditorOpen={() => {}}
                undo={() => {}}
                redo={() => {}}
                canUndo={false}
                canRedo={false}
                onDownload={() => {}}
                onDeploy={() => {}}
                isExporting={true}
            />
             <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div data-page="home">{renderPageContent('home')}</div>
                <div data-page="experience" style={{display: 'none'}}>{renderPageContent('experience')}</div>
                <div data-page="education" style={{display: 'none'}}>{renderPageContent('education')}</div>
                <div data-page="details" style={{display: 'none'}}>{renderPageContent('details')}</div>
            </main>
            <script dangerouslySetInnerHTML={{ __html: getSPARouterScript(template) }} />
        </body>
        </html>
    );
};

export default PortfolioExport;
