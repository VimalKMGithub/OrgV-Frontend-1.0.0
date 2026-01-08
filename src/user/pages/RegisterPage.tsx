import { Link } from 'react-router-dom';
import Card from '../../commons/components/Card';
import Input from '../../commons/components/Input';
import Button from '../../commons/components/Button';
import { useRegister } from '../hooks/useRegister';

const RegisterPage = () => {
    const {
        state,
        handleChange,
        handleSubmit,
    } = useRegister();

    const {
        formData,
        errors,
        isLoading,
    } = state;

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <Card title="Create Account" className="w-full max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                            error={errors.firstName}
                        />
                        <Input
                            label="Middle Name"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            placeholder="Middle Name"
                            error={errors.middleName}
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            error={errors.lastName}
                        />
                    </div>
                    <Input
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                        required
                        error={errors.username}
                    />
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        error={errors.email}
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                        error={errors.password}
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                        error={errors.confirmPassword}
                    />

                    <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
                        Register
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary hover:text-indigo-500">
                        Login
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default RegisterPage;
