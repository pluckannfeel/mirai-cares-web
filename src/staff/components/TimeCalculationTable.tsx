import {
  // Avatar,
  // Box,
  // Checkbox,
  // Chip,
  // IconButton,
  // ListItemIcon,
  // Menu,
  // MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  // Typography,
  // styled,
  useTheme,
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
import { StaffTimeRecord } from "../types/calculations";
import i18n from "../../core/config/i18n";

interface HeadCell {
  id: string;
  label: string;
  align: "center" | "left" | "right";
}

const staffNameColumnWidth = "10%";
const nationalityColumnWidth = "5%";
const staffCodeColumnWidth = "5%";

const headCells: HeadCell[] = [
  {
    id: "staff_code",
    align: "left",
    label: "salaryCalculation.table.headers.staff_code",
  },
  {
    id: "staff_name",
    align: "left",
    label: "salaryCalculation.table.headers.staff_name",
  },
  {
    id: "nationality",
    align: "left",
    label: "salaryCalculation.table.headers.nationality",
  },
  {
    id: "total_hours",
    align: "right",
    label: "salaryCalculation.table.headers.total_hours",
  },
  {
    id: "total_night_hours",
    align: "right",
    label: "salaryCalculation.table.headers.total_night_hours",
  },
  {
    id: "total_holiday_hours",
    align: "right",
    label: "salaryCalculation.table.headers.total_holiday_hours",
  },
  // moved to combined list
  //   {
  //     id: "group_home_hours",
  //     align: "left",
  //     label: "salaryCalculation.table.headers.group_home_hours",
  //   },
  //   {
  //     id: "group_home_stays",
  //     align: "left",
  //     label: "salaryCalculation.table.headers.group_home_stays",
  //   },
];

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  timeRecords: StaffTimeRecord[];
}

