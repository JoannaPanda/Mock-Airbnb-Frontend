import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AspectRatio from '@mui/joy/AspectRatio';
import { extractYoutubeVideoId } from './Helpers';

const ImageSlider = ({ images }) => {
  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...slickSettings}>
      {images.map((img, index) => (
        <AspectRatio key={`img-${index}`} minHeight="200px" maxHeight="500px">
          {img.includes('https://')
            ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${extractYoutubeVideoId(img)}`}
              title="YouTube video player"
              allowFullScreen
            ></iframe>
              )
            : (
            <img src={img} loading="lazy" alt={`Image ${index + 1}`} />
              )}
        </AspectRatio>
      ))}
    </Slider>
  );
};

export default ImageSlider;
