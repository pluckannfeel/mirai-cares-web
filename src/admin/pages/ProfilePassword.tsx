import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useUpdatePassword } from "../../auth/hooks/useUpdatePassword";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useAuth } from "../../auth/contexts/AuthProvider";

const ProfilePassword = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  const { isUpdating, updatePassword } = useUpdatePassword();

  const { userInfo } = useAuth();

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .min(8, t("common.validations.min", { size: 8 }))
        .required(t("common.validations.required")),
      newPassword: Yup.string()
        .min(8, t("common.validations.min", { size: 8 }))
        .required(t("common.validations.required")),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], t("common.validations.passwordMatch"))
        .required(t("common.validations.required")),
    }),
    onSubmit: (values) =>
      handleUpdatePassword(values.oldPassword, values.newPassword),
  });

  const handleUpdatePassword = async (
    oldPassword: string,
    newPassword: string
  ) => {
    updatePassword({
      oldPassword,
      newPassword,
      email: userInfo!.email,
    })
      .then(() => {
        formik.resetForm();
        snackbar.success(t("profile.notifications.passwordChanged"));
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <Card>
        <CardHeader title={t("profile.password.title")} />
        <CardContent>
          <TextField
            margin="normal"
            required
            fullWidth
            name="oldPassword"
            label={t("profile.password.form.current.label")}
            type="password"
            id="oldPassword"
            autoComplete="current-password"
            disabled={isUpdating}
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
            }
            helperText={formik.touched.oldPassword && formik.errors.oldPassword}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label={t("profile.password.form.new.label")}
            type="password"
            id="newPassword"
            disabled={isUpdating}
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
            helperText={formik.touched.newPassword && formik.errors.newPassword}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label={t("profile.password.form.confirm.label")}
            type="password"
            id="confirmPassword"
            disabled={isUpdating}
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
        </CardContent>
        <CardActions>
          <LoadingButton type="submit" loading={isUpdating} variant="contained">
            {t("common.update")}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
};

export default ProfilePassword;
