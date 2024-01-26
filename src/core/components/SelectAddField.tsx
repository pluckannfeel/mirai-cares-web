import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";

interface CustomSelectWithAddProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  onAdd: (value: string) => void;
  helperText?: string | false | undefined;
  error?: boolean;
  name?: string;
  id?: string;
  disabled?: boolean;
}

function CustomSelectWithAdd(props: CustomSelectWithAddProps) {
  const {
    id,
    value,
    onChange,
    onAdd,
    helperText,
    error,
    name,
    label,
    disabled,
  } = props;

  // const [options, setOptions] = useState<string[]>([value ? value : ""]);
  const [options, setOptions] = useState<string[]>(["エンジェルケアサービス"]);
  const [newItem, setNewItem] = useState<string>(value ? value : "");
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      setOptions([...options, newItem]);
      setNewItem("");
      onChange(newItem); // Set the selected value to the newly added item
      onAdd(newItem); // Trigger the callback for adding a new item
      setDialogOpen(false); // Close the dialog
    }
  };
  return (
    <div>
      <TextField
        disabled={disabled}
        id={id}
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        helperText={helperText}
        error={error}
        name={name}
        select
        margin="dense"
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <IconButton
              onClick={() => setDialogOpen(true)}
              color="primary"
              aria-label="add item"
              size="small"
            >
              <AddIcon
                sx={{
                  color: "primary.main",
                  fontSize: 20,
                }}
              />
            </IconButton>
          ),
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            label="New Item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddItem} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CustomSelectWithAdd;
