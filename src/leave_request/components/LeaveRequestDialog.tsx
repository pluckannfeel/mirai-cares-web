import React, { useState } from "react";
import { LeaveRequest } from "../types/LeaveRequest";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Switch,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Delete as DeleteIcon } from "@mui/icons-material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      // maxHeight: ITEM_HEIGHT  * 4.5 + ITEM_PADDING_TOP,
      // width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

type LeaveRequestDialogProps = {
  //   onAdd: (event: Partial<LeaveRequest>) => void;
  onClose: () => void;
  onDelete: (requestId: string) => void;
  onUpdate: (request: LeaveRequest) => void;
  open: boolean;
  processing: boolean;
  request?: LeaveRequest;
};

const LeaveRequestDialog: React.FC<LeaveRequestDialogProps> = ({
  //   onAdd,
  onClose,
  onDelete,
  onUpdate,
  open,
  processing,
  request,
}) => {
  const { i18n, t } = useTranslation();

  const [isApproved, setIsApproved] = useState<boolean>(false);

  // state for days that you will use paid leave 'yuukyuu'
  // const [selectedIntervalDates, setSelectedIntervalDates] = useState<string[]>(
  //   []
  // );

  const [selectedPaidLeaveList, setSelectedPaidLeaveList] = useState<string[]>(
    request?.paid_leave_dates ? request.paid_leave_dates.split(",") : []
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsApproved(event.target.checked);
  };

  const handlePaidLeaveListChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedPaidLeaveList(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      aria-labelledby="leaveRequest-dialog-title"
      maxWidth={"sm"}
    >
      <DialogTitle id="leaveRequest-dialog-title">
        {/* {editMode
            ? t("staffWorkSchedule.modal.edit.title")
            : t("staffWorkSchedule.modal.add.title")} */}
        {t("leaveRequest.title")}
      </DialogTitle>

      {request && (
        <DialogContent>
          <TextField
            size="small"
            margin="dense"
            fullWidth
            id="name"
            label={t("leaveRequest.form.staff.name")}
            InputProps={{
              readOnly: true,
            }}
            name="name"
            autoComplete="name"
            // autofocus
            disabled={processing}
            value={
              i18n.language === "en"
                ? request.staff?.english_name
                : request.staff?.japanese_name
            }
            //   onChange={formik.handleChange}
            //   error={formik.touched.staff_code && Boolean(formik.errors.staff_code)}
            //   helperText={formik.touched.staff_code && formik.errors.staff_code}
          />

          <Grid container spacing={1}>
            {/* <Grid item xs={6}>
              <TextField
                size="small"
                margin="dense"
                fullWidth
                id="leave_type"
                label={t("leaveRequest.form.leave_type.label")}
                InputProps={{
                  readOnly: true,
                }}
                name="leave_type"
                autoComplete="leave_type"
                // autofocus
                disabled={processing}
                value={
                  request.leave_type === "paid"
                    ? t("leaveRequest.screen.row.type.paid")
                    : t("leaveRequest.screen.row.type.unpaid")
                }
                //   onChange={formik.handleChange}
                //   error={formik.touched.staff_code && Boolean(formik.errors.staff_code)}
                //   helperText={formik.touched.staff_code && formik.errors.staff_code}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"  
                margin="dense"
                fullWidth
                type="number"
                id="number_of_days"
                label={t("leaveRequest.form.number_of_days.label")}
                InputProps={{
                  readOnly: true,
                }}
                name="number_of_days"
                autoComplete="number_of_days"
                // autofocus
                disabled={processing}
                value={request.number_of_days ? request.number_of_days : 0}
                //   onChange={formik.handleChange}
                //   error={formik.touched.staff_code && Boolean(formik.errors.staff_code)}
                //   helperText={formik.touched.staff_code && formik.errors.staff_code}
              />
            </Grid> */}
            <Grid item xs={12}>
              <FormControl fullWidth size="small" margin="dense">
                <InputLabel id="paid_leave_dates-label">
                  {t("leaveRequest.form.paid_leave_dates.label")}
                </InputLabel>
                <Select
                  labelId="paid_leave_dates-label"
                  id="paid_leave_dates"
                  IconComponent={() => null}
                  multiple
                  size="small"
                  value={selectedPaidLeaveList}
                  onChange={handlePaidLeaveListChange}
                  input={
                    <OutlinedInput
                      label={t("leaveRequest.form.paid_leave_dates.label")}
                    />
                  } // Move label here
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          sx={{
                            borderRadius: 0.5,
                            paddingX: 0.5,
                            marginY: 0.5,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                  readOnly
                >
                  {selectedPaidLeaveList.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                size="small"
                margin="dense"
                fullWidth
                id="start_date"
                label={t("leaveRequest.form.start_date.label")}
                InputProps={{
                  readOnly: true,
                }}
                name="start_date"
                autoComplete="start_date"
                // autofocus
                disabled={processing}
                value={request.start_date ? request.start_date : ""}
                //   onChange={formik.handleChange}
                //   error={formik.touched.staff_code && Boolean(formik.errors.staff_code)}
                //   helperText={formik.touched.staff_code && formik.errors.staff_code}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                margin="dense"
                fullWidth
                id="end_date"
                label={t("leaveRequest.form.end_date.label")}
                InputProps={{
                  readOnly: true,
                }}
                name="end_date"
                autoComplete="end_date"
                // autofocus
                disabled={processing}
                value={request.end_date ? request.end_date : ""}
                //   onChange={formik.handleChange}
                //   error={formik.touched.staff_code && Boolean(formik.errors.staff_code)}
                //   helperText={formik.touched.staff_code && formik.errors.staff_code}
              />
            </Grid>
          </Grid>

          <TextField
            size="small"
            margin="dense"
            fullWidth
            id="leave_type"
            label={t("leaveRequest.form.details.label")}
            InputProps={{
              readOnly: true,
            }}
            minRows={3}
            multiline
            name="leave_type"
            autoComplete="leave_type"
            // autofocus
            disabled={processing}
            value={request.details ? request.details : ""}
            //   onChange={formik.handleChange}
            //   error={formik.touched.staff_code && Boolean(formik.errors.staff_code)}
            //   helperText={formik.touched.staff_code && formik.errors.staff_code}
          />

          <FormControl component="fieldset" sx={{ marginTop: 2 }} fullWidth>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography
                  variant="subtitle1"
                  fontSize={20}
                  fontWeight={"bold"}
                >
                  {t("leaveRequest.actions.updateLeaveRequest.field_title")}
                </Typography>
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isApproved}
                      onChange={handleChange}
                      name="leaveRequestAction"
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "green", // Thumb color when checked
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "green", // Track color when checked
                          },
                        "& .MuiSwitch-switchBase": {
                          color: "red", // Thumb color when not checked
                        },
                        "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                          backgroundColor: "red", // Track color when not checked
                        },
                      }}
                    />
                  }
                  label={
                    isApproved
                      ? t("leaveRequest.screen.row.status.approved")
                      : t("leaveRequest.screen.row.status.declined")
                  }
                  labelPlacement="start"
                  sx={{
                    fontSize: 20,
                    ".MuiFormControlLabel-label": {
                      color: isApproved ? "green" : "red",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </FormControl>
        </DialogContent>
      )}

      <DialogActions>
        {request && request.id && (
          <IconButton
            aria-label="delete shift report"
            onClick={() => onDelete(request.id as string)}
            disabled={processing}
          >
            <DeleteIcon />
          </IconButton>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClose}>{t("common.close")}</Button>
        <Button
          // disabled={!formik.dirty && !formik.isSubmitting}
          // loading={processing}
          type="submit"
          variant="contained"
          onClick={() =>
            onUpdate({
              ...request,
              status: isApproved ? "approved" : "declined",
            } as LeaveRequest)
          }
        >
          {t("leaveRequest.actions.updateLeaveRequest.label")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveRequestDialog;
