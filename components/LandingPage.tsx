
import React from 'react';
import LogoIcon from './icons/LogoIcon';
import UploadCloudIcon from './icons/UploadCloudIcon';
import Wand2Icon from './icons/Wand2Icon';
import LayoutTemplateIcon from './icons/LayoutTemplateIcon';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import DatabaseIcon from './icons/DatabaseIcon';
import GithubIcon from './icons/GithubIcon';
import HeroBackground from './ui/HeroBackground';
import InteractiveMockup from './InteractiveMockup';
import DownloadIcon from './icons/DownloadIcon';

interface LandingPageProps {
    onGetStarted: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 transform transition-transform duration-300 hover:-translate-y-2">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/20 mb-4">
            <div className="text-accent">{icon}</div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{children}</p>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="bg-primary min-h-screen text-white font-sans overflow-x-hidden">
            <HeroBackground />
            <header className="absolute top-0 left-0 right-0 p-6 z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <LogoIcon className="h-8 w-8 text-white" />
                        <span className="text-2xl font-bold">Reflect</span>
                    </div>
                    <button onClick={onGetStarted} className="bg-accent text-white hover:bg-accent/90 font-bold py-2 px-5 rounded-lg transition-colors">
                        Get Started
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-6 pt-32 pb-16 text-center relative z-10">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
                    From Resume to Website,<br />
                    <span className="text-accent">Instantly.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                    Upload your resume and let our Gemini-powered AI instantly generate a stunning, professional, and fully-editable portfolio website.
                </p>
                <button
                    onClick={onGetStarted}
                    className="bg-accent text-white hover:bg-accent/90 font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent/50 shadow-lg shadow-accent/20"
                >
                    <div className="flex items-center gap-3">
                        <UploadCloudIcon />
                        <span>Upload Your Resume & Begin</span>
                    </div>
                </button>

                <InteractiveMockup />
            </main>

            <section id="features" className="py-20 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold">The Future of Portfolio Creation</h2>
                        <p className="text-gray-400 mt-2">Everything you need to showcase your professional journey.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard icon={<Wand2Icon />} title="AI-Powered Parsing">
                            Our advanced AI, powered by Google's Gemini, intelligently extracts and structures your resume data with high accuracy.
                        </FeatureCard>
                        <FeatureCard icon={<LayoutTemplateIcon />} title="Beautiful Templates">
                            Choose from a variety of professionally designed templates. Switch styles and color modes with a single click.
                        </FeatureCard>
                         <FeatureCard icon={<ExternalLinkIcon />} title="One-Click Deploy">
                            Host your portfolio on Vercel to get a live, shareable URL.
                        </FeatureCard>
                         <FeatureCard icon={<DatabaseIcon />} title="Secure Cloud Storage">
                            Your portfolio is securely saved to your account. Edit and access it from anywhere, at any time.
                        </FeatureCard>
                        <FeatureCard icon={<GithubIcon />} title="Open Source">
                            Reflect is fully open-source. Feel free to explore the code, contribute, or self-host.
                        </FeatureCard>
                        <FeatureCard icon={<DownloadIcon />} title="Export Your Code">
                            Download your entire portfolio as a clean, production-ready single-page application built with TailwindCSS.
                        </FeatureCard>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/10 py-8">
                <div className="container mx-auto px-6 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Reflect. Built with Gemini & Supabase.</p>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;