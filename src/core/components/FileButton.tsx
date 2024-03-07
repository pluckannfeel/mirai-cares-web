import React, { useRef, useState, useCallback } from "react";

import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
  Button,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { StaffWorkSchedule } from "../../shift/types/StaffWorkSchedule";
import { usePushNotification } from "../../admin/hooks/usePushNotification";
import { PushNotification } from "../../admin/types/notification";
import { useSnackbar } from "../contexts/SnackbarProvider";

type FileButtonProps = {
  submitHandler: (file: File) => Promise<StaffWorkSchedule>;
  buttonProps?: React.ComponentProps<typeof Button>;
  loading: boolean;
  // disabled: boolean;
};

const FileButton: React.FC<FileButtonProps> = ({
  submitHandler,
  buttonProps,
  loading,
  // disabled
}) => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const { pushNotification } = usePushNotification();

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleClose = () => {
    // Reset the file input when closing the dialog without submitting
    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = "";
    }
    setSelectedFile(null);
  };

  const handleConfirm = useCallback(() => {
    if (loading || !selectedFile) return;

    submitHandler(selectedFile)
      .then(() => {
        snackbar.success(
          t("staffWorkSchedule.notifications.updateRecordSuccess")
        );

        // send notifications to all staff which has tokens
        pushNotification({
          staff_code: "all",
          title: t("payslip.push_notifications.newShiftScheduleTitle"),
          body: t("payslip.push_notifications.newShiftScheduleBody"),
        } as PushNotification);
      })
      .catch((error) => {
        snackbar.error(
          `${t(
            "staffWorkSchedule.notifications.updateRecordFailed"
          )} : ${error}`
        );
      })
      .finally(() => {
        if (hiddenFileInput.current) {
          hiddenFileInput.current.value = "";
        }
        setSelectedFile(null);
      });
  }, [selectedFile, submitHandler, pushNotification, loading, t]);

  return (
    <>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
        accept=".csv"
      />
      <Button onClick={handleClick} {...buttonProps}>
        {buttonProps?.title}
      </Button>
      <Dialog open={selectedFile != null} onClose={handleClose}>
        <DialogTitle>{t("common.confirm")}</DialogTitle>
        <DialogContent>
          <Typography variant="h5">
            {t("common.confirmImportMsg", {
              fileName: selectedFile?.name,
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            variant="outlined"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} /> : null}
          >
            {t("common.import")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FileButton;
