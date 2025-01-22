import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { TableOptions, RowData } from "@tanstack/table-core";
import { CompanyParking } from "../types/companyInfo";
import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import i18n from "../../core/config/i18n";

type CompanyParkingTableProps = {
  processing: boolean;
  onDelete: (cpIds: string[]) => void;
  onEdit: (cp: CompanyParking) => void;
  onSelectedChange: (selected: string[]) => void;
  selected: string[];
  companyParkingList: CompanyParking[];
};

const CompanyParkingTable = ({
  processing,
  onDelete,
  onEdit,
  onSelectedChange,
  selected,
  companyParkingList,
}: CompanyParkingTableProps) => {
  const { t } = useTranslation();

  const columns = React.useMemo<ColumnDef<CompanyParking>[]>(
    () => [
      {
        id: "select-col",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        accessorKey: "parking_name",
        header: t("companyParking.table.headers.parking_name"),
        enableResizing: true,
      },
      {
        accessorKey: "parking_number",
        header: t("companyParking.table.headers.parking_number"),
        enableResizing: true,
      },
      {
        accessorKey: "parking_postal_code",
        header: t("companyParking.table.headers.parking_postal_code"),
        enableResizing: true,
      },
      {
        accessorKey: "parking_address",
        header: t("companyParking.table.headers.parking_address"),
        enableResizing: true,
      },
      {
        accessorKey: "management_company",
        header: t("companyParking.table.headers.management_company"),
        enableResizing: true,
      },
      {
        id: "actions",
        header: t("companyHousing.table.headers.actions"),
        cell: ({ row }) => (
          <Stack
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
            spacing={1}
            direction="row"
          >
            <Button
              onClick={() => {
                onEdit(row.original);
              }}
              color="info"
              sx={{
                color: "#fff",
                paddingX: "1.2rem",
                paddingY: "0.8rem",
                borderRadius: "0.2rem",
              }}
              variant="contained"
              size="small"
              startIcon={<EditIcon />}
            >
              {t("common.view")}・{t("common.edit")}
            </Button>
            <Button
              onClick={() => {
                onDelete([row.original.id]);
              }}
              sx={{
                paddingX: "1.2rem",
                paddingY: "0.8rem",
                borderRadius: "0.2rem",
              }}
              color="warning"
              variant="contained"
              size="small"
              startIcon={<DeleteIcon />}
            >
              {t("common.delete")}
            </Button>
          </Stack>
        ),
      },
    ],
    [t, onDelete, onEdit]
  );

  const table = useReactTable({
    columns,
    data: companyParkingList,
    state: {
      rowSelection: selected.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as Record<string, boolean>),
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      const newRowSelection =
        typeof updater === "function"
          ? updater(table.getState().rowSelection)
          : updater;

      const selectedIds = Object.entries(newRowSelection)
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      onSelectedChange(selectedIds);
    },
    getCoreRowModel: getCoreRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <React.Fragment>
      <TableContainer>
        <Table
          aria-labelledby="tableCompanyParking"
          sx={{
            minWidth: 600,
            borderCollapse: "separate",
            borderSpacing: "0 0.5rem",
          }}
        >
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                sx={{
                  "& td": {
                    bgcolor: "background.paper",
                    border: 0,
                    padding: 1,
                    paddingY: 1.5,
                  },
                }}
              >
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {!header.isPlaceholder && (
                      <div
                        style={{
                          cursor: header.column.getCanSort()
                            ? "pointer"
                            : "default",
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {/* {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null} */}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody
            sx={{
              "& td": {
                bgcolor: "background.paper",
                border: 0,
                padding: 1,
                paddingY: 1.5,
                borderRadius: "0.2rem",
              },
            }}
          >
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default CompanyParkingTable;
