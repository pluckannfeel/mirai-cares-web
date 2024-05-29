/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { ArchiveFile } from "../types/archive";

type ArchiveRenameObjectDialogProps = {
  open: boolean;
  onClose: () => void;
  processing: boolean;
  files: ArchiveFile[];
  onRenameObject: (oldPathKey: string, newPathKey: string) => void;
  currentPath: string;
  oldObjectPath: string;
};

const ArchiveRenameObjectDialog = ({
  open,
  onClose,
  processing,
  files,
  onRenameObject,
  currentPath,
  oldObjectPath,
}: ArchiveRenameObjectDialogProps) => {
  const { t } = useTranslation();
  const [newObjectName, setNewObjectName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (oldObjectPath) {
      const isFolder = oldObjectPath.endsWith('/');
      const objectName = isFolder
        ? oldObjectPath.split('/').slice(-2, -1)[0]
        : oldObjectPath.split('/').pop()?.split('.').slice(0, -1).join('.') || "";
      setNewObjectName(objectName);
    }
  }, [oldObjectPath]);

  const handleSubmit = () => {
    const isFolder = oldObjectPath.endsWith('/');
    const fileExtension = isFolder ? '' : '.' + oldObjectPath.split('.').pop();
    const newPathKey = isFolder
      ? `${currentPath}${newObjectName}/`
      : `${currentPath}${newObjectName}${fileExtension}`;

    if (files?.some((file) => file.key === newPathKey)) {
      setErrorMessage(t("archive.dialog.createFolder.error.folderExists"));
      return;
    }

    if (!validateObjectName(newObjectName)) {
      setErrorMessage(t("archive.dialog.createFolder.error.invalidFolderName"));
      return;
    }

    setErrorMessage("");

    onRenameObject(oldObjectPath, newPathKey);
    setNewObjectName("");
  };

  const validateObjectName = (objectName: string) => {
    // Avoid leading or trailing slashes
    if (!objectName || objectName.startsWith("/") || objectName.endsWith("/")) {
      return false;
    }

    // Avoid characters not generally allowed by S3
    const invalidCharsRegex = /[\\/]/;
    if (invalidCharsRegex.test(objectName)) {
      return false;
    }

    // Avoid consecutive periods or dashes
    if (/(\.\.)|(--)/.test(objectName)) {
      return false;
    }

    return true;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("archive.dialog.renameObject.title")}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          value={newObjectName}
          onChange={(e) => {
            setNewObjectName(e.target.value);
            setErrorMessage("");
          }}
          margin="dense"
          id="objectName"
          label={t("archive.dialog.renameObject.form.objectName.label")}
          type="text"
          fullWidth
          error={!!errorMessage}
          helperText={errorMessage}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          {t("common.cancel")}
        </Button>
        <LoadingButton
          loading={processing}
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          {t("archive.dialog.renameObject.form.submit")}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ArchiveRenameObjectDialog;
