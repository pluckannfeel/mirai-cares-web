import {
  Avatar,
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
  Typography,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Article as ArticleIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Empty from "../../core/components/Empty";
import * as selectUtils from "../../core/utils/selectUtils";
import { Staff } from "../types/staff";

interface HeadCell {
  id: string;
  label: string;
  align: "center" | "left" | "right";
}

const headCells: HeadCell[] = [
  //   {
  //     id: "staff",
  //     align: "left",
  //     label: "staffManagement.table.headers.employee",
  //   },
  //   {
  //     id: "staff",
  //     align: "left",
  //     label: "staffManagement.table.headers.staff_no",
  //   },
  {
    id: "image",
    align: "left",
    label: "staffManagement.table.headers.img",
  },
  {
    id: "english_name",
    align: "left",
    label: "staffManagement.table.headers.english_name",
  },
  {
    id: "affiliation",
    align: "center",
    label: "staffManagement.table.headers.affiliation",
  },
  {
    id: "address",
    align: "left",
    label: "staffManagement.table.headers.address",
  },
  {
    id: "contact",
    align: "left",
    label: "staffManagement.table.headers.contact",
  },
  {
    id: "employment_status",
    align: "center",
    label: "staffManagement.table.headers.employment_status",
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

  return (
    <TableHead>
      <TableRow sx={{ "& th": { border: 0 } }}>
        <TableCell sx={{ py: 0 }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all employees",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} sx={{ py: 0 }}>
            {t(headCell.label)}
          </TableCell>
        ))}
        <TableCell align="right" sx={{ py: 0 }}>
          {t("staffManagement.table.headers.actions")}
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

type StaffRowProps = {
  index: number;
  onCheck: (id: string) => void;
  onDelete: (staffIds: string[]) => void;
  onEdit: (staff: Staff) => void;
  onGenerateContract: (staff: Staff) => void;
  //   onView: (employee: Employee) => void;
  processing: boolean;
  selected: boolean;
  staff: Staff;
};

const StaffRow = ({
  index,
  onCheck,
  onDelete,
  onEdit,
  onGenerateContract,
  processing,
  selected,
  staff,
}: StaffRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();

  // console.log(staff)

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
    onDelete([staff.id!]);
  };

  const handleEdit = () => {
    handleCloseActions();
    onEdit(staff);

    // use context to set selected employee
    // setSelectedEmployee(staff);
    // const img_url = staff.img_url?.toString();
  };

  const handleGenerateContract = () => {
    handleCloseActions();
    // onGenerateContract(staff);
    onGenerateContract(staff);
  };

  const rowBackgroundColor =
    staff.zaishoku_joukyou === "退社済"
      ? "background.disabled"
      : "background.paper";

  return (
    <TableRow
      aria-checked={selected}
      tabIndex={-1}
      key={staff.id}
      selected={selected}
      sx={{ "& td": { bgcolor: rowBackgroundColor, border: 0, padding: 1.5 } }}
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
          onClick={() => onCheck(staff.id!)}
        />
      </TableCell>
      <TableCell align="right">
        <Box alignSelf="center" textAlign="center">
          {!staff.img_url ? (
            <Avatar
              sx={{
                // mr: 3,

                width: 75,
                height: 75,
                backgroundColor: "transparent",
              }}
              variant="rounded"
            >
              <PersonIcon sx={{ fontSize: 60 }} />
            </Avatar>
          ) : (
            <Avatar
              sx={{
                // mr: 3,
                width: 75,
                height: 75,
                backgroundColor: "transparent",
              }}
              src={staff.img_url ? staff.img_url.toString() : ""}
              variant="rounded"
            />
          )}
        </Box>
      </TableCell>
      <TableCell align="left">
        <Box>
          {/* Staff Kanji/Romaji Name and Kana */}
          <Typography component="div" variant="h6">
            {/* <strong>
              {t("staffManagement.table.headers.japanese_name") + ": "}
            </strong> */}
            {`${staff.japanese_name}`}
            <br />
            {/* <strong>
              {t("staffManagement.table.headers.english_name") + ": "}
            </strong> */}
            {`${staff.english_name}`}
            {/* add space */}
          </Typography>
        </Box>
        {/* </Box> */}
      </TableCell>
      {/* Affiliation / Joined Data */}
      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {/* {t('staffManagement.table.headers.affiliation') + ': '}{' '} */}
            {staff.staff_code}
            <br/>
            {staff.affiliation}
            {/* {t("staffManagement.table.headers.join_date") + ": "}{" "}
            {staff.join_date} */}
          </Typography>
        </Box>
      </TableCell>
      {/* Address / Postal Code */}
      <TableCell align="left">
        <Box>
          <Typography color="textSecondary" variant="h6">
            〒 {staff.postal_code}
            <br />
            {/* {t('staffManagement.table.headers.affiliation') + ': '}{' '} */}
            {`${staff.prefecture}${staff.municipality}${staff.town}${staff.building}`}
            {/* <strong>{t("staffManagement.table.headers.postal_code") + ": "}</strong> */}
            {/* {' '} */}
          </Typography>
        </Box>
      </TableCell>

      {/* Email / Phone */}
      <TableCell align="left">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {/* {t("staffManagement.table.headers.email") + ": "}{" "} */}
            {staff.phone_number} <br /> {staff.work_email}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {/* {t("staffManagement.table.headers.email") + ": "}{" "} */}
            {staff.zaishoku_joukyou}
          </Typography>
        </Box>
      </TableCell>

      <TableCell
        align="right"
        sx={{ borderTopRightRadius: "1rem", borderBottomRightRadius: "1rem" }}
      >
        <IconButton
          id="staff-row-menu-button"
          aria-label="staff actions"
          aria-controls="staff-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? "true" : "false"}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="staff-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="employee-row-menu-button"
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
          {/* <MenuItem onClick={handleViewDetails}>
            <ListItemIcon>
              <FeedIcon />
            </ListItemIcon>{' '}
            {t('common.view')}
          </MenuItem> */}
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>{" "}
            {t("common.view") + " / " + t("common.edit")}
          </MenuItem>
          <MenuItem onClick={handleGenerateContract}>
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>{" "}
            {t("staffManagement.generateContract.title")}
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

type StaffTableProps = {
  processing: boolean;
  onDelete: (staffIds: string[]) => void;
  onEdit: (staff: Staff) => void;
  onGenerateContract: (staff: Staff) => void;
  //   onView: (employee: Employee) => void;
  onSelectedChange: (staffIds: string[]) => void;
  selected: string[];
  staffs?: Staff[];
};

const StaffTable = ({
  onDelete,
  onEdit,
  onGenerateContract,
  //   onView,
  onSelectedChange,
  processing,
  selected,
  staffs = [],
}: StaffTableProps) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(staffs.length);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(staffs);
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

  if (staffs.length === 0) {
    return <Empty title={t("staffManagement.table.info.noStaff")} />;
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
            rowCount={staffs.length}
          />
          <TableBody>
            {staffs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((staff, index) => (
                <StaffRow
                  index={index}
                  key={staff.id}
                  onCheck={handleClick}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onGenerateContract={onGenerateContract}
                  //   onView={onView}
                  processing={processing}
                  selected={isSelected(staff.id!)}
                  staff={staff}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, staffs.length]}
        component="div"
        count={staffs.length}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage={t("common.table.pagination.rowsPerPage")}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
};

export default StaffTable;
