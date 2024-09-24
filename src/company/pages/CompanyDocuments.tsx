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
  Checkbox,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DatePicker } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

// icon
import CloseIcon from "@mui/icons-material/Close";

import { useSnackbar } from "../../core/contexts/SnackbarProvider";

import { useStaffSelect } from "../../staff/hooks/useStaffSelection";
import {
  GenerateCompanyDocument,
} from "../types/companyDocuments";

import { usePatientSelect } from "../../patients/hooks/usePatientSelection";

import { documents, workPlaces, workTypes } from "../helper/helper";

import { useCompanyGenerateDocument } from "../hooks/useCompanyGenerateDocument";
import { useInstitutionsSelect } from "../../medical_institution/hooks/useInstitutionSelection";
import { axiosInstance, baseUrl } from "../../api/server";
import { useLocalStorage } from "../../core/hooks/useLocalStorage";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const CompanyDocuments = () => {
  const snackbar = useSnackbar();
  const { t, i18n } = useTranslation();
  const [isDocusignUserConsentOK, setIsDocusignUserConsentOK] = useLocalStorage(
    "docusignUserConsent",
    false
  );

  // get staff select
  const { data: staffSelect } = useStaffSelect();
  const { data: patientSelect } = usePatientSelect();
  const { data: institutionSelect } = useInstitutionsSelect();

  const { isGenerating, generateDocument } = useCompanyGenerateDocument();

  const [docusignESignature, setDocusignESignature] = useState<boolean>(false);

  const [allowInput, setAllowInput] = useState<{
    staff: boolean;
    patient: boolean;
    institution: boolean;

    esignature?: boolean;
    // start_period?: boolean;
    // end_period?: boolean;
    // sign_date?: boolean;
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
      attach_stamp: false,

      // docusign
      esignature: docusignESignature,
      start_period: new Date(),
      end_period: new Date(),
      sign_date: new Date(),

      job_details: "",
      place_of_work: "",
      hourly_wage: 1200,
      other_allowance: true,
      bonus: false,
      social_insurance: true,
      employment_insurance: true,

      // patient
      expiration_date: "受給者証の有効期限",

      // information manual
      person_in_charge: "笠原 有貴",

      // going out
      // going_out: {},
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
      const finalValues = {
        ...values,
        esignature: docusignESignature,
      };
      console.log(values);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generatePdf(finalValues as any);
    },
  });

  const generatePdf = async (values: GenerateCompanyDocument) => {
    generateDocument(values)
      .then((data: { url: string; status: string }) => {
        // snackbar.success(
        //   t("staffManagement.notifications.addSuccess", {
        //     employee: `${staff?.japanese_name}`,
        //   })
        // );

        if (data && data.url) {
          window.open(data.url, "_blank");
        } else {
          snackbar.success(
            `
            署名のために文書が送信されました。DocuSign アカウントにアクセスして文書のステータスを確認してください。
            `
          );
        }
      })
      .catch((error) => {
        console.error("Error generating document:", error);
        snackbar.error(t("company.errors.documentEmptyDetails"));
        snackbar.error(`Error: ${error}`);
      });
  };

  const accessDocusignRequestUserConsent = async () => {
    const { data } = await axiosInstance.get(`/docusign/user_consent`);

    // check if data has cosent_url
    if (data && data.consent_url) {
      window.open(data.consent_url, "_blank");

      // set local storage to true
      setIsDocusignUserConsentOK(true);
    } else {
      snackbar.error(t("company.errors.noUserConsentURL"));

      // set local storage to false
      setIsDocusignUserConsentOK(false);
    }
  };

  //   const handleSubmit = (values: Partial<GenerateCompanyDocument>) => {};

  const handleDocusignESignatureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDocusignESignature(event.target.checked);
  };

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit} noValidate>
        <Card>
          <CardHeader title={t("company.document.generate_document.label")} />
          <CardContent>
            <FormControl fullWidth margin="dense">
              <InputLabel
                id="document_name"
                sx={{
                  fontSize: "1.1rem",
                }}
              >
                {t("company.document.form.document_name.label")}
              </InputLabel>
              <Select
                fullWidth
                autoComplete="document_name"
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

                      esignature: true,
                    });
                  } else if (e.target.value === "mys_pledge") {
                    setAllowInput({
                      staff: true,
                      patient: false,
                      institution: false,
                    });
                  } else if (e.target.value === "patient_contract") {
                    setAllowInput({
                      staff: false,
                      patient: true,
                      institution: false,
                    });
                  } else if (
                    e.target.value === "patient_important_information_manual"
                  ) {
                    setAllowInput({
                      staff: false,
                      patient: true,
                      institution: false,
                    });
                  } else if (e.target.value === "going_out") {
                    setAllowInput({
                      staff: false,
                      patient: true,
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
                  InputLabelProps={{
                    sx: { fontSize: "1.1rem" },
                  }}
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

            {formik.values.document_name === "mys_contract" && (
              <>
                <FormControl fullWidth margin="dense">
                  <InputLabel
                    id="job_details"
                    size="small"
                    sx={{
                      fontSize: "1.1rem",
                    }}
                  >
                    {t("company.document.form.docusign.job_details")}
                  </InputLabel>
                  <Select
                    fullWidth
                    autoComplete="job_details"
                    size="small"
                    name="job_details"
                    // margin='dense'
                    id="job_details"
                    label={t("company.document.form.docusign.job_details")}
                    labelId="job_details"
                    disabled={isGenerating}
                    value={formik.values.job_details}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("job_details", value);
                    }}
                    error={
                      formik.touched.job_details &&
                      Boolean(formik.errors.job_details)
                    }
                  >
                    {workTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(option.label)}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.job_details && formik.errors.job_details}
                  </FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="dense">
                  <InputLabel
                    id="place_of_work"
                    size="small"
                    sx={{
                      fontSize: "1.1rem",
                    }}
                  >
                    {t("company.document.form.docusign.place_of_work")}
                  </InputLabel>
                  <Select
                    fullWidth
                    autoComplete="place_of_work"
                    size="small"
                    name="place_of_work"
                    // margin='dense'
                    id="place_of_work"
                    label={t("company.document.form.docusign.place_of_work")}
                    labelId="place_of_work"
                    disabled={isGenerating}
                    value={formik.values.place_of_work}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("place_of_work", value);
                    }}
                    error={
                      formik.touched.place_of_work &&
                      Boolean(formik.errors.place_of_work)
                    }
                  >
                    {workPlaces.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(option.label)}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.place_of_work &&
                      formik.errors.place_of_work}
                  </FormHelperText>
                </FormControl>

                {/* hourly wage */}
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">¥</InputAdornment>
                    ),
                  }}
                  margin="dense"
                  label={t("company.document.form.docusign.hourly_wage")}
                  type="number"
                  value={formik.values.hourly_wage}
                  onChange={(e) => {
                    formik.setFieldValue("hourly_wage", e.target.value);
                  }}
                />

                <DatePicker
                  slotProps={{
                    textField: {
                      margin: "normal",
                      size: "small",
                      fullWidth: true,
                      InputLabelProps: {
                        sx: { fontSize: "1.1rem" },
                      },
                    },
                  }}
                  format="MM/DD/YYYY"
                  label={t("company.document.form.docusign.start_period")}
                  value={dayjs.utc(formik.values.start_period)}
                  onChange={(date: Dayjs | null) => {
                    formik.setFieldValue("start_period", date);
                    //   formik.setFieldValue("age", calculateAge(date!));
                  }}
                />

                <DatePicker
                  slotProps={{
                    textField: {
                      margin: "normal",
                      size: "small",
                      fullWidth: true,
                      InputLabelProps: {
                        sx: { fontSize: "1.1rem" },
                      },
                    },
                  }}
                  format="MM/DD/YYYY"
                  label={t("company.document.form.docusign.end_period")}
                  value={dayjs.utc(formik.values.end_period)}
                  onChange={(date: Dayjs | null) => {
                    formik.setFieldValue("end_period", date);
                    //   formik.setFieldValue("age", calculateAge(date!));
                  }}
                />

                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={formik.values.other_allowance}
                        checked={formik.values.other_allowance}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "other_allowance",
                            e.target.checked
                          );
                        }}
                      />
                    }
                    label={t("company.document.form.docusign.other_allowance")}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        value={formik.values.bonus}
                        checked={formik.values.bonus}
                        onChange={(e) => {
                          formik.setFieldValue("bonus", e.target.checked);
                        }}
                      />
                    }
                    label={t("company.document.form.docusign.bonus")}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        value={formik.values.social_insurance}
                        checked={formik.values.social_insurance}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "social_insurance",
                            e.target.checked
                          );
                        }}
                      />
                    }
                    label={t("company.document.form.docusign.social_insurance")}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        value={formik.values.employment_insurance}
                        checked={formik.values.employment_insurance}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "employment_insurance",
                            e.target.checked
                          );
                        }}
                      />
                    }
                    label={t(
                      "company.document.form.docusign.employment_insurance"
                    )}
                  />
                </FormGroup>

                <DatePicker
                  slotProps={{
                    textField: {
                      margin: "normal",
                      size: "small",
                      fullWidth: true,
                      InputLabelProps: {
                        sx: { fontSize: "1.1rem" },
                      },
                    },
                  }}
                  format="YYYY/MM/DD"
                  label={t("company.document.form.docusign.sign_date")}
                  value={dayjs.utc(formik.values.sign_date)}
                  onChange={(date: Dayjs | null) => {
                    formik.setFieldValue("sign_date", date);
                    //   formik.setFieldValue("age", calculateAge(date!));
                  }}
                />

                {/*  use Docusign E-signature */}
                {allowInput.esignature && (
                  <FormControlLabel
                    sx={{ marginTop: "10px" }}
                    control={
                      <Switch
                        checked={docusignESignature}
                        onChange={handleDocusignESignatureChange}
                      />
                    }
                    label={t("company.document.form.docusign.requestSignature")}
                  />
                )}
              </>
            )}
            {docusignESignature && !isDocusignUserConsentOK && (
              <FormGroup sx={{ margin: "10px" }}>
                <FormHelperText
                  sx={{
                    color: "red",
                    marginBottom: "10px",
                    fontSize: "15px",
                  }}
                >
                  {
                    "署名する前に、DocuSign からのユーザー アカウントの同意が必要です"
                  }
                </FormHelperText>
                <Button
                  onClick={accessDocusignRequestUserConsent}
                  size="medium"
                  variant="contained"
                >
                  {t("company.document.form.docusign.userConsent")}
                </Button>
              </FormGroup>
            )}

            {formik.values.document_name === "patient_contract" && (
              <>
                <DatePicker
                  slotProps={{
                    textField: {
                      margin: "normal",
                      size: "small",
                      fullWidth: true,
                      InputLabelProps: {
                        sx: { fontSize: "1.1rem" },
                      },
                    },
                  }}
                  format="YYYY/MM/DD"
                  label={t("company.document.form.date_created.label")}
                  value={dayjs.utc(formik.values.date_created)}
                  onChange={(date: Dayjs | null) => {
                    formik.setFieldValue("date_created", date);
                  }}
                />

                {/* Expiration date text */}
                <TextField
                  fullWidth
                  margin="dense"
                  label={t("company.document.form.expiration_date.label")}
                  type="text"
                  value={formik.values.expiration_date}
                  onChange={(e) => {
                    formik.setFieldValue("expiration_date", e.target.value);
                  }}
                />

                {/* attach stamp */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.attach_stamp}
                      onChange={(e) => {
                        formik.setFieldValue("attach_stamp", e.target.checked);
                      }}
                    />
                  }
                  label={t("company.document.form.attach_stamp.label")}
                />
              </>
            )}

            {formik.values.document_name ===
              "patient_important_information_manual" && (
              <>
                <DatePicker
                  slotProps={{
                    textField: {
                      margin: "normal",
                      size: "small",
                      fullWidth: true,
                      InputLabelProps: {
                        sx: { fontSize: "1.1rem" },
                      },
                    },
                  }}
                  format="MM/DD/YYYY"
                  label={t("company.document.form.date_created.label")}
                  value={dayjs.utc(formik.values.date_created)}
                  onChange={(date: Dayjs | null) => {
                    formik.setFieldValue("date_created", date);
                  }}
                />

                {/* Expiration date text */}
                <TextField
                  fullWidth
                  margin="dense"
                  label={t("company.document.form.person_in_charge.label")}
                  type="text"
                  value={formik.values.person_in_charge}
                  onChange={(e) => {
                    formik.setFieldValue("person_in_charge", e.target.value);
                  }}
                />

                {/* attach stamp */}
                {/* <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.attach_stamp}
                      onChange={(e) => {
                        formik.setFieldValue("attach_stamp", e.target.checked);
                      }}
                    />
                  }
                  label={t("company.document.form.attach_stamp.label")}
                /> */}
              </>
            )}
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
