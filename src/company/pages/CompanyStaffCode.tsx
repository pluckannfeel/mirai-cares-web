import React from "react";
import { Card } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/contexts/AuthProvider";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";

import ConfirmDialog from "../../core/components/ConfirmDialog";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { useStaffCodeList } from "../hooks/useStaffCodeList";
import StaffCodeListTable from "../components/StaffCodeListTable";

const CompanyStaffCode = () => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const { userInfo } = useAuth();
  const { data, isLoading } = useStaffCodeList();

  return (
    <React.Fragment>
      {/* <Card> */}
      <StaffCodeListTable staffs={data} processing={isLoading} />
      {/* </Card> */}
    </React.Fragment>
  );
};

export default CompanyStaffCode;
