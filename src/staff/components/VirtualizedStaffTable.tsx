// Unfinished, some discrepancy.
import React, { useMemo, useState, useCallback, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  Row,
} from "@tanstack/react-table";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Article as ArticleIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Checkbox,
  Button,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
} from "@mui/material";
import { Staff } from "../types/staff";
import styles from "../styles/VirtualizedStaffTable.module.css";
import { useTranslation } from "react-i18next";

type StaffTableProps = {
  processing: boolean;
  onDelete: (staffIds: string[]) => void;
  onEdit: (staff: Staff) => void;
  onGenerateContract: (staff: Staff) => void;
  onSelectedChange: (staffIds: string[]) => void;
  selected: string[];
  staffs?: Staff[];
};

type StaffRowProps = {
  index: number;
  onCheck: (id: string) => void;
  onDelete: (staffIds: string[]) => void;
  onEdit: (staff: Staff) => void;
  onGenerateContract: (staff: Staff) => void;
  processing: boolean;
  selected: boolean;
  staff: Staff;
};

const StaffRow: React.FC<StaffRowProps> = ({
  index,
  onCheck,
  onDelete,
  onEdit,
  onGenerateContract,
  processing,
  selected,
  staff,
}) => {
  return (
    <tr>
      <td>
        <Checkbox
          checked={selected}
          onChange={() => onCheck(staff.id)}
          disabled={processing}
        />
      </td>
      <td>
        {staff.japanese_name}
        <br />
        {staff.english_name}
      </td>
      <td>
        {staff.staff_code} | {staff.affiliation}
      </td>
      <td>
        〒 {staff.postal_code}
        <br />
        {`${staff.prefecture}${staff.municipality}${staff.town}${staff.building}`}
      </td>
      <td>
        {staff.phone_number} <br /> {staff.work_email}
      </td>
      <td>{staff.zaishoku_joukyou}</td>
      {/* <td>
        <Button onClick={() => onEdit(staff)} disabled={processing}>
          Edit
        </Button>
        <Button onClick={() => onGenerateContract(staff)} disabled={processing}>
          Generate Contract
        </Button>
        <Button onClick={() => onDelete([staff.id])} disabled={processing}>
          Delete
        </Button>
      </td> */}
    </tr>
  );
};

interface RowActionsProps {
  staff: Staff;
  onCheck?: (id: string) => void;
  onDelete: (staffIds: string[]) => void;
  onEdit: (staff: Staff) => void;
  onGenerateContract: (staff: Staff) => void;
}

const RowActions: React.FC<RowActionsProps> = ({
  staff,
  onEdit,
  onDelete,
  onGenerateContract,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseActions = () => {
    setMenuAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleOpenActions}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseActions}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={() => onEdit(staff)}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          Edit
        </MenuItem>
        {/* <MenuItem onClick={() => onGenerateContract(staff)}>
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          Generate Contract
        </MenuItem> */}
        <MenuItem onClick={() => onDelete([staff.id])}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

export const VirtualizedStaffTable: React.FC<StaffTableProps> = ({
  staffs = [],
  selected,
  onSelectedChange,
  onEdit,
  onDelete,
  onGenerateContract,
  processing,
}) => {
  const { t } = useTranslation();

  const [sorting, setSorting] = useState<SortingState>([]);

  // State for managing menu opening
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [currentRowId, setCurrentRowId] = useState<string | null>(null);

  const openActions = Boolean(menuAnchorEl);

  const handleOpenActions = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: string
  ) => {
    setMenuAnchorEl(event.currentTarget); // Correctly set the anchor element
    setCurrentRowId(rowId); // Track which row the menu belongs to
  };

  const handleCloseActions = () => {
    setMenuAnchorEl(null); // Close the menu
    setCurrentRowId(null); // Reset row ID
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "checkbox",
        header: "Select",
        cell: ({ row }: { row: Row<Staff> }) => (
          <Checkbox
            checked={selected.includes(row.original.id)}
            onChange={() =>
              onSelectedChange(
                selected.includes(row.original.id)
                  ? selected.filter((id) => id !== row.original.id)
                  : [...selected, row.original.id]
              )
            }
            disabled={processing}
          />
        ),
      },
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }: { row: Row<Staff> }) => (
          <img
            src={row.original.img_url as string}
            alt={row.original.english_name}
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        ),
      },
      { accessorKey: "english_name", header: "English Name" },
      { accessorKey: "affiliation", header: "Affiliation" },
      {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }: { row: Row<Staff> }) => (
          <>
            〒 {row.original.postal_code}
            <br />
            {`${row.original.prefecture}${row.original.municipality}${row.original.town}${row.original.building}`}
          </>
        ),
      },
      {
        accessorKey: "contact",
        header: "Contact",
        cell: ({ row }: { row: Row<Staff> }) => (
          <>
            {row.original.phone_number}
            <br />
            {row.original.work_email}
          </>
        ),
      },
      {
        accessorKey: "employment_status",
        header: "Employment Status",
        cell: ({ row }: { row: Row<Staff> }) => (
          <>{row.original.zaishoku_joukyou}</>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }: { row: Row<Staff> }) => (
          <RowActions
            staff={row.original} // staff will have `id`, `english_name`, and other properties
            onEdit={onEdit}
            onGenerateContract={onGenerateContract}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [
      selected,
      onSelectedChange,
      processing,
      onEdit,
      onGenerateContract,
      onDelete,
    ]
  );

  const table = useReactTable({
    data: staffs,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Adjust according to your row heights
    overscan: 0,
  });

  const virtualRows = virtualizer.getVirtualItems();

  return (
    <div ref={parentRef}>
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={styles.cell}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {virtualRows.map((virtualRow) => {
            const row = table.getRowModel().rows[virtualRow.index];
            return (
              <tr
                key={row.id}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  willChange: "transform",
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={styles.cell}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VirtualizedStaffTable;
