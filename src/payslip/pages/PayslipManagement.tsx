import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import CircleProgressWidget from "../../admin/widgets/CircleProgressWidget";
import OverviewWidget from "../../admin/widgets/OverviewWidget";
import { Add as AddIcon } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  DialogProps,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
} from "@mui/material";
import PayslipTable from "../components/PayslipTable";
import { useStaffSelect } from "../../staff/hooks/useStaffSelection";
import { Staff } from "../../staff/types/staff";
import { StaffScheduleSelect } from "../../shift/types/StaffWorkSchedule";
import { FilterDate, Payslip } from "../types/payslip";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import PayslipDialog from "../components/PayslipDialog";
import { usePayslips } from "../hooks/usePayslip";

import {
  filterOptions,
  japaneseMonthObjects,
  months,
  years,
} from "../helpers/helper";
import { parseISO, getYear, getMonth } from "date-fns";
import { useAddPayslip } from "../hooks/useAddPayslip";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { usePushNotification } from "../../admin/hooks/usePushNotification";
import { PushNotification } from "../../admin/types/notification";
import { useDeletePayslips } from "../hooks/useDeletePayslip";
import SelectToolbar from "../../core/components/SelectToolbar";
import { useRecord } from "../hooks/useRecord";
import { OverallRecord } from "../types/record";

