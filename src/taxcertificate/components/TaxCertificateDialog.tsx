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
  // InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import { TaxCertificate } from "../types/taxcertificate";
import { useFormik } from "formik";
import * as Yup from "yup";

import { StaffScheduleSelect } from "../../shift/types/StaffWorkSchedule";
import { trimName } from "../../helpers/helper";
import { LoadingButton } from "@mui/lab";
import TaxCertificateFileMenu from "./TaxCertificateFileMenu";
import { years } from "../helpers/helper";

type TaxCertificateDialogProps = {
  onAdd: (taxcertificate: Partial<TaxCertificate>) => void;
  onClose: () => void;
  onUpdate: (taxcertificate: TaxCertificate) => void;
  open: boolean;
  processing: boolean;
  staffSelection?: StaffScheduleSelect[];
  taxcertificate?: TaxCertificate;
};

const TaxCertificateDialog: React.FC<TaxCertificateDialogProps> = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  staffSelection,
  taxcertificate: initialTaxCertificate,
}) => {
  const { i18n, t } = useTranslation();

  const editMode = Boolean(initialTaxCertificate && initialTaxCertificate.id);

  const taxcertificate: Partial<TaxCertificate> = {
    ...initialTaxCertificate,
    release_date: new Date(initialTaxCertificate?.release_date as Date),
  };

  // console.log(taxcertificate);

  const [releaseDateInput, setReleaseDateInput] = useState({
    month: 1,
    // year: taxcertificate?.release_date
    //   ? taxcertificate?.release_date.getFullYear().toString()
    //   : "",
    year: new Date().getFullYear().toString(),
  });

  const initialValues: Partial<TaxCertificate> = {
    staff: taxcertificate?.staff ? taxcertificate.staff : null,
    release_date: taxcertificate?.release_date
      ? taxcertificate.release_date
      : new Date(parseInt(releaseDateInput.year as string), 1, 1),
    // release_date: taxcertificate?.release_date ? taxcertificate.release_date : null,
    file_url: taxcertificate?.file_url ? taxcertificate.file_url : null,
    // staff: taxcertificate?.staff ? taxcertificate.staff : {},
  };

  const validationSchema = Yup.object({
    staff: Yup.object().required(t("taxcertificate.form.staff.required")),

    release_date: Yup.string().required(
      t("taxcertificate.form.releaseDate.required")
    ),
    file_url: Yup.string().required(t("taxcertificate.form.file_url.required")),
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
            // parseInt(releaseDateInput.month as string), // Subtract 1 for 0-indexed months
            1,
            1, // Day of the month
            0, // Hour
            0, // Minute
            0, // Second
            0 // Millisecond
          ),
        } as TaxCertificate);
      } else {
        // add
        onAdd({
          ...values,
          release_date: new Date(
            parseInt(releaseDateInput.year as string),
            // parseInt(releaseDateInput.month as string), // Subtract 1 for 0-indexed months
            1,
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
                ? t("taxcertificate.modal.edit.title")
                : t("taxcertificate.modal.add.title")} */}
        {t("taxcertificate.title")}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={2.5}>
              <Typography>
                {t("taxcertificate.form.releaseDate.label")}
              </Typography>
              <FormControl
                // sx={{ m: 1, minWidth: 120 }}
                fullWidth
                size="small"
                // component="fieldset"
                margin="none"
                sx={{
                  marginTop: 1.5,
                }}
              >
                <InputLabel id="year">
                  {t("taxcertificate.filter.year")}
                </InputLabel>
                <Select
                  // fullWidth
                  autoComplete="year"
                  // // autofocus
                  size="small"
                  name="year"
                  // margin='dense'
                  id="year"
                  label={t("taxcertificate.filter.year")}
                  labelId="year"
                  disabled={processing}
                  value={releaseDateInput.year || ""} // Ensure a valid value or empty string
                  onChange={(e) => {
                    setReleaseDateInput((prev) => ({
                      ...prev,
                      year: e.target.value,
                    }));
                  }}
                >
                  {years.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {t(option.label)}
                    </MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>
                  {t("taxcertificate.form.releaseDate.required")}
                </FormHelperText> */}
                {formik.touched.release_date && formik.errors.release_date && (
                  <FormHelperText error>
                    {t("taxcertificate.form.releaseDate.required")}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Typography>{t("taxcertificate.form.staff.label")}</Typography>
              <Autocomplete
                sx={{
                  marginTop: 1.5,
                }}
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
                    // helperText={t("taxcertificate.form.staff.required")}
                  />
                )}
              />
              {formik.touched.staff && formik.errors.staff && (
                <FormHelperText sx={{ color: "#FF3E02" }}>
                  {t("taxcertificate.form.staff.required")}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={3.5}>
              <Typography
                sx={{
                  marginBottom: 1.5,
                }}
              >
                {t("taxcertificate.form.file_url.label")}
              </Typography>
              <TaxCertificateFileMenu
                label={trimName(t("taxcertificate.form.file_url.label"))}
                value={formik.values.file_url as string}
                initialFileUrl={formik.values.file_url as string}
                onFileUpload={(file) => {
                  formik.setFieldValue("file_url", file);
                }}
              />
              {/* Display error for file URL */}
              {formik.touched.file_url && formik.errors.file_url && (
                <FormHelperText error>
                  {t("taxcertificate.form.file_url.required")}
                </FormHelperText>
              )}
            </Grid>
            {/* <Grid item xs={4}></Grid>
            <Grid item xs={12}>
              {formik.touched.release_date && releaseDateInput.year === "" && (
                <FormHelperText error>
                  {t("taxcertificate.form.releaseDate.required")}
                </FormHelperText>
              )}
            </Grid> */}
          </Grid>

          {/* <Grid container spacing={2} marginTop={0.3} marginBottom={2}></Grid> */}
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
            {editMode
              ? t("taxcertificate.actions.edit")
              : t("taxcertificate.actions.add")}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaxCertificateDialog;
