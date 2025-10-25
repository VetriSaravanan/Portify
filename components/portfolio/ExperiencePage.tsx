import React from 'react';
import type { Experience, TemplateTheme, ResumeData } from '../../types';
import BriefcaseIcon from '../icons/BriefcaseIcon';
import EditableField from '../../EditableField';
import TrashIcon from '../icons/TrashIcon';
import GripVerticalIcon from '../icons/GripVerticalIcon';
import DraggableList from '../DraggableList';

interface ExperiencePageProps {
    data: Experience[];
    template: TemplateTheme;
    isEditing: boolean;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
    resumeData: ResumeData;
    isExporting?: boolean;
}

const themeStyles: Record<TemplateTheme, {
    header: string; border: string; iconBg: string; iconColor: string; ring: string; itemBg: string; date: string; title: string; subtitle: string; text: string;
}> = {
    tech: { header: 'text-accent border-white/10', border: 'border-white/10', iconBg: 'bg-accent', iconColor: 'text-white', ring: 'ring-primary', itemBg: 'bg-white/5 border border-white/10', date: 'text-gray-400', title: 'text-white', subtitle: 'text-accent', text: 'text-gray-300' },
    professional: { header: 'text-prof-accent border-prof-primary dark:border-prof-dark-primary', border: 'border-prof-primary dark:border-prof-dark-primary', iconBg: 'bg-prof-accent', iconColor: 'text-prof-secondary', ring: 'ring-prof-secondary dark:ring-prof-dark-secondary', itemBg: 'bg-prof-secondary dark:bg-prof-dark-primary border border-prof-primary dark:border-prof-dark-primary', date: 'text-gray-500 dark:text-gray-400', title: 'text-prof-dark dark:text-gray-100', subtitle: 'text-prof-accent', text: 'text-gray-600 dark:text-gray-300' },
    creative: { header: 'text-creative-accent border-creative-primary dark:border-creative-dark-primary', border: 'border-creative-accent dark:border-creative-dark-primary', iconBg: 'bg-creative-accent', iconColor: 'text-creative-secondary', ring: 'ring-creative-secondary dark:ring-creative-dark-secondary', itemBg: 'bg-creative-secondary dark:bg-creative-dark-primary shadow-lg border border-creative-primary dark:border-creative-dark-primary', date: 'text-gray-500 dark:text-gray-400', title: 'text-creative-dark dark:text-gray-100', subtitle: 'text-creative-accent', text: 'text-gray-600 dark:text-gray-300' },
    minimal: { header: 'text-minimal-accent dark:text-gray-200 border-minimal-primary dark:border-minimal-dark-primary', border: 'border-gray-300 dark:border-gray-600', iconBg: 'bg-minimal-accent dark:bg-gray-200', iconColor: 'text-minimal-secondary dark:text-minimal-dark', ring: 'ring-minimal-secondary dark:ring-minimal-dark-secondary', itemBg: 'bg-minimal-secondary dark:bg-minimal-dark-primary', date: 'text-gray-500 dark:text-gray-400', title: 'text-minimal-dark dark:text-gray-100', subtitle: 'text-gray-600 dark:text-gray-300', text: 'text-gray-700 dark:text-gray-200' },
    executive: { header: 'text-executive-accent border-gray-300 dark:border-executive-primary', border: 'border-executive-accent', iconBg: 'bg-executive-accent', iconColor: 'text-white dark:text-executive-secondary', ring: 'ring-executive-light dark:ring-executive-secondary', itemBg: 'bg-white dark:bg-executive-primary', date: 'text-gray-500 dark:text-gray-400', title: 'text-executive-primary dark:text-executive-light', subtitle: 'text-executive-accent', text: 'text-executive-primary dark:text-gray-300' },
    matrix: { header: 'text-matrix-accent border-matrix-accent/20', border: 'border-matrix-accent/30', iconBg: 'bg-matrix-accent', iconColor: 'text-matrix-bg', ring: 'ring-matrix-bg', itemBg: 'bg-matrix-bg-secondary/50 border border-matrix-accent/20 backdrop-blur-sm', date: 'text-matrix-text-secondary', title: 'text-matrix-text', subtitle: 'text-matrix-accent', text: 'text-matrix-text-secondary' },
};

