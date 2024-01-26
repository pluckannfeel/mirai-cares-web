import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { Licenses, Staff } from "../types/staff";
import {
  FormHelperText,
  Grid,
  InputLabel,
  Select,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import ClickableAvatar from "../../core/components/ClickableAvatar";
import { useState } from "react";
import { duty_types, genders } from "../helpers/helper";
import { DatePicker, LoadingButton } from "@mui/lab";
// import { DesktopTimePicker } from "@mui/x-date-pickers";
import SelectAddField from "../../core/components/SelectAddField";
import {
  filterMunicipalitiesByPrefecture,
  getAddressByPostalCode,
  trimName,
} from "../../helpers/helper";

// icon
import CloseIcon from "@mui/icons-material/Close";
import LicenseFileMenu from "./LicenseFileMenu";
import { usePrefectures } from "../hooks/useAddressPrefectures";
import { useMunicipalities } from "../hooks/useAddressMunicipalities";
import { usePostalCodes } from "../hooks/useAddressPostalCode";
import { PostalCode } from "../types/address";
import ImageFileMenu from "../../core/components/ImageFileMenu";

type StaffDialogProps = {
  onAdd: (
    staff: Partial<Staff>,
    imageFile: File | null,
    licenses: Licenses[] | []
  ) => void;
  onClose: () => void;
  onUpdate: (
    staff: Partial<Staff>,
    imageFile: File | null,
    id: string,
    licenses: Licenses[] | []
  ) => void;
  open: boolean;
  processing: boolean;
  staff?: Staff;
};

const StaffDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  staff,
}: StaffDialogProps) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const { data: prefectures } = usePrefectures();
  const { data: municipalities } = useMunicipalities();
  const { data: postalCodes } = usePostalCodes();

  // display photo staff
  const [imageFile, setImageFile] = useState<File | null>(null);

  // selected prefecture state
  const [selectedPrefecture, setSelectedPrefecture] = useState<
    string | undefined
  >(staff?.prefecture);

  // jp yuuchou bank switch
  const [isJPBankChecked, setIsJPBankChecked] = useState<boolean>(false);

  // foreigner  switch
  const [isForeigner, setIsForeigner] = useState<boolean>(
    staff?.passport_details ? true : false
  );

  // to know if dialog is in create or update state
  const editMode = Boolean(staff && staff.id);

  const staff_id = staff ? staff.id : null;

  // image file change handler
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // capture menu item click
  const handleIconButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // staff image
  const handleStaffImageFileSelect = (file: File | null) => {
    setImageFile(file);

    handleClose();

    // set formik to dirty
    formik.setFieldTouched("img_url", false);
  };

  const [items, setItems] = useState<string[]>([]);

  //select add
  const handleAddAffiliationItem = (newItem: string) => {
    // Add the new item to your data or perform any necessary actions
    setItems([...items, newItem]);
  };

  const affiliationHandler = (value: string) => {
    formik.setFieldValue("affiliation", value);
  };

  const initialValues: Partial<Staff> = {
    img_url: staff ? staff.img_url : "",
    affiliation: staff ? staff.affiliation : "",
    // staff_group: staff ? staff.staff_group : "",
    staff_code: staff ? staff.staff_code : "",
    japanese_name: staff ? staff.japanese_name : "",
    english_name: staff ? staff.english_name : "",
    nickname: staff ? staff.nickname : "",
    join_date: staff?.join_date,
    leave_date: staff?.leave_date,
    gender: staff ? staff.gender : "",
    birth_date: staff?.birth_date,
    postal_code: staff ? staff.postal_code : "",
    prefecture: staff ? staff.prefecture : "",
    municipality: staff ? staff.municipality : "",
    job_position: staff ? staff.job_position : "",
    duty_type: staff ? staff.duty_type : "",
    town: staff ? staff.town : "",
    building: staff ? staff.building : "",
    nationality: staff ? staff.nationality : "",
    phone_number: staff ? staff.phone_number : "",
    personal_email: staff ? staff.personal_email : "",
    work_email: staff ? staff.work_email : "",
    koyou_keitai: staff ? staff.koyou_keitai : "",
    zaishoku_joukyou: staff ? staff.zaishoku_joukyou : "",
    licenses: staff?.licenses ? staff?.licenses : [],
    customer_number: staff ? staff.customer_number : "",
    bank_name: staff ? staff.bank_name : "",
    branch_name: staff ? staff.branch_name : "",
    account_type: staff ? staff.account_type : "",
    account_number: staff ? staff.account_number : "",
    account_name: staff ? staff.account_name : "",
    bank_card_images: staff?.bank_card_images ? staff?.bank_card_images : {},
    passport_details: staff?.passport_details ? staff?.passport_details : {},
    residence_card_details: staff?.residence_card_details ?? {},
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      affiliation: Yup.string().required(t("common.validations.required")),
      japanese_name: Yup.string().required(t("common.validations.required")),
      english_name: Yup.string().required(t("common.validations.required")),
      phone_number: Yup.string()
        .required(t("common.validations.required"))
        .max(13, t("common.validations.max")),
      licenses: Yup.array().of(
        Yup.object().shape({
          // number: Yup.string().required("Number is required"),
          // name: Yup.string().required("Name is required"),
          // date: Yup.date().required("Date is required"),
          // file: Yup.string().required("File URL is required"),
        })
      ),
    }),
    onSubmit: (values: Partial<Staff>) => {
      if (staff_id) {
        onUpdate(values, imageFile, staff_id, values.licenses as Licenses[]);
      } else {
        onAdd(values, imageFile, values.licenses as Licenses[]);
      }
    },
  });

  // licenses
  const handleAddLicenses = () => {
    formik.setFieldValue("licenses", [
      ...(formik.values.licenses ?? []),
      {
        // number: "",
        // name: "",
        // date: "",
        file: null,
      },
    ]);
  };

  const handleRemoveLicenses = (index: number) => {
    const newLicense = [...(formik.values.licenses ?? [])];
    newLicense.splice(index, 1);
    formik.setFieldValue("licenses", newLicense);
  };

  // postal code blur
  const handlePostalCodeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const postalCode = e.target.value;

    const completeAddress: PostalCode[] | undefined = getAddressByPostalCode(
      postalCodes,
      postalCode
    );
    // set prefecture, municipality, town value
    if (completeAddress && completeAddress.length > 0) {
      // check if completeAddress[0].jp_prefecture if not dont set

      setSelectedPrefecture(completeAddress[0].jp_prefecture);
      formik.setFieldValue("prefecture", completeAddress[0].jp_prefecture);
      formik.setFieldValue("municipality", completeAddress[0].jp_municipality);
      if (currentLanguage === "ja")
        formik.setFieldValue("town", completeAddress[0].jp_town);
    }
  };

  // staff bank card image front
  const handleBankCardImageFrontSelect = (file: File | null) => {
    // set bank card image front in formik
    formik.setFieldValue("bank_card_images", {
      ...formik.values.bank_card_images,
      front: file as File,
    });
    handleClose();

    // set formik to dirty
    formik.setFieldTouched("bank_card_images", true);
  };

  const handleBankCardImageBackSelect = (file: File | null) => {
    formik.setFieldValue("bank_card_images", {
      ...formik.values.bank_card_images,
      back: file as File,
    });
    handleClose();

    // set formik to dirty
    formik.setFieldTouched("bank_card_images", true);
  };

  // staff residence card image front
  const handleResidenceCardImageFrontSelect = (file: File | null) => {
    // set residence card image front in formik
    formik.setFieldValue("residence_card_details", {
      ...formik.values.residence_card_details,
      front: file as File,
    });
    handleClose();

    // set formik to dirty
    formik.setFieldTouched("residence_card_details", true);
  };

  const handleResidenceCardImageBackSelect = (file: File | null) => {
    formik.setFieldValue("residence_card_details", {
      ...formik.values.residence_card_details,
      back: file as File,
    });
    handleClose();

    // set formik to dirty
    formik.setFieldTouched("residence_card_details", true);
  };

  // passport details file
  const handlePassportImageSelect = (file: File | null) => {
    formik.setFieldValue("passport_details", {
      ...formik.values.passport_details,
      file: file as File,
    });
    handleClose();

    // set formik to dirty
    formik.setFieldTouched("passport_details.file", true);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={"xl"}
      aria-labelledby="staff-dialog-title"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="staff-dialog-title">
          {editMode
            ? t("staffManagement.modal.edit.title")
            : t("staffManagement.modal.add.title")}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                // marginTop={1}
                marginBottom={1}
                variant="h6"
                textAlign="center"
                gutterBottom
              >
                {t("staffManagement.form.name_group_photo_title.label")}
              </Typography>

              <Grid container spacing={1}>
                <Grid textAlign="center" item xs={5}>
                  <ClickableAvatar
                    employee_image={staff?.img_url as string}
                    employee_id={staff_id}
                    defaultImage={imageFile}
                    handleFileSelect={handleStaffImageFileSelect}
                    handleIconButtonClick={handleIconButtonClick}
                    anchorEl={anchorEl}
                    handleClose={handleClose}
                  />
                </Grid>
                <Grid item xs={7}>
                  {/* Staff No might be added later */}
                  <Grid container spacing={2}>
                    <Grid item xs={7}>
                      <SelectAddField
                        id="affiliation"
                        onAdd={handleAddAffiliationItem}
                        name="affiliation"
                        label={t("staffManagement.form.affiliation.label")}
                        disabled={processing}
                        value={formik.values.affiliation}
                        onChange={affiliationHandler}
                        error={
                          formik.touched.affiliation &&
                          Boolean(formik.errors.affiliation)
                        }
                        helperText={
                          formik.touched.affiliation &&
                          formik.errors.affiliation
                        }
                      />
                    </Grid>

                    <Grid item xs={5}>
                      <TextField
                        size="small"
                        margin="dense"
                        fullWidth
                        id="staff_code"
                        label={t("staffManagement.form.staff_code.label")}
                        name="staff_code"
                        autoComplete="staff_code"
                        // autofocus
                        disabled={processing}
                        value={formik.values.staff_code}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.staff_code &&
                          Boolean(formik.errors.staff_code)
                        }
                        helperText={
                          formik.touched.staff_code && formik.errors.staff_code
                        }
                      />
                    </Grid>
                  </Grid>

                  {/* <Grid container spacing={2}> */}

                  {/* <Grid item xs={6}>
                      <FormControl
                        // sx={{ m: 1, minWidth: 120 }}
                        fullWidth
                        size="small"
                        // component="fieldset"
                        margin="dense"
                      >
                        <InputLabel id="staff_group">
                          {t("staffManagement.form.staff_group.label")}
                        </InputLabel>
                        <Select
                          fullWidth
                          autoComplete="staff_group"
                          // // autofocus
                          size="small"
                          name="staff_group"
                          // margin='dense'
                          id="staff_group"
                          label={t("staffManagement.form.staff_group.label")}
                          labelId="staff_group"
                          disabled={processing}
                          value={formik.values.staff_group}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.staff_group &&
                            Boolean(formik.errors.staff_group)
                          }
                        >
                          {staff_group.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {t(option.label)}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {formik.touched.staff_group &&
                            formik.errors.staff_group}
                        </FormHelperText>
                      </FormControl>
                    </Grid> */}
                  {/* </Grid> */}

                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="japanese_name"
                    label={t("staffManagement.form.japanese_name.label")}
                    name="japanese_name"
                    autoComplete="japanese_name"
                    // autofocus
                    disabled={processing}
                    value={formik.values.japanese_name}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.japanese_name &&
                      Boolean(formik.errors.japanese_name)
                    }
                    helperText={
                      formik.touched.japanese_name &&
                      formik.errors.japanese_name
                    }
                  />

                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="english_name"
                    label={t("staffManagement.form.english_name.label")}
                    name="english_name"
                    autoComplete="english_name"
                    // autofocus
                    disabled={processing}
                    value={formik.values.english_name}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.english_name &&
                      Boolean(formik.errors.english_name)
                    }
                    helperText={
                      formik.touched.english_name && formik.errors.english_name
                    }
                  />

                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="nickname"
                    label={t("staffManagement.form.nickname.label")}
                    name="nickname"
                    autoComplete="nickname"
                    // autofocus
                    disabled={processing}
                    value={formik.values.nickname}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.nickname && Boolean(formik.errors.nickname)
                    }
                    helperText={
                      formik.touched.nickname && formik.errors.nickname
                    }
                  />
                </Grid>
              </Grid>

              <Typography
                marginTop={2}
                marginBottom={1}
                textAlign="center"
                variant="h6"
                gutterBottom
              >
                {t("staffManagement.form.nationality_gender_birth_title.label")}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="nationality"
                    label={t("staffManagement.form.nationality.label")}
                    name="nationality"
                    autoComplete="nationality"
                    // autofocus
                    disabled={processing}
                    value={formik.values.nationality}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.nationality &&
                      Boolean(formik.errors.nationality)
                    }
                    helperText={
                      formik.touched.nationality && formik.errors.nationality
                    }
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl
                    // sx={{ m: 1, minWidth: 120 }}
                    fullWidth
                    size="small"
                    // component="fieldset"
                    margin="dense"
                  >
                    <InputLabel id="gender">
                      {t("staffManagement.form.gender.label")}
                    </InputLabel>
                    <Select
                      fullWidth
                      autoComplete="gender"
                      // // autofocus
                      size="small"
                      name="gender"
                      // margin='dense'
                      id="gender"
                      label={t("staffManagement.form.gender.label")}
                      labelId="gender"
                      disabled={processing}
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.gender && Boolean(formik.errors.gender)
                      }
                    >
                      {genders.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {t(option.label)}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {formik.touched.gender && formik.errors.gender}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <DatePicker
                    label={t("staffManagement.form.birth_date.label")}
                    inputFormat="yyyy/MM/dd"
                    value={
                      formik.values.birth_date ? formik.values.birth_date : null
                    }
                    onChange={(date: Date | null) => {
                      formik.setFieldValue("birth_date", date);
                      //   formik.setFieldValue("age", calculateAge(date!));
                    }}
                    renderInput={(params: any) => (
                      <TextField
                        size="small"
                        {...params}
                        id="birth_date"
                        disabled={processing}
                        fullWidth
                        margin="dense"
                        name="birth_date"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Typography
                marginTop={2}
                marginBottom={1}
                textAlign="center"
                variant="h6"
                gutterBottom
              >
                {t("staffManagement.form.join_leave_title.label")}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DatePicker
                    label={t("staffManagement.form.join_date.label")}
                    inputFormat="yyyy/MM/dd"
                    value={
                      formik.values.join_date ? formik.values.join_date : null
                    }
                    onChange={(date: Date | null) => {
                      formik.setFieldValue("join_date", date);
                      //   formik.setFieldValue("age", calculateAge(date!));
                    }}
                    renderInput={(params: any) => (
                      <TextField
                        size="small"
                        {...params}
                        id="join_date"
                        disabled={processing}
                        fullWidth
                        margin="dense"
                        name="join_date"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    label={t("staffManagement.form.leave_date.label")}
                    inputFormat="yyyy/MM/dd"
                    value={
                      formik.values.leave_date ? formik.values.leave_date : null
                    }
                    onChange={(date: Date | null) => {
                      formik.setFieldValue("leave_date", date);
                      //   formik.setFieldValue("age", calculateAge(date!));
                    }}
                    renderInput={(params: any) => (
                      <TextField
                        size="small"
                        {...params}
                        id="leave_date"
                        disabled={processing}
                        fullWidth
                        margin="dense"
                        name="leave_date"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Typography
                marginTop={2}
                marginBottom={1}
                textAlign="center"
                variant="h6"
                gutterBottom
              >
                {t("staffManagement.form.bank_details.label")}
              </Typography>

              <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    checked={isJPBankChecked}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setIsJPBankChecked(e.target.checked);
                    }}
                    color="primary"
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={t("staffManagement.form.bank_jpbank_yuucho.label")}
              />

              {!isJPBankChecked ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <TextField
                        size="small"
                        margin="dense"
                        fullWidth
                        id="customer_number"
                        label={t("staffManagement.form.customer_number.label")}
                        name="customer_number"
                        autoComplete="customer_number"
                        // autofocus
                        disabled={processing}
                        value={formik.values.customer_number}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.customer_number &&
                          Boolean(formik.errors.customer_number)
                        }
                        helperText={
                          formik.touched.customer_number &&
                          formik.errors.customer_number
                        }
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        size="small"
                        margin="dense"
                        fullWidth
                        id="bank_name"
                        label={t("staffManagement.form.bank_name.label")}
                        name="bank_name"
                        autoComplete="bank_name"
                        // autofocus
                        disabled={processing}
                        value={formik.values.bank_name}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.bank_name &&
                          Boolean(formik.errors.bank_name)
                        }
                        helperText={
                          formik.touched.bank_name && formik.errors.bank_name
                        }
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        size="small"
                        margin="dense"
                        fullWidth
                        id="branch_name"
                        label={t("staffManagement.form.branch_name.label")}
                        name="branch_name"
                        autoComplete="branch_name"
                        // autofocus
                        disabled={processing}
                        value={formik.values.branch_name}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.branch_name &&
                          Boolean(formik.errors.branch_name)
                        }
                        helperText={
                          formik.touched.branch_name &&
                          formik.errors.branch_name
                        }
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <TextField
                        size="small"
                        margin="dense"
                        fullWidth
                        id="account_type"
                        label={t("staffManagement.form.account_type.label")}
                        name="account_type"
                        autoComplete="account_type"
                        // autofocus
                        disabled={processing}
                        value={formik.values.account_type}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.bank_name &&
                          Boolean(formik.errors.account_type)
                        }
                        helperText={
                          formik.touched.account_type &&
                          formik.errors.account_type
                        }
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        size="small"
                        margin="dense"
                        fullWidth
                        id="account_number"
                        label={t("staffManagement.form.account_number.label")}
                        name="account_number"
                        autoComplete="account_number"
                        // autofocus
                        disabled={processing}
                        value={formik.values.account_number}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.bank_name &&
                          Boolean(formik.errors.account_number)
                        }
                        helperText={
                          formik.touched.account_number &&
                          formik.errors.account_number
                        }
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        size="small"
                        margin="dense"
                        fullWidth
                        id="account_name"
                        label={t("staffManagement.form.account_name.label")}
                        name="account_name"
                        autoComplete="account_name"
                        // autofocus
                        disabled={processing}
                        value={formik.values.account_name}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.bank_name &&
                          Boolean(formik.errors.account_name)
                        }
                        helperText={
                          formik.touched.account_name &&
                          formik.errors.account_name
                        }
                      />
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        size="small"
                        margin="dense"
                        fullWidth
                        id="account_number"
                        label={t("staffManagement.form.account_number.label2")}
                        name="account_number"
                        autoComplete="account_number"
                        // autofocus
                        disabled={processing}
                        value={formik.values.account_number}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.bank_name &&
                          Boolean(formik.errors.account_number)
                        }
                        helperText={
                          formik.touched.account_number &&
                          formik.errors.account_number
                        }
                      />
                    </Grid>
                  </Grid>
                </>
              )}

              <Grid container marginTop={1} spacing={2}>
                <Grid item xs={2} alignSelf="center">
                  <Typography
                    // marginTop={1}
                    marginBottom={2}
                    variant="h6"
                    textAlign="left"
                    gutterBottom
                  >
                    {t("staffManagement.form.card_image_front.label")}
                  </Typography>

                  {/* front image file menu */}
                </Grid>

                <Grid alignSelf="center" item xs={4}>
                  <ImageFileMenu
                    onFileUpload={handleBankCardImageFrontSelect}
                    initialFileUrl={staff?.bank_card_images?.front as string}
                    value={formik.values.bank_card_images?.front as string}
                  />
                </Grid>

                <Grid item alignSelf="center" xs={2}>
                  <Typography
                    // marginTop={1}
                    marginBottom={2}
                    variant="h6"
                    textAlign="left"
                    gutterBottom
                  >
                    {t("staffManagement.form.card_image_back.label")}
                  </Typography>
                </Grid>

                <Grid alignSelf="center" item xs={4}>
                  <ImageFileMenu
                    onFileUpload={handleBankCardImageBackSelect}
                    initialFileUrl={staff?.bank_card_images?.back as string}
                    value={formik.values.bank_card_images?.back as string}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* 2nd column */}
            <Grid item xs={6}>
              <Typography
                // marginTop={1}
                marginBottom={2}
                variant="h6"
                textAlign="center"
                gutterBottom
              >
                {t("staffManagement.form.address_title.label")}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="postal_code"
                    label={t("staffManagement.form.postal_code.label")}
                    name="postal_code"
                    autoComplete="postal_code"
                    // autofocus
                    disabled={processing}
                    value={formik.values.postal_code}
                    onChange={formik.handleChange}
                    onBlur={handlePostalCodeBlur}
                    error={
                      formik.touched.postal_code &&
                      Boolean(formik.errors.postal_code)
                    }
                    helperText={
                      formik.touched.postal_code && formik.errors.postal_code
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl
                    // sx={{ m: 1, minWidth: 120 }}
                    fullWidth
                    size="small"
                    // component="fieldset"
                    margin="dense"
                  >
                    <InputLabel id="prefecture">
                      {t("staffManagement.form.prefecture.label")}
                    </InputLabel>
                    <Select
                      fullWidth
                      autoComplete="prefecture"
                      // // autofocus
                      size="small"
                      name="prefecture"
                      // margin='dense'
                      id="prefecture"
                      label={t("staffManagement.form.prefecture.label")}
                      labelId="prefecture"
                      disabled={processing}
                      value={formik.values.prefecture}
                      onChange={(e) => {
                        // Access Formik's values within handleChange
                        formik.handleChange(e);

                        // Now you can access the updated values object
                        setSelectedPrefecture(e.target.value);
                      }}
                      error={
                        formik.touched.prefecture &&
                        Boolean(formik.errors.prefecture)
                      }
                    >
                      {prefectures?.map((option) => (
                        <MenuItem
                          key={option.jp_prefecture}
                          value={option.jp_prefecture}
                        >
                          {currentLanguage === "ja"
                            ? option.jp_prefecture
                            : option.en_prefecture}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {formik.touched.prefecture && formik.errors.prefecture}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl
                    // sx={{ m: 1, minWidth: 120 }}
                    fullWidth
                    size="small"
                    // component="fieldset"
                    margin="dense"
                  >
                    <InputLabel id="municipality">
                      {t("staffManagement.form.municipality.label")}
                    </InputLabel>
                    <Select
                      fullWidth
                      autoComplete="municipality"
                      // // autofocus
                      size="small"
                      name="municipality"
                      // margin='dense'
                      id="municipality"
                      label={t("staffManagement.form.municipality.label")}
                      labelId="municipality"
                      disabled={processing}
                      value={formik.values.municipality}
                      onChange={(e) => {
                        // Access Formik's values within handleChange
                        formik.handleChange(e);
                      }}
                      error={
                        formik.touched.municipality &&
                        Boolean(formik.errors.municipality)
                      }
                    >
                      {filterMunicipalitiesByPrefecture(
                        municipalities,
                        selectedPrefecture
                      )?.map((option) => (
                        <MenuItem
                          key={option.jp_municipality}
                          value={option.jp_municipality}
                        >
                          {currentLanguage === "ja"
                            ? option.jp_municipality
                            : option.en_municipality}
                        </MenuItem>
                      ))}
                    </Select>

                    <FormHelperText>
                      {formik.touched.municipality &&
                        formik.errors.municipality}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="town"
                    label={t("staffManagement.form.town.label")}
                    name="town"
                    autoComplete="town"
                    // autofocus
                    disabled={processing}
                    value={formik.values.town}
                    onChange={formik.handleChange}
                    error={formik.touched.town && Boolean(formik.errors.town)}
                    helperText={formik.touched.town && formik.errors.town}
                  />
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="building"
                    label={t("staffManagement.form.building.label")}
                    name="building"
                    autoComplete="building"
                    // autofocus
                    disabled={processing}
                    value={formik.values.building}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.building && Boolean(formik.errors.building)
                    }
                    helperText={
                      formik.touched.building && formik.errors.building
                    }
                  />
                </Grid>
              </Grid>

              <Typography
                marginTop={1}
                marginBottom={2}
                variant="h6"
                textAlign="center"
                gutterBottom
              >
                {t("staffManagement.form.contact_title.label")}
              </Typography>

              <Grid container spacing={1}>
                {/* <Grid item xs={4}>
                  
                </Grid> */}
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="phone_number"
                    label={t("staffManagement.form.phone_number.label")}
                    name="phone_number"
                    autoComplete="phone_number"
                    // autofocus
                    disabled={processing}
                    value={formik.values.phone_number}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.phone_number &&
                      Boolean(formik.errors.phone_number)
                    }
                    helperText={
                      formik.touched.phone_number && formik.errors.phone_number
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="personal_email"
                    label={t("staffManagement.form.personal_email.label")}
                    name="personal_email"
                    autoComplete="personal_email"
                    // autofocus
                    disabled={processing}
                    value={formik.values.personal_email}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.personal_email &&
                      Boolean(formik.errors.personal_email)
                    }
                    helperText={
                      formik.touched.personal_email &&
                      formik.errors.personal_email
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="work_email"
                    label={t("staffManagement.form.work_email.label")}
                    name="work_email"
                    autoComplete="work_email"
                    // autofocus
                    disabled={processing}
                    value={formik.values.work_email}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.work_email &&
                      Boolean(formik.errors.work_email)
                    }
                    helperText={
                      formik.touched.work_email && formik.errors.work_email
                    }
                  />
                </Grid>
              </Grid>

              <Typography
                marginTop={2}
                marginBottom={1}
                variant="h6"
                textAlign="center"
                gutterBottom
              >
                {t("staffManagement.form.employment_status_title.label")}
              </Typography>

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="koyou_keitai"
                    label={t("staffManagement.form.koyou_keitai.label")}
                    name="koyou_keitai"
                    autoComplete="koyou_keitai"
                    // autofocus
                    disabled={processing}
                    value={formik.values.koyou_keitai}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.koyou_keitai &&
                      Boolean(formik.errors.koyou_keitai)
                    }
                    helperText={
                      formik.touched.koyou_keitai && formik.errors.koyou_keitai
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="zaishoku_joukyou"
                    label={t("staffManagement.form.zaishoku_joukyou.label")}
                    name="zaishoku_joukyou"
                    autoComplete="zaishoku_joukyou"
                    // autofocus
                    disabled={processing}
                    value={formik.values.zaishoku_joukyou}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.zaishoku_joukyou &&
                      Boolean(formik.errors.zaishoku_joukyou)
                    }
                    helperText={
                      formik.touched.zaishoku_joukyou &&
                      formik.errors.zaishoku_joukyou
                    }
                  />
                </Grid>
              </Grid>

              <Typography
                marginTop={2}
                marginBottom={1}
                variant="h6"
                textAlign="center"
                gutterBottom
              >
                {t("staffManagement.form.job_duty_type_title.label")}
              </Typography>

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    margin="dense"
                    fullWidth
                    id="job_position"
                    label={t("staffManagement.form.job_position.label")}
                    name="job_position"
                    autoComplete="job_position"
                    // autofocus
                    disabled={processing}
                    value={formik.values.job_position}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.job_position &&
                      Boolean(formik.errors.job_position)
                    }
                    helperText={
                      formik.touched.job_position && formik.errors.job_position
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    // sx={{ m: 1, minWidth: 120 }}
                    fullWidth
                    size="small"
                    // component="fieldset"
                    margin="dense"
                  >
                    <InputLabel id="duty_type">
                      {t("staffManagement.form.duty_type.label")}
                    </InputLabel>
                    <Select
                      fullWidth
                      autoComplete="duty_type"
                      // // autofocus
                      size="small"
                      name="duty_type"
                      // margin='dense'
                      id="duty_type"
                      label={t("staffManagement.form.duty_type.label")}
                      labelId="duty_type"
                      disabled={processing}
                      value={formik.values.duty_type}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.duty_type &&
                        Boolean(formik.errors.duty_type)
                      }
                    >
                      {duty_types.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {t(option.label)}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {formik.touched.duty_type && formik.errors.duty_type}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container marginTop={2} spacing={1}>
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Switch
                      checked={isForeigner}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setIsForeigner(e.target.checked);
                      }}
                      color="primary"
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label={t("staffManagement.form.foreigner.label")}
                />
              </Grid>

              {isForeigner && (
                <>
                  <Typography
                    marginBottom={1.5}
                    textAlign="center"
                    variant="h6"
                    gutterBottom
                  >
                    {t("staffManagement.form.residence_card_details.label")}
                  </Typography>

                  {/* residence card */}
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <TextField
                        type="text"
                        size="small"
                        margin="dense"
                        fullWidth
                        id="residence_card_details_number"
                        label={t("staffManagement.form.passport_number.label")}
                        name={`residence_card_details.number`}
                        autoComplete="license_name"
                        // // autofocus
                        disabled={processing}
                        value={formik.values.residence_card_details?.number}
                        onChange={formik.handleChange}
                        // error={
                        //   formik.touched.licenses?.[index] &&
                        //   Boolean(formik.errors.licenses?.[index])
                        // }
                        // helperText={formik.touched.school_history?.[index]?.start_year && formik.errors.school_history?.[index]!.start_year}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <DatePicker
                        label={t(
                          "staffManagement.form.passport_issue_date.label"
                        )}
                        inputFormat="yyyy/MM/dd"
                        value={
                          formik.values.residence_card_details?.issue_date
                            ? new Date(
                                formik.values.residence_card_details?.issue_date
                              )
                            : null
                        }
                        onChange={(date: Date | null) => {
                          // set residence_card_details issue_date
                          formik.setFieldValue(
                            `residence_card_details.issue_date`,
                            date
                          );
                        }}
                        renderInput={(params: any) => (
                          <TextField
                            size="small"
                            {...params}
                            id="residence_card_details_issue_date"
                            disabled={processing}
                            fullWidth
                            margin="dense"
                            name={`residence_card_details.issue_date`}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <DatePicker
                        label={t(
                          "staffManagement.form.passport_expiry_date.label"
                        )}
                        inputFormat="yyyy/MM/dd"
                        value={
                          formik.values.residence_card_details?.expiry_date
                            ? new Date(
                                formik.values.residence_card_details?.expiry_date
                              )
                            : null
                        }
                        onChange={(date: Date | null) => {
                          // set residence_card_details expiry_date
                          formik.setFieldValue(
                            `residence_card_details.expiry_date`,
                            date
                          );
                        }}
                        renderInput={(params: any) => (
                          <TextField
                            size="small"
                            {...params}
                            id="residence_card_details_expiry_date"
                            disabled={processing}
                            fullWidth
                            margin="dense"
                            name={`residence_card_details.expiry_date`}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Grid container marginTop={0.8} spacing={2}>
                    <Grid item xs={2} alignSelf="center">
                      <Typography
                        // marginTop={1}
                        marginBottom={2}
                        variant="h6"
                        textAlign="left"
                        gutterBottom
                      >
                        {t("staffManagement.form.card_image_front.label")}
                      </Typography>

                      {/* front image file menu */}
                    </Grid>

                    <Grid alignSelf="center" item xs={4}>
                      <ImageFileMenu
                        onFileUpload={handleResidenceCardImageFrontSelect}
                        initialFileUrl={
                          staff?.residence_card_details?.front as string
                        }
                        value={
                          formik.values.residence_card_details?.front as string
                        }
                      />
                    </Grid>

                    <Grid item alignSelf="center" xs={2}>
                      <Typography
                        // marginTop={1}
                        marginBottom={2}
                        variant="h6"
                        textAlign="left"
                        gutterBottom
                      >
                        {t("staffManagement.form.card_image_back.label")}
                      </Typography>
                    </Grid>

                    <Grid alignSelf="center" item xs={4}>
                      <ImageFileMenu
                        onFileUpload={handleResidenceCardImageBackSelect}
                        initialFileUrl={
                          staff?.residence_card_details?.back as string
                        }
                        value={
                          formik.values.residence_card_details?.back as string
                        }
                      />
                    </Grid>
                  </Grid>

                  <Typography
                    marginTop={2}
                    marginBottom={1.5}
                    textAlign="center"
                    variant="h6"
                    gutterBottom
                  >
                    {t("staffManagement.form.passport_details.label")}
                  </Typography>

                  {/* passport details */}
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <TextField
                        type="text"
                        size="small"
                        margin="dense"
                        fullWidth
                        id="passport_details_number"
                        label={t("staffManagement.form.passport_number.label")}
                        name={`passport_details.number`}
                        autoComplete="license_name"
                        // // autofocus
                        disabled={processing}
                        value={formik.values.passport_details?.number}
                        onChange={formik.handleChange}
                        // error={
                        //   formik.touched.licenses?.[index] &&
                        //   Boolean(formik.errors.licenses?.[index])
                        // }
                        // helperText={formik.touched.school_history?.[index]?.start_year && formik.errors.school_history?.[index]!.start_year}
                      />
                    </Grid>
                    <Grid item xs={6} alignSelf="center">
                      <ImageFileMenu
                        label={t("staffManagement.form.passport_image.label")}
                        onFileUpload={handlePassportImageSelect}
                        initialFileUrl={staff?.passport_details?.file as string}
                        value={formik.values.passport_details?.file as string}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <DatePicker
                        label={t(
                          "staffManagement.form.passport_issue_date.label"
                        )}
                        inputFormat="yyyy/MM/dd"
                        value={
                          formik.values.passport_details?.issue_date
                            ? new Date(
                                formik.values.passport_details?.issue_date
                              )
                            : null
                        }
                        onChange={(date: Date | null) => {
                          // set passport_details issue_date
                          formik.setFieldValue(
                            `passport_details.issue_date`,
                            date
                          );
                        }}
                        renderInput={(params: any) => (
                          <TextField
                            size="small"
                            {...params}
                            id="passport_details_issue_date"
                            disabled={processing}
                            fullWidth
                            margin="dense"
                            name={`passport_details.issue_date`}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <DatePicker
                        label={t(
                          "staffManagement.form.passport_expiry_date.label"
                        )}
                        inputFormat="yyyy/MM/dd"
                        value={
                          formik.values.passport_details?.expiry_date
                            ? new Date(
                                formik.values.passport_details?.expiry_date
                              )
                            : null
                        }
                        onChange={(date: Date | null) => {
                          // set passport_details expiry_date
                          formik.setFieldValue(
                            `passport_details.expiry_date`,
                            date
                          );
                        }}
                        renderInput={(params: any) => (
                          <TextField
                            size="small"
                            {...params}
                            id="passport_details_expiry_date"
                            disabled={processing}
                            fullWidth
                            margin="dense"
                            name={`passport_details.expiry_date`}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>

          {/* show only when adding staff or when staff is スタッフ */}
          {staff?.staff_group !== "利用者" && (
            <>
              <Typography
                marginTop={2}
                marginBottom={2}
                variant="h6"
                textAlign="center"
                gutterBottom
              >
                {t("staffManagement.form.caregiving_licenses.label")}
              </Typography>

              <Grid container textAlign="center" spacing={2}>
                <Grid item xs={12}>
                  {formik.values.licenses &&
                    formik.values.licenses.map(
                      (license: Licenses, index: number) => (
                        <Grid container spacing={0.5} key={index}>
                          <Grid item xs={3}>
                            <TextField
                              type="text"
                              size="small"
                              margin="dense"
                              fullWidth
                              id="license_name"
                              label={t(
                                "staffManagement.form.licenses.object.license_name"
                              )}
                              name={`licenses[${index}].name`}
                              autoComplete="license_name"
                              // // autofocus
                              disabled={processing}
                              value={license.name}
                              onChange={formik.handleChange}
                              // error={
                              //   formik.touched.licenses?.[index] &&
                              //   Boolean(formik.errors.licenses?.[index])
                              // }
                              // helperText={formik.touched.school_history?.[index]?.start_year && formik.errors.school_history?.[index]!.start_year}
                            />
                          </Grid>

                          <Grid item xs={2}>
                            <TextField
                              type="text"
                              size="small"
                              margin="dense"
                              fullWidth
                              id="license_number"
                              label={t(
                                "staffManagement.form.licenses.object.license_number"
                              )}
                              name={`licenses[${index}].number`}
                              autoComplete="number"
                              // // autofocus
                              disabled={processing}
                              value={license.number}
                              onChange={formik.handleChange}
                              // error={
                              //   formik.touched.licenses?.[index] &&
                              //   Boolean(formik.errors.licenses?.[index])
                              // }
                              // helperText={formik.touched.school_history?.[index]?.start_year && formik.errors.school_history?.[index]!.start_year}
                            />
                          </Grid>

                          <Grid item xs={2}>
                            <DatePicker
                              label={t(
                                "staffManagement.form.licenses.object.license_date"
                              )}
                              inputFormat="yyyy/MM/dd"
                              value={license.date}
                              onChange={(date: string | null) => {
                                formik.setFieldValue(
                                  `licenses[${index}].date`,
                                  date
                                );
                              }}
                              renderInput={(params: any) => (
                                <TextField
                                  size="small"
                                  {...params}
                                  id="license_date"
                                  disabled={processing}
                                  fullWidth
                                  margin="dense"
                                  // type="date"
                                  name={`licenses[${index}].date`}
                                  error={
                                    formik.touched.licenses &&
                                    Boolean(formik.errors.licenses)
                                  }
                                  helperText={
                                    formik.touched.licenses &&
                                    formik.errors.licenses
                                  }
                                />
                              )}
                            />
                          </Grid>

                          <Grid
                            textAlign="left"
                            alignSelf="center"
                            marginTop={0.6}
                            item
                            xs={2}
                          >
                            <LicenseFileMenu
                              // name={`licenses[${index}].file_url`}
                              value={license.file}
                              initialFileUrl={
                                license.file && (license.file as string)
                              }
                              onFileUpload={(file: File) => {
                                formik.setFieldValue(
                                  `licenses[${index}].file`,
                                  file
                                );
                              }}
                              label={trimName(
                                t(
                                  "staffManagement.form.licenses.object.license_file_url"
                                )
                              )}
                            />
                          </Grid>

                          <Grid alignSelf="center" item xs={1}>
                            <Button
                              sx={{
                                margin: 0,
                              }}
                              size="small"
                              variant="contained"
                              // variant='outlined'
                              onClick={() => handleRemoveLicenses(index)}
                            >
                              <CloseIcon sx={{ fontSize: 18 }} />
                            </Button>
                          </Grid>
                        </Grid>
                      )
                    )}
                </Grid>
              </Grid>

              <Grid container marginTop={0.2} spacing={2}>
                <Grid item xs={12}>
                  <Button
                    size="small"
                    variant="outlined"
                    type="button"
                    // disabled={!hasRESHistory.hasSchoolHistory}
                    onClick={handleAddLicenses}
                  >
                    {t("staffManagement.form.licenses.actions.add")}
                  </Button>
                </Grid>
              </Grid>
            </>
          )}

          <Grid marginTop={2} marginBottom={2} container spacing={2}>
            <Grid item xs={5}></Grid>
            <Grid textAlign="center" item xs={2}>
              <LoadingButton
                loading={processing}
                type="submit"
                size="small"
                variant="contained"
                // disabled={!formik.dirty && !formik.isSubmitting}
                disabled={
                  !formik.dirty &&
                  !imageFile &&
                  // !bankCardImage &&
                  !formik.isSubmitting
                }
              >
                {editMode
                  ? t("staffManagement.modal.edit.action")
                  : t("staffManagement.modal.add.action")}
              </LoadingButton>
            </Grid>
            <Grid item xs={5}></Grid>
          </Grid>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default StaffDialog;
