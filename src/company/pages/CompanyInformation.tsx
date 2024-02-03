import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  // Autocomplete,
  // FormControl,
  // FormHelperText,
  // InputLabel,
  // MenuItem,
  // Select,
  Grid,
  InputAdornment,
} from "@mui/material";

import React from "react";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
// import { useUpdateProfileInfo } from "../../admin/hooks/useUpdateProfileInfo";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { CompanyInfo } from "../types/companyInfo";
// import { useAuth } from "../../auth/contexts/AuthProvider";
// import { mysOrgCode } from "../../api/server";
import { useCompanyInfo } from "../hooks/useCompanyInfo";
import { useUpdateCompanyInfo } from "../hooks/useUpdateCompanyInfo";

const CompanyInformation = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  // call useAuth to get the email from userInfo
  //   const { userInfo } = useAuth();
  const { data, refetch } = useCompanyInfo("MYS8A3B2C1D");
  const { isUpdating, updateCompanyInfo } = useUpdateCompanyInfo();

  // refetch();

  const formik = useFormik({
    initialValues: {
      name: data ? data.name : "",
      email: data ? data.email : "",
      address: data ? data.address : "",
      organization_code: data ? data.organization_code : "",
      postal_code: data ? data.postal_code : "",
      phone: data ? data.phone : "",
      website: data ? data.website : "",
    },
    validationSchema: Yup.object({
      address: Yup.string()
        // .email(t("common.validations.email"))
        .required(t("common.validations.required")),
      name: Yup.string().required(t("common.validations.required")),
      postal_code: Yup.string().required(t("common.validations.required")),
      phone: Yup.string().required(t("common.validations.required")),
    }),
    onSubmit: (values) => handleSubmit(values),
  });

  const handleSubmit = async (values: Partial<CompanyInfo>) => {
    // resets the data when re-rendered
    // refetch();

    updateCompanyInfo({
      ...values,
      id: data?.id,
    } as CompanyInfo)
      .then(() => {
        snackbar.success(t("company.notifications.updateSuccess"));
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit} noValidate>
        <Card>
          <CardHeader title={t("company.title")} />

          <CardContent>
            <TextField
              margin="normal"
              fullWidth
              id="organization_code"
              label={t("company.form.organization_code.label")}
              name="organization_code"
              autoComplete="company-organization_code"
              autoFocus
              disabled={true}
              value={formik.values.organization_code}
              onChange={formik.handleChange}
              error={
                formik.touched.organization_code &&
                Boolean(formik.errors.organization_code)
              }
              helperText={
                formik.touched.organization_code &&
                formik.errors.organization_code
              }
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label={t("company.form.name.label")}
              name="name"
              autoComplete="company-name"
              autoFocus
              disabled={isUpdating}
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="address"
                  label={t("company.form.address.label")}
                  name="address"
                  autoComplete="company-address"
                  autoFocus
                  multiline
                  minRows={2}
                  disabled={isUpdating}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="postal_code"
                  label={t("company.form.postal_code.label")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">〒</InputAdornment>
                    ),
                  }}
                  name="postal_code"
                  autoComplete="company-postal_code"
                  autoFocus
                  disabled={isUpdating}
                  value={formik.values.postal_code}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.postal_code &&
                    Boolean(formik.errors.postal_code)
                  }
                  helperText={
                    formik.touched.postal_code && formik.errors.postal_code
                  }
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="phone"
                  label={t("company.form.phone.label")}
                  name="phone"
                  autoComplete="company-phone"
                  autoFocus
                  disabled={isUpdating}
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label={t("company.form.email.label")}
                  name="email"
                  autoComplete="company-email"
                  autoFocus
                  disabled={isUpdating}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
            </Grid>

            <TextField
              margin="normal"
              fullWidth
              id="website"
              label={t("company.form.website.label")}
              name="website"
              autoComplete="company-website"
              autoFocus
              disabled={isUpdating}
              value={formik.values.website}
              onChange={formik.handleChange}
              error={formik.touched.website && Boolean(formik.errors.website)}
              helperText={formik.touched.website && formik.errors.website}
            />
          </CardContent>
          <CardActions>
            <Button onClick={() => formik.resetForm()}>
              {t("common.reset")}
            </Button>
            <LoadingButton
              disabled={!formik.dirty && !formik.isSubmitting}
              loading={isUpdating}
              type="submit"
              variant="contained"
            >
              {t("common.update")}
            </LoadingButton>
          </CardActions>
        </Card>
      </form>
    </React.Fragment>
  );
};
export default CompanyInformation;
