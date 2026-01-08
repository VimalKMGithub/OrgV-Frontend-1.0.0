import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import Button from '../../commons/components/Button';
import { type RoleSummary } from '../api/adminApis';
import ToggleSwitch from '../../commons/components/ToggleSwitch';
import JsonImportModal from '../../commons/components/JsonImportModal';
import RoleCard from '../../commons/components/RoleCard';
import PageHeader from '../../commons/components/PageHeader';
import ReadRolesResult from '../../commons/components/ReadRolesResult';
import { useReadRoles } from '../hooks/useReadRoles';
import DeleteRolesModal from '../../commons/components/DeleteRolesModal';
import UpdateRolesModal from '../../commons/components/UpdateRolesModal';
import { useAuth } from '../../commons/contexts/AuthContext';
import { canDeleteRoles, canUpdateRoles } from '../../commons/utils/preAuthorizationUtility';

const ReadRolesPage = () => {
    const {
        state,
        handleSubmit,
        handleJsonImport,
        setLeniency,
        setInput,
        setImportModalOpen,
        setJsonInput,
        handleDeleteClick,
        handleBulkDeleteClick,
        handleUpdateClick,
        handleBulkUpdateClick,
        handleCheckboxChange,
        handleSelectAll,
        setDeleteModalOpen,
        setUpdateModalOpen,
        handleDeleteSuccess,
        handleUpdateSuccess
    } = useReadRoles();

    const { authorities } = useAuth();
    const canDelete = canDeleteRoles(authorities);
    const canUpdate = canUpdateRoles(authorities);
    const canSelect = canDelete || canUpdate;

    const {
        isLoading,
        results,
        leniency,
        input,
        validationError,
        isImportModalOpen,
        jsonInput,
        selectedRoleNames,
        isDeleteModalOpen,
        isUpdateModalOpen,
        rolesToDelete,
        rolesToUpdate
    } = state;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <PageHeader title="Read Roles" backPath="/admin" backText="Back to Admin Panel" />
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Role Names (space, comma, or new line separated)...
                        </label>
                        <Button variant="outline" onClick={() => setImportModalOpen(true)}>
                            Import JSON
                        </Button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={`w-full h-48 p-3 border rounded-md font-mono text-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-white ${validationError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                        placeholder="ROLE_USER&#10;ROLE_ADMIN"
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
                        <FaSearch className="mr-2" /> Read Roles
                    </Button>
                </div>

                <ReadRolesResult result={results} />
            </div>

            <div className="mb-6 flex justify-end gap-3">
                {selectedRoleNames.size > 0 && (
                    <>
                        {canDelete && (
                            <Button
                                variant="danger"
                                onClick={handleBulkDeleteClick}
                            >
                                <FaTrash className="mr-2" /> Delete Selected ({selectedRoleNames.size})
                            </Button>
                        )}
                        {canUpdate && (
                            <Button
                                variant="secondary"
                                onClick={handleBulkUpdateClick}
                            >
                                <FaEdit className="mr-2" /> Update Selected ({selectedRoleNames.size})
                            </Button>
                        )}
                    </>
                )}
            </div>

            {results && results.found_roles && results.found_roles.length > 0 && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            Found Roles ({results.found_roles.length})
                        </h2>

                        {canSelect && (
                            <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
                                <input
                                    type="checkbox"
                                    checked={results.found_roles.length > 0 && selectedRoleNames.size === results.found_roles.length}
                                    onChange={handleSelectAll}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary mr-4"
                                    id="selectAll"
                                />
                                <label htmlFor="selectAll" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                    Select All Roles
                                </label>
                            </div>
                        )}

                        <div>
                            {results.found_roles.map((role: RoleSummary) => (
                                <RoleCard
                                    key={role.roleName}
                                    role={role}
                                    onDelete={handleDeleteClick}
                                    isSelected={selectedRoleNames.has(role.roleName)}
                                    onUpdate={handleUpdateClick}
                                    onSelect={handleCheckboxChange}
                                    canDelete={canDelete}
                                    canUpdate={canUpdate}
                                    canSelect={canSelect}
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
                    title="Import Role Names from JSON"
                    placeholder={`[
    "ROLE_USER",
    "ROLE_ADMIN"
]`}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteRolesModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    rolesToDelete={rolesToDelete}
                    onSuccess={handleDeleteSuccess}
                />
            )}

            {isUpdateModalOpen && (
                <UpdateRolesModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setUpdateModalOpen(false)}
                    initialRoles={rolesToUpdate}
                    onSuccess={handleUpdateSuccess}
                />
            )}
        </div>
    );
};

export default ReadRolesPage;
