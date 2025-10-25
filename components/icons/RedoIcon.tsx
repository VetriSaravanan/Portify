
import React from 'react';
const RedoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 10v6a6 6 0 0 1-6 6H6"></path>
        <polyline points="17 14 21 10 17 6"></polyline>
    </svg>
);
export default RedoIcon;
