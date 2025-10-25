
import React, { useState, useEffect } from 'react';
import type { TemplateTheme } from '../types';

const themes: TemplateTheme[] = ['tech', 'matrix', 'professional', 'creative', 'minimal', 'executive'];

const InteractiveMockup: React.FC = () => {
    const [currentTheme, setCurrentTheme] = useState<TemplateTheme>('tech');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTheme(prevTheme => {
                const currentIndex = themes.indexOf(prevTheme);
                return themes[(currentIndex + 1) % themes.length];
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const themeStyles: Record<TemplateTheme, { bg: string, header: string, title: string, subtitle: string, text: string, card: string }> = {
        tech: { bg: 'bg-tech-secondary', header: 'bg-primary/50', title: 'text-white', subtitle: 'text-accent', text: 'text-gray-300', card: 'bg-white/5' },
        professional: { bg: 'bg-prof-secondary', header: 'bg-prof-secondary/80', title: 'text-prof-dark', subtitle: 'text-prof-accent', text: 'text-gray-600', card: 'bg-prof-primary' },
        creative: { bg: 'bg-creative-secondary', header: 'bg-creative-secondary/80', title: 'text-creative-dark', subtitle: 'text-creative-accent', text: 'text-gray-600', card: 'bg-creative-primary' },
        minimal: { bg: 'bg-minimal-secondary', header: 'bg-minimal-secondary/80', title: 'text-minimal-dark', subtitle: 'text-gray-500', text: 'text-gray-600', card: 'bg-minimal-primary' },
        executive: { bg: 'bg-executive-secondary', header: 'bg-executive-secondary/80', title: 'text-executive-light', subtitle: 'text-executive-accent', text: 'text-gray-300', card: 'bg-executive-primary' },
        matrix: { bg: 'bg-matrix-bg', header: 'bg-matrix-bg/50', title: 'text-matrix-text', subtitle: 'text-matrix-accent', text: 'text-matrix-text-secondary', card: 'bg-matrix-bg-secondary' },
    };

    const currentStyles = themeStyles[currentTheme];

    return (
        <div className="mt-16 relative group" style={{ perspective: '1500px' }}>
            <div className="absolute -inset-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative w-full max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-3 transform transition-transform duration-500 group-hover:rotate-x-3 group-hover:-translate-y-2" style={{ transformStyle: 'preserve-3d' }}>
                <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className={`w-full h-80 rounded-lg overflow-hidden transition-colors duration-500 ${currentStyles.bg}`}>
                    {/* Header */}
                    <div className={`h-12 p-3 flex justify-between items-center transition-colors duration-500 ${currentStyles.header}`}>
                        <div className={`w-20 h-5 rounded-md ${currentStyles.subtitle} transition-colors duration-500`}></div>
                        <div className="flex gap-2">
                            <div className={`w-16 h-5 rounded-md ${currentStyles.card} transition-colors duration-500`}></div>
                            <div className={`w-16 h-5 rounded-md ${currentStyles.card} transition-colors duration-500`}></div>
                            <div className={`w-16 h-5 rounded-md ${currentStyles.card} transition-colors duration-500`}></div>
                        </div>
                    </div>
                    {/* Body */}
                    <div className="p-6">
                        <div className={`h-8 w-1/2 rounded-md mb-2 ${currentStyles.title} transition-colors duration-500`}></div>
                        <div className={`h-5 w-1/3 rounded-md mb-6 ${currentStyles.subtitle} transition-colors duration-500`}></div>
                        <div className="space-y-2">
                            <div className={`h-3 w-full rounded-md ${currentStyles.text} transition-colors duration-500`}></div>
                            <div className={`h-3 w-5/6 rounded-md ${currentStyles.text} transition-colors duration-500`}></div>
                            <div className={`h-3 w-3/4 rounded-md ${currentStyles.text} transition-colors duration-500`}></div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <div className={`w-1/2 h-20 rounded-lg ${currentStyles.card} transition-colors duration-500`}></div>
                            <div className={`w-1/2 h-20 rounded-lg ${currentStyles.card} transition-colors duration-500`}></div>
                        </div>
                    </div>
                </div>
                 <div className="absolute bottom-4 right-4 flex gap-2 bg-black/30 backdrop-blur-sm p-1.5 rounded-full border border-white/10">
                    {themes.map(theme => (
                        <div key={theme} className={`w-5 h-5 rounded-full transition-all duration-300 ${currentTheme === theme ? 'bg-accent scale-125' : 'bg-gray-500'}`}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InteractiveMockup;