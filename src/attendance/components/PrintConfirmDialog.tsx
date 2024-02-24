/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { AttendanceRecord, PrintAttendanceRecord } from "../types/attendance";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  usePDF,
  Font,
} from "@react-pdf/renderer";

import { useTranslation } from "react-i18next";
// import { ReactComponent as ConfirmSvg } from "../assets/confirm.svg";
import ConfirmSvg from "../../core/assets/confirm.svg?react";
import SvgContainer from "../../core/components/SvgContainer";
import dayjs, { Dayjs } from "dayjs";
import { formatDateToJapanese, toJapaneseCalendar } from "../../helpers/dayjs";

Font.register({
  family: "YuMincho",
  fonts: [
    { src: "../../../fonts/yumin.ttf" }, // font-style: normal, font-weight: normal
    // { src: source2, fontStyle: 'italic' },
    { src: "../../../fonts/yumindb.ttf", fontWeight: 700 },
  ],
});

const PrintAttendanceRecordDocument = (
  attendance: PrintAttendanceRecord,
  date: Dayjs,
  UTCfilteredDate: Date
) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Title */}
      <Text style={[styles.title, styles.boldText]}>
        {`${toJapaneseCalendar(UTCfilteredDate)}ヘルパー別シフト表（予定）`}
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
        {attendance.staff.japanese_name}
      </Text>

      {/* Date Range */}
      <Text style={styles.subtitle}>
        <Text style={styles.boldText}>対象期間：</Text>
        {/* {filteredData}
         */}
        {toJapaneseCalendar(UTCfilteredDate)}
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
        <View style={[styles.headerCell, styles.tableCell1Flex]}>
          <Text style={styles.tableHeaderText}>就労時間</Text>
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
      {attendance.records.map((item: AttendanceRecord, index: number) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCell1Flex]}>
            {/* {formatDateToJapanese(item.start)}
             */}
            {formatDateToJapanese(item.date)}
          </Text>
          <Text style={[styles.tableCell, styles.tableCell1Flex]}>
            {/* {serviceHours(item.start, item.end)} */}
            {item.service_hours}
          </Text>
          <Text style={[styles.tableCell, styles.tableCell1Flex]}>
            {item.duration}
          </Text>
          <Text style={[styles.tableCell, styles.tableCell1Flex]}>
            {item.patient_name}
          </Text>
          <Text style={[styles.tableCell, styles.tableCell1Flex]}>
            {item.service_type}
          </Text>
          <Text style={[styles.tableCell, styles.tableCell3Flex]}>
            {item.remarks}
          </Text>
        </View>
      ))}

      <Text style={styles.subtitle}>
        <Text style={styles.boldText}>就労働時間: </Text>
        {attendance.totalWorkHours} {"     "}
        <Text style={styles.boldText}>出勤日数: </Text>
        {attendance.totalWorkDays}
      </Text>

      {/* <Text style={styles.subtitle}>
        
      </Text> */}
    </Page>
  </Document>
);

type PrintConfirmDialogProps = {
  description?: string;
  onClose: () => void;
  // onConfirm: () => void;
  open: boolean;
  // pending: boolean;
  title: string;
  printAttendanceRecord: PrintAttendanceRecord;
  filterDate: Dayjs;
};

const PrintConfirmDialog = ({
  description,
  onClose,
  // onConfirm,
  open,
  // pending,
  title,
  printAttendanceRecord,
  filterDate,
}: PrintConfirmDialogProps) => {
  const { t } = useTranslation();

  const [recordInstance, updateRecordInstance] = usePDF({
    // Define the component to render
    document: PrintAttendanceRecordDocument(
      printAttendanceRecord,
      dayjs(),
      filterDate.toDate()
    ),
    // Define the filename
  });

  // use effect to update the instance
  useEffect(() => {
    updateRecordInstance(
      PrintAttendanceRecordDocument(
        printAttendanceRecord,
        dayjs(),
        filterDate.toDate()
      )
    );
  }, [printAttendanceRecord, updateRecordInstance]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogContent sx={{ textAlign: "center" }}>
        <SvgContainer>
          <ConfirmSvg style={{ maxWidth: 280, width: "100%" }} />
        </SvgContainer>
        <DialogTitle id="confirm-dialog-title" sx={{ pb: 1, pt: 0 }}>
          {title}
        </DialogTitle>
        {description && (
          <DialogContentText id="confirm-dialog-description">
            {description}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.cancel")}</Button>
        <LoadingButton
          autoFocus
          LinkComponent={"a"}
          download={`${
            printAttendanceRecord.staff.japanese_name
          }_${formatDateToJapanese(filterDate.toDate())}_出勤簿.pdf`}
          // onClick={() => handlePrint(printAttendanceRecord)}
          onClick={() => {
            //close the dialog
            if (!recordInstance.loading) {
              onClose();
            }
          }}
          loading={recordInstance.loading}
          href={recordInstance.url as string}
          variant="contained"
        >
          {t("common.confirm")}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default PrintConfirmDialog;

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
    fontSize: 10,
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
