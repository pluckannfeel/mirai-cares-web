import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
// import { ReactComponent as ForbiddenSvg } from "../assets/403.svg";
import ForbiddenSvg from "../assets/403.svg?react";
import Result from "../components/Result";

const Forbidden = () => {
  const { t } = useTranslation();

  return (
    <Result
      extra={
        <Button
          color="secondary"
          component={RouterLink}
          to={`/${import.meta.env.BASE_URL}/admin`}
          variant="contained"
        >
          {t("common.backHome")}
        </Button>
      }
      image={<ForbiddenSvg />}
      maxWidth="sm"
      subTitle={t("common.errors.forbidden.subTitle")}
      title={t("common.errors.unexpected.title")}
    />
  );
};

export default Forbidden;
