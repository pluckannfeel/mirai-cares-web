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

import { NursingStation } from "../types/NursingStation";
import { formatDateWithDayjs } from "../../helpers/dayjs";
import i18n from "../../core/config/i18n";

interface HeadCell {
  id: string;
  label: string;
  align: "center" | "left" | "right";
}

const headCells: HeadCell[] = [
  {
    id: "corporate_name",
    align: "left",
    label: "visitingNursingStation.table.headers.name",
  },
  {
    id: "corporate_address",
    align: "center",
    label: "visitingNursingStation.table.headers.address",
  },
  {
    id: "corporate_phone",
    align: "center",
    label: "visitingNursingStation.table.headers.phone",
  },
  {
    id: "rep_name",
    align: "center",
    label: "visitingNursingStation.table.headers.rep_name",
  },
  {
    id: "station_name",
    align: "center",
    label: "visitingNursingStation.table.headers.station_name",
  },
  {
    id: "created_at",
    align: "center",
    label: "visitingNursingStation.table.headers.created_at",
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

type NursingStationRowProps = {
  index: number;
  onCheck: (id: string) => void;
  onDelete: (vnsIds: string[]) => void;
  onEdit: (vns: NursingStation) => void;
  processing: boolean;
  selected: boolean;
  station: NursingStation;
};

const NursingStationRow = ({
  index,
  onCheck,
  onDelete,
  onEdit,
  processing,
  selected,
  station,
}: NursingStationRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  // const currentLanguage = i18n.language;

  const labelId = `enhanced-table-checkbox-${index}`;
  const openActions = Boolean(anchorEl);

  const locale = i18n.language === "en" ? "en" : "ja";

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseActions = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleCloseActions();
    onDelete([station.id]);
  };

  const handleEdit = () => {
    handleCloseActions();
    onEdit(station);
  };

  return (
    <TableRow
      // onClick={handleEdit}
      aria-checked={selected}
      tabIndex={-1}
      key={station.id}
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
          onClick={() => onCheck(station.id!)}
        />
      </TableCell>

      <TableCell align="left">
        <Box>
          {/* Staff Kanji/Romaji Name and Kana */}
          <Typography component="div" variant="h6">
            {`${station.corporate_name}`}
            <br />

            {/* {`${institution.name_kana}`} */}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {/* 〒 */}
            {station.corporate_address}
            {/* <br /> */}
            {/* {t('staffManagement.table.headers.affiliation') + ': '}{' '} */}
            {/* {`${station.corporate_address}`} */}
            {/* <strong>{t("staffManagement.table.headers.postal_code") + ": "}</strong> */}
            {/* {' '} */}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {`${station.phone}`}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {`${station.rep_name_kanji}`}
          </Typography>
          <Typography color="textSecondary" variant="h6">
            {`${station.rep_name_kana}`}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {`${station.station_name}`}
          </Typography>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box>
          <Typography color="textSecondary" variant="h6">
            {formatDateWithDayjs(
              station.created_at as Date,
              "YYYY MMMM",
              locale
            )}
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

type NursingStationTableProps = {
  processing: boolean;
  onDelete: (vnsIds: string[]) => void;
  onEdit: (vns: NursingStation) => void;
  onSelectedChange: (selected: string[]) => void;
  selected: string[];
  nursingStations: NursingStation[];
};

const NursingStationTable = ({
  onDelete,
  onEdit,
  onSelectedChange,
  processing,
  selected,
  nursingStations,
}: NursingStationTableProps) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelecteds = event.target.checked
      ? nursingStations.map((n) => n.id!)
      : [];
    onSelectedChange(newSelecteds);
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

  if (!nursingStations.length) {
    return <Empty title={t("visitingNursingStation.table.info.noStation")} />;
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
            rowCount={nursingStations.length}
          />
          <TableBody>
            {nursingStations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((station, index) => (
                <NursingStationRow
                  index={index}
                  key={station.id}
                  onCheck={handleClick}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  //   onView={onView}
                  processing={processing}
                  selected={isSelected(station.id!)}
                  station={station}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={nursingStations.length}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage={t("common.table.pagination.rowsPerPage")}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
};

export default NursingStationTable;
