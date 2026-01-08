import type { RoleSummary } from "../../admin/api/adminApis";
import { useUpdateRoles } from "../../admin/hooks/useUpdateRoles";
import Modal from "./Modal";
import Button from "./Button";
import { FaSave } from "react-icons/fa";
import ToggleSwitch from "./ToggleSwitch";
import UpdateRolesForm from "./UpdateRolesForm";
import type { RoleUpdationRequestExtended } from "../../admin/reducers/updateRolesReducer";

interface UpdateRolesModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialRoles: RoleUpdationRequestExtended[];
    onSuccess: (updatedRoles: RoleSummary[]) => void;
}

const UpdateRolesModal = ({
    isOpen,
    onClose,
    initialRoles,
    onSuccess
}: UpdateRolesModalProps) => {
    const {
        state,
        dispatch,
        handleRemoveRole,
        handleRoleChange,
        handleSubmit,
    } = useUpdateRoles(initialRoles);

    const {
        roles,
        leniency,
        isLoading,
        errors,
        updatedRoleNames,
    } = state;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Update Roles"
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
                <UpdateRolesForm
                    roles={roles}
                    errors={errors}
                    updatedRoleNames={updatedRoleNames}
                    handleRemoveRole={handleRemoveRole}
                    handleRoleChange={handleRoleChange}
                    initialRoles={initialRoles}
                    disableRoleNameEditing={true}
                />
            </div>
        </Modal>
    );
}

export default UpdateRolesModal;
