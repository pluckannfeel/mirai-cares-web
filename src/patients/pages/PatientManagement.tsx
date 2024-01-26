import { Button, Fab } from "@mui/material";

import { Add as AddIcon } from "@mui/icons-material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import SelectToolbar from "../../core/components/SelectToolbar";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";

// hooks

// types
import { Patient } from "./../types/patient";
import PatientTable from "./../components/PatientTable";
import PatientDialog from "./../components/PatientDialog";
import { usePatients } from "./../hooks/usePatients";
import { useAddPatient } from "./../hooks/useAddPatient";
import { useAuth } from "../../auth/contexts/AuthProvider";
import { useUpdatePatient } from "./../hooks/useUpdatePatient";
import { baseUrl } from "../../api/server";
import { useDeletePatients } from "./../hooks/useDeletePatients";

const PatientManagement = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const { userInfo } = useAuth();

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [patientDeleted, setPatientDeleted] = useState<string[]>([]);
  const [patientUpdated, setPatientUpdated] = useState<Patient | undefined>(
    undefined
  );

  const { isAdding, addPatient } = useAddPatient();
  const { isUpdating, updatePatient } = useUpdatePatient();
  const { isDeleting, deletePatients } = useDeletePatients();
  const { data, refetch } = usePatients();

  const processing = isAdding || isUpdating || isDeleting;

  // download patient excel/csv file
  const downloadCsv = async () => {
    try {
      const response = await fetch(`${baseUrl}patients/download`);
      const blob = await response.blob();

      // Create a hidden <a> element
      const link = document.createElement("a");
      link.style.display = "none";
      document.body.appendChild(link);

      // Set the <a> element's attributes
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", "利用者情報.xlsx"); // Specify the file name

      // Simulate a click on the <a> element to trigger the download
      link.click();

      // Cleanup by removing the <a> element
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  // event handlers

  const handleAddPatient = async (patient: Partial<Patient>) => {
    console.log(patient);
    addPatient({
      ...patient,
      user_id: userInfo?.id,
    } as Patient)
      .then((patient: Patient) => {
        setOpenPatientDialog(false);
        snackbar.success(
          t("patientManagement.notifications.addSuccess", {
            employee: `${patient?.name_kanji}`,
          })
        );
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleDeletePatients = async () => {
    deletePatients(patientDeleted)
      .then(() => {
        snackbar.success(t("patientManagement.notifications.deleteSuccess"));
        setSelected([]);
        setPatientDeleted([]);
        setOpenConfirmDeleteDialog(false);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleUpdatePatient = async (
    patient: Partial<Patient>,
    patient_id: string
  ) => {
    updatePatient({
      ...patient,
      id: patient_id,
    } as Patient)
      .then((patient: Patient) => {
        setOpenPatientDialog(false);
        snackbar.success(
          t("patientManagement.notifications.updateSuccess", {
            patient: `${patient?.name_kanji}`,
          })
        );
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

  const handleClosePatientDialog = () => {
    setPatientUpdated(undefined);
    setOpenPatientDialog(false);
  };

  const handleOpenConfirmDeleteDialog = (patientIds: string[]) => {
    setPatientDeleted(patientIds);
    setOpenConfirmDeleteDialog(true);
  };

  const handleOpenPatientDialog = (patient?: Patient) => {
    setPatientUpdated(patient);
    setOpenPatientDialog(true);
  };

  const handleSelectedChange = (newSelected: string[]) => {
    setSelected(newSelected);
  };

  return (
    <React.Fragment>
      <AdminAppBar>
        {!selected.length ? (
          <AdminToolbar title={t("patientManagement.toolbar.title")}>
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
              aria-label="logout"
              color="primary"
              disabled={processing}
              onClick={() => handleOpenPatientDialog()}
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
      <PatientTable
        processing={processing}
        onDelete={handleOpenConfirmDeleteDialog}
        onEdit={handleOpenPatientDialog}
        onSelectedChange={handleSelectedChange}
        selected={selected}
        patients={data}
      />

      <ConfirmDialog
        description={t("patientManagement.confirmations.delete")}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeletePatients}
        open={openConfirmDeleteDialog}
        title={t("common.confirmation")}
      />

      {openPatientDialog && (
        <PatientDialog
          open={openPatientDialog}
          processing={processing}
          patient={patientUpdated}
          patientsRefetch={refetch}
          onClose={handleClosePatientDialog}
          onAdd={handleAddPatient}
          onUpdate={handleUpdatePatient}
        />
      )}
    </React.Fragment>
  );
};

export default PatientManagement;
