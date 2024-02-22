import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Grid,
  Radio,
  Button,
  Typography,
} from "@mui/material";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import {
  StaffScheduleSelect,
  StaffWorkSchedule,
} from "../types/StaffWorkSchedule";
// import { NavLink } from "react-router-dom";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import StaffWorkScheduleDialog from "../components/StaffWorkScheduleDialog";
import { useStaffSelect } from "../../staff/hooks/useStaffSelection";
import SWSCalendar from "../components/StaffWorkScheduleCalendar";
// import SWSTimeline from "../components/StaffWorkScheduleTimeline";
// import Calendar from "../../calendar/components/Calendar";
import { useStaffWorkSchedules } from "../hooks/useStaffWorkSchedule";
// import { useAddStaffWorkSchedule } from "../hooks/useAddStaffWorkSchedule";
import FileButton from "../../core/components/FileButton";
import { useImportStaffShift } from "../hooks/useImportStaffShift";
import { usePatientSelect } from "../../patients/hooks/usePatientSelection";
import { calendarViews } from "../../staff/helpers/helper";
// import { PatientSelect } from "../../patients/types/patient";
import { useUpdateStaffWorkSchedule } from "../hooks/useUpdateStaffWorkSchedule";
import { useDeleteStaffWorkSchedule } from "../hooks/useDeleteStaffWorkSchedule";
import { PatientSelect } from "../../patients/types/patient";
import { useShiftReports } from "../hooks/useShiftReports";
import ShiftReportTable from "../components/ShiftReportTable";
import { ShiftReport } from "../types/shiftReport";
import ShiftReportDialog from "../components/ShiftReportDialog";
import PrintDialog from "../components/PrintDialog";
import { PrintStaffReport, PrintStaffShift } from "../types/PrintInformation";
import { useAuth } from "../../auth/contexts/AuthProvider";

