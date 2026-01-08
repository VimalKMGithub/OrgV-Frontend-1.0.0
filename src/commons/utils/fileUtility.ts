import type { ChangeEvent } from 'react';
import { toast } from 'sonner';

export const handleJsonFileRead = (
    event: ChangeEvent<HTMLInputElement>,
    onSuccess: (content: string) => void
) => {
    const file = event.target.files?.[0];
    if (!file) {
        return;
    }
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        toast.error('Please select a valid JSON file.');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target?.result as string;
        onSuccess(content);
        event.target.value = '';
    };
    reader.onerror = () => {
        toast.error('Failed to read file.');
    };
    reader.readAsText(file);
};
