import { FaTrash } from 'react-icons/fa';
import Button from '../../commons/components/Button';
import ToggleSwitch from '../../commons/components/ToggleSwitch';
import JsonImportModal from '../../commons/components/JsonImportModal';
import PageHeader from '../../commons/components/PageHeader';
import DeleteUsersResult from '../../commons/components/DeleteUsersResult';
import { useDeleteUsers } from '../hooks/useDeleteUsers';

const DeleteUsersPage = () => {
    const {
        state,
        handleSubmit,
        handleJsonImport,
        setHardDelete,
        setLeniency,
        setInput,
        setValidationError,
        setImportModalOpen,
        setJsonInput
    } = useDeleteUsers();

    const {
        isLoading,
        results,
        hardDelete,
        leniency,
        input,
        validationError,
        isImportModalOpen,
        jsonInput
    } = state;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <PageHeader title="Delete Users" backPath="/admin" backText="Back to Admin Panel" />
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Usernames, Emails, or IDs (space, comma, or new line separated)...
                        </label>
                        <Button variant="outline" onClick={() => setImportModalOpen(true)}>
                            Import JSON
                        </Button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setValidationError(null);
                        }}
                        className={`w-full h-48 p-3 border rounded-md font-mono text-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-white ${validationError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                        placeholder="johndoe&#10;jane@example.com&#10;550e8400-e29b-41d4-a716-446655440000"
                    />
                    {validationError && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {validationError}
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <ToggleSwitch
                            label="Hard Delete (Permanent)"
                            checked={hardDelete}
                            onChange={setHardDelete}
                            color="red"
                        />

                        <ToggleSwitch
                            label="Leniency Mode"
                            checked={leniency}
                            onChange={setLeniency}
                        />
                    </div>

                    <Button onClick={handleSubmit} isLoading={isLoading} variant="danger">
                        <FaTrash className="mr-2" /> Delete Users
                    </Button>
                </div>

                <DeleteUsersResult result={results} />
            </div>

            {isImportModalOpen && (
                <JsonImportModal
                    isOpen={isImportModalOpen}
                    onClose={() => setImportModalOpen(false)}
                    onImport={handleJsonImport}
                    jsonInput={jsonInput}
                    setJsonInput={setJsonInput}
                    title="Import Identifiers from JSON"
                    placeholder={`[
    "johndoe",
    "jane@example.com",
    "550e8400-e29b-41d4-a716-446655440000"
]`}
                />
            )}
        </div>
    );
};

export default DeleteUsersPage;
