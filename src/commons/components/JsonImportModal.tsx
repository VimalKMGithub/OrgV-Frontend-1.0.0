import { useRef, type ChangeEvent } from 'react';
import Modal from './Modal';
import Button from './Button';
import { handleJsonFileRead } from '../utils/fileUtility';

interface JsonImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: () => void;
    jsonInput: string;
    setJsonInput: (value: string) => void;
    title?: string;
    placeholder?: string;
}

const JsonImportModal = ({
    isOpen,
    onClose,
    onImport,
    jsonInput,
    setJsonInput,
    title = "Import from JSON",
    placeholder = '[\n    "item1",\n    "item2"\n]'
}: JsonImportModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleJsonFileRead(event, (content) => {
            setJsonInput(content);
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onImport}>
                        Import
                    </Button>
                </>
            }
        >
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Paste a JSON array or upload a file.
                    </p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".json,application/json"
                        className="hidden"
                    />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        Upload JSON File
                    </Button>
                </div>
                <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full h-64 p-3 border border-slate-300 dark:border-slate-600 rounded-md font-mono text-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-white"
                    placeholder={placeholder}
                />
            </div>
        </Modal>
    );
};

export default JsonImportModal;
