import React, { useState, useEffect } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
// import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
// import VisibilityIcon from '@material-ui/icons/Visibility';

import {
  Person as PersonIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import FileInputMenuItem from "./FileInputMenuItem";

interface ClickableAvatarProps {
  employee_image: string | null;
  employee_id: string | null | undefined;
  defaultImage: File | null;
  handleFileSelect: (file: File | null) => void;
  handleIconButtonClick: (event: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  // to set capture clickable state of avatar image
  // setAvatarChanged: (value: boolean) => void;
}

const ClickableAvatar: React.FC<ClickableAvatarProps> = ({
  employee_image,
  employee_id,
  defaultImage,
  handleFileSelect,
  handleIconButtonClick,
  anchorEl,
  handleClose,
  // setAvatarChanged
}) => {
  const { t } = useTranslation();

  const [empImage, setEmpImage] = useState<string | null>(employee_image);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  //   const handleViewImage = () => {
  //     // open the image in new tab using react router

  //     handleClose();
  //   };

  const handleClearImage = () => {
    handleFileSelect(null);
    handleClose();
    setEmpImage(null);
    setPreviewImage(null);

    // setAvatarChanged(true)
  };

  useEffect(() => {
    if (!defaultImage) {
      setPreviewImage(null);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(defaultImage as Blob);
    reader.onloadend = () => {
      // const base64data = reader.result;
      //   console.log(base64data);
      setPreviewImage(reader.result as string);
    };
  }, [defaultImage]);

  return (
    <>
      <IconButton
        sx={{
          bgcolor: "background.paper",
          //   mb: 3,
          height: 220,
          width: 220,
          "&:hover": {
            // backgroundColor: "grey.200",
            borderRadius: 1.2,
          },
        }}
        onClick={handleIconButtonClick}
      >
        {empImage && !previewImage ? (
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: "background.paper",
              //   mb: 3,
              height: 200,
              width: 200,
            }}
            src={empImage}
            alt="User Avatar"
          />
        ) : previewImage ? (
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: "background.paper",
              //   mb: 3,
              height: 200,
              width: 200,
            }}
            src={previewImage}
            alt="User Avatar"
          />
        ) : (
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: "background.paper",
              //   mb: 3,
              height: 200,
              width: 200,
            }}
          >
            <PersonIcon sx={{ fontSize: 120 }} />
          </Avatar>
        )}
      </IconButton>

      <Menu
        id="employee-row-menu"
        anchorEl={anchorEl}
        aria-labelledby="employee-row-menu-button"
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleClearImage}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText
            primary={t("employeeManagement.form.img.actions.clear")}
          />
        </MenuItem>

        <FileInputMenuItem
          employee_id={employee_id}
          onSelectFile={handleFileSelect}
        />
      </Menu>
    </>
  );
};

export default ClickableAvatar;
