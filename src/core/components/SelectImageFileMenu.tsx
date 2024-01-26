import React, { useRef, useState } from "react";
import { MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../contexts/SnackbarProvider";

interface SelectImageFileMenuProps {
  onSelectFiles: (images: File[]) => void;
}

const SelectImageFileMenu: React.FC<SelectImageFileMenuProps> = ({
  onSelectFiles,
}) => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleMenuItemClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      const fileList = Array.from(selectedFiles);
      const validFiles = fileList.slice(0, 3); // Limit to the first 5 files

      // if one of the images exceed 5mb limit
      const invalidFiles = fileList.filter(
        (file) => file.size > 5 * 1024 * 1024
      );

      if (invalidFiles.length > 0) {
        snackbar.error(t("common.errors.fileSizeLimit.subTitle"));
        // File size limit exceeded (5MB)
        return;
      }

      if (fileList.length > 3) {
        snackbar.error(t("common.errors.imageUploadLimit.subTitle"));
        return;
        // Show a warning if more than 5 files are selected
      }

      onSelectFiles(validFiles);

      // Reset the input element to allow adding more images
      setFileInputKey((prevKey) => prevKey + 1);
    }
  };

  return (
    <>
      <input
        type="file"
        key={fileInputKey}
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        multiple // Enable multiple file selection
        onChange={handleFileChange}
      />
      <MenuItem onClick={handleMenuItemClick}>
        <ListItemIcon>
          <PhotoCameraIcon />
        </ListItemIcon>
        <ListItemText
          primary={t("employeeManagement.form.img.actions.upload")}
        />
      </MenuItem>
    </>
  );
};

export default SelectImageFileMenu;
