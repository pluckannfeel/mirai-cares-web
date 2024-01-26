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
  Typography,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Empty from "../../core/components/Empty";
import * as selectUtils from "../../core/utils/selectUtils";
import { Patient } from "../types/patient";

interface HeadCell {
  id: string;
  label: string;
  align: "center" | "left" | "right";
}

const headCells: HeadCell[] = [
  {
    id: "patient_name",
    align: "left",
    label: "patientManagement.table.headers.patient_name",
  },
  {
    id: "birth_date",
    align: "center",
    label: "patientManagement.table.headers.birth_date",
  },
  {
    id: "age",
    align: "center",
    label: "patientManagement.table.headers.age",
  },
  {
    id: "disable_support_category",
    align: "center",
    label: "patientManagement.table.headers.disable_support_category",
  },
  {
    id: "beneficiary_number",
    align: "center",
    label: "patientManagement.table.headers.beneficiary_number",
  },
  {
    id: "address",
    align: "center",
    label: "patientManagement.table.headers.address",
  },
  {
    id: "contact",
    align: "center",
    label: "patientManagement.table.headers.contact",
  },
  {
    id: "patient_status",
    align: "center",
    label: "patientManagement.table.headers.patient_status",
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
              "aria-label": "select all patients",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} sx={{ py: 0 }}>
            {t(headCell.label)}
          </TableCell>
        ))}
        <TableCell align="right" sx={{ py: 0 }}>
          {t("patientManagement.table.headers.actions")}
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

type PatientRowProps = {
  index: number;
  onCheck: (id: string) => void;
  onDelete: (patientIds: string[]) => void;
  onEdit: (patient: Patient) => void;
  processing: boolean;
  selected: boolean;
  patient: Patient;
};

const PatientRow = ({
  index,
  onCheck,
  onDelete,
  onEdit,
  processing,
  selected,
  patient,
}: PatientRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

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
    onDelete([patient.id]);
  };

  const handleEdit = () => {
    handleCloseActions();
    onEdit(patient);
  };

  const ageSuffix = currentLanguage === "ja" ? "歳" : " years old";

  return (
    <TableRow
      // onClick={handleEdit}
      aria-checked={selected}
      tabIndex={-1}
      key={patient.id}
      selected={selected}
      sx={{ "& td": { bgcolor: "background.paper", border: 0, padding: 1.5 } }}
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
          onClick={() => onCheck(patient.id!)}
        />
      </TableCell>
      <TableCell align="left">
        {/* <Box sx={{ display: "flex", alignItems: "center" }}> */}
        {/* {( !staff.img_url ? 
            <Avatar sx={{ mr: 3, width: 75, height: 75 }} variant='rounded'>
            <PersonIcon />
          </Avatar> :
          <Avatar sx={{ mr: 3, width: 75, height: 75 }} src={img_url} variant='rounded'/>
          ) } */}
        <Box>
          {/* Staff Kanji/Romaji Name and Kana */}
          <Typography component="div" variant="h6">
            <strong>
              {t("staffManagement.table.headers.japanese_name") + ": "}
            </strong>
            {`${patient.name_kanji}`}
            <br />
            <strong>
              {t("staffManagement.table.headers.english_name") + ": "}
            </strong>
            {`${patient.name_kana}`}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {`${patient.birth_date}`}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {`${patient.age} ${ageSuffix}`}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {`${patient.disable_support_category}`}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {`${patient.beneficiary_number}`}
          </Typography>
        </Box>
      </TableCell>

      {/* Address / Postal Code */}
      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {`${patient.prefecture} ${patient.municipality} ${patient.town} ${patient.building}`}
            <br />
            {patient.postal_code}
          </Typography>
        </Box>
      </TableCell>

      {/* Email / Phone */}
      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {/* {t("staffManagement.table.headers.email") + ": "}{" "} */}
            {patient.telephone_number} <br /> {patient.phone_number}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {/* {t("staffManagement.table.headers.email") + ": "}{" "} */}
            {patient.patient_status}
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
          {/* <MenuItem onClick={handleGenerateContract}>
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>{" "}
            {t("staffManagement.generateContract.title")}
          </MenuItem> */}
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

type PatientTableProps = {
  processing: boolean;
  onDelete: (patientIds: string[]) => void;
  onEdit: (patient: Patient) => void;
  onSelectedChange: (selected: string[]) => void;
  selected: string[];
  patients?: Patient[];
};

const PatientTable = ({
  onDelete,
  onEdit,
  //   onView,
  onSelectedChange,
  processing,
  selected,
  patients = [],
}: PatientTableProps) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(patients.length);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(patients);
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

  if (patients.length === 0) {
    return <Empty title={t("patientManagement.table.info.noPatient")} />;
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
            rowCount={patients.length}
          />
          <TableBody>
            {patients
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((patient, index) => (
                <PatientRow
                  index={index}
                  key={patient.id}
                  onCheck={handleClick}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  //   onView={onView}
                  processing={processing}
                  selected={isSelected(patient.id!)}
                  patient={patient}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, patients.length]}
        component="div"
        count={patients.length}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage={t("common.table.pagination.rowsPerPage")}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
};

export default PatientTable;
