import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

function not(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly string[], b: readonly string[]) {
  return [...a, ...not(b, a)];
}

interface TransferListProps {
  leftHeaderLabel: string;
  rightHeaderLabel: string;
  leftItems: string[];
  rightItems: string[];
  onChange: (newLeft: string[], newRight: string[]) => void;
}

export default function SelectAllTransferList({
  leftHeaderLabel,
  rightHeaderLabel,
  leftItems,
  rightItems,
  onChange,
}: TransferListProps) {
  const [checked, setChecked] = React.useState<readonly string[]>([]);

  const leftChecked = intersection(checked, leftItems);
  const rightChecked = intersection(checked, rightItems);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly string[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly string[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    const newRightItems = rightItems
      .concat(leftChecked)
      .sort((a, b) => parseInt(a) - parseInt(b)); // Sort numerically
    const newLeftItems = not(leftItems, leftChecked).sort(
      (a, b) => parseInt(a) - parseInt(b)
    ); // Sort numerically
    onChange(newLeftItems, newRightItems); // Update both left and right
    setChecked(not(checked, leftChecked)); // Clear checked items
  };

  const handleCheckedLeft = () => {
    const newLeftItems = leftItems
      .concat(rightChecked)
      .sort((a, b) => parseInt(a) - parseInt(b)); // Sort numerically
    const newRightItems = not(rightItems, rightChecked).sort(
      (a, b) => parseInt(a) - parseInt(b)
    ); // Sort numerically
    onChange(newLeftItems, newRightItems); // Update both left and right
    setChecked(not(checked, rightChecked)); // Clear checked items
  };

  const customList = (title: React.ReactNode, items: readonly string[]) => (
    <Card sx={{ width: 300, border: "1px solid #D68FA3" }}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length}`}
      />
      <Divider />
      <List
        sx={{
          width: "100%",
          height: 250,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: string) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItemButton
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value}日`} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid
      container
      spacing={2}
      sx={{ justifyContent: "left", alignItems: "center" }}
    >
      <Grid item>{customList(leftHeaderLabel, leftItems)}</Grid>
      <Grid item>
        <Grid container direction="column" sx={{ alignItems: "center" }}>
          <Button
            sx={{ my: 1 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            {/* &gt; */}
            <ChevronRightIcon />
          </Button>
          <Button
            sx={{ my: 1 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            {/* &lt; */}
            <ChevronLeftIcon />
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(rightHeaderLabel, rightItems)}</Grid>
    </Grid>
  );
}
