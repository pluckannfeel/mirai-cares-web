import {
  MenuItem,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  TextField,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ArchiveFile } from "../types/archive";

type ArchiveRenameFolderDialogProps = {
  open: boolean;
  onClose: () => void;
  processing: boolean;
  files: ArchiveFile[];
  onRenameFolder: (oldPathKey: string, newPathKey: string) => void;
  currentPath: string;
  oldFolderPath: string;
};

const ArchiveRenameFolderDialog = ({
  open,
  onClose,
  processing,
  files,
  onRenameFolder,
  currentPath,
  oldFolderPath,
}: ArchiveRenameFolderDialogProps) => {
  const { t } = useTranslation();
  const [newFolderName, setNewFolderName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    const folderExists = files?.some(
      (file) => file.key === `${currentPath}${newFolderName}/`
    );
    if (folderExists) {
      setErrorMessage(t("archive.dialog.createFolder.error.folderExists"));
      return;
    }

    if (!validateFolderName(newFolderName)) {
      // Set an appropriate error message based on your application's localization strategy
      setErrorMessage(t("archive.dialog.createFolder.error.invalidFolderName"));
      return; // Prevent submission if validation fails
    }

    // Clear any previous error message if the validation passes
    setErrorMessage("");

    const newPathKey = `${currentPath}${newFolderName}/`;
    onRenameFolder(oldFolderPath, newPathKey);
    setNewFolderName(""); // Reset folder name after successful submission
  };

  const validateFolderName = (folderName: string) => {
    // Avoid leading or trailing slashes
    if (folderName.startsWith("/") || folderName.endsWith("/")) {
      return false;
    }

    // Avoid characters not generally allowed by S3
    // const invalidCharsRegex = /[&$@=;:+ ,?\\{^}%`\]\[~<>\|#"]/;
    // dont allow only / and \
    const invalidCharsRegex = /[\\\/]/;

    if (invalidCharsRegex.test(folderName)) {
      return false;
    }

    // Avoid consecutive periods or dashes
    if (/(\.\.)|(--)/.test(folderName)) {
      return false;
    }

    // Add more rules as needed based on the AWS documentation

    return true; // Valid if none of the above checks fail
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("archive.dialog.renameFolder.title")}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          onChange={(e) => {
            setNewFolderName(e.target.value);
            setErrorMessage("");
          }}
          margin="dense"
          id="folderName"
          label={t("archive.dialog.renameFolder.form.folderName.label")}
          type="text"
          fullWidth
          error={!!errorMessage} // Highlight the input field in red if there's an error
          helperText={errorMessage} // Display the error message
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
          {t("archive.dialog.renameFolder.form.submit")}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ArchiveRenameFolderDialog;
