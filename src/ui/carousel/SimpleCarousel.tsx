import { useRef, useState } from "react";
import { getLocalizedField } from "../../utils/localized/localized";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { APP_ENV } from "../../env/config";
import { IProduct } from "../../interfaces/Product/IProduct";

interface SimpleCarouselProps {
  product: IProduct;
  lang: string;
  isHovered: boolean;
}

const SimpleCarousel: React.FC<SimpleCarouselProps> = ({ product, lang, isHovered }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const baseUrl = APP_ENV.BASE_URL;

  const images = product.images || []; 

  const goToPrev = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (carouselRef.current) {
      setCurrentIndex(prevIndex => {
        const newIndex = (prevIndex === 0 ? images.length - 1 : prevIndex - 1);
        carouselRef.current?.scrollTo({ left: newIndex * carouselRef.current.clientWidth, behavior: 'smooth' });
        return newIndex;
      });
    }
  };

  const goToNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (carouselRef.current) {
      setCurrentIndex(prevIndex => {
        const newIndex = (prevIndex === images.length - 1 ? 0 : prevIndex + 1);
        carouselRef.current?.scrollTo({ left: newIndex * carouselRef.current.clientWidth, behavior: 'smooth' });
        return newIndex;
      });
    }
  };

  const handleIndicatorClick = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: index * carouselRef.current.clientWidth, behavior: 'smooth' });
      setCurrentIndex(index);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={carouselRef}
        className="flex overflow-hidden whitespace-nowrap h-full"
      >
        {images.length > 0 ? (
          images.map((image, index) => (
            <div
              key={index}
              className="inline-block w-full h-full flex-shrink-0"
            >
              <img
                src={`${baseUrl}/uploads/1200_${image.imagePath || 'imagenot.webp'}`}
                alt={getLocalizedField(product, 'name', lang)}
                className="h-full w-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No images available
          </div>
        )}
      </div>
      {/* Show controls and indicators only when the product is hovered */}
      {isHovered && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#4F5050] text-white hover:bg-[#3a3b3b] rounded-full p-2.5 shadow-lg flex items-center justify-center"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </button>
          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#4F5050] text-white hover:bg-[#3a3b3b] rounded-full p-2.5 shadow-xl flex items-center justify-center"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </button>
          {/* Indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(event) => handleIndicatorClick(index, event)}
                className={`w-7 h-1.5 rounded ${index === currentIndex ? 'bg-white' : 'bg-[#4F5050]'} focus:outline-none`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleCarousel;
