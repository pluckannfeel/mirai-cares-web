import React from "react";

import { Dialog, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface ImageViewerDialogProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageViewerDialog: React.FC<ImageViewerDialogProps> = ({
  open,
  onClose,
  imageUrl,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <div style={{ position: "relative" }}>
        <img
          src={imageUrl}
          alt="bank-images"
          style={{ width: "100%", height: "auto" }}
        />
        <IconButton
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "transparent",
          }}
          onClick={onClose}
        >
          <CloseIcon style={{ color: "white" }} />
        </IconButton>
      </div>
    </Dialog>
  );
};

export default ImageViewerDialog;
