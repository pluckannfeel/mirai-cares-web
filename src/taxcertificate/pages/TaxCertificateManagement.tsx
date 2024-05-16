/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";

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
import { useStaffSelect } from "../../staff/hooks/useStaffSelection";
import { Staff } from "../../staff/types/staff";
import { StaffScheduleSelect } from "../../shift/types/StaffWorkSchedule";
import { TaxCertificate } from "../types/taxcertificate";
import ConfirmDialog from "../../core/components/ConfirmDialog";
// import PayslipDialog from "../components/PayslipDialog";

import { filterOptions, years } from "../helpers/helper";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { usePushNotification } from "../../admin/hooks/usePushNotification";
import { useTaxCertificates } from "../hooks/useTaxcertificate";
import { useAddTaxCertificate } from "../hooks/useAddTaxCertificate";
import { useDeleteTaxCertificates } from "../hooks/useDeleteTaxCertificates";
import { PushNotification } from "../../admin/types/notification";
import SelectToolbar from "../../core/components/SelectToolbar";
import TaxCertificateTable from "../components/TaxCertificateTable";
import TaxCertificateDialog from "../components/TaxCertificateDialog";
dayjs.extend(timezone);

const TaxCertificateManagement = () => {
  const { t, i18n } = useTranslation();
  const snackbar = useSnackbar();

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [openTaxcertificateDialog, setOpenTaxcertificateDialog] =
    useState(false);
  const [selectedTaxcertificates, setSelectedTaxcertificates] = useState<
    string[]
  >([]);
  const [taxcertificateUpdated, setTaxcertificateUpdated] = useState<
    TaxCertificate | undefined
  >(undefined);
  const [taxcertificateDeleted, setTaxcertificatesDeleted] = useState<string[]>(
    []
  );

  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");
  const [filterType, setFilterType] = useState<"staff" | "date">("date");
  const [filterDate, setFilterDate] = useState(""); // year

  const [staffSelect, setStaffSelect] = useState<StaffScheduleSelect | null>(
    null
  );

  const { data: initialStaffSelect } = useStaffSelect();

  const staffSelection = initialStaffSelect
    ? initialStaffSelect.filter(
        (staff: StaffScheduleSelect) => staff.staff_code !== "mys-xxx"
      )
    : [];

  const { pushNotification } = usePushNotification();

  const { isLoading, data: initialTaxCertificates } = useTaxCertificates();
  const { isAdding, addTaxCertificate } = useAddTaxCertificate();
  const { isDeleting, deleteTaxCertificates } = useDeleteTaxCertificates();

  const [taxcertificates, setTaxcertificates] = useState<TaxCertificate[]>([]);

  const processing = isAdding || isDeleting || isLoading;

  useEffect(() => {
    if (initialTaxCertificates) {
      setTaxcertificates(initialTaxCertificates);
    }

    // if (records) {
    //   setOverallRecord({
    //     ...overallRecord,
    //     total_hours: records.total_hours,
    //   });
    // }
  }, [initialTaxCertificates]);

  // add taxcertificate
  const handleAddTaxCertificate = async (
    taxcertificate: Partial<TaxCertificate>
  ) => {
    // console.log(taxcertificate);

    addTaxCertificate(taxcertificate as TaxCertificate)
      .then(() => {
        snackbar.success(
          t("taxcertificate.notifications.addSuccess", {
            // taxcertificate: `${taxcertificate.staf} ${taxcertificate.last_name}`,
          })
        );
        setOpenTaxcertificateDialog(false);

        if (taxcertificate) {
          pushNotification({
            staff_code: taxcertificate["staff"]?.staff_code as string,
            title: t(
              "taxcertificate.push_notifications.addTaxcertificateTitle"
            ),
            body: t("taxcertificate.push_notifications.addTaxcertificateBody"),
          } as PushNotification);
        }
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });

    // refetch()
  };

  const handleUpdateTaxCertificate = async (
    taxcertificate: Partial<TaxCertificate>
  ) => {};

  const handleDeleteTaxCertificates = async () => {
    if (taxcertificateDeleted.length > 0) {
      deleteTaxCertificates(taxcertificateDeleted)
        .then(() => {
          snackbar.success(t("taxcertificate.notifications.deleteSuccess"));
          setOpenConfirmDeleteDialog(false);
        })
        .catch(() => {
          snackbar.error(t("common.errors.unexpected.subTitle"));
        });
    }
  };

  const handleTaxCertificatesSelectedChange = (newSelected: string[]) => {
    setSelectedTaxcertificates(newSelected);
  };

  const handleOpenTaxCertificateDialog = (taxcertificate?: TaxCertificate) => {
    // console.log("true")
    setTaxcertificateUpdated(taxcertificate);
    // setOpenEmpDialog(true);
    setOpenTaxcertificateDialog(true);

    setScroll("paper");
  };

  const handleCloseTaxCertificateDialog = () => {
    setTaxcertificateUpdated(undefined);
    setOpenTaxcertificateDialog(false);
  };

  // delete confirm
  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
  };

  const handleOpenConfirmDeleteDialog = (taxcertificateIds: string[]) => {
    setTaxcertificatesDeleted(taxcertificateIds);
    setOpenConfirmDeleteDialog(true);
  };

  const handleCancelSelected = () => {
    setSelectedTaxcertificates([]);
  };

  const handleFilterTaxCertificate = () => {
    if (initialTaxCertificates) {
      if (filterDate) {
        const filteredTaxCertificates = initialTaxCertificates.filter(
          (taxcertificate) => {
            const releaseDate = dayjs.utc(
              taxcertificate.release_date.toString()
            );
            return releaseDate.year() === parseInt(filterDate as string);
          }
        );
        setTaxcertificates(filteredTaxCertificates);
      }
    }
  };

  return (
    <React.Fragment>
      <AdminAppBar>
        {!selectedTaxcertificates.length ? (
          <AdminToolbar title={t("taxcertificate.title")}>
            <Fab
              aria-label="add withholding tax slip"
              color="primary"
              onClick={() => handleOpenTaxCertificateDialog()}
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
            selected={selectedTaxcertificates}
          />
        )}
      </AdminAppBar>

      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <TaxCertificateTable
            processing={false}
            taxcertificates={taxcertificates}
            selected={selectedTaxcertificates}
            onSelectedChange={handleTaxCertificatesSelectedChange}
            onEdit={handleOpenTaxCertificateDialog}
            onDelete={handleOpenConfirmDeleteDialog}
            staffList={staffSelection as Staff[]}
            // onStaffFilterChange={handleStaffFilterChange}
            // onDateFilterChange={handleDateFilterChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              marginTop: 9,
              // marginBottom: 2,
            }}
          >
            <CardHeader title={t("taxcertificate.filter.title")} />
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
                  {t("taxcertificate.filter.options")}
                </InputLabel>
                <Select
                  // fullWidth
                  //   autoComplete="gender"
                  // // autofocus
                  size="small"
                  name="filter"
                  // margin='dense'
                  //   id="gender"
                  label={t("taxcertificate.filter.options")}
                  labelId="filter"
                  disabled={processing}
                  value={filterType}
                  onChange={(e) => {
                    setTaxcertificates([]);
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

                        if (initialTaxCertificates && newValue) {
                          const filteredPayslips =
                            initialTaxCertificates.filter(
                              (taxcertificate: TaxCertificate) => {
                                if (taxcertificate.staff?.japanese_name) {
                                  return taxcertificate.staff?.japanese_name
                                    .toLowerCase()
                                    .includes(val.japanese_name.toLowerCase());
                                }

                                return false;
                              }
                            );
                          setTaxcertificates(filteredPayslips);
                        } else {
                          setTaxcertificates([]);
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
                        margin="none"
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
                          value={filterDate || ""}
                          onChange={(e) => {
                            setFilterDate(e.target.value as string);
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

                    <Grid item xs={5}>
                      <Button
                        fullWidth
                        // disabled={!formik.dirty && !formik.isSubmitting}
                        // loading={processing}
                        type="submit"
                        size="small"
                        sx={{
                          paddingY: 1.2,
                        }}
                        variant="contained"
                        onClick={handleFilterTaxCertificate}
                      >
                        {t("taxcertificate.actions.filter")}
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
        description={t("taxcertificate.confirmations.delete")}
        pending={processing}
        onClose={handleCloseConfirmDeleteDialog}
        onConfirm={handleDeleteTaxCertificates}
        open={openConfirmDeleteDialog}
        title={t("common.confirmation")}
      />

      {openTaxcertificateDialog && (
        <TaxCertificateDialog
          onAdd={handleAddTaxCertificate}
          onClose={handleCloseTaxCertificateDialog}
          onUpdate={handleUpdateTaxCertificate}
          open={openTaxcertificateDialog}
          processing={processing}
          staffSelection={staffSelection}
          taxcertificate={taxcertificateUpdated}
        />
      )}
    </React.Fragment>
  );
};

export default TaxCertificateManagement;