const PayslipManagement = () => {
  const { t, i18n } = useTranslation();
  const snackbar = useSnackbar();

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openPayslipDialog, setOpenPayslipDialog] = useState(false);
  const [selectedPayslips, setSelectedPayslips] = useState<string[]>([]);
  const [payslipUpdated, setPayslipUpdated] = useState<Payslip | undefined>(
    undefined
  );
  const [payslipsDeleted, setPayslipsDeleted] = useState<string[]>([]);
  // eslint-disable-next-line
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");
  const [filterType, setFilterType] = useState<"staff" | "date">("date");
  const [filterDate, setFilterDate] = useState<FilterDate>({});

  const [staffSelect, setStaffSelect] = useState<StaffScheduleSelect | null>(
    null
  );
  const { data: initialStaffSelect } = useStaffSelect();

  //get total work hours
  const { data: records } = useRecord();
  const [overallRecord, setOverallRecord] = useState<OverallRecord>({
    total_employees: initialStaffSelect ? initialStaffSelect.length : 0,
    total_hours: 0,
  });

  // overview data
  const overviewItems = [
    {
      unit: "payslip.overview.totalEmployees", // total of employees
      value: `${overallRecord.total_employees}人`,
      backgroundColor: "#4caf50",
    },
    // {
    //   unit: "payslip.overview.netSalarythisMonth", // total net salary paid
    //   value: "¥ 500万円",
    //   backgroundColor: "#f44336",
    // },
    // {
    //   unit: "payslip.overview.totalDeduction", // total deductions
    //   value: "￥ 100万円",
    //   backgroundColor: "#ff9800",
    // },
    {
      unit: "payslip.overview.totalHoursWorked", // total hours worked
      value: `${overallRecord.total_hours} 作業時間`,
      backgroundColor: "#2196f3",
    },
  ];

  const staffSelection = initialStaffSelect
    ? initialStaffSelect.filter(
        (staff: StaffScheduleSelect) => staff.staff_code !== "mys-xxx"
      )
    : [];

  const { pushNotification } = usePushNotification();

  const { isLoading, data: initialPayslips } = usePayslips();
  const { isAdding, addPayslip } = useAddPayslip();
  const { isDeleting, deletePayslips } = useDeletePayslips();

  const [payslips, setPayslips] = useState<Payslip[]>([]);

  const processing = isAdding || isDeleting || isLoading;

  useEffect(() => {
    if (initialPayslips) {
      setPayslips(initialPayslips);
    }

    if (records) {
      setOverallRecord({
        ...overallRecord,
        total_hours: records.total_hours,
      });
    }
  }, [initialPayslips, records]);

  // update payslip
  const handleUpdatePayslip = async (payslip: Payslip) => {
    // console.log(payslip);
    // updateUser(user)
    //   .then(() => {
    //     snackbar.success(
    //       t("userManagement.notifications.updateSuccess", {
    //         user: `${user.first_name} ${user.last_name}`,
    //       })
    //     );
    //     setOpenUserDialog(false);
    //   })
    //   .catch(() => {
    //     snackbar.error(t("common.errors.unexpected.subTitle"));
    //   });
  };

  // add payslip
  const handleAddPayslip = async (payslip: Partial<Payslip>) => {
    // console.log(payslip);

    addPayslip(payslip as Payslip)
      .then(() => {
        snackbar.success(
          t("payslip.notifications.addSuccess", {
            // payslip: `${payslip.staf} ${payslip.last_name}`,
          })
        );
        setOpenPayslipDialog(false);

        if (payslip) {
          pushNotification({
            staff_code: payslip["staff"]?.staff_code as string,
            title: t("payslip.push_notifications.addPayslipTitle"),
            body: t("payslip.push_notifications.addPayslipBody"),
          } as PushNotification);
        }
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });

    // refetch()
  };

  // delete pyslip
  const handleDeletePayslips = async () => {
    // console.log(payslipsDeleted);
    if (payslipsDeleted.length > 0) {
      deletePayslips(payslipsDeleted)
        .then((payslips) => {
          snackbar.success(t("payslip.notifications.deleteSuccess"));
          setOpenConfirmDeleteDialog(false);
        })
        .catch(() => {
          snackbar.error(t("common.errors.unexpected.subTitle"));
        });
    }
  };

  const handlePayslipSelectedChange = (newSelected: string[]) => {
    setSelectedPayslips(newSelected);
  };

  const handleDateFilterChange = (month: number, year: number) => {
    // Filter logic based on month and year
  };

  const handleStaffFilterChange = (staffId: string) => {
    // Filter logic based on staff ID
  };

  const handleOpenPayslipDialog = (payslip?: Payslip) => {
    // console.log("true")
    setPayslipUpdated(payslip);
    // setOpenEmpDialog(true);
    setOpenPayslipDialog(true);

    setScroll("paper");
  };

  const handleClosePayslipDialog = () => {
    setPayslipUpdated(undefined);
    setOpenPayslipDialog(false);
  };

  // delete confirm
  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
  };

  const handleOpenConfirmDeleteDialog = (payslipIds: string[]) => {
    setPayslipsDeleted(payslipIds);
    setOpenConfirmDeleteDialog(true);
  };

  const handleCancelSelected = () => {
    setSelectedPayslips([]);
  };

  // filter by date handler
  const handleFilterPayslips = () => {
    if (initialPayslips) {
      if (filterDate.year && filterDate.month) {
        const filteredPayslips = initialPayslips.filter((payslip) => {
          const releaseDate = parseISO(payslip.release_date.toString());
          return (
            getYear(releaseDate) === parseInt(filterDate.year as string) &&
            getMonth(releaseDate) === parseInt(filterDate.month as string) - 1 // getMonth returns 0-11, so subtract 1 from filter month
          );
        });
        setPayslips(filteredPayslips);
      }
    }
  };

  return (
    <React.Fragment>
      <AdminAppBar>
        {!selectedPayslips.length ? (
          <AdminToolbar title={t("payslip.title")}>
            <Fab
              aria-label="add work schedule"
              color="primary"
              onClick={() => handleOpenPayslipDialog()}
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
            selected={selectedPayslips}
          />
        )}
      </AdminAppBar>

      <Grid container spacing={2}>
        {/* {overviewItems.map((item, index) => (
          <Grid key={index} item xs={6} md={3}>
            <OverviewWidget
              backgroundColor={item.backgroundColor}
              description={t(item.unit)}
              title={item.value}
            />
          </Grid>
        ))} */}

        {/* table */}
        <Grid item xs={12} container md={9}>
          {/* <ActivityWidget />
           */}

          <PayslipTable
            processing={false}
            payslips={payslips}
            selected={selectedPayslips}
            onSelectedChange={handlePayslipSelectedChange}
            onEdit={handleOpenPayslipDialog}
            onDelete={handleOpenConfirmDeleteDialog}
            staffList={staffSelection as Staff[]}
            onStaffFilterChange={handleStaffFilterChange}
            onDateFilterChange={handleDateFilterChange}
          />
        </Grid>

        {/* { current month released } */}
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              marginTop: 9,
              // marginBottom: 2,
            }}
          >
            <CardHeader title={t("payslip.filter.title")} />
            <CardContent>
              <FormControl
                // sx={{ m: 1, minWidth: 120 }}
                fullWidth
                size="small"
                // component="fieldset"
                margin="dense"
                sx={{
                  marginBottom: 2,
                }}
              >
                <InputLabel id="filter">
                  {t("payslip.filter.options")}
                </InputLabel>
                <Select
                  // fullWidth
                  //   autoComplete="gender"
                  // // autofocus
                  size="small"
                  name="filter"
                  // margin='dense'
                  //   id="gender"
                  label={t("payslip.filter.options")}
                  labelId="filter"
                  disabled={processing}
                  value={filterType}
                  onChange={(e) => {
                    setPayslips([]);
                    setFilterType(e.target.value as "staff" | "date");
                    // clear also the table
                  }}
                >
                  {filterOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {t(option.label)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Grid container spacing={1}>
                {filterType === "staff" ? (
                  <Grid item xs={12}>
                    <Autocomplete
                      // fullWidth
                      freeSolo
                      id="staff-select"
                      size="small"
                      options={staffSelection || []}
                      // getOptionLabel={(option: StaffScheduleSelect) => {
                      //   const name =
                      //     i18n.language === "en"
                      //       ? option.english_name
                      //       : option.japanese_name;
                      //   return name;
                      // }}
                      getOptionLabel={(
                        option: string | StaffScheduleSelect
                      ) => {
                        // Check if the option is a string
                        if (typeof option === "string") {
                          return option;
                        }

                        // If option is a StaffScheduleSelect, process it
                        const name =
                          i18n.language === "en"
                            ? option.english_name
                            : option.japanese_name;
                        return name;
                      }}
                      value={staffSelect}
                      onChange={(_, newValue) => {
                        setStaffSelect(newValue as StaffScheduleSelect);

                        const val = newValue as StaffScheduleSelect;

                        if (initialPayslips && newValue) {
                          const filteredPayslips = initialPayslips.filter(
                            (payslip: Payslip) => {
                              if (payslip.staff?.japanese_name) {
                                return payslip.staff?.japanese_name
                                  .toLowerCase()
                                  .includes(val.japanese_name.toLowerCase());
                              }

                              return false;
                            }
                          );
                          setPayslips(filteredPayslips);
                        } else {
                          setPayslips([]);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t(
                            "staffWorkSchedule.autoCompleteField.searchStaff.label"
                          )}
                        />
                      )}
                    />
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={4}>
                      <FormControl
                        // sx={{ m: 1, minWidth: 120 }}
                        fullWidth
                        size="small"
                        // component="fieldset"
                        margin="dense"
                        // sx={{
                        //   marginBottom: 2,
                        // }}
                      >
                        <InputLabel id="year">
                          {t("payslip.filter.year")}
                        </InputLabel>
                        <Select
                          // fullWidth
                          autoComplete="year"
                          // // autofocus
                          size="small"
                          name="year"
                          // margin='dense'
                          id="year"
                          label={t("payslip.filter.year")}
                          labelId="year"
                          disabled={processing}
                          value={filterDate.year || ""}
                          onChange={(e) => {
                            setFilterDate((prev) => {
                              return {
                                ...prev,
                                year: e.target.value,
                              };
                            });
                          }}
                        >
                          {years.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {t(option.label)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl
                        // sx={{ m: 1, minWidth: 120 }}
                        fullWidth
                        size="small"
                        // component="fieldset"
                        margin="dense"
                        // sx={{
                        //   marginBottom: 2,
                        // }}
                      >
                        <InputLabel id="month">
                          {t("payslip.filter.month")}
                        </InputLabel>
                        <Select
                          // fullWidth
                          autoComplete="month"
                          // // autofocus
                          size="small"
                          name="month"
                          // margin='dense'
                          id="month"
                          label={t("payslip.filter.month")}
                          labelId="month"
                          disabled={processing}
                          value={filterDate.month || ""}
                          onChange={(e) => {
                            setFilterDate((prev) => {
                              return {
                                ...prev,
                                month: e.target.value,
                              };
                            });
                          }}
                        >
                          {i18n.language === "en"
                            ? months.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {t(option.label)}
                                </MenuItem>
                              ))
                            : japaneseMonthObjects.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {t(option.label)}
                                </MenuItem>
                              ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <Button
                        // disabled={!formik.dirty && !formik.isSubmitting}
                        // loading={processing}
                        type="submit"
                        size="small"
                        variant="contained"
                        onClick={handleFilterPayslips}
                      >
                        {t("payslip.actions.filter")}
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* <CircleProgressWidget
            height={204}
            title={t("dashboard.progress.title")}
            value={40}
          /> */}
        </Grid>
      </Grid>

      <ConfirmDialog
        description={t("leaveRequest.confirmations.delete")}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeletePayslips}
        open={openConfirmDeleteDialog}
        title={t("common.confirmation")}
      />

      {openPayslipDialog && (
        <PayslipDialog
          onAdd={handleAddPayslip}
          onClose={handleClosePayslipDialog}
          onUpdate={handleUpdatePayslip}
          open={openPayslipDialog}
          processing={processing}
          staffSelection={staffSelection}
          payslip={payslipUpdated}
        />
      )}
    </React.Fragment>
  );
};

export default PayslipManagement;
