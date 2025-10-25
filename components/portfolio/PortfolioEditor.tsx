import React, { useState } from 'react';
import type { ResumeData, TemplateTheme, SectionType } from '../../types';
import PaletteIcon from '../icons/PaletteIcon';
import SunIcon from '../icons/SunIcon';
import MoonIcon from '../icons/MoonIcon';
import PlusCircleIcon from '../icons/PlusCircleIcon';
import GripVerticalIcon from '../icons/GripVerticalIcon';

interface PortfolioEditorProps {
    isOpen: boolean;
    resumeData: ResumeData;
    setResumeData: (update: (prev: ResumeData | null) => ResumeData | null) => void;
    template: TemplateTheme;
    setTemplate: (theme: TemplateTheme) => void;
    isDarkMode: boolean;
    setIsDarkMode: (isDark: boolean) => void;
    onSectionOrderChange: (order: SectionType[]) => void;
}

const templates: { id: TemplateTheme; name: string }[] = [
    { id: 'tech', name: 'Tech' },
    { id: 'matrix', name: 'Matrix' },
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'executive', name: 'Executive' },
];

const Section: React.FC<{title: string; children: React.ReactNode;}> = ({ title, children }) => (
    <div className="border-t border-white/10 pt-4 mt-4">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input 
        {...props}
        className="w-full bg-secondary text-white px-3 py-2 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-tech-accent" 
    />
);

const SectionOrderManager: React.FC<{ order: SectionType[], onOrderChange: (order: SectionType[]) => void }> = ({ order, onOrderChange }) => {
    const [draggedItem, setDraggedItem] = useState<SectionType | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: SectionType) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetItem: SectionType) => {
        if (!draggedItem || draggedItem === targetItem) return;
        
        const currentIndex = order.indexOf(draggedItem);
        const targetIndex = order.indexOf(targetItem);
        
        const newOrder = [...order];
        newOrder.splice(currentIndex, 1);
        newOrder.splice(targetIndex, 0, draggedItem);
        
        onOrderChange(newOrder);
        setDraggedItem(null);
    };

    return (
        <div className="space-y-2">
            {order.map(section => (
                <div
                    key={section}
                    draggable
                    onDragStart={(e) => handleDragStart(e, section)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, section)}
                    className="flex items-center gap-2 p-2 bg-secondary rounded-md cursor-grab"
                >
                    <GripVerticalIcon className="text-gray-400" />
                    <span className="capitalize">{section}</span>
                </div>
            ))}
        </div>
    );
};

