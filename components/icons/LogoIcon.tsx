import React from 'react';

const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        {...props}
    >
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#a855f7', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor: '#6366f1', stopOpacity:1}} />
            </linearGradient>
        </defs>
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#grad1)" stroke="none"></path>
        <path d="M2 17l10 5 10-5" stroke="currentColor"></path>
        <path d="M2 12l10 5 10-5" stroke="currentColor"></path>
    </svg>
);

export default LogoIcon;