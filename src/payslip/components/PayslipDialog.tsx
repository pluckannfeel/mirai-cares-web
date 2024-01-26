import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import { FilterDate, Payslip } from "../types/payslip";
import { useFormik } from "formik";
import * as Yup from "yup";

import { japaneseMonthObjects, months, years } from "../helpers/helper";
import { StaffScheduleSelect } from "../../shift/types/StaffWorkSchedule";
import PayslipFileMenu from "./PayslipFileMenu";
import { trimName } from "../../helpers/helper";
import { LoadingButton } from "@mui/lab";

type PayslipDialogProps = {
  onAdd: (payslip: Partial<Payslip>) => void;
  onClose: () => void;
  onUpdate: (payslip: Payslip) => void;
  open: boolean;
  processing: boolean;
  staffSelection?: StaffScheduleSelect[];
  payslip?: Payslip;
};

const PayslipDialog: React.FC<PayslipDialogProps> = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  staffSelection,
  payslip: initialPayslip,
}) => {
  const { i18n, t } = useTranslation();

  const editMode = Boolean(initialPayslip && initialPayslip.id);

  const payslip: Partial<Payslip> = {
    ...initialPayslip,
    release_date: new Date(initialPayslip?.release_date as Date),
  };

  // console.log(payslip);

  const [releaseDateInput, setReleaseDateInput] = useState<FilterDate>({
    month: payslip?.release_date
      ? (payslip?.release_date.getMonth() + 1).toString()
      : "",
    year: payslip?.release_date
      ? payslip?.release_date.getFullYear().toString()
      : "",
  });

  const initialValues: Partial<Payslip> = {
    staff: payslip?.staff ? payslip.staff : null,
    net_salary: payslip.net_salary ? payslip.net_salary : 0,
    total_deduction: payslip.total_deduction ? payslip.total_deduction : 0,
    total_hours: payslip.total_hours ? payslip.total_hours : 0,
    release_date: payslip?.release_date
      ? payslip.release_date
      : new Date(
          parseInt(releaseDateInput.year as string),
          parseInt(releaseDateInput.month as string),
          1
        ),
    // release_date: payslip?.release_date ? payslip.release_date : null,
    file_url: payslip?.file_url ? payslip.file_url : null,
    // staff: payslip?.staff ? payslip.staff : {},
  };

  const validationSchema = Yup.object({
    staff: Yup.object().required(t("payslip.form.staff.required")),
    // net_salary: Yup.number().required(t("payslip.form.netSalary.required")),
    // total_deduction: Yup.number().required(
    //   t("payslip.form.totalDeduction.required")
    // ),
    // total_hours: Yup.number().required(
    //   t("payslip.form.totalWorkingHours.required")
    // ),
    // release_date: Yup.date().required(t("payslip.form.releaseDate.required")),
    file_url: Yup.string().required(t("payslip.form.file_url.required")),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (editMode) {
        // update
        onUpdate({
          ...values,
          release_date: new Date(
            parseInt(releaseDateInput.year as string),
            parseInt(releaseDateInput.month as string), // Subtract 1 for 0-indexed months
            1, // Day of the month
            0, // Hour
            0, // Minute
            0, // Second
            0 // Millisecond
          ),
        } as Payslip);
      } else {
        // add
        onAdd({
          ...values,
          release_date: new Date(
            parseInt(releaseDateInput.year as string),
            parseInt(releaseDateInput.month as string), // Subtract 1 for 0-indexed months
            1, // Day of the month
            0, // Hour
            0, // Minute
            0, // Second
            0 // Millisecond
          ),
        });
      }
    },
  });

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
                ? t("payslip.modal.edit.title")
                : t("payslip.modal.add.title")} */}
        {t("payslip.title")}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Typography>{t("payslip.form.releaseDate.label")}</Typography>
          <Grid container spacing={2} marginBottom={2}>
            <Grid item xs={4}>
              <FormControl
                // sx={{ m: 1, minWidth: 120 }}
                fullWidth
                size="small"
                // component="fieldset"
                margin="dense"
                // sx={{
                //   marginBottom: 2,
                // }}
              >
                <InputLabel id="month">{t("payslip.filter.month")}</InputLabel>
                <Select
                  // fullWidth
                  autoComplete="month"
                  // // autofocus
                  size="small"
                  name="month"
                  // margin='dense'
                  id="month"
                  label={t("payslip.filter.month")}
                  labelId="month"
                  disabled={processing}
                  value={releaseDateInput.month || ""}
                  onChange={(e) => {
                    setReleaseDateInput((prev) => {
                      return {
                        ...prev,
                        month: e.target.value,
                      };
                    });
                  }}
                >
                  {i18n.language === "en"
                    ? months.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {t(option.label)}
                        </MenuItem>
                      ))
                    : japaneseMonthObjects.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {t(option.label)}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                // sx={{ m: 1, minWidth: 120 }}
                fullWidth
                size="small"
                // component="fieldset"
                margin="dense"
                // sx={{
                //   marginBottom: 2,
                // }}
              >
                <InputLabel id="year">{t("payslip.filter.year")}</InputLabel>
                <Select
                  // fullWidth
                  autoComplete="year"
                  // // autofocus
                  size="small"
                  name="year"
                  // margin='dense'
                  id="year"
                  label={t("payslip.filter.year")}
                  labelId="year"
                  disabled={processing}
                  value={releaseDateInput.year || ""}
                  onChange={(e) => {
                    setReleaseDateInput((prev) => {
                      return {
                        ...prev,
                        year: e.target.value,
                      };
                    });
                  }}
                >
                  {years.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {t(option.label)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={12}>
              {formik.touched.release_date &&
                releaseDateInput.month === "" &&
                releaseDateInput.year === "" && (
                  <FormHelperText error>
                    {t("payslip.form.releaseDate.required")}
                  </FormHelperText>
                )}
            </Grid>
          </Grid>

          <Typography>{t("payslip.form.staff.label")}</Typography>
          <Grid container spacing={2} marginTop={0.3} marginBottom={2}>
            <Grid item xs={8}>
              <Autocomplete
                // fullWidth
                freeSolo
                id="staff-select"
                size="small"
                options={staffSelection || []}
                getOptionLabel={(option: string | StaffScheduleSelect) => {
                  // Check if the option is a string
                  if (typeof option === "string") {
                    return option;
                  }

                  // If option is a StaffScheduleSelect, process it
                  const name =
                    i18n.language === "en"
                      ? option.english_name
                      : option.japanese_name;
                  return name;
                }}
                // getOptionLabel={(option: StaffScheduleSelect) => {
                //   const name =
                //     i18n.language === "en"
                //       ? option.english_name
                //       : option.japanese_name;
                //   return name;
                // }}
                value={formik.values.staff as StaffScheduleSelect}
                onChange={(_, newValue) => {
                  formik.setFieldValue("staff", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t(
                      "staffWorkSchedule.autoCompleteField.searchStaff.label"
                    )}
                    // error={formik.touched.staff && Boolean(formik.errors.staff)}
                    // helperText={formik.touched.staff && formik.errors.staff
                    // helperText={t("payslip.form.staff.required")}
                  />
                )}
              />
              {formik.touched.staff && formik.errors.staff && (
                <FormHelperText sx={{ color: "#FF3E02" }}>
                  {t("payslip.form.staff.required")}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={4}>
              <PayslipFileMenu
                label={trimName(t("payslip.form.file_url.label"))}
                value={formik.values.file_url as string}
                initialFileUrl={formik.values.file_url as string}
                onFileUpload={(file) => {
                  formik.setFieldValue("file_url", file);
                }}
              />
              {/* Display error for file URL */}
              {formik.touched.file_url && formik.errors.file_url && (
                <FormHelperText error>
                  {t("payslip.form.file_url.required")}
                </FormHelperText>
              )}
            </Grid>
          </Grid>

          <Typography>
            {t("payslip.form.dataCalculationAnalysis.label")}
          </Typography>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={4}>
              <TextField
                size="small"
                margin="dense"
                type="number"
                fullWidth
                id="net_salary"
                label={t("payslip.form.netSalary.label")}
                name="net_salary"
                autoComplete="net_salary"
                // autofocus
                disabled={processing}
                value={formik.values.net_salary}
                onChange={formik.handleChange}
                //   error={formik.touched.staff_code && Boolean(formik.errors.staff_code)}
                //   helperText={formik.touched.staff_code && formik.errors.staff_code}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">¥</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                size="small"
                type="number"
                margin="dense"
                fullWidth
                id="total_deduction"
                label={t("payslip.form.totalDeduction.label")}
                name="total_deduction"
                autoComplete="total_deduction"
                // autofocus
                disabled={processing}
                value={formik.values.total_deduction}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">¥</InputAdornment>
                  ),
                }}
                onChange={formik.handleChange}
                //   error={formik.touched.staff_code && Boolean(formik.errors.staff_code)}
                //   helperText={formik.touched.staff_code && formik.errors.staff_code}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                size="small"
                margin="dense"
                type="number"
                fullWidth
                id="total_hours"
                label={t("payslip.form.totalWorkingHours.label")}
                name="total_hours"
                autoComplete="total_hours"
                // autofocus
                disabled={processing}
                value={formik.values.total_hours}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">時間</InputAdornment>
                  ),
                }}
                onChange={formik.handleChange}
                //   error={formik.touched.staff_code && Boolean(formik.errors.staff_code)}
                //   helperText={formik.touched.staff_code && formik.errors.staff_code}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          {/* <Box sx={{ flexGrow: 1 }} /> */}
          <Button onClick={onClose}>{t("common.close")}</Button>
          <LoadingButton
            loading={processing}
            type="submit"
            size="small"
            variant="contained"
            disabled={!formik.dirty && !formik.isSubmitting}
          >
            {editMode ? t("payslip.actions.edit") : t("payslip.actions.add")}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PayslipDialog;
