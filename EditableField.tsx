import React, { useState, useEffect, useCallback } from 'react';

// Debounce hook
const useDebouncedCallback = (callback: (...args: any[]) => void, delay: number) => {
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Cleanup the timeout on component unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const debouncedCallback = useCallback((...args: any[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);

    return debouncedCallback;
};


interface EditableFieldProps {
    value: string;
    onChange: (value: string) => void;
    isEditing: boolean;
    as?: 'input' | 'textarea' | 'h1' | 'p' | 'h3' | 'li';
    className?: string;
    placeholder?: string;
    isExporting?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
    value,
    onChange,
    isEditing,
    as = 'p',
    className = '',
    placeholder = 'Enter value',
    isExporting = false,
}) => {
    const [internalValue, setInternalValue] = useState(value);

    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    const debouncedOnChange = useDebouncedCallback(onChange, 300);

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInternalValue(e.target.value);
        debouncedOnChange(e.target.value);
    };

    if (!isEditing || isExporting) { // Always render static if exporting
        const Tag = as === 'input' || as === 'textarea' ? 'p' : as;
        // The min-h-[1em] prevents the layout from collapsing when a field is empty
        return <Tag className={`${className} min-h-[1em]`}>{value}</Tag>;
    }

    const commonProps = {
        value: internalValue,
        onChange: handleValueChange,
        className: `bg-transparent border border-dashed border-gray-500 rounded-md p-1 w-full focus:outline-none focus:ring-2 focus:ring-opacity-50 ${className}`,
        placeholder,
    };

    if (as === 'textarea') {
        return <textarea {...commonProps} rows={Math.max(3, internalValue.split('\n').length)} />;
    }

    return <input type="text" {...commonProps} />;
};

export default EditableField;