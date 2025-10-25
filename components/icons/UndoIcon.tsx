
import React from 'react';
const UndoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 10v6a6 6 0 0 0 6 6h9"></path>
        <polyline points="7 14 3 10 7 6"></polyline>
    </svg>
);
export default UndoIcon;
