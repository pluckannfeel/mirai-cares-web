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
} from "@mui/material";
import React, { useState } from "react";
import { FilterDate } from "../../payslip/types/payslip";
import { useTranslation } from "react-i18next";
import {
  japaneseMonthObjects,
  months,
  years,
} from "../../payslip/helpers/helper";
import { useStaffTimeCalculation } from "../hooks/useStaffTimeCalculation";
import dayjs from "dayjs";
import TimeCalculationTable from "../components/TimeCalculationTable";

const TimeCalculationSheetTab = () => {
  const { t, i18n } = useTranslation();

  // Get the current date
  const currentDate = dayjs();
  // Format the date to "YYYY-MM"
  //   const currentDateYearMonth = currentDate.format("YYYY-MM");

  // Get the year and month separately
  const year = currentDate.year();
  const month = currentDate.month() + 1;

  const [filterDate, setFilterDate] = useState<FilterDate>({
    year: year.toString(),
    month: month.toString(),
  });

  // get the current date year and date month by dayjs and format it to string to e.g "2024-02"

  const { data: records, isLoading } = useStaffTimeCalculation(
    `${filterDate.year}-${filterDate.month}`
  );

  const processing = isLoading;

  //   console.log(records);

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {/* Use the remaining 1/4 of the area, and revert to full width on extra-small screens */}
        <Grid item xs={12} sm={2}>
          <Card
          // sx={{
          //   marginBottom: 2,
          // }}
          >
            <CardHeader
              sx={{ textAlign: "center" }}
              title={t("salaryCalculation.table.filter.date")}
            />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
                            <MenuItem key={option.value} value={option.value}>
                              {t(option.label)}
                            </MenuItem>
                          ))
                        : japaneseMonthObjects.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {t(option.label)}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Offset 3/4 of the area */}
        <Grid item xs={12} sm={10}></Grid>

        {/* Table */}
        <Grid item xs={12}>
          <TimeCalculationTable
            onDelete={() => {}}
            onEdit={() => {}}
            selected={[]}
            onSelectedChange={() => {}}
            timeRecords={records || []}
            processing={processing}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default TimeCalculationSheetTab;
