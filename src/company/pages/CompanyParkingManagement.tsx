import React, { useState } from "react";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useTranslation } from "react-i18next";
import { CompanyHousing } from "../types/companyInfo";
import { useGetCompanyHousing } from "../hooks/useGetCompanyHousing";
import { useAddCompanyHousing } from "../hooks/useAddCompanyHousing";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import CompanyHousingTable from "../components/CompanyHousingTable";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SelectToolbar from "../../core/components/SelectToolbar";
import CompanyHousingDialog from "../components/CompanyHousingDialog";
import { useGetCompanyParking } from "../hooks/useGetCompanyParking";
import { useAddCompanyParking } from "../hooks/useAddCompanyParking";
import useUpdateCompanyParking from "../hooks/useUpdateCompanyParking";
import { useDeleteCompanyParking } from "../hooks/useDeleteCompanyParking";
import CompanyParkingDialog from "../components/CompanyParkingDialog";
import CompanyParkingTable from "../components/CompanyParkingTable";
// import { useUpdateCompanyHousing } from "../hooks/useUpdateCompanyHousing";
// import { useDeleteCompanyHousing } from "../hooks/useDeleteCompanyHousing";

const CompanyParkingManagement = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openCPDialog, setOpenCPDialog] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [CPDeleted, setCPDeleted] = useState<string[]>([]);
  const [CPUpdated, setCPUpdated] = useState<CompanyHousing | undefined>(
    undefined
  );

  const { data } = useGetCompanyParking();
  const { addCompanyParking, isAdding } = useAddCompanyParking();
  const { updateCompanyParking, isUpdating } = useUpdateCompanyParking();
  const { deleteCompanyParking, isDeleting } = useDeleteCompanyParking();

  const processing = isAdding || isUpdating || isDeleting;

  const handleAddCompanyParking = async (
    companyParking: Partial<CompanyHousing>
  ) => {
    addCompanyParking(companyParking as CompanyHousing)
      .then(() => {
        snackbar.success(
          t("companyParking.notifications.addSuccess", {
            companyParking: `${companyParking.property_name}`,
          })
        );
        setOpenCPDialog(false);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleUpdateCompanyParking = async (
    companyParking: Partial<CompanyHousing>
  ) => {
    console.log(companyParking);
    updateCompanyParking(companyParking as CompanyHousing)
      .then(() => {
        snackbar.success(
          t("companyParking.notifications.updateSuccess", {
            companyParking: `${companyParking.property_name}`,
          })
        );
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleDeleteCP = async () => {
    // console.log(CPDeleted);
    deleteCompanyParking(CPDeleted)
      .then(() => {
        snackbar.success(
          t("companyParking.notifications.deleteSuccess", {
            companyParking: `${CPDeleted}`,
          })
        );
        setOpenConfirmDeleteDialog(false);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleCancelSelected = () => {
    setSelected([]);
  };

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
  };

  const handleCloseCPDialog = () => {
    setCPUpdated(undefined);
    setOpenCPDialog(false);
  };

  const handleOpenConfirmDeleteDialog = (cpIds: string[]) => {
    setCPDeleted(cpIds);
    setOpenConfirmDeleteDialog(true);
  };

  const handleOpenCPDialog = (cp?: CompanyHousing) => {
    setCPUpdated(cp);
    setOpenCPDialog(true);
  };

  const handleSelectedChange = (selected: string[]) => {
    setSelected(selected);
  };

  return (
    <React.Fragment>
      <AdminAppBar>
        {!selected.length ? (
          <AdminToolbar title={t("companyParking.toolbar.title")}>
            <Fab
              aria-label="logout"
              color="primary"
              disabled={processing}
              onClick={() => handleOpenCPDialog()}
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

      <ConfirmDialog
        description={t("companyParking.confirmations.delete")}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteCP}
        open={openConfirmDeleteDialog}
        title={t("common.confirmation")}
      />

      <CompanyParkingTable
        processing={processing}
        onDelete={handleOpenConfirmDeleteDialog}
        onEdit={handleOpenCPDialog}
        onSelectedChange={handleSelectedChange}
        selected={selected}
        companyParkingList={data || []}
        // companyHousingList={[] as CompanyHousing[]}
      />

      {openCPDialog && (
        <CompanyParkingDialog
          open={openCPDialog}
          onClose={handleCloseCPDialog}
          onAdd={handleAddCompanyParking}
          onUpdate={handleUpdateCompanyParking}
          cp={CPUpdated}
          processing={processing}
        />
      )}
    </React.Fragment>
  );
};

export default CompanyParkingManagement;
