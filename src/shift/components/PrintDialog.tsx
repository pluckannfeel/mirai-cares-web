/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  PrintStaffReport,
  PrintStaffShift,
  // ShiftTable
} from "../types/PrintInformation";

// import { Staff } from "../../staff/types/staff";
import { PatientSelect } from "../../patients/types/patient";
// import { StaffScheduleSelect } from "../types/StaffƒWorkSchedule";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  // Box,
  // TextField,
  Grid,
  Button,
  Typography,
  Autocomplete,
  TextField,
  // Paper,
  // Container,
} from "@mui/material";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  usePDF,
  Font,
} from "@react-pdf/renderer";
import {
  formatDateToJapanese,
  getDuration,
  serviceHours,
  toJapaneseCalendar,
  // toJapaneseCalendar,
} from "../../helpers/dayjs";
import dayjs, { Dayjs } from "dayjs";
import { StaffWorkSchedule } from "../types/StaffWorkSchedule";
import { DatePicker } from "@mui/x-date-pickers";
import Loader from "../../core/components/Loader";
// import { ShiftReport } from "../types/shiftReport";
import { reportDetails } from "../helpers/report";

Font.register({
  family: "YuMincho",
  fonts: [
    { src: "../../../fonts/yumin.ttf" }, // font-style: normal, font-weight: normal
    // { src: source2, fontStyle: 'italic' },
    { src: "../../../fonts/yumindb.ttf", fontWeight: 700 },
  ],
});

export interface PrintDialogProps {
  printMode: string;
  open: boolean;
  onClose: () => void;
  onPrint: () => void;
  processing: boolean;
  patients?: PatientSelect[];
  //   staffSelect?: StaffScheduleSelect[];
  shiftData: PrintStaffShift;
  reportData: PrintStaffReport;
}

