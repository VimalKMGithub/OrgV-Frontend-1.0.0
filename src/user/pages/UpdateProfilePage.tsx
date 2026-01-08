import { useNavigate } from 'react-router-dom';
import { FaUserEdit } from 'react-icons/fa';
import Card from '../../commons/components/Card';
import Input from '../../commons/components/Input';
import Button from '../../commons/components/Button';
import { useUpdateProfile } from '../hooks/useUpdateProfile';

const UpdateProfilePage = () => {
    const navigate = useNavigate();
    const {
        state,
        handleChange,
        handleSubmit,
    } = useUpdateProfile();

    const {
        isLoading,
        formData,
        errors,
    } = state;

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <Card title="Edit Profile" className="w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                        <FaUserEdit size={24} />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        error={errors.username}
                        placeholder="Username"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={errors.firstName}
                            placeholder="First Name"
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={errors.lastName}
                            placeholder="Last Name"
                        />
                    </div>

                    <Input
                        label="Middle Name"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        error={errors.middleName}
                        placeholder="Middle Name"
                    />

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            Please enter your current password to confirm changes.
                        </p>
                        <Input
                            label="Current Password"
                            type="password"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            error={errors.oldPassword}
                            required
                            placeholder="Enter current password"
                        />
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <Button variant="outline" fullWidth onClick={() => navigate('/')} type="button">
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" fullWidth isLoading={isLoading}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default UpdateProfilePage;
