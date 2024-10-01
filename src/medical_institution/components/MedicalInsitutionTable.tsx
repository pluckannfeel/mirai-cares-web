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

import { MedicalInstitution } from "../types/MedicalInstitution";

interface HeadCell {
  id: string;
  label: string;
  align: "center" | "left" | "right";
}

const headCells: HeadCell[] = [
  {
    id: "medical_instiution_name",
    align: "left",
    label: "medicalInstitutionManagement.table.headers.mi_name",
  },
  {
    id: "medical_instiution_address",
    align: "center",
    label: "medicalInstitutionManagement.table.headers.mi_address",
  },
  {
    id: "medical_instiution_physician",
    align: "center",
    label: "medicalInstitutionManagement.table.headers.mi_physician",
  },
  {
    id: "medical_instiution_contact",
    align: "center",
    label: "medicalInstitutionManagement.table.headers.mi_contact",
  },
  {
    id: "medical_instiution_license_no",
    align: "center",
    label: "medicalInstitutionManagement.table.headers.mi_license_no",
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
              "aria-label": "select all institutions",
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

type MedicalInstitutionRowProps = {
  index: number;
  onCheck: (id: string) => void;
  onDelete: (institutionIds: string[]) => void;
  onEdit: (institution: MedicalInstitution) => void;
  processing: boolean;
  selected: boolean;
  institution: MedicalInstitution;
};

const MedicalInstitutionRow = ({
  index,
  onCheck,
  onDelete,
  onEdit,
  processing,
  selected,
  institution,
}: MedicalInstitutionRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  // const currentLanguage = i18n.language;

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
    onDelete([institution.id]);
  };

  const handleEdit = () => {
    handleCloseActions();
    onEdit(institution);
  };

  // console.log(institution);

  return (
    <TableRow
      // onClick={handleEdit}
      aria-checked={selected}
      tabIndex={-1}
      key={institution.id}
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
          onClick={() => onCheck(institution.id!)}
        />
      </TableCell>

      <TableCell align="left">
        <Box>
          {/* Staff Kanji/Romaji Name and Kana */}
          <Typography component="div" variant="h6">
            {`${institution.medical_institution_name}`}
            <br />

            {/* {`${institution.name_kana}`} */}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            〒 {institution.medical_institution_postal_code}
            <br />
            {/* {t('staffManagement.table.headers.affiliation') + ': '}{' '} */}
            {`${institution.medical_institution_address1}`}
            {/* <strong>{t("staffManagement.table.headers.postal_code") + ": "}</strong> */}
            {/* {' '} */}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {`${institution.physician_name_kana}`}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {`${institution.medical_institution_phone}`}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {`${institution.license_number}`}
          </Typography>
        </Box>
      </TableCell>

      {/* Address / Postal Code */}

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

type MedicalInstitutionTableProps = {
  processing: boolean;
  onDelete: (institutionIds: string[]) => void;
  onEdit: (institution: MedicalInstitution) => void;
  onSelectedChange: (selected: string[]) => void;
  selected: string[];
  institutions?: MedicalInstitution[];
};

const MedicalInstitutionTable = ({
  onDelete,
  onEdit,
  //   onView,
  onSelectedChange,
  processing,
  selected,
  institutions = [],
}: MedicalInstitutionTableProps) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(
    institutions.length ? institutions.length : 5
  );

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(institutions);
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

  if (institutions.length === 0) {
    return (
      <Empty
        title={t("medicalInstitutionManagement.table.info.noInstitution")}
      />
    );
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
            rowCount={institutions.length}
          />
          <TableBody>
            {institutions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((institution, index) => (
                <MedicalInstitutionRow
                  index={index}
                  key={institution.id}
                  onCheck={handleClick}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  //   onView={onView}
                  processing={processing}
                  selected={isSelected(institution.id!)}
                  institution={institution}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, institutions.length]}
        component="div"
        count={institutions.length}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage={t("common.table.pagination.rowsPerPage")}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
};

export default MedicalInstitutionTable;
