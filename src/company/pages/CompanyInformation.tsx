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
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Input,
} from "@mui/material";

import React, { useEffect } from "react";
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
import { Link } from "react-router-dom";

const CompanyInformation = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const [currentCompany, setCurrentCompany] = React.useState("MYS");

  // call useAuth to get the email from userInfo
  //   const { userInfo } = useAuth();
  const { data } = useCompanyInfo(currentCompany);
  const { isUpdating, updateCompanyInfo } = useUpdateCompanyInfo();

  useEffect(() => {
    if (data) {
      formik.setValues({
        organization_code: data.organization_code,
        name: data.name,
        headoffice_address: data.headoffice_address,
        headoffice_postalcode: data.headoffice_postalcode,
        establishment_date: data.establishment_date,
        representative_name: data.representative_name,
        capital: data.capital,
        num_of_employees: data.num_of_employees,
        business_details: data.business_details,
        main_client: data.main_client,
        telephone_number: data.telephone_number,
        fax_number: data.fax_number,
        email: data.email,
        website: data.website,
        corporate_number: data.corporate_number,
        office_number: data.office_number,
        trading_account: data.trading_account,
        registration_number: data.registration_number,
        registration_date: data.registration_date,
        validity_period: data.validity_period,
        online_application_id: data.online_application_id,
        online_application_pass: data.online_application_pass,
        application_agent_certificate: data.application_agent_certificate,
        service_type: data.service_type,
        plan_start_date: data.plan_start_date,
        specified_validity_period: data.specified_validity_period,
      });
    }
  }, [data]);

  // refetch();

  const handleSubmit = (values: Partial<CompanyInfo>) => {
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

  const formik = useFormik({
    initialValues: {
      organization_code: data ? data.organization_code : "",
      name: data ? data.name : "",
      headoffice_address: data ? data.headoffice_address : "",
      headoffice_postalcode: data ? data.headoffice_postalcode : "",
      establishment_date: data ? data.establishment_date : "",
      representative_name: data ? data.representative_name : "",
      capital: data ? data.capital : "",
      num_of_employees: data ? data.num_of_employees : "",
      business_details: data ? data.business_details : "",
      main_client: data ? data.main_client : "",
      telephone_number: data ? data.telephone_number : "",
      fax_number: data ? data.fax_number : "",
      email: data ? data.email : "",
      website: data ? data.website : "",
      corporate_number: data ? data.corporate_number : "",
      office_number: data ? data.office_number : "",
      trading_account: data ? data.trading_account : "",
      registration_number: data ? data.registration_number : "",
      registration_date: data ? data.registration_date : "",
      validity_period: data ? data.validity_period : "",
      online_application_id: data ? data.online_application_id : "",
      online_application_pass: data ? data.online_application_pass : "",
      application_agent_certificate: data
        ? data.application_agent_certificate
        : "",
      service_type: data ? data.service_type : "",
      plan_start_date: data ? data.plan_start_date : "",
      specified_validity_period: data ? data.specified_validity_period : "",
    },
    validationSchema: Yup.object({
      // address: Yup.string()
      //   // .email(t("common.validations.email"))
      //   .required(t("common.validations.required")),
      name: Yup.string().required(t("common.validations.required")),
      // postal_code: Yup.string().required(t("common.validations.required")),
      // phone: Yup.string().required(t("common.validations.required")),
    }),
    onSubmit: handleSubmit,
  });

  const handleCurrentCompanyChange = (
    event: React.MouseEvent<HTMLElement>,
    newCurrentCompany: string
  ) => {
    setCurrentCompany(newCurrentCompany);
  };

  return (
    <React.Fragment>
      <Card>
        {/* <CardHeader title={t("company.title")} /> */}
        <form onSubmit={formik.handleSubmit} noValidate>
          <CardContent>
            <ToggleButtonGroup
              color="info"
              size="small"
              value={currentCompany}
              exclusive
              onChange={handleCurrentCompanyChange}
              aria-label="companies"
            >
              <ToggleButton
                sx={{
                  paddingX: 2,
                  marginX: 0.4,
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                  //hover
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                }}
                disableRipple
                value="MYS"
              >
                MYS
              </ToggleButton>
              <ToggleButton
                sx={{
                  paddingX: 2,
                  marginX: 0.4,
                  "&.Mui-selected": {
                    backgroundColor: "#324554",
                    color: "white",
                  },
                  //hover
                  "&:hover": {
                    backgroundColor: "#324554",
                    color: "white",
                  },
                }}
                disableRipple
                value="FJL"
              >
                FJL
              </ToggleButton>
              <ToggleButton
                sx={{
                  paddingX: 2,
                  marginX: 0.4,
                  "&.Mui-selected": {
                    backgroundColor: "#664450",
                    color: "white",
                  },
                  //hover
                  "&:hover": {
                    backgroundColor: "#664450",
                    color: "white",
                  },
                }}
                disableRipple
                value="ACS"
              >
                ACS
              </ToggleButton>
            </ToggleButtonGroup>

            {/* <TextField
              margin="normal"
              fullWidth
              id="organization_code"
              label={t("company.form.organization_code")}
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
            /> */}

            <Grid container spacing={1}>
              <Grid item xs={3}>
                {currentCompany === "MYS" && (
                  <>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.name")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.establishment_date")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.headoffice_postalcode")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.headoffice_address")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.representative_name")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.capital")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.num_of_employees")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.business_details")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.main_client")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.telephone_number")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.fax_number")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.fax_web")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.email")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.website")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.corporate_number")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.office_number")}
                    </Typography>
                    <Typography
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.trading_account")}
                    </Typography>
                  </>
                )}
                {currentCompany === "FJL" && (
                  <>
                    <Typography
                      color="#324554"
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.name")}
                    </Typography>
                    <Typography
                      color="#324554"
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.registration_number")}
                    </Typography>
                    <Typography
                      color="#324554"
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.registration_date")}
                    </Typography>
                    <Typography
                      color="#324554"
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.validity_period")}
                    </Typography>
                    <Typography
                      color="#324554"
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.online_application_id")}
                    </Typography>
                    <Typography
                      color="#324554"
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.online_application_pass")}
                    </Typography>
                    <Typography
                      color="#324554"
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.application_agent_certificate")}
                    </Typography>
                  </>
                )}

                {currentCompany === "ACS" && (
                  <>
                    <Typography
                      color="#664450"
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.name")}
                    </Typography>
                    <Typography
                      color="#664450"
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.registration_number")}
                    </Typography>
                    <Typography
                      color="#664450"
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.service_type")}
                    </Typography>
                    <Typography
                      color="#664450"
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.plan_start_date")}
                    </Typography>
                    <Typography
                      color="#664450"
                      sx={{ marginTop: 2.1, textAlign: "left" }}
                      variant="h5"
                    >
                      {t("company.form.specified_validity_period")}
                    </Typography>
                  </>
                )}
              </Grid>
              <Grid item xs={9}>
                {currentCompany === "MYS" && (
                  <>
                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      value={formik.values.name}
                      name="name"
                      onChange={formik.handleChange}
                    />
                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      value={formik.values.establishment_date}
                      name="establishment_date"
                      onChange={formik.handleChange}
                    />
                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      value={formik.values.headoffice_postalcode}
                      name="headoffice_postalcode"
                      onChange={formik.handleChange}
                    />
                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      value={formik.values.headoffice_address}
                      name="headoffice_address"
                      onChange={formik.handleChange}
                    />
                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      value={formik.values.representative_name}
                      name="representative_name"
                      onChange={formik.handleChange}
                    />
                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      value={formik.values.capital}
                      name="capital"
                      onChange={formik.handleChange}
                    />
                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      value={formik.values.num_of_employees}
                      name="num_of_employees"
                      onChange={formik.handleChange}
                    />
                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      value={formik.values.business_details}
                      name="business_details"
                      onChange={formik.handleChange}
                    />
                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      value={formik.values.main_client}
                      name="main_client"
                      onChange={formik.handleChange}
                    />
                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      value={formik.values.telephone_number}
                      name="telephone_number"
                      onChange={formik.handleChange}
                    />
                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      value={formik.values.fax_number}
                      name="fax_number"
                      onChange={formik.handleChange}
                    />

                    {/* <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      // value={formik.values.fax_number}
                      value={""}
                      name="fax_number"
                      onChange={formik.handleChange}
                    /> */}
                    <Button
                      sx={{
                        marginTop: 1.2,
                        padding: 0,
                        color: "#BC4566",
                        fontSize: "1rem",
                        fontWeight: "normal",
                      }}
                      variant="text"
                      // color="primary"
                      onClick={() =>
                        window.open(
                          "https://flservice.covia.jp/fleafax/fleafax_send.php"
                        )
                      }
                    >
                      https://flservice.covia.jp/fleafax/fleafax_send.php
                    </Button>

                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      value={formik.values.email}
                      name="email"
                      onChange={formik.handleChange}
                    />
                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      value={formik.values.website}
                      name="website"
                      onChange={formik.handleChange}
                    />
                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      value={formik.values.corporate_number}
                      name="corporate_number"
                      onChange={formik.handleChange}
                    />
                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      value={formik.values.office_number}
                      name="office_number"
                      onChange={formik.handleChange}
                    />
                    <Input
                      sx={{ marginTop: 1.2 }}
                      fullWidth
                      multiline
                      maxRows={3}
                      value={formik.values.trading_account}
                      name="trading_account"
                      onChange={formik.handleChange}
                    />
                  </>
                )}

                {currentCompany === "FJL" && (
                  <>
                    <Input
                      color="info"
                      sx={{ color: "#324554", marginTop: 1.2 }}
                      fullWidth
                      multiline
                      maxRows={3}
                      value={formik.values.name}
                      name="name"
                      onChange={formik.handleChange}
                    />
                    <Input
                      color="info"
                      sx={{ color: "#324554", marginTop: 1.2 }}
                      fullWidth
                      multiline
                      maxRows={3}
                      value={formik.values.registration_number}
                      name="registration_number"
                      onChange={formik.handleChange}
                    />
                    <Input
                      color="info"
                      sx={{ color: "#324554", marginTop: 1.2 }}
                      fullWidth
                      multiline
                      maxRows={3}
                      value={formik.values.registration_date}
                      name="registration_date"
                      onChange={formik.handleChange}
                    />
                    <Input
                      color="info"
                      sx={{ color: "#324554", marginTop: 1.2 }}
                      fullWidth
                      multiline
                      maxRows={3}
                      value={formik.values.validity_period}
                      name="validity_period"
                      onChange={formik.handleChange}
                    />
                    <Input
                      color="info"
                      sx={{ color: "#324554", marginTop: 1.2 }}
                      fullWidth
                      multiline
                      maxRows={3}
                      value={formik.values.online_application_id}
                      name="online_application_id"
                      onChange={formik.handleChange}
                    />
                    <Input
                      color="info"
                      sx={{ color: "#324554", marginTop: 1.2 }}
                      fullWidth
                      multiline
                      maxRows={3}
                      value={formik.values.online_application_pass}
                      name="online_application_pass"
                      onChange={formik.handleChange}
                    />
                    <Input
                      color="info"
                      sx={{ color: "#324554", marginTop: 1.2 }}
                      fullWidth
                      multiline
                      maxRows={3}
                      value={formik.values.application_agent_certificate}
                      name="application_agent_certificate"
                      onChange={formik.handleChange}
                    />
                  </>
                )}

                {currentCompany === "ACS" && (
                  <>
                    <Input
                      color="info"
                      sx={{ color: "#664450", marginTop: 1.2 }}
                      fullWidth
                      multiline
                      maxRows={3}
                      value={formik.values.name}
                      name="name"
                      onChange={formik.handleChange}
                    />
                    <Input
                      color="info"
                      sx={{ color: "#664450", marginTop: 1.2 }}
                      fullWidth
                      multiline
                      maxRows={3}
                      value={formik.values.registration_number}
                      name="registration_number"
                      onChange={formik.handleChange}
                    />
                    <Input
                      color="info"
                      sx={{ color: "#664450", marginTop: 1.2 }}
                      fullWidth
                      multiline
                      maxRows={3}
                      value={formik.values.service_type}
                      name="service_type"
                      onChange={formik.handleChange}
                    />
                    <Input
                      color="info"
                      sx={{ color: "#664450", marginTop: 1.2 }}
                      fullWidth
                      multiline
                      maxRows={3}
                      value={formik.values.plan_start_date}
                      name="plan_start_date"
                      onChange={formik.handleChange}
                    />
                    <Input
                      color="info"
                      sx={{ color: "#664450", marginTop: 1.2 }}
                      fullWidth
                      multiline
                      maxRows={3}
                      value={formik.values.specified_validity_period}
                      name="specified_validity_period"
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              {/* <Grid item xs={12} sm={8}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label={t("company.form.name")}
                  name="name"
                  autoComplete="company-name"
                  autoFocus
                  disabled={isUpdating}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid> */}

              {/* {currentCompany === "MYS" && (
                <>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="establishment_date"
                      label={t("company.form.establishment_date")}
                      name="establishment_date"
                      autoComplete="company-establishment_date"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.establishment_date}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.establishment_date &&
                        Boolean(formik.errors.establishment_date)
                      }
                      helperText={
                        formik.touched.establishment_date &&
                        formik.errors.establishment_date
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={8}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="headoffice_address"
                      label={t("company.form.headoffice_address")}
                      name="headoffice_address"
                      autoComplete="company-headoffice_address"
                      autoFocus
                      multiline
                      minRows={2}
                      disabled={isUpdating}
                      value={formik.values.headoffice_address}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.headoffice_address &&
                        Boolean(formik.errors.headoffice_address)
                      }
                      helperText={
                        formik.touched.headoffice_address &&
                        formik.errors.headoffice_address
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="postal_code"
                      label={t("company.form.headoffice_postalcode")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">〒</InputAdornment>
                        ),
                      }}
                      name="headoffice_postalcode"
                      autoComplete="company-headoffice_postalcode"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.headoffice_postalcode}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.headoffice_postalcode &&
                        Boolean(formik.errors.headoffice_postalcode)
                      }
                      helperText={
                        formik.touched.headoffice_postalcode &&
                        formik.errors.headoffice_postalcode
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={5}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="representative_name"
                      label={t("company.form.representative_name")}
                      name="representative_name"
                      autoComplete="representative_name"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.representative_name}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.representative_name &&
                        Boolean(formik.errors.representative_name)
                      }
                      helperText={
                        formik.touched.representative_name &&
                        formik.errors.representative_name
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="capital"
                      label={t("company.form.capital")}
                      name="capital"
                      autoComplete="company-capital"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.capital}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.capital && Boolean(formik.errors.capital)
                      }
                      helperText={
                        formik.touched.capital && formik.errors.capital
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="num_of_employees"
                      label={t("company.form.num_of_employees")}
                      name="num_of_employees"
                      autoComplete="company-num_of_employees"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.num_of_employees}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.num_of_employees &&
                        Boolean(formik.errors.num_of_employees)
                      }
                      helperText={
                        formik.touched.num_of_employees &&
                        formik.errors.num_of_employees
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      multiline
                      minRows={2}
                      id="business_details"
                      label={t("company.form.business_details")}
                      name="business_details"
                      autoComplete="company-business_details"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.business_details}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.business_details &&
                        Boolean(formik.errors.business_details)
                      }
                      helperText={
                        formik.touched.business_details &&
                        formik.errors.business_details
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      multiline
                      minRows={2}
                      id="main_client"
                      label={t("company.form.main_client")}
                      name="main_client"
                      autoComplete="company-main_client"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.main_client}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.main_client &&
                        Boolean(formik.errors.main_client)
                      }
                      helperText={
                        formik.touched.main_client && formik.errors.main_client
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="telephone_number"
                      label={t("company.form.telephone_number")}
                      name="telephone_number"
                      autoComplete="company-telephone_number"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.telephone_number}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.telephone_number &&
                        Boolean(formik.errors.telephone_number)
                      }
                      helperText={
                        formik.touched.telephone_number &&
                        formik.errors.telephone_number
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="fax_number"
                      label={t("company.form.fax_number")}
                      name="fax_number"
                      autoComplete="company-telephone_number"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.fax_number}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.fax_number &&
                        Boolean(formik.errors.fax_number)
                      }
                      helperText={
                        formik.touched.fax_number && formik.errors.fax_number
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="email"
                      label={t("company.form.email")}
                      name="email"
                      autoComplete="company-email"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="website"
                      label={t("company.form.website")}
                      name="website"
                      autoComplete="company-website"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.website}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.website && Boolean(formik.errors.website)
                      }
                      helperText={
                        formik.touched.website && formik.errors.website
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="corporate_number"
                      label={t("company.form.corporate_number")}
                      name="corporate_number"
                      autoComplete="company-corporate_number"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.corporate_number}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.corporate_number &&
                        Boolean(formik.errors.corporate_number)
                      }
                      helperText={
                        formik.touched.corporate_number &&
                        formik.errors.corporate_number
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="office_number"
                      label={t("company.form.office_number")}
                      name="office_number"
                      autoComplete="company-office_number"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.office_number}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.office_number &&
                        Boolean(formik.errors.office_number)
                      }
                      helperText={
                        formik.touched.office_number &&
                        formik.errors.office_number
                      }
                    />
                  </Grid>

                  <TextField
                    margin="normal"
                    fullWidth
                    multiline
                    minRows={4}
                    id="trading_account"
                    label={t("company.form.trading_account")}
                    name="trading_account"
                    autoComplete="company-trading_account"
                    autoFocus
                    disabled={isUpdating}
                    value={formik.values.trading_account}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.trading_account &&
                      Boolean(formik.errors.trading_account)
                    }
                    helperText={
                      formik.touched.trading_account &&
                      formik.errors.trading_account
                    }
                  />
                </>
              )} */}

              {/* {currentCompany === "FJL" && (
                <>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="registration_number"
                      label={t("company.form.registration_number")}
                      name="registration_number"
                      autoComplete="company-registration_number"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.registration_number}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.registration_number &&
                        Boolean(formik.errors.registration_number)
                      }
                      helperText={
                        formik.touched.registration_number &&
                        formik.errors.registration_number
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="registration_date"
                      label={t("company.form.registration_date")}
                      name="registration_date"
                      autoComplete="company-registration_date"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.registration_date}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.registration_date &&
                        Boolean(formik.errors.registration_date)
                      }
                      helperText={
                        formik.touched.registration_date &&
                        formik.errors.registration_date
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="validity_period"
                      label={t("company.form.validity_period")}
                      name="validity_period"
                      autoComplete="company-validity_period"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.validity_period}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.validity_period &&
                        Boolean(formik.errors.validity_period)
                      }
                      helperText={
                        formik.touched.validity_period &&
                        formik.errors.validity_period
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="online_application_id"
                      label={t("company.form.online_application_id")}
                      name="online_application_id"
                      autoComplete="company-online_application_id"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.online_application_id}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.online_application_id &&
                        Boolean(formik.errors.online_application_id)
                      }
                      helperText={
                        formik.touched.online_application_id &&
                        formik.errors.online_application_id
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="online_application_pass"
                      label={t("company.form.online_application_pass")}
                      name="online_application_pass"
                      autoComplete="company-online_application_pass"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.online_application_pass}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.online_application_pass &&
                        Boolean(formik.errors.online_application_pass)
                      }
                      helperText={
                        formik.touched.online_application_pass &&
                        formik.errors.online_application_pass
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="application_agent_certificate"
                      label={t("company.form.application_agent_certificate")}
                      name="application_agent_certificate"
                      autoComplete="company-application_agent_certificate"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.application_agent_certificate}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.application_agent_certificate &&
                        Boolean(formik.errors.application_agent_certificate)
                      }
                      helperText={
                        formik.touched.application_agent_certificate &&
                        formik.errors.application_agent_certificate
                      }
                    />
                  </Grid>
                </>
              )} */}

              {/* {currentCompany === "ACS" && (
                <>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="office_number"
                      label={t("company.form.office_number")}
                      name="office_number"
                      autoComplete="company-office_number"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.office_number}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.office_number &&
                        Boolean(formik.errors.office_number)
                      }
                      helperText={
                        formik.touched.office_number &&
                        formik.errors.office_number
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="service_type"
                      label={t("company.form.service_type")}
                      name="service_type"
                      autoComplete="company-service_type"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.service_type}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.service_type &&
                        Boolean(formik.errors.service_type)
                      }
                      helperText={
                        formik.touched.service_type &&
                        formik.errors.service_type
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="plan_start_date"
                      label={t("company.form.plan_start_date")}
                      name="plan_start_date"
                      autoComplete="company-plan_start_date"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.plan_start_date}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.plan_start_date &&
                        Boolean(formik.errors.plan_start_date)
                      }
                      helperText={
                        formik.touched.plan_start_date &&
                        formik.errors.plan_start_date
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="specified_validity_period"
                      label={t("company.form.specified_validity_period")}
                      name="specified_validity_period"
                      autoComplete="company-specified_validity_period"
                      autoFocus
                      disabled={isUpdating}
                      value={formik.values.specified_validity_period}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.specified_validity_period &&
                        Boolean(formik.errors.specified_validity_period)
                      }
                      helperText={
                        formik.touched.specified_validity_period &&
                        formik.errors.specified_validity_period
                      }
                    />
                  </Grid>
                </>
              )} */}
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              sx={{
                color:
                  currentCompany === "FJL"
                    ? "#324554"
                    : currentCompany === "ACS"
                    ? "#664450"
                    : "primary.main",
              }}
              onClick={() => formik.resetForm()}
            >
              {t("common.reset")}
            </Button>
            <LoadingButton
              disabled={!formik.dirty && !formik.isSubmitting}
              loading={isUpdating}
              type="submit"
              sx={{
                backgroundColor:
                  currentCompany === "FJL"
                    ? "#324554"
                    : currentCompany === "ACS"
                    ? "#664450"
                    : "primary.main",
              }}
              variant="contained"
            >
              {t("common.edit")}
            </LoadingButton>
          </CardActions>
        </form>
      </Card>
    </React.Fragment>
  );
};
export default CompanyInformation;
