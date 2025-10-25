import React from 'react';

const DatabaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M3 5v14a9 3 0 009 3 9 3 0 009-3V5"></path>
        <path d="M3 12a9 3 0 009 3 9 3 0 009-3"></path>
    </svg>
);

export default DatabaseIcon;
