import type React from 'react';

export interface Contact {
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
}

export interface Experience {
    id: string;
    role: string;
    company: string;
    dates: string;
    description: string[];
    confidence?: number;
}

export interface Education {
    id:string;
    institution: string;
    degree: string;
    dates: string;
    details?: string;
    confidence?: number;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
    confidence?: number;
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    date: string;
    confidence?: number;
}

export interface VolunteerWork {
    id: string;
    organization: string;
    role: string;
    dates: string;
    description: string[];
    confidence?: number;
}

export interface Publication {
    id: string;
    title: string;
    publisher: string;
    date: string;
    link?: string;
    description?: string;
    confidence?: number;
}

export interface Language {
    id: string;
    name: string;
    proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface Deployment {
    id: string;
    portfolio_id: string;
    user_id: string;
    url: string;
    created_at: string;
}

export type TemplateTheme = 'tech' | 'professional' | 'creative' | 'minimal' | 'executive' | 'matrix';

export type SectionType = 'experience' | 'education' | 'details';

export interface ResumeData {
    name: string;
    title: string;
    summary: string;
    contact: Contact;
    experience: Experience[];
    education: Education[];
    skills: { id: string, name: string }[];
    projects: Project[];
    certifications: Certification[];
    volunteerWork?: VolunteerWork[];
    publications?: Publication[];
    languages?: Language[];
    hobbies?: { id: string, name: string }[];
    overallConfidence?: number;
    // User customizations
    sectionOrder: SectionType[];
}