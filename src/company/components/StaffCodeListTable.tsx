import React, { useEffect, useState } from "react";
import { FixedSizeList } from "react-window";
import {
  TableContainer,
  Avatar,
  Typography,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
  TableHead,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { Staff } from "../../staff/types/staff";
import Empty from "../../core/components/Empty";

type StaffRowProps = {
  index: number;
  processing: boolean;
  staff: Staff;
  style: React.CSSProperties; // Make sure to include the style prop
};

const StaffRow = ({ index, processing, staff, style }: StaffRowProps) => {
  return (
    <div style={style}>
      <ListItem alignItems="flex-start" key={staff.id}>
        <ListItemAvatar>
          {!staff.img_url ? (
            <Avatar
              sx={{
                mr: 5,
                width: 75,
                height: 75,
                backgroundColor: "transparent",
              }}
              variant="rounded"
            >
              <PersonIcon sx={{ fontSize: 75 }} />
            </Avatar>
          ) : (
            <Avatar
              sx={{
                mr: 5,
                width: 75,
                height: 75,
                backgroundColor: "transparent",
              }}
              src={staff.img_url ? staff.img_url.toString() : ""}
              variant="rounded"
            />
          )}
        </ListItemAvatar>
        <ListItemText
          sx={{ marginTop: "1rem" }}
          primary={
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="h4"
                color="text.primary"
              >
                {staff.japanese_name}
              </Typography>
              <Typography
                sx={{ display: "inline", padding: 1, borderRadius: 1, jus: "center" }}
                component="span"
                variant="h4"
                bgcolor={staff.staff_code ? "primary.main" : "warning.main"}
                color="black"
              >
                {staff.staff_code ? staff.staff_code : "コード無し"}
              </Typography>
            </Box>
          }
          secondary={
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="h4"
              color="text.primary"
            >
              {staff.english_name}
            </Typography>
          }
        />
      </ListItem>
      <Divider variant="fullWidth" component="li" />
    </div>
  );
};

type StaffTableProps = {
  processing: boolean;
  staffs?: Staff[];
};

const StaffCodeListTable = ({ processing, staffs = [] }: StaffTableProps) => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Update the height if the window is resized
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (staffs.length === 0) {
    return <Empty title="No staff yet" />;
  }

  return (
    <React.Fragment>
      <Typography
            // sx={{ display: "inline" }}
            component="span"
            variant="h3"
            color="text.primary"
          >
            スタッフ一覧
          </Typography>
      <TableContainer>
        <FixedSizeList
          height={windowHeight}
          itemCount={staffs.length}
          itemSize={100}
          width={720}
          style={{
            marginTop: "1rem",
            maxWidth: 720,
            width: "100%",
            backgroundColor: "white",
            listStyle: "none",
            borderRadius: "5px",
          }}
        >
          {({ index, style }) => (
            <StaffRow
              index={index}
              processing={processing}
              staff={staffs[index]}
              style={style} // Apply the style prop to ensure virtualization
            />
          )}
        </FixedSizeList>
      </TableContainer>
    </React.Fragment>
  );
};

export default StaffCodeListTable;
