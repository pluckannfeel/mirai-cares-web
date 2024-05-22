import { LeaveRequest } from "../types/LeaveRequest";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import LeaveRequestCalendar from "../components/LeaveRequestCalendar";
import { useStaffLeaveRequests } from "../hooks/useLeaveRequests";
import LeaveRequestDialog from "../components/LeaveRequestDialog";
import { useUpdateLeaveRequest } from "../hooks/useUpdateLeaveRequest";
import { useDeleteLeaveRequest } from "../hooks/useDeleteLeaveRequest";
import { usePushNotification } from "../../admin/hooks/usePushNotification";
import { PushNotification } from "../../admin/types/notification";

const LeaveRequestManagement = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openLeaveRequestDialog, setOpenLeaveRequestDialog] = useState(false);
  // eslint-disable-next-line
  const [selected, setSelected] = useState<string[]>([]);
  const [requestDeleted, setRequestDeleted] = useState<string | undefined>(
    undefined
  );
  const [requestUpdated, setRequestUpdated] = useState<
    LeaveRequest | undefined
  >(undefined);

  const { isLoading, data: leaveRequests } = useStaffLeaveRequests();
  const { isUpdating, updateLeaveRequest } = useUpdateLeaveRequest();
  const { isDeleting, deleteLeaveRequest } = useDeleteLeaveRequest();

  const { pushNotification } = usePushNotification();

  // const processing = isLoading;
  const processing = isLoading || isUpdating || isDeleting;

  const handleUpdateLeaveRequest = async (request: LeaveRequest) => {
    updateLeaveRequest(request)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((leaveRequest: any) => {
        snackbar.success(
          t("leaveRequest.notifications.updateSuccess", {
            event: leaveRequest.staff,
          })
        );
        setOpenLeaveRequestDialog(false);

        if (leaveRequest) {
          pushNotification({
            staff_code: leaveRequest["staff"]?.staff_code as string,
            title: t("leaveRequest.push_notifications.updatedLeaveRequestTitle"),
            body: t("leaveRequest.push_notifications.updatedLeaveRequestBody"),
          } as PushNotification);
        }
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleDeleteLeaveRequest = async () => {
    if (requestDeleted) {
      deleteLeaveRequest(requestDeleted)
        .then(() => {
          snackbar.success(t("leaveRequest.notifications.deleteSuccess"));
          setOpenConfirmDeleteDialog(false);
        })
        .catch(() => {
          snackbar.error(t("common.errors.unexpected.subTitle"));
        });
    }
  };

  // const handleCancelSelected = () => {
  //   setSelected([]);
  // };

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
  };

  const handleOpenConfirmDeleteDialog = (requestId: string) => {
    setRequestDeleted(requestId);
    setOpenConfirmDeleteDialog(true);
  };

  const handleOpenLeaveRequestDialog = (request?: LeaveRequest) => {
    setRequestUpdated(request);
    setOpenLeaveRequestDialog(true);
  };

  const handleCloseLeaveRequestDialog = () => {
    setRequestUpdated(undefined);
    setOpenLeaveRequestDialog(false);
  };

  // const handleSelectedChange = (newSelected: string[]) => {
  //   setSelected(newSelected);
  // };

  return (
    <React.Fragment>
      <AdminAppBar>
        <AdminToolbar title={t("leaveRequest.title")}>
          {/* <Fab
              aria-label="logout"
              color="primary"
              disabled={processing}
              onClick={() => handleOpenLeaveRequestDialog()}
              size="small"
            >
              <AddIcon />
            </Fab> */}
        </AdminToolbar>
      </AdminAppBar>

      <LeaveRequestCalendar
        requests={leaveRequests}
        onEventClick={handleOpenLeaveRequestDialog}
      />

      <ConfirmDialog
        description={t("leaveRequest.confirmations.delete")}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteLeaveRequest}
        open={openConfirmDeleteDialog}
        title={t("common.confirmation")}
      />

      {openLeaveRequestDialog && (
        <LeaveRequestDialog
          onClose={handleCloseLeaveRequestDialog}
          onUpdate={handleUpdateLeaveRequest}
          onDelete={handleOpenConfirmDeleteDialog}
          open={openLeaveRequestDialog}
          processing={processing}
          request={requestUpdated}
        />
      )}
    </React.Fragment>
  );
};

export default LeaveRequestManagement;
