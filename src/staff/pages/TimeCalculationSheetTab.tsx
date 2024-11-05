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
} from "@mui/material";
import {
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { FilterDate } from "../../payslip/types/payslip";
import { useTranslation } from "react-i18next";
import {
  japaneseMonthObjects,
  months,
  years,
} from "../../payslip/helpers/helper";
import { useStaffTimeCalculation } from "../hooks/useStaffTimeCalculation";
import dayjs from "dayjs";
import TimeCalculationTable from "../components/TimeCalculationTable";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { baseUrl } from "../../api/server";
import { useAuth } from "../../auth/contexts/AuthProvider";
import FileButton from "../../core/components/FileButton";
import { useImportStaffShift } from "../../shift/hooks/useImportStaffShift";
import {
  StaffScheduleSelect,
  StaffWorkSchedule,
} from "../../shift/types/StaffWorkSchedule";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useStaffSelect } from "../hooks/useStaffSelection";
import { StaffTimeOverallRecord } from "../types/calculations";

const TimeCalculationSheetTab = () => {
  const { t, i18n } = useTranslation();
  const snackbar = useSnackbar();
  const { userInfo } = useAuth();

  const { data: staffSelection } = useStaffSelect();

  const { isImporting, importStaffShift } = useImportStaffShift();

  // Get the current date
  const currentDate = dayjs();
  // Format the date to "YYYY-MM"
  //   const currentDateYearMonth = currentDate.format("YYYY-MM");

  // Get the year and month separately
  const year = currentDate.year();
  const month = currentDate.month() + 1;

  const [filterDate, setFilterDate] = useState<FilterDate>({
    year: year.toString(),
    month: month.toString(),
  });

  const [staffSelect, setStaffSelect] = useState<StaffScheduleSelect>({
    id: "all",
    english_name: "All",
    japanese_name: "全員",
  } as StaffScheduleSelect);

  const [staffTimeRecords, setStaffTimeRecords] =
    useState<StaffTimeOverallRecord>({
      records: [],
      totalWorkHours: 0,
    });

  // get the current date year and date month by dayjs and format it to string to e.g "2024-02"

  const {
    data: initialRecords,
    isLoading,
    refetch: reloadRecords,
  } = useStaffTimeCalculation(`${filterDate.year}-${filterDate.month}`);

  // console.log(records);

  const processing = isLoading;

  const downloadCalculationCsv = async () => {
    try {
      const formData = new FormData();
      formData.append("records", JSON.stringify(staffTimeRecords.records)); // Sending as a JSON string

      // append also the selected year and date
      formData.append("selected_date", `${filterDate.year}-${filterDate.month}`)

      const response = await fetch(
        `${baseUrl}/shift/download_salarycalculation`,
        {
          method: "POST", // or 'PUT
          body: formData, // FormData will set the `Content-Type` to `multipart/form-data` and include the boundary
        }
      );

      // create a formdata

      const blob = await response.blob();

      // log
      // console.log(response.json);

      // Create a hidden <a> element
      const link = document.createElement("a");
      link.style.display = "none";
      document.body.appendChild(link);

      // Set the <a> element's attributes
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", "スタッフ時間計算.xlsx"); // Specify the file name

      // Simulate a click on the <a> element to trigger the download
      link.click();

      // Cleanup by removing the <a> element
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  const importShiftCSV = async (file: File) => {
    setFilterDate({
      year: year.toString(),
      month: month.toString(),
    });

    reloadRecords();

    return await importStaffShift(file);
  };

  useEffect(() => {
    if (!initialRecords) {
      setStaffTimeRecords({
        records: [],

        totalWorkHours: 0,
      });
    } else {
      if (staffSelect) {
        const totalWorkHours = initialRecords.reduce((acc, record) => {
          return acc + record.total_work_hours;
        }, 0);

        setStaffTimeRecords({
          records: initialRecords,
          totalWorkHours,
        });
      }
    }
  }, [initialRecords]);

  return (
    <React.Fragment>
      <AdminAppBar>
        <AdminToolbar title={t("salaryCalculation.toolbar.title")}>
          {(userInfo?.role === "Admin" || userInfo?.role === "Manager") && (
            <FileButton
              submitHandler={importShiftCSV}
              loading={isImporting}
              buttonProps={{
                sx: {
                  marginRight: 2,
                  // padding: 1.2,
                },
                variant: "contained",
                color: "warning",
                // disabled: view !== "workSchedule",
                size: "large",
                title: t("common.import"),
                endIcon: <FileUploadIcon />,
              }}
            />
          )}
          <Button
            aria-label="logout"
            color="info"
            variant="contained"
            disabled={processing}
            onClick={() => downloadCalculationCsv()}
            size="large"
            endIcon={<FileDownloadIcon />}
          >
            CSV {t("common.download")}
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
              title={t("salaryCalculation.table.filter.date")}
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
                      {t("payslip.filter.year")}
                    </InputLabel>
                    <Select
                      // fullWidth
                      autoComplete="year"
                      // // autofocus
                      size="small"
                      name="year"
                      // margin='dense'
                      id="year"
                      label={t("payslip.filter.year")}
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
                    // sx={{
                    //   marginBottom: 2,
                    // }}
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
              title={t("salaryCalculation.table.filter.staff")}
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
                  // setSelected([]);

                  setStaffSelect(newValue as StaffScheduleSelect);

                  if (!newValue) {
                    setStaffTimeRecords({
                      records: [],
                      totalWorkHours: 0,
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

                      setStaffTimeRecords({
                        records: initialRecords,
                        totalWorkHours,
                      });
                    } else {
                      setStaffTimeRecords({
                        records: [],
                        totalWorkHours: 0,
                      });
                    }

                    return;
                  }

                  // filter by staff_code and set the state
                  if (initialRecords) {
                    const filteredRecords = initialRecords.filter(
                      (record) => record.staff_code === val.staff_code
                    );

                    // console.log(filteredRecords);

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

                    setStaffTimeRecords({
                      records: filteredRecords,
                      totalWorkHours: totalWorkMinutes,
                    });
                  } else {
                    setStaffTimeRecords({
                      records: [],
                      totalWorkHours: 0,
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
        <Grid item xs={12} sm={10}></Grid>

        {/* Table */}
        <Grid item xs={12}>
          <TimeCalculationTable
            onDelete={() => {}}
            onEdit={() => {}}
            selected={[]}
            onSelectedChange={() => {}}
            timeRecords={staffTimeRecords.records}
            processing={processing}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default TimeCalculationSheetTab;
