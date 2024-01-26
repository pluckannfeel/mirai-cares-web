import { Card, CardContent, Typography } from "@mui/material";

type OverviewWidgetProps = {
  backgroundColor?: string;
  color?: "primary" | "warning" | "error";
  description: string;
  title: string;
};

const OverviewWidget = ({
  backgroundColor,
  description,
  title,
}: OverviewWidgetProps) => {
  return (
    <Card>
      <CardContent
        sx={{ textAlign: "center", backgroundColor: backgroundColor }}
      >
        <Typography gutterBottom component="div" color="#fff" variant="h3">
          {title}
        </Typography>
        <Typography variant="h6" color="#FFF" component="p">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OverviewWidget;
