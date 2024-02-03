import React, { useState } from "react";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  icon: React.ElementType;
  key: string;
  path?: string;
  children?: MenuItem[];
}

interface MenuItemComponentProps {
  item: MenuItem;
  level?: number;
}

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
  item,
  level = 0,
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const hasChildren = Boolean(item.children && item.children.length > 0);

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{ pl: level * 2 }}
      >
        <ListItemIcon>
          <item.icon />
        </ListItemIcon>
        <ListItemText primary={t(item.key)} />
        {hasChildren ? open ? <ExpandLess /> : <ExpandMore /> : null}
      </ListItemButton>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children?.map((child, index) => (
              <MenuItemComponent item={child} level={level + 1} key={index} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default MenuItemComponent;
