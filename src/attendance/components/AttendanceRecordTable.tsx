import React, { useState } from "react";

import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import Empty from "../../core/components/Empty";
import * as selectUtils from "../../core/utils/selectUtils";
import { AttendanceRecord } from "../types/attendance";
import i18n from "../../core/config/i18n";
import { formatDateToJapanese } from "../../helpers/dayjs";

interface HeadCell {
  id: string;
  label: string;
  align: "center" | "left" | "right";
}

const staffNameColumnWidth = "10%";

const headCells: HeadCell[] = [
  //   {
  //     id: "staff_code",
  //     align: "left",
  //     label: "attendanceRecord.table.headers.staff_code",
  //   },
  //   {
  //     id: "staff_name",
  //     align: "left",
  //     label: "attendanceRecord.table.headers.staff_name",
  //   },
  {
    id: "date",
    align: "left",
    label: "attendanceRecord.table.headers.date",
  },
  {
    id: "service_hours",
    align: "left",
    label: "attendanceRecord.table.headers.service_hours",
  },
  {
    id: "duration",
    align: "left",
    label: "attendanceRecord.table.headers.duration",
  },
  {
    id: "patient_name",
    align: "left",
    label: "attendanceRecord.table.headers.patient_name",
  },
  {
    id: "service_type",
    align: "left",
    label: "attendanceRecord.table.headers.service_type",
  },

  {
    id: "remarks",
    align: "left",
    label: "attendanceRecord.table.headers.remarks",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

function EnhancedTableHead({
  onSelectAllClick,
  numSelected,
  rowCount,
}: EnhancedTableProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <TableHead>
      <TableRow
        sx={{
          "& th": {
            borderRight: "1px solid rgba(224, 224, 224, 1)",
            borderTop: "1px solid rgba(224, 224, 224, 1)",
          },
        }}
      >
        <TableCell
          sx={{
            // Bold font weight for header titles
            backgroundColor: theme.palette.background.paper, // A neutral grey background Dark grey color for text for better contrast
            fontSize: "0.950rem", // Standard font size for headers
            py: 0,
            paddingLeft: "0.5rem",
            paddingRight: 0,
            // padding: "8px 12px", // Standard padding, can be adjusted
            whiteSpace: "nowrap", // Prevent wrapping
            overflow: "hidden", // Hide overflow
            textOverflow: "ellipsis", // Add ellipsis for overflow text
            width: "auto", // Fill the remaining space
            //   ...(headCell.id === "staff_code" && {
            //     width: staffCodeColumnWidth,
            //   }),
          }}
        >
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all attendance records",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            sx={{
              // Bold font weight for header titles
              backgroundColor: theme.palette.background.paper, // A neutral grey background Dark grey color for text for better contrast
              fontSize: "0.950rem", // Standard font size for headers
              py: 0,
              //   padding: "8px 12px", // Standard padding, can be adjusted
              whiteSpace: "nowrap", // Prevent wrapping
              overflow: "hidden", // Hide overflow
              textOverflow: "ellipsis", // Add ellipsis for overflow text
              width: "auto", // Fill the remaining space
              //   ...(headCell.id === "staff_code" && {
              //     width: staffCodeColumnWidth,
              //   }),
            }}
          >
            {t(headCell.label)}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

type AttendanceRecordRowProps = {
  index: number;
  attendance: AttendanceRecord;
  onCheck: (id: string) => void;
  onDelete?: (attendances: string[]) => void;
  onEdit?: (attendance: AttendanceRecord) => void;
  processing: boolean;
  selected: boolean;
};

const AttendanceRecordRow = ({
  index,
  attendance,
  onCheck,
  onDelete,
  onEdit,
  processing,
  selected,
}: AttendanceRecordRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const theme = useTheme();

  const labelId = `enhanced-table-checkbox-${index}`;
  const openActions = Boolean(anchorEl);

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseActions = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleCloseActions();
    // onDelete([user.id]);
  };

  const handleEdit = () => {
    handleCloseActions();
    // onEdit(user);
  };

  return (
    <TableRow
      hover
      role="checkbox"
      aria-checked={selected}
      tabIndex={-1}
      key={attendance.id}
      selected={selected}
      sx={{
        // "& th": { border: 1 },
        "& td": {
          bgcolor: "background.paper",
          // border: 0,
          fontWeight: "normal",
        },
        bgcolor: index % 2 ? "action.hover" : "background.default", // Alternate colors
      }}
    >
      <TableCell
        sx={{
          fontSize: theme.typography.h6,
          paddingY: 0.2,
          borderRight: "1px solid rgba(224, 224, 224, 1)",
        }}
        padding="checkbox"
      >
        <Checkbox
          color="primary"
          checked={selected}
          onChange={() => onCheck(attendance.id)}
          inputProps={{
            "aria-labelledby": labelId,
          }}
        />
      </TableCell>
      {/* <TableCell align="left">{attendance.staff_code}</TableCell> */}
      {/* <TableCell align="left">{attendance.staff_name}</TableCell> */}
      <TableCell
        sx={{
          fontSize: theme.typography.h6,
          paddingY: 0.2,
          borderRight: "1px solid rgba(224, 224, 224, 1)",
          width: "15%",
        }}
        align="left"
      >
        {formatDateToJapanese(attendance.date)}
      </TableCell>
      <TableCell
        sx={{
          fontSize: theme.typography.h6,
          paddingY: 0.2,
          borderRight: "1px solid rgba(224, 224, 224, 1)",
          width: "15%",
        }}
        align="left"
      >
        {attendance.service_hours}
      </TableCell>
      <TableCell
        sx={{
          fontSize: theme.typography.h6,
          paddingY: 0.2,
          borderRight: "1px solid rgba(224, 224, 224, 1)",
          width: "5%",
        }}
        align="left"
      >
        {attendance.duration}
      </TableCell>
      <TableCell
        sx={{
          fontSize: theme.typography.h6,
          paddingY: 0.2,
          borderRight: "1px solid rgba(224, 224, 224, 1)",
        }}
        align="left"
      >
        {attendance.patient_name === "nan" ? "" : attendance.patient_name}
      </TableCell>
      <TableCell
        sx={{
          fontSize: theme.typography.h6,
          paddingY: 0.2,
          borderRight: "1px solid rgba(224, 224, 224, 1)",
          width: "15%",
        }}
        align="left"
      >
        {attendance.service_type}
      </TableCell>
      <TableCell
        sx={{
          fontSize: theme.typography.h6,
          paddingY: 0.2,
          borderRight: "1px solid rgba(224, 224, 224, 1)",
          width: "25%",
        }}
        align="left"
      >
        {attendance.remarks}
      </TableCell>
      {/* <TableCell align="right">
        <ActionButton
          onDelete={() => onDelete && onDelete([attendance.id.toString()])}
          onEdit={() => onEdit && onEdit(attendance)}
          processing={processing}
        />
      </TableCell> */}
    </TableRow>
  );
};