function EnhancedTableHead({
  onSelectAllClick,
  numSelected,
  rowCount,
  timeRecords,
}: EnhancedTableProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const uniqueDynamicKeys = new Set<string>();

  const staffTimeRecords = timeRecords.forEach((record) => {
    // Iterate over each property in the record
    Object.keys(record).forEach((key) => {
      // Check if the key is one of the dynamic properties
      if (
        ![
          "staff",
          "staff_code",
          "nationality",
          "total_work_hours",
          "night_work_hours",
          "holiday_work_hours",
          "group_home",
          "group_home_stays",
        ].includes(key)
      ) {
        uniqueDynamicKeys.add(key);
      }
    });
  });

  const dynamicHeadCells: HeadCell[] = Array.from(uniqueDynamicKeys).map(
    (key) => ({
      id: key,
      align: "right", // Adjust alignment as needed
      // Conditional check to replace "nan" with "研修408"
      label: key === "nan" ? "研修408" : key,
    })
  );

  const combinedHeadCells: HeadCell[] = [
    ...headCells, // Your static headCells
    ...dynamicHeadCells, // Dynamically generated headCells
    {
      id: "group_home_hours",
      align: "right",
      label: "salaryCalculation.table.headers.group_home_hours",
    },
    {
      id: "group_home_stays",
      align: "right",
      label: "salaryCalculation.table.headers.group_home_stays",
    },
  ];

  return (
    <TableHead>
      <TableRow
        sx={{ "& th": { borderRight: "1px solid rgba(224, 224, 224, 1)" } }}
      >
        {/* <TableCell sx={{ py: 0 }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all users",
            }}
          />
        </TableCell> */}
        {combinedHeadCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            sx={{
              // Bold font weight for header titles
              backgroundColor: theme.palette.background.paper, // A neutral grey background Dark grey color for text for better contrast
              fontSize: "0.950rem", // Standard font size for headers
              padding: "8px 12px", // Standard padding, can be adjusted
              whiteSpace: "nowrap", // Prevent wrapping
              overflow: "hidden", // Hide overflow
              textOverflow: "ellipsis", // Add ellipsis for overflow text
              ...(headCell.id === "staff_code" && {
                width: staffCodeColumnWidth,
              }),
              ...(headCell.id === "staff_name" && {
                width: staffNameColumnWidth,
              }),
              ...(headCell.id === "nationality" && {
                width: nationalityColumnWidth,
              }),
            }}
          >
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

type TimeCalculationRowProps = {
  index: number;
  timeRecord: StaffTimeRecord;
  onCheck: (staff_code: string) => void;
  onDelete: (staff_codes: string[]) => void;
  onEdit: (staff_code: string) => void;
  processing: boolean;
  selected: boolean;
};

interface CellConfig {
  label: string | number;
  align: "center" | "left" | "right" | "inherit" | "justify";
}

interface StaticCellConfig {
  [key: string]: CellConfig; // Index signature
}

const TimeCalculationRow = ({
  index,
  timeRecord,
  onCheck,
  onDelete,
  onEdit,
  processing,
  selected,
}: TimeCalculationRowProps) => {
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
    onDelete([timeRecord.staff_code]);
  };

  const handleEdit = () => {
    handleCloseActions();
    onEdit(timeRecord.staff_code);
  };

  const staticCellConfig: StaticCellConfig = {
    staff_code: {
      label: timeRecord.staff,
      align: "left",
    },
    staff: {
      label: timeRecord.staff_code,
      align: "left",
    },
    nationality: {
      label: timeRecord.nationality,
      align: "left",
    },
    total_work_hours: {
      label: timeRecord.total_work_hours,
      align: "right",
    },
    night_work_hours: {
      label: timeRecord.night_work_hours,
      align: "right",
    },
    holiday_work_hours: {
      label: timeRecord.holiday_work_hours,
      align: "right",
    },
    group_home: {
      label: timeRecord.group_home,
      align: "right",
    },
    group_home_stays: {
      label: timeRecord.group_home_stays,
      align: "right",
    },
  };

  // Extract the static properties you want to display last
  const lastStaticProps = ["group_home", "group_home_stays"];

  // Function to render TableCell, now without the need for isStatic parameter
  const renderCell = (
    key: string,
    cellValue: any,
    align: "center" | "left" | "right" | "inherit" | "justify" = "left",
    isStatic: boolean = false
  ) => {
    let content;
    // if (key === "staff" || key === "staff_code") {
    //   content = (
    //     <Typography sx={{ fontWeight: "bold", fontSize: theme.typography.h6 }}>{cellValue}</Typography>
    //   );
    // }
    if (typeof cellValue === "number") {
      if (Number.isInteger(cellValue)) {
        content = cellValue.toString(); // No decimal part, display as an integer
      } else {
        content = cellValue.toFixed(2); // Has a decimal part, format to one decimal place
      }

      if (cellValue === 0) {
        content = "-";
      }
    } else if (
      cellValue === undefined ||
      cellValue === null ||
      cellValue === ""
    ) {
      content = "-";
    } else {
      content = cellValue;
    }

    return (
      <TableCell
        // sx={{ fontSize: theme.typography.h6, paddingY: 0.2 }}
        sx={{
          fontSize: theme.typography.h6,
          paddingY: 0.2,
          borderRight: "1px solid rgba(224, 224, 224, 1)", // Add border line between columns
          // borderRight: 1,
          ...(key === "staff_code" && {
            width: staffCodeColumnWidth, // Adjust width as needed
          }),
          ...(key === "staff" && {
            width: staffNameColumnWidth, // Adjust width as needed
          }),
          ...(key === "nationality" && {
            width: nationalityColumnWidth, // Adjust width as needed
          }),
        }}
        key={key}
        align={align}
      >
        {content}
      </TableCell>
    );
  };

  // Filter keys to separate static keys (excluding lastStaticProps) and dynamic keys
  const dynamicKeys = Object.keys(timeRecord).filter(
    (key) => !Object.keys(staticCellConfig).includes(key)
  );
  const staticKeysExcludingLast = Object.keys(staticCellConfig).filter(
    (key) => !lastStaticProps.includes(key)
  );
  return (
    <TableRow
      aria-checked={selected}
      tabIndex={-1}
      key={timeRecord.staff_code}
      selected={selected}
      //   sx={{ "& td": { bgcolor: "background.paper", border: 0 } }}
      // sx={{
      //   // fontSize: "0.300rem",
      //   "& td": { bgcolor: "background.paper", border: 0 },
      //   bgcolor: index % 2 ? "action.hover" : "background.default", // Alternate colors
      // }}
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
      {/* Render static cells first (excluding lastStaticProps) */}
      {staticKeysExcludingLast.map((key) =>
        renderCell(key, timeRecord[key], staticCellConfig[key].align, true)
      )}

      {/* Then render dynamic cells */}
      {dynamicKeys.map((key) => renderCell(key, timeRecord[key], "right"))}

      {/* Now render lastStaticProps */}
      {lastStaticProps.map((key) =>
        renderCell(
          key,
          timeRecord[key],
          staticCellConfig[key]?.align || "right",
          true
        )
      )}
    </TableRow>
  );
};

type TimeCalculationTableProps = {
  processing: boolean;
  onDelete: (staff_codes: string[]) => void;
  onEdit: (staff_code: string) => void;
  onSelectedChange: (selected: string[]) => void;
  selected: string[];
  timeRecords: StaffTimeRecord[];
};

const TimeCalculationTable = ({
  processing,
  onDelete,
  onEdit,
  onSelectedChange,
  selected,
  timeRecords,
}: TimeCalculationTableProps) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  //   const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowsPerPage, setRowsPerPage] = useState(timeRecords.length);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(timeRecords);
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

  if (timeRecords.length === 0) {
    return <Empty title="No time sheet yet" />;
  }

  return (
    <React.Fragment>
      <TableContainer
        sx={{
          borderRadius: "12px",
        }}
      >
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
            rowCount={timeRecords.length}
            timeRecords={timeRecords}
          />

          <TableBody>
            {timeRecords
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((timeRecord, index) => (
                <TimeCalculationRow
                  index={index}
                  key={timeRecord.staff_code}
                  onCheck={handleClick}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  processing={processing}
                  selected={isSelected(timeRecord.staff_code)}
                  timeRecord={timeRecord}
                />
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, timeRecords.length]}
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
          count={timeRecords.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </React.Fragment>
  );
};

export default TimeCalculationTable;
