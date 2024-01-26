import { Button, Fab } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import SelectToolbar from "../../core/components/SelectToolbar";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";

import { MedicalInstitution } from "../types/MedicalInstitution";
import MedicalInstitutionDialog from "../components/MedicalInstitutionDialog";
import MedicalInstitutionTable from "../components/MedicalInsitutionTable";
import { useInstitutions } from "../hooks/useInstitutions";
import { useAddInstitution } from "../hooks/useAddInstitution";
import { useUpdateInstitution } from "../hooks/useUpdateInstitution";
import { useDeleteInstitutions } from "../hooks/useDeleteInstitution";

const MedicalInsitutionManagement = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  // const { userInfo } = useAuth();

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openMIDialog, setOpenMIDialog] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [MIDeleted, setMIDeleted] = useState<string[]>([]);
  const [MIUpdated, setMIUpdated] = useState<MedicalInstitution | undefined>(
    undefined
  );

  const { data } = useInstitutions();

  const { isAdding, addInstitution } = useAddInstitution();
  const { isUpdating, updateInstitution } = useUpdateInstitution();
  const { isDeleting, deleteInstitutions } = useDeleteInstitutions();
  const processing = isAdding || isUpdating || isDeleting;

  // events

  const handleAddMedicalInstitution = async (
    insitution: Partial<MedicalInstitution>
  ) => {
    // console.log(insitution);

    addInstitution(insitution as MedicalInstitution)
      .then((insitution: MedicalInstitution) => {
        setOpenMIDialog(false);
        snackbar.success(
          t("medicalInstitutionManagement.notifications.addSuccess", {
            name: `${insitution?.medical_institution_name}`,
          })
        );
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const downloadCsv = async () => {
    // try {
    //   const response = await fetch(`${baseUrl}medical_instiutions/download`);
    //   const blob = await response.blob();
    //   // Create a hidden <a> element
    //   const link = document.createElement("a");
    //   link.style.display = "none";
    //   document.body.appendChild(link);
    //   // Set the <a> element's attributes
    //   link.href = window.URL.createObjectURL(blob);
    //   link.setAttribute("download", "利用者情報.xlsx"); // Specify the file name
    //   // Simulate a click on the <a> element to trigger the download
    //   link.click();
    //   // Cleanup by removing the <a> element
    //   document.body.removeChild(link);
    // } catch (error) {
    //   console.error("Error downloading CSV:", error);
    // }
  };

  const handleDeleteMedicalInstitutions = async () => {
    deleteInstitutions(MIDeleted)
      .then(() => {
        snackbar.success(
          t("medicalInstitutionManagement.notifications.deleteSuccess")
        );
        setSelected([]);
        setMIDeleted([]);
        setOpenConfirmDeleteDialog(false);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleUpdateMedicalInstitution = async (
    institution: Partial<MedicalInstitution>,
    institution_id: string
  ) => {
    updateInstitution({
      ...institution,
      id: institution_id,
    } as MedicalInstitution)
      .then((insitution: MedicalInstitution) => {
        setOpenMIDialog(false);
        snackbar.success(
          t("medicalInstitutionManagement.notifications.updateSuccess", {
            name: `${insitution?.medical_institution_name}`,
          })
        );
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });

    //   updatePatient({
    //     ...institution,
    //     id: institution_id,
    //   } as MedicalInstitution)
    //     .then((institution: MedicalInstitution) => {
    //       setOpenMIDialog(false);
    //       snackbar.success(
    //         t("patientManagement.notifications.updateSuccess", {
    //           institution: `${institution?.name_kanji}`,
    //         })
    //       );
    //     })
    //     .catch(() => {
    //       snackbar.error(t("common.errors.unexpected.subTitle"));
    //     });
  };

  const handleCancelSelected = () => {
    setSelected([]);
  };

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
  };

  const handleCloseMIDialog = () => {
    setMIUpdated(undefined);
    setOpenMIDialog(false);
  };

  const handleOpenConfirmDeleteDialog = (miIds: string[]) => {
    setMIDeleted(miIds);
    setOpenConfirmDeleteDialog(true);
  };

  const handleOpenMIDialog = (mi?: MedicalInstitution) => {
    setMIUpdated(mi);
    setOpenMIDialog(true);
  };

  const handleSelectedChange = (newSelected: string[]) => {
    setSelected(newSelected);
  };

  return (
    <React.Fragment>
      <AdminAppBar>
        {!selected.length ? (
          <AdminToolbar title={t("medicalInstitutionManagement.toolbar.title")}>
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
              aria-label="add-medical-institution"
              color="primary"
              disabled={processing}
              onClick={() => handleOpenMIDialog()}
              size="medium"
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

      <MedicalInstitutionTable
        processing={processing}
        onDelete={handleOpenConfirmDeleteDialog}
        onEdit={handleOpenMIDialog}
        onSelectedChange={handleSelectedChange}
        selected={selected}
        institutions={data}
      />

      <ConfirmDialog
        description={t("patientManagement.confirmations.delete")}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteMedicalInstitutions}
        open={openConfirmDeleteDialog}
        title={t("common.confirmation")}
      />

      {openMIDialog && (
        <MedicalInstitutionDialog
          onAdd={handleAddMedicalInstitution}
          onClose={handleCloseMIDialog}
          onUpdate={handleUpdateMedicalInstitution}
          open={openMIDialog}
          processing={processing}
          institution={MIUpdated}
        />
      )}
    </React.Fragment>
  );
};

export default MedicalInsitutionManagement;