const PrintWorkScheduleDocument = (
  shiftData: PrintStaffShift,
  date: Dayjs,
  dataRange: string
) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Title */}
      <Text style={[styles.title, styles.boldText]}>
        {`${toJapaneseCalendar(date.utc().toDate())}ヘルパー別シフト表（予定）`}
      </Text>

      {/* Issued Date */}
      <Text style={styles.issueDate}>
        <Text style={styles.boldText}>発行日：</Text>
        {date.utc().format("YYYY年MM月DD日")}
      </Text>

      {/* Static Text */}
      <Text style={styles.subtitle}>
        <Text style={styles.boldText}>事業所名：</Text>エンジェルケアサービス
      </Text>

      {/* Dynamic Staff Name */}
      <Text style={styles.subtitle}>
        <Text style={styles.boldText}>ヘルパー名：</Text>
        {shiftData.staff.japanese_name}
      </Text>

      {/* Date Range */}
      <Text style={styles.subtitle}>
        <Text style={styles.boldText}>対象期間：</Text>
        {dataRange}
      </Text>

      {/* Table Headers */}
      <View style={styles.tableHeader}>
        <View
          style={[styles.headerCell, styles.tableCell1Flex, { fontSize: 10 }]}
        >
          <Text style={styles.tableHeaderText}>日付</Text>
        </View>
        <View style={[styles.headerCell, styles.tableCell1Flex]}>
          <Text style={styles.tableHeaderText}>サービス提供時間</Text>
        </View>
        <View style={[styles.headerCell, styles.tableCellHalfFlex]}>
          <Text style={styles.tableHeaderText}>分</Text>
        </View>
        <View style={[styles.headerCell, styles.tableCell1Flex]}>
          <Text style={styles.tableHeaderText}>ご利用者名</Text>
        </View>
        <View style={[styles.headerCell, styles.tableCell1Flex]}>
          <Text style={styles.tableHeaderText}>サービス内容</Text>
        </View>
        <View style={[styles.lastHeaderCell]}>
          <Text style={styles.tableHeaderText}>備考</Text>
        </View>
      </View>

      {/* Table Rows */}
      {shiftData.data.map((item: StaffWorkSchedule, index: number) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCell1Flex]}>
            {formatDateToJapanese(item.start)}
          </Text>
          <Text style={[styles.tableCell, styles.tableCell1Flex]}>
            {serviceHours(item.start, item.end)}
          </Text>
          <Text style={[styles.tableCell, styles.tableCellHalfFlex]}>
            {item.duration}
          </Text>
          <Text style={[styles.tableCell, styles.tableCell1Flex]}>
            {item.patient}
          </Text>
          <Text style={[styles.tableCell, styles.tableCell1Flex]}>
            {item.service_type}
          </Text>
          <Text style={[styles.tableCell, styles.tableCell3Flex]}>
            {item.remarks}
          </Text>
        </View>
      ))}
    </Page>
  </Document>
);
// report
const PrintWorkReportDocument = (
  reportData: PrintStaffReport,
  date: Dayjs,
  dataRange: string,
  patient: PatientSelect,
  t: any
) => (
  <Document>
    <Page size="A4" style={[styles.page]}>
      {/* Title */}
      <Text
        style={[styles.reportTitle, styles.boldText]}
      >{`サービス実績を印刷する`}</Text>

      {/* Issued Date */}
      <Text style={styles.reportIssueDate}>
        {/* <Text style={styles.boldText}> 発行日：</Text> */}
        {toJapaneseCalendar(date.utc().toDate())}分
      </Text>

      {/* Dynamic Staff Name */}
      <Text style={[styles.subtitle, styles.boldText]}>
        {/* <Text style={}>ヘルパー名：</Text> */}
        {patient.name_kanji}
      </Text>
      {/* Date Range */}
      <Text style={styles.subtitle}>
        <Text style={styles.boldText}> 対象期間：</Text>
        {/* 令和6年1月1日～令和6年2月4日 */}
        {dataRange}
      </Text>

      {/* there is a patient category that must have selection set here but i dont think it is needed at the moment */}

      <Text style={styles.subtitle}>
        <Text style={styles.boldText}>事業所名：</Text>{" "}
        エンジェルケアサービス事業所
      </Text>

      {/* Table Headers */}
      <View style={{ flexDirection: "row" }}>
        <View style={[styles.headerCell, styles.tableCell1Flex]}>
          <Text style={styles.tableHeaderText}>日付</Text>
        </View>
        <View style={[styles.headerCell, styles.tableCell1Flex]}>
          <Text style={styles.tableHeaderText}>サービス提供時間</Text>
        </View>
        <View style={[styles.headerCell, styles.tableCellHalfFlex]}>
          <Text style={styles.tableHeaderText}>分</Text>
        </View>
        <View style={[styles.headerCell, styles.tableCell1Flex]}>
          <Text style={styles.tableHeaderText}>担当ヘルパー名</Text>
        </View>
        <View style={[styles.headerCell, styles.tableCell1Flex]}>
          <Text style={styles.tableHeaderText}>サービス内容</Text>
        </View>
        <View style={[styles.lastHeaderCell]}>
          <Text style={styles.tableHeaderText}>実施内容</Text>
        </View>
      </View>

      {reportData.data.map((item, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCell1Flex]}>
            {formatDateToJapanese(item.shift.start)}
          </Text>
          <Text style={[styles.tableCell, styles.tableCell1Flex]}>
            {item.service_hours}
          </Text>
          <Text style={[styles.tableCell, styles.tableCellHalfFlex]}>
            {getDuration(new Date(item.shift.start), new Date(item.shift.end))}
          </Text>
          <Text style={[styles.tableCell, styles.tableCell1Flex]}>
            {item.shift.staff}
          </Text>
          <Text style={[styles.tableCell, styles.tableCell1Flex]}>
            {patient.disable_support_category}
          </Text>
          <Text
            style={[
              styles.tableCell,
              styles.tableCell3Flex,
              styles.lastTableCell,
            ]}
          >
            {reportDetails(item, t)}
          </Text>
        </View>
      ))}
    </Page>
  </Document>
);

