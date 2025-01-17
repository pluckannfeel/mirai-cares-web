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
import { useUpdateCompanyHousing } from "../hooks/useUpdateCompanyHousing";
import { useDeleteCompanyHousing } from "../hooks/useDeleteCompanyHousing";

const CompanyHousingManagement = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openCHDialog, setOpenCHDialog] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [CHDeleted, setCHDeleted] = useState<string[]>([]);
  const [CHUpdated, setCHUpdated] = useState<CompanyHousing | undefined>(
    undefined
  );

  const { data } = useGetCompanyHousing();
  const { addCompanyHousing, isAdding } = useAddCompanyHousing();
  const { updateCompanyHousing, isUpdating } = useUpdateCompanyHousing();
  const { deleteCompanyHousing, isDeleting } = useDeleteCompanyHousing();

  const processing = isAdding || isUpdating || isDeleting;

  const handleAddCompanyHousing = async (
    companyHousing: Partial<CompanyHousing>
  ) => {
    addCompanyHousing(companyHousing as CompanyHousing)
      .then(() => {
        snackbar.success(
          t("companyHousing.notifications.addSuccess", {
            companyHousing: `${companyHousing.property_name}`,
          })
        );
        setOpenCHDialog(false);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleUpdateCompanyHousing = async (
    companyHousing: Partial<CompanyHousing>
  ) => {
    console.log(companyHousing);
    updateCompanyHousing(companyHousing as CompanyHousing)
      .then(() => {
        snackbar.success(
          t("companyHousing.notifications.updateSuccess", {
            companyHousing: `${companyHousing.property_name}`,
          })
        );
        setOpenCHDialog(false);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleDeleteCH = async () => {
    // console.log(CHDeleted);
    deleteCompanyHousing(CHDeleted)
      .then(() => {
        snackbar.success(
          t("companyHousing.notifications.deleteSuccess")
        );
        setSelected([]);
        setCHDeleted([]);
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

  const handleCloseCHDialog = () => {
    setCHUpdated(undefined);
    setOpenCHDialog(false);
  };

  const handleOpenConfirmDeleteDialog = (chIds: string[]) => {
    setCHDeleted(chIds);
    setOpenConfirmDeleteDialog(true);
  };

  const handleOpenCHDialog = (ch?: CompanyHousing) => {
    setCHUpdated(ch);
    setOpenCHDialog(true);
  };

  const handleSelectedChange = (selected: string[]) => {
    setSelected(selected);
  };

  return (
    <React.Fragment>
      <AdminAppBar>
        {!selected.length ? (
          <AdminToolbar title={t("companyHousing.toolbar.title")}>
            <Fab
              aria-label="logout"
              color="primary"
              disabled={processing}
              onClick={() => handleOpenCHDialog()}
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
      <CompanyHousingTable
        processing={processing}
        onDelete={handleOpenConfirmDeleteDialog}
        onEdit={handleOpenCHDialog}
        onSelectedChange={handleSelectedChange}
        selected={selected}
        companyHousingList={data || []}
        // companyHousingList={[] as CompanyHousing[]}
      />
      <ConfirmDialog
        description={t("userManagement.confirmations.delete")}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteCH}
        open={openConfirmDeleteDialog}
        title={t("common.confirmation")}
      />

      {openCHDialog && (
        <CompanyHousingDialog
          onClose={handleCloseCHDialog}
          onAdd={handleAddCompanyHousing}
          onUpdate={handleUpdateCompanyHousing}
          open={openCHDialog}
          processing={processing}
          ch={CHUpdated}
        />
      )}

      {/* {openUserDialog && (
    <UserDialog
      onAdd={handleAddUser}
      onClose={handleCloseUserDialog}
      onUpdate={handleUpdateUser}
      open={openUserDialog}
      processing={processing}
      user={userUpdated}
    />
  )} */}
    </React.Fragment>
  );
};

export default CompanyHousingManagement;