const ExperiencePage: React.FC<ExperiencePageProps> = ({ data, template, isEditing, setResumeData, isExporting }) => {
    const styles = themeStyles[template];
    const useAnimations = template === 'matrix' && !isExporting;

    const handleFieldChange = (id: string, field: keyof Omit<Experience, 'description' | 'id'>) => (value: string) => {
        setResumeData(prevData => {
            if (!prevData) return null;
            const updatedExperience = prevData.experience.map(job =>
                job.id === id ? { ...job, [field]: value } : job
            );
            return { ...prevData, experience: updatedExperience };
        });
    };

    const handleDescriptionChange = (jobId: string, descIndex: number) => (newValue: string) => {
        setResumeData(prevData => {
            if (!prevData) return null;
            const updatedExperience = prevData.experience.map(job => {
                if (job.id === jobId) {
                    const newDescription = [...job.description];
                    newDescription[descIndex] = newValue;
                    return { ...job, description: newDescription };
                }
                return job;
            });
            return { ...prevData, experience: updatedExperience };
        });
    };

    const handleDelete = (id: string) => {
        setResumeData(prevData => {
            if (!prevData) return null;
            return { ...prevData, experience: prevData.experience.filter(job => job.id !== id) };
        });
    };

    const handleReorder = (newExperience: Experience[]) => {
        setResumeData(prev => prev ? { ...prev, experience: newExperience } : null);
    };

    return (
        <div className="print-page-break">
            <h1 className={`text-4xl font-bold mb-8 border-b-2 pb-4 ${styles.header} ${useAnimations ? 'animate-on-scroll' : ''}`}>Work Experience</h1>
            <div className={`relative border-l-2 pl-6 space-y-12 ${styles.border}`}>
                 <span className={`absolute -left-4 top-0 flex items-center justify-center w-8 h-8 rounded-full ring-8 ${styles.iconBg} ${styles.ring}`}>
                    <BriefcaseIcon className={`w-5 h-5 ${styles.iconColor}`} />
                </span>
                <DraggableList<Experience>
                    items={data}
                    setItems={handleReorder}
                    isEditing={isEditing}
                    isExporting={isExporting}
                >
                    {(job, index) => (
                        <div 
                            className={`relative ${useAnimations ? 'animate-on-scroll' : ''}`}
                            style={useAnimations ? { transitionDelay: `${100 + index * 100}ms` } : {}}
                        >
                            <div className={`absolute -left-[34px] mt-1.5 w-3 h-3 rounded-full border-2 ${styles.iconBg} ${template === 'tech' || template === 'executive' || template === 'matrix' ? 'border-matrix-bg' : 'border-white dark:border-gray-800'}`}></div>
                            <div className={`p-6 rounded-lg shadow-lg relative ${styles.itemBg}`}>
                                {isEditing && !isExporting && (
                                    <div className="absolute top-2 right-2 flex items-center gap-2">
                                        <button className="cursor-move p-1 text-gray-400 hover:text-white"><GripVerticalIcon /></button>
                                        <button onClick={() => handleDelete(job.id)} className="p-1 text-red-500 hover:text-red-400"><TrashIcon /></button>
                                    </div>
                                )}
                                <EditableField as="p" isEditing={isEditing} isExporting={isExporting} value={job.dates} onChange={handleFieldChange(job.id, 'dates')} className={`text-sm mb-1 ${styles.date}`} />
                                <EditableField as="h3" isEditing={isEditing} isExporting={isExporting} value={job.role} onChange={handleFieldChange(job.id, 'role')} className={`text-2xl font-bold ${styles.title}`} />
                                <EditableField as="p" isEditing={isEditing} isExporting={isExporting} value={job.company} onChange={handleFieldChange(job.id, 'company')} className={`text-lg mb-3 ${styles.subtitle}`} />
                                <ul className={`list-disc pl-5 space-y-2 ${styles.text}`}>
                                    {job.description.map((desc, i) => (
                                        <EditableField as="li" key={i} isEditing={isEditing} isExporting={isExporting} value={desc} onChange={handleDescriptionChange(job.id, i)} />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </DraggableList>
            </div>
        </div>
    );
};

export default ExperiencePage;