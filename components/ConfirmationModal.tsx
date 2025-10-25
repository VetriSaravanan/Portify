import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}) => {
    if (!isOpen) return null;

    return (
        <div 
            className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div className="bg-secondary/50 backdrop-blur-2xl border border-white/10 text-white rounded-2xl shadow-2xl w-full max-w-md p-8 m-4 transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-red-400">{title}</h2>
                <p className="mt-4 text-gray-300">{message}</p>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md font-semibold bg-white/10 hover:bg-white/20 transition-colors">
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-md font-semibold bg-red-600 hover:bg-red-500 transition-colors">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;