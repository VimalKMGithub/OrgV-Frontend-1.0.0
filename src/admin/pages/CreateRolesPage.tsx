import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import Button from '../../commons/components/Button';
import Card from '../../commons/components/Card';
import Input from '../../commons/components/Input';
import ToggleSwitch from '../../commons/components/ToggleSwitch';
import JsonImportModal from '../../commons/components/JsonImportModal';
import PageHeader from '../../commons/components/PageHeader';
import { useCreateRoles } from '../hooks/useCreateRoles';

const CreateRolesPage = () => {
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
    } = useCreateRoles();

    const {
        roles,
        leniency,
        isLoading,
        errors,
        isImportModalOpen,
        jsonInput,
        createdRoleNames,
    } = state;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <PageHeader title="Create Roles" backPath="/admin" backText="Back to Admin Panel" />
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
                <Button onClick={handleSubmit} isLoading={isLoading}>
                    <FaSave className="mr-2" /> Create Roles
                </Button>
            </div>

            <div className="space-y-6">
                {roles.map((role, index) => (
                    <Card key={index} title={`Role ${index + 1}`} className={`relative ${createdRoleNames.has(role.roleName) ? '!border-2 !border-green-500' : ''}`}>
                        {roles.length > 1 && (
                            <button
                                onClick={() => handleRemoveRole(index)}
                                className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2"
                                title="Remove Role"
                            >
                                <FaTrash />
                            </button>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Input
                                label="Role Name"
                                value={role.roleName}
                                onChange={(e) => handleRoleChange(index, 'roleName', e.target.value)}
                                required
                                error={errors[index]?.roleName}
                                placeholder="Role Name"
                            />
                            <Input
                                label="Description"
                                value={role.description || ''}
                                onChange={(e) => handleRoleChange(index, 'description', e.target.value)}
                                error={errors[index]?.description}
                                placeholder="Description"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Permissions</label>
                            <textarea
                                value={role.permissionsInput || ''}
                                onChange={(e) => handleRoleChange(index, 'permissionsInput', e.target.value)}
                                placeholder="Type permissions (space, comma, or new line separated)..."
                                className={`w-full h-24 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-white sm:text-sm resize-y ${errors[index]?.permissions ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                            />
                            {errors[index]?.permissions && (
                                <p className="mt-1 text-sm text-red-500">{errors[index].permissions}</p>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-end space-x-4">
                <Button onClick={handleAddRole} variant="secondary">
                    <FaPlus className="mr-2" /> Add Another Role
                </Button>
                <Button onClick={handleSubmit} isLoading={isLoading}>
                    <FaSave className="mr-2" /> Create Roles
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
    "roleName": "ROLE_MANAGER",
    "description": "Manager role with specific permissions",
    "permissions": ["CAN_READ_USER", "CAN_UPDATE_USER"]
    }
]`}
                />
            )}
        </div>
    );
};

export default CreateRolesPage;
