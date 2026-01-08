import { FaSearch } from 'react-icons/fa';
import Button from '../../commons/components/Button';
import { type Permission } from '../../user/api/userApis';
import ToggleSwitch from '../../commons/components/ToggleSwitch';
import JsonImportModal from '../../commons/components/JsonImportModal';
import PermissionCard from '../../commons/components/PermissionCard';
import PageHeader from '../../commons/components/PageHeader';
import ReadPermissionsResult from '../../commons/components/ReadPermissionsResult';
import { useReadPermissions } from '../hooks/useReadPermissions';

const ReadPermissionsPage = () => {
    const {
        state,
        handleSubmit,
        handleJsonImport,
        setLeniency,
        setInput,
        setValidationError,
        setImportModalOpen,
        setJsonInput,
    } = useReadPermissions();

    const {
        isLoading,
        results,
        leniency,
        input,
        validationError,
        isImportModalOpen,
        jsonInput,
    } = state;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <PageHeader title="Read Permissions" backPath="/admin" backText="Back to Admin Panel" />
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Permission Names (space, comma, or new line separated)...
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
                        placeholder="CAN_READ_USER&#10;CAN_CREATE_USER"
                    />
                    {validationError && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {validationError}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <ToggleSwitch
                        label="Leniency Mode"
                        checked={leniency}
                        onChange={setLeniency}
                    />
                    <Button onClick={handleSubmit} isLoading={isLoading}>
                        <FaSearch className="mr-2" /> Read Permissions
                    </Button>
                </div>

                <ReadPermissionsResult result={results} />
            </div>

            {results && results.found_permissions && results.found_permissions.length > 0 && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            Found Permissions ({results.found_permissions.length})
                        </h2>

                        <div>
                            {results.found_permissions.map((permission: Permission) => (
                                <PermissionCard
                                    key={permission.permissionName}
                                    permission={permission}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isImportModalOpen && (
                <JsonImportModal
                    isOpen={isImportModalOpen}
                    onClose={() => setImportModalOpen(false)}
                    onImport={handleJsonImport}
                    jsonInput={jsonInput}
                    setJsonInput={setJsonInput}
                    title="Import Permission Names from JSON"
                    placeholder={`[
    "PERMISSION_READ",
    "PERMISSION_WRITE"
]`}
                />
            )}
        </div>
    );
};

export default ReadPermissionsPage;