const PortfolioEditor: React.FC<PortfolioEditorProps> = (props) => {
    const { isOpen, setResumeData, template, setTemplate, isDarkMode, setIsDarkMode, onSectionOrderChange, resumeData } = props;

    const handleContactChange = (field: keyof ResumeData['contact']) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setResumeData(prevData => {
            if (!prevData) return null;
            return {
                ...prevData,
                contact: { ...prevData.contact, [field]: value }
            };
        });
    };
    
    // Helper type to get keys of resume data that are arrays with ID.
     type ArraySectionKey = {
      [K in keyof ResumeData]: NonNullable<ResumeData[K]> extends { id: string }[] ? K : never
    }[keyof ResumeData];


    const addNewItem = <K extends ArraySectionKey>(section: K) => {
        const newItem: any = { id: crypto.randomUUID() };
        // Define default values for new items
        switch(section) {
            case 'experience':
                newItem.role = "New Role"; newItem.company="Company"; newItem.dates="Date"; newItem.description = ["New Responsibility"];
                break;
            case 'education':
                 newItem.institution = "New Institution"; newItem.degree="Degree"; newItem.dates="Date"; newItem.details="Details";
                break;
            case 'projects':
                newItem.name = "New Project"; newItem.description="Description"; newItem.technologies=[]; newItem.link = "";
                break;
            case 'skills':
                 newItem.name = "New Skill";
                break;
            case 'certifications':
                newItem.name = "New Certification"; newItem.issuer = "Issuer"; newItem.date = "Date";
                break;
            case 'volunteerWork':
                newItem.organization = "Organization"; newItem.role = "Role"; newItem.dates = "Date"; newItem.description = ["Description"];
                break;
            case 'publications':
                newItem.title = "New Publication"; newItem.publisher = "Publisher"; newItem.date = "Date"; newItem.link = ""; newItem.description = "Description";
                break;
            case 'languages':
                newItem.name = "New Language"; newItem.proficiency = "Intermediate";
                break;
            case 'hobbies':
                newItem.name = "New Hobby";
                break;
        }
        
        setResumeData(prevData => {
            if (!prevData) return null;
            // Robustly handle adding to an array that might be null or undefined initially
            const currentSectionData = prevData[section] || [];
            return {
                ...prevData, 
                [section]: [...(currentSectionData as any[]), newItem]
            };
        });
    };


    return (
        <aside className={`no-print fixed top-0 left-0 h-full z-40 bg-primary text-white w-80 p-6 overflow-y-auto transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="pt-16">
                <h2 className="text-2xl font-bold text-tech-accent mb-6">Portfolio Editor</h2>
                
                <Section title="Global Styles">
                    <div className="flex items-center justify-between bg-secondary p-2 rounded-md">
                        <label htmlFor="theme" className="text-sm font-medium text-gray-300 flex items-center gap-2"><PaletteIcon /> Template</label>
                        <select id="theme" value={template} onChange={e => setTemplate(e.target.value as TemplateTheme)} className="bg-secondary border-white/20 rounded-md">
                            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                     <div className="flex items-center justify-between bg-secondary p-2 rounded-md">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">{isDarkMode ? <MoonIcon /> : <SunIcon />} Mode</label>
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className="px-3 py-1 bg-secondary rounded-md">{isDarkMode ? 'Dark' : 'Light'}</button>
                    </div>
                </Section>

                <Section title="Section Order">
                    <SectionOrderManager order={resumeData.sectionOrder} onOrderChange={onSectionOrderChange} />
                </Section>

                <Section title="Contact Information">
                    <Input placeholder="Email" value={resumeData.contact.email || ''} onChange={handleContactChange('email')} />
                    <Input placeholder="Phone" value={resumeData.contact.phone || ''} onChange={handleContactChange('phone')} />
                    <Input placeholder="Location" value={resumeData.contact.location || ''} onChange={handleContactChange('location')} />
                    <Input placeholder="LinkedIn URL" value={resumeData.contact.linkedin || ''} onChange={handleContactChange('linkedin')} />
                    <Input placeholder="GitHub URL" value={resumeData.contact.github || ''} onChange={handleContactChange('github')} />
                    <Input placeholder="Website URL" value={resumeData.contact.website || ''} onChange={handleContactChange('website')} />
                </Section>
                
                <Section title="Add New Content">
                    <button onClick={() => addNewItem('experience')} className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-secondary"><PlusCircleIcon /> Add Experience</button>
                    <button onClick={() => addNewItem('education')} className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-secondary"><PlusCircleIcon /> Add Education</button>
                    <button onClick={() => addNewItem('skills')} className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-secondary"><PlusCircleIcon /> Add Skill</button>
                    <button onClick={() => addNewItem('projects')} className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-secondary"><PlusCircleIcon /> Add Project</button>
                    <button onClick={() => addNewItem('certifications')} className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-secondary"><PlusCircleIcon /> Add Certification</button>
                    <button onClick={() => addNewItem('volunteerWork')} className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-secondary"><PlusCircleIcon /> Add Volunteer Work</button>
                    <button onClick={() => addNewItem('publications')} className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-secondary"><PlusCircleIcon /> Add Publication</button>
                    <button onClick={() => addNewItem('languages')} className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-secondary"><PlusCircleIcon /> Add Language</button>
                    <button onClick={() => addNewItem('hobbies')} className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-secondary"><PlusCircleIcon /> Add Hobby</button>
                </Section>

            </div>
        </aside>
    );
};

export default PortfolioEditor;