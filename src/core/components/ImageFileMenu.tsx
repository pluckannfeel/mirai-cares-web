import React, { useRef, useState } from "react";
import { Button, MenuItem, Menu, ListItemIcon, Divider } from "@mui/material";
import { AttachFile, Visibility, KeyboardArrowDown } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import ImageViewerDialog from "./ImageViewerDialog";

interface ImageFileMenuProps {
  label?: string;
  value: string | File;
  initialFileUrl: string | null;
  onFileUpload: (file: File) => void;
}

const ImageFileMenu: React.FC<ImageFileMenuProps> = ({
  label,
  initialFileUrl,
  onFileUpload,
}) => {
  const { t } = useTranslation();

  const initialFileLabel = label ? label : t("common.select");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [fileLabel, setFileLabel] = useState<string>(initialFileLabel); // Initial button label
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [openImageDialog, setOpenImageDialog] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && onFileUpload) {
      onFileUpload(selectedFile);
      setFileLabel(selectedFile.name); // Set button label to file name
    }
    setAnchorEl(null); // Close the menu after uploading
  };

  const handleOpenImageDialog = () => {
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
  };

  return (
    <>
      <Button
        aria-controls="Instruction-file-menu"
        aria-haspopup="true"
        size="small"
        variant="outlined"
        sx={{ padding: 1, borderRadius: 1 }}
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
      >
        {fileLabel}
      </Button>
      <Menu
        id="Instruction-file-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {/* <MenuItem>
              <Typography variant="h6">{label}</Typography>
              <Typography variant="body1">Value: {value}</Typography>
            </MenuItem> */}
        <MenuItem
          onClick={handleOpenImageDialog}
          disabled={
            initialFileUrl === undefined || initialFileUrl === null
              ? true
              : false
          }
        >
          <ListItemIcon>
            <Visibility />
          </ListItemIcon>{" "}
          {t("common.view")}
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          sx={{
            margin: 0,
            marginBottom: 0.5,
            padding: 0,
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            ref={fileInputRef}
            style={{ display: "none" }} // Hide the file input element
          />
          <Button
            variant="text"
            size="small"
            onClick={handleFileButtonClick}
            startIcon={<AttachFile />}
          >
            {t("common.upload")}
          </Button>
        </MenuItem>
      </Menu>

      <ImageViewerDialog
        open={openImageDialog}
        onClose={handleCloseImageDialog}
        imageUrl={initialFileUrl as string}
      />
    </>
  );
};

export default ImageFileMenu;