function PrintDialog({
  printMode,
  open,
  onClose,
  // onPrint,
  // processing,
  patients,
  //   staffSelect,
  shiftData,
  reportData,
}: PrintDialogProps) {
  const { t, i18n } = useTranslation();
  const [patientSelect, setPatientSelect] = useState<any | "">("");

  // Define the initial instance of the PDF
  const [shiftDocInstance, updateShiftDocInstance] = usePDF({
    document: PrintWorkScheduleDocument(shiftData, dayjs(), ""),
  });

  const [reportDocInstance, updateReportDocInstance] = usePDF({
    document: PrintWorkReportDocument(
      reportData,
      dayjs(),
      "",
      {} as PatientSelect,
      t
    ),
  });

  const printWorkSchedule = Boolean(printMode === "workSchedule");

  const [startLimit, setStartLimit] = React.useState<Dayjs | null>(
    dayjs().utc()
  );
  const [endLimit, setEndLimit] = React.useState<Dayjs | null>(
    dayjs().utc().add(1, "day")
  );

  const [isReportDataEmpty, setIsReportDataEmpty] = useState<boolean>(true);

  // const [filteredData, setFilteredData] = useState<StaffWorkSchedule[]>(
  //   shiftData.data
  // );

  useEffect(() => {
    if (startLimit && endLimit) {
      const filtered = shiftData.data.filter((item) => {
        const itemStart = dayjs(item.start);
        const itemEnd = dayjs(item.end);

        const adjustedStartLimit = startLimit
          ? startLimit.startOf("day")
          : null;
        const adjustedEndLimit = endLimit ? endLimit.endOf("day") : null;

        // Debugging logs
        // console.log("Item Start:", itemStart.utc().format());
        // console.log("Item End:", itemEnd.utc().format());
        // console.log("Adjusted Start Limit:", adjustedStartLimit?.utc().format());
        // console.log("Adjusted End Limit:", adjustedEndLimit?.utc().format());

        const isAfterStart = adjustedStartLimit
          ? itemStart.isSameOrAfter(adjustedStartLimit)
          : true;

        const isBeforeEnd = adjustedEndLimit
          ? itemEnd.isSameOrBefore(adjustedEndLimit)
          : true;

        return isAfterStart && isBeforeEnd;
      });

      const dataRangeText = `${formatDateToJapanese(
        startLimit?.toDate() as Date
      )} ～ ${formatDateToJapanese(endLimit?.toDate() as Date)}`;

      const staffToPrint = {
        ...shiftData,
        data: filtered,
      };

      updateShiftDocInstance(
        PrintWorkScheduleDocument(
          staffToPrint,
          startLimit.startOf("day"),
          dataRangeText
        )
      );
    }
  }, [startLimit, endLimit, shiftData, updateShiftDocInstance]);
  // console.log("startLimit", startLimit?.toDate());
  // console.log("endLimit", endLimit?.toDate());

  // Check if either of the instances is loading or has an error
  const isLoading = shiftDocInstance.loading || reportDocInstance.loading;
  const hasError = shiftDocInstance.error || reportDocInstance.error;
  return (
    <Dialog
      fullWidth
      maxWidth={"xs"}
      open={open}
      onClose={onClose}
      aria-labelledby="sws-dialog-title"
    >
      {/* <form onSubmit={formik.handleSubmit} noValidate> */}
      <DialogTitle id="sws-dialog-title">
        {printWorkSchedule
          ? t("staffWorkSchedule.print.title")
          : t("shiftReport.print.title")}
      </DialogTitle>

      <DialogContent sx={{}}>
        {isLoading && <Loader />}

        {hasError && <Typography>{t("common.error")}</Typography>}

        {!isLoading && !hasError && (
          <>
            <Typography>週の開始曜日</Typography>
            <Grid container spacing={1} marginY={1}>
              <Grid item xs={12} md={5}>
                <DatePicker
                  sx={{ width: "100%" }}
                  label={t("staffWorkSchedule.print.form.from")}
                  format="YYYY/MM/DD"
                  value={startLimit}
                  onChange={(newValue) => setStartLimit(newValue)}
                />
              </Grid>
              <Grid
                item
                xs={false}
                md={2}
                sx={{
                  display: "flex",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {t("staffWorkSchedule.print.form.range")}
              </Grid>
              <Grid item xs={12} md={5}>
                <DatePicker
                  sx={{ width: "100%" }}
                  label={t("staffWorkSchedule.print.form.to")}
                  format="YYYY/MM/DD"
                  value={endLimit}
                  onChange={(newValue) => setEndLimit(newValue)}
                  // renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>

            {/* print report  */}
            {!printWorkSchedule && (
              <>
                <Typography marginY={2}>
                  {t("company.document.form.patient.label")}
                </Typography>
                <Autocomplete
                  // fullWidth
                  freeSolo
                  id="patient-select"
                  options={patients || []}
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

                    if (reportData && newValue && startLimit && endLimit) {
                      const normalizeString = (str: string) =>
                        str && str.normalize("NFKC").replace(/\s/g, "");

                      const initialFilter = reportData.data.filter((item) => {
                        return (
                          normalizeString(item.patient) ===
                          normalizeString(val.name_kanji)
                        );
                      });

                      //copy initial filter
                      // let filtered = [...initialFilter];

                      const filtered = initialFilter.filter((item) => {
                        const itemStart = dayjs(item.shift.start);
                        const itemEnd = dayjs(item.shift.end);

                        const adjustedStartLimit = startLimit
                          ? startLimit.startOf("day")
                          : null;
                        const adjustedEndLimit = endLimit
                          ? endLimit.endOf("day")
                          : null;

                        // Debugging logs
                        // console.log("Item Start:", itemStart.utc().format());
                        // console.log("Item End:", itemEnd.utc().format());
                        // console.log("Adjusted Start Limit:", adjustedStartLimit?.utc().format());
                        // console.log("Adjusted End Limit:", adjustedEndLimit?.utc().format());

                        const isAfterStart = adjustedStartLimit
                          ? itemStart.isSameOrAfter(adjustedStartLimit)
                          : true;

                        const isBeforeEnd = adjustedEndLimit
                          ? itemEnd.isSameOrBefore(adjustedEndLimit)
                          : true;

                        return isAfterStart && isBeforeEnd;
                      });

                      const dataRangeText = `${formatDateToJapanese(
                        startLimit?.toDate() as Date
                      )} ～ ${formatDateToJapanese(
                        endLimit?.toDate() as Date
                      )}`;
                      const staffToPrint = {
                        ...reportData,
                        data: filtered,
                      };

                      if (filtered.length === 0) {
                        setIsReportDataEmpty(true);
                      } else {
                        setIsReportDataEmpty(false);
                      }

                      // console.log("filtered", filtered);

                      updateReportDocInstance(
                        PrintWorkReportDocument(
                          staffToPrint,
                          startLimit.startOf("day"),
                          dataRangeText,
                          val,
                          t
                        )
                      );
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

                {isReportDataEmpty && patientSelect && (
                  <Typography marginY={2} color="#DE970B">
                    {t("shiftReport.print.details.noDataToPrint")}
                  </Typography>
                )}
              </>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          component="a"
          href={
            printWorkSchedule
              ? (shiftDocInstance.url as string)
              : (reportDocInstance.url as string)
          }
          download={printWorkSchedule ? "shift.pdf" : "report.pdf"}
          // disable if reportData or shiftData is empty
          disabled={printWorkSchedule ? false : isReportDataEmpty}
          variant="contained" // or any other variant you prefer
        >
          {t("common.print")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PrintDialog;

// Create styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: "row",
//     backgroundColor: "#E4E4E4",
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
// });

const styles = StyleSheet.create({
  // Define your styles here
  // page: {
  //   flexDirection: "column",
  //   backgroundColor: "#FFFFFF",
  // },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontSize: 10,
    fontFamily: "YuMincho",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 12,
  },
  boldText: {
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    margin: 8,
  },
  issueDate: {
    // justifyContent: "flex-end",
    fontWeight: "bold",
    textAlign: "right",
    fontSize: 12,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
  },
  tableRow: {
    flexDirection: "row",
    textAlign: "center",
    borderRightWidth: 0.5,
    borderColor: "black",
  },
  tableColumn: {
    width: "20%", // Adjust the width as per your requirement
    textAlign: "center",
    borderLeftWidth: 0.5,
    borderLeftColor: "black",
    borderLeftStyle: "solid",
    borderRightWidth: 0.5,
    borderRightColor: "black",
    borderRightStyle: "solid",
    paddingTop: 5, // Add padding for content alignment
    paddingBottom: 5, // Add padding for content alignment
  },
  reportTitle: {
    fontSize: 14,
    textAlign: "right",
    marginBottom: 4,
  },
  reportIssueDate: {
    // justifyContent: "flex-end",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  tableCell: {
    borderWidth: 0.5, // Apply border to all sides of the cell
    borderColor: "black",
    paddingHorizontal: 3, // Horizontal padding within cells
    paddingVertical: 3, // Vertical padding within cells
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    fontSize: 6,
  },
  // Style for the last cell on the right to prevent double borders
  lastTableCell: {
    borderRightWidth: 0, // Remove the right border
  },
  // Header styles with borders
  tableHeader: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "black",
    backgroundColor: "#F0F0F0", // Adjust the background color if needed
    // ...other header styles...
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  // Remove bottom border for header to prevent double borders with row cells
  headerCell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "black",
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  lastHeaderCell: {
    flex: 3, // this assumes the last header cell should be three times wider
    borderWidth: 0.5,
    borderColor: "black",
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  // Specific flex styles for each type of cell
  tableCell1Flex: {
    flex: 1,
  },
  tableCellHalfFlex: {
    flex: 0.5,
  },
  tableCell3Flex: {
    flex: 3,
  },
});
