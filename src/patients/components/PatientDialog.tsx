import {
  Box,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  Select,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { Instructions, Patient } from "../types/patient";

import { DatePicker } from "@mui/lab";
import {
  disable_support_categories,
  genders,
  patient_statuses,
} from "../helpers/helper";
import { PostalCode } from "../../staff/types/address";
import {
  filterMunicipalitiesByPrefecture,
  getAddressByPostalCode,
} from "../../helpers/helper";
import { usePrefectures } from "../../staff/hooks/useAddressPrefectures";
import { useMunicipalities } from "../../staff/hooks/useAddressMunicipalities";
import { usePostalCodes } from "../../staff/hooks/useAddressPostalCode";
import { calculateAge } from "../helpers/functions";
import PatientMapDirection from "../../maps/components/PatientMapDirection";

//google map
import { LoadScript, Libraries } from "@react-google-maps/api";
import ImageSlider from "../../core/components/ImageSlider";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useAddPatientImages } from "../hooks/useAddPatientImages";
import { googleMapApiKey } from "../../api/server";

// patient instruction
import ParentInstructions from "./ParentInstructions";
import { useAddPatientInstructions } from "../hooks/useAddPatientInstructions";
import { useState } from "react";

const googleMapLibraries: Libraries = ["places"];

// const roles = ["Admin", "Member"];

type PatientDialogProps = {
  onAdd: (patient: Partial<Patient>) => void;
  onClose: () => void;
  onUpdate: (patient: Patient, patient_id: string) => void;
  open: boolean;
  processing: boolean;
  patient?: Patient;
  patientsRefetch: () => void;
};

const PatientDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  patient,
  patientsRefetch,
}: PatientDialogProps) => {
  const { t, i18n } = useTranslation();
  const snackbar = useSnackbar();
  const currentLanguage = i18n.language;

  const editMode = Boolean(patient && patient.id);

  // console.log(patient)

  const [selectedPrefecture, setSelectedPrefecture] = useState<
    string | undefined
  >(patient?.prefecture);

  const { data: prefectures } = usePrefectures();
  const { data: municipalities } = useMunicipalities();
  const { data: postalCodes } = usePostalCodes();

  const handleSubmit = (values: Partial<Patient>) => {
    if (patient && patient.id) {
      onUpdate({ ...values, id: patient.id } as Patient, patient.id);
    } else {
      onAdd(values);
    }
  };

  const formik = useFormik({
    initialValues: {
      name_kanji: patient ? patient.name_kanji : "",
      name_kana: patient ? patient.name_kana : "",
      birth_date: patient ? patient.birth_date : null,
      age: patient ? patient.age : "",
      gender: patient ? patient.gender : "",
      disable_support_category: patient ? patient.disable_support_category : "",
      beneficiary_number: patient ? patient.beneficiary_number : "",
      postal_code: patient ? patient.postal_code : "",
      prefecture: patient ? patient.prefecture : "",
      municipality: patient ? patient.municipality : "",
      town: patient ? patient.town : "",
      building: patient ? patient.building : "",
      telephone_number: patient ? patient.telephone_number : "",
      phone_number: patient ? patient.phone_number : "",
      billing_method: patient ? patient.billing_method : "",
      billing_address: patient ? patient.billing_address : "",
      billing_postal_code: patient ? patient.billing_postal_code : "",
      patient_status: patient ? patient.patient_status : "",
      remarks: patient ? patient.remarks : "",
    },
    validationSchema: Yup.object({
      name_kanji: Yup.string()
        .max(20, t("common.validations.max", { size: 20 }))
        .required(t("common.validations.required")),
      name_kana: Yup.string()
        .max(30, t("common.validations.max", { size: 30 }))
        .required(t("common.validations.required")),
      // disable_support_category: Yup.string().required(
      //   t("common.validations.required")
      // ),
      // only accepts numbers
      beneficiary_number: Yup.string()
        .max(10, t("common.validations.max", { size: 10 }))
        .matches(/^[0-9]+$/, t("common.validations.onlyNumbers")),
      // .required(t("common.validations.required")),
    }),
    onSubmit: handleSubmit,
  });

  // concatenate prefecture municipality town and building in one address
  const patientAddress =
    `${patient?.prefecture}${patient?.municipality}${patient?.town}${patient?.building}`.replace(
      "　",
      ""
    );

  //convert patient images to array string
  // const patientImages = patient?.images ? patient.images : [];
  // console.log(patientImages)

  const [patientImages, setpatientsImages] = useState<string[] | []>(
    patient?.images ? patient.images : []
  );
  // eslint-disable-next-line
  const { isAddingImages, addPatientImages } = useAddPatientImages();

  const addPatientHomePhotos = (images?: File[] | null) => {
    // console.log(images);
    addPatientImages({
      patientId: patient?.id as string,
      images,
    }).then((data) => {
      if (data) {
        // eslint-disable-next-line
        const { images, patientId } = data;
        snackbar.success(
          t("patientManagement.patientPhotos.notifications.addSuccess", {
            patient: `${patient?.name_kanji}`,
          })
        );
        // reset patients record
        patientsRefetch();

        setpatientsImages(images);
      }
    });
  };

  const { isAddingPatient, addPatientInstructions } =
    useAddPatientInstructions();

  const [patientInstructions, setPatientInstructions] = useState<
    Instructions[] | []
  >(patient?.instructions ? patient.instructions : []);

  const addPatientInstructionsHandler = () => {
    // check if there are empty fields in patientInstructions
    // if there is show an error snackbar
    // else add new instruction
    let hasEmptyFields = false;

    // submit validations
    patientInstructions.forEach((instruction) => {
      if (!instruction.details || !instruction.file) {
        hasEmptyFields = true;
      }
    });

    if (hasEmptyFields) {
      snackbar.error(
        t("patientManagement.instructions.notifications.emptyFields")
      );
      return;
    }

    // console.log(patientInstructions);

    addPatientInstructions({
      patientId: patient?.id as string,
      instructions: patientInstructions,
    })
      .then((data) => {
        // eslint-disable-next-line
        const { instructions, patientId } = data;
        snackbar.success(
          t("patientManagement.patientPhotos.notifications.addSuccess", {
            patient: `${patient?.name_kanji}`,
          })
        );
        // reset patients record
        patientsRefetch();

        setPatientInstructions(instructions);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  // patient address handlers
  // postal code blur
  const handlePostalCodeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const postalCode = e.target.value;

    // console.log(postalCode)

    const completeAddress: PostalCode[] | undefined = getAddressByPostalCode(
      postalCodes,
      postalCode
    );
    // console.log(completeAddress);
    // if(selectedPrefecture)
    // console.log(completeAddress);
    // set prefecture, municipality, town value
    if (completeAddress && completeAddress.length > 0) {
      // check if completeAddress[0].jp_prefecture if not dont set

      setSelectedPrefecture(completeAddress[0].jp_prefecture);
      formik.setFieldValue("prefecture", completeAddress[0].jp_prefecture);
      formik.setFieldValue("municipality", completeAddress[0].jp_municipality);
      if (currentLanguage === "ja")
        formik.setFieldValue("town", completeAddress[0].jp_town);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
      maxWidth={"xl"}
      aria-labelledby="patient-dialog-title"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="staff-dialog-title">
          {editMode
            ? t("patientManagement.modal.edit.title")
            : t("patientManagement.modal.add.title")}
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
                {t("patientManagement.form.name_birthdate_gender.label")}
              </Typography>

              <TextField
                size="small"
                margin="dense"
                fullWidth
                id="name_kanji"
                label={t("patientManagement.form.name_kanji.label")}
                name="name_kanji"
                autoComplete="name_kanji"
                // autofocus
                disabled={processing}
                value={formik.values.name_kanji}
                onChange={formik.handleChange}
                error={
                  formik.touched.name_kanji && Boolean(formik.errors.name_kanji)
                }
                helperText={
                  formik.touched.name_kanji && formik.errors.name_kanji
                }
              />

              <TextField
                size="small"
                margin="dense"
                fullWidth
                id="name_kana"
                label={t("patientManagement.form.name_kana.label")}
                name="name_kana"
                autoComplete="name_kana"
                // autofocus
                disabled={processing}
                value={formik.values.name_kana}
                onChange={formik.handleChange}
                error={
                  formik.touched.name_kana && Boolean(formik.errors.name_kana)
                }
                helperText={formik.touched.name_kana && formik.errors.name_kana}
              />

              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <FormControl
                    // sx={{ m: 1, minWidth: 120 }}
                    fullWidth
                    size="small"
                    // component="fieldset"
                    margin="dense"
                  >
                    <InputLabel id="gender">
                      {t("patientManagement.form.gender.label")}
                    </InputLabel>
                    <Select
                      fullWidth
                      autoComplete="gender"
                      // // autofocus
                      size="small"
                      name="gender"
                      // margin='dense'
                      id="gender"
                      label={t("patientManagement.form.gender.label")}
                      labelId="gender"
                      disabled={processing}
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.gender && Boolean(formik.errors.gender)
                      }
                    >
                      {genders.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {t(option.label)}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {formik.touched.gender && formik.errors.gender}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <DatePicker
                    label={t("patientManagement.form.birth_date.label")}
                    inputFormat="yyyy/MM/dd"
                    value={formik.values.birth_date}
                    onChange={(date: Date | null) => {
                      formik.setFieldValue("birth_date", date);
                      formik.setFieldValue("age", calculateAge(date));
                    }}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...params}
                        id="birth_date"
                        disabled={processing}
                        fullWidth
                        margin="dense"
                        name="birth_date"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    margin="dense"
                    size="small"
                    fullWidth
                    id="age"
                    label={t("patientManagement.form.age.label")}
                    name="age"
                    autoComplete="age"
                    // type="number"
                    // // autofocus
                    disabled={processing}
                    value={formik.values.age}
                    onChange={formik.handleChange}
                    error={formik.touched.age && Boolean(formik.errors.age)}
                    helperText={formik.touched.age && formik.errors.age}
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
                {t("patientManagement.form.patient_contact.label")}
              </Typography>

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="telephone_number"
                    label={t("patientManagement.form.telephone_number.label")}
                    name="telephone_number"
                    autoComplete="telephone_number"
                    // autofocus
                    disabled={processing}
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
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="phone_number"
                    label={t("patientManagement.form.phone_number.label")}
                    name="phone_number"
                    autoComplete="phone_number"
                    // autofocus
                    disabled={processing}
                    value={formik.values.phone_number}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.phone_number &&
                      Boolean(formik.errors.phone_number)
                    }
                    helperText={
                      formik.touched.phone_number && formik.errors.phone_number
                    }
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="billing_method"
                    label={t("patientManagement.form.billing_method.label")}
                    name="billing_method"
                    autoComplete="billing_method"
                    // autofocus
                    disabled={processing}
                    value={formik.values.billing_method}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.billing_method &&
                      Boolean(formik.errors.billing_method)
                    }
                    helperText={
                      formik.touched.billing_method &&
                      formik.errors.billing_method
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="billing_postal_code"
                    label={t(
                      "patientManagement.form.billing_postal_code.label"
                    )}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">〒</InputAdornment>
                      ),
                    }}
                    name="billing_postal_code"
                    autoComplete="billing_postal_code"
                    // autofocus
                    disabled={processing}
                    value={formik.values.billing_postal_code}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.billing_postal_code &&
                      Boolean(formik.errors.billing_postal_code)
                    }
                    helperText={
                      formik.touched.billing_postal_code &&
                      formik.errors.billing_postal_code
                    }
                  />
                </Grid>
              </Grid>

              <TextField
                size="small"
                margin="dense"
                fullWidth
                id="billing_address"
                label={t("patientManagement.form.billing_address.label")}
                name="billing_address"
                autoComplete="billing_address"
                // autofocus
                disabled={processing}
                multiline
                minRows={2}
                maxRows={2}
                value={formik.values.billing_address}
                onChange={formik.handleChange}
                error={
                  formik.touched.billing_address &&
                  Boolean(formik.errors.billing_address)
                }
                helperText={
                  formik.touched.billing_address &&
                  formik.errors.billing_address
                }
              />
            </Grid>

            {/* Second Column */}
            <Grid item xs={6}>
              <Typography
                // marginTop={1}
                // marginBottom={2}
                variant="h6"
                textAlign="center"
                gutterBottom
              >
                {t("patientManagement.form.patient_address.label")}
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
                    <InputLabel id="disable_support_category">
                      {t(
                        "patientManagement.form.disable_support_category.label"
                      )}
                    </InputLabel>
                    <Select
                      fullWidth
                      autoComplete="disable_support_category"
                      // // autofocus
                      size="small"
                      name="disable_support_category"
                      // margin='dense'
                      id="disable_support_category"
                      label={t(
                        "patientManagement.form.disable_support_category.label"
                      )}
                      labelId="disable_support_category"
                      disabled={processing}
                      value={formik.values.disable_support_category}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.disable_support_category &&
                        Boolean(formik.errors.disable_support_category)
                      }
                    >
                      {disable_support_categories.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {t(option.label)}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {formik.touched.disable_support_category &&
                        formik.errors.disable_support_category}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="beneficiary_number"
                    label={t("patientManagement.form.beneficiary_number.label")}
                    name="beneficiary_number"
                    autoComplete="beneficiary_number"
                    // autofocus
                    disabled={processing}
                    // type="number"
                    value={formik.values.beneficiary_number}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.beneficiary_number &&
                      Boolean(formik.errors.beneficiary_number)
                    }
                    helperText={
                      formik.touched.beneficiary_number &&
                      formik.errors.beneficiary_number
                    }
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="postal_code"
                    label={t("patientManagement.form.postal_code.label")}
                    name="postal_code"
                    autoComplete="postal_code"
                    // autofocus
                    disabled={processing}
                    value={formik.values.postal_code}
                    onChange={formik.handleChange}
                    onBlur={handlePostalCodeBlur}
                    error={
                      formik.touched.postal_code &&
                      Boolean(formik.errors.postal_code)
                    }
                    helperText={
                      formik.touched.postal_code && formik.errors.postal_code
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl
                    // sx={{ m: 1, minWidth: 120 }}
                    fullWidth
                    size="small"
                    // component="fieldset"
                    margin="dense"
                  >
                    <InputLabel id="prefecture">
                      {t("patientManagement.form.prefecture.label")}
                    </InputLabel>
                    <Select
                      fullWidth
                      autoComplete="prefecture"
                      // // autofocus
                      size="small"
                      name="prefecture"
                      // margin='dense'
                      id="prefecture"
                      label={t("patientManagement.form.prefecture.label")}
                      labelId="prefecture"
                      disabled={processing}
                      value={formik.values.prefecture}
                      onChange={(e) => {
                        // Access Formik's values within handleChange
                        formik.handleChange(e);

                        // Now you can access the updated values object
                        setSelectedPrefecture(e.target.value);
                      }}
                      error={
                        formik.touched.prefecture &&
                        Boolean(formik.errors.prefecture)
                      }
                    >
                      {prefectures?.map((option) => (
                        <MenuItem
                          key={option.jp_prefecture}
                          value={option.jp_prefecture}
                        >
                          {currentLanguage === "ja"
                            ? option.jp_prefecture
                            : option.en_prefecture}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {formik.touched.prefecture && formik.errors.prefecture}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={5}>
                  <FormControl
                    // sx={{ m: 1, minWidth: 120 }}
                    fullWidth
                    size="small"
                    // component="fieldset"
                    margin="dense"
                  >
                    <InputLabel id="municipality">
                      {t("patientManagement.form.municipality.label")}
                    </InputLabel>
                    <Select
                      fullWidth
                      autoComplete="municipality"
                      // // autofocus
                      size="small"
                      name="municipality"
                      // margin='dense'
                      id="municipality"
                      label={t("patientManagement.form.municipality.label")}
                      labelId="municipality"
                      disabled={processing}
                      value={formik.values.municipality}
                      onChange={(e) => {
                        // Access Formik's values within handleChange
                        formik.handleChange(e);

                        // Now you can access the updated values object
                        // console.log(e.target.value);
                      }}
                      error={
                        formik.touched.municipality &&
                        Boolean(formik.errors.municipality)
                      }
                    >
                      {filterMunicipalitiesByPrefecture(
                        municipalities,
                        selectedPrefecture
                      )?.map((option) => (
                        <MenuItem
                          key={option.jp_municipality}
                          value={option.jp_municipality}
                        >
                          {currentLanguage === "ja"
                            ? option.jp_municipality
                            : option.en_municipality}
                        </MenuItem>
                      ))}
                    </Select>

                    <FormHelperText>
                      {formik.touched.municipality &&
                        formik.errors.municipality}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="town"
                    label={t("patientManagement.form.town.label")}
                    name="town"
                    autoComplete="town"
                    // autofocus
                    disabled={processing}
                    value={formik.values.town}
                    onChange={formik.handleChange}
                    error={formik.touched.town && Boolean(formik.errors.town)}
                    helperText={formik.touched.town && formik.errors.town}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="building"
                    label={t("patientManagement.form.building.label")}
                    name="building"
                    autoComplete="building"
                    // autofocus
                    disabled={processing}
                    value={formik.values.building}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.building && Boolean(formik.errors.building)
                    }
                    helperText={
                      formik.touched.building && formik.errors.building
                    }
                  />
                </Grid>
              </Grid>

              <Typography
                marginTop={1}
                // marginBottom={2}
                variant="h6"
                textAlign="center"
                gutterBottom
              >
                {t("patientManagement.form.patient_status_remarks.label")}
              </Typography>

              {/* <TextField
                size="small"
                margin="dense"
                fullWidth
                id="patient_status"
                label={t("patientManagement.form.patient_status.label")}
                name="patient_status"
                autoComplete="patient_status"
                // autofocus
                disabled={processing}
                value={formik.values.patient_status}
                onChange={formik.handleChange}
                error={
                  formik.touched.patient_status &&
                  Boolean(formik.errors.patient_status)
                }
                helperText={
                  formik.touched.patient_status && formik.errors.patient_status
                }
              /> */}

              <FormControl
                // sx={{ m: 1, minWidth: 120 }}
                fullWidth
                size="small"
                // component="fieldset"
                margin="dense"
              >
                <InputLabel id="patient_status">
                  {t("patientManagement.form.patient_status.label")}
                </InputLabel>
                <Select
                  fullWidth
                  autoComplete="patient_status"
                  // // autofocus
                  size="small"
                  name="patient_status"
                  // margin='dense'
                  id="patient_status"
                  label={t("patientManagement.form.patient_status.label")}
                  labelId="patient_status"
                  disabled={processing}
                  value={formik.values.patient_status}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.patient_status &&
                    Boolean(formik.errors.patient_status)
                  }
                >
                  {patient_statuses.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {t(option.label)}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {formik.touched.patient_status &&
                    formik.errors.patient_status}
                </FormHelperText>
              </FormControl>

              <TextField
                margin="normal"
                fullWidth
                id="remarks"
                label={t("patientManagement.form.remarks.label")}
                name="remarks"
                disabled={processing}
                value={formik.values.remarks}
                onChange={formik.handleChange}
                multiline
                minRows={4}
                maxRows={4}
                error={formik.touched.remarks && Boolean(formik.errors.remarks)}
                helperText={formik.touched.remarks && formik.errors.remarks}
              />
            </Grid>
          </Grid>

          <DialogActions>
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={onClose}>{t("common.cancel")}</Button>
            <LoadingButton
              // disabled={!formik.dirty && !formik.isSubmitting}
              loading={processing}
              type="submit"
              variant="contained"
            >
              {editMode
                ? t("patientManagement.modal.edit.action")
                : t("patientManagement.modal.add.action")}
            </LoadingButton>
          </DialogActions>

          {editMode && (
            <>
              <Grid marginBottom={1} container spacing={2}>
                {/* First Column */}
                {/* <Grid item xs={6}></Grid> */}
                <Grid item xs={12}>
                  <Typography
                    marginTop={1}
                    marginBottom={2}
                    variant="h5"
                    textAlign="left"
                    gutterBottom
                  >
                    {t("common.map.direction.label")}
                  </Typography>
                  <LoadScript
                    libraries={googleMapLibraries}
                    googleMapsApiKey={googleMapApiKey as string}
                  >
                    <PatientMapDirection
                      styles={{
                        container: {
                          height: "60vh",
                          width: "100%",
                        },
                      }}
                      originAddress={patientAddress}
                    />
                  </LoadScript>
                </Grid>
              </Grid>

              <Grid marginTop={3} marginBottom={3} container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    marginTop={1}
                    marginBottom={2}
                    variant="h5"
                    textAlign="left"
                    gutterBottom
                  >
                    {t("patientManagement.directionDetails.label")}
                  </Typography>
                </Grid>
                {/* helper pdfs */}
                <Grid item xs={6}>
                  <ParentInstructions
                    processing={isAddingPatient}
                    addPatientInstructions={addPatientInstructionsHandler}
                    setInstructions={setPatientInstructions}
                    data={patientInstructions}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ImageSlider
                    images={patientImages}
                    onAddImage={addPatientHomePhotos}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default PatientDialog;
