import { FaTrash } from 'react-icons/fa';
import Modal from './Modal';
import Button from './Button';
import ToggleSwitch from './ToggleSwitch';
import DeleteUsersResult from './DeleteUsersResult';
import { useDeleteUsers } from '../../admin/hooks/useDeleteUsers';
import { type UserSummaryToCompanyUser } from '../../admin/api/adminApis';
import { useEffect } from 'react';

interface DeleteUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
    usersToDelete: UserSummaryToCompanyUser[];
    onSuccess: (results: any, hardDelete: boolean) => void;
}

const DeleteUsersModal = ({
    isOpen,
    onClose,
    usersToDelete,
    onSuccess
}: DeleteUsersModalProps) => {
    const {
        state,
        executeDelete,
        reset,
        setHardDelete,
        setLeniency
    } = useDeleteUsers();

    const {
        isLoading,
        results,
        hardDelete,
        leniency,
    } = state;

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm User Deletion"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => executeDelete(usersToDelete.map(u => u.username), () => onSuccess(results, hardDelete))} isLoading={isLoading}>
                        <FaTrash className="mr-2" /> Delete
                    </Button>
                </>
            }
        >
            <div className="mb-4">
                <p className="text-slate-700 dark:text-slate-300">
                    Are you sure you want to delete these users?
                </p>
                <p className="font-mono text-sm mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 break-all max-h-32 overflow-y-auto">
                    [{usersToDelete.map(u => u.username).join(', ')}]
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <ToggleSwitch
                    label="Hard Delete (Permanent)"
                    checked={hardDelete}
                    onChange={setHardDelete}
                    color="red"
                />

                <ToggleSwitch
                    label="Leniency Mode"
                    checked={leniency}
                    onChange={setLeniency}
                />
            </div>

            <DeleteUsersResult result={results} />
        </Modal>
    );
};

export default DeleteUsersModal;
