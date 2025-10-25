
import React from 'react';

const HeroBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 -z-10 h-full w-full bg-primary overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-purple-900/30 to-transparent -translate-y-1/2"></div>
            <div 
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle at 25% 30%, #8b5cf6, transparent 40%), radial-gradient(circle at 75% 70%, #6366f1, transparent 40%)',
                }}
            ></div>
             <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2rem),
                        repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent 2rem)
                    `,
                }}
            ></div>
        </div>
    );
};

export default HeroBackground;
