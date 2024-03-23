import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  ListSubheader,
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
  Person as PersonIcon,
} from "@mui/icons-material";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Empty from "../../core/components/Empty";
import * as selectUtils from "../../core/utils/selectUtils";
import { Staff } from "../../staff/types/staff";

interface HeadCell {
  id: string;
  label: string;
  align: "center" | "left" | "right";
}

const headCells: HeadCell[] = [
  //   {
  //     id: "user",
  //     align: "left",
  //     label: "company.staffCodeList.table.headers.staff_code",
  //   },
  {
    id: "job",
    align: "left",
    label: "company.staffCodeList.table.headers.staff_name",
  },
  //   {
  //     id: "role",
  //     align: "center",
  //     label: "userManagement.table.headers.role",
  //   },
  //   {
  //     id: "status",
  //     align: "center",
  //     label: "userManagement.table.headers.status",
  //   },
];

interface EnhancedTableProps {
  //   numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

function EnhancedTableHead({
  onSelectAllClick,
  //   numSelected,
  rowCount,
}: EnhancedTableProps) {
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
              "aria-label": "select all staffs",
            }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} sx={{ py: 0 }}>
            {t(headCell.label)}
          </TableCell>
        ))}
        {/* <TableCell align="right" sx={{ py: 0 }}>
          {t("userManagement.table.headers.actions")}
        </TableCell> */}
      </TableRow>
    </TableHead>
  );
}

type StaffRowProps = {
  index: number;
  //   onCheck: (id: string) => void;
  //   onDelete: (staffIds: string[]) => void;
  //   onEdit: (staff: Staff) => void;
  processing: boolean;
  //   selected: boolean;
  staff: Staff;
};

const StaffRow = ({
  index,
  //   onCheck,
  //   onDelete,
  //   onEdit,
  processing,
  //   selected,
  staff,
}: StaffRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();

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
    // onDelete([staff.id]);
  };

  const handleEdit = () => {
    handleCloseActions();
    // onEdit(staff);
  };

  return (
    // <TableRow
    //   //   aria-checked={selected}
    //   tabIndex={-1}
    //   key={staff.id}
    //   //   selected={selected}
    //   sx={{ "& td": { bgcolor: "background.paper", border: 0 } }}
    // >
    //   {/* <TableCell
    //     padding="checkbox"
    //     sx={{ borderTopLeftRadius: "1rem", borderBottomLeftRadius: "1rem" }}
    //   >
    //     <Checkbox
    //       color="primary"
    //       checked={selected}
    //       inputProps={{
    //         "aria-labelledby": labelId,
    //       }}
    //       onClick={() => onCheck(staff.id)}
    //     />
    //   </TableCell> */}
    //   <TableCell align="left">
    //     <Typography component="div" variant="h3">
    //       {`${staff.staff_code}`}
    //     </Typography>
    //   </TableCell>
    //   <TableCell>
    //     <Box sx={{ display: "flex", alignItems: "left" }}>
    //       {!staff.img_url ? (
    //         <Avatar
    //           sx={{
    //             mr: 3,

    //             width: 75,
    //             height: 75,
    //             backgroundColor: "transparent",
    //           }}
    //           variant="rounded"
    //         >
    //           <PersonIcon sx={{ fontSize: 60 }} />
    //         </Avatar>
    //       ) : (
    //         <Avatar
    //           sx={{
    //             mr: 3,
    //             width: 75,
    //             height: 75,
    //             backgroundColor: "transparent",
    //           }}
    //           src={staff.img_url ? staff.img_url.toString() : ""}
    //           variant="rounded"
    //         />
    //       )}
    //       <Box>
    //         <Typography component="div" variant="h3">
    //           {`${staff.japanese_name}`}
    //         </Typography>
    //         <Typography color="textSecondary" variant="h3">
    //           {staff.english_name}
    //         </Typography>
    //       </Box>
    //     </Box>
    //   </TableCell>
    //   {/* <TableCell align="center">{user.gender}</TableCell> */}

    //   {/* <TableCell
    //     align="right"
    //     sx={{ borderTopRightRadius: "1rem", borderBottomRightRadius: "1rem" }}
    //   >
    //     <IconButton
    //       id="user-row-menu-button"
    //       aria-label="user actions"
    //       aria-controls="user-row-menu"
    //       aria-haspopup="true"
    //       aria-expanded={openActions ? "true" : "false"}
    //       disabled={processing}
    //       onClick={handleOpenActions}
    //     >
    //       <MoreVertIcon />
    //     </IconButton>
    //     <Menu
    //       id="user-row-menu"
    //       anchorEl={anchorEl}
    //       aria-labelledby="user-row-menu-button"
    //       open={openActions}
    //       onClose={handleCloseActions}
    //       anchorOrigin={{
    //         vertical: "top",
    //         horizontal: "right",
    //       }}
    //       transformOrigin={{
    //         vertical: "top",
    //         horizontal: "right",
    //       }}
    //     >
    //       <MenuItem onClick={handleEdit}>
    //         <ListItemIcon>
    //           <EditIcon />
    //         </ListItemIcon>{" "}
    //         {t("common.edit")}
    //       </MenuItem>
    //       <MenuItem onClick={handleDelete}>
    //         <ListItemIcon>
    //           <DeleteIcon />
    //         </ListItemIcon>{" "}
    //         {t("common.delete")}
    //       </MenuItem>
    //     </Menu>
    //   </TableCell> */}
    // </TableRow>

    <>
      <ListItem
        alignItems="flex-start"
        key={staff.id}
        secondaryAction={
          <Typography
            sx={{ display: "inline", padding: 1, borderRadius: 1 }}
            component="span"
            variant="h3"
            bgcolor={staff.staff_code ? "info.main" : "warning.main"}
            color="black"
          >
            {staff.staff_code ? staff.staff_code : "コード無し"}
          </Typography>
        }
      >
        <ListItemAvatar>
          {!staff.img_url ? (
            <Avatar
              sx={{
                mr: 5,

                width: 75,
                height: 75,
                backgroundColor: "transparent",
              }}
              variant="rounded"
            >
              <PersonIcon sx={{ fontSize: 75 }} />
            </Avatar>
          ) : (
            <Avatar
              sx={{
                mr: 5,
                width: 75,
                height: 75,
                backgroundColor: "transparent",
              }}
              src={staff.img_url ? staff.img_url.toString() : ""}
              variant="rounded"
            />
          )}
        </ListItemAvatar>
        <ListItemText
          sx={{
            marginTop: "1rem",
          }}
          primary={
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="h4"
              color="text.primary"
            >
              {staff.japanese_name}
              {/* {staff.staff_code ? staff.staff_code : "コード無し"} */}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="h4"
                color="text.primary"
              >
                {staff.english_name}
              </Typography>
              {/* {" — I'll be in your neighborhood doing errands this…"} */}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="fullWidth" component="li" />
    </>
  );
};

