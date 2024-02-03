import {
  MenuItem,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  TextField,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { User } from "../types/user";

// const genders = [
//   { label: "userManagement.form.gender.options.f", value: "F" },
//   { label: "userManagement.form.gender.options.m", value: "M" },
//   { label: "userManagement.form.gender.options.n", value: "NC" },
// ];
// const roles = ["Admin", "Member"];
const roles = [
  { label: "auth.register.form.role.options.admin", value: "Admin" },
  { label: "auth.register.form.role.options.manager", value: "Manager" },
  { label: "auth.register.form.role.options.staff", value: "Staff" },
  { label: "auth.register.form.role.options.user", value: "User" },
];

type UserDialogProps = {
  onAdd: (user: Partial<User>) => void;
  onClose: () => void;
  onUpdate: (user: User) => void;
  open: boolean;
  processing: boolean;
  user?: User;
};

const UserDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  user,
}: UserDialogProps) => {
  const { t } = useTranslation();

  const editMode = Boolean(user && user.id);

  const handleSubmit = (values: Partial<User>) => {
    if (user && user.id) {
      onUpdate({ ...values, id: user.id } as User);
    } else {
      onAdd(values);
    }
  };

  const formik = useFormik({
    initialValues: {
      disabled: user ? user.disabled : false,
      email: user ? user.email : "",
      first_name: user ? user.first_name : "",
      // gender: user ? user.gender : "F",
      last_name: user ? user.last_name : "",
      role: user ? user.role : "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("common.validations.email"))
        .required(t("common.validations.required")),
      first_name: Yup.string()
        .max(20, t("common.validations.max", { size: 20 }))
        .required(t("common.validations.required")),
      last_name: Yup.string()
        .max(30, t("common.validations.max", { size: 30 }))
        .required(t("common.validations.required")),
      role: Yup.string().required(t("common.validations.required")),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="user-dialog-title">
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="user-dialog-title">
          {editMode
            ? t("userManagement.modal.edit.title")
            : t("userManagement.modal.add.title")}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="last_name"
            label={t("userManagement.form.last_name.label")}
            name="last_name"
            autoComplete="family-name"
            autoFocus
            disabled={processing}
            value={formik.values.last_name}
            onChange={formik.handleChange}
            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
            helperText={formik.touched.last_name && formik.errors.last_name}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="first_name"
            label={t("userManagement.form.first_name.label")}
            name="first_name"
            autoComplete="given-name"
            disabled={processing}
            value={formik.values.first_name}
            onChange={formik.handleChange}
            error={
              formik.touched.first_name && Boolean(formik.errors.first_name)
            }
            helperText={formik.touched.first_name && formik.errors.first_name}
          />
          {/* <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">
              {t("userManagement.form.gender.label")}
            </FormLabel>
            <RadioGroup
              row
              aria-label="gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
            >
              {genders.map((gender) => (
                <FormControlLabel
                  key={gender.value}
                  disabled={processing}
                  value={gender.value}
                  control={<Radio />}
                  label={t(gender.label)}
                />
              ))}
            </RadioGroup>
          </FormControl> */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t("userManagement.form.email.label")}
            name="email"
            autoComplete="email"
            disabled={processing}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin="normal"
            required
            id="role"
            disabled={processing}
            fullWidth
            select
            label={t("userManagement.form.role.label")}
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
          >
            {roles.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {t(role.label)}
              </MenuItem>
            ))}
          </TextField>
          <FormControl component="fieldset" margin="normal">
            <FormControlLabel
              name="disabled"
              disabled={processing}
              onChange={formik.handleChange}
              checked={formik.values.disabled}
              control={<Checkbox />}
              label={t("userManagement.form.disabled.label")}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <LoadingButton loading={processing} type="submit" variant="contained">
            {editMode
              ? t("userManagement.modal.edit.action")
              : t("userManagement.modal.add.action")}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserDialog;
