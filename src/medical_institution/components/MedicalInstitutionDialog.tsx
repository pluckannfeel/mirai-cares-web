import React from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { MedicalInstitution } from "../types/MedicalInstitution";

// import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
  FormHelperText,
  InputLabel,
  Select,
} from "@mui/material";
import { DatePicker, LoadingButton } from "@mui/lab";
import { calculateAge } from "../../patients/helpers/functions";
import { mi_licenses } from "../helpers/helper";

type MedicalInstitutionDialogProps = {
  onAdd: (institution: Partial<MedicalInstitution>) => void;
  onClose: () => void;
  onUpdate: (institution: MedicalInstitution, institution_id: string) => void;
  open: boolean;
  processing: boolean;
  institution?: MedicalInstitution;
  //   patientsRefetch: () => void;
};

const MedicalInstitutionDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  institution,
}: // institutionsRefetch,
MedicalInstitutionDialogProps) => {
  // console.log(institution);
  const { t } = useTranslation();
  // const snackbar = useSnackbar();
  // const currentLanguage = i18n.language;

  const editMode = Boolean(institution && institution.id);

  const handleSubmit = (values: Partial<MedicalInstitution>) => {
    if (institution && institution.id) {
      //   onUpdate({ ...values, institution_id: institution.id } as MedicalInstitution);
      onUpdate({ ...values } as MedicalInstitution, institution.id);
    } else {
      onAdd(values);
    }
  };

  const formik = useFormik({
    initialValues: {
      physician_name_kanji: institution ? institution.physician_name_kanji : "",
      physician_name_kana: institution ? institution.physician_name_kana : "",
      physician_birth_date: institution?.physician_birth_date,
      physician_age: institution ? institution.physician_age : "",
      physician_work: institution ? institution.physician_work : "",
      entity_name: institution ? institution.entity_name : "",
      entity_poc: institution ? institution.entity_poc : "",
      medical_institution_name: institution
        ? institution.medical_institution_name
        : "",
      medical_institution_poc: institution
        ? institution.medical_institution_poc
        : "",
      medical_institution_postal_code: institution
        ? institution.medical_institution_postal_code
        : "",
      medical_institution_address1: institution
        ? institution.medical_institution_address1
        : "",
      medical_institution_address2: institution
        ? institution.medical_institution_address2
        : "",
      medical_institution_phone: institution
        ? institution.medical_institution_phone
        : "",
      medical_institution_fax: institution
        ? institution.medical_institution_fax
        : "",
      medical_institution_email: institution
        ? institution.medical_institution_email
        : "",
      medical_institution_type: institution
        ? institution.medical_institution_type
        : "",
      licenses: institution ? institution.licenses : [],
      license_number: institution ? institution.license_number : "",
      date_obtained: institution?.date_obtained,
      ojt_implementation_name: institution?.ojt_implementation_name,
      //   disabled: user ? user.disabled : false,
      //   email: user ? user.email : "",
      //   first_name: user ? user.first_name : "",
      //   // gender: user ? user.gender : "F",
      //   last_name: user ? user.last_name : "",
      //   role: user ? user.role : "",
    },
    validationSchema: Yup.object({
      //   email: Yup.string()
      //     .email(t("common.validations.email"))
      //     .required(t("common.validations.required")),
      //   first_name: Yup.string()
      //     .max(20, t("common.validations.max", { size: 20 }))
      //     .required(t("common.validations.required")),
      //   last_name: Yup.string()
      //     .max(30, t("common.validations.max", { size: 30 }))
      //     .required(t("common.validations.required")),
      //   role: Yup.string().required(t("common.validations.required")),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
      maxWidth={"lg"}
      aria-labelledby="medicalinstitution-dialog-title"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="user-dialog-title">
          {editMode
            ? t("medicalInstitutionManagement.modal.edit.title")
            : t("medicalInstitutionManagement.modal.add.title")}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* First Column */}
            <Grid item xs={6}>
              <Typography
                // marginTop={1}
                marginBottom={1}
                variant="h6"
                textAlign="center"
                gutterBottom
              >
                {t(
                  "medicalInstitutionManagement.form.headers.physician_details"
                )}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="physician_name_kanji"
                    label={t(
                      "medicalInstitutionManagement.form.physician_name_kanji.label"
                    )}
                    name="physician_name_kanji"
                    autoComplete="physician_name_kanji"
                    // autofocus
                    disabled={processing}
                    value={formik.values.physician_name_kanji}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.physician_name_kanji &&
                      Boolean(formik.errors.physician_name_kanji)
                    }
                    helperText={
                      formik.touched.physician_name_kanji &&
                      formik.errors.physician_name_kanji
                    }
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="physician_name_kana"
                    label={t(
                      "medicalInstitutionManagement.form.physician_name_kana.label"
                    )}
                    name="physician_name_kana"
                    autoComplete="physician_name_kana"
                    // autofocus
                    disabled={processing}
                    value={formik.values.physician_name_kana}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.physician_name_kana &&
                      Boolean(formik.errors.physician_name_kana)
                    }
                    helperText={
                      formik.touched.physician_name_kana &&
                      formik.errors.physician_name_kana
                    }
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <DatePicker
                    label={t(
                      "medicalInstitutionManagement.form.physician_birth_date.label"
                    )}
                    inputFormat="yyyy/MM/dd"
                    value={
                      formik.values.physician_birth_date
                        ? new Date(formik.values.physician_birth_date)
                        : null
                    }
                    onChange={(date: Date | null) => {
                      formik.setFieldValue("physician_birth_date", date);
                      formik.setFieldValue("physician_age", calculateAge(date));
                    }}
                    renderInput={(params: any) => (
                      <TextField
                        size="small"
                        {...params}
                        id="physician_birth_date"
                        disabled={processing}
                        fullWidth
                        margin="dense"
                        name="physician_birth_date"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    margin="dense"
                    size="small"
                    fullWidth
                    id="physician_age"
                    label={t(
                      "medicalInstitutionManagement.form.physician_age.label"
                    )}
                    name="physician_age"
                    autoComplete="physician_age"
                    // type="number"
                    // // autofocus
                    disabled={processing}
                    value={formik.values.physician_age}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.physician_age &&
                      Boolean(formik.errors.physician_age)
                    }
                    helperText={
                      formik.touched.physician_age &&
                      formik.errors.physician_age
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="physician_work"
                    label={t(
                      "medicalInstitutionManagement.form.physician_work.label"
                    )}
                    name="physician_work"
                    autoComplete="physician_work"
                    // autofocus
                    disabled={processing}
                    value={formik.values.physician_work}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.physician_work &&
                      Boolean(formik.errors.physician_work)
                    }
                    helperText={
                      formik.touched.physician_work &&
                      formik.errors.physician_work
                    }
                  />
                </Grid>
              </Grid>

              <Typography
                marginTop={1}
                marginBottom={1}
                variant="h6"
                textAlign="center"
                gutterBottom
              >
                {t("medicalInstitutionManagement.form.headers.entity_details")}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="entity_name"
                    label={t(
                      "medicalInstitutionManagement.form.entity_name.label"
                    )}
                    name="entity_name"
                    autoComplete="entity_name"
                    // autofocus
                    disabled={processing}
                    value={formik.values.entity_name}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.entity_name &&
                      Boolean(formik.errors.entity_name)
                    }
                    helperText={
                      formik.touched.entity_name && formik.errors.entity_name
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="entity_poc"
                    label={t(
                      "medicalInstitutionManagement.form.entity_poc.label"
                    )}
                    name="entity_poc"
                    autoComplete="entity_poc"
                    // autofocus
                    disabled={processing}
                    value={formik.values.entity_poc}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.entity_poc &&
                      Boolean(formik.errors.entity_poc)
                    }
                    helperText={
                      formik.touched.entity_poc && formik.errors.entity_poc
                    }
                  />
                </Grid>
              </Grid>

              <Typography
                marginTop={1}
                marginBottom={1}
                variant="h6"
                textAlign="center"
                gutterBottom
              >
                {t("medicalInstitutionManagement.form.headers.licenses")}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl
                    // sx={{ m: 1, minWidth: 120 }}
                    fullWidth
                    size="small"
                    // component="fieldset"
                    margin="dense"
                  >
                    <InputLabel id="licenses">
                      {t("medicalInstitutionManagement.form.mi_licenses.label")}
                    </InputLabel>
                    <Select
                      fullWidth
                      autoComplete="licenses"
                      // // autofocus
                      size="small"
                      name="licenses"
                      // margin='dense'
                      id="licenses"
                      label={t(
                        "medicalInstitutionManagement.form.mi_licenses.label"
                      )}
                      labelId="licenses"
                      disabled={processing}
                      value={formik.values.licenses}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.licenses &&
                        Boolean(formik.errors.licenses)
                      }
                    >
                      {mi_licenses.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {t(option.label)}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {formik.touched.licenses && formik.errors.licenses}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="license_number"
                    label={t(
                      "medicalInstitutionManagement.form.mi_license_no.label"
                    )}
                    name="license_number"
                    autoComplete="license_number"
                    // autofocus
                    disabled={processing}
                    value={formik.values.license_number}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.license_number &&
                      Boolean(formik.errors.license_number)
                    }
                    helperText={
                      formik.touched.license_number &&
                      formik.errors.license_number
                    }
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DatePicker
                    label={t(
                      "medicalInstitutionManagement.form.date_obtained.label"
                    )}
                    inputFormat="yyyy/MM/dd"
                    value={
                      formik.values.date_obtained
                        ? new Date(formik.values.date_obtained)
                        : null
                    }
                    onChange={(date: Date | null) => {
                      formik.setFieldValue("date_obtained", date);
                    }}
                    renderInput={(params: any) => (
                      <TextField
                        size="small"
                        {...params}
                        id="physician_birth_date"
                        disabled={processing}
                        fullWidth
                        margin="dense"
                        name="physician_birth_date"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Typography
                marginTop={1}
                marginBottom={1}
                variant="h6"
                textAlign="center"
                gutterBottom
              >
                {t("medicalInstitutionManagement.form.headers.ojt_agency_name")}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="ojt_implementation_name"
                    label={t(
                      "medicalInstitutionManagement.form.ojt_implementation.label"
                    )}
                    name="ojt_implementation_name"
                    autoComplete="ojt_implementation_name"
                    // autofocus
                    disabled={processing}
                    value={formik.values.ojt_implementation_name}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.ojt_implementation_name &&
                      Boolean(formik.errors.ojt_implementation_name)
                    }
                    helperText={
                      formik.touched.ojt_implementation_name &&
                      formik.errors.ojt_implementation_name
                    }
                  />
                </Grid>
                {/* <Grid item xs={6}></Grid> */}
              </Grid>
            </Grid>
            {/* Second Column */}
            <Grid item xs={6}>
              <Typography
                marginTop={1}
                marginBottom={1}
                variant="h6"
                textAlign="center"
                gutterBottom
              >
                {t("medicalInstitutionManagement.form.headers.mi_details")}
              </Typography>

              <TextField
                size="small"
                margin="dense"
                fullWidth
                id="medical_institution_name"
                label={t("medicalInstitutionManagement.form.mi_name.label")}
                name="medical_institution_name"
                autoComplete="medical_institution_name"
                // autofocus
                disabled={processing}
                value={formik.values.medical_institution_name}
                onChange={formik.handleChange}
                error={
                  formik.touched.medical_institution_name &&
                  Boolean(formik.errors.medical_institution_name)
                }
                helperText={
                  formik.touched.medical_institution_name &&
                  formik.errors.medical_institution_name
                }
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="medical_institution_type"
                    label={t("medicalInstitutionManagement.form.mi_type.label")}
                    name="medical_institution_type"
                    autoComplete="medical_institution_type"
                    // autofocus
                    disabled={processing}
                    value={formik.values.medical_institution_type}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.medical_institution_type &&
                      Boolean(formik.errors.medical_institution_type)
                    }
                    helperText={
                      formik.touched.medical_institution_type &&
                      formik.errors.medical_institution_type
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="medical_institution_poc"
                    label={t("medicalInstitutionManagement.form.mi_poc.label")}
                    name="medical_institution_poc"
                    autoComplete="medical_institution_poc"
                    // autofocus
                    disabled={processing}
                    value={formik.values.medical_institution_poc}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.medical_institution_poc &&
                      Boolean(formik.errors.medical_institution_poc)
                    }
                    helperText={
                      formik.touched.medical_institution_poc &&
                      formik.errors.medical_institution_poc
                    }
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="medical_institution_postal_code"
                    label={t(
                      "medicalInstitutionManagement.form.mi_postal_code.label"
                    )}
                    name="medical_institution_postal_code"
                    autoComplete="medical_institution_postal_code"
                    // autofocus

                    disabled={processing}
                    value={formik.values.medical_institution_postal_code}
                    onChange={formik.handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">〒</InputAdornment>
                      ),
                    }}
                    error={
                      formik.touched.medical_institution_postal_code &&
                      Boolean(formik.errors.medical_institution_postal_code)
                    }
                    helperText={
                      formik.touched.medical_institution_postal_code &&
                      formik.errors.medical_institution_postal_code
                    }
                  />
                </Grid>
              </Grid>

              <TextField
                size="small"
                margin="dense"
                fullWidth
                id="medical_institution_address1"
                label={t("medicalInstitutionManagement.form.mi_address1.label")}
                name="medical_institution_address1"
                autoComplete="medical_institution_address1"
                // autofocus
                disabled={processing}
                multiline
                minRows={2}
                maxRows={2}
                value={formik.values.medical_institution_address1}
                onChange={formik.handleChange}
                error={
                  formik.touched.medical_institution_address1 &&
                  Boolean(formik.errors.medical_institution_address1)
                }
                helperText={
                  formik.touched.medical_institution_address1 &&
                  formik.errors.medical_institution_address1
                }
              />

              <TextField
                size="small"
                margin="dense"
                fullWidth
                id="medical_institution_address2"
                label={t("medicalInstitutionManagement.form.mi_address2.label")}
                name="medical_institution_address2"
                autoComplete="medical_institution_address2"
                // autofocus
                disabled={processing}
                multiline
                minRows={2}
                maxRows={2}
                value={formik.values.medical_institution_address2}
                onChange={formik.handleChange}
                error={
                  formik.touched.medical_institution_address2 &&
                  Boolean(formik.errors.medical_institution_address2)
                }
                helperText={
                  formik.touched.medical_institution_address2 &&
                  formik.errors.medical_institution_address2
                }
              />

              <Typography
                marginTop={1}
                marginBottom={1}
                variant="h6"
                textAlign="center"
                gutterBottom
              >
                {t("medicalInstitutionManagement.form.headers.mi_contact")}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="medical_institution_phone"
                    label={t(
                      "medicalInstitutionManagement.form.mi_phone.label"
                    )}
                    name="medical_institution_phone"
                    autoComplete="medical_institution_phone"
                    // autofocus
                    disabled={processing}
                    value={formik.values.medical_institution_phone}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.medical_institution_phone &&
                      Boolean(formik.errors.medical_institution_phone)
                    }
                    helperText={
                      formik.touched.medical_institution_phone &&
                      formik.errors.medical_institution_phone
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="medical_institution_fax"
                    label={t("medicalInstitutionManagement.form.mi_fax.label")}
                    name="medical_institution_fax"
                    autoComplete="medical_institution_fax"
                    // autofocus
                    disabled={processing}
                    value={formik.values.medical_institution_fax}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.medical_institution_fax &&
                      Boolean(formik.errors.medical_institution_fax)
                    }
                    helperText={
                      formik.touched.medical_institution_fax &&
                      formik.errors.medical_institution_fax
                    }
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={7}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="medical_institution_email"
                    label={t(
                      "medicalInstitutionManagement.form.mi_email.label"
                    )}
                    name="medical_institution_email"
                    autoComplete="medical_institution_email"
                    // autofocus
                    disabled={processing}
                    value={formik.values.medical_institution_email}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.medical_institution_email &&
                      Boolean(formik.errors.medical_institution_email)
                    }
                    helperText={
                      formik.touched.medical_institution_email &&
                      formik.errors.medical_institution_email
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <LoadingButton loading={processing} type="submit" variant="contained">
            {editMode
              ? t("medicalInstitutionManagement.modal.edit.action")
              : t("medicalInstitutionManagement.modal.add.action")}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MedicalInstitutionDialog;
