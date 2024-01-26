// import FormControl from '@material-ui/core/FormControl';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormLabel from '@material-ui/core/FormLabel';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';

import {
  Button,
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
import { useUpdateProfileInfo } from "../../admin/hooks/useUpdateProfileInfo";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
// import { useProfileInfo } from "../hooks/useProfileInfo";
import { ProfileInfo } from "../types/profileInfo";
import { useAuth } from "../../auth/contexts/AuthProvider";

// const genders = [
//   { label: 'profile.info.form.gender.options.f', value: 'F' },
//   { label: 'profile.info.form.gender.options.m', value: 'M' },
//   // { label: "profile.info.form.gender.options.n", value: "NC" },
// ];

const ProfileInformation = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();

  // call useAuth to get the email from userInfo
  const { userInfo: data } = useAuth();

  

  // const {
  //   data,
  //   // refetch
  // } = useProfileInfo(userInfo?.email);

  // console.log("userInfo", data);
  const { isUpdating, updateProfileInfo } = useUpdateProfileInfo();
  const formik = useFormik({
    initialValues: {
      email: data ? data.email : "",
      firstName: data ? data.first_name : "",
      // gender: data ? data.gender : undefined,
      job: data ? data.job : "",
      lastName: data ? data.last_name : "",
      phone: data ? data.phone : "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("common.validations.email"))
        .required(t("common.validations.required")),
      firstName: Yup.string()
        .max(20, t("common.validations.max", { size: 20 }))
        .required(t("common.validations.required")),
      lastName: Yup.string()
        .max(30, t("common.validations.max", { size: 30 }))
        .required(t("common.validations.required")),
    }),
    onSubmit: (values) => handleSubmit(values),
  });

  const handleSubmit = async (values: Partial<ProfileInfo>) => {
    // resets the data when re-rendered
    // refetch();

    updateProfileInfo({
      ...values,
      id: data?.id,
      role: data?.role,
    } as ProfileInfo)
      .then(() => {
        snackbar.success(t("profile.notifications.informationUpdated"));
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <Card>
        <CardHeader title={t("profile.info.title")} />
        <CardContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label={t("profile.info.form.lastName.label")}
            name="lastName"
            autoComplete="family-name"
            autoFocus
            disabled={isUpdating}
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label={t("profile.info.form.firstName.label")}
            name="firstName"
            autoComplete="given-name"
            disabled={isUpdating}
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
          {/* <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">
              {t("profile.info.form.gender.label")}
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
            label={t("profile.info.form.email.label")}
            name="email"
            autoComplete="email"
            disabled={isUpdating}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          {/* newly added fields */}

          <TextField
            margin="normal"
            // required
            fullWidth
            id="phone"
            label={t("profile.info.form.phone.label")}
            name="phone"
            autoComplete="phone"
            disabled={isUpdating}
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />

          <TextField
            margin="normal"
            // required
            fullWidth
            id="job"
            label={t("profile.info.form.job.label")}
            name="job"
            autoComplete="job"
            disabled={isUpdating}
            value={formik.values.job}
            onChange={formik.handleChange}
            error={formik.touched.job && Boolean(formik.errors.job)}
            helperText={formik.touched.job && formik.errors.job}
          />
        </CardContent>
        <CardActions>
          <Button onClick={() => formik.resetForm()}>
            {t("common.reset")}
          </Button>
          <LoadingButton loading={isUpdating} type="submit" variant="contained">
            {t("common.update")}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
};

export default ProfileInformation;
