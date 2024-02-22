import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  ArrowRight as ArrowRightIcon,
  EmojiEmotions as EmojiEmotionsIcon,
  Favorite as FavoriteIcon,
  ThumbUp as ThumbUpIcon,
  Diversity3 as Diversity3Icon,
  QueryBuilder as QueryBuilderIcon,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OverallRecord } from "../../payslip/types/record";
import { useStaffSelect } from "../../staff/hooks/useStaffSelection";
import { useRecord } from "../../payslip/hooks/useRecord";

const OverallRecordsWidget = () => {
  const { t } = useTranslation();

  const { isLoading: isRecordLoading, data: records } = useRecord();
  const { isLoading: isStaffSelectionLoading, data: initialStaffSelect } =
    useStaffSelect();

  const [overallRecord, setOverallRecord] = useState<OverallRecord>({
    total_employees: initialStaffSelect ? initialStaffSelect.length : 0,
    total_hours: 0,
  });

  useEffect(() => {
    if (records) {
      setOverallRecord({
        ...overallRecord,
        total_hours: records.total_hours,
      });
    }
  }, [records]);

  const socials = [
    {
      bgcolor: "#388E3C",
      icon: <Diversity3Icon sx={{ color: "#fff" }} />,
      name: t("payslip.overview.totalEmployees"),
      trend: <ArrowDropUpIcon sx={{ color: "success.main" }} />,
      unitKey: "admin.home.followers.units.likes",
      value: `${overallRecord.total_employees}人`,
    },
    {
      bgcolor: "info.main",
      icon: <QueryBuilderIcon style={{ color: "#fff" }} />,
      name: t("payslip.overview.totalHoursWorked"),
      trend: <ArrowRightIcon sx={{ color: "action.disabled" }} />,
      unitKey: "admin.home.followers.units.love",
      value: `${overallRecord.total_hours} 作業時間`,
    },
  ];

  return (
    <React.Fragment>
      {socials.map((social) => (
        <Card key={social.name} sx={{ mb: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              aria-label={`${social.name} avatar`}
              sx={{ bgcolor: social.bgcolor, mr: 2 }}
            >
              {social.icon}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography component="div" variant="h6">
                {social.value}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="div">
                {t(social.name)}
              </Typography>
            </Box>
            {social.trend}
          </CardContent>
        </Card>
      ))}
    </React.Fragment>
  );
};

export default OverallRecordsWidget;
