import React, { useEffect, useState } from 'react';
import type { NotificationType } from '../App';

interface NotificationProps {
    notification: NotificationType | null;
}

const Notification: React.FC<NotificationProps> = ({ notification }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [notification]);

    if (!notification) return null;

    const baseClasses = "fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-2xl text-white font-semibold transition-all duration-300 transform";
    const styleClasses = {
        success: "bg-green-500/80 backdrop-blur-sm border border-green-400/50",
        error: "bg-red-500/80 backdrop-blur-sm border border-red-400/50",
    };
    const visibilityClasses = isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5";

    return (
        <div className={`${baseClasses} ${styleClasses[notification.type]} ${visibilityClasses}`}>
            {notification.message}
        </div>
    );
};

export default Notification;