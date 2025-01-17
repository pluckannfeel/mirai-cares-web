/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { TableOptions, RowData } from "@tanstack/table-core";
import { CompanyHousing } from "../types/companyInfo";
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

const mockData: CompanyHousing[] = [
  {
    id: "1",
    property_name: "property_name",
    address: "address",
    postal_code: "2",
    room_number: "room_number",
    house_name: "house_name",
    management_company: "management_company",
    management_company_contact: "management_company_contact",
    intermediary: "intermediary",
    person_in_charge: "person_in_charge",
    person_in_charge_contact: "person_in_charge_contact",
    electric_company: "electric_company",
    electric_company_contact: "electric_company_contact",
    gas_company: "gas_company",
    gas_company_contact: "gas_company_contact",
    water_company: "water_company",
    water_company_contact: "water_company_contact",
    internet_company: "internet_company",
    internet_company_contact: "internet_company_contact",
    remarks: "remarks",
  },
  {
    id: "2",
    property_name: "test",
    address: "test",
    postal_code: "1",
    room_number: "test",
    house_name: "test",
    management_company: "test",
    management_company_contact: "test",
    intermediary: "test",
    person_in_charge: "test",
    person_in_charge_contact: "test",
    electric_company: "test",
    electric_company_contact: "test",
    gas_company: "test",
    gas_company_contact: "test",
    water_company: "test",
    water_company_contact: "test",
    internet_company: "test",
    internet_company_contact: "test",
    remarks: "test",
  },
];

type CompanyHousingTableProps = {
  processing: boolean;
  onDelete: (chIds: string[]) => void;
  onEdit: (ch: CompanyHousing) => void;
  onSelectedChange: (selected: string[]) => void;
  selected: string[];
  companyHousingList: CompanyHousing[];
};

const CompanyHousingTable = ({
  processing,
  onDelete,
  onEdit,
  onSelectedChange,
  selected,
  companyHousingList,
}: CompanyHousingTableProps) => {

  const { t } = useTranslation();

  const columns = React.useMemo<ColumnDef<CompanyHousing>[]>(
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
        accessorKey: "property_name",
        header: t("companyHousing.table.headers.property_name"),
        enableResizing: true,
      },
      {
        accessorKey: "address",
        header: t("companyHousing.table.headers.address"),
        enableResizing: true,
      },
      {
        accessorKey: "postal_code",
        header: t("companyHousing.table.headers.postal_code"),
        enableResizing: true,
      },
      {
        accessorKey: "house_name",
        header: t("companyHousing.table.headers.house_name"),
        enableResizing: true,
      },
      {
        accessorKey: "room_number",
        header: t("companyHousing.table.headers.room_number"),
        enableResizing: true,
      },
      {
        accessorKey: "management_company",
        header: t("companyHousing.table.headers.management_company"),
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
    data: companyHousingList,
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
          aria-labelledby="tableCompanyHousing"
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

export default CompanyHousingTable;
