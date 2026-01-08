import { Link } from 'react-router-dom';
import { FaUserPlus, FaTrash, FaSearch, FaEdit, FaPlusCircle } from 'react-icons/fa';
import { useAuth } from '../../commons/contexts/AuthContext';
import Card from '../../commons/components/Card';
import {
    canCreateUsers, canDeleteUsers, canReadUsers, canUpdateUsers,
    canCreateRoles, canReadRoles, canUpdateRoles, canDeleteRoles,
    canReadPermissions
} from '../../commons/utils/preAuthorizationUtility';
import Button from '../../commons/components/Button';
import PageHeader from '../../commons/components/PageHeader';

const AdminPanelPage = () => {
    const { authorities } = useAuth();

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <PageHeader title="Admin Panel" backPath="/" backText="Back to Dashboard" />
                <p className="text-slate-600 dark:text-slate-400 mt-1">Manage users, roles, permissions, etc ...</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="User Management" className="h-full">
                    <div className="space-y-4">
                        {canCreateUsers(authorities) && (
                            <Link to="/admin/create-users" className="block">
                                <Button fullWidth>
                                    <FaUserPlus className="mr-2" /> Create Users
                                </Button>
                            </Link>
                        )}
                        {canDeleteUsers(authorities) && (
                            <Link to="/admin/delete-users" className="block">
                                <Button fullWidth variant="danger">
                                    <FaTrash className="mr-2" /> Delete Users
                                </Button>
                            </Link>
                        )}
                        {canReadUsers(authorities) && (
                            <Link to="/admin/read-users" className="block">
                                <Button fullWidth variant="primary">
                                    <FaSearch className="mr-2" /> Read Users
                                </Button>
                            </Link>
                        )}
                        {canUpdateUsers(authorities) && (
                            <Link to="/admin/update-users" className="block">
                                <Button fullWidth variant="secondary">
                                    <FaEdit className="mr-2" /> Update Users
                                </Button>
                            </Link>
                        )}
                    </div>
                </Card>

                <Card title="Role Management" className="h-full">
                    <div className="space-y-4">
                        {canCreateRoles(authorities) && (
                            <Link to="/admin/create-roles" className="block">
                                <Button fullWidth>
                                    <FaPlusCircle className="mr-2" /> Create Roles
                                </Button>
                            </Link>
                        )}
                        {canDeleteRoles(authorities) && (
                            <Link to="/admin/delete-roles" className="block">
                                <Button fullWidth variant="danger">
                                    <FaTrash className="mr-2" /> Delete Roles
                                </Button>
                            </Link>
                        )}
                        {canReadRoles(authorities) && (
                            <Link to="/admin/read-roles" className="block">
                                <Button fullWidth variant="primary">
                                    <FaSearch className="mr-2" /> Read Roles
                                </Button>
                            </Link>
                        )}
                        {canUpdateRoles(authorities) && (
                            <Link to="/admin/update-roles" className="block">
                                <Button fullWidth variant="secondary">
                                    <FaEdit className="mr-2" /> Update Roles
                                </Button>
                            </Link>
                        )}
                    </div>
                </Card>

                <Card title="Permission Management" className="h-full">
                    <div className="space-y-4">
                        {canReadPermissions(authorities) && (
                            <Link to="/admin/read-permissions" className="block">
                                <Button fullWidth variant="primary">
                                    <FaSearch className="mr-2" /> Read Permissions
                                </Button>
                            </Link>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminPanelPage;
