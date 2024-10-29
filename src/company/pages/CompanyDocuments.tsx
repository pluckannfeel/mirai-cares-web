import React, { useEffect, useState } from "react";
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
  ListSubheader,
  Typography,
  OutlinedInput,
  ListItemText,
  Divider,
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
import { GenerateCompanyDocument } from "../types/companyDocuments";

import { usePatientSelect } from "../../patients/hooks/usePatientSelection";

import {
  affiliatedCompanies,
  documents,
  otherConditionsList,
  patientSituations,
  qualificationsHeld,
  qualificationsHeld2,
  workPlaces,
  workTypes,
} from "../helper/helper";

import { useCompanyGenerateDocument } from "../hooks/useCompanyGenerateDocument";
import { useInstitutionsSelect } from "../../medical_institution/hooks/useInstitutionSelection";
import { axiosInstance, baseUrl } from "../../api/server";
import { useLocalStorage } from "../../core/hooks/useLocalStorage";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { useNursingStationsSelect } from "../../nursing_station/hooks/useNursingStationsSelect";
import {
  NurseInCharge,
  NursingStation,
} from "../../nursing_station/types/NursingStation";
import { useNurseInChargeSelect } from "../../nursing_station/hooks/useNurseInChargeSelect";
import OnSiteExerciseTrainingChecklist from "../components/OnSiteExerciseTrainingChecklist";
import BusinessSystemEstablishedChecklist from "../components/BusinessSystemEstablishedChecklist";
import { Text } from "@react-pdf/renderer";
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

  // vns and nic select
  const { data: vnsSelect } = useNursingStationsSelect();

  // sputum training ishiki 2 OSET checklist (on site exercise and training checklist)
  const [OSETCheckedItems, setOSETCheckedItems] = useState<number[]>([]);
  // sputum training ishiki 2 BSE checklist (business system established checklist)
  const [BSECheckedItems, setBSECheckedItems] = useState<number[]>([]);

  const { isGenerating, generateDocument } = useCompanyGenerateDocument();

  const [docusignESignature, setDocusignESignature] = useState<boolean>(false);

  const [nurseList, setNurseList] = useState<NurseInCharge[]>([]);

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

      // employment contract
      affiliated_company: "mys",
      company_stamp: false,

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
      witness_name: "",
      witness_email: "",

      // visiting nursing station
      visiting_nursing_station: "",
      nurse_in_charge: null,

      qualifications_held: [] as number[],
      station_qualifications_held: [] as number[],
      welfare_experience: "4ヶ月",
      current_employment_experience: "4ヶ月",
      patient_situation: "A",

      onsite_exercises_training: [] as number[],
      business_system_established: [] as number[],
      main_illness: "ALS ",
      current_conditions: [] as number[],
      ojt_instruction_content: [] as number[],

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
      // console.log(finalValues);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generatePdf(finalValues as any);
    },
  });

  useEffect(() => {
    if (!vnsSelect) {
      setNurseList([]);
      return;
    }
  }, []);

  useEffect(() => {
    if (OSETCheckedItems) {
      formik.setFieldValue("onsite_exercises_training", OSETCheckedItems);
    }

    if (BSECheckedItems) {
      formik.setFieldValue("business_system_established", BSECheckedItems);
    }
  }, [OSETCheckedItems, BSECheckedItems]);

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
        // snackbar.error(t("company.errors.documentEmptyDetails"));
        if (error.response.data["detail"]) {
          snackbar.error(`Error: ${error.response.data["detail"]}`);
        } else {
          snackbar.error(t("company.errors.documentEmptyDetails"));
        }
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

    // if it is unchecked set company_stamp to false and hide it
    if (!event.target.checked) {
      formik.setFieldValue("company_stamp", false);
    }
  };

  // sputum training document onsite exercise and training checklist
  const handleOSETCheckListChange = (number: number) => {
    setOSETCheckedItems((prev) => {
      const newItems = prev.includes(number)
        ? prev.filter((item) => item !== number) // Remove the number if it exists
        : [...prev, number].sort((a, b) => a - b); // Add the number and sort the array

      return newItems;
    });
  };

  const handleBSEChecklistChange = (number: number) => {
    setBSECheckedItems((prev) => {
      const newItems = prev.includes(number)
        ? prev.filter((item) => item !== number) // Remove the number if it exists
        : [...prev, number].sort((a, b) => a - b); // Add the number and sort the array

      return newItems;
    });
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
                id="document_name"
                label={t("company.document.form.document_name.label")}
                labelId="document_name"
                disabled={isGenerating}
                value={formik.values.document_name}
                onChange={(e) => {
                  formik.handleChange(e);

                  // Logic for allowing input based on selected document
                  if (e.target.value === "docs_sputum_training") {
                    setAllowInput({
                      staff: true,
                      patient: true,
                      institution: true,
                    });
                  } else if (e.target.value === "ehis_employment_contract") {
                    setAllowInput({
                      staff: true,
                      patient: false,
                      institution: false,
                      esignature: true,
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
                      esignature: true,
                    });
                  } else if (
                    e.target.value === "patient_important_information_manual"
                  ) {
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
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 330,
                    },
                  },
                }}
              >
                {/* Staff Group */}
                <ListSubheader sx={{ color: "grey" }}>
                  {t("company.document.groups.staff")}
                </ListSubheader>
                {documents
                  .filter((doc) => doc.group === "staff")
                  .map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {t(option.label)}
                    </MenuItem>
                  ))}

                {/* Patient Group */}
                <ListSubheader sx={{ color: "grey" }}>
                  {t("company.document.groups.patient")}
                </ListSubheader>
                {documents
                  .filter((doc) => doc.group === "patient")
                  .map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {t(option.label)}
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText>
                {formik.touched.document_name && formik.errors.document_name}
              </FormHelperText>
            </FormControl>

            {/* <FormControl fullWidth margin="dense">
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
            </FormControl> */}

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

            {formik.values.document_name === "ehis_employment_contract" && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel
                    id="job_details"
                    size="small"
                    sx={{
                      fontSize: "1.1rem",
                    }}
                  >
                    {t("company.document.form.affiliated_company.label")}
                  </InputLabel>
                  <Select
                    fullWidth
                    autoComplete="affiliated_company"
                    // size="small"
                    name="affiliated_company"
                    // margin='dense'
                    id="affiliated_company"
                    label={t("company.document.form.affiliated_company.label")}
                    labelId="affiliated_company"
                    disabled={isGenerating}
                    value={formik.values.affiliated_company}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("affiliated_company", value);
                    }}
                    error={
                      formik.touched.affiliated_company &&
                      Boolean(formik.errors.affiliated_company)
                    }
                  >
                    {affiliatedCompanies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(option.label)}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.affiliated_company &&
                      formik.errors.affiliated_company}
                  </FormHelperText>
                </FormControl>

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

                {/* company stamp */}
                <FormControl margin="dense" fullWidth>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.company_stamp}
                        disabled={!docusignESignature}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "company_stamp",
                            e.target.checked
                          );
                        }}
                      />
                    }
                    label={t("company.document.form.attach_stamp.label")}
                  />
                </FormControl>
              </>
            )}

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
                  size="small"
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
                {/* {allowInput.esignature && (
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
                )} */}
              </>
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

                <Typography marginTop={1} variant="h6">
                  {"代理人または立会人等"}
                </Typography>

                {docusignESignature && (
                  <>
                    <TextField
                      fullWidth
                      margin="dense"
                      label={t("company.document.form.docusign.witness_name")}
                      type="text"
                      size="small"
                      value={formik.values.witness_name}
                      onChange={(e) => {
                        formik.setFieldValue("witness_name", e.target.value);
                      }}
                    />

                    <TextField
                      fullWidth
                      margin="dense"
                      label={t("company.document.form.docusign.witness_email")}
                      type="text"
                      size="small"
                      value={formik.values.witness_email}
                      onChange={(e) => {
                        formik.setFieldValue("witness_email", e.target.value);
                      }}
                    />
                  </>
                )}
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

            {/* ==================== SPUTUM TRAINING ====================  */}

            {formik.values.document_name === "docs_sputum_training" && (
              <>
                <Autocomplete
                  fullWidth
                  freeSolo
                  id="visiting_nursing_station"
                  options={vnsSelect || []}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }

                    return option.corporate_name;
                  }}
                  value={
                    formik.values.visiting_nursing_station
                      ? formik.values.visiting_nursing_station
                      : null
                  }
                  onChange={(_, newValue) => {
                    // if (!newValue) {
                    //   setNurseList([]);
                    //   return;
                    // }

                    if (newValue && typeof newValue !== "string") {
                      // Set the selected nursing station to formik
                      formik.setFieldValue(
                        "visiting_nursing_station",
                        newValue
                      );

                      // Update nurseList with the selected station's nurses
                      setNurseList(newValue.nurses || []);
                    } else {
                      // Clear the nurseList if no valid selection
                      formik.setFieldValue("visiting_nursing_station", "");
                      setNurseList([]);
                    }

                    // always update nurse_in_charge to null when visiting_nursing_station changes
                    formik.setFieldValue("nurse_in_charge", null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      InputLabelProps={{
                        sx: { fontSize: "1.1rem" },
                      }}
                      label={t(
                        "company.document.form.sputum_training.visiting_nursing_station"
                      )}
                    />
                  )}
                />

                <Autocomplete
                  fullWidth
                  id="nurse_in_charge"
                  options={nurseList}
                  getOptionLabel={(option) => option.name_kanji}
                  value={
                    formik.values.nurse_in_charge
                      ? formik.values.nurse_in_charge
                      : null
                  }
                  onChange={(_, newValue) => {
                    // Check that newValue is of type NurseInCharge or null
                    if (newValue && typeof newValue !== "string") {
                      formik.setFieldValue("nurse_in_charge", newValue);
                    } else {
                      formik.setFieldValue("nurse_in_charge", null);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      InputLabelProps={{
                        sx: { fontSize: "1.1rem" },
                      }}
                      label={t(
                        "company.document.form.sputum_training.nurse_in_charge"
                      )}
                    />
                  )}
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
                  label={t("company.document.form.date_created.label")}
                  value={dayjs.utc(formik.values.date_created)}
                  onChange={(date: Dayjs | null) => {
                    formik.setFieldValue("date_created", date);
                  }}
                />

                {/* ==================== OPTIONAL ====================  */}

                <Typography variant="h5" marginTop={1} fontWeight={"bold"}>
                  {"(様式1)"}
                </Typography>

                <FormControl
                  margin="dense"
                  size="small"
                  sx={{
                    marginTop: "10px",
                    maxWidth: "50dvw",
                    width: "100%",
                  }}
                >
                  <InputLabel
                    id="sputum_training_qualifications_held"
                    size="small"
                    sx={{
                      fontSize: "1.150rem",
                      fontWeight: "bolder",
                    }}
                  >
                    {"保有資格"} {"(該当の番号)"}
                  </InputLabel>
                  <Select
                    // label={"保有資格"}
                    labelId="sputum_training_qualifications_held"
                    id="sputum_training_qualifications_held"
                    name="qualifications_held"
                    multiple
                    value={formik.values.qualifications_held}
                    onChange={(e) => {
                      const {
                        target: { value },
                      } = e;

                      formik.setFieldValue(
                        "qualifications_held",
                        typeof value === "string" ? value.split(",") : value
                      );
                    }}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) =>
                      selected
                        .map(
                          (value) =>
                            qualificationsHeld.find((q) => q.value === value)
                              ?.label
                        )
                        .join(", ")
                    }
                  >
                    {qualificationsHeld.map((qualification) => (
                      <MenuItem
                        key={qualification.value}
                        value={qualification.value}
                      >
                        <Checkbox
                          checked={
                            formik.values.qualifications_held.indexOf(
                              qualification.value
                            ) > -1
                          }
                        />
                        <ListItemText primary={qualification.label} />
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.qualifications_held &&
                      formik.errors.qualifications_held}
                  </FormHelperText>
                </FormControl>

                <Typography margin={1} variant="h5" fontWeight={"bolder"}>
                  {"福祉関係 経験年数"}
                </Typography>

                <TextField
                  fullWidth
                  size="small"
                  margin="dense"
                  label={"a. 福祉関係勤続年数"}
                  type="text"
                  placeholder="例：4ヶ月"
                  value={formik.values.welfare_experience}
                  onChange={(e) => {
                    formik.setFieldValue("welfare_experience", e.target.value);
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  margin="dense"
                  label={"b. 現在の勤務先勤続年数"}
                  type="text"
                  placeholder="例：4ヶ月"
                  value={formik.values.current_employment_experience}
                  onChange={(e) => {
                    formik.setFieldValue(
                      "current_employment_experience",
                      e.target.value
                    );
                  }}
                />

                {/* 利用者の状態 */}
                <FormControl fullWidth margin="normal">
                  <InputLabel
                    id="patient_situation"
                    size="small"
                    sx={{
                      fontSize: "1.1rem",
                    }}
                  >
                    {/* {t("company.document.form.affiliated_company.label")} */}
                    {"利用者の状態"}
                  </InputLabel>
                  <Select
                    fullWidth
                    autoComplete="patient_situation"
                    // size="small"
                    name="patient_situation"
                    // margin='dense'
                    id="patient_situation"
                    // label={t("company.document.form.patient_situation.label")}
                    label={"利用者の状態"}
                    labelId="patient_situation"
                    disabled={isGenerating}
                    value={formik.values.patient_situation}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("patient_situation", value);
                    }}
                    error={
                      formik.touched.patient_situation &&
                      Boolean(formik.errors.patient_situation)
                    }
                  >
                    {patientSituations.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(option.label)}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.patient_situation &&
                      formik.errors.patient_situation}
                  </FormHelperText>
                </FormControl>

                <Divider sx={{ marginTop: "8px" }}></Divider>

                <Typography
                  variant="h5"
                  marginTop={1}
                  marginBottom={1}
                  fontWeight={"bold"}
                >
                  {"(様式２)	実地研修準備チェック表"}
                </Typography>

                <OnSiteExerciseTrainingChecklist
                  checkedItems={OSETCheckedItems}
                  handleCheckboxChange={handleOSETCheckListChange}
                />

                <BusinessSystemEstablishedChecklist
                  checkedItems={BSECheckedItems}
                  handleCheckboxChange={handleBSEChecklistChange}
                />

                <Divider sx={{ marginTop: "8px" }}></Divider>

                <Typography
                  variant="h5"
                  marginTop={1}
                  marginBottom={1}
                  fontWeight={"bold"}
                >
                  {
                    "(様式4)	喀痰吸引等研修（第３号研修）実地研修の実施に係る指示書"
                  }
                </Typography>

                <Typography
                  variant="h6"
                  marginTop={1}
                  marginBottom={1}
                  fontWeight={"bold"}
                >
                  {"現在の状況について"}
                </Typography>

                <TextField
                  fullWidth
                  size="small"
                  margin="dense"
                  sx={{
                    fontSize: "1.1rem",
                  }}
                  // label={t("company.document.form.main_illness.label")}
                  label={"主たる傷病名"}
                  type="text"
                  placeholder="例：ALS"
                  value={formik.values.main_illness}
                  onChange={(e) => {
                    formik.setFieldValue("main_illness", e.target.value);
                  }}
                />

                <FormControl
                  margin="dense"
                  sx={{
                    marginTop: "10px",
                    maxWidth: "50dvw",
                    width: "100%",
                  }}
                >
                  <InputLabel
                    id="sputum_training_current_conditions"
                    size="small"
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: "bolder",
                    }}
                  >
                    {"必要な医療的ケア"}
                  </InputLabel>
                  <Select
                    size="small"
                    labelId="sputum_training_current_conditions"
                    id="sputum_training_current_conditions"
                    name="current_conditions"
                    multiple
                    value={formik.values.current_conditions}
                    onChange={(e) => {
                      const {
                        target: { value },
                      } = e;

                      formik.setFieldValue(
                        "current_conditions",
                        typeof value === "string" ? value.split(",") : value
                      );
                    }}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) =>
                      selected
                        .map(
                          (value) =>
                            otherConditionsList.find((q) => q.value === value)
                              ?.label
                        )
                        .join(", ")
                    }
                  >
                    {otherConditionsList.map((condition) => (
                      <MenuItem key={condition.value} value={condition.value}>
                        <Checkbox
                          checked={
                            formik.values.current_conditions.indexOf(
                              condition.value
                            ) > -1
                          }
                        />
                        <ListItemText primary={condition.label} />
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.current_conditions &&
                      formik.errors.current_conditions}
                  </FormHelperText>
                </FormControl>

                <Divider sx={{ marginTop: "8px" }}></Divider>

                <Typography
                  variant="h5"
                  marginTop={1}
                  marginBottom={1}
                  fontWeight={"bold"}
                >
                  {
                    "(様式5) 第三号（特定の者対象）指導講師調蓍及び 指導講師承諾書"
                  }
                </Typography>

                <Typography
                  variant="h6"
                  marginTop={1}
                  marginBottom={1}
                  fontWeight={"bold"}
                >
                  {"保有資格"}
                </Typography>

                <FormControl
                  margin="dense"
                  size="small"
                  sx={{
                    marginTop: "10px",
                    maxWidth: "50dvw",
                    width: "100%",
                  }}
                >
                  <InputLabel
                    id="sputum_training_station_qualifications_held"
                    size="small"
                    sx={{
                      fontSize: "1.150rem",
                      fontWeight: "bolder",
                    }}
                  >
                    {"保有資格"}
                  </InputLabel>
                  <Select
                    // label={"保有資格"}
                    labelId="sputum_training_station_qualifications_held"
                    id="sputum_training_station_qualifications_held"
                    name="station_qualifications_held"
                    multiple
                    value={formik.values.station_qualifications_held}
                    onChange={(e) => {
                      const {
                        target: { value },
                      } = e;

                      formik.setFieldValue(
                        "station_qualifications_held",
                        typeof value === "string" ? value.split(",") : value
                      );
                    }}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) =>
                      selected
                        .map(
                          (value) =>
                            qualificationsHeld2.find((q) => q.value === value)
                              ?.label
                        )
                        .join(", ")
                    }
                  >
                    {qualificationsHeld2.map((qualification) => (
                      <MenuItem
                        key={qualification.value}
                        value={qualification.value}
                      >
                        <Checkbox
                          checked={
                            formik.values.station_qualifications_held.indexOf(
                              qualification.value
                            ) > -1
                          }
                        />
                        <ListItemText primary={qualification.label} />
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.station_qualifications_held &&
                      formik.errors.station_qualifications_held}
                  </FormHelperText>
                </FormControl>

                <FormControl
                  margin="dense"
                  sx={{
                    marginTop: "10px",
                    maxWidth: "50dvw",
                    width: "100%",
                  }}
                >
                  <InputLabel
                    id="sputum_training_current_conditions"
                    size="small"
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: "bolder",
                    }}
                  >
                    {"実地研修指導内容"}
                  </InputLabel>
                  <Select
                    size="small"
                    labelId="sputum_training_ojt_instruction_content"
                    id="sputum_training_ojt_instruction_content"
                    name="ojt_instruction_content"
                    multiple
                    value={formik.values.ojt_instruction_content}
                    onChange={(e) => {
                      const {
                        target: { value },
                      } = e;

                      formik.setFieldValue(
                        "ojt_instruction_content",
                        typeof value === "string" ? value.split(",") : value
                      );
                    }}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) =>
                      selected
                        .map(
                          (value) =>
                            otherConditionsList.find((q) => q.value === value)
                              ?.label
                        )
                        .join(", ")
                    }
                  >
                    {otherConditionsList.map((condition) => (
                      <MenuItem key={condition.value} value={condition.value}>
                        <Checkbox
                          checked={
                            formik.values.ojt_instruction_content.indexOf(
                              condition.value
                            ) > -1
                          }
                        />
                        <ListItemText primary={condition.label} />
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.ojt_instruction_content &&
                      formik.errors.ojt_instruction_content}
                  </FormHelperText>
                </FormControl>
              </>
            )}

            {/* ==================== SPUTUM TRAINING ====================  */}

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
