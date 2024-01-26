import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  ArrowRight as ArrowRightIcon,
  EmojiEmotions as EmojiEmotionsIcon,
  Favorite as FavoriteIcon,
  ThumbUp as ThumbUpIcon,
} from "@mui/icons-material";
import React from "react";
import { useTranslation } from "react-i18next";

const socials = [
  {
    bgcolor: "primary.main",
    icon: <ThumbUpIcon sx={{ color: "#fff" }} />,
    name: "Likes",
    trend: <ArrowDropUpIcon sx={{ color: "success.main" }} />,
    unitKey: "admin.home.followers.units.likes",
    value: "26,789",
  },
  {
    bgcolor: "error.main",
    icon: <FavoriteIcon style={{ color: "#fff" }} />,
    name: "Love",
    trend: <ArrowRightIcon sx={{ color: "action.disabled" }} />,
    unitKey: "admin.home.followers.units.love",
    value: "6,754",
  },
  {
    bgcolor: "warning.main",
    icon: <EmojiEmotionsIcon style={{ color: "#fff" }} />,
    name: "Smiles",
    trend: <ArrowDropDownIcon sx={{ color: "error.main" }} />,
    unitKey: "admin.home.followers.units.smiles",
    value: "52,789",
  },
];

const FollowersWidget = () => {
  const { t } = useTranslation();

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

export default FollowersWidget;
