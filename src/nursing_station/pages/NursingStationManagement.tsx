import { Button, Fab } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import SelectToolbar from "../../core/components/SelectToolbar";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";

import { NursingStation, NurseInCharge } from "../types/NursingStation";
import { useNursingStations } from "../hooks/useNursingStations";
import { useAddNursingStation } from "../hooks/useAddNursingStation";
import { useUpdateNursingStation } from "../hooks/useUpdateNursingStation";
import { useDeleteNursingStation } from "../hooks/useDeleteNursingStation";
import NursingStationTable from "../components/NursingStationTable";
import NursingStationDialog from "../components/NursingStationDialog";

const NursingStationManagement = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openVNSDialog, setOpenVNSDialog] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [VNSDeleted, setVNSDeleted] = useState<string[]>([]);
  const [VNSUpdated, setVNSUpdated] = useState<NursingStation | undefined>(
    undefined
  );

  //hooks
  const { data } = useNursingStations();

  const { isAdding, addNursingStation } = useAddNursingStation();
  const { isUpdating, updateNursingStation } = useUpdateNursingStation();
  const { isDeleting, deleteNursingStation } = useDeleteNursingStation();
  const processing = isAdding || isUpdating || isDeleting;

  const handleAddNursingStation = async (
    nursingStation: Partial<NursingStation>
  ) => {
    addNursingStation(nursingStation as NursingStation)
      .then((nursingStation: NursingStation) => {
        setOpenVNSDialog(false);
        snackbar.success(
          t("visitingNursingStation.notifications.addSuccess", {
            name: `${nursingStation?.corporate_name}`,
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

  const handleDeleteNursingStation = async () => {
    deleteNursingStation(VNSDeleted)
      .then(() => {
        snackbar.success(
          t("visitingNursingStation.notifications.deleteSuccess", {
            count: VNSDeleted.length,
          })
        );

        setSelected([]);
        setVNSDeleted([]);
        setOpenConfirmDeleteDialog(false);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleUpdateNursingStation = async (
    nursingStation: Partial<NursingStation>
  ) => {
    updateNursingStation({
      ...nursingStation,
    } as NursingStation)
      .then((nursingStation: NursingStation) => {
        setOpenVNSDialog(false);
        snackbar.success(
          t("visitingNursingStation.notifications.updateSuccess", {
            name: `${nursingStation?.corporate_name}`,
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

  const handleCloseMIDialog = () => {
    setVNSUpdated(undefined);
    setOpenVNSDialog(false);
  };

  const handleOpenConfirmDeleteDialog = (vnsIds: string[]) => {
    setVNSDeleted(vnsIds);
    setOpenConfirmDeleteDialog(true);
  };

  const handleOpenMIDialog = (vns?: NursingStation) => {
    setVNSUpdated(vns);
    setOpenVNSDialog(true);
  };

  const handleSelectedChange = (newSelected: string[]) => {
    setSelected(newSelected);
  };

  return (
    <React.Fragment>
      <AdminAppBar>
        {!selected.length ? (
          <AdminToolbar title={t("visitingNursingStation.toolbar.title")}>
            {/* <Button
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
            </Button> */}
            <Fab
              aria-label="add-nursing-station"
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

      <NursingStationTable
        processing={processing}
        nursingStations={data || []}
        selected={selected}
        onSelectedChange={handleSelectedChange}
        onEdit={handleOpenMIDialog}
        onDelete={handleOpenConfirmDeleteDialog}
      />

      <ConfirmDialog
        description={t("visitingNursingStation.confirmations.delete")}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteNursingStation}
        open={openConfirmDeleteDialog}
        title={t("common.confirmation")}
      />

      {openVNSDialog && (
        <NursingStationDialog
          onAdd={handleAddNursingStation}
          onUpdate={handleUpdateNursingStation}
          onClose={handleCloseMIDialog}
          open={openVNSDialog}
          processing={processing}
          nursingStation={VNSUpdated}
        />
      )}
    </React.Fragment>
  );
};

export default NursingStationManagement;
