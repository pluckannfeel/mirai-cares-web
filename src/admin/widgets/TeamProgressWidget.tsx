import {
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMostTotalServicesByStaff } from "../hooks/useMostTotalServicesByStaff";
import { useEffect, useState } from "react";
import { MostServicesByStaff } from "../types/colibriData";

interface TeamProgressWidgetProps {
  selectedDate: string;
  formattedDate: string;
}

// const teams = [
//   {
//     id: "1",
//     color: "primary.main",
//     name: "Marketing Team",
//     progress: 75,
//     value: 122,
//   },
//   {
//     id: "2",
//     color: "warning.main",
//     name: "Operations Team",
//     progress: 50,
//     value: 82,
//   },
//   {
//     id: "3",
//     color: "error.main",
//     name: "Sales Team",
//     progress: 25,
//     value: 39,
//   },
//   {
//     id: "4",
//     color: "text.secondary",
//     name: "Research Team",
//     progress: 10,
//     value: 9,
//   },
// ];

const TeamProgressWidget = ({
  selectedDate,
  formattedDate,
}: TeamProgressWidgetProps) => {
  const { t } = useTranslation();

  const { data: initialData, isLoading } =
    useMostTotalServicesByStaff(selectedDate);

  const [teams, setTeams] = useState(initialData);

  useEffect(() => {
    if (initialData) {
      setTeams(initialData);
    }
  }, [initialData]);

  if (teams == undefined) return null;

  return (
    <Card>
      <CardHeader
        title={`${t("dashboard.teams.most_services", {
          month: formattedDate,
        })} `}
      />
      <CardContent sx={{ px: 2 }}>
        <TableContainer>
          <Table
            aria-label="team progress table"
            size="small"
            sx={{
              "& td, & th": {
                border: 0,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("dashboard.teams.columns.team")}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("dashboard.teams.columns.progress")} {`（300時間）`}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  {/* {t("dashboard.teams.columns.value")} */}
                  時間
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>
                    <Typography
                      color={team.color}
                      fontWeight={"bolder"}
                      component="div"
                    >
                      {team.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ width: "100%", mr: 3 }}>
                        <LinearProgress
                          aria-label={`${team.name} progress`}
                          color="inherit"
                          sx={{ color: team.color }}
                          value={team.progress}
                          variant="determinate"
                        />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography
                          component="span"
                          variant="h6"
                          color={team.color}
                        >{`${team.progress}%`}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">{team.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default TeamProgressWidget;
