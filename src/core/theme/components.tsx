/* eslint-disable @typescript-eslint/no-explicit-any */
import { Theme } from "@mui/material";

import {CheckCircle, RadioButtonUnchecked, RemoveCircle} from "@mui/icons-material"


export const createThemeComponents = (theme: Theme) => ({
  MuiAccordion: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(3),
        "&.Mui-expanded:last-of-type": {
          marginBottom: theme.spacing(3),
        },
        "&:before": {
          content: "none",
        },
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        padding: theme.spacing(1, 3, 3),
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        padding: theme.spacing(3),
      },
      content: {
        margin: 0,
      },
    },
  },
  MuiAppBar: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        "&.MuiAppBar-colorDefault": {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        color: "inherit",
        backgroundColor: theme.palette.background.default,
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        padding: "16px 24px",
        textTransform: "none" as any,
      },
      label: {
        fontWeight: theme.typography.fontWeightMedium,
      },
      text: {
        padding: "16px 16px",
      },
    },
  },
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true, // No more ripple, on the whole application
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root: {
        justifyContent: "flex-end",
        padding: "0 24px 24px 24px",
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: theme.spacing(3),
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: "24px 24px 0 24px",
      },
    },
  },
  MuiCheckbox: {
    defaultProps: {
      checkedIcon: <CheckCircle />,
      indeterminateIcon: <RemoveCircle />,
      icon: <RadioButtonUnchecked />,
    },
  },
  MuiChip: {
    styleOverrides: {
      label: {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: 24,
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        padding: 24,
        "& .MuiTypography-root": {
          fontSize: "1.25rem",
        },
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        border: "none; !important",
      },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        boxShadow: "none",
        lineHeight: "inherit",
        textTransform: "none" as any,
        "&.MuiFab-secondary": {
          color: theme.palette.text.primary,
        },
      },
    },
  },
  MuiFilledInput: {
    defaultProps: {
      disableUnderline: true,
    },
    styleOverrides: {
      root: {
        // borderRadius: theme.shape.borderRadius,
      },
    },
  },
  MuiInternalClock: {
    styleOverrides: {
      clock: {
        backgroundColor: theme.palette.background.default,
      },
    },
  },

  MuiInternalDateTimePickerTabs: {
    styleOverrides: {
      tabs: {
        backgroundColor: theme.palette.background.default,
        "& MuiTabs-indicator": {
          height: 0,
        },
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        height: 12,
      },
    },
  },
  MuiList: {
    defaultProps: {
      disablePadding: true,
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        // borderRadius: 12,
        paddingTop: 12,
        paddingBottom: 12,
        "&.Mui-selected": {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
      },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        minWidth: 40,
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      list: {
        paddingRight: 8,
        paddingLeft: 8,
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        paddingTop: 12,
        paddingBottom: 12,
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      input: {
        "&:-webkit-autofill": {
          WebkitBoxShadow: `0 0 0 30px ${theme.palette.background.paper} inset`,
        },
      },
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
    },
  },
  MuiRadio: {
    defaultProps: {
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      color: "primary" as "primary",
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        borderRadius: "12px",
        padding: "16px 16px",
        margin: "10px 5px",
        maxWidth: "initial !important",
        minHeight: "initial !important",
        minWidth: "initial !important",
        textTransform: "none" as any,
        "&.Mui-selected": {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        },
        "&.SubMui-selected": {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.secondary,
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: "24px 16px",
      },
      sizeSmall: {
        padding: "12px 16px",
      },
    },
  },
  MuiTimeline: {
    styleOverrides: {
      root: {
        padding: "0 0 0 16px",
      },
    },
  },
  MuiTimelineContent: {
    styleOverrides: {
      root: {
        padding: "12px 16px",
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        color: theme.palette.text.secondary,
        borderRadius: "12px !important",
        border: "none",
        textTransform: "none" as any,
        // padding: "10px 5px",
        "&.Mui-selected": {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        },
      },
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: {
        backgroundColor: theme.palette.background.default,
        padding: 5,
      },
    },
  },
  // MuiTextField: {
  //   styleOverrides: {
  //     root: {
  //       '& input[type="datetime-local"]::-webkit-datetime-edit-fields-wrapper': {
  //         /* Add your custom styles here */
  //         // For example:
  //         // fontSize: '16px',
  //         // border: '1px solid #ccc',
  //         // borderRadius: '4px',
  //         // padding: '8px',
  //         color: theme.palette.text.primary,
  //         padding: theme.spacing(1), // Adjust padding as needed
  //         borderRadius: theme.shape.borderRadius,
  //         backgroundColor: theme.palette.background.default,
  //       },
  //     },
  //   },
  // },
  // MuiTabs: {
  //   styleOverrides: {
  //     root: {
  //       "& MuiTabs-flexContainer": {
  //         borderRadius: "0px",
  //       },
  //     },
  //   },
  // },
  MuiTextareaAutosize: {
    styleOverrides: {
      root: {
        padding: theme.spacing(1), // Adjust padding as needed
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        fontSize: theme.typography.body1.fontSize,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.default,
        "&:focus": {
          borderColor: theme.palette.primary.main,
        },
      },
    },
  },
});
