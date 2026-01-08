import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import Button from '../../commons/components/Button';
import { type UserSummaryToCompanyUser } from '../api/adminApis';
import ToggleSwitch from '../../commons/components/ToggleSwitch';
import JsonImportModal from '../../commons/components/JsonImportModal';
import UserCard from '../../commons/components/UserCard';
import PageHeader from '../../commons/components/PageHeader';
import ReadUsersResult from '../../commons/components/ReadUsersResult';
import DeleteUsersModal from '../../commons/components/DeleteUsersModal';
import UpdateUsersModal from '../../commons/components/UpdateUsersModal';
import { useReadUsers } from '../hooks/useReadUsers';
import { useAuth } from '../../commons/contexts/AuthContext';
import { canDeleteUsers, canUpdateUsers } from '../../commons/utils/preAuthorizationUtility';

const ReadUsersPage = () => {
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
    } = useReadUsers();

    const { authorities } = useAuth();
    const canDelete = canDeleteUsers(authorities);
    const canUpdate = canUpdateUsers(authorities);
    const canSelect = canDelete || canUpdate;

    const {
        isLoading,
        results,
        leniency,
        input,
        validationError,
        isImportModalOpen,
        jsonInput,
        selectedUsersIds,
        isDeleteModalOpen,
        isUpdateModalOpen,
        usersToDelete,
        usersToUpdate
    } = state;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <PageHeader title="Read Users" backPath="/admin" backText="Back to Admin Panel" />
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
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
                        onChange={(e) => setInput(e.target.value)}
                        className={`w-full h-48 p-3 border rounded-md font-mono text-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-white ${validationError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                        placeholder="johndoe&#10;jane@example.com&#10;550e8400-e29b-41d4-a716-446655440000"
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
                        <FaSearch className="mr-2" /> Read Users
                    </Button>
                </div>

                <ReadUsersResult result={results} />
            </div>

            <div className="mb-6 flex justify-end gap-3">
                {selectedUsersIds.size > 0 && (
                    <>
                        {canDelete && (
                            <Button
                                variant="danger"
                                onClick={handleBulkDeleteClick}
                            >
                                <FaTrash className="mr-2" /> Delete Selected ({selectedUsersIds.size})
                            </Button>
                        )}
                        {canUpdate && (
                            <Button
                                variant="secondary"
                                onClick={handleBulkUpdateClick}
                            >
                                <FaEdit className="mr-2" /> Update Selected ({selectedUsersIds.size})
                            </Button>
                        )}
                    </>
                )}
            </div>

            {results && results.found_users && results.found_users.length > 0 && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            Found Users ({results.found_users.length})
                        </h2>

                        {canSelect && (
                            <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
                                <input
                                    type="checkbox"
                                    checked={results.found_users.length > 0 && selectedUsersIds.size === results.found_users.length}
                                    onChange={handleSelectAll}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary mr-4"
                                    id="selectAll"
                                />
                                <label htmlFor="selectAll" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                    Select All Users
                                </label>
                            </div>
                        )}

                        <div>
                            {results.found_users.map((user: UserSummaryToCompanyUser) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onDelete={handleDeleteClick}
                                    isSelected={selectedUsersIds.has(user.id)}
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
                    title="Import Identifiers from JSON"
                    placeholder={`[
    "johndoe",
    "jane@example.com",
    "550e8400-e29b-41d4-a716-446655440000"
]`}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteUsersModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    usersToDelete={usersToDelete}
                    onSuccess={handleDeleteSuccess}
                />
            )}

            {isUpdateModalOpen && (
                <UpdateUsersModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setUpdateModalOpen(false)}
                    initialUsers={usersToUpdate}
                    onSuccess={handleUpdateSuccess}
                />
            )}
        </div>
    );
};

export default ReadUsersPage;
