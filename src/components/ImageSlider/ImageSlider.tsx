import React, { useEffect, useState } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import cn from 'classnames';

import './ImageSlider.css';
import { Image } from "../../types/image";

type Props = {
  url: string,
  page: string,
  limit: string
}

export const ImageSlider: React.FC<Props> = ({url, page, limit}) => {
  const [images, setImages] = useState<Image[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);

  async function getImages(imagesUrl: string) {
    try {
      setIsloading(true);
      const response = await fetch(imagesUrl);
      const imagesData = await response.json();
  
      if (imagesData) {
        setImages(imagesData);
        setIsloading(false);
      }
    } catch (error) {
      const errorMessage = `Error while fetching images data: ${error}`;

      console.error(errorMessage);
      setError(errorMessage);
      setIsloading(false);
    }
  }

  useEffect(() => {
    const parameterizedUrl = `${url}?page=${page}&limit=1${limit}`;

    getImages(parameterizedUrl);
  }, []);

  const handleChangeImageLeft = (i: number) => {
    if (i < 1 && images) {
      setCurrentImageIndex(images?.length - 1);
    } else {
      setCurrentImageIndex(i - 1);
    }
  };

  const handleChangeImageRight = (i: number) => {
    if (images && i >= images?.length - 1) {
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(i + 1);
    }
  };

  const handleChangeImageButton = (i: number) => {
    setCurrentImageIndex(i);
  }

  if (error) {
    return <div className="error-message">{error}</div>
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>
  };

  return (
    <div className="image-slider">
      <BsArrowLeftCircleFill className="arrow-left" onClick={() => handleChangeImageLeft(currentImageIndex)} />

      {images &&
        images.length !== 0 &&
        images.map((image, index) => (
          <img
            key={image.id}
            className={cn('image', {'image-visible': index === currentImageIndex})}
            src={image.download_url}
            alt={image.download_url}
          />
        ))}

      <BsArrowRightCircleFill className="arrow-right" onClick={() => handleChangeImageRight(currentImageIndex)} />

      <div className="slider-buttons">
        {images && images.length !== 0 && images.map((_, index) => (
          <button
            key={index}
            className={cn('slider-button', { 'slider-button-choosen': index === currentImageIndex })}
            onClick={() => handleChangeImageButton(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};
