import React from 'react';

const AnimatedBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 -z-10 h-full w-full bg-primary overflow-hidden">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl opacity-50 animate-aurora"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/30 rounded-full filter blur-3xl opacity-50 animate-aurora animation-delay-3000"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-500/20 rounded-full filter blur-3xl opacity-40 animate-aurora animation-delay-6000"></div>
        </div>
    );
};

export default AnimatedBackground;