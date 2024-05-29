/* eslint-disable @typescript-eslint/no-unused-vars */
// Archive Table (S3 Current Connected Table)
import {
  Box,
  Checkbox,
  // Avatar,
  // Box,
  // Checkbox,
  // Chip,
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
  // Typography,
  useTheme,
} from "@mui/material";

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Folder as FolderIcon,
  Article as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Description as DescriptionIcon,
  InsertDriveFile as InsertDriveFileIcon,
  DriveFileMove as DriveFileMoveIcon,
  Download as DownloadIcon,
  DriveFileRenameOutline as DriveFileRenameOutlineIcon,
} from "@mui/icons-material";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Empty from "../../core/components/Empty";
import * as selectUtils from "../../core/utils/selectUtils";
import { ArchiveFile } from "../types/archive";
import i18n from "../../core/config/i18n";
import {
  fileTypeConversion,
  formatBytes,
  formatLastModifiedby,
  isFile,
  truncateText,
} from "../helpers/functions";
import { formatLastModified } from "../../helpers/dayjs";

interface HeadCell {
  // id: keyof ArchiveFile;
  key: string;
  label: string;
  align: "center" | "left" | "right";
}

const fileNameColumnWidth = "40%";
// add more if necessary

const headCells: HeadCell[] = [
  { key: "name", label: "archive.table.headers.fileName", align: "left" },
  { key: "actions", label: "", align: "center" },
  { key: "type", label: "archive.table.headers.type", align: "right" },
  { key: "size", label: "archive.table.headers.size", align: "right" },
  {
    key: "lastModified",
    label: "archive.table.headers.lastModified",
    align: "right",
  },
  {
    key: "lastModifiedBy",
    label: "archive.table.headers.lastModifiedBy",
    align: "right",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  //   currentDirectoryFiles: ArchiveFile[];
}

function EnhancedTableHead({
  onSelectAllClick,
  numSelected,
  rowCount,
}: //   currentDirectoryFiles,
EnhancedTableProps) {
  const { t } = useTranslation();

  const theme = useTheme();

  return (
    <TableHead>
      <TableRow
        sx={{
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <TableCell
          padding="checkbox"
          sx={{
            paddingY: 0,
          }}
        >
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.key}
            align={headCell.align}
            sx={{
              paddingY: "1rem",
              fontSize: "0.950rem", // Standard font size for headers
              //   padding: "4px 4px", // Standard padding, can be adjusted

              whiteSpace: "nowrap", // Prevent wrapping
              overflow: "hidden", // Hide overflow
              textOverflow: "ellipsis", // Add ellipsis for overflow text
              ...(headCell.key === "name" && {
                width: fileNameColumnWidth,
              }),
              // checkbox
              ...(headCell.key === "actions" && {
                width: "5%",
              }),
            }}
          >
            {t(headCell.label)}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

type ArchiveRowProps = {
  index: number;
  file: ArchiveFile;
  onCheck: (key: string) => void;
  onDelete: (keys: string[]) => void;
  onEdit?: (file: ArchiveFile) => void;
  onRenameObject: (fileKey: string, fileType: string) => void;
  onMove: (file: ArchiveFile) => void;
  onDownload: (file: ArchiveFile) => void;
  onFileClick: (fileKey: string, fileType: string) => void;
  processing: boolean;
  selected: boolean;
};

const ArchiveRow = ({
  index,
  file,
  onCheck,
  onDelete,
  onEdit,
  onMove,
  onDownload,
  onRenameObject,
  onFileClick,
  processing,
  selected,
}: ArchiveRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t, i18n } = useTranslation();
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
    onDelete([file.key]);
  };

  const handleMove = () => {
    handleCloseActions();
    onMove(file);
  };

  const handleDownload = () => {
    handleCloseActions();
    onDownload(file);
  };

  const handleRename = () => {
    handleCloseActions();
    onRenameObject(file.key, file.type);
  };

  //   const handleEdit = () => {
  //     handleCloseActions();
  //     onEdit(file);
  //   };

  const renderCell = (
    key: string,
    value: string | number | Date | undefined,
    align: "center" | "left" | "right"
  ) => {
    let content;

    // switch (key) {
    //   case "lastModified":
    //     const dateModified = value as Date;
    //     content = dateModified?.toDateString();
    //     break;
    //   default:
    //     content = value;
    // }

    // check if date has been converted to string
    // if (typeof content === "string") {
    //   content = content;
    // }

    // console.log(file);

    return (
      <TableCell
        sx={{
          fontSize: theme.typography.h6,
          paddingY: 0.2,
          //   borderRight: "1px solid rgba(224, 224, 224, 1)", // Add border line between columns
          // borderRight: 1,
          ...(key === "staff_code" && {
            width: fileNameColumnWidth, // Adjust width as needed
          }),
        }}
        key={key}
        align={align}
      >
        {content}
      </TableCell>
    );
  };

  // file click handler to pass on parent component

  const handleFileClick = () => {
    onFileClick(file.key, file.type); // Call the passed function with the file's key
  };

  return (
    <TableRow
      hover
      role="checkbox"
      aria-checked={selected}
      tabIndex={-1}
      key={file.key}
      selected={selected}
      sx={{
        // "& th": { border: 1 },
        "& td": {
          bgcolor: "background.paper",
          borderRadius: "0",
          padding: "0.8rem",
          // border: 0,
          fontWeight: "normal",
        },
        bgcolor: index % 2 ? "action.hover" : "background.default", // Alternate colors
      }}
    >
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          inputProps={{ "aria-labelledby": labelId }}
          onChange={() => onCheck(file.key)}
        />
      </TableCell>

      <TableCell align="left">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
              //   backgroundColor: "action.hover",
              fontWeight: "bold",
              textDecoration: "underline",
            },
          }}
          onClick={handleFileClick}
        >
          {{
            folder: (
              <FolderIcon
                color="warning"
                sx={{ marginRight: "8px", width: "35px", height: "100%" }}
              />
            ),
            image: (
              <ImageIcon
                color="success"
                sx={{ marginRight: "8px", width: "35px", height: "100%" }}
              />
            ),
            pdf: (
              <PictureAsPdfIcon
                color="error"
                sx={{ marginRight: "8px", width: "35px", height: "100%" }}
              />
            ),
            document: (
              <DescriptionIcon
                color="info"
                sx={{ marginRight: "8px", width: "35px", height: "100%" }}
              />
            ),
            spreadsheet: (
              <FileIcon
                color="primary"
                sx={{ marginRight: "8px", width: "35px", height: "100%" }}
              />
            ),
            text: (
              <FileIcon
                color="primary"
                sx={{ marginRight: "8px", width: "35px", height: "100%" }}
              />
            ),
            // Add more cases as needed for each file type
            // Use InsertDriveFileIcon as a fallback for unknown file types
          }[file.type] || (
            <InsertDriveFileIcon
              color="action"
              sx={{ marginRight: "8px", width: "35px", height: "100%" }}
            />
          )}
          <span>{truncateText(file.name, 50)}</span>
        </Box>
      </TableCell>

      <TableCell align="right">
        <IconButton
          id="user-row-menu-button"
          aria-label="user actions"
          aria-controls="user-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? "true" : "false"}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="user-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="user-row-menu-button"
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
          {/* <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>{" "}
            {t("common.edit")}
          </MenuItem> */}
          {/* {isFile(file.name) && ( */}
          <MenuItem onClick={handleDownload}>
            <ListItemIcon>
              <DownloadIcon />
            </ListItemIcon>{" "}
            {t("archive.actions.download")}
          </MenuItem>
          {!file.key.includes("uploads/staff/") && (
            <MenuItem onClick={handleRename}>
              <ListItemIcon>
                <DriveFileRenameOutlineIcon />
              </ListItemIcon>{" "}
              {t("archive.actions.rename")}
            </MenuItem>
          )}
          {/* )} */}
          {/* // to be added later */}
          {/* <MenuItem onClick={handleMove}>
            <ListItemIcon>
              <DriveFileMoveIcon />
            </ListItemIcon>{" "}
            {t("archive.actions.move")}
          </MenuItem> */}
          {!file.key.includes("uploads/staff/") && (
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              {t("common.delete")}{" "}
            </MenuItem>
          )}
        </Menu>
      </TableCell>
      <TableCell align="right">
        {fileTypeConversion(file.type, i18n.language == "en" ? "en" : "ja")}
      </TableCell>
      <TableCell align="right">
        {file.size === 0 ? "" : formatBytes(file.size)}
      </TableCell>
      <TableCell align="right">
        {formatLastModified(
          file.lastModified,
          i18n.language == "en" ? "en" : "ja"
        )}
      </TableCell>
      <TableCell align="right">
        {formatLastModifiedby(
          file.type,
          file.lastModifiedBy,
          i18n.language == "en" ? "en" : "ja"
        )}
      </TableCell>
    </TableRow>
  );
};

