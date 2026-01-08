import { useEffect } from "react";
import type { RoleSummary } from "../../admin/api/adminApis";
import { useDeleteRoles } from "../../admin/hooks/useDeleteRoles";
import Modal from "./Modal";
import Button from "./Button";
import { FaTrash } from "react-icons/fa";
import DeleteRolesResult from "./DeleteRolesResult";
import ToggleSwitch from "./ToggleSwitch";

interface DeleteRolesModalProps {
    isOpen: boolean;
    onClose: () => void;
    rolesToDelete: RoleSummary[];
    onSuccess: (results: any) => void;
}

const DeleteRolesModal = ({
    isOpen,
    onClose,
    rolesToDelete,
    onSuccess
}: DeleteRolesModalProps) => {
    const {
        state,
        reset,
        executeDelete,
        setForceDelete,
        setLeniency
    } = useDeleteRoles();

    const {
        isLoading,
        results,
        forceDelete,
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
            title="Confirm Role Deletion"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => executeDelete(rolesToDelete.map(r => r.roleName), onSuccess)} isLoading={isLoading}>
                        <FaTrash className="mr-2" /> Delete
                    </Button>
                </>
            }
        >
            <div className="mb-4">
                <p className="text-slate-700 dark:text-slate-300">
                    Are you sure you want to delete these roles?
                </p>
                <p className="font-mono text-sm mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 break-all max-h-32 overflow-y-auto">
                    [{rolesToDelete.map(r => r.roleName).join(', ')}]
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <ToggleSwitch
                    label="Force Delete"
                    checked={forceDelete}
                    onChange={setForceDelete}
                    color="red"
                />

                <ToggleSwitch
                    label="Leniency Mode"
                    checked={leniency}
                    onChange={setLeniency}
                />
            </div>

            <DeleteRolesResult result={results} />
        </Modal>
    );
};

export default DeleteRolesModal;