const Shift = () => {
  const snackbar = useSnackbar();
  const { t, i18n } = useTranslation();
  const [staffSelect, setStaffSelect] = useState<StaffScheduleSelect | "">("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [patientSelect, setPatientSelect] = useState<any | "">("");
  const [viewType, setViewType] = useState<"patient" | "staff">("staff");
  const [view, setView] = useState("workSchedule");

  // detects if all staff is selected
  const [isAllStaffSelected, setIsAllStaffSelected] = useState(false);

  // userinfo
  const { userInfo } = useAuth();

  // ================ shift (work schedule) ================
  const { data: initialWorkSchedule, refetch: refetchWorkSchedule } =
    useStaffWorkSchedules();

  const [workSchedules, setWorkSchedules] = useState<StaffWorkSchedule[]>([]);
  const { data: staffSelection } = useStaffSelect();
  const { data: patientSelection } = usePatientSelect();

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openSwsDialog, setOpenSwsDialog] = useState(false);
  const [swsToDelete, setSwsToDelete] = useState<string | undefined>(undefined);
  const [swsToEdit, setSwsToEdit] = useState<StaffWorkSchedule | undefined>(
    undefined
  );

  const { isUpdating: isShiftUpdating, updateStaffWorkSchedule } =
    useUpdateStaffWorkSchedule();
  const { isDeleting: isShiftDeleting, deleteStaffWorkSchedule } =
    useDeleteStaffWorkSchedule();
  const { isImporting, importStaffShift } = useImportStaffShift();

  const processing = isShiftUpdating || isShiftDeleting;

  // ================ shift reports ================
  const [
    openConfirmDeleteShiftReportDialog,
    setOpenConfirmShiftReportDeleteDialog,
  ] = useState(false);
  const [openShiftReportDialog, setOpenShiftReportDialog] = useState(false);

  const {
    isLoading,
    data: initialShiftReports,
    // refetch: refetchShiftReports,
  } = useShiftReports();
  const [shiftReports, setShiftReports] = useState<ShiftReport[]>([]);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [shiftReportToView, setShiftReportToView] = useState<
    ShiftReport | undefined
  >(undefined);

  const shiftReportProcessing = isLoading;

  // ================ Print Dialog ================
  const [openPrintDialog, setOpenPrintDialog] = useState(false);

  useEffect(
    () => {
      // If initialWorkSchedule is not loaded yet, or if neither staff nor patient is selected, clear the schedules.
      if (
        !initialWorkSchedule ||
        !initialShiftReports ||
        (!staffSelect && !patientSelect)
      ) {
        setWorkSchedules([]);
        setShiftReports([]);
        return;
      }

      let filteredSchedules = [...initialWorkSchedule]; // Start with a copy of the initial schedules

      let filteredShiftReports = [...initialShiftReports]; // Start with a copy of the initial schedules

      // Filter based on the selected staff
      if (staffSelect && viewType === "staff") {
        filteredSchedules = filteredSchedules.filter((schedule) => {
          // Remove standard and Japanese spaces from schedule.staff
          const normalizedStaffName = schedule.staff
            .replace(/[\s\u3000]+/g, "")
            .toLowerCase();

          // Remove standard and Japanese spaces from staffSelect.japanese_name
          const normalizedSelectedName = staffSelect.japanese_name
            .replace(/[\s\u3000]+/g, "")
            .toLowerCase();

          if (normalizedStaffName.includes(normalizedSelectedName)) {
            // Add gender property to the schedule object directly from staffSelect
            schedule.gender = staffSelect.gender;
            return true;
          }

          return false;
        });

        filteredShiftReports = filteredShiftReports.filter((report) => {
          // Remove standard and Japanese spaces from schedule.staff
          const normalizedStaffName = report.shift.staff
            .replace(/[\s\u3000]+/g, "")
            .toLowerCase();

          // Remove standard and Japanese spaces from staffSelect.japanese_name
          const normalizedSelectedName = staffSelect.japanese_name
            .replace(/[\s\u3000]+/g, "")
            .toLowerCase();

          return normalizedStaffName.includes(normalizedSelectedName);
        });
      }

      // Filter based on the selected patient
      if (patientSelect && viewType === "patient") {
        const normalizeString = (str: string) =>
          str && str.normalize("NFKC").replace(/\s/g, "");

        filteredSchedules = initialWorkSchedule.filter((schedule) => {
          const schedulePatientName = normalizeString(schedule.patient);
          const selectedPatientName = normalizeString(patientSelect.name_kanji);
          return schedulePatientName === selectedPatientName;
        });

        filteredShiftReports = initialShiftReports.filter((report) => {
          const reportPatientName = normalizeString(report.patient);
          const selectedPatientName = normalizeString(patientSelect.name_kanji);
          return reportPatientName === selectedPatientName;
        });
      }

      setWorkSchedules(filteredSchedules);

      setShiftReports(filteredShiftReports);
    },
    [
      // initialWorkSchedule,
      // initialShiftReports,
      // staffSelect,
      // patientSelect,
      // viewType,
    ]
  );

  // const handleAddEvent = async (sws: Partial<StaffWorkSchedule>) => {
  //   // get only staff id from staff sws['staff]
  //   // addStaffWorkSchedule(sws as StaffWorkSchedule)
  //   //   .then(() => {
  //   //     snackbar.success(
  //   //       t("calendar.notifications.addSuccess", { sws: sws.staff })
  //   //     );
  //   //     setOpenSwsDialog(false);
  //   //   })
  //   //   .catch(() => {
  //   //     snackbar.error(t("common.errors.unexpected.subTitle"));
  //   //   });
  // };

  const handleDeleteStaffWorkSchedule = async () => {
    // console.log(swsDeleted)
    if (swsToDelete) {
      deleteStaffWorkSchedule(swsToDelete)
        .then(() => {
          snackbar.success(t("staffWorkSchedule.notifications.deleteSuccess"));
          setOpenConfirmDeleteDialog(false);
          setOpenSwsDialog(false);

          refetchWorkSchedule();
        })
        .catch(() => {
          snackbar.error(t("common.errors.unexpected.subTitle"));
        });
    }
  };

  const handleUpdateStaffWorkSchedule = async (shift: StaffWorkSchedule) => {
    updateStaffWorkSchedule(shift)
      .then((shift) => {
        snackbar.success(
          t("calendar.notifications.updateSuccess", { event: shift.staff })
        );
        setOpenSwsDialog(false);

        refetchWorkSchedule();
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  // shift reports

  const handleDeleteShiftReports = async () => {
    // deleteUsers(userDeleted)
    //   .then(() => {
    //     snackbar.success(t("userManagement.notifications.deleteSuccess"));
    //     setSelectedReports([]);
    //     setUserDeleted([]);
    //     setOpenConfirmDeleteDialog(false);
    //   })
    //   .catch(() => {
    //     snackbar.error(t("common.errors.unexpected.subTitle"));
    //   });
  };

  const handleShiftReportSelectedChange = (newSelected: string[]) => {
    setSelectedReports(newSelected);
  };

  const handleOpenShiftReportDialog = (report?: ShiftReport) => {
    // setUserUpdated(user);
    setShiftReportToView(report);
    setOpenShiftReportDialog(true);

    // console.log("details")
  };

  // shift reports

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
  };

  const handleCloseEventDialog = () => {
    setSwsToDelete(undefined);
    setOpenSwsDialog(false);
  };

  const handleOpenConfirmDeleteDialog = (swsId: string) => {
    setSwsToDelete(swsId);
    setOpenConfirmDeleteDialog(true);
  };

  const handleOpenSwsDialog = (sws?: StaffWorkSchedule) => {
    setSwsToEdit(sws);
    setOpenSwsDialog(true);
  };

  const importCSV = (file: File) => {
    // Return the promise from the importStaffShift function
    setWorkSchedules([]);
    setShiftReports([]);
    setPatientSelect("");
    setStaffSelect("");
    refetchWorkSchedule();
    // refetchShiftReports();

    return importStaffShift(file);
  };

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: string
  ) => {
    if (newView !== null) {
      setView(newView);

      //clear
      setWorkSchedules([]);
      setShiftReports([]);

      // if setview is report, enable the print button

      // clear the patient and staff select
      setPatientSelect("");
      setStaffSelect("");
    }
  };

  // const generatePDF = () => {
  //   const doc = new jsPDF();

  //   // Add title
  //   doc.setFontSize(18);
  //   doc.text("Your Title Here", 20, 20);

  //   // Add date on the right
  //   doc.setFontSize(12);
  //   doc.text("Date: 2024-01-17", 160, 20);

  //   // Sample data for the table
  //   const tableColumn = ["Date", "Time", "Details"];
  //   const tableRows = [
  //     ["2024-01-18", "12:00 - 13:00", "Detail 1"],
  //     ["2024-01-19", "14:00 - 15:00", "Detail 2"],
  //     // Add more rows here
  //   ];

  //   // Add table
  //   doc.autoTable(tableColumn, tableRows, { startY: 30 });

  //   // Save the PDF
  //   doc.save("sample-document.pdf");
  // };

  return (
    <React.Fragment>
      <AdminAppBar>
        <AdminToolbar title={t("staffWorkSchedule.title")}>
          {/* <Button
            sx={{
              marginRight: 1,
              padding: 1.2,
            }}
            // aria-label="logout"
            variant="contained"
            color="primary"
            disabled={processing}
            onClick={() => importCSV()}
            size="medium"
            // startIcon={<DownloadOutlinedIcon />}
          >
          </Button> */}
          {userInfo?.role === "admin" ||
            (userInfo?.role === "manager" && (
              <FileButton
                submitHandler={importCSV}
                loading={isImporting}
                buttonProps={{
                  sx: {
                    marginRight: 1,
                    padding: 1.2,
                  },
                  variant: "contained",
                  color: "primary",
                  disabled: processing,
                  size: "medium",
                  title: t("common.import"),
                }}
              />
            ))}

          {/* <Fab
            aria-label="add work schedule"
            color="primary"
            onClick={() => handleOpenSwsDialog()}
            size="small"
          >
            <AddIcon />
          </Fab> */}
        </AdminToolbar>
      </AdminAppBar>

      <ToggleButtonGroup
        color="primary"
        value={view}
        exclusive
        onChange={handleViewChange}
        aria-label="View"
      >
        <ToggleButton value="workSchedule">
          {t("staffWorkSchedule.menuTabs.shift")}
        </ToggleButton>
        <ToggleButton value="report">
          {t("staffWorkSchedule.menuTabs.reports")}
        </ToggleButton>
      </ToggleButtonGroup>
      <Card
        sx={{
          marginTop: 2,
        }}
      >
        {/* we use Ref here to load all staff to select which staff schedule to load */}
        {/* <Box
          sx={{
            marginTop: 1,
            padding: 2,
            paddingBottom: 1,
            width: 420,
          }}
        > */}

        <Grid
          container
          // margin={2.5}
          padding={2.5}
          marginBottom={0}
          spacing={0}
          paddingBottom={0}
        >
          <Grid item xs={12} sm={5} md={3} xl={2}>
            <FormControl component="fieldset" margin="normal">
              <FormLabel
                component="legend"
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {t("staffWorkSchedule.calendarViews.label")}
              </FormLabel>
              <RadioGroup
                row
                aria-label="calendar_view"
                name="calendar_view"
                value={viewType}
                onChange={(e) => {
                  setWorkSchedules([]);
                  setShiftReports([]);

                  setViewType(e.target.value as "patient" | "staff");

                  setPatientSelect("");
                  setStaffSelect("");
                  // clear the patient and staff select
                }}
              >
                {calendarViews.map((option) => (
                  <FormControlLabel
                    control={<Radio />}
                    key={option.value}
                    label={t(option.label)}
                    value={option.value}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid
            item
            xs={12}
            sm={3}
            md={3}
            xl={2}
            sx={{ marginTop: { xs: 1, sm: 2.5 } }}
          >
            {/* Your existing Autocomplete component */}
            {viewType === "staff" ? (
              <Autocomplete
                // fullWidth
                freeSolo
                id="staff-select"
                options={[
                  {
                    id: "all",
                    english_name: "All",
                    japanese_name: "全員",
                  },
                  ...(Array.isArray(staffSelection) ? staffSelection : []),
                ]}
                // getOptionLabel={(option: StaffScheduleSelect) => {
                //   const name =
                //     i18n.language === "en"
                //       ? option.english_name
                //       : option.japanese_name;
                //   return name;
                // }}
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
                onChange={(_, newValue) => {
                  setStaffSelect(newValue as StaffScheduleSelect);

                  const val = newValue as StaffScheduleSelect;

                  if (view === "workSchedule") {
                    setIsAllStaffSelected(val?.id === "all");
                  } else {
                    setIsAllStaffSelected(false);
                  }

                  if (
                    initialWorkSchedule &&
                    newValue &&
                    view === "workSchedule"
                  ) {
                    if (val.id === "all") {
                      setWorkSchedules(initialWorkSchedule);
                      return;
                    }

                    const filteredWorkSchedule = initialWorkSchedule.filter(
                      (schedule) => {
                        // Remove standard and Japanese spaces from schedule.staff
                        const normalizedStaffName = schedule.staff
                          .replace(/[\s\u3000]+/g, "")
                          .toLowerCase();

                        // Remove standard and Japanese spaces from staffSelect.japanese_name
                        const normalizedSelectedName = val.japanese_name
                          .replace(/[\s\u3000]+/g, "")
                          .toLowerCase();

                        if (
                          normalizedStaffName.includes(normalizedSelectedName)
                        ) {
                          // Add gender property to the schedule object directly from staffSelect
                          schedule.gender = val.gender;
                          return true;
                        }

                        return false;
                      }
                    );
                    setWorkSchedules(filteredWorkSchedule);
                  } else {
                    setWorkSchedules([]);
                  }

                  // Shift report
                  if (initialShiftReports && newValue && view === "report") {
                    if (val.id === "all") {
                      setShiftReports(initialShiftReports);
                      return;
                    }

                    const filteredShiftReports = initialShiftReports.filter(
                      (report) => {
                        // Remove standard and Japanese spaces from schedule.staff
                        const normalizedStaffName = report.shift.staff
                          .replace(/[\s\u3000]+/g, "")
                          .toLowerCase();

                        // Remove standard and Japanese spaces from staffSelect.japanese_name
                        const normalizedSelectedName = val.japanese_name
                          .replace(/[\s\u3000]+/g, "")
                          .toLowerCase();

                        return normalizedStaffName.includes(
                          normalizedSelectedName
                        );
                      }
                    );

                    setShiftReports(filteredShiftReports);
                  } else {
                    setShiftReports([]);
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
            ) : (
              <Autocomplete
                // fullWidth
                freeSolo
                id="patient-select"
                options={patientSelection || []}
                // getOptionLabel={(option: PatientSelect) => {
                //   const name =
                //     i18n.language === "en"
                //       ? option.name_kana
                //       : option.name_kanji;
                //   return name;
                // }}
                getOptionLabel={(option: string | PatientSelect) => {
                  if (typeof option === "string") {
                    return option;
                  }

                  const name =
                    i18n.language === "en"
                      ? option.name_kana
                      : option.name_kanji;

                  return name;
                }}
                value={patientSelect}
                onChange={(_, newValue) => {
                  setPatientSelect(newValue as PatientSelect);

                  const val = newValue as PatientSelect;

                  if (
                    initialWorkSchedule &&
                    newValue &&
                    view === "workSchedule"
                  ) {
                    const normalizeString = (str: string) =>
                      str && str.normalize("NFKC").replace(/\s/g, "");

                    const filteredWorkSchedule = initialWorkSchedule.filter(
                      (schedule) => {
                        const schedulePatientName = normalizeString(
                          schedule.patient
                        );
                        const selectedPatientName = normalizeString(
                          val.name_kanji
                        );
                        return schedulePatientName === selectedPatientName;
                      }
                    );

                    setWorkSchedules(filteredWorkSchedule);
                  } else {
                    setWorkSchedules([]);
                  }

                  if (initialShiftReports && newValue && view === "report") {
                    const normalizeString = (str: string) =>
                      str && str.normalize("NFKC").replace(/\s/g, "");

                    const filteredShiftReports = initialShiftReports.filter(
                      (report) => {
                        const reportPatientName = normalizeString(
                          report.patient
                        );
                        const selectedPatientName = normalizeString(
                          val.name_kanji
                        );
                        return reportPatientName === selectedPatientName;
                      }
                    );

                    setShiftReports(filteredShiftReports);
                  } else {
                    setShiftReports([]);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t(
                      "staffWorkSchedule.autoCompleteField.searchPatient.label"
                    )}
                  />
                )}
              />
            )}
          </Grid>
          <Grid item xs={6} sm={1} md={4} xl={7} />

          {/* Print Button */}
          {/* New Grid item for the button */}
          <Grid
            item
            xs={6}
            sm={2}
            md={2}
            xl={1}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              // justifyContent: "space-evenly",
              // textAlign: "center",
              alignItems: "center",
              marginTop: { xs: 1, sm: 2.5 },
              marginBottom: { xs: 1, sm: 2.5 },
              // paddingBottom: { }
            }}
          >
            {viewType === "staff" && (
              <Button
                disabled={
                  isAllStaffSelected || (!staffSelect && !patientSelect)
                  // &&
                  // staffSelect === "" &&
                  // patientSelect === ""
                }
                onClick={() => setOpenPrintDialog(true)}
                variant="contained"
                color="primary"
              >
                {t("staffWorkSchedule.print.action.print")}
              </Button>
            )}
          </Grid>
        </Grid>

        {view === "workSchedule" ? (
          <SWSCalendar
            schedule={workSchedules}
            onEventClick={handleOpenSwsDialog}
          />
        ) : (
          <ShiftReportTable
            processing={shiftReportProcessing}
            reports={shiftReports}
            selected={selectedReports}
            onSelectedChange={handleShiftReportSelectedChange}
            onDelete={handleDeleteShiftReports}
            onView={handleOpenShiftReportDialog}
          />
        )}
        {/* <Calendar
          contentHeight={720}
          events={data || []}
          onEventClick={handleOpenSwsDialog}
        />  */}
      </Card>

      <ConfirmDialog
        description={t("staffWorkSchedule.confirmations.delete")}
        pending={processing || shiftReportProcessing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteStaffWorkSchedule || handleDeleteShiftReports}
        open={openConfirmDeleteDialog || openConfirmDeleteShiftReportDialog}
        title={t("common.confirmation")}
      />

      {/* // Shift  Dialog */}
      {openSwsDialog && (
        <StaffWorkScheduleDialog
          // onAdd={handleAddEvent}
          onAdd={() => {}}
          onClose={handleCloseEventDialog}
          onDelete={handleOpenConfirmDeleteDialog}
          onUpdate={handleUpdateStaffWorkSchedule}
          open={openSwsDialog}
          processing={processing}
          workSchedule={swsToEdit}
          staffSelect={staffSelection || []}
          patientSelect={patientSelection || []}
        />
      )}

      {/* Shift Report Dialog */}
      {openShiftReportDialog && (
        <ShiftReportDialog
          onClose={() => setOpenShiftReportDialog(false)}
          onDelete={() => setOpenConfirmShiftReportDeleteDialog(true)}
          open={openShiftReportDialog}
          processing={shiftReportProcessing}
          shiftReport={shiftReportToView}
        />
      )}

      {/* Shift Print Dialog */}
      {openPrintDialog && (
        <PrintDialog
          printMode={view}
          open={openPrintDialog}
          onClose={() => setOpenPrintDialog(false)}
          onPrint={() => {}}
          processing={processing}
          patients={patientSelection || []}
          // staffSelect={staffSelection || []}
          shiftData={
            {
              staff: staffSelect,
              data: workSchedules,
            } as PrintStaffShift
          }
          reportData={
            {
              staff: staffSelect,
              data: shiftReports,
            } as PrintStaffReport
          }
        />
      )}
    </React.Fragment>
  );
};

export default Shift;
