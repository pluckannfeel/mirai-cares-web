import {
  Box,
  Checkbox,
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
import { Payslip } from "../types/payslip";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as selectUtils from "../../core/utils/selectUtils";
import Empty from "../../core/components/Empty";
import { Staff } from "../../staff/types/staff";
import { formatDateWithDayjs } from "../../helpers/dayjs";

interface HeadCell {
  id: string;
  label: string;
  align: "center" | "left" | "right";
}

const headCells: HeadCell[] = [
  {
    id: "payslip_date",
    align: "left",
    label: "payslip.table.headers.payslipDate",
  },
  {
    id: "staff_name",
    align: "center",
    label: "payslip.table.headers.staffName",
  },
  {
    id: "date_created",
    align: "center",
    label: "payslip.table.headers.dateCreated",
  },
  //   {
  //     id: "service_hours",
  //     align: "center",
  //     label: "shiftReport.table.headers.service_hours",
  //   },
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

  return (
    <TableHead>
      <TableRow sx={{ "& td": { bgcolor: "background.paper", border: 0 } }}>
        <TableCell sx={{ py: 0 }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all reports",
            }}
          />
        </TableCell>
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

type PayslipRowProps = {
  index: number;
  onCheck: (id: string) => void;
  onDelete: (payslipIds: string[]) => void;
  onEdit: (payslip: Payslip) => void;
  processing: boolean;
  selected: boolean;
  payslip: Payslip;
};

const PayslipRow = ({
  index,
  onCheck,
  onDelete,
  onEdit,
  processing,
  selected,
  payslip,
}: PayslipRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t, i18n } = useTranslation();

  const locale = i18n.language === "en" ? "en" : "ja";

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
    onDelete([payslip.id]);
  };

  const handleEdit = () => {
    handleCloseActions();
    onEdit(payslip);
  };

  return (
    <TableRow
      aria-checked={selected}
      tabIndex={-1}
      key={payslip.id}
      selected={selected}
      sx={{ "& td": { bgcolor: "background.paper", border: 0 } }}
    >
      <TableCell
        padding="checkbox"
        sx={{ borderTopLeftRadius: "1rem", borderBottomLeftRadius: "1rem" }}
      >
        <Checkbox
          color="primary"
          checked={selected}
          inputProps={{
            "aria-labelledby": labelId,
          }}
          onClick={() => onCheck(payslip.id)}
        />
      </TableCell>
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
          {formatDateWithDayjs(
            payslip.release_date as Date,
            "YYYY MMMM",
            locale
          )}
        </Box>
      </TableCell>
      {/* <TableCell align="center">{user.gender}</TableCell> */}
      <TableCell align="center">{payslip.staff?.japanese_name}</TableCell>
      <TableCell align="center">
        {formatDateWithDayjs(
          payslip.created_at as Date,
          "YYYY MMMM DD",
          locale
        )}
      </TableCell>
      {/* <TableCell align="center">{payslip.service_hours}</TableCell> */}
      {/* <TableCell align="center">Ï
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

type PayslipTableProps = {
  processing: boolean;
  onDelete: (payslipIds: string[]) => void;
  onEdit: (payslip: Payslip) => void;
  //   onView: (payslip: Payslip) => void;
  onSelectedChange: (selected: string[]) => void;
  selected: string[];
  payslips?: Payslip[];
  staffList: Staff[]; // Assuming Staff is a type you have defined
  onDateFilterChange: (month: number, year: number) => void;
  onStaffFilterChange: (staffId: string) => void;
};

const PayslipTable = ({
  onDelete,
  onEdit,
  //   onView,
  onSelectedChange,
  processing,
  selected,
  payslips = [],
  staffList,
  onDateFilterChange,
  onStaffFilterChange,
}: PayslipTableProps) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // const handleMonthChange = (event: React.ChangeEvent<{ value: unknown }>) => {
  //   // Extract month and year from event and call onDateFilterChange
  // };

  // const handleStaffChange = (event: React.ChangeEvent<{ value: unknown }>) => {
  //   onStaffFilterChange(event.target.value as string);
  // };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(payslips);
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

  if (payslips.length === 0) {
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
            rowCount={payslips.length}
          />
          <TableBody>
            {payslips
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((payslip, index) => (
                <PayslipRow
                  index={index}
                  key={payslip.id}
                  onCheck={handleClick}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  processing={processing}
                  selected={isSelected(payslip.id)}
                  payslip={payslip}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={payslips.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
};

export default PayslipTable;
