import React from "react";

import {
  Typography,
  TextField,
  Button,
  Box,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";

interface MapSettingsFormProps {
  originRef: React.RefObject<HTMLInputElement>;
  destinationRef: React.RefObject<HTMLInputElement>;
  travelMode: string; // Assuming travelMode is a string, update as needed
  setTravelMode: (value: string) => void;
  onRouteButtonClick: () => void;
  onCenterButtonClick: () => void;
}

const MapSettingsForm: React.FC<MapSettingsFormProps> = ({
  originRef,
  destinationRef,
  travelMode,
  setTravelMode,
  onRouteButtonClick,
  onCenterButtonClick,
}) => {
  return (
    <Box
      position="absolute"
      top="20px"
      left="20px"
      bgcolor="white"
      boxShadow={3}
      p={2}
      borderRadius={4}
    >
      <Typography variant="h6">Duration: 2 hrs 30 mins</Typography>
      <Typography variant="h6">Distance: 5.2 miles</Typography>
      <TextField
        label="Origin"
        variant="outlined"
        fullWidth
        inputRef={originRef}
      />
      <TextField
        label="Destination"
        variant="outlined"
        fullWidth
        inputRef={destinationRef}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={onRouteButtonClick}
      >
        Make Route
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        onClick={onCenterButtonClick}
      >
        Go to Center
      </Button>
      <RadioGroup
        aria-label="Transit Type"
        name="transitType"
        value={travelMode}
        onChange={(e) => setTravelMode(e.target.value)}
      >
        <FormControlLabel value="walking" control={<Radio />} label="Walking" />
        <FormControlLabel
          value="bicycling"
          control={<Radio />}
          label="Bicycling"
        />
        <FormControlLabel value="driving" control={<Radio />} label="Driving" />
        <FormControlLabel value="transit" control={<Radio />} label="Transit" />
      </RadioGroup>
    </Box>
  );
};

export default MapSettingsForm;
