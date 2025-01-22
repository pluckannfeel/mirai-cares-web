import {
  MenuItem,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  TextField,
  Grid,
  InputAdornment,
  Divider,
  Chip,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { CompanyParking } from "../types/companyInfo";
import { useEffect } from "react";

type CompanyParkingDialogProps = {
  onAdd: (cp: Partial<CompanyParking>) => void;
  onClose: () => void;
  onUpdate: (cp: CompanyParking) => void;
  open: boolean;
  processing: boolean;
  cp?: CompanyParking;
};

const CompanyParkingDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  cp,
}: CompanyParkingDialogProps) => {
  const { t } = useTranslation();

  const editMode = Boolean(cp && cp.id);

  const validationSchema = Yup.object().shape({
    parking_name: Yup.string().required(
      t("companyParking.form.validate.required")
    ),
    parking_number: Yup.string().required(
      t("companyParking.form.validate.required")
    ),
    parking_address: Yup.string().required(
      t("companyParking.form.validate.required")
    ),
    parking_postal_code: Yup.string().required(
      t("companyParking.form.validate.required")
    ),
  });

  const formik = useFormik({
    initialValues: {
      parking_name: cp?.parking_address || "",
      parking_number: cp?.parking_number || "",
      parking_address: cp?.parking_address || "",
      parking_postal_code: cp?.parking_postal_code || "",
      management_company: cp?.management_company || "",
      management_company_contact: cp?.management_company_contact || "",
      intermediary: cp?.intermediary || "",
      person_in_charge: cp?.person_in_charge || "",
      person_in_charge_contact: cp?.person_in_charge_contact || "",
      remarks: cp?.remarks || "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (cp && cp.id) {
        onUpdate({ ...values, id: cp.id } as CompanyParking);
      } else {
        onAdd(values);
      }
    },
  });

  const formatPostalCode = (value: string) => {
    // Remove non-numeric characters
    const cleaned = value.replace(/\D/g, "");

    // Format it into 000-0000 pattern
    if (cleaned.length <= 3) {
      return cleaned;
    } else {
      return cleaned.slice(0, 3) + "-" + cleaned.slice(3, 7);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={"sm"}
      fullWidth
      aria-labelledby="company-housing-dialog-title"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="company-parking-dialog-title">
          {editMode
            ? t("companyParking.dialog.edit.title")
            : t("companyParking.dialog.add.title")}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <TextField
                autoFocus
                fullWidth
                id="parking_name"
                label={t("companyParking.form.parking_name")}
                margin="normal"
                name="parking_name"
                onChange={formik.handleChange}
                required
                value={formik.values.parking_name}
                variant="standard"
                error={
                  formik.touched.parking_name &&
                  Boolean(formik.errors.parking_name)
                }
                helperText={
                  formik.touched.parking_name && formik.errors.parking_name
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                autoFocus
                fullWidth
                id="parking_number"
                label={t("companyParking.form.parking_number")}
                margin="normal"
                name="parking_number"
                onChange={formik.handleChange}
                required
                value={formik.values.parking_number}
                variant="standard"
                error={
                  formik.touched.parking_number &&
                  Boolean(formik.errors.parking_number)
                }
                helperText={
                  formik.touched.parking_number && formik.errors.parking_number
                }
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                autoFocus
                fullWidth
                id="parking_postal_code"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">〒</InputAdornment>
                  ),
                }}
                label={t("companyParking.form.parking_postal_code")}
                margin="normal"
                name="parking_postal_code"
                onChange={(e) => {
                  // Format the postal code on each change
                  formik.setFieldValue(
                    "parking_postal_code",
                    formatPostalCode(e.target.value)
                  );
                }}
                required
                value={formik.values.parking_postal_code}
                variant="standard"
                error={
                  formik.touched.parking_postal_code &&
                  Boolean(formik.errors.parking_postal_code)
                }
                helperText={
                  formik.touched.parking_postal_code &&
                  formik.errors.parking_postal_code
                }
              />
            </Grid>
            <Grid item xs={9}>
              <TextField
                autoFocus
                fullWidth
                id="parking_address"
                label={t("companyParking.form.parking_address")}
                margin="normal"
                name="parking_address"
                onChange={formik.handleChange}
                required
                value={formik.values.parking_address}
                variant="standard"
                error={
                  formik.touched.parking_address &&
                  Boolean(formik.errors.parking_address)
                }
                helperText={
                  formik.touched.parking_address &&
                  formik.errors.parking_address
                }
              />
            </Grid>
          </Grid>
          <Divider sx={{ margin: "1.5rem 0 0 0" }} textAlign="center">
            <Chip
              //   label={t("companyParking.form.divider.property_details")}
              
              label="その他"
              size="small"
            />
          </Divider>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                id="management_company"
                label={t("companyParking.form.management_company")}
                margin="normal"
                name="management_company"
                onChange={formik.handleChange}
                value={formik.values.management_company}
                variant="standard"
                error={
                  formik.touched.management_company &&
                  Boolean(formik.errors.management_company)
                }
                helperText={
                  formik.touched.management_company &&
                  formik.errors.management_company
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                id="management_company_contact"
                label={t("companyParking.form.management_company_contact")}
                margin="normal"
                name="management_company_contact"
                onChange={formik.handleChange}
                value={formik.values.management_company_contact}
                variant="standard"
                error={
                  formik.touched.management_company_contact &&
                  Boolean(formik.errors.management_company_contact)
                }
                helperText={
                  formik.touched.management_company_contact &&
                  formik.errors.management_company_contact
                }
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                id="intermediary"
                label={t("companyParking.form.intermediary")}
                margin="normal"
                name="intermediary"
                onChange={formik.handleChange}
                value={formik.values.intermediary}
                variant="standard"
                error={
                  formik.touched.intermediary &&
                  Boolean(formik.errors.intermediary)
                }
                helperText={
                  formik.touched.intermediary && formik.errors.intermediary
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                id="person_in_charge"
                label={t("companyParking.form.person_in_charge")}
                margin="normal"
                name="person_in_charge"
                onChange={formik.handleChange}
                value={formik.values.person_in_charge}
                variant="standard"
                error={
                  formik.touched.person_in_charge &&
                  Boolean(formik.errors.person_in_charge)
                }
                helperText={
                  formik.touched.person_in_charge &&
                  formik.errors.person_in_charge
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                id="person_in_charge"
                label={t("companyParking.form.person_in_charge_contact")}
                margin="normal"
                name="person_in_charge_contact"
                onChange={formik.handleChange}
                value={formik.values.person_in_charge_contact}
                variant="standard"
                error={
                  formik.touched.person_in_charge_contact &&
                  Boolean(formik.errors.person_in_charge_contact)
                }
                helperText={
                  formik.touched.person_in_charge_contact &&
                  formik.errors.person_in_charge_contact
                }
              />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            id="remarks"
            label={t("companyParking.form.remarks")}
            margin="normal"
            name="remarks"
            onChange={formik.handleChange}
            value={formik.values.remarks}
            multiline
            minRows={3}
            draggable
            variant="standard"
            error={formik.touched.remarks && Boolean(formik.errors.remarks)}
            helperText={formik.touched.remarks && formik.errors.remarks}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <LoadingButton
            color="primary"
            loading={processing}
            type="submit"
            variant="contained"
          >
            {editMode ? t("common.update") : t("common.save")}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CompanyParkingDialog;
