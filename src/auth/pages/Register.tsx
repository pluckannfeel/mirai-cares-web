import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import BoxedLayout from "../../core/components/BoxedLayout";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useRegister } from "../hooks/useRegister";
import { UserInfo } from "../types/userInfo";

// const genders = [
//   { label: 'auth.register.form.gender.options.f', value: 'F' },
//   { label: 'auth.register.form.gender.options.m', value: 'M' },
//   // { label: 'auth.register.form.gender.options.n', value: 'NC' },
// ];

const roles = [
  { label: "auth.register.form.role.options.admin", value: "Admin" },
  { label: "auth.register.form.role.options.manager", value: "Manager" },
  { label: "auth.register.form.role.options.staff", value: "Staff" },
  { label: "auth.register.form.role.options.user", value: "User" },
];

const Register = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  const { isRegistering, register } = useRegister();

  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      gender: "F",
      role: "user",
      last_name: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required(t("common.validations.required")),
      first_name: Yup.string()
        .max(20, t("common.validations.max", { size: 20 }))
        .required(t("common.validations.required")),
      last_name: Yup.string()
        .max(30, t("common.validations.max", { size: 30 }))
        .required(t("common.validations.required")),
      password: Yup.string()
        .min(8, t("common.validations.max", { size: 8 }))
        .required(t("commmon.validations.required")),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref("password"), ""], // should be null
          t("common.validations.passwordMatch")
        )
        .required(t("common.validations.required")),
    }),
    onSubmit: (values) => handleRegister(values),
  });

  const handleRegister = async (values: Partial<UserInfo>) => {
    // console.log(values)
    register(values as UserInfo)
      .then(() => {
        snackbar.success(t("auth.register.notifications.success"));
        navigate(`/login`);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  return (
    <BoxedLayout>
      <Typography component="h1" variant="h5">
        {t("auth.register.title")}
      </Typography>
      <Box
        component="form"
        marginTop={3}
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="last_name"
          label={t("auth.register.form.lastName.label")}
          name="last_name"
          autoComplete="family-name"
          autoFocus
          disabled={isRegistering}
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
          label={t("auth.register.form.firstName.label")}
          name="first_name"
          autoComplete="given-name"
          disabled={isRegistering}
          value={formik.values.first_name}
          onChange={formik.handleChange}
          error={formik.touched.first_name && Boolean(formik.errors.first_name)}
          helperText={formik.touched.first_name && formik.errors.first_name}
        />
        {/* <FormControl component='fieldset' margin='normal'>
          <FormLabel component='legend'>
            {t('auth.register.form.gender.label')}
          </FormLabel>
          <RadioGroup
            row
            aria-label='gender'
            name='gender'
            value={formik.values.gender}
            onChange={formik.handleChange}
          >
            {genders.map((gender) => (
              <FormControlLabel
                control={<Radio />}
                key={gender.value}
                disabled={isRegistering}
                label={t(gender.label)}
                value={gender.value}
              />
            ))}
          </RadioGroup>
        </FormControl> */}

        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">
            {t("auth.register.form.role.label")}
          </FormLabel>
          <RadioGroup
            row
            aria-label="role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
          >
            {roles.map((role) => (
              <FormControlLabel
                control={<Radio />}
                key={role.value}
                disabled={isRegistering}
                label={t(role.label)}
                value={role.value}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label={t("auth.register.form.email.label")}
          name="email"
          autoComplete="email"
          disabled={isRegistering}
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          type="password"
          label={t("auth.register.form.password.label")}
          name="password"
          autoComplete="password"
          disabled={isRegistering}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="confirmPassword"
          type="password"
          label={t("auth.register.form.confirmPassword.label")}
          name="confirmPassword"
          autoComplete="confirmPassword"
          disabled={isRegistering}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isRegistering}
          loading={isRegistering}
          sx={{ mt: 2 }}
        >
          {t("auth.register.submit")}
        </LoadingButton>
        <Button
          component={Link}
          to={`/login`}
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          {t("auth.register.back")}
        </Button>
      </Box>
    </BoxedLayout>
  );
};

export default Register;
