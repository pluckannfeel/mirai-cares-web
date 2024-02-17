import React, { useRef, useState, useCallback } from "react";

import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
  Button,
  ButtonProps,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
// import { StaffWorkSchedule } from "../../shift/types/StaffWorkSchedule";
import { APIRequestResponse } from "../types/archive";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
// import { usePushNotification } from "../../admin/hooks/usePushNotification";
// import { PushNotification } from "../../admin/types/notification";

type ArchiveUploadFileProps = {
  submitHandler: (file: File) => Promise<APIRequestResponse>;
  // submitHandler: (file: File) => void;
  buttonProps?: ButtonProps;
  loading: boolean;
  // currentPath: string;
};

const ArchiveUploadFileButton: React.FC<ArchiveUploadFileProps> = ({
  submitHandler,
  buttonProps,
  loading,
  // currentPath,
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const snackbar = useSnackbar();

  //   const { pushNotification } = usePushNotification();

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
      .then((response) => {
        // send notifications to all staff which has tokens
        // pushNotification({
        //   staff_code: "all",
        //   title: t("payslip.push_notifications.newShiftScheduleTitle"),
        //   body: t("payslip.push_notifications.newShiftScheduleBody"),
        // } as PushNotification);
        // console.log(response);
        if (response.code === "success") {
          snackbar.success(t("archive.notifications.uploadSuccess"));
        }

        // if (response.code === "error") {
        //   snackbar.error(t("archive.notifications.error.uploadError"));
        // }
      })
      // .catch((error) => {
      //   snackbar.error(t("archive.notifications.error.uploadError"));
      // })
      .finally(() => {
        if (hiddenFileInput.current) {
          hiddenFileInput.current.value = "";
        }
        setSelectedFile(null);
      });
  }, [selectedFile, submitHandler, loading, t]);

  return (
    <>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <Button onClick={handleClick} {...buttonProps}>
        {buttonProps?.title}
      </Button>
      <Dialog open={selectedFile != null} onClose={handleClose}>
        <DialogTitle>{t("common.confirm")}</DialogTitle>
        <DialogContent>
          <Typography variant="h5">
            {t("common.confirmUploadFileMsg", {
              fileName: selectedFile?.name,
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="error"
            disabled={loading}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="warning"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} /> : null}
          >
            {t("common.upload")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ArchiveUploadFileButton;
