
import React from 'react';
const PaletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.667 0-.424-.108-.83-.318-1.195a2.441 2.441 0 0 1-.97-1.51c-.134-.66.388-1.312 1.054-1.446.66-.133 1.31.388 1.445 1.054.14.69.837 1.21 1.55 1.056.69-.138 1.14- .83 1.04-1.543-.12-.87-.96-1.56-1.87-1.56H16.5c-1.38 0-2.5-1.12-2.5-2.5 0-1.18.82-2.17 1.9-2.42.96-.22 1.86.46 2.02 1.42.17.95.99 1.67 1.94 1.67h.06c1.38 0 2.5-1.12 2.5-2.5S21.38 2 20 2H12Z"></path>
    </svg>
);
export default PaletteIcon;