type StaffTableProps = {
  processing: boolean;
  //   onDelete: (staffIds: string[]) => void;
  //   onEdit: (staff: Staff) => void;
  //   onSelectedChange: (selected: string[]) => void;
  //   selected: string[];
  staffs?: Staff[];
};

const StaffCodeListTable = ({
  //   onDelete,
  //   onEdit,
  //   onSelectedChange,
  processing,
  //   selected,
  staffs = [],
}: StaffTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(staffs.length);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(staffs);
      //   onSelectedChange(newSelecteds);
      return;
    }
    // onSelectedChange([]);
  };

  const handleClick = (id: string) => {
    // const newSelected: string[] = selectUtils.selectOne(selected, id);
    // onSelectedChange(newSelected);
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

  //   const isSelected = (id: string) => selected.indexOf(id) !== -1;

  if (staffs.length === 0) {
    return <Empty title="No staff yet" />;
  }

  return (
    <React.Fragment>
      <TableContainer>
        {/* <Table
          aria-labelledby="tableTitle"
          sx={{
            // minWidth: 600,
            // borderCollapse: "separate",
            borderSpacing: "0 1rem",
          }}
        > */}
        {/* <EnhancedTableHead
            // numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={staffs.length}
          /> */}
        {/* <Divider variant="fullWidth" component="h6" /> */}
        {/* <TableBody> */}
        <List
          sx={{ width: "100%", maxWidth: 720, bgcolor: "background.paper" }}
          subheader={
            <ListSubheader
              sx={{
                paddingTop: "1rem",
                fontSize: "1.4rem",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              スタッフ名
            </ListSubheader>
          }
        >
          {staffs
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((staff, index) => (
              <StaffRow
                index={index}
                key={staff.id}
                //   onCheck={handleClick}
                //   onDelete={onDelete}
                //   onEdit={onEdit}
                processing={processing}
                //   selected={isSelected(staff.id)}
                staff={staff}
              />
            ))}
        </List>
        {/* </TableBody> */}
        {/* </Table> */}
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={staffs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </React.Fragment>
  );
};

export default StaffCodeListTable;
