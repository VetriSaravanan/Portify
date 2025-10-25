
import React, { useState } from 'react';
import type { TemplateTheme } from '../../types';
import SunIcon from '../icons/SunIcon';
import MoonIcon from '../icons/MoonIcon';

interface DownloadModalProps {
    onClose: () => void;
    onDownload: (template: TemplateTheme, isDarkMode: boolean) => void;
    currentTemplate: TemplateTheme;
    isDarkMode: boolean;
}

const templates: { id: TemplateTheme; name: string; isDarkByDefault: boolean; }[] = [
    { id: 'tech', name: 'Tech', isDarkByDefault: true },
    { id: 'matrix', name: 'Matrix', isDarkByDefault: true },
    { id: 'professional', name: 'Professional', isDarkByDefault: false },
    { id: 'creative', name: 'Creative', isDarkByDefault: false },
    { id: 'minimal', name: 'Minimal', isDarkByDefault: false },
    { id: 'executive', name: 'Executive', isDarkByDefault: true },
];

const templatePreviews: Record<TemplateTheme, { bg: string; accent: string; text: string; }> = {
    tech: { bg: 'bg-tech-secondary', accent: 'bg-tech-accent', text: 'text-tech-light' },
    professional: { bg: 'bg-prof-secondary', accent: 'bg-prof-accent', text: 'text-prof-dark' },
    creative: { bg: 'bg-creative-secondary', accent: 'bg-creative-accent', text: 'text-creative-dark' },
    minimal: { bg: 'bg-minimal-secondary', accent: 'bg-minimal-accent', text: 'text-minimal-dark' },
    executive: { bg: 'bg-executive-secondary', accent: 'bg-executive-accent', text: 'text-executive-light' },
    matrix: { bg: 'bg-matrix-bg', accent: 'bg-matrix-accent', text: 'text-matrix-text' },
};

const DownloadModal: React.FC<DownloadModalProps> = ({ onClose, onDownload, currentTemplate, isDarkMode }) => {
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateTheme>(currentTemplate);
    const [selectedIsDark, setSelectedIsDark] = useState(isDarkMode);

    const handleTemplateSelect = (templateId: TemplateTheme) => {
        setSelectedTemplate(templateId);
        // Set dark mode based on template default
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setSelectedIsDark(template.isDarkByDefault);
        }
    };

    const handleDownloadClick = () => {
        onDownload(selectedTemplate, selectedIsDark);
    };

    return (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-secondary/50 backdrop-blur-2xl border border-white/10 text-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 m-4 transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-accent">Download Your Portfolio</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl" aria-label="Close modal">&times;</button>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">1. Choose a Template</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {templates.map(template => (
                                <button key={template.id} onClick={() => handleTemplateSelect(template.id)} className={`p-2 rounded-lg border-2 transition-all ${selectedTemplate === template.id ? 'border-accent scale-105' : 'border-gray-600 hover:border-gray-500'}`}>
                                    <div className={`h-24 rounded-md flex flex-col justify-between p-2 ${templatePreviews[template.id].bg}`}>
                                        <div className={`w-3/4 h-2 rounded ${templatePreviews[template.id].accent}`}></div>
                                        <div className="space-y-1">
                                            <div className="h-1 bg-gray-400 rounded w-full"></div>
                                            <div className="h-1 bg-gray-400 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                    <p className={`mt-2 text-sm font-semibold ${selectedTemplate === template.id ? 'text-accent' : 'text-gray-300'}`}>{template.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-3">2. Select Mode</h3>
                         <div className="flex space-x-2 bg-black/20 p-1 rounded-lg">
                            <button onClick={() => setSelectedIsDark(false)} className={`w-full flex items-center justify-center gap-2 py-2 rounded-md transition-colors ${!selectedIsDark ? 'bg-accent text-white' : 'hover:bg-white/10'}`}>
                               <SunIcon /> Light
                            </button>
                             <button onClick={() => setSelectedIsDark(true)} className={`w-full flex items-center justify-center gap-2 py-2 rounded-md transition-colors ${selectedIsDark ? 'bg-accent text-white' : 'hover:bg-white/10'}`}>
                               <MoonIcon /> Dark
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                    <button onClick={handleDownloadClick} className="w-full bg-accent text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent/50">
                        Download .zip File
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DownloadModal;