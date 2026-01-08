import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import Button from '../../commons/components/Button';
import Card from '../../commons/components/Card';
import Input from '../../commons/components/Input';
import ToggleSwitch from '../../commons/components/ToggleSwitch';
import JsonImportModal from '../../commons/components/JsonImportModal';
import PageHeader from '../../commons/components/PageHeader';
import { useCreateUsers } from '../hooks/useCreateUsers';

const CreateUsersPage = () => {
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
    } = useCreateUsers();

    const {
        users,
        leniency,
        isLoading,
        errors,
        isImportModalOpen,
        jsonInput,
        createdUsernames,
    } = state;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <PageHeader title="Create Users" backPath="/admin" backText="Back to Admin Panel" />
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
                <Button onClick={handleSubmit} isLoading={isLoading}>
                    <FaSave className="mr-2" /> Create Users
                </Button>
            </div>

            <div className="space-y-6">
                {users.map((user, index) => (
                    <Card key={index} title={`User ${index + 1}`} className={`relative ${createdUsernames.has(user.username) ? '!border-2 !border-green-500' : ''}`}>
                        {users.length > 1 && (
                            <button
                                onClick={() => handleRemoveUser(index)}
                                className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2"
                                title="Remove User"
                            >
                                <FaTrash />
                            </button>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <Input
                                label="Username"
                                value={user.username}
                                onChange={(e) => handleUserChange(index, 'username', e.target.value)}
                                required
                                error={errors[index]?.username}
                                placeholder="Username"
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={user.email}
                                onChange={(e) => handleUserChange(index, 'email', e.target.value)}
                                required
                                error={errors[index]?.email}
                                placeholder="Email"
                            />
                            <Input
                                label="Password"
                                type="password"
                                value={user.password}
                                onChange={(e) => handleUserChange(index, 'password', e.target.value)}
                                required
                                error={errors[index]?.password}
                                placeholder="Password"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <Input
                                label="First Name"
                                value={user.firstName}
                                onChange={(e) => handleUserChange(index, 'firstName', e.target.value)}
                                required
                                error={errors[index]?.firstName}
                                placeholder="First Name"
                            />
                            <Input
                                label="Middle Name"
                                value={user.middleName || ''}
                                onChange={(e) => handleUserChange(index, 'middleName', e.target.value)}
                                error={errors[index]?.middleName}
                                placeholder="Middle Name"
                            />
                            <Input
                                label="Last Name"
                                value={user.lastName || ''}
                                onChange={(e) => handleUserChange(index, 'lastName', e.target.value)}
                                error={errors[index]?.lastName}
                                placeholder="Last Name"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Roles</label>
                            <textarea
                                value={user.rolesInput || ''}
                                onChange={(e) => handleUserChange(index, 'rolesInput', e.target.value)}
                                placeholder="Type roles (space, comma, or new line separated)..."
                                className={`w-full h-24 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-white sm:text-sm resize-y ${errors[index]?.roles ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                            />
                            {errors[index]?.roles && (
                                <p className="mt-1 text-sm text-red-500">{errors[index].roles}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Input
                                    label="Allowed Concurrent Logins"
                                    type="number"
                                    value={user.allowedConcurrentLogins.toString()}
                                    onChange={(e) => handleUserChange(index, 'allowedConcurrentLogins', parseInt(e.target.value) || 1)}
                                    error={errors[index]?.allowedConcurrentLogins}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={user.emailVerified}
                                        onChange={(e) => handleUserChange(index, 'emailVerified', e.target.checked)}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Email Verified</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={user.accountEnabled}
                                        onChange={(e) => handleUserChange(index, 'accountEnabled', e.target.checked)}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Account Enabled</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={user.accountLocked}
                                        onChange={(e) => handleUserChange(index, 'accountLocked', e.target.checked)}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Account Locked</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={user.accountDeleted}
                                        onChange={(e) => handleUserChange(index, 'accountDeleted', e.target.checked)}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Account Deleted</span>
                                </label>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-end space-x-4">
                <Button onClick={handleAddUser} variant="secondary">
                    <FaPlus className="mr-2" /> Add Another User
                </Button>
                <Button onClick={handleSubmit} isLoading={isLoading}>
                    <FaSave className="mr-2" /> Create Users
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
    "username": "johndoe",
    "password": "password123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["ROLE_USER"]
    }
]`}
                />
            )}
        </div>
    );
};

export default CreateUsersPage;
