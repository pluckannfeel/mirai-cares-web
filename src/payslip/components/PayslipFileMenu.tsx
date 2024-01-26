import React, { useRef, useState } from "react";
import { Button, MenuItem, Menu, ListItemIcon, Divider } from "@mui/material";
import { AttachFile, Visibility, KeyboardArrowDown } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface PayslipFileMenuProps {
  label: string;
  value: string | File;
  initialFileUrl?: string;
  onFileUpload: (file: File) => void;
}

const PayslipFileMenu: React.FC<PayslipFileMenuProps> = ({
  label,
  value,
  initialFileUrl,
  onFileUpload,
}) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [fileLabel, setFileLabel] = useState(label); // Initial button label
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  //   console.log(initialFileUrl)

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

  return (
    <>
      <Button
        aria-controls="license-file-menu"
        aria-haspopup="true"
        sx={{ padding: 1 }}
        size="small"
        variant="outlined"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
      >
        {fileLabel}
      </Button>
      <Menu
        id="license-file-menu"
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
          // button
          onClick={() => {
            window.open(initialFileUrl as string, "_blank");

            handleClose();
          }}
          disabled={!initialFileUrl}
        >
          <ListItemIcon>
            <Visibility />
          </ListItemIcon>{" "}
          {t("payslip.actions.view")}
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
            accept=".pdf, image/*"
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
            {t("payslip.actions.upload")}
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
};

export default PayslipFileMenu;
