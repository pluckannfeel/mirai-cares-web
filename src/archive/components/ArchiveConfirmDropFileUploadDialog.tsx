import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface ArchiveConfirmDropFileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  file: File | null;
  loading: boolean;
}

const ArchiveConfirmDropFileUploadDialog: React.FC<
  ArchiveConfirmDropFileUploadDialogProps
> = ({ open, onClose, onConfirm, file, loading }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("common.confirm")}</DialogTitle>
      <DialogContent>
        <Typography variant="h5">
          {t("common.confirmUploadFileMsg", { fileName: file?.name })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          color="error"
          disabled={loading}
        >
          {t("common.cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="warning"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={24} /> : null}
        >
          {t("common.upload")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArchiveConfirmDropFileUploadDialog;
