import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Fab,
  Grid,
  IconButton,
  Menu,
} from "@mui/material";
import {
  Add as AddIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";

import SelectImageFileMenu from "./SelectImageFileMenu";
import { useTranslation } from "react-i18next";

// Define the props
interface ImageSliderProps {
  images: string[];
  onAddImage: (images?: File[] | null) => void;
  // input key to reset the input element
  // when a new image is added
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, onAddImage }) => {
  const { t } = useTranslation();

  // const queryClient = useQueryClient();
  const [emblaref] = useEmblaCarousel();

  // menu icons aanchor el to open menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  //   const handleFileChange = useCallback(
  //     async (file: File | null) => {
  //       if (file) {
  //         if (file.size > 5 * 1024 * 1024) {
  //           // File size limit exceeded (5MB)
  //           return;
  //         }

  //         //   const imageUrl = URL.createObjectURL(file);
  //         onAddImage(file);

  //         // Trigger a refetch of the data using React Query
  //         //   queryClient.invalidateQueries('patientData');
  //       }
  //     },
  //     [onAddImage]
  //   );

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handlePreviousClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    if (images) {
      // Optionally, you can initialize Embla Carousel options here
      //   console.log("images changed", images);
    }
  }, [images]);

  const handleIconButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //   const handleClearImage = () => {
  //     onAddImage(null);
  //     handleClose();
  //   };

  return (
    <Grid container spacing={2}>
      {images.length === 0 ? (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          style={{
            height: "50vh",
            border: "1px dashed #ccc",
            borderRadius: 2,
          }}
        >
          <Grid textAlign="center" item xs={12}>
            <Button
              variant="contained"
              onClick={handleIconButtonClick}
              startIcon={<AddPhotoAlternateIcon />}
              size="large"
            >
              {t("patientManagement.patientPhotos.actions.upload")}
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          spacing={2}
          style={{ position: "relative" }}
          alignItems="center"
        >
          <Grid item xs={1}>
            <IconButton
              onClick={handlePreviousClick}
              disabled={currentIndex === 0}
            >
              <NavigateBeforeIcon />
            </IconButton>
          </Grid>
          <Grid item xs={10}>
            <div className="embla" ref={emblaref}>
              <div className="embla__container">
                <div
                  className={`embla__slide ${
                    currentIndex === 0 ? "active" : ""
                  }`}
                >
                  <Card>
                    <CardMedia
                      component="img"
                      alt={`Image ${currentIndex}`}
                      //   height="100%"
                      height="500px"
                      image={images[currentIndex]}
                    />
                    <CardContent>
                      {/* <div className="embla__description">
                        <p>Image {currentIndex + 1}</p>
                      </div> */}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              onClick={handleNextClick}
              disabled={currentIndex === images.length - 1}
            >
              <NavigateNextIcon />
            </IconButton>
          </Grid>
          <Fab
            size="small"
            color="primary"
            aria-label="add"
            style={{ position: "absolute", bottom: "40px", right: "60px" }}
            onClick={handleIconButtonClick}
          >
            <AddIcon />
          </Fab>
        </Grid>
      )}

      <Menu
        id="employee-row-menu"
        anchorEl={anchorEl}
        aria-labelledby="employee-row-menu-button"
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {/* <MenuItem onClick={handleClearImage}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText
            primary={t("employeeManagement.form.img.actions.clear")}
          />
        </MenuItem> */}

        <SelectImageFileMenu onSelectFiles={onAddImage} />
      </Menu>

      {/* <Grid item xs={12}>
        
      </Grid> */}
    </Grid>
  );
};

export default ImageSlider;
