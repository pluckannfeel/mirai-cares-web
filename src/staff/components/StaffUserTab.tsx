// DISCONTINUED (we created a patient tab instead)
// import React, { useEffect, useState } from "react";
// import { useStaff } from "../hooks/useStaff";
// import { useAuth } from "../../auth/contexts/AuthProvider";
// import { Staff } from "../types/staff";
// import { DialogProps, Fab } from "@material-ui/core";
// import StaffDialog from "./StaffDialog";
// import AdminAppBar from "../../admin/components/AdminAppBar";
// import AdminToolbar from "../../admin/components/AdminToolbar";
// import AddIcon from "@material-ui/icons/Add";
// import SelectToolbar from "../../core/components/SelectToolbar";
// import { useTranslation } from "react-i18next";
// import { useAddStaff } from "../hooks/useAddStaff";
// import { useSnackbar } from "../../core/contexts/SnackbarProvider";
// import StaffTable from "./StaffTable";
// import { useUpdateStaff } from "../hooks/useUpdateStaff";
// import { baseUrl } from "../../api/server";
// import { useStaffCompanyContract } from "../hooks/useStaffContract";

// const StaffUserTab = () => {
//   // get email from useauth
//   const { t } = useTranslation();
//   const snackbar = useSnackbar();
//   const { userInfo } = useAuth();

//   const { addStaff } = useAddStaff();
//   const { updateStaff } = useUpdateStaff();

//   const { data, refetch } = useStaff(userInfo?.email, "user");

//   const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
//   const [openStaffDialog, setOpenStaffDialog] = useState(false);
//   const [selected, setSelected] = useState<string[]>([]);
//   const [staffDeleted, setStaffDeleted] = useState<string[]>([]);
//   const [staffUpdated, setStaffUpdated] = useState<Staff | undefined>(
//     undefined
//   );

//   useEffect(() => {
//     // This code will run when the component is mounted
//     refetch();
//     return () => {
//       // This code will run when the component is unmounted
//       // console.log("Component is unmounted!");
//     };
//   }, [refetch]); // Empty dependency array means it only runs once on mount and cleans up on unmount

//   const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");

//   // const { setSelectedStaff } =
//   //   useSelectedStaff();

//   // const processing = isAdding || isDeleting || isUpdating;
//   const processing = false;

//   const handleOpenConfirmDeleteDialog = (staffIds: string[]) => {
//     setStaffDeleted(staffIds);
//     setOpenConfirmDeleteDialog(true);
//   };

//   const handleOpenStaffDialog = (staff?: Staff) => {
//     // console.log("true")
//     setStaffUpdated(staff);
//     // setOpenEmpDialog(true);
//     setOpenStaffDialog(true);

//     setScroll("paper");
//   };

//   // generate contract
//   const { isFetching, fetchStaffContract } = useStaffCompanyContract();

//   const handleGenerateContract = async (staff: Staff) => {
//     // setStaffUpdated(staff);
//     // setOpenEmpDialog(true);
//     // console.log(staff.id);
//     // download file using window.open
//     // window.open(`${baseUrl}staff/generate/?staff_id=${staff.id}`, "_blank");
//     const staffContractData = await fetchStaffContract(staff.id);
//     window.open(staffContractData, "_blank");
//     // window.open(staffContractData?.url, "_blank");
//   };

//   const handleSelectedChange = (newSelected: string[]) => {
//     setSelected(newSelected);
//   };

//   // for staff dialog
//   const handleAddStaff = async (
//     staff: Partial<Staff>,
//     imageFile: File | null
//   ) => {
//     addStaff({
//       ...staff,
//       user_id: userInfo?.id,
//       img_url: imageFile,
//     } as Staff)
//       .then((staff: Staff) => {
//         snackbar.success(
//           t("staffManagement.notifications.addSuccess", {
//             employee: `${staff?.japanese_name}`,
//           })
//         );
//         setOpenStaffDialog(false);
//       })
//       .catch(() => {
//         snackbar.error(t("common.errors.unexpected.subTitle"));
//       });
//     // console.log("add staff")
//     // console.log(staff)
//     // console.log(imageFile)

//     // setOpenConfirmDeleteDialog(false);
//   };

//   const handleUpdateStaff = async (
//     staff: Partial<Staff>,
//     imageFile: File | null,
//     id: string
//   ) => {
//     updateStaff({
//       ...staff,
//       id,
//       img_url: imageFile,
//     } as Staff)
//       .then((staff: Staff) => {
//         snackbar.success(
//           t("employeeManagement.notifications.updateSuccess", {
//             employee: `${staff?.japanese_name}`,
//           })
//         );
//         setOpenStaffDialog(false);
//       })
//       .catch(() => {
//         snackbar.error(t("common.errors.unexpected.subTitle"));
//       });
//   };

//   const handleCloseStaffDialog = () => {
//     // clear all employee selection
//     setStaffUpdated(undefined);
//     // setSelectedStaff(null);
//     // setOpenEmpDialog(false);
//     setOpenStaffDialog(false);
//   };

//   const handleCancelSelected = () => {
//     setSelected([]);
//   };

//   return (
//     <React.Fragment>
//       <AdminAppBar>
//         {!selected.length ? (
//           <AdminToolbar title={t("staffManagement.toolbar.title")}>
//             <Fab
//               aria-label="logout"
//               color="primary"
//               disabled={processing}
//               onClick={() => handleOpenStaffDialog()}
//               size="small"
//             >
//               <AddIcon />
//             </Fab>
//           </AdminToolbar>
//         ) : (
//           <SelectToolbar
//             processing={processing}
//             onCancel={handleCancelSelected}
//             onDelete={handleOpenConfirmDeleteDialog}
//             selected={selected}
//           />
//         )}
//       </AdminAppBar>
//       <StaffTable
//         processing={processing}
//         onDelete={handleOpenConfirmDeleteDialog}
//         onEdit={handleOpenStaffDialog}
//         onGenerateContract={handleGenerateContract}
//         onSelectedChange={handleSelectedChange}
//         selected={selected}
//         staffs={data}
//       />
//       {openStaffDialog && (
//         <StaffDialog
//           onAdd={handleAddStaff}
//           onClose={handleCloseStaffDialog}
//           onUpdate={handleUpdateStaff}
//           staff={staffUpdated}
//           processing={processing}
//           open={openStaffDialog}
//         />
//       )}
//     </React.Fragment>
//   );
// };

// export default StaffUserTab;


export {}