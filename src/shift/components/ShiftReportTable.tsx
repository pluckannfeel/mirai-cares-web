import {
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Empty from "../../core/components/Empty";
import * as selectUtils from "../../core/utils/selectUtils";
import { ShiftReport } from "../../shift/types/shiftReport";
// import { format } from "date-fns-tz";
// import { enUS, ja } from "date-fns/locale";
import { formatDateWithDayjs } from "../../helpers/dayjs";

interface HeadCell {
  id: string;
  label: string;
  align: "center" | "left" | "right";
}

const headCells: HeadCell[] = [
  {
    id: "shift_date",
    align: "left",
    label: "shiftReport.table.headers.date",
  },
  {
    id: "patient",
    align: "center",
    label: "shiftReport.table.headers.patient",
  },
  {
    id: "staff",
    align: "center",
    label: "shiftReport.table.headers.staff",
  },
  {
    id: "service_hours",
    align: "center",
    label: "shiftReport.table.headers.service_hours",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

function EnhancedTableHead({}: // onSelectAllClick,
// numSelected,
// rowCount,
EnhancedTableProps) {
  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow sx={{ "& th": { border: 0 } }}>
        {/* <TableCell sx={{ py: 0 }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all reports",
            }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} sx={{ py: 0 }}>
            {t(headCell.label)}
          </TableCell>
        ))}
        <TableCell align="right" sx={{ py: 0 }}>
          {t("userManagement.table.headers.actions")}
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

type ReportRowProps = {
  index: number;
  onCheck: (id: string) => void;
  onDelete: (reportIds: string[]) => void;
  onView: (report: ShiftReport) => void;
  processing: boolean;
  selected: boolean;
  report: ShiftReport;
};

const ReportRow = ({
  // index,
  // onCheck,
  onDelete,
  onView,
  processing,
  selected,
  report,
}: ReportRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t, i18n } = useTranslation();

  // const locale = i18n.language === "en" ? enUS : ja;

  // const labelId = `enhanced-table-checkbox-${index}`;
  const openActions = Boolean(anchorEl);

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseActions = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleCloseActions();
    onDelete([report.id]);
  };

  const handleEdit = () => {
    handleCloseActions();
    onView(report);
  };

  return (
    <TableRow
      aria-checked={selected}
      tabIndex={-1}
      key={report.id}
      selected={selected}
      sx={{ "& td": { bgcolor: "background.paper", border: 0 } }}
    >
      {/* <TableCell
        padding="checkbox"
        sx={{ borderTopLeftRadius: "1rem", borderBottomLeftRadius: "1rem" }}
      >
        <Checkbox
          color="primary"
          checked={selected}
          inputProps={{
            "aria-labelledby": labelId,
          }}
          onClick={() => onCheck(report.id)}
        />
      </TableCell> */}
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <Avatar sx={{ mr: 3 }}>
            <PersonIcon />
          </Avatar> */}
          {/* <Box>
            <Typography component="div" variant="h6">
              {`${user.last_name} ${user.first_name}`}
            </Typography>
            <Typography color="textSecondary" variant="h6">
              {user.email}
            </Typography>
          </Box> */}
          {/* {format(new Date(report.shift.start), "MMMM d, yyyy, EEEE", {
            locale: locale,
          })}
           */}

          {formatDateWithDayjs(
            new Date(report.shift.start),
            "MMMM D, YYYY, dddd",
            i18n.language == "en" ? "enUS" : "ja"
          )}
        </Box>
      </TableCell>
      {/* <TableCell align="center">{user.gender}</TableCell> */}
      <TableCell align="center">{report.patient}</TableCell>
      <TableCell align="center">{report.shift.staff}</TableCell>
      <TableCell align="center">{report.service_hours}</TableCell>
      {/* <TableCell align="center">
        {user.disabled ? (
          <Chip label="Disabled" />
        ) : (
          <Chip color="primary" label="Active" />
        )}
      </TableCell> */}
      <TableCell
        align="right"
        sx={{ borderTopRightRadius: "1rem", borderBottomRightRadius: "1rem" }}
      >
        <IconButton
          id="report-row-menu-button"
          aria-label="report actions"
          aria-controls="report-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? "true" : "false"}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="report-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="report-row-menu-button"
          open={openActions}
          onClose={handleCloseActions}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <ViewIcon />
            </ListItemIcon>{" "}
            {t("common.view")}
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>{" "}
            {t("common.delete")}
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};

type ReportTableProps = {
  processing: boolean;
  onDelete: (reportIds: string[]) => void;
  onView: (report: ShiftReport) => void;
  onSelectedChange: (selected: string[]) => void;
  selected: string[];
  reports?: ShiftReport[];
};

const ShiftReportTable = ({
  onDelete,
  onView,
  onSelectedChange,
  processing,
  selected,
  reports = [],
}: ReportTableProps) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(reports);
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

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  if (reports.length === 0) {
    return <Empty title={t("shiftReport.table.empty")} />;
  }

  return (
    <React.Fragment>
      <TableContainer>
        <Table
          aria-labelledby="tableTitle"
          sx={{
            minWidth: 600,
            borderCollapse: "separate",
            borderSpacing: "0 1rem",
          }}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={reports.length}
          />
          <TableBody>
            {reports
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((report, index) => (
                <ReportRow
                  index={index}
                  key={report.id}
                  onCheck={handleClick}
                  onDelete={onDelete}
                  onView={onView}
                  processing={processing}
                  selected={isSelected(report.id)}
                  report={report}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={reports.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
};

export default ShiftReportTable;
