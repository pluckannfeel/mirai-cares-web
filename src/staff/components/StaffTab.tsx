import React, { useState } from "react";
import { useStaff } from "../hooks/useStaff";
import { useAuth } from "../../auth/contexts/AuthProvider";
import StaffTable from "./StaffTable";
import VirtualizedStaffTable from "./VirtualizedStaffTable";
import { Licenses, Staff } from "../types/staff";
import { Button, DialogProps, Fab } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import StaffDialog from "./StaffDialog";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";

import SelectToolbar from "../../core/components/SelectToolbar";
import { useTranslation } from "react-i18next";
import { useAddStaff } from "../hooks/useAddStaff";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useUpdateStaff } from "../hooks/useUpdateStaff";
import { processLicenses } from "../../helpers/fileHelper";
import { baseUrl } from "../../api/server";
import { useStaffCompanyContract } from "../hooks/useStaffContract";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import { useDeleteStaff } from "../hooks/useDeleteStaff";

const StaffTab = () => {
  // get email from useauth
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const { userInfo } = useAuth();

  const { data } = useStaff(userInfo?.email, "staff");

  // console.log(data)

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openStaffDialog, setOpenStaffDialog] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [staffDeleted, setStaffDeleted] = useState<string[]>([]);
  const [staffUpdated, setStaffUpdated] = useState<Staff | undefined>(
    undefined
  );

  const { isAdding, addStaff } = useAddStaff();
  const { isUpdating, updateStaff } = useUpdateStaff();
  const { isDeleting, deleteStaff } = useDeleteStaff();

  // useEffect(() => {
  //   // This code will run when the component is mounted
  //   // refetch();
  //   return () => {
  //     // This code will run when the component is unmounted
  //     // console.log("Component is unmounted!");
  //   };
  // }, [refetch]); // Empty dependency array means it only runs once on mount and cleans up on unmount

  // eslint-disable-next-line
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");

  // const { setSelectedStaff } =
  //   useSelectedStaff();

  const processing = isAdding || isDeleting || isUpdating;

  const handleOpenConfirmDeleteDialog = (staffIds: string[]) => {
    setStaffDeleted(staffIds);
    setOpenConfirmDeleteDialog(true);
  };

  //download csv
  const downloadCsv = async () => {
    try {
      const response = await fetch(`${baseUrl}/staff/download`);
      console.log("download csv");
      const blob = await response.blob();

      // Create a hidden <a> element
      const link = document.createElement("a");
      link.style.display = "none";
      document.body.appendChild(link);

      // Set the <a> element's attributes
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", "staff.xlsx"); // Specify the file name

      // Simulate a click on the <a> element to trigger the download
      link.click();

      // Cleanup by removing the <a> element
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  const handleOpenStaffDialog = (staff?: Staff) => {
    // console.log("true")
    setStaffUpdated(staff);
    // setOpenEmpDialog(true);
    setOpenStaffDialog(true);

    setScroll("paper");
  };

  // generate contract
  const { fetchStaffContract } = useStaffCompanyContract();

  const handleGenerateContract = async (staff: Staff) => {
    // setStaffUpdated(staff);
    // setOpenEmpDialog(true);
    // console.log(staff.id);
    // download file using window.open
    // window.open(`${baseUrl}staff/generate/?staff_id=${staff.id}`, "_blank");
    const staffContractData = await fetchStaffContract(staff.id);
    window.open(staffContractData, "_blank");
  };

  const handleSelectedChange = (newSelected: string[]) => {
    setSelected(newSelected);
  };

  // for staff dialog
  const handleAddStaff = async (
    staff: Partial<Staff>,
    imageFile: File | null,
    licenses: Licenses[] | []
  ) => {
    addStaff({
      ...staff,
      user_id: userInfo?.id,
      img_url: imageFile,
      licenses,
    } as Staff)
      .then((staff: Staff) => {
        snackbar.success(
          t("staffManagement.notifications.addSuccess", {
            staff: `${staff?.japanese_name}`,
          })
        );
        // setOpenEmpDialog(false);
        // setSelectedEmployeeDialog(false);
        setOpenStaffDialog(false);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });

    // setOpenConfirmDeleteDialog(false);
  };

  const handleUpdateStaff = async (
    staff: Partial<Staff>,
    imageFile: File | null,
    id: string,
    licenses: Licenses[]
  ) => {
    // please take only the files that are url and convert them to file
    // licenses are urls of license so we will convert them to file
    const licensesFiles = await processLicenses(licenses);
    // console.log(licensesFiles);
    updateStaff({
      ...staff,
      id,
      img_url: imageFile,
      licenses: licensesFiles,
    } as Staff)
      .then((staff: Staff) => {
        snackbar.success(
          t("staffManagement.notifications.updateSuccess", {
            employee: `${staff?.japanese_name}`,
          })
        );
        setOpenStaffDialog(false);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleDeleteStaff = async () => {
    deleteStaff(staffDeleted)
      .then(() => {
        snackbar.success(t("staffManagement.notifications.deleteSuccess"));
        setSelected([]);
        setStaffDeleted([]);
        setOpenConfirmDeleteDialog(false);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleCloseStaffDialog = () => {
    // clear all employee selection
    setStaffUpdated(undefined);
    // setSelectedStaff(null);
    // setOpenEmpDialog(false);
    setOpenStaffDialog(false);
  };

  const handleCancelSelected = () => {
    setSelected([]);
  };

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
  };

  return (
    <React.Fragment>
      <AdminAppBar>
        {!selected.length ? (
          <AdminToolbar title={t("staffManagement.toolbar.title")}>
            <Button
              sx={{
                marginRight: 1,
                padding: 1.2,
              }}
              // aria-label="logout"
              variant="contained"
              color="primary"
              disabled={processing}
              onClick={() => downloadCsv()}
              size="medium"
              // startIcon={<DownloadOutlinedIcon />}
            >
              {t("common.download")}
            </Button>
            <Fab
              aria-label="add-staff"
              color="primary"
              disabled={processing}
              onClick={() => handleOpenStaffDialog()}
              size="small"
            >
              <AddIcon />
            </Fab>
          </AdminToolbar>
        ) : (
          <SelectToolbar
            processing={processing}
            onCancel={handleCancelSelected}
            onDelete={handleOpenConfirmDeleteDialog}
            selected={selected}
          />
        )}
      </AdminAppBar>
      <StaffTable
        processing={processing}
        onDelete={handleOpenConfirmDeleteDialog}
        onEdit={handleOpenStaffDialog}
        onGenerateContract={handleGenerateContract}
        onSelectedChange={handleSelectedChange}
        selected={selected}
        staffs={data}
      />
      {/* <VirtualizedStaffTable
        processing={processing}
        onDelete={handleOpenConfirmDeleteDialog}
        onEdit={handleOpenStaffDialog}
        onGenerateContract={handleGenerateContract}
        onSelectedChange={handleSelectedChange}
        selected={selected}
        staffs={data}
      /> */}
      <ConfirmDialog
        description={t("staffManagement.confirmations.delete")}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteStaff}
        open={openConfirmDeleteDialog}
        title={t("common.confirmation")}
      />
      {openStaffDialog && (
        <StaffDialog
          onAdd={handleAddStaff}
          onClose={handleCloseStaffDialog}
          onUpdate={handleUpdateStaff}
          staff={staffUpdated}
          processing={processing}
          open={openStaffDialog}
        />
      )}
    </React.Fragment>
  );
};

export default StaffTab;
