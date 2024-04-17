import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
interface CarouselProps {
  images: string[];
}
import styles from "../styles/carousel.module.css";

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => {
      if (embla) {
        embla.scrollTo(index);
      }
    },
    [embla]
  );

  const autoplay = useCallback(() => {
    if (!embla) return;

    if (embla.canScrollNext()) {
      embla.scrollNext();
    } else {
      embla.scrollTo(0);
    }
  }, [embla]);

  useEffect(() => {
    if (!embla) return;

    const setSnaps = () => setScrollSnaps(embla.scrollSnapList());
    embla.on("select", () => setSelectedIndex(embla.selectedScrollSnap()));
    embla.on("init", setSnaps);
    embla.on("reInit", setSnaps);

    const autoplayInterval = setInterval(autoplay, 5000);
    return () => clearInterval(autoplayInterval);
  }, [embla, autoplay]);

  return (
    <>
      <div className={styles.embla} ref={emblaRef}>
        <div className={styles.embla__container}>
          {images.map((image, index) => (
            <div className={styles.embla__slide} key={index}>
              <img
                src={image}
                alt={`Slide ${index}`}
                className={styles.embla__image}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.embla__dots}>
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`${styles.embla__dot} ${
              index === selectedIndex ? styles.is_selected : ""
            }`}
            type="button"
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </>
  );
};

export default Carousel;
