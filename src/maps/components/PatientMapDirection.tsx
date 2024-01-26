import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  Marker,
  Autocomplete as GoogleAutocomplete,
} from "@react-google-maps/api";
import * as PropTypes from "prop-types";
import React, {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  CSSProperties,
  useEffect,
} from "react";

//material ui
import { MyLocation as MyLocationIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  // Autocomplete,
} from "@mui/material";
// import MapSettingsForm from "./MapSettingsForm";
import { useTranslation } from "react-i18next";
import { geocodeAddress } from "../helpers/helper";

const PatientMapDirectionPropTypes = {
  styles: PropTypes.shape({
    container: PropTypes.object.isRequired,
  }).isRequired,
  originAddress: PropTypes.string,
};

let center: google.maps.LatLngLiteral = {
  //yokohama
  lat: 35.443707,
  lng: 139.638031,
};

interface Props {
  styles: {
    container: CSSProperties | undefined;
  };
  originAddress?: string;
}

const PatientMapDirection = ({ styles, originAddress }: Props) => {
  const { t } = useTranslation();
  const [response, setResponse] = useState<google.maps.DirectionsResult | null>(
    null
  );

  // address marker placeholder
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null
  );

  const originRef = useRef<HTMLInputElement | null>(null);
  const destinationRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    geocodeAddress(originAddress as string)
      .then((coordinates) => {
        if (coordinates) {
          // console.log(
          //   `Latitude: ${coordinates.lat}, Longitude: ${coordinates.lng}`
          // );

          // change center to origin address
          center = {
            lat: coordinates.lat,
            lng: coordinates.lng,
          };

          const infoWindow = new google.maps.InfoWindow({
            // content: `${t("map.origin.label")}: ${originAddress}`,
            content: ` ${originAddress}`,
          });

          setInfoWindow(infoWindow);
        } else {
          console.log("Failed to geocode address");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, [originAddress]);

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [directionsFormValue, setDirectionsFormValue] = useState({
    origin: "",
    destination: "",
    distance: "",
    duration: "",
    travelMode: google.maps.TravelMode.DRIVING,
  });

  const directionsCallback = useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      if (result !== null) {
        if (status === "OK") {
          setResponse(result);
        } else {
          console.log("response: ", result);
        }
      }
    },
    []
  );

  function calculateRoute() {
    if (originRef.current?.value && destinationRef.current?.value) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: originRef.current?.value ?? "",
          destination: destinationRef.current?.value ?? "",
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setResponse(result);
            console.log("result: ", result);
            setDirectionsFormValue((prev) => ({
              ...prev,
              distance: result?.routes[0].legs[0].distance?.text ?? "",
              duration: result?.routes[0].legs[0].duration?.text ?? "",
            }));
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    } else {
      return;
    }
  }

  const travelModeChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("travelModeChangeHandler: ", e.target.value);
      setDirectionsFormValue((prev) => ({
        ...prev,
        travelMode: e.target.value as google.maps.TravelMode,
      }));
    },
    []
  );

  // const checkDriving = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
  //   ({ target: { checked } }) => {
  //     checked &&
  //       setDirectionsFormValue((currentValue) => ({
  //         ...currentValue,
  //         travelMode: google.maps.TravelMode.DRIVING,
  //       }));
  //   },
  //   []
  // );

  // const checkBicycling = useCallback<
  //   React.ChangeEventHandler<HTMLInputElement>
  // >(({ target: { checked } }) => {
  //   checked &&
  //     setDirectionsFormValue((currentValue) => ({
  //       ...currentValue,
  //       travelMode: google.maps.TravelMode.BICYCLING,
  //     }));
  // }, []);

  // const checkTransit = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
  //   ({ target: { checked } }) => {
  //     checked &&
  //       setDirectionsFormValue((currentValue) => ({
  //         ...currentValue,
  //         travelMode: google.maps.TravelMode.TRANSIT,
  //       }));
  //   },
  //   []
  // );

  // const checkWalking = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
  //   ({ target: { checked } }) => {
  //     checked &&
  //       setDirectionsFormValue((currentValue) => ({
  //         ...currentValue,
  //         travelMode: google.maps.TravelMode.WALKING,
  //       }));
  //   },
  //   []
  // );

  const onClick = useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(() => {
    if (
      originRef.current &&
      originRef.current.value !== "" &&
      destinationRef.current &&
      destinationRef.current.value !== ""
    ) {
      setDirectionsFormValue((currentValue) => ({
        ...currentValue,
        origin: originRef.current?.value ?? "",
        destination: destinationRef.current?.value ?? "",
      }));

      calculateRoute();
    }
  }, []);

  // const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
  //   console.log("onClick args: ", e);
  // }, []);

  const directionsServiceOptions =
    useMemo<google.maps.DirectionsRequest>(() => {
      return {
        destination: directionsFormValue.destination,
        origin: directionsFormValue.origin,
        travelMode: directionsFormValue.travelMode,
      };
    }, [
      directionsFormValue.origin,
      directionsFormValue.destination,
      directionsFormValue.travelMode,
    ]);

  const directionsResult = useMemo(() => {
    return {
      directions: response,
    };
  }, [response]);

  const handleMarkerClick = () => {
    if (infoWindow) {
      infoWindow.open(map, null);
      infoWindow.setPosition(center);
    }
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          borderRadius: 1,
          overflow: "hidden",
          height: "100%",
          width: "100%",
        }}
      >
        <GoogleMap
          id="direction-example"
          mapContainerStyle={styles.container}
          zoom={15}
          center={center}
          onLoad={(map) => setMap(map)}
          options={{
            // zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            scrollwheel: false,
            // fullscreenControl: false,
          }}
          //   onClick={onMapClick}
        >
          <IconButton
            aria-label="map-center"
            onClick={() => map?.panTo(center)}
            size="small"
            sx={{
              //   marginRight: 1,
              padding: 1.2,
              position: "absolute",
              top: 10,
              right: 60,
              bgcolor: "white",
              boxShadow: 2,
            }}

            //   sx={{
            //     //   marginRight: 1,
            //     padding: 1.2,
            //   }}
            // aria-label="logout"
            //   variant="contained"
            //   color="primary"
            //   // disabled={processing}
            //   onClick={() => map?.panTo(center)}
            //   size="small"
          >
            <MyLocationIcon />
          </IconButton>
          <Box
            position="absolute"
            top="20px"
            left="20px"
            bgcolor="white"
            sx={{
              opacity: 0.9,
            }}
            boxShadow={3}
            p={1}
            borderRadius={1}
          >
            <Grid container marginTop={0.5} spacing={1} alignItems="center">
              <Grid item xs={12}>
                <GoogleAutocomplete options={{ types: ["geocode"] }}>
                  <TextField
                    id="origin"
                    type="text"
                    name="origin"
                    label={t("map.origin.label")}
                    variant="outlined"
                    size="small"
                    fullWidth
                    inputRef={originRef}
                  />
                </GoogleAutocomplete>
              </Grid>
              <Grid item xs={12}>
                <GoogleAutocomplete options={{ types: ["geocode"] }}>
                  <TextField
                    label={t("map.destination.label")}
                    variant="outlined"
                    size="small"
                    fullWidth
                    inputRef={destinationRef}
                  />
                </GoogleAutocomplete>
              </Grid>
            </Grid>

            <Grid container marginY={0.5} spacing={1} textAlign="center">
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={onClick}
                  sx={{
                    //   marginRight: 1,
                    padding: 1.2,
                  }}
                >
                  {t("map.buttons.makeRoute.label")}
                </Button>
              </Grid>
            </Grid>

            <Grid container alignItems="center" justifyContent="center">
              <RadioGroup
                row
                aria-label="Transit Type"
                name="transitType"
                value={directionsFormValue.travelMode}
                onChange={travelModeChangeHandler}
              >
                <FormControlLabel
                  value="DRIVING"
                  control={<Radio />}
                  label={t("map.form.radio.drive.label")}
                />
                <FormControlLabel
                  value="WALKING"
                  control={<Radio />}
                  label={t("map.form.radio.walk.label")}
                />
                <FormControlLabel
                  value="BICYCLING"
                  control={<Radio />}
                  label={t("map.form.radio.bicycle.label")}
                />
                <FormControlLabel
                  value="TRANSIT"
                  control={<Radio />}
                  label={t("map.form.radio.transit.label")}
                />
              </RadioGroup>
            </Grid>

            <Grid container spacing={1} textAlign="center">
              <Grid item xs={6}>
                <Typography variant="h6">{`${t("map.duration.label")}: ${
                  directionsFormValue.duration
                }`}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">{`${t("map.distance.label")}: ${
                  directionsFormValue.distance
                }`}</Typography>
              </Grid>
            </Grid>
          </Box>

          {directionsFormValue.destination !== "" &&
            directionsFormValue.origin !== "" && (
              <DirectionsService
                options={directionsServiceOptions}
                callback={directionsCallback}
              />
            )}

          {directionsResult.directions && (
            <DirectionsRenderer
              options={{
                directions: directionsResult.directions,
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: "#000",
                  strokeOpacity: 0.7,
                  strokeWeight: 5,
                },
              }}
            />
          )}

          <Marker position={center} onClick={handleMarkerClick} />
        </GoogleMap>
      </Box>
    </React.Fragment>
  );
};

PatientMapDirection.propTypes = PatientMapDirectionPropTypes;

export default memo(PatientMapDirection);
