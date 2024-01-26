import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  FormHelperText,
  InputLabel,
  Select,
  Button,
} from "@mui/material";
// import { differenceInMinutes } from "date-fns";
// import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
// import * as Yup from "yup";

// import {Delete as DeleteIcon, Close as CloseIcon} from "@material-ui/icons";

import { OutgoingAssistanceRecord, ShiftReport } from "../types/shiftReport";
import { support_hours, transport_types } from "../../staff/helpers/helper";
import React from "react";

type ShiftReportDialogProps = {
  // onAdd: (event: Partial<ShiftReport>) => void;
  onClose: () => void;
  onDelete: (shiftReportId: string) => void;
  //   onUpdate: (shiftReport: ShiftReport) => void;
  open: boolean;
  processing: boolean;
  shiftReport?: ShiftReport;
};

const ShiftReportDialog = ({
  // onDelete,
  shiftReport,
  onClose,
  processing,
  open,
}: ShiftReportDialogProps) => {
  const { t } = useTranslation();

  //   const editMode = Boolean(shiftReport && shiftReport.id);

  return (
    <Dialog
      fullWidth
      maxWidth={"md"}
      open={open}
      onClose={onClose}
      aria-labelledby="sws-dialog-title"
    >
      {/* <form onSubmit={formik.handleSubmit} noValidate> */}
      <DialogTitle id="sws-dialog-title">
        {/* {editMode
            ? t("staffWorkSchedule.modal.edit.title")
            : t("staffWorkSchedule.modal.add.title")} */}
        {t("shiftReport.dialog.title")}
      </DialogTitle>

      <DialogContent>
        <TextField
          size="small"
          margin="dense"
          fullWidth
          id="patient"
          label={t("shiftReport.dialog.form.sections.patient")}
          InputProps={{
            readOnly: true,
          }}
          name="patient"
          autoComplete="patient"
          // autofocus
          disabled={processing}
          value={shiftReport?.patient}
          //   onChange={formik.handleChange}
          //   error={formik.touched.staff_code && Boolean(formik.errors.staff_code)}
          //   helperText={formik.touched.staff_code && formik.errors.staff_code}
        />

        <TextField
          size="small"
          margin="dense"
          fullWidth
          id="patient"
          label={t("shiftReport.dialog.form.sections.serviceHours")}
          InputProps={{
            readOnly: true,
          }}
          name="patient"
          autoComplete="patient"
          // autofocus
          disabled={processing}
          value={shiftReport?.service_hours}
          //   onChange={formik.handleChange}
          //   error={formik.touched.staff_code && Boolean(formik.errors.staff_code)}
          //   helperText={formik.touched.staff_code && formik.errors.staff_code}
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography
              marginTop={2}
              marginBottom={1}
              textAlign="center"
              variant="h6"
              gutterBottom
            >
              {t("shiftReport.dialog.form.sections.toilet")}
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox checked={shiftReport?.toilet_assistance?.toilet} />
                }
                label={t("shiftReport.dialog.form.toilet_assistance.toilet")}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.toilet_assistance?.diaper_change}
                  />
                }
                label={t("shiftReport.dialog.form.toilet_assistance.diaper")}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.toilet_assistance?.linen_change}
                  />
                }
                label={t("shiftReport.dialog.form.toilet_assistance.linen")}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.toilet_assistance?.urinal_flushing}
                  />
                }
                label={t("shiftReport.dialog.form.toilet_assistance.urinal")}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={6}>
            <Typography
              marginTop={2}
              marginBottom={1}
              textAlign="center"
              variant="h6"
              gutterBottom
            >
              {t("shiftReport.dialog.form.sections.meal")}
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox checked={shiftReport?.meal_assistance?.feeding} />
                }
                label={t("shiftReport.dialog.form.meal_assistance.feeding")}
              />

              <FormControlLabel
                control={
                  <Checkbox checked={shiftReport?.meal_assistance?.posture} />
                }
                label={t("shiftReport.dialog.form.meal_assistance.posture")}
              />
            </FormGroup>

            <FormControl>
              <FormLabel
                id="demo-radio-buttons-group-label"
                sx={{ fontWeight: "bold" }}
              >
                {t("shiftReport.dialog.form.meal_frequencies.label")}
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                // defaultValue="female"

                value={shiftReport?.meal_assistance?.frequency}
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="alltime"
                  control={<Radio />}
                  label={t(
                    "shiftReport.dialog.form.meal_frequencies.options.alltime"
                  )}
                />
                <FormControlLabel
                  value="sometime"
                  control={<Radio />}
                  label={t(
                    "shiftReport.dialog.form.meal_frequencies.options.sometimes"
                  )}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography
              marginTop={2}
              marginBottom={1}
              textAlign="center"
              variant="h6"
              gutterBottom
            >
              {t("shiftReport.dialog.form.sections.bath")}
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox checked={shiftReport?.bath_assistance?.bath} />
                }
                label={t("shiftReport.dialog.form.bath_assistance.bath")}
              />

              <FormControlLabel
                control={
                  <Checkbox checked={shiftReport?.bath_assistance?.shower} />
                }
                label={t("shiftReport.dialog.form.bath_assistance.shower")}
              />

              <FormControlLabel
                control={
                  <Checkbox checked={shiftReport?.bath_assistance?.hair_wash} />
                }
                label={t("shiftReport.dialog.form.bath_assistance.hairWash")}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.bath_assistance?.hand_arms_wash}
                  />
                }
                label={t("shiftReport.dialog.form.bath_assistance.handsArms")}
              />

              <FormControlLabel
                control={
                  <Checkbox checked={shiftReport?.bath_assistance?.feet_wash} />
                }
                label={t("shiftReport.dialog.form.bath_assistance.feetWash")}
              />

              <FormControlLabel
                control={
                  <Checkbox checked={shiftReport?.bath_assistance?.bed_bath} />
                }
                label={t("shiftReport.dialog.form.bath_assistance.bedBath")}
              />

              <FormControl>
                <FormLabel
                  id="demo-radio-buttons-group-label"
                  sx={{ fontWeight: "bold" }}
                >
                  {t("shiftReport.dialog.form.bath_type.label")}
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  // defaultValue="female"

                  value={shiftReport?.bath_assistance?.bath_type}
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="whole_body"
                    control={<Radio />}
                    label={t("shiftReport.dialog.form.bath_type.options.whole")}
                  />
                  <FormControlLabel
                    value="some_part"
                    control={<Radio />}
                    label={t("shiftReport.dialog.form.bath_type.options.part")}
                  />
                </RadioGroup>
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={6}>
            <Typography
              marginTop={2}
              marginBottom={1}
              textAlign="center"
              variant="h6"
              gutterBottom
            >
              {t("shiftReport.dialog.form.sections.grooming")}
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.grooming_assistance?.face_wash}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.grooming_assistance.faceWash"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.grooming_assistance?.tooth_brush}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.grooming_assistance.toothBrush"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.grooming_assistance?.dressing}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.grooming_assistance.dressing"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox checked={shiftReport?.grooming_assistance?.hair} />
                }
                label={t(
                  "shiftReport.dialog.form.grooming_assistance.hairBrush"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.grooming_assistance?.mustache}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.grooming_assistance.mustacheShaving"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.grooming_assistance?.nail_cut}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.grooming_assistance.nailCutting"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.grooming_assistance?.ear_cleaning}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.grooming_assistance.EarCleaning"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.grooming_assistance?.nose_cleaning}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.grooming_assistance.noseCleaning"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.grooming_assistance?.make_up}
                  />
                }
                label={t("shiftReport.dialog.form.grooming_assistance.makeup")}
              />
            </FormGroup>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography
              marginTop={2}
              marginBottom={1}
              textAlign="center"
              variant="h6"
              gutterBottom
            >
              {t("shiftReport.dialog.form.sections.positioning")}
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.positioning_assistance?.body}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.positioning_assistance.bodyPositioning"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.positioning_assistance?.getting_up}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.positioning_assistance.gettingUpAssistance"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.positioning_assistance?.sleeping}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.positioning_assistance.goingSleepAssistance"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.positioning_assistance?.transfer}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.positioning_assistance.transferAssistance"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.positioning_assistance?.going_out}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.positioning_assistance.goingOutAssistance"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      shiftReport?.positioning_assistance?.ready_going_out
                    }
                  />
                }
                label={t(
                  "shiftReport.dialog.form.positioning_assistance.readyGoingOutAssistance"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.positioning_assistance?.going_back}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.positioning_assistance.receivingPatientAssistance"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.positioning_assistance?.hospital}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.positioning_assistance.goingHospitalAssistance"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.positioning_assistance?.shopping}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.positioning_assistance.shoppingAssistance"
                )}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={6}>
            <Typography
              marginTop={2}
              marginBottom={1}
              textAlign="center"
              variant="h6"
              gutterBottom
            >
              {t("shiftReport.dialog.form.sections.medicationMedicalCare")}
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      shiftReport?.medication_medical_care
                        ?.medication_assistance
                    }
                  />
                }
                label={t(
                  "shiftReport.dialog.form.medication_assistance.medicationAssistance"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      shiftReport?.medication_medical_care
                        ?.medication_application
                    }
                  />
                }
                label={t(
                  "shiftReport.dialog.form.medication_assistance.medicationApplication"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.medication_medical_care?.eye_drops}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.medication_assistance.eyedrops"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      shiftReport?.medication_medical_care?.phlegm_suction
                    }
                  />
                }
                label={t(
                  "shiftReport.dialog.form.medication_assistance.phlegmSuction"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.medication_medical_care?.enema}
                  />
                }
                label={t("shiftReport.dialog.form.medication_assistance.enema")}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.medication_medical_care?.tube_feeding}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.medication_assistance.tubeFeeding"
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.medication_medical_care?.watch}
                  />
                }
                label={t(
                  "shiftReport.dialog.form.medication_assistance.watchPatient"
                )}
              />
            </FormGroup>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography
              marginTop={2}
              marginBottom={1}
              textAlign="center"
              variant="h6"
              gutterBottom
            >
              {t("shiftReport.dialog.form.sections.dailyLiving")}
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox checked={shiftReport?.daily_assistance?.cleaning} />
                }
                label={t("shiftReport.dialog.form.cleaning.cleaning")}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={shiftReport?.daily_assistance?.garbase_disposal}
                  />
                }
                label={t("shiftReport.dialog.form.cleaning.garbageDisposal")}
              />

              <FormControlLabel
                control={
                  <Checkbox checked={shiftReport?.daily_assistance?.laundry} />
                }
                label={t("shiftReport.dialog.form.cleaning.laundry")}
              />

              <FormControlLabel
                control={
                  <Checkbox checked={shiftReport?.daily_assistance?.cooking} />
                }
                label={t("shiftReport.dialog.form.cleaning.cooking")}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={6}>
            <Typography
              marginTop={2}
              marginBottom={1}
              textAlign="center"
              variant="h6"
              gutterBottom
            >
              {t("shiftReport.dialog.form.sections.outgoingTransportation")}
            </Typography>

            {shiftReport?.outgoing_assistance &&
              shiftReport.outgoing_assistance.map(
                (record: OutgoingAssistanceRecord, index: number) => (
                  <React.Fragment key={index}>
                    <TextField
                      size="small"
                      margin="dense"
                      fullWidth
                      id="destination"
                      label={t(
                        "shiftReport.dialog.form.outgoing_assistance.destination.label"
                      )}
                      InputProps={{
                        readOnly: true,
                      }}
                      name="destination"
                      autoComplete="destination"
                      // autofocus
                      disabled={processing}
                      value={record.destination}
                      //   onChange={formik.handleChange}
                      //   error={formik.touched.staff_code && Boolean(formik.errors.staff_code)}
                      //   helperText={formik.touched.staff_code && formik.errors.staff_code}
                    />

                    <Grid container spacing={1}>
                      <Grid item xs={8}>
                        <FormControl
                          // sx={{ m: 1, minWidth: 120 }}
                          fullWidth
                          size="small"
                          // component="fieldset"
                          margin="dense"
                        >
                          <InputLabel id="transport_type">
                            {t(
                              "shiftReport.dialog.form.outgoing_assistance.transport_type.label"
                            )}
                          </InputLabel>
                          <Select
                            fullWidth
                            autoComplete="transport_type"
                            // // autofocus
                            size="small"
                            name="transport_type"
                            inputProps={{
                              readOnly: true,
                            }}
                            // margin='dense'
                            id="transport_type"
                            label={t(
                              "shiftReport.dialog.form.outgoing_assistance.transport_type.label"
                            )}
                            labelId="transport_type"
                            disabled={processing}
                            value={record.transport_type}
                            // onChange={formik.handleChange}
                            // error={
                            //   formik.touched.gender &&
                            //   Boolean(formik.errors.transport_type)
                            // }
                          >
                            {transport_types.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {t(option.label)}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {/* {formik.touched.transport_type && formik.errors.transport_type} */}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        {/* <TextField
                          size="small"
                          margin="dense"
                          fullWidth
                          id="support_hours"
                          label={t(
                            "shiftReport.dialog.form.outgoing_assistance.support_hours.label"
                          )}
                          InputProps={{
                            readOnly: true,
                          }}
                          name="support_hours"
                          autoComplete="support_hours"
                          // autofocus
                          disabled={processing}
                          value={record.support_hours}
                          //   onChange={formik.handleChange}
                          //   error={formik.touched.staff_code && Boolean(formik.errors.staff_code)}
                          //   helperText={formik.touched.staff_code && formik.errors.staff_code}
                        /> */}

                        <FormControl
                          // sx={{ m: 1, minWidth: 120 }}
                          fullWidth
                          size="small"
                          // component="fieldset"
                          margin="dense"
                        >
                          <InputLabel id="support_hours">
                            {t(
                              "shiftReport.dialog.form.outgoing_assistance.support_hours.label"
                            )}
                          </InputLabel>
                          <Select
                            fullWidth
                            autoComplete="support_hours"
                            // // autofocus
                            size="small"
                            name="support_hours"
                            inputProps={{
                              readOnly: true,
                            }}
                            // margin='dense'
                            id="support_hours"
                            label={t(
                              "shiftReport.dialog.form.outgoing_assistance.support_hours.label"
                            )}
                            labelId="support_hours"
                            disabled={processing}
                            value={record.support_hours}
                            // onChange={formik.handleChange}
                            // error={
                            //   formik.touched.gender &&
                            //   Boolean(formik.errors.support_hours)
                            // }
                          >
                            {support_hours.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {t(option.label)}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {/* {formik.touched.support_hours && formik.errors.support_hours} */}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                )
              )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        {/* {shiftReport && shiftReport.id && (
              <IconButton
                aria-label="delete shift report"
                onClick={() => onDelete(shiftReport.id)}
                disabled={processing}
              >
                <DeleteIcon />
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1 }} /> */}
        <Button onClick={onClose}>{t("common.close")}</Button>
        {/* <LoadingButton
              disabled={!formik.dirty && !formik.isSubmitting}
              loading={processing}
              type="submit"
              variant="contained"
            >
              {editMode
                ? t("staffWorkSchedule.modal.edit.action")
                : t("staffWorkSchedule.modal.add.action")}
            </LoadingButton> */}
      </DialogActions>

      {/* </form> */}
    </Dialog>
  );
};

export default ShiftReportDialog;
