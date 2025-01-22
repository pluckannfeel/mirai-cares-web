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
import { CompanyHousing } from "../types/companyInfo";
import { useEffect } from "react";

type CompanyHousingDialogProps = {
  onAdd: (ch: Partial<CompanyHousing>) => void;
  onClose: () => void;
  onUpdate: (ch: CompanyHousing) => void;
  open: boolean;
  processing: boolean;
  ch?: CompanyHousing;
};

const CompanyHousingDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  ch,
}: CompanyHousingDialogProps) => {
  const { t } = useTranslation();

  // useEffect(() => {
  //   console.log(ch);
  // }, []);

  const editMode = Boolean(ch && ch.id);

  const validationSchema = Yup.object().shape({
    property_name: Yup.string().required(
      t("companyHousing.form.validate.required")
    ),
    address: Yup.string().required(t("companyHousing.form.validate.required")),
    postal_code: Yup.string().required(
      t("companyHousing.form.validate.required")
    ),
    room_number: Yup.string().required(
      t("companyHousing.form.validate.required")
    ),
    house_name: Yup.string().required(
      t("companyHousing.form.validate.required")
    ),
    // management_company: Yup.string().required(
    //   t("companyHousing.form.validate.required")
    // ),
    // management_company_contact: Yup.string().required(t("companyHousing.form.managementCompanyContact.required")),
    // intermediary: Yup.string().required(t("companyHousing.form.intermediary.required")),
    // person_in_charge: Yup.string().required(t("companyHousing.form.personInCharge.required")),
    // person_in_charge_contact: Yup.string().required(t("companyHousing.form.personInChargeContact.required")),
    // electric_company: Yup.string().required(t("companyHousing.form.electricCompany.required")),
    // electric_company_contact: Yup.string().required(t("companyHousing.form.electricCompanyContact.required")),
    // gas_company: Yup.string().required(t("companyHousing.form.gasCompany.required")),
    // gas_company_contact: Yup.string().required(t("companyHousing.form.gasCompanyContact.required")),
    // water_company: Yup.string().required(t("companyHousing.form.waterCompany.required")),
    // water_company_contact: Yup.string().required(t("companyHousing.form.waterCompanyContact.required")),
    // internet_company: Yup.string().required(t("companyHousing.form.internetCompany.required")),
    // internet_company_contact: Yup.string().required(t("companyHousing.form.internetCompanyContact.required")),
    // remarks: Yup.string().required(t("companyHousing.form.remarks.required")),
  });

  const formik = useFormik({
    initialValues: {
      property_name: ch?.property_name || "",
      address: ch?.address || "",
      postal_code: ch?.postal_code || "",
      room_number: ch?.room_number || "",
      house_name: ch?.house_name || "",
      management_company: ch?.management_company || "",
      management_company_contact: ch?.management_company_contact || "",
      intermediary: ch?.intermediary || "",
      person_in_charge: ch?.person_in_charge || "",
      person_in_charge_contact: ch?.person_in_charge_contact || "",
      electric_company: ch?.electric_company || "",
      electric_company_contact: ch?.electric_company_contact || "",
      gas_company: ch?.gas_company || "",
      gas_company_contact: ch?.gas_company_contact || "",
      water_company: ch?.water_company || "",
      water_company_contact: ch?.water_company_contact || "",
      internet_company: ch?.internet_company || "",
      internet_company_contact: ch?.internet_company_contact || "",
      remarks: ch?.remarks || "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (ch && ch.id) {
        onUpdate({ ...values, id: ch.id } as CompanyHousing);
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
      maxWidth={"md"}
      fullWidth
      aria-labelledby="company-housing-dialog-title"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="company-housing-dialog-title">
          {editMode
            ? t("companyHousing.dialog.edit.title")
            : t("companyHousing.dialog.add.title")}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            id="property_name"
            label={t("companyHousing.form.property_name")}
            margin="normal"
            name="property_name"
            onChange={formik.handleChange}
            required
            value={formik.values.property_name}
            variant="standard"
            error={
              formik.touched.property_name &&
              Boolean(formik.errors.property_name)
            }
            helperText={
              formik.touched.property_name && formik.errors.property_name
            }
          />
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <TextField
                fullWidth
                id="house_name"
                label={t("companyHousing.form.house_name")}
                margin="normal"
                name="house_name"
                onChange={formik.handleChange}
                required
                value={formik.values.house_name}
                variant="standard"
                error={
                  formik.touched.house_name && Boolean(formik.errors.house_name)
                }
                helperText={
                  formik.touched.house_name && formik.errors.house_name
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                id="room_number"
                label={t("companyHousing.form.room_number")}
                margin="normal"
                name="room_number"
                onChange={formik.handleChange}
                required
                value={formik.values.room_number}
                variant="standard"
                error={
                  formik.touched.room_number &&
                  Boolean(formik.errors.room_number)
                }
                helperText={
                  formik.touched.room_number && formik.errors.room_number
                }
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                id="postal_code"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">〒</InputAdornment>
                  ),
                }}
                label={t("companyHousing.form.postal_code")}
                margin="normal"
                name="postal_code"
                onChange={(e) => {
                  // Format the postal code on each change
                  formik.setFieldValue(
                    "postal_code",
                    formatPostalCode(e.target.value)
                  );
                }}
                required
                value={formik.values.postal_code}
                variant="standard"
                error={
                  formik.touched.postal_code &&
                  Boolean(formik.errors.postal_code)
                }
                helperText={
                  formik.touched.postal_code && formik.errors.postal_code
                }
              />
            </Grid>
            <Grid item xs={9}>
              <TextField
                fullWidth
                id="address"
                label={t("companyHousing.form.address")}
                margin="normal"
                name="address"
                onChange={formik.handleChange}
                required
                value={formik.values.address}
                variant="standard"
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
          </Grid>
          <Divider sx={{ margin: "1.5rem 0 0 0" }} textAlign="center">
            <Chip
              label={t("companyHousing.form.divider.property_details")}
              size="small"
            />
          </Divider>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                id="management_company"
                label={t("companyHousing.form.management_company")}
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
                label={t("companyHousing.form.management_company_contact")}
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
                label={t("companyHousing.form.intermediary")}
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
                label={t("companyHousing.form.person_in_charge")}
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
                label={t("companyHousing.form.person_in_charge_contact")}
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

          <Grid container spacing={2}>
            <Grid item xs={7}>
              <TextField
                fullWidth
                id="electric_company"
                label={t("companyHousing.form.electric_company")}
                margin="normal"
                name="electric_company"
                onChange={formik.handleChange}
                value={formik.values.electric_company}
                variant="standard"
                error={
                  formik.touched.electric_company &&
                  Boolean(formik.errors.electric_company)
                }
                helperText={
                  formik.touched.electric_company &&
                  formik.errors.electric_company
                }
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                id="electric_company_contact"
                label={t("companyHousing.form.electric_company_contact")}
                margin="normal"
                name="electric_company_contact"
                onChange={formik.handleChange}
                value={formik.values.electric_company_contact}
                variant="standard"
                error={
                  formik.touched.electric_company_contact &&
                  Boolean(formik.errors.electric_company_contact)
                }
                helperText={
                  formik.touched.electric_company_contact &&
                  formik.errors.electric_company_contact
                }
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={7}>
              <TextField
                fullWidth
                id="gas_company"
                label={t("companyHousing.form.gas_company")}
                margin="normal"
                name="gas_company"
                onChange={formik.handleChange}
                value={formik.values.gas_company}
                variant="standard"
                error={
                  formik.touched.gas_company &&
                  Boolean(formik.errors.gas_company)
                }
                helperText={
                  formik.touched.gas_company && formik.errors.gas_company
                }
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                id="gas_company_contact"
                label={t("companyHousing.form.gas_company_contact")}
                margin="normal"
                name="gas_company_contact"
                onChange={formik.handleChange}
                value={formik.values.gas_company_contact}
                variant="standard"
                error={
                  formik.touched.gas_company_contact &&
                  Boolean(formik.errors.gas_company_contact)
                }
                helperText={
                  formik.touched.gas_company_contact &&
                  formik.errors.gas_company_contact
                }
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={7}>
              <TextField
                fullWidth
                id="water_company"
                label={t("companyHousing.form.water_company")}
                margin="normal"
                name="water_company"
                onChange={formik.handleChange}
                value={formik.values.water_company}
                variant="standard"
                error={
                  formik.touched.water_company &&
                  Boolean(formik.errors.water_company)
                }
                helperText={
                  formik.touched.water_company && formik.errors.water_company
                }
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                id="water_company_contact"
                label={t("companyHousing.form.water_company_contact")}
                margin="normal"
                name="water_company_contact"
                onChange={formik.handleChange}
                value={formik.values.water_company_contact}
                variant="standard"
                error={
                  formik.touched.water_company_contact &&
                  Boolean(formik.errors.water_company_contact)
                }
                helperText={
                  formik.touched.water_company_contact &&
                  formik.errors.water_company_contact
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <TextField
                fullWidth
                id="internet_company"
                label={t("companyHousing.form.internet_company")}
                margin="normal"
                name="internet_company"
                onChange={formik.handleChange}
                value={formik.values.internet_company}
                variant="standard"
                error={
                  formik.touched.internet_company &&
                  Boolean(formik.errors.internet_company)
                }
                helperText={
                  formik.touched.internet_company &&
                  formik.errors.internet_company
                }
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                id="internet_company_contact"
                label={t("companyHousing.form.internet_company_contact")}
                margin="normal"
                name="internet_company_contact"
                onChange={formik.handleChange}
                value={formik.values.internet_company_contact}
                variant="standard"
                error={
                  formik.touched.internet_company_contact &&
                  Boolean(formik.errors.internet_company_contact)
                }
                helperText={
                  formik.touched.internet_company_contact &&
                  formik.errors.internet_company_contact
                }
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            id="remarks"
            label={t("companyHousing.form.remarks")}
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

export default CompanyHousingDialog;
