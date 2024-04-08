import { useState, useEffect } from 'react';
import axios from 'axios';
import { IHomeImage } from '../../interfaces/Site/IHomeImage';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { APP_ENV } from "../../env/config";
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Grid } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    imageContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: '0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        // opacity: 0.9,
        transition: 'transform 1.2s ease-in-out',
        '&:hover': {
            //   transform: 'scale(1.1)', 
            //   opacity: 1,
        },
    },
    brighten: {
        '-webkit-filter': 'brightness(50%)',
        '-webkit-transition': 'all 1s ease',
        '-moz-transition': 'all 1s ease',
        '-o-transition': 'all 1s ease',
        '-ms-transition': 'all 1s ease',
        'transition': 'all 3s ease',
        '&:hover': {
            '-webkit-filter': 'brightness(100%)',
        }

    },
    hover08: {
        '-webkit-filter': 'grayscale(50%)',
        'filter': 'grayscale(50%)',
        '-webkit-transition': '.3s ease-in-out',
        'transition': '.3s ease-in-out',
        '&:hover': {
            '-webkit-filter': 'grayscale(0)',
            'filter': 'grayscale(0)',
        },
    },
}));

const HomePage = () => {
    const baseUrl = APP_ENV.BASE_URL;
    const [images, setImages] = useState<IHomeImage[]>([]);
    const classes = useStyles();

    useEffect(() => {
        axios.get(`${baseUrl}/api/ImageForHomeService/GetAllImageAsync`)
            .then(response => {
                setImages(response.data);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, []);

    return (
        <div className="bg-gray-100" >
            <div className="mx-auto max-w-2xl px-2 py-8 lg:max-w-7xl lg:px-2 justify-center">

                <Grid container spacing={3}>
                    {images.map((image, index) => (
                        <Grid key={index} item xs={12} sm={6} md={6} lg={4}>
                            <Card>
                                <CardContent style={{ height: '100%', display: 'flex', padding: '0', justifyContent: 'center', alignItems: 'center' }}>
                                    <div className={`hover14 column ${classes.hover08} ${classes.image}`}>
                                            <img
                                                src={`${baseUrl}/uploads/${image.imagePath}`}
                                                alt={`Image ${index + 1}`}
                                                className={classes.image}
                                            />
                                    </div>

                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>


            </div>
        </div>
    )

}
export default HomePage;