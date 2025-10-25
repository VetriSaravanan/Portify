import React, { useState } from 'react';

type DraggableListProps<T extends { id: string }> = {
    items: T[] | undefined;
    setItems: (items: T[]) => void;
    isEditing: boolean;
    isExporting?: boolean;
    children: (item: T, index: number) => React.ReactNode;
    className?: string;
};

function DraggableList<T extends { id: string }>({
    items,
    setItems,
    isEditing,
    isExporting,
    children,
    className
}: DraggableListProps<T>) {
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
        if (!isEditing || isExporting) return;
        e.dataTransfer.effectAllowed = 'move';
        setDraggedItemId(id);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
        if (!isEditing || isExporting) return;
        e.preventDefault();
        setDragOverId(id);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        setDragOverId(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
        if (!isEditing || isExporting || draggedItemId === null || draggedItemId === targetId) return;
        e.preventDefault();
        
        if(!items) return;

        const draggedIndex = items.findIndex(item => item.id === draggedItemId);
        const targetIndex = items.findIndex(item => item.id === targetId);
        
        if (draggedIndex < 0 || targetIndex < 0) return;

        const newItems = [...items];
        const [draggedItem] = newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, draggedItem);
        
        setItems(newItems);
        setDraggedItemId(null);
        setDragOverId(null);
    };

    return (
        <div className={className}>
            {(items || []).map((item, index) => {
                 const isDraggingOver = dragOverId === item.id && draggedItemId !== item.id;
                 return (
                     <div
                        key={item.id}
                        draggable={isEditing && !isExporting}
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onDragOver={(e) => handleDragOver(e, item.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, item.id)}
                        className={`
                            transition-all duration-200 
                            ${(isEditing && !isExporting) ? 'cursor-grab' : ''}
                            ${draggedItemId === item.id ? 'opacity-50 scale-95' : 'opacity-100'}
                            ${isDraggingOver ? 'bg-accent/10 ring-2 ring-accent ring-inset rounded-lg' : ''}
                        `}
                    >
                        {children(item, index)}
                    </div>
                );
            })}
        </div>
    );
}

export default DraggableList;