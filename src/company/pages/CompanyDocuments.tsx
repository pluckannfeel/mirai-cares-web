import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { LoadingButton, DatePicker } from "@mui/lab";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import { useSnackbar } from "../../core/contexts/SnackbarProvider";

import { useStaffSelect } from "../../staff/hooks/useStaffSelection";
import { GenerateCompanyDocument } from "../types/companyDocuments";

import { usePatientSelect } from "../../patients/hooks/usePatientSelection";

import { documents } from "../helper/helper";

import { useCompanyGenerateDocument } from "../hooks/useCompanyGenerateDocument";
import { useInstitutionsSelect } from "../../medical_institution/hooks/useInstitutionSelection";
import { axiosInstance, baseUrl } from "../../api/server";

const CompanyDocuments = () => {
  const snackbar = useSnackbar();
  const { t, i18n } = useTranslation();

  // get staff select
  const { data: staffSelect } = useStaffSelect();
  const { data: patientSelect } = usePatientSelect();
  const { data: institutionSelect } = useInstitutionsSelect();

  const { isGenerating, generateDocument } = useCompanyGenerateDocument();

  const [docusignESignature, setDocusignESignature] = useState<boolean>(false);

  const handleDocusignESignatureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDocusignESignature(event.target.checked);
  };

  const [allowInput, setAllowInput] = useState<{
    staff: boolean;
    patient: boolean;
    institution: boolean;
  }>({
    staff: false,
    patient: false,
    institution: false,
  });

  //   const isGenerating = false;

  const formik = useFormik({
    initialValues: {
      document_name: "",
      staff: "",
      patient: "",
      institution: "",
      date_created: new Date(),
    },
    validationSchema: Yup.object({
      //   document_name: Yup.string()
      //     // .email(t("common.validations.email"))
      //     .required(t("common.validations.required")),
      //   staff: Yup.string().required(t("common.validations.required")),
      //   patient: Yup.string().required(t("common.validations.required")),
      //   date_created: Yup.string().required(t("common.validations.required")),
    }),
    onSubmit: (values) => {
      // console.log(values);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generatePdf(values as any);
    },
  });

  const generatePdf = async (values: GenerateCompanyDocument) => {
    //     try {
    //       const blob = await generateDocument(values);
    //       //   const response = await fetch(`${baseUrl}companies/generate_document`);
    //       //   console.log(response)
    //       //   const blob = await response.blob();
    //       // Create a hidden <a> element
    //       const link = document.createElement("a");
    //       link.style.display = "none";
    //       document.body.appendChild(link);
    //       // Set the <a> element's attributes
    //       link.href = window.URL.createObjectURL(blob);
    //       link.setAttribute("download", `${blob}.pdf`); // Specify the file name
    //       // Simulate a click on the <a> element to trigger the download
    //       link.click();
    //       // Cleanup by removing the <a> element
    //       document.body.removeChild(link);
    //     } catch (error) {
    //       console.error("Error downloading CSV:", error);
    //     }
    //   };

    generateDocument(values)
      .then((url: string) => {
        // snackbar.success(
        //   t("staffManagement.notifications.addSuccess", {
        //     employee: `${staff?.japanese_name}`,
        //   })
        // );
        window.open(url, "_blank");
      })
      .catch(() => {
        snackbar.error(t("company.errors.documentEmptyDetails"));
      });
  };

  const accessDocusignRequestUserConsent = async () => {
    const { data } = await axiosInstance.get(`/docusign/user_consent`);

    // check if data has cosent_url 
    if (data && data.consent_url) {
      window.open(data.consent_url, "_blank");
    }else{
      snackbar.error(t("company.errors.noUserConsentURL"));
    }
  };

  //   const handleSubmit = (values: Partial<GenerateCompanyDocument>) => {};

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit} noValidate>
        <Card>
          <CardHeader title={t("company.document.generate_document.label")} />
          <CardContent>
            <FormControl
              // sx={{ m: 1, minWidth: 120 }}
              fullWidth
              //   size="small"
              // component="fieldset"
              margin="dense"
            >
              <InputLabel id="document_name">
                {t("company.document.form.document_name.label")}
              </InputLabel>
              <Select
                fullWidth
                autoComplete="document_name"
                // // autofocus
                // size="small"
                name="document_name"
                // margin='dense'
                id="document_name"
                label={t("company.document.form.document_name.label")}
                labelId="document_name"
                disabled={isGenerating}
                value={formik.values.document_name}
                // onChange={formik.handleChange}
                onChange={(e) => {
                  // Access Formik's values within handleChange
                  formik.handleChange(e);

                  // if e.target.value is docs_sputum_training, allow all inputs, but mys_contract, only allow staff
                  if (e.target.value === "docs_sputum_training") {
                    setAllowInput({
                      staff: true,
                      patient: true,
                      institution: true,
                    });
                  } else if (e.target.value === "mys_contract") {
                    setAllowInput({
                      staff: true,
                      patient: false,
                      institution: false,
                    });
                  } else if (e.target.value === "mys_pledge") {
                    setAllowInput({
                      staff: true,
                      patient: false,
                      institution: false,
                    });
                  } else {
                    setAllowInput({
                      staff: false,
                      patient: false,
                      institution: false,
                    });
                  }
                }}
                error={
                  formik.touched.document_name &&
                  Boolean(formik.errors.document_name)
                }
              >
                {documents.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {t(option.label)}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formik.touched.document_name && formik.errors.document_name}
              </FormHelperText>
            </FormControl>

            <Autocomplete
              fullWidth
              freeSolo
              id="staff-select"
              hidden={!allowInput.staff}
              options={staffSelect || []}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }

                const name =
                  i18n.language === "en"
                    ? option.english_name
                    : option.japanese_name;

                return name;
              }}
              value={formik.values.staff ? formik.values.staff : null}
              onChange={(_, newValue) => {
                formik.setFieldValue("staff", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  label={t("company.document.form.staff.label")}
                  // InputProps={{
                  //   ...params.InputProps,
                  //   type: "search",
                  // }}
                />
              )}
            />

            <Autocomplete
              fullWidth
              freeSolo
              id="patient-select"
              hidden={!allowInput.patient}
              options={patientSelect || []}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }

                const name =
                  i18n.language === "en" ? option.name_kana : option.name_kanji;

                return name;
              }}
              value={formik.values.patient ? formik.values.patient : null}
              onChange={(_, newValue) => {
                formik.setFieldValue("patient", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  label={t("company.document.form.patient.label")}
                  // InputProps={{
                  //   ...params.InputProps,
                  //   type: "search",
                  // }}
                />
              )}
            />

            <Autocomplete
              fullWidth
              freeSolo
              id="institution-select"
              options={institutionSelect || []}
              // disabled={!allowInput.institution}
              hidden={!allowInput.institution}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                // const name =
                //   i18n.language === "en" ? option.medical_institution_name : option.name_kanji;

                return option.medical_institution_name;
              }}
              value={
                formik.values.institution ? formik.values.institution : null
              }
              onChange={(_, newValue) => {
                formik.setFieldValue("institution", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  label={t("company.document.form.institution.label")}
                  // InputProps={{
                  //   ...params.InputProps,
                  //   type: "search",
                  // }}
                />
              )}
            />

            <DatePicker
              label={t("company.document.form.date_entry.label")}
              // inputFormat="yyyy/MM/dd H:mm"
              // className="MuiMobileDatePicker"
              value={formik.values.date_created}
              onChange={(date: Date | null) =>
                formik.setFieldValue("date_created", date)
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  id="start"
                  disabled={isGenerating}
                  fullWidth
                  margin="normal"
                  name="start"
                />
              )}
            />

            {/*  use Docusign E-signature */}
            {/* <FormControlLabel
              sx={{ marginTop: "10px" }}
              control={
                <Switch
                  checked={docusignESignature}
                  onChange={handleDocusignESignatureChange}
                />
              }
              label={t("company.document.form.docusign.requestSignature")}
            /> */}

            {/* {/ if docusign is checked  */}

            {/* {docusignESignature && (
              <FormGroup sx={{ margin: "10px" }}>
                <Button
                  onClick={accessDocusignRequestUserConsent}
                  size="medium"
                  variant="contained"
                >
                  {t("company.document.form.docusign.userConsent")}
                </Button>
              </FormGroup>
            )} */}

            {/* <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
              </Grid>
              <Grid item xs={12} sm={6}>
              </Grid>
            </Grid> */}
          </CardContent>
          <CardActions>
            <Button onClick={() => formik.resetForm()}>
              {t("common.reset")}
            </Button>
            <LoadingButton
              disabled={!formik.dirty && !formik.isSubmitting}
              loading={isGenerating}
              type="submit"
              variant="contained"
            >
              {t("company.document.actions.generate")}
            </LoadingButton>
          </CardActions>
        </Card>
      </form>
    </React.Fragment>
  );
};
export default CompanyDocuments;
