import { useState, useEffect } from 'react';
import axios from 'axios';
import { IHomeImage } from '../interfaces/Site/IHomeImage';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {APP_ENV} from "../env/config";

const HomePage = () => {
    const baseUrl = APP_ENV.BASE_URL;
    const [images, setImages] = useState<IHomeImage[]>([]);

    useEffect(() => {
        axios.get(`${baseUrl}/api/ImageForHomeService/GetAllImageAsync`)
            .then(response => {
                setImages(response.data);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000, 
    };

    return (
        <div className="bg-gray-100" style={{ minHeight: '900px' }}>
        <div className="mx-auto max-w-2xl px-2 py-8 lg:max-w-7xl lg:px-2 justify-center">
        <Slider {...settings}>
            {images.map((image, index) => (
                <div key={index} className="justify-center">
                    {image ? (
                        <img
                            src={`${baseUrl}/uploads/${image.imagePath}`}
                            alt={`Slide ${index + 1}`}
                            className="mx-auto"
                        />
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
            ))}
        </Slider>
    </div>
    </div>
    )
}
export default HomePage;