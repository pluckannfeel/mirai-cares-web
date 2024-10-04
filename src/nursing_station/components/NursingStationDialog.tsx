import React from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { NursingStation, NurseInCharge } from "../types/NursingStation";

import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

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
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import { DatePicker } from "@mui/x-date-pickers";
import { calculateAge } from "../../patients/helpers/functions";
import { getNestedError } from "../../core/helpers/functions";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";

type NursingStationDialogProps = {
  onAdd: (nursingStation: Partial<NursingStation>) => void;
  onClose: () => void;
  onUpdate: (nursingStation: Partial<NursingStation>) => void;
  open: boolean;
  processing: boolean;
  nursingStation?: NursingStation;
};

const NursingStationDialog: React.FC<NursingStationDialogProps> = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  nursingStation,
}) => {
  const { t } = useTranslation();

  const editMode = Boolean(nursingStation && nursingStation.id);
  const snackbar = useSnackbar();

  const handleSubmit = (values: Partial<NursingStation>) => {
    // console.log(values);
    if (nursingStation && nursingStation.id) {
      onUpdate({ ...values, id: nursingStation.id });
    } else {
      onAdd(values);
    }
  };

  const formik = useFormik({
    initialValues: {
      corporate_name: nursingStation?.corporate_name || "",
      corporate_address: nursingStation?.corporate_address || "",
      corporate_postal_code: nursingStation?.corporate_postal_code || "",
      phone: nursingStation?.phone || "",
      fax: nursingStation?.fax || "",
      email_address: nursingStation?.email_address || "",
      rep_name_kanji: nursingStation?.rep_name_kanji || "",
      rep_name_kana: nursingStation?.rep_name_kana || "",
      administrator_name_kanji: nursingStation?.administrator_name_kanji || "",
      administrator_name_kana: nursingStation?.administrator_name_kana || "",

      station_name: nursingStation?.station_name || "",
      station_address: nursingStation?.station_address || "",
      station_establishment_date: nursingStation?.station_establishment_date
        ? nursingStation?.station_establishment_date
        : null,

      nurses: nursingStation?.nurses || [],
    },
    validationSchema: Yup.object({
      //   corporate_name: Yup.string().required(t("common.errors.required")),
      //   corporate_address: Yup.string().required(t("common.errors.required")),
      //   phone: Yup.string().required(t("common.errors.required")),
      //   fax: Yup.string().required(t("common.errors.required")),
      //   email_address: Yup.string().required(t("common.errors.required")),
      //   rep_name_kanji: Yup.string().required(t("common.errors.required")),
      //   rep_name_kana: Yup.string().required(t("common.errors.required")),
      //   administrator_name_kanji: Yup.string().required(t("common.errors.required")),
      //   administrator_name_kana: Yup.string().required(t("common.errors.required")),
      //   station_name: Yup.string().required(t("common.errors.required")),
      //   station_address: Yup.string().required(t("common.errors.required")),
      //   station_establishment_date: Yup.date().required(t("common.errors.required")),
      nurses: Yup.array().of(
        Yup.object().shape({
          name_kanji: Yup.string().required(t("common.errors.required")),
          name_kana: Yup.string().required(t("common.errors.required")),
          birth_date: Yup.date().required(t("common.errors.required")),
          age: Yup.string().required(t("common.errors.required")),
        })
      ),
    }),
    onSubmit: handleSubmit,
  });

  // nurse in charge list event handler functions
  const handleAddNurseInCharge = () => {
    // limite only 3 items
    if (formik.values.nurses?.length === 4) {
      snackbar.error(t("visitingNursingStation.form.nurses.errors.limit"));
      return;
    }

    formik.setFieldValue("nurses", [
      ...(formik.values.nurses ?? []),
      {
        name_kanji: "",
        name_kana: "",
        birth_date: null,
        age: "",
      },
    ]);
  };

  const handleRemoveNurseInCharge = (index: number) => {
    const newNurse = [...(formik.values.nurses ?? [])];
    newNurse.splice(index, 1);
    formik.setFieldValue("nurses", newNurse);
  };

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
        <DialogTitle fontSize={22} id="user-dialog-title">
          {editMode
            ? t("visitingNursingStation.modal.edit.title")
            : t("visitingNursingStation.modal.add.title")}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            {/* First Column */}
            <Grid item xs={6}>
              <Typography
                // marginTop={1}
                marginBottom={1}
                variant="h5"
                textAlign="center"
                gutterBottom
              >
                {t("visitingNursingStation.form.headers.corporate_details")}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    // size="small"
                    // margin="none"
                    fullWidth
                    margin="normal"
                    id="corporate_name"
                    label={t(
                      "visitingNursingStation.form.corporate_name.label"
                    )}
                    name="corporate_name"
                    autoComplete="corporate_name"
                    // autofocus
                    disabled={processing}
                    value={formik.values.corporate_name}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.corporate_name &&
                      Boolean(formik.errors.corporate_name)
                    }
                    helperText={
                      formik.touched.corporate_name &&
                      formik.errors.corporate_name
                    }
                  />

                  <TextField
                    // size="small"
                    // margin="none"
                    // fullWidth
                    margin="normal"
                    id="corporate_postal_code"
                    label={t(
                      "visitingNursingStation.form.corporate_postal_code.label"
                    )}
                    name="corporate_postal_code"
                    autoComplete="corporate_postal_code"
                    placeholder="000-0000"
                    // autofocus
                    disabled={processing}
                    value={formik.values.corporate_postal_code}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.corporate_postal_code &&
                      Boolean(formik.errors.corporate_postal_code)
                    }
                    helperText={
                      formik.touched.corporate_postal_code &&
                      formik.errors.corporate_postal_code
                    }
                    />

                  <TextField
                    // size="small"
                    // margin="none"
                    margin="dense"
                    fullWidth
                    id="corporate_address"
                    label={t(
                      "visitingNursingStation.form.corporate_address.label"
                    )}
                    name="corporate_address"
                    autoComplete="corporate_address"
                    // autofocus
                    disabled={processing}
                    value={formik.values.corporate_address}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.corporate_address &&
                      Boolean(formik.errors.corporate_address)
                    }
                    helperText={
                      formik.touched.corporate_address &&
                      formik.errors.corporate_address
                    }
                    multiline
                    minRows={3}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    // marginTop={1}
                    marginBottom={1}
                    variant="h5"
                    textAlign="center"
                    gutterBottom
                  >
                    {t("visitingNursingStation.form.headers.corporate_contact")}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    fullWidth
                    id="phone"
                    label={t("visitingNursingStation.form.phone.label")}
                    name="phone"
                    autoComplete="phone"
                    // autofocus
                    disabled={processing}
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    fullWidth
                    id="fax"
                    label={t("visitingNursingStation.form.fax.label")}
                    name="fax"
                    autoComplete="fax"
                    // autofocus
                    disabled={processing}
                    value={formik.values.fax}
                    onChange={formik.handleChange}
                    error={formik.touched.fax && Boolean(formik.errors.fax)}
                    helperText={formik.touched.fax && formik.errors.fax}
                  />
                </Grid>

                <Grid item xs={8}>
                  <TextField
                    margin="dense"
                    fullWidth
                    id="email_address"
                    label={t("visitingNursingStation.form.email.label")}
                    name="email_address"
                    autoComplete="email_address"
                    // autofocus
                    disabled={processing}
                    value={formik.values.email_address}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.email_address &&
                      Boolean(formik.errors.email_address)
                    }
                    helperText={
                      formik.touched.email_address &&
                      formik.errors.email_address
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} marginTop={6}>
              <Grid item xs={12}>
                <TextField
                  //   margin="none"
                  fullWidth
                  id="rep_name_kanji"
                  label={t("visitingNursingStation.form.rep_name_kanji.label")}
                  name="rep_name_kanji"
                  autoComplete="rep_name_kanji"
                  // autofocus
                  disabled={processing}
                  value={formik.values.rep_name_kanji}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.rep_name_kanji &&
                    Boolean(formik.errors.rep_name_kanji)
                  }
                  helperText={
                    formik.touched.rep_name_kanji &&
                    formik.errors.rep_name_kanji
                  }
                />
              </Grid>

              <Grid item xs={12} marginTop={1}>
                <TextField
                  //   margin="none"
                  margin="dense"
                  fullWidth
                  id="rep_name_kana"
                  label={t("visitingNursingStation.form.rep_name_kana.label")}
                  name="rep_name_kana"
                  autoComplete="rep_name_kana"
                  // autofocus
                  disabled={processing}
                  value={formik.values.rep_name_kana}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.rep_name_kana &&
                    Boolean(formik.errors.rep_name_kana)
                  }
                  helperText={
                    formik.touched.rep_name_kana && formik.errors.rep_name_kana
                  }
                />
              </Grid>

              <Grid item xs={12} marginTop={1}>
                <TextField
                  // margin="dense"
                  //   margin="none"
                  fullWidth
                  id="administrator_name_kanji"
                  label={t(
                    "visitingNursingStation.form.administrator_name_kanji.label"
                  )}
                  name="administrator_name_kanji"
                  autoComplete="administrator_name_kanji"
                  // autofocus
                  disabled={processing}
                  value={formik.values.administrator_name_kanji}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.administrator_name_kanji &&
                    Boolean(formik.errors.administrator_name_kanji)
                  }
                  helperText={
                    formik.touched.administrator_name_kanji &&
                    formik.errors.administrator_name_kanji
                  }
                />
              </Grid>

              <Grid item xs={12} marginTop={1}>
                <TextField
                  //   margin="none"
                  margin="dense"
                  fullWidth
                  id="administrator_name_kana"
                  label={t(
                    "visitingNursingStation.form.administrator_name_kana.label"
                  )}
                  name="administrator_name_kana"
                  autoComplete="administrator_name_kana"
                  // autofocus
                  disabled={processing}
                  value={formik.values.administrator_name_kana}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.administrator_name_kana &&
                    Boolean(formik.errors.administrator_name_kana)
                  }
                  helperText={
                    formik.touched.administrator_name_kana &&
                    formik.errors.administrator_name_kana
                  }
                />
              </Grid>

              <Typography
                // marginTop={1}
                marginBottom={1}
                variant="h5"
                textAlign="center"
                marginTop={1}
                gutterBottom
              >
                {t("visitingNursingStation.form.headers.station_details")}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    // size="small"
                    // margin="none"
                    fullWidth
                    // margin="normal"
                    id="station_name"
                    label={t("visitingNursingStation.form.station_name.label")}
                    name="station_name"
                    autoComplete="station_name"
                    // autofocus
                    disabled={processing}
                    value={formik.values.station_name}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.station_name &&
                      Boolean(formik.errors.station_name)
                    }
                    helperText={
                      formik.touched.station_name && formik.errors.station_name
                    }
                  />
                </Grid>

                <Grid item xs={4}>
                  <DatePicker
                    label={t(
                      "visitingNursingStation.form.station_establishment_date.label"
                    )}
                    slotProps={{
                      textField: {
                        margin: "none",
                        //   size: "small",
                      },
                    }}
                    format="YYYY/MM/DD"
                    value={dayjs.utc(formik.values.station_establishment_date)}
                    onChange={(date: Dayjs | null) => {
                      formik.setFieldValue("station_establishment_date", date);
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  // size="small"
                  // margin="none"
                  margin="normal"
                  fullWidth
                  id="station_address"
                  label={t("visitingNursingStation.form.station_address.label")}
                  name="station_address"
                  autoComplete="station_address"
                  // autofocus
                  disabled={processing}
                  value={formik.values.station_address}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.station_address &&
                    Boolean(formik.errors.station_address)
                  }
                  helperText={
                    formik.touched.station_address &&
                    formik.errors.station_address
                  }
                  multiline
                  minRows={3}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography
                // marginTop={1}
                marginBottom={1}
                variant="h5"
                textAlign="center"
                gutterBottom
              >
                {t("visitingNursingStation.form.headers.nic_list")}
              </Typography>

              {formik.values.nurses &&
                formik.values.nurses.map(
                  (nurse: NurseInCharge, index: number) => (
                    <Grid container spacing={0.5} key={index}>
                      <Grid item xs={3}>
                        <TextField
                          // size="small"
                          // margin="none"
                          fullWidth
                          margin="dense"
                          id={`nurses[${index}].name_kanji`}
                          label={t(
                            "visitingNursingStation.form.nurse_name_kanji.label"
                          )}
                          name={`nurses[${index}].name_kanji`}
                          autoComplete={`nurses[${index}].name_kanji`}
                          // autofocus
                          disabled={processing}
                          value={nurse.name_kanji}
                          onChange={formik.handleChange}
                          error={
                            getNestedError(
                              `nurses.${index}.name_kanji`,
                              formik.errors
                            ) !== undefined
                          }
                          // helperText={
                          //     formik.touched.nurses &&
                          //     formik.touched.nurses[index] &&
                          //     formik.errors.nurses
                          // }
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          // size="small"
                          // margin="none"
                          fullWidth
                          margin="dense"
                          id={`nurses[${index}].name_kana`}
                          label={t(
                            "visitingNursingStation.form.nurse_name_kana.label"
                          )}
                          name={`nurses[${index}].name_kana`}
                          autoComplete={`nurses[${index}].name_kana`}
                          // autofocus
                          disabled={processing}
                          value={nurse.name_kana}
                          onChange={formik.handleChange}
                          error={
                            getNestedError(
                              `nurses.${index}.name_kana`,
                              formik.errors
                            ) !== undefined
                          }
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <DatePicker
                          label={t(
                            "visitingNursingStation.form.nurse_birth_date.label"
                          )}
                          slotProps={{
                            textField: {
                              margin: "dense",
                              //   size: "small",
                            },
                          }}
                          format="YYYY/MM/DD"
                          value={dayjs.utc(nurse.birth_date)}
                          onChange={(date: Dayjs | null) => {
                            const age = calculateAge(date?.toDate() as Date);
                            formik.setFieldValue(
                              `nurses[${index}].birth_date`,
                              date
                            );
                            formik.setFieldValue(`nurses[${index}].age`, age);
                          }}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <TextField
                          // size="small"
                          // margin="none"
                          fullWidth
                          margin="dense"
                          id={`nurses[${index}].age`}
                          label={t(
                            "visitingNursingStation.form.nurse_age.label"
                          )}
                          name={`nurses[${index}].age`}
                          autoComplete={`nurses[${index}].age`}
                          // autofocus
                          // disabled={processing}
                          disabled
                          value={nurse.age}
                          onChange={formik.handleChange}
                          error={
                            getNestedError(
                              `nurses.${index}.age`,
                              formik.errors
                            ) !== undefined
                          }
                        />
                      </Grid>
                      <Grid alignSelf="center" item xs={1}>
                        <Button
                          sx={{
                            margin: 0,
                          }}
                          size="small"
                          variant="contained"
                          // variant='outlined'
                          onClick={() => handleRemoveNurseInCharge(index)}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </Button>
                      </Grid>
                    </Grid>
                  )
                )}
            </Grid>

            <Grid item xs={12}>
              <Button
                size="small"
                variant="outlined"
                type="button"
                // disabled={!hasRESHistory.hasSchoolHistory}
                onClick={handleAddNurseInCharge}
              >
                {t("visitingNursingStation.form.nurses.actions.add")}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <LoadingButton loading={processing} type="submit" variant="contained">
            {editMode
              ? t("visitingNursingStation.modal.edit.action")
              : t("visitingNursingStation.modal.add.action")}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NursingStationDialog;
