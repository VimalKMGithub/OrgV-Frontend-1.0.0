import { FaPlus, FaSave } from 'react-icons/fa';
import Button from '../../commons/components/Button';
import PageHeader from '../../commons/components/PageHeader';
import JsonImportModal from '../../commons/components/JsonImportModal';
import ToggleSwitch from '../../commons/components/ToggleSwitch';
import { useUpdateRoles } from '../hooks/useUpdateRoles';
import UpdateRolesForm from '../../commons/components/UpdateRolesForm';

const UpdateRolesPage = () => {
    const {
        state,
        handleAddRole,
        handleRemoveRole,
        handleRoleChange,
        handleJsonImport,
        handleSubmit,
        setLeniency,
        setImportModalOpen,
        setJsonInput,
    } = useUpdateRoles();

    const {
        roles,
        leniency,
        isLoading,
        errors,
        isImportModalOpen,
        jsonInput,
        updatedRoleNames,
    } = state;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <PageHeader title="Update Roles" backPath="/admin" backText="Back to Admin Panel" />
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
                <Button onClick={handleAddRole} variant="secondary">
                    <FaPlus className="mr-2" /> Add Another Role
                </Button>
                <Button onClick={() => handleSubmit()} isLoading={isLoading}>
                    <FaSave className="mr-2" /> Update Roles
                </Button>
            </div>

            <UpdateRolesForm
                roles={roles}
                errors={errors}
                updatedRoleNames={updatedRoleNames}
                handleRemoveRole={handleRemoveRole}
                handleRoleChange={handleRoleChange}
            />

            <div className="mt-6 flex items-center justify-end space-x-4">
                <Button onClick={handleAddRole} variant="secondary">
                    <FaPlus className="mr-2" /> Add Another Role
                </Button>
                <Button onClick={() => handleSubmit()} isLoading={isLoading}>
                    <FaSave className="mr-2" /> Update Roles
                </Button>
            </div>

            {isImportModalOpen && (
                <JsonImportModal
                    isOpen={isImportModalOpen}
                    onClose={() => setImportModalOpen(false)}
                    onImport={handleJsonImport}
                    jsonInput={jsonInput}
                    setJsonInput={setJsonInput}
                    title="Import Roles from JSON"
                    placeholder={`[
    {
        "roleName": "ROLE_USER",
        "description": "Updated description",
        "permissions": ["READ_USER", "UPDATE_USER"]
    }
]`}
                />
            )}
        </div>
    );
};

export default UpdateRolesPage;
