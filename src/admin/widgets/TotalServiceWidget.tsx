import { Card, CardContent, CardHeader, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTotalServices } from "../hooks/useTotalServices";
import { useState } from "react";
import { Services } from "../types/colibriData";

// const data = [
//   {
//     name: "Jan",
//     pv: 2400,
//   },
//   {
//     name: "Feb",
//     pv: 1398,
//   },
//   {
//     name: "Mar",
//     pv: 9800,
//   },
//   {
//     name: "Apr",
//     pv: 3908,
//   },
//   {
//     name: "May",
//     pv: 4800,
//   },
//   {
//     name: "Jun",
//     pv: 3800,
//   },
//   {
//     name: "Jul",
//     pv: 4300,
//   },
// ];

const TotalServiceWidget = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const { data: initialData, isLoading } = useTotalServices();

  const [data, setData] = useState(initialData);

  return (
    <Card>
      <CardHeader sx={{
        color: "#84398E"
      }} title={t("dashboard.totalService.title")} />
      <CardContent>
        <ResponsiveContainer width="99%" height={244}>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 16,
              left: 16,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray={"3 3"} />
            <XAxis
              axisLine={false}
              // tick={{ fill: theme.palette.text.primary, fontSize: 18 }}
              tick={{ fill: "#84398E", fontSize: 18 }}
              tickLine={false}
              dataKey="month"
              padding={{ left: 20, right: 20}}
              
            />
            <YAxis domain={['dataMin - 10', 'dataMax']} hide padding={{ bottom: 20 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                boxShadow: theme.shadows[3],
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.background.paper,
              }}
            />
            <Line
              name="Value"
              type="monotone"
              dataKey="service_hours"
              // stroke={theme.palette.primary.light}
              stroke="#84398E"
              strokeWidth={4}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TotalServiceWidget;
