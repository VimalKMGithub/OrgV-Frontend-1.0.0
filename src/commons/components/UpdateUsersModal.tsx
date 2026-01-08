import { FaSave } from 'react-icons/fa';
import Modal from '../../commons/components/Modal';
import Button from '../../commons/components/Button';
import ToggleSwitch from '../../commons/components/ToggleSwitch';
import UpdateUsersForm from './UpdateUsersForm';
import type { UserSummaryToCompanyUser } from '../../admin/api/adminApis';
import { useUpdateUsers } from '../../admin/hooks/useUpdateUsers';
import type { UserUpdationRequestExtended } from '../../admin/reducers/updateUsersReducer';

interface UpdateUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialUsers: UserUpdationRequestExtended[];
    onSuccess: (updatedUsers: UserSummaryToCompanyUser[]) => void;
}

const UpdateUsersModal = ({
    isOpen,
    onClose,
    initialUsers,
    onSuccess
}: UpdateUsersModalProps) => {
    const {
        state,
        dispatch,
        handleRemoveUser,
        handleUserChange,
        handleSubmit,
    } = useUpdateUsers(initialUsers);

    const {
        users,
        leniency,
        isLoading,
        errors,
        updatedUsernames,
    } = state;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Update Users"
            size="5xl"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={() => handleSubmit(onSuccess)} isLoading={isLoading}>
                        <FaSave className="mr-2" /> Update
                    </Button>
                </>
            }
        >
            <div className="mb-4 flex justify-end gap-4">
                <ToggleSwitch
                    label="Leniency Mode"
                    checked={leniency}
                    onChange={(checked) => dispatch({ type: 'SET_LENIENCY', payload: checked })}
                />
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
                <UpdateUsersForm
                    users={users}
                    errors={errors}
                    updatedUsernames={updatedUsernames}
                    handleRemoveUser={handleRemoveUser}
                    handleUserChange={handleUserChange}
                    initialUsers={initialUsers}
                    disableOldUsernameEditing={true}
                />
            </div>
        </Modal>
    );
};

export default UpdateUsersModal;
