import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Autocomplete,
  Typography,
  Grid,
} from "@mui/material";
import { LoadingButton, DatePicker } from "@mui/lab";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { Delete as DeleteIcon } from "@mui/icons-material";
// import { differenceInMinutes } from "date-fns";
// import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
// import { Event, EventColor, eventColors } from "../types/event";
import {
  StaffScheduleSelect,
  StaffWorkSchedule,
  StaffWorkScheduleColor,
  staffColors,
} from "../types/StaffWorkSchedule";
import { PatientSelect } from "../../patients/types/patient";
import { differenceInMinutes, toUTC, toZonedTime } from "../../helpers/dayjs";

type StaffWorkScheduleDialogProps = {
  onAdd: (event: Partial<StaffWorkSchedule>) => void;
  onClose: () => void;
  onDelete: (swsId: string) => void;
  onUpdate: (sws: StaffWorkSchedule) => void;
  open: boolean;
  processing: boolean;
  workSchedule?: StaffWorkSchedule;
  staffSelect?: StaffScheduleSelect[];
  patientSelect?: PatientSelect[];
};

export interface StaffWorkScheduleFormValues {
  staff: string;
  patient: string; // patient_name
  service_type?: string;
  service_details?: string;
  // date?: Date; // (number)
  start: Date; // as str e.g 12:00, 18:00 24 hr format
  end: Date; // as str e.g 12:00, 18:00 24 hr format
  duration: string; // from start to end total of hours 60 * n(h)
  remarks?: string;
  color?: StaffWorkScheduleColor;
}

const StaffWorkScheduleDialog = ({
  onAdd,
  onClose,
  onDelete,
  onUpdate,
  open,
  processing,
  workSchedule,
  staffSelect,
  patientSelect,
}: StaffWorkScheduleDialogProps) => {
  // console.log(workSchedule);
  const { i18n, t } = useTranslation();

  // console.log(workSchedule);

  const editMode = Boolean(workSchedule && workSchedule.id);

  const convertFormValues = (
    values: StaffWorkScheduleFormValues
  ): Partial<StaffWorkSchedule> => {
    // change the time depending

    return {
      ...values,
      // start: zonedTimeToUtc(values.start, "UTC").valueOf(),
      start: toUTC(values.start, "UTC").valueOf(),
      end: toUTC(values.end, "UTC").valueOf(),
    };
  };

  const handleSubmit = (values: StaffWorkScheduleFormValues) => {
    const newWorkSchedule = convertFormValues(values);

    // no adding of shift yet
    if (workSchedule && workSchedule.id) {
      onUpdate({
        ...newWorkSchedule,
        id: workSchedule.id,
      } as StaffWorkSchedule);
    } else {
      onAdd(newWorkSchedule);
    }
  };

  // you have to add date for the shift, however, the data is coming from a different source, so adding it here wont be necessary

  const formik = useFormik({
    initialValues: {
      staff: workSchedule ? workSchedule?.staff : "",
      patient: workSchedule ? workSchedule?.patient : "",
      service_type: workSchedule ? workSchedule?.service_type : "",
      service_details: workSchedule ? workSchedule?.service_details : "",
      // date: workSchedule
      //   ? utcToZonedTime(workSchedule.start, "UTC")
      //   : new Date(),
      date: workSchedule ? toZonedTime(workSchedule.start, "UTC") : new Date(),
      // start: workSchedule
      //   ? utcToZonedTime(workSchedule.start, "UTC")
      //   : new Date(),
      start: workSchedule
        ? new Date(toZonedTime(workSchedule.start, "UTC"))
        : new Date(),
      // end: workSchedule ? utcToZonedTime(workSchedule.end, "UTC") : new Date(),
      end: workSchedule
        ? new Date(toZonedTime(workSchedule.end, "UTC"))
        : new Date(),
      duration: workSchedule ? workSchedule?.duration : "",
      remarks: workSchedule ? workSchedule?.remarks : "",
      color: workSchedule ? workSchedule.color : "primary",
    },
    validationSchema: Yup.object({
      start: Yup.date().required(t("common.required")),
      end: Yup.date().required(t("common.required")),
      duration: Yup.string().required(t("common.required")),
    }),

    onSubmit: handleSubmit,
  });

  return (
    <Dialog
      fullWidth
      maxWidth={"sm"}
      open={open}
      onClose={onClose}
      aria-labelledby="sws-dialog-title"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="sws-dialog-title">
          {editMode
            ? t("staffWorkSchedule.modal.edit.title")
            : t("staffWorkSchedule.modal.add.title")}
        </DialogTitle>
        <DialogContent>
          {editMode ? (
            <TextField
              margin="normal"
              fullWidth
              id="staff"
              label={t("staffWorkSchedule.form.staff.label")}
              InputProps={{
                readOnly: true,
              }}
              name="staff"
              disabled={processing}
              value={formik.values.staff}
              onChange={formik.handleChange}
              error={formik.touched.staff && Boolean(formik.errors.staff)}
              helperText={formik.touched.staff && formik.errors.staff}
            />
          ) : (
            <Autocomplete
              fullWidth
              sx={{
                marginBottom: 2,
              }}
              // freeSolo
              id="staff-select"
              options={staffSelect || []}
              getOptionLabel={(option) => {
                // console.log(option)
                const name =
                  i18n.language === "en"
                    ? option.english_name
                    : option.japanese_name;

                return name;
              }}
              // value={formik.values.staff}
              onChange={(_, newValue) => {
                formik.setFieldValue("staff", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t(
                    "staffWorkSchedule.autoCompleteField.searchStaff.label"
                  )}
                  // InputProps={{
                  //   ...params.InputProps,
                  //   type: "search",
                  // }}
                />
              )}
            />
          )}

          {editMode ? (
            <TextField
              margin="normal"
              fullWidth
              id="patient"
              label={t("staffWorkSchedule.form.patient.label")}
              InputProps={{
                readOnly: true,
              }}
              name="patient"
              disabled={processing}
              value={formik.values.patient}
              onChange={formik.handleChange}
              error={formik.touched.patient && Boolean(formik.errors.patient)}
              helperText={formik.touched.patient && formik.errors.patient}
            />
          ) : (
            <Autocomplete
              fullWidth
              // freeSolo
              id="patient-select"
              options={patientSelect || []}
              getOptionLabel={(option) => {
                // console.log(option)
                const name =
                  i18n.language === "en" ? option.name_kana : option.name_kanji;

                return name;
              }}
              // value={formik.values.staff}
              onChange={(_, newValue) => {
                formik.setFieldValue("patient", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t(
                    "staffWorkSchedule.autoCompleteField.searchPatient.label"
                  )}
                  // InputProps={{
                  //   ...params.InputProps,
                  //   type: "search",
                  // }}
                />
              )}
            />
          )}

          <TextField
            margin="normal"
            fullWidth
            id="service_type"
            label={t("staffWorkSchedule.form.service_type.label")}
            InputProps={{
              readOnly: true,
            }}
            name="service_type"
            disabled={processing}
            value={formik.values.service_type}
            onChange={formik.handleChange}
            error={
              formik.touched.service_type && Boolean(formik.errors.service_type)
            }
            helperText={
              formik.touched.service_type && formik.errors.service_type
            }
          />

          {/* <Autocomplete
            fullWidth
            // freeSolo
            id="patient-select"
            options={patientSelect || []}
            getOptionLabel={(option) => {
              // console.log(option)
              const name =
                i18n.language === "en"
                  ? option.name_kana
                  : option.name_kanji;

              return name;
            }}
            value={formik.values.patient}
            onChange={(_, newValue) => {
              formik.setFieldValue("patient", newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("staffWorkSchedule.autoCompleteField.search.label")}
                // InputProps={{
                //   ...params.InputProps,
                //   type: "search",
                // }}
              />
            )}
          /> */}

          <DatePicker
            label={t("staffWorkSchedule.form.date.label")}
            // inputFormat="yyyy/MM/dd H:mm"
            // className="MuiMobileDatePicker"
            value={formik.values.date}
            onChange={(newDate: Date | null) => {
              formik.setFieldValue("date", newDate);
              // set the date for both start and end time
              if (newDate) {
                // Create new Date objects for start and end to keep the time part unchanged
                const newStart = new Date(formik.values.start);
                const newEnd = new Date(formik.values.end);

                // Set the date part to the newDate selected, preserving the time
                newStart.setFullYear(
                  newDate.getFullYear(),
                  newDate.getMonth(),
                  newDate.getDate()
                );
                newEnd.setFullYear(
                  newDate.getFullYear(),
                  newDate.getMonth(),
                  newDate.getDate()
                );

                // Update formik values
                formik.setFieldValue("start", newStart);
                formik.setFieldValue("end", newEnd);
              }
            }}
            // ampm={false}
            // ampmInClock={false}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderInput={(params: any) => (
              <TextField
                {...params}
                id="date"
                disabled={processing}
                fullWidth
                margin="normal"
                name="date"
              />
            )}
          />

          {/* <TimeField
            label={t("calendar.form.start.label")}
            value={formik.values.start}
            onChange={(date: Date | null) => {
              // console.log(date)
              if (date && formik.values.end) {
                // Extract the time parts from the new time
                const hours = date.getHours();
                const minutes = date.getMinutes();

                // Create a new date object based on the current date value
                const currentStartDate = new Date(formik.values.date);

                // Set the time parts on the current date
                currentStartDate.setHours(hours);
                currentStartDate.setMinutes(minutes);

                // Update the end time in formik without changing the date part
                formik.setFieldValue("start", currentStartDate);

                // console.log(currentStartDate)
              }
            }}
            ampm={false}
          /> */}

          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <DesktopTimePicker
                label={t("calendar.form.start.label")}
                // inputFormat="yyyy/MM/dd H:mm"
                format="HH:mm"
                // className="MuiMobileDatePicker"
                value={dayjs.utc(formik.values.start)}
                onChange={(date: Dayjs | null) => {
                  // console.log(date)
                  if (date && formik.values.end) {
                    // Extract the time parts from the new time
                    // const hours = date.getHours();
                    // get the hour by dayjs
                    const hours = date.hour();
                    // const minutes = date.getMinutes();
                    const minutes = date.minute();

                    // Create a new date object based on the current date value
                    // const currentStartDate = new Date(formik.values.date);
                    const currentStartDate = dayjs.utc(formik.values.date);

                    // Set the time parts on the current date
                    // currentStartDate.setHours(hours);
                    // currentStartDate.setMinutes(minutes);
                    currentStartDate.hour(hours);
                    currentStartDate.minute(minutes);

                    // Update the end time in formik without changing the date part
                    formik.setFieldValue("start", currentStartDate);

                    // console.log(currentStartDate)
                  }
                }}
                ampm={false}
                ampmInClock={false}
                disabled={processing}
                name="start"
                sx={{
                  marginY: 1,
                  width: "100%",
                }}
                // renderInput={(params) => (
                //   <TextField
                //     {...params}
                //     id="start"
                //     disabled={processing}
                //     fullWidth
                //     margin="normal"
                //     name="start"
                //   />
                // )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DesktopTimePicker
                label={t("calendar.form.end.label")}
                // inputFormat="yyyy/MM/dd H:mm"
                format="HH:mm"
                // className="MuiMobileDatePicker"
                value={dayjs.utc(formik.values.end)}
                onChange={(date: Dayjs | null) => {
                  // console.log(date)
                  if (date && formik.values.start) {
                    // Extract the time parts from the new time
                    // const hours = date.getHours();
                    // get the hour by dayjs
                    const hours = date.hour();
                    // const minutes = date.getMinutes();
                    const minutes = date.minute();

                    // Create a new date object based on the current date value
                    // const currentStartDate = new Date(formik.values.date);
                    const currentStartDate = dayjs.utc(formik.values.date);

                    // Set the time parts on the current date
                    // currentStartDate.setHours(hours);
                    // currentStartDate.setMinutes(minutes);
                    currentStartDate.hour(hours);
                    currentStartDate.minute(minutes);

                    // Update the end time in formik without changing the date part
                    formik.setFieldValue("end", currentStartDate);

                    // console.log(currentStartDate)
                  }
                }}
                ampm={false}
                ampmInClock={false}
                disabled={processing}
                name="end"
                sx={{
                  marginY: 1,
                  width: "100%",
                }}
                // renderInput={(params) => (
                //   <TextFieldƒ
                //     {...params}
                //     id="end"
                //     disabled={processing}
                //     fullWidth
                //     margin="normal"
                //     name="end"
                //   />
                // )}
              />
            </Grid>
          </Grid>

          {/* <DesktopTimePicker
            label={t("calendar.form.end.label")}
            // inputFormat="yyyy/MM/dd H:mm"
            value={formik.values.end}
            onChange={(date: Date | null) => {
              if (date && formik.values.start) {
                // Extract the time parts from the new time
                const hours = date.getHours();
                const minutes = date.getMinutes();

                // Create a new date object based on the current date value
                const currentEndDate = new Date(formik.values.date);

                // Set the time parts on the current date
                currentEndDate.setHours(hours);
                currentEndDate.setMinutes(minutes);

                // Update the end time in formik without changing the date part
                formik.setFieldValue("end", currentEndDate);
              }
            }}
            ampm={false}
            ampmInClock={false}
            orientation="landscape"
            // renderInput={(params) => (
            //   <TextField
            //     {...params}
            //     id="end"
            //     disabled={processing}
            //     fullWidth
            //     margin="normal"
            //     name="end"
            //   />
            // )}
          /> */}

          <TextField
            margin="normal"
            fullWidth
            id="duration"
            label={t("staffWorkSchedule.form.duration.label")}
            InputProps={{
              readOnly: true,
            }}
            onFocus={() => {
              // console.log(formik.values.start)
              if (formik.values.start && formik.values.end) {
                const start = formik.values.start;
                const end = formik.values.end;
                // const duration = differenceInMinutes(end, start);
                const duration = differenceInMinutes(end, start);
                formik.setFieldValue("duration", duration);
              }
            }}
            name="duration"
            disabled={processing}
            value={formik.values.duration}
            onChange={formik.handleChange}
            error={formik.touched.duration && Boolean(formik.errors.duration)}
            helperText={formik.touched.duration && formik.errors.duration}
          />

          <Typography>
            {t("staffWorkSchedule.form.durationNote.label")}
          </Typography>

          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">
              {t("calendar.form.color.label")}
            </FormLabel>
            <RadioGroup
              row
              aria-label="color"
              name="color"
              value={formik.values.color}
              onChange={formik.handleChange}
            >
              {staffColors.map((color) => (
                <Radio
                  key={color}
                  disabled={processing}
                  sx={{
                    color: `${color}.main`,
                    "&.Mui-checked": {
                      color: `${color}.main`,
                    },
                  }}
                  value={color}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <DialogActions>
            {workSchedule && workSchedule.id && (
              <IconButton
                aria-label="delete work schedule"
                onClick={() => onDelete(workSchedule.id)}
                disabled={processing}
              >
                <DeleteIcon />
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={onClose}>{t("common.cancel")}</Button>
            <LoadingButton
              disabled={!formik.dirty && !formik.isSubmitting}
              loading={processing}
              type="submit"
              variant="contained"
            >
              {editMode
                ? t("staffWorkSchedule.modal.edit.action")
                : t("staffWorkSchedule.modal.add.action")}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default StaffWorkScheduleDialog;
