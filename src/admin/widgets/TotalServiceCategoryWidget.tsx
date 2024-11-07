// by category
// general and group home

import { Card, CardContent, CardHeader, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTotalServicesByType } from "../hooks/useTotalServicesByType";
import { useEffect, useState } from "react";

const RADIAN = Math.PI / 180;

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: LabelProps) => {
  // Hide labels for slices with less than 15% of the total
  if (percent * 100 < 15) return null;

  // Calculate radius and label position
  const radius = innerRadius + (outerRadius - innerRadius) * 0.32; // Adjusted for better centering
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={16}
      fontWeight={"bolder"}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const TotalServiceCategoryWidget = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const { data: initialData, isLoading } = useTotalServicesByType();
  const [data, setData] = useState(initialData);

  // Update data when initialData changes
  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  return (
    <Card>
      <CardHeader
        title={t("dashboard.totalServiceByType.title")}
        sx={{
          color: "#E6274F",
        }}
      />
      <CardContent>
        <ResponsiveContainer width="99%" height={300}>
          <PieChart width={300} height={300}>
            <Pie
              dataKey="value"
              data={data}
              cx="50%"
              cy="50%"
              label={renderCustomizedLabel}
              labelLine={false}
              fill="#8884d8"
              outerRadius={110}
              stroke={theme.palette.background.paper}
              //   isAnimationActive={true} // Enable animations
              //   animationDuration={5000}
              //   strokeWidth={2}
            />

            <Tooltip
              contentStyle={{
                borderRadius: 16,
                boxShadow: theme.shadows[3],
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.background.paper,
              }}
              itemStyle={{
                color: theme.palette.text.primary,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 16 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TotalServiceCategoryWidget;
