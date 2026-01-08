import { FaPlus, FaSave } from 'react-icons/fa';
import Button from '../../commons/components/Button';
import PageHeader from '../../commons/components/PageHeader';
import JsonImportModal from '../../commons/components/JsonImportModal';
import ToggleSwitch from '../../commons/components/ToggleSwitch';
import { useUpdateUsers } from '../hooks/useUpdateUsers';
import UpdateUsersForm from '../../commons/components/UpdateUsersForm';

const UpdateUsersPage = () => {
    const {
        state,
        handleAddUser,
        handleRemoveUser,
        handleUserChange,
        handleJsonImport,
        handleSubmit,
        setLeniency,
        setImportModalOpen,
        setJsonInput,
    } = useUpdateUsers();

    const {
        users,
        leniency,
        isLoading,
        errors,
        isImportModalOpen,
        jsonInput,
        updatedUsernames,
    } = state;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <PageHeader title="Update Users" backPath="/admin" backText="Back to Admin Panel" />
            <div className="mb-6 flex items-center justify-end space-x-4">
                <div className="flex items-center space-x-2">
                    <ToggleSwitch
                        label="Leniency Mode"
                        checked={leniency}
                        onChange={setLeniency}
                    />
                </div>
                <Button variant="outline" onClick={() => setImportModalOpen(true)}>
                    Import JSON
                </Button>
                <Button onClick={handleAddUser} variant="secondary">
                    <FaPlus className="mr-2" /> Add Another User
                </Button>
                <Button onClick={() => handleSubmit()} isLoading={isLoading}>
                    <FaSave className="mr-2" /> Update Users
                </Button>
            </div>

            <UpdateUsersForm
                users={users}
                errors={errors}
                updatedUsernames={updatedUsernames}
                handleRemoveUser={handleRemoveUser}
                handleUserChange={handleUserChange}
            />

            <div className="mt-6 flex items-center justify-end space-x-4">
                <Button onClick={handleAddUser} variant="secondary">
                    <FaPlus className="mr-2" /> Add Another User
                </Button>
                <Button onClick={() => handleSubmit()} isLoading={isLoading}>
                    <FaSave className="mr-2" /> Update Users
                </Button>
            </div>

            {isImportModalOpen && (
                <JsonImportModal
                    isOpen={isImportModalOpen}
                    onClose={() => setImportModalOpen(false)}
                    onImport={handleJsonImport}
                    jsonInput={jsonInput}
                    setJsonInput={setJsonInput}
                    title="Import Users from JSON"
                    placeholder={`[
    {
        "oldUsername": "johndoe",
        "email": "newemail@example.com",
        "accountLocked": true
    }
]`}
                />
            )}
        </div>
    );
};

export default UpdateUsersPage;
