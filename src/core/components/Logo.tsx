import { Box, BoxProps } from "@mui/material";
// import logoUrl from "../assets/logo.svg";
import LogoSvg from "../assets/logo.svg?react";

type LogoProps = {
  colored?: boolean;
  size?: number;
} & BoxProps;

const Logo = ({
  // colored = false,
  // size = 75,
  ...boxProps
}: LogoProps) => {
  return (
    <Box {...boxProps}>
      <LogoSvg height={75} width={386} />
      {/* <img height={75} width={386} src={logoUrl} alt="logo" /> */}
    </Box>
  );
};

export default Logo;
