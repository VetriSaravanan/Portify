
import React from 'react';
import type { Education, TemplateTheme, ResumeData } from '../../types';
import GraduationCapIcon from '../icons/GraduationCapIcon';
import EditableField from '../../EditableField';
import TrashIcon from '../icons/TrashIcon';
import GripVerticalIcon from '../icons/GripVerticalIcon';
import DraggableList from '../DraggableList';

interface EducationPageProps {
    data: Education[];
    template: TemplateTheme;
    isEditing: boolean;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
    resumeData: ResumeData;
    isExporting?: boolean;
}

const themeStyles: Record<TemplateTheme, {
    header: string; itemBg: string; icon: string; date: string; title: string; subtitle: string; text: string;
}> = {
    tech: { header: 'text-accent border-white/10', itemBg: 'bg-white/5 border border-white/10', icon: 'text-accent', date: 'text-gray-400', title: 'text-white', subtitle: 'text-gray-300', text: 'text-gray-400' },
    professional: { header: 'text-prof-accent border-prof-primary dark:border-prof-dark-primary', itemBg: 'bg-prof-secondary dark:bg-prof-dark-primary border border-prof-primary dark:border-prof-dark-primary', icon: 'text-prof-accent', date: 'text-gray-500 dark:text-gray-400', title: 'text-prof-dark dark:text-gray-100', subtitle: 'text-gray-600 dark:text-gray-300', text: 'text-gray-500 dark:text-gray-400' },
    creative: { header: 'text-creative-accent border-creative-primary dark:border-creative-dark-primary', itemBg: 'bg-creative-primary/50 dark:bg-creative-dark-primary/50 border-l-4 border-creative-accent', icon: 'text-creative-accent', date: 'text-gray-500 dark:text-gray-400', title: 'text-creative-dark dark:text-gray-100', subtitle: 'text-gray-600 dark:text-gray-300', text: 'text-gray-500 dark:text-gray-400' },
    minimal: { header: 'text-minimal-accent dark:text-gray-200 border-minimal-primary dark:border-minimal-dark-primary', itemBg: 'bg-minimal-secondary dark:bg-minimal-dark-primary border-t border-minimal-primary dark:border-minimal-dark-primary', icon: 'text-minimal-accent dark:text-gray-200', date: 'text-gray-500 dark:text-gray-400', title: 'text-minimal-dark dark:text-gray-100', subtitle: 'text-gray-600 dark:text-gray-300', text: 'text-gray-500 dark:text-gray-400' },
    executive: { header: 'text-executive-accent border-gray-300 dark:border-executive-primary', itemBg: 'bg-white dark:bg-executive-primary', icon: 'text-executive-accent', date: 'text-gray-500 dark:text-gray-400', title: 'text-executive-primary dark:text-executive-light', subtitle: 'text-gray-600 dark:text-gray-300', text: 'text-gray-500 dark:text-gray-400' },
    matrix: { header: 'text-matrix-accent border-matrix-accent/20', itemBg: 'bg-matrix-bg-secondary/50 border border-matrix-accent/20 backdrop-blur-sm', icon: 'text-matrix-accent', date: 'text-matrix-text-secondary', title: 'text-matrix-text', subtitle: 'text-matrix-text-secondary', text: 'text-matrix-text-secondary' },
};

const EducationPage: React.FC<EducationPageProps> = ({ data, template, isEditing, setResumeData, isExporting }) => {
    const styles = themeStyles[template];
    const useAnimations = template === 'matrix' && !isExporting;

     const handleFieldChange = (id: string, field: keyof Education) => (value: string) => {
        setResumeData(prevData => {
            if (!prevData) return null;
            const updatedEducation = prevData.education.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            );
            return { ...prevData, education: updatedEducation };
        });
    };

    const handleDelete = (id: string) => {
        setResumeData(prevData => {
            if (!prevData) return null;
            return { ...prevData, education: prevData.education.filter(edu => edu.id !== id) };
        });
    };
    
    const handleReorder = (newEducation: Education[]) => {
        setResumeData(prev => prev ? { ...prev, education: newEducation } : null);
    };

    return (
        <div className="print-page-break">
            <h1 className={`text-4xl font-bold mb-8 border-b-2 pb-4 ${styles.header} ${useAnimations ? 'animate-on-scroll' : ''}`}>Education</h1>
            <DraggableList<Education>
                items={data}
                setItems={handleReorder}
                isEditing={isEditing}
                isExporting={isExporting}
                className="space-y-8"
            >
                {(edu, index) => (
                    <div 
                        className={`relative flex items-start space-x-4 p-6 rounded-lg shadow-lg ${styles.itemBg} ${useAnimations ? 'animate-on-scroll' : ''}`}
                        style={useAnimations ? { transitionDelay: `${100 + index * 100}ms` } : {}}
                    >
                        {isEditing && !isExporting && (
                            <div className="absolute top-2 right-2 flex items-center gap-2">
                                <button className="cursor-move p-1 text-gray-400 hover:text-white"><GripVerticalIcon /></button>
                                <button onClick={() => handleDelete(edu.id)} className="p-1 text-red-500 hover:text-red-400"><TrashIcon /></button>
                            </div>
                        )}
                        <div className="flex-shrink-0 mt-1">
                            <GraduationCapIcon className={`w-8 h-8 ${styles.icon}`} />
                        </div>
                        <div className="flex-grow">
                            <EditableField as="p" isEditing={isEditing} isExporting={isExporting} value={edu.dates} onChange={handleFieldChange(edu.id, 'dates')} className={`text-sm ${styles.date}`} />
                            <EditableField as="h3" isEditing={isEditing} isExporting={isExporting} value={edu.institution} onChange={handleFieldChange(edu.id, 'institution')} className={`text-2xl font-bold ${styles.title}`} />
                            <EditableField as="p" isEditing={isEditing} isExporting={isExporting} value={edu.degree} onChange={handleFieldChange(edu.id, 'degree')} className={`text-lg ${styles.subtitle}`} />
                            {edu.details && <EditableField as="p" isEditing={isEditing} isExporting={isExporting} value={edu.details} onChange={handleFieldChange(edu.id, 'details')} className={`text-md mt-1 ${styles.text}`} />}
                        </div>
                    </div>
                )}
            </DraggableList>
        </div>
    );
};

export default EducationPage;