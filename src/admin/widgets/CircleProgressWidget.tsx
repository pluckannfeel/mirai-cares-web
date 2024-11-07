import { Card, CardContent, CardHeader, useTheme } from "@mui/material";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

type CircleProgressWidgetProps = {
  height?: number;
  title: string;
  value: number;
};

const CircleProgressWidget = ({
  height = 120,
  title,
  value,
}: CircleProgressWidgetProps) => {
  const theme = useTheme();

  return (
    <Card>
      <CardHeader title={title} sx={{ color: "#45525C" }} />
      <CardContent>
        <ResponsiveContainer width="99%" height={height}>
          <RadialBarChart
            innerRadius="85%"
            outerRadius="85%"
            barSize={32}
            // data={[{ fill: theme.palette.primary.main, value }]}
            data={[{ fill: "#5DBCA4", value }]}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              dataKey={"value"}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              cornerRadius={16}
              label={{
                // fill: theme.palette.text.primary,
                fill: "#4AB15F",
                fontSize: theme.typography.h1.fontSize,
                fontWeight: theme.typography.h1.fontWeight,
                position: "center",
              }}
              background={{ fill: theme.palette.background.default }}
              dataKey="value"
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CircleProgressWidget;
