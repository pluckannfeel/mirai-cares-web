// from @mui/material import all required above
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  ChevronRight as ChevronRightIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { useUsers } from "../../users/hooks/useUsers";

// const users = [
//   {
//     id: "1",
//     firstName: "Rhys",
//     gender: "M",
//     lastName: "Arriaga",
//     role: "Admin",
//   },
//   {
//     id: "2",
//     firstName: "Laura",
//     gender: "F",
//     lastName: "Core",
//     role: "Member",
//   },
//   {
//     id: "3",
//     firstName: "Joshua",
//     gender: "M",
//     lastName: "Jagger",
//     role: "Member",
//   },
// ];

const UsersWidget = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { data: users } = useUsers();

  return (
    <Card>
      <CardHeader title={t("dashboard.users.title")} />
      <CardContent>
        <List>
          {users &&
            users.map((user, index) => (
              <ListItem disableGutters key={user.id}>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${user.last_name} ${user.first_name}`}
                  primaryTypographyProps={{
                    fontWeight: theme.typography.fontWeightMedium,
                  }}
                  secondary={user.role}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    aria-label="Go to user details"
                    component={RouterLink}
                    edge="end"
                    // to={`/${process.env.PUBLIC_URL}/admin/user-management`}
                    to={`/admin/user-management`}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UsersWidget;
