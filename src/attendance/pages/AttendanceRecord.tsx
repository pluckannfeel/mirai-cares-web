import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Fab,
  IconButton,
  Button,
  Autocomplete,
  TextField,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { Print as PrintIcon } from "@mui/icons-material";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import {
  AttendanceOverallRecord,
  FilterDate,
  PrintAttendanceRecord,
} from "../types/attendance";
import { useAttendanceRecord } from "../hooks/useAttendanceRecord";

import {
  japaneseMonthObjects,
  months,
  years,
} from "../../payslip/helpers/helper";
import AttendanceRecordTable from "../components/AttendanceRecordTable";
import { useStaffSelect } from "../../staff/hooks/useStaffSelection";
import { StaffScheduleSelect } from "../../shift/types/StaffWorkSchedule";
import PrintConfirmDialog from "../components/PrintConfirmDialog";
import { LoadingButton } from "@mui/lab";

const AttendanceRecord = () => {
  const { t, i18n } = useTranslation();

  const currentDate = dayjs();

  const year = currentDate.year();
  const month = currentDate.month() + 1;

  const [openConfirmPrintDialog, setOpenConfirmPrintDialog] =
    useState<boolean>(false);

  const [filterDate, setFilterDate] = useState<FilterDate>({
    year: year.toString(),
    month: month.toString(),
  });

  const [staffSelect, setStaffSelect] = useState<StaffScheduleSelect>({
    id: "all",
    english_name: "All",
    japanese_name: "全員",
  } as StaffScheduleSelect);
  const [selected, setSelected] = useState<string[]>([]);

  const { data: staffSelection } = useStaffSelect();
  const { data: initialRecords, isLoading } = useAttendanceRecord(
    `${filterDate.year}-${filterDate.month}`
  );

  const [attendanceRecords, setAttendanceRecords] =
    useState<AttendanceOverallRecord>({
      records: [],
      totalWorkHours: 0,
      totalWorkDays: 0,
    });

  const [recordsToPrint, setRecordsToPrint] = useState<PrintAttendanceRecord>({
    staff: staffSelect,
    records: attendanceRecords.records,
    totalWorkHours: attendanceRecords.totalWorkHours,
    totalWorkDays: attendanceRecords.totalWorkDays,
  });

  useEffect(() => {
    if (!initialRecords) {
      setAttendanceRecords({
        records: [],
        totalWorkHours: 0,
        totalWorkDays: 0,
      });

      setSelected([]);
    } else {
      // totalWorkhours is the sum of all the duration of the records
      //   const totalWorkHours = initialRecords.reduce((acc, record) => {
      //     return acc + record.duration;
      //   }, 0);

      //   // totalWorkDays is the number of records in the array however the records can have same date, so only take the unique dates e.g if there are 3 records with the same date, it should be counted as 1 day
      //   const totalWorkDays = new Set(initialRecords.map((record) => record.date))
      //     .size;

      if (staffSelect) {
        // const filteredRecords = initialRecords.filter(
        //   (record) => record.staff_code === staffSelect.staff_code
        // );

        // the initial would be all, so we cannot filter here since there is no staff_code in all selected
        const totalWorkHours = initialRecords.reduce((acc, record) => {
          return acc + record.duration;
        }, 0);

        // convert minutes to hours
        // const totalWorkHours = totalWorkMinutes / 60;
        // console.log(totalWorkHours);
        const totalWorkDays = new Set(
          initialRecords.map((record) => record.date)
        ).size;

        setAttendanceRecords({
          records: initialRecords,
          totalWorkHours,
          totalWorkDays,
        });

        // console.log(attendanceRecords);
      }
      // } else {
      //   const totalWorkMinutes = initialRecords.reduce((acc, record) => {
      //     return acc + record.duration;
      //   }, 0);

      //   // convert minutes to hours
      //   const totalWorkHours = Math.round((totalWorkMinutes / 60));
      //   const totalWorkDays = new Set(
      //     initialRecords.map((record) => record.date)
      //   ).size;

      //   setAttendanceRecords({
      //     records: initialRecords,
      //     totalWorkHours,
      //     totalWorkDays,
      //   });
      // }
    }
  }, [initialRecords]);

  const processing = isLoading;

  // event handlers

  const handleOpenConfirmPrintDialog = () => {
    // get all records with selected ids
    const selectedRecords = initialRecords?.filter((record) =>
      selected.includes(record.id)
    );

    // if selected records has length, then set the records to print
    if (selectedRecords && selectedRecords.length > 0) {
      const totalWorkHours = selectedRecords.reduce((acc, record) => {
        return acc + record.duration;
      }, 0);

      // const totalWorkHours = totalWorkMinutes / 60;

      setRecordsToPrint({
        staff: staffSelect,
        records: selectedRecords,
        totalWorkHours: totalWorkHours,
        totalWorkDays: new Set(selectedRecords.map((record) => record.date))
          .size,
      });
    } else {
      setRecordsToPrint({
        staff: staffSelect,
        records: attendanceRecords.records,
        totalWorkHours: attendanceRecords.totalWorkHours,
        totalWorkDays: attendanceRecords.totalWorkDays,
      });
    }

    setOpenConfirmPrintDialog(true);
  };

  const handleCloseConfirmPrintDialog = () => {
    setOpenConfirmPrintDialog(false);
  };

  const handleCancelSelected = () => {
    setSelected([]);
  };

  const handleSelectedChange = (ids: string[]) => {
    setSelected(ids);
  };

  return (
    <React.Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <AdminAppBar>
        <AdminToolbar title={t("attendanceRecord.title")}>
          <Button
            aria-label="logout"
            color="warning"
            variant="contained"
            disabled={attendanceRecords.records.length === 0}
            onClick={() => handleOpenConfirmPrintDialog()}
            size="small"
            startIcon={<PrintIcon />}
          >
            {t("attendanceRecord.actions.print.label")}
          </Button>
        </AdminToolbar>
      </AdminAppBar>

      <Grid container spacing={2}>
        {/* Use the remaining 1/4 of the area, and revert to full width on extra-small screens */}
        <Grid item xs={12} sm={2}>
          <Card
          // sx={{
          //   marginBottom: 2,
          // }}
          >
            <CardHeader
              sx={{ textAlign: "center" }}
              title={t("attendanceRecord.filter.date")}
            />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <FormControl
                    // sx={{ m: 1, minWidth: 120 }}
                    fullWidth
                    size="small"
                    // component="fieldset"
                    margin="none"
                    // sx={{
                    //   marginBottom: 2,
                    // }}
                  >
                    <InputLabel id="year">
                      {t("attendanceRecord.filter.year")}
                    </InputLabel>
                    <Select
                      // fullWidth
                      autoComplete="year"
                      // // autofocus
                      size="small"
                      name="year"
                      // margin='dense'
                      id="year"
                      label={t("attendanceRecord.filter.year")}
                      labelId="year"
                      disabled={processing}
                      value={filterDate.year || ""}
                      onChange={(e) => {
                        setFilterDate((prev) => {
                          return {
                            ...prev,
                            year: e.target.value,
                          };
                        });

                        // remove selected staff
                        setStaffSelect({
                          id: "all",
                          english_name: "All",
                          japanese_name: "全員",
                        } as StaffScheduleSelect);
                      }}
                    >
                      {years.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {t(option.label)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    // sx={{ m: 1, minWidth: 120 }}
                    fullWidth
                    size="small"
                    // component="fieldset"
                    margin="none"
                  >
                    <InputLabel id="month">
                      {t("payslip.filter.month")}
                    </InputLabel>
                    <Select
                      // fullWidth
                      autoComplete="month"
                      // // autofocus
                      size="small"
                      name="month"
                      // margin='dense'
                      id="month"
                      label={t("payslip.filter.month")}
                      labelId="month"
                      disabled={processing}
                      value={filterDate.month || ""}
                      onChange={(e) => {
                        setFilterDate((prev) => {
                          return {
                            ...prev,
                            month: e.target.value,
                          };
                        });

                        // remove selected staff
                        setStaffSelect({
                          id: "all",
                          english_name: "All",
                          japanese_name: "全員",
                        } as StaffScheduleSelect);
                      }}
                    >
                      {i18n.language === "en"
                        ? months.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {t(option.label)}
                            </MenuItem>
                          ))
                        : japaneseMonthObjects.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {t(option.label)}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card>
            <CardHeader
              sx={{ textAlign: "center" }}
              title={t("attendanceRecord.filter.staff")}
            />
            <CardContent>
              <Autocomplete
                freeSolo
                id="staff-select"
                size="small"
                options={[
                  {
                    id: "all",
                    english_name: "All",
                    japanese_name: "全員",
                  },
                  ...(Array.isArray(staffSelection) ? staffSelection : []),
                ]}
                getOptionLabel={(option: string | StaffScheduleSelect) => {
                  // Check if the option is a string
                  if (typeof option === "string") {
                    return option;
                  }

                  // If option is a StaffScheduleSelect, process it
                  const name =
                    i18n.language === "en"
                      ? option.english_name
                      : option.japanese_name;
                  return name;
                }}
                value={staffSelect}
                onChange={(event, newValue) => {
                  // always clear selected when staff is changed
                  setSelected([]);

                  setStaffSelect(newValue as StaffScheduleSelect);

                  if (!newValue) {
                    setAttendanceRecords({
                      records: [],
                      totalWorkHours: 0,
                      totalWorkDays: 0,
                    });
                    return;
                  }

                  const val = newValue as StaffScheduleSelect;

                  if (val.id === "all") {
                    if (initialRecords) {
                      const totalWorkHours = initialRecords.reduce(
                        (acc, record) => {
                          return acc + record.duration;
                        },
                        0
                      );

                      const totalWorkDays = new Set(
                        initialRecords.map((record) => record.date)
                      ).size;

                      setAttendanceRecords({
                        records: initialRecords,
                        totalWorkHours,
                        totalWorkDays,
                      });
                    } else {
                      setAttendanceRecords({
                        records: [],
                        totalWorkHours: 0,
                        totalWorkDays: 0,
                      });
                    }

                    return;
                  }

                  // filter by staff_code and set the state
                  if (initialRecords) {
                    const filteredRecords = initialRecords.filter(
                      (record) => record.staff_code === val.staff_code
                    );

                    const totalWorkMinutes = filteredRecords.reduce(
                      (acc, record) => {
                        return acc + record.duration;
                      },
                      0
                    );

                    // console.log(totalWorkMinutes);

                    // const totalWorkHours = totalWorkMinutes / 60;

                    const totalWorkDays = new Set(
                      filteredRecords.map((record) => record.date)
                    ).size;

                    setAttendanceRecords({
                      records: filteredRecords,
                      totalWorkHours: totalWorkMinutes,
                      totalWorkDays,
                    });
                  } else {
                    setAttendanceRecords({
                      records: [],
                      totalWorkHours: 0,
                      totalWorkDays: 0,
                    });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t(
                      "staffWorkSchedule.autoCompleteField.searchStaff.label"
                    )}
                  />
                )}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Offset 3/4 of the area */}
        <Grid item xs={12} sm={7}></Grid>

        {/* Table */}
        <Grid item xs={12}>
          <AttendanceRecordTable
            processing={processing}
            // onDelete={() => {}}
            // onEdit={() => {}}
            onSelectedChange={handleSelectedChange}
            selected={selected}
            attendanceRecords={attendanceRecords.records}
            totalWorkHours={attendanceRecords.totalWorkHours}
            totalWorkDays={attendanceRecords.totalWorkDays}
          />
        </Grid>
      </Grid>

      <PrintConfirmDialog
        open={openConfirmPrintDialog}
        onClose={handleCloseConfirmPrintDialog}
        title={t("attendanceRecord.actions.print.title")}
        description={t("attendanceRecord.actions.print.description")}
        // pending={processing}
        printAttendanceRecord={recordsToPrint}
        filterDate={dayjs(`${filterDate.year}-${filterDate.month}-01`).utc()}
      />
    </React.Fragment>
  );
};

export default AttendanceRecord;
