import React, { useRef } from "react";
import { MenuItem, ListItemIcon, ListItemText } from "@mui/material";
// import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { PhotoCamera as PhotoCameraIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface FileInputMenuItemProps {
  onSelectFile: (file: File | null) => void;
  employee_id: string | null | undefined;
}

const FileInputMenuItem: React.FC<FileInputMenuItemProps> = ({
  onSelectFile,
  employee_id,
}) => {
  const { t } = useTranslation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleMenuItemClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    onSelectFile(selectedFile);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />
      <MenuItem onClick={handleMenuItemClick}>
        <ListItemIcon>
          <PhotoCameraIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            employee_id
              ? t("employeeManagement.form.img.actions.change")
              : t("employeeManagement.form.img.actions.upload")
          }
        />
      </MenuItem>
    </>
  );
};

export default FileInputMenuItem;
