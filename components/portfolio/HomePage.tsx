import React from 'react';
import type { ResumeData, TemplateTheme } from '../../types';
import MailIcon from '../icons/MailIcon';
import PhoneIcon from '../icons/PhoneIcon';
import MapPinIcon from '../icons/MapPinIcon';
import EditableField from '../../EditableField';
import GithubIcon from '../icons/GithubIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import WebsiteIcon from '../icons/WebsiteIcon';

interface HomePageProps {
    data: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
    template: TemplateTheme;
    isEditing: boolean;
    isExporting?: boolean;
}

const themeStyles: Record<TemplateTheme, {
    title: string; subtitle: string; sectionHeader: string; text: string; cardBg: string; link: string;
}> = {
    tech: { title: 'text-white font-sans', subtitle: 'text-accent font-sans', sectionHeader: 'text-accent border-white/10', text: 'text-gray-300', cardBg: 'bg-white/5 border border-white/10', link: 'text-accent hover:underline' },
    professional: { title: 'text-prof-dark dark:text-gray-100', subtitle: 'text-prof-accent', sectionHeader: 'text-prof-accent border-prof-primary dark:border-prof-dark-primary', text: 'text-gray-600 dark:text-gray-300', cardBg: 'bg-prof-primary dark:bg-prof-dark-primary', link: 'text-prof-accent hover:underline' },
    creative: { title: 'text-creative-dark dark:text-gray-100', subtitle: 'text-creative-accent', sectionHeader: 'text-creative-accent border-creative-primary dark:border-creative-dark-primary', text: 'text-gray-600 dark:text-gray-300', cardBg: 'bg-creative-primary dark:bg-creative-dark-primary', link: 'text-creative-accent hover:underline' },
    minimal: { title: 'text-minimal-dark dark:text-gray-100', subtitle: 'text-gray-500 dark:text-gray-400', sectionHeader: 'text-minimal-accent dark:text-gray-200 border-minimal-primary dark:border-minimal-dark-primary', text: 'text-gray-600 dark:text-gray-300', cardBg: 'bg-minimal-primary dark:bg-minimal-dark-primary', link: 'text-minimal-accent dark:text-gray-100 hover:underline' },
    executive: { title: 'text-executive-primary dark:text-executive-light font-serif', subtitle: 'text-executive-accent font-serif', sectionHeader: 'text-executive-accent border-gray-300 dark:border-executive-primary', text: 'text-executive-primary dark:text-gray-300', cardBg: 'bg-white dark:bg-executive-primary', link: 'text-executive-accent hover:underline' },
    matrix: { title: 'text-matrix-text', subtitle: 'text-matrix-accent', sectionHeader: 'text-matrix-accent border-matrix-accent/20', text: 'text-matrix-text-secondary', cardBg: 'bg-matrix-bg-secondary border border-matrix-accent/20', link: 'text-matrix-accent hover:underline' },
};

const HomePage: React.FC<HomePageProps> = ({ data, setResumeData, template, isEditing, isExporting }) => {
    const styles = themeStyles[template];
    const useAnimations = template === 'matrix' && !isExporting;

    const handleFieldChange = (field: keyof ResumeData) => (value: string) => {
        setResumeData(prevData => prevData ? { ...prevData, [field]: value } : null);
    };

    const ensureAbsoluteUrl = (url?: string): string => {
        if (!url) return '#';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    };

    return (
        <div className="space-y-12">
            <section 
                className={`text-center print-page-break ${useAnimations ? 'animate-on-scroll' : ''}`}
                style={useAnimations ? { transitionDelay: '100ms' } : {}}
            >
                <EditableField 
                    as="h1"
                    isEditing={isEditing}
                    isExporting={isExporting}
                    value={data.name}
                    onChange={handleFieldChange('name')}
                    className={`text-5xl md:text-7xl font-bold ${styles.title}`}
                />
                <EditableField
                    as="p"
                    isEditing={isEditing}
                    isExporting={isExporting}
                    value={data.title}
                    onChange={handleFieldChange('title')}
                    className={`mt-2 text-2xl md:text-3xl ${styles.subtitle}`}
                />
            </section>

            <section 
                className={`print-page-break ${useAnimations ? 'animate-on-scroll' : ''}`}
                style={useAnimations ? { transitionDelay: '200ms' } : {}}
            >
                <h2 className={`text-3xl font-bold mb-4 border-b-2 pb-2 ${styles.sectionHeader}`}>About Me</h2>
                <EditableField
                    as="textarea"
                    isEditing={isEditing}
                    isExporting={isExporting}
                    value={data.summary}
                    onChange={handleFieldChange('summary')}
                    className={`text-lg leading-relaxed ${styles.text}`}
                />
            </section>

            <section 
                className={useAnimations ? 'animate-on-scroll' : ''}
                style={useAnimations ? { transitionDelay: '300ms' } : {}}
            >
                <h2 className={`text-3xl font-bold mb-4 border-b-2 pb-2 ${styles.sectionHeader}`}>Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-lg">
                    {data.contact.email && (
                        <div className={`flex items-center space-x-3 p-4 rounded-lg ${styles.cardBg}`}>
                            <MailIcon className={styles.subtitle} />
                            <a href={`mailto:${data.contact.email}`} className={`${styles.link} transition-colors truncate`}>{data.contact.email}</a>
                        </div>
                    )}
                    {data.contact.phone && (
                        <div className={`flex items-center space-x-3 p-4 rounded-lg ${styles.cardBg}`}>
                            <PhoneIcon className={styles.subtitle} />
                            <span className={styles.text}>{data.contact.phone}</span>
                        </div>
                    )}
                    {data.contact.location && (
                        <div className={`flex items-center space-x-3 p-4 rounded-lg ${styles.cardBg}`}>
                            <MapPinIcon className={styles.subtitle} />
                            <span className={styles.text}>{data.contact.location}</span>
                        </div>
                    )}
                     {data.contact.linkedin && (
                        <div className={`flex items-center space-x-3 p-4 rounded-lg ${styles.cardBg}`}>
                            <LinkedInIcon className={styles.subtitle} />
                            <a href={ensureAbsoluteUrl(data.contact.linkedin)} target="_blank" rel="noopener noreferrer" className={`${styles.link} transition-colors truncate`}>{data.contact.linkedin.replace('https://www.','')}</a>
                        </div>
                    )}
                     {data.contact.github && (
                        <div className={`flex items-center space-x-3 p-4 rounded-lg ${styles.cardBg}`}>
                            <GithubIcon className={styles.subtitle} />
                            <a href={ensureAbsoluteUrl(data.contact.github)} target="_blank" rel="noopener noreferrer" className={`${styles.link} transition-colors truncate`}>{data.contact.github.replace('https://','')}</a>
                        </div>
                    )}
                     {data.contact.website && (
                        <div className={`flex items-center space-x-3 p-4 rounded-lg ${styles.cardBg}`}>
                             <WebsiteIcon className={styles.subtitle} />
                            <a href={ensureAbsoluteUrl(data.contact.website)} target="_blank" rel="noopener noreferrer" className={`${styles.link} transition-colors truncate`}>{data.contact.website.replace('https://','')}</a>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomePage;