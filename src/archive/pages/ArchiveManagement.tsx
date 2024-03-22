import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Fab,
  IconButton,
  Button,
  Container,
  Paper,
  ButtonGroup,
  Breadcrumbs,
  Link,
  useTheme,
  Backdrop,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import {
  FileUpload as FileUploadIcon,
  Refresh as RefreshIcon,
  NavigateNext as NavigateNextIcon,
  CreateNewFolder as CreateNewFolderIcon,
  Delete as DeleteIcon,
  DriveFileMove as DriveFileMoveIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { APIRequestResponse, ArchiveFile, PathEntry } from "../types/archive";
import { useCurrentDirectoryFiles } from "../hooks/useCurrentDirectoryFiles";
import ArchiveTable from "../components/ArchiveTable";
import { useCreateFolder } from "../hooks/useCreateFolder";
import ArchiveCreateFolderDialog from "../components/ArchiveCreateFolderDialog";
import ArchiveUploadFileButton from "../components/ArchiveUploadFileButton";
import ArchiveReplaceConfirmDialog from "../components/ArchiveReplaceConfirmDialog";
import { useUploadFile } from "../hooks/useUploadFile";
import { useReplaceFile } from "../hooks/useReplaceFile";
import SelectToolbar from "../../core/components/SelectToolbar";
import { useAuth } from "../../auth/contexts/AuthProvider";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import { useDeleteFiles } from "../hooks/useDeleteFiles";
import { useDownloadFiles } from "../hooks/useDownloadFiles";
import ArchiveRenameFolderDialog from "../components/ArchiveRenameFolderDialog";
import { useRenameFolder } from "../hooks/useRenameFolder";
import { archiveLists } from "../helpers/functions";

const ArchiveManagement = () => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const theme = useTheme();

  const { userInfo } = useAuth();

  const [openConfirmDeleteFileDialog, setOpenConfirmDeleteDialog] =
    useState(false);

  // const [openUploadFileDialog, setOpenUploadFileDialog] = useState(false);
  const [openConfirmReplaceFileDialog, setOpenConfirmReplaceFileDialog] =
    useState(false);
  const [openAddFolderDialog, setOpenAddFolderDialog] = useState(false);

  const [openRenameFolderDialog, setOpenRenameFolderDialog] = useState(false);
  const [selectedRenameFolder, setSelectedRenameFolder] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [filesDeleted, setFilesDeleted] = useState<string[]>([]);
  const [filesMoved, setFilesMoved] = useState<string[]>([]);
  const [filesDownloaded, setFilesDownloaded] = useState<string[]>([]);
  // this part here if file has been replaced, then we will update the file
  const [fileToBeReplaced, setfileToBeReplaced] = useState<File | undefined>(
    undefined
  );
  // uploads/staff
  const [currentDirectory, setCurrentDirectory] = useState("archive/");
  const [pathHistory, setPathHistory] = useState<PathEntry[]>([
    { name: "archive.homeDirectory", path: "archive/" },
  ]);

  //disable state for the action buttons if the current directory is uploads/staff/
  const isStaffDirectory = currentDirectory.includes("staff");

  // list current directory hook
  const {
    data: currentDirectoryFiles,
    isLoading,
    refetch: reload,
  } = useCurrentDirectoryFiles(currentDirectory);

  // create folder hook
  const { createFolder: createS3Folder, isCreating: isCreatingFolder } =
    useCreateFolder();

  // rename folder hook
  const { renameFolder, isRenaming: isRenamingFolder } = useRenameFolder();

  // upload file hook
  const { uploadFile: uploadFileToS3Bucket, isUploading: isFileUploading } =
    useUploadFile();

  // replace file hook
  const { replaceFile: replaceFileOnS3Bucket, isReplacing } = useReplaceFile();

  // delete file(s) hook
  const { isDeleting: isDeletingFiles, deleteFiles: deleteFilesOnS3Bucket } =
    useDeleteFiles();

  // download files hook
  const { isDownloading, downloadFiles: downloadS3Files } = useDownloadFiles();

  const processing = isLoading;

  // ADD FOLDER TO S3 BUCKET CURRENT DIRECTORY
  const handleCreateFolder = (folderName: string) => {
    createS3Folder({
      folderName,
      currentPath: currentDirectory,
      userName: `${userInfo?.first_name} ${userInfo?.last_name} (${userInfo?.email})`,
    });

    setOpenAddFolderDialog(false);

    // if success, reload
    // reload();

    snackbar.success(t("archive.notifications.createFolderSuccess"));
  };

  // RENAME FOLDER (this is from table click file event)
  const handleRenameFolderEvent = (oldPath: string) => {
    // set the rename folder selected state
    setSelectedRenameFolder(oldPath);

    handleOpenRenameFolderDialog();
  };

  const handleDeleteFiles = async () => {
    // console.log(filesDeleted);

    deleteFilesOnS3Bucket(filesDeleted)
      .then((response) => {
        if (response.code === "success") {
          snackbar.success(t("archive.notifications.deleteSuccess"));
        } else if (response.code === "error") {
          snackbar.error(t("archive.notifications.error.deleteError"));
        }

        setSelected([]);
        setFilesDeleted([]);
        setOpenConfirmDeleteDialog(false);
      })
      .catch(() => {
        snackbar.error(t("archive.notifications.error.deleteError"));
      });
  };

  const handleCancelSelected = () => {
    setSelected([]);
  };

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
  };

  const handleOpenConfirmDeleteDialog = (keys: string[]) => {
    setFilesDeleted(keys);
    setOpenConfirmDeleteDialog(true);
  };

  // const handleOpenFileUploadDialog = (file?: ArchiveFile) => {
  //   setFileUpdated(file);
  //   setOpenUploadFileDialog(true);
  // };

  const handleSelectedChange = (newSelected: string[]) => {
    setSelected(newSelected);
  };

  // file click to navigate
  const handleFileClick = (key: string, fileType: string) => {
    // console.log(key);

    // clear all selected files
    setSelected([]);

    if (fileType === "folder") {
      setCurrentDirectory(key);
      const newPath = { name: key.split("/").slice(-2, -1)[0], path: key }; // Extract folder name from key
      setPathHistory((prev) => [...prev, newPath]);
    } else {
      // Handle file opening logic here
      // open a new tab with the file
      // console.log(import.meta.env.VITE_S3_BUCKET_BASE_URL)
      window.open(`${import.meta.env.VITE_S3_BUCKET_BASE_URL}/${key}`);
    }
  };

  // add folder
  const handleOpenAddFolderDialog = () => {
    // console.log(currentDirectory);
    // open add folder dialog
    setOpenAddFolderDialog(true);
  };

  // rename folder
  const handleOpenRenameFolderDialog = () => {
    // console.log(currentDirectory);
    // open add folder dialog
    setOpenRenameFolderDialog(true);
  };

  // upload file
  const uploadFile = (file: File) => {
    // check if file exists then we run replace instead of upload
    if (file) {
      const isfileExists = currentDirectoryFiles?.files.some(
        (f) => f.name === file.name
      );
      // console.log(isfileExists);

      if (isfileExists) {
        setfileToBeReplaced(file);
        // open confirm replace dialog
        setOpenConfirmReplaceFileDialog(true);

        // although this wont be necessary, since we pass a promise return here
        // drop reject to the upload folder if file exists
        return new Promise<APIRequestResponse>((resolve, reject) => {
          // resolve({
          //   code: "replaceSuccess",
          //   message: "File has been replaced successfully",
          // });
          reject({
            code: "fileExists",
            message: "File already exists",
          });
        });
      }
    }

    // add file, current path and user
    return uploadFileToS3Bucket({
      file,
      currentPath: currentDirectory,
      userName: `${userInfo?.first_name} ${userInfo?.last_name} (${userInfo?.email})`,
    });
  };

  //Replace file
  const replaceFile = () => {
    // console.log(fileToBeReplaced);
    replaceFileOnS3Bucket({
      file: fileToBeReplaced!,
      currentPath: currentDirectory,
      userName: `${userInfo?.first_name} ${userInfo?.last_name} (${userInfo?.email})`,
    })
      .then((response) => {
        if (response.code === "success") {
          snackbar.success(t("archive.notifications.replaceFileSuccess"));
        }

        if (response.code === "error") {
          snackbar.error(t("archive.notifications.error.replaceFileError"));
        }

        setfileToBeReplaced(undefined);
        setOpenConfirmReplaceFileDialog(false);
      })
      .catch((error) => {
        snackbar.error(t("archive.notifications.error.replaceFileError"));
      });
  };

  //Download File (single select on menu items)
  const handleDownloadFile = (file: ArchiveFile) => {
    // console.log(file);

    downloadS3Files([file.key]).then((response) => {
      // response is a link string
      // download file without opening tab
      const link = document.createElement("a");

      link.href = response;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  // rename folder hook
  const handleRenameFolder = (oldPathKey: string, newPathKey: string) => {
    // console.log(newPathKey);
    renameFolder({
      oldPath: oldPathKey,
      newPath: newPathKey,
      userName: `${userInfo?.first_name} ${userInfo?.last_name} (${userInfo?.email})`,
    })
      .then((response) => {
        snackbar.success(t("archive.notifications.renameFolderSuccess"));
      })
      .catch((error) => {
        snackbar.error(t("archive.notifications.error.renameFolderError"));
      });
    setOpenRenameFolderDialog(false);
    // if success, reload
    // reload();
  };

  const handleDownloadMultipleSelectedFiles = () => {
    downloadS3Files(selected).then((response) => {
      // response is a link string
      // download file without opening tab
      const link = document.createElement("a");

      link.href = response;
      link.setAttribute("download", "download.zip");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  // move file (single select on menu items)
  const handleMoveFile = (file: ArchiveFile) => {
    setFilesMoved([file.key]);

    // console.log(filesMoved);
  };

  // breadcrumbs
  const navigateTo = (pathIndex: number) => {
    const newPathHistory = pathHistory.slice(0, pathIndex + 1);
    setPathHistory(newPathHistory);
    const newCurrentDirectory = newPathHistory[newPathHistory.length - 1].path;
    setCurrentDirectory(newCurrentDirectory);
  };

  return (
    <React.Fragment>
      <AdminAppBar>
        <AdminToolbar title={t("archive.title")}></AdminToolbar>
      </AdminAppBar>
      {isDownloading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isDownloading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      <div
        style={{
          width: "20vw",
          paddingTop: "6px",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "12px",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <FormControl
          // sx={{ m: 1, minWidth: 120 }}
          fullWidth
          size="small"
          // component="fieldset"
          margin="dense"
          variant="standard"
        >
          <InputLabel
            sx={{
              fontSize: theme.typography.h4.fontSize,
            }}
            id="gender"
          >
            {t("archive.list.label")}
          </InputLabel>
          <Select
            // fullWidth
            autoComplete="archiveList"
            // // autofocus
            size="medium"
            // name="archiveList"
            // margin='dense'
            id="archiveList"
            label={t("archive.list.label")}
            labelId="archiveList"
            disabled={processing}
            value={currentDirectory}
            sx={{
              ".MuiSelect-select": {
                paddingY: "0.75rem", // Adjust padding as needed
              },
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent", // Optionally remove the border
              },
            }}
            onChange={(event: SelectChangeEvent) => {
              const value = event.target.value as string;
              setCurrentDirectory(value);

              // set path history
              if (value.includes("staff")) {
                console.log(pathHistory);
                setPathHistory([
                  { name: "archive.staffDocuments", path: "uploads/staff/" },
                ]);
              } else {
                setPathHistory([
                  { name: "archive.homeDirectory", path: "archive/" },
                ]);
              }
            }}
          >
            {archiveLists.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {t(option.label)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div
        style={{
          margin: "10px 0",
        }}
      >
        <ArchiveUploadFileButton
          submitHandler={uploadFile}
          buttonProps={{
            title: t("archive.actions.uploadFile"),
            variant: "contained",
            disabled: isFileUploading || isStaffDirectory,
            color: "warning",
            size: "medium",
            endIcon: <FileUploadIcon />,
          }}
          loading={isFileUploading}
        />

        {/* <Button
          aria-label="logout"
          color="warning"
          variant="contained"
          // disabled={processing}
          onClick={() => {}}
          size="medium"
          sx={{
            // padding: "10px 20px",
            marginRight: "10px",
          }}
          endIcon={<FileUploadIcon />}
        >
          {t("archive.actions.uploadFile")}
        </Button> */}
        <Button
          aria-label="logout"
          color="primary"
          variant="text"
          // disabled={processing}
          disabled={isStaffDirectory}
          onClick={() => handleOpenAddFolderDialog()}
          size="large"
          sx={{
            color: "#000",
            // backgroundColor: "#f3f3f3",
            marginRight: "10px",
            padding: "10px 20px",
            // bgcolor: "white",
          }}
          endIcon={<CreateNewFolderIcon />}
        >
          {t("archive.actions.createFolder")}
        </Button>
        <Button
          aria-label="logout"
          // color="info"
          variant="text"
          // disabled={processing}
          onClick={() => reload()}
          size="large"
          sx={{
            color: "#000",
            marginRight: "10px",
            // padding: "10px 20px",
            // bgcolor: "white",
          }}
          endIcon={<RefreshIcon />}
        >
          {t("archive.actions.reload")}
        </Button>
        <Button
          disabled={!selected.length || isStaffDirectory}
          aria-label="delete"
          color="error"
          variant="outlined"
          onClick={() => handleOpenConfirmDeleteDialog(selected)}
          size="small"
          sx={{
            color: "#000",
            marginRight: "10px",
          }}
          endIcon={<DeleteIcon />}
        >
          {t("archive.actions.delete")}
        </Button>
        <Button
          disabled={!selected.length}
          aria-label="delete"
          color="warning"
          variant="outlined"
          onClick={handleDownloadMultipleSelectedFiles}
          size="small"
          sx={{
            color: "#000",
            marginRight: "10px",
          }}
          endIcon={<DownloadIcon />}
        >
          {t("archive.actions.download")}
        </Button>
        {/* <Button
          disabled={!selected.length}
          aria-label="move"
          color="info"
          variant="outlined"
          onClick={() => handleOpenConfirmDeleteDialog(selected)}
          size="small"
          sx={{
            color: "#000",
            marginRight: "10px",
          }}
          endIcon={<DriveFileMoveIcon />}
        >
          {t("archive.actions.move")}
        </Button> */}
        {/* {!selected.length ? (
          <Button
            aria-label="delete"
            variant="outlined"
            onClick={() => {}}
            size="medium"
            sx={{
              color: "#000",
            }}
            endIcon={<DeleteIcon />}
          >
            {t("archive.actions.delete")}
          </Button>
        ) : (
          <SelectToolbar
            processing={processing}
            onCancel={handleCancelSelected}
            onDelete={handleOpenConfirmDeleteDialog}
            selected={selected}
          />
        )} */}
      </div>

      <Breadcrumbs
        sx={{
          padding: 2,
          marginY: 2,
          borderRadius: "12px",
          bgcolor: theme.palette.background.paper,
        }}
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {pathHistory.map((entry, index) => (
          <Link
            key={index}
            color="inherit"
            href="#"
            onClick={() => navigateTo(index)}
            sx={{
              fontSize: theme.typography.h5,
              color: "grey.800",
            }}
            underline="hover"
          >
            {entry.name === "archive.homeDirectory" ||
            entry.name === "archive.staffDocuments"
              ? t(entry.name)
              : entry.name}
          </Link>
        ))}
      </Breadcrumbs>

      <ArchiveTable
        processing={processing}
        onDownload={handleDownloadFile}
        onRenameFolder={handleRenameFolderEvent}
        onMove={handleMoveFile}
        onDelete={handleOpenConfirmDeleteDialog}
        // onEdit={handleOpenFileUploadDialog}
        onSelectedChange={handleSelectedChange}
        onFileClick={handleFileClick}
        selected={selected}
        files={currentDirectoryFiles?.files || []}
      />

      {openAddFolderDialog && (
        <ArchiveCreateFolderDialog
          open={openAddFolderDialog}
          onClose={() => setOpenAddFolderDialog(false)}
          processing={isCreatingFolder}
          files={currentDirectoryFiles?.files || []}
          onCreateFolder={handleCreateFolder}
          currentPath={currentDirectory}
        />
      )}

      {openRenameFolderDialog && (
        <ArchiveRenameFolderDialog
          open={openRenameFolderDialog}
          onClose={() => setOpenRenameFolderDialog(false)}
          processing={isRenamingFolder}
          files={currentDirectoryFiles?.files || []}
          onRenameFolder={handleRenameFolder}
          currentPath={currentDirectory}
          oldFolderPath={selectedRenameFolder}
        />
      )}

      {openConfirmReplaceFileDialog && (
        <ArchiveReplaceConfirmDialog
          open={openConfirmReplaceFileDialog}
          onClose={() => {
            setfileToBeReplaced(undefined);
            setOpenConfirmReplaceFileDialog(false);
          }}
          onConfirm={replaceFile}
          pending={isReplacing}
          title={t("archive.dialog.replaceFile.title")}
          description={t("archive.dialog.replaceFile.description")}
        />
      )}

      {/* // Delete Files */}
      <ConfirmDialog
        pending={isDeletingFiles}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteFiles}
        open={openConfirmDeleteFileDialog}
        title={t("archive.dialog.deleteFiles.title")}
        description={t("archive.dialog.deleteFiles.description")}
      />
    </React.Fragment>
  );
};
export default ArchiveManagement;