type AttendanceRecordTableProps = {
  processing: boolean;
  onDelete?: (ids: string[]) => void;
  onEdit?: (attendance: AttendanceRecord) => void;
  onSelectedChange: (selected: string[]) => void;
  selected: string[];
  attendanceRecords: AttendanceRecord[];
  totalWorkHours: number;
  totalWorkDays: number;
};

const AttendanceRecordTable = ({
  processing,
  onDelete,
  onEdit,
  onSelectedChange,
  selected,
  attendanceRecords,
  totalWorkHours,
  totalWorkDays,
}: AttendanceRecordTableProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  //   const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const theme = useTheme();

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(attendanceRecords);
      onSelectedChange(newSelecteds);
      return;
    }
    onSelectedChange([]);
  };

  const handleClick = (id: string) => {
    const newSelected: string[] = selectUtils.selectOne(selected, id);
    onSelectedChange(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id.toString()) !== -1;

  if (attendanceRecords.length === 0) {
    return <Empty title={t("attendanceRecord.table.empty")} />;
  }

  return (
    <React.Fragment>
      <TableContainer
        sx={{
          borderRadius: "12px",
        }}
      >
        <Typography
          sx={{
            padding: "1rem",
            fontWeight: "bold",
            fontSize: theme.typography.h6,
            textAlign: "center",
            display: "flex",
            justifyContent: "flex-start",
            // backgroundColor: "#f8f8f8",
            bgcolor: theme.palette.background.paper,
          }}
        >
          {/* {t("archive.totalFiles", {
            days: totalWorkDays,
            hours: totalWorkHours,
          })} */}
          {`${t(
            "attendanceRecord.table.totalWorkHours"
          )}: ${totalWorkHours}時間 ${t(
            "attendanceRecord.table.totalWorkDays"
          )}: ${totalWorkDays}日`}
        </Typography>
        <Table
          size="small"
          aria-labelledby="tableTitle"
          sx={{
            minWidth: 600,
            // borderCollapse: "separate",
            // borderSpacing: "0 .1rem",
          }}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={attendanceRecords.length}
          />
          <TableBody>
            {attendanceRecords
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((attendance, index) => {
                const isItemSelected = isSelected(attendance.id);
                return (
                  <AttendanceRecordRow
                    key={attendance.id}
                    index={index}
                    onCheck={handleClick}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    processing={processing}
                    selected={isItemSelected}
                    attendance={attendance}
                  />
                );
              })}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[0,5, 10, 15, 20, 25, attendanceRecords.length]}
          component="div"
          lang={i18n.language === "en" ? "en" : "ja"}
          sx={{
            "& .MuiTablePagination-toolbar": {
              display: "flex",
              justifyContent: "flex-start",
              // backgroundColor: "#f8f8f8",
              bgcolor: theme.palette.background.paper,
              fontWeight: "bold",
              // justifyContent: "space-between",
            },
            "& .MuiTablePagination-spacer": {
              flex: "none", // Removes the spacer's flexibility to keep the pagination controls aligned to the left
            },
          }}
          count={attendanceRecords.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </React.Fragment>
  );
};

export default AttendanceRecordTable;
