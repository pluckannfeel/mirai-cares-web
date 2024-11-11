import {
  useTheme,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
} from "@mui/material";
import { TrendingUp as TrendingUpIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTotalServicesByPatient } from "../hooks/useTotalPatientServices";
import { useState, useEffect } from "react";

type TotalPatientServicesProps = {
  value?: number;
  selectedDate: string;
};

const TotalPatientServicesWidget = ({ value, selectedDate }: TotalPatientServicesProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const { data: initialData, isLoading } =
    useTotalServicesByPatient(selectedDate);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  // Function to truncate long labels with ellipsis
  const truncateLabel = (label: string) => {
    return label.length > 6 ? `${label.slice(0, 2)}...` : label;
  };

  const totalHours =
    data?.reduce((acc, item) => acc + (item.hours || 0), 0) || 0;

  return (
    <Card>
      <CardHeader
        sx={{
          color: "#9B1652",
        }}
        title={t("dashboard.totalServiceByPatientCurrentMonth.title")}
      />
      <CardContent>
        <ResponsiveContainer width="99%" height={250}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              //   bottom: 50, // Extra space for longer labels
            }}
          >
            {/* Add Cartesian Grid with dashed lines */}
            <CartesianGrid strokeDasharray="3 3" />

            {/* X Axis to display truncated names */}
            <XAxis
              dataKey="name"
              tickFormatter={truncateLabel}
              interval={0} // Show all labels
              tick={{ width: 50 }} // Limit tick width for ellipsis
            />

            {/* Y Axis to display values */}
            <YAxis />

            {/* Tooltip to show name and value */}
            <Tooltip
              formatter={(value: number) => [value, "時間"]}
              labelFormatter={(label: string) => t(label)}
              contentStyle={{
                borderRadius: 8,
                boxShadow: theme.shadows[3],
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.divider,
              }}
              itemStyle={{
                color: theme.palette.text.primary,
              }}
            />

            {/* Bar with primary color and no border radius */}
            <Bar
              dataKey="hours"
              //   fill={theme.palette.primary.main}
              fill="#9B1652"
              name={t("dashboard.hours")}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              label={{ position: "top", formatter: (value: any) => value }} // Add value on top of each bar
            />
          </BarChart>
        </ResponsiveContainer>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h2" component="div" marginBottom={1}>
              {value}
            </Typography>
            <Typography variant="h5" color="#9B1652" component="div">
              合計時間: {totalHours} 時間
            </Typography>
          </Box>
          <TrendingUpIcon sx={{ color: "text.secondary" }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalPatientServicesWidget;