const MemoizedArchiveRow = React.memo(ArchiveRow);

type ArchiveTableProps = {
  processing: boolean;
  onDelete: (keys: string[]) => void;
  onEdit?: (file: ArchiveFile) => void;
  onMove: (file: ArchiveFile) => void;
  onDownload: (file: ArchiveFile) => void;
  onRenameObject: (fileKey: string, fileType: string) => void;
  onSelectedChange: (selected: string[]) => void;
  onFileClick: (fileKey: string, fileType: string) => void; // Add this line
  selected: string[];
  files: ArchiveFile[];
};

const ArchiveTable = ({
  processing,
  onDelete,
  onEdit,
  onMove,
  onDownload,
  onRenameObject,
  onSelectedChange,
  onFileClick,
  selected,
  files,
}: ArchiveTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(files.length || 10);
  const { t } = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    // Adjust rowsPerPage based on files length
    setRowsPerPage(files.length || 10);
    setPage(0); // Optionally reset page to the first if files array changes

    // You can also add any logic here that should run when `files` or `selected` changes
    // For example, logging the change, or performing validation, etc.
    // console.log("Files or selected state changed");
  }, [files, selected]); // Dependency array, effect runs when `files` or `selected` changes

  //   console.log(files);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = files.map((file) => file.key);
      onSelectedChange(newSelecteds);
      return;
    }
    onSelectedChange([]);
  };

  const handleClick = (key: string) => {
    const newSelected = selectUtils.selectOne(selected, key);
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

  const isSelected = (key: string) => selected.indexOf(key) !== -1;

  if (!files.length) {
    return <Empty title={t("archive.table.empty")} />;
  }

  return (
    <React.Fragment>
      <TableContainer
        sx={{
          borderRadius: "12px",
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={
            {
              // minWidth: 800,
              // borderCollapse: "separate",
              // borderSpacing: "0 1rem",
            }
          }
        >
          <EnhancedTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={files.length}
          />
          {!processing && (
            <TableBody>
              {files
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((file, index) => (
                  <MemoizedArchiveRow
                    index={index}
                    key={file.key}
                    onCheck={handleClick}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onMove={onMove}
                    onDownload={onDownload}
                    onRenameObject={onRenameObject}
                    onFileClick={onFileClick}
                    processing={processing}
                    selected={isSelected(file.key)}
                    file={file}
                  />
                ))}
            </TableBody>
          )}
        </Table>
        {/* <TablePagination
          rowsPerPageOptions={[files.length, 10, 25]}
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
          component="div"
          count={files.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
        {/* display a total of files inside here */}
        <Typography
          sx={{
            padding: "1rem",
            fontWeight: "bold",
            fontSize: theme.typography.h6,
            textAlign: "center",
            display: "flex",
            justifyContent: "flex-end",
            // backgroundColor: "#f8f8f8",
            bgcolor: theme.palette.background.paper,
          }}
        >
          {t("archive.totalFiles", { count: files.length })}
        </Typography>
      </TableContainer>
    </React.Fragment>
  );
};

export default ArchiveTable;
