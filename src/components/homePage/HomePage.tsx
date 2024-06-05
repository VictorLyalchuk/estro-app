import { useState, useEffect } from 'react';
import { IHomeImage } from '../../interfaces/Site/IHomeImage';
import { APP_ENV } from "../../env/config";
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { ConfirmEmail } from '../../services/accounts/account-services';
import { GetAllImage } from '../../services/images/images-services';
import { Alert, AlertTitle } from '@material-ui/lab';

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
        transition: 'transform 1.2s ease-in-out',
        '&:hover': {
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
    const { email, token } = useParams<{ email: string, token: string }>();
    const [images, setImages] = useState<IHomeImage[]>([]);
    const classes = useStyles();
    const [emailConfirm, setEmailConfirm] = useState(false);

    useEffect(() => {
        homePage(email, token);
    }, [email, token]);

    const homePage = async (email: string | null | undefined, token: string | null | undefined) => {
        if (email && token) {
            await ConfirmEmail(email, token);
            setEmailConfirm(true);
        }
        await GetAllImage()
            .then(data => setImages(data))
            .catch(error => console.error('Error fetching images data:', error));
    }

    return (
        <div className="bg-gray-100">
            <div className="mx-auto max-w-2xl px-2 py-8 lg:max-w-7xl lg:px-2 justify-center">
                <div className="flex flex-wrap justify-center">
                    {images.length >= 15 && (
                        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
                            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:block mt-7 bp-7">
                                <img
                                    src={`${baseUrl}/uploads/${images[0].imagePath}`}
                                    className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                />
                            </div>

                            <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8 mt-7 bp-7">
                                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                    <img
                                        src={`${baseUrl}/uploads/${images[2].imagePath}`}
                                        className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                    />
                                </div>
                                <div className="aspect-h-2 aspect-w-3 rounded-lg">
                                    <div className="bg-white-container-home flex flex-col justify-center items-center h-full p-4">
                                        <h1 className="text-white text-7xl hover:text-indigo-300">estro</h1>
                                        <p className="text-white text-sx mb-10 hover:text-indigo-300">SHOES & ACCESSORIES</p>

                                    </div>
                                </div>
                            </div>

                            <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg mt-7 bp-7">
                                <img
                                    src={`${baseUrl}/uploads/${images[3].imagePath}`}
                                    className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                />
                            </div>

                            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:block mt-7 bp-7">
                                <img
                                    src={`${baseUrl}/uploads/${images[1].imagePath}`}
                                    className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                />
                            </div>

                            <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8 mt-7 bp-7">
                                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                    <img
                                        src={`${baseUrl}/uploads/${images[8].imagePath}`}
                                        className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                    />
                                </div>
                                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                    <img
                                        src={`${baseUrl}/uploads/${images[5].imagePath}`}
                                        className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                    />
                                </div>
                            </div>

                            <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8 mt-7 bp-7">
                                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                    <img
                                        src={`${baseUrl}/uploads/${images[6].imagePath}`}
                                        className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                    />
                                </div>
                                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                    <img
                                        src={`${baseUrl}/uploads/${images[4].imagePath}`}
                                        className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                    />
                                </div>
                            </div>

                            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:block mt-7 bp-7">
                                <img
                                    src={`${baseUrl}/uploads/${images[8].imagePath}`}
                                    className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                />
                            </div>

                            <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8 mt-7 bp-7">
                                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                    <img
                                        src={`${baseUrl}/uploads/${images[9].imagePath}`}
                                        className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                    />
                                </div>
                                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                    <img
                                        src={`${baseUrl}/uploads/${images[12].imagePath}`}
                                        className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                    />
                                </div>
                            </div>

                            <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg mt-7 bp-7">
                                <img
                                    src={`${baseUrl}/uploads/${images[11].imagePath}`}
                                    className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                />
                            </div>

                            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg lg:block mt-7 bp-7">
                                <img
                                    src={`${baseUrl}/uploads/${images[10].imagePath}`}
                                    className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                />
                            </div>

                            <div className="lg:grid lg:grid-cols-1 lg:gap-y-8 mt-7 bp-7">
                                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                    <img
                                        src={`${baseUrl}/uploads/${images[13].imagePath}`}
                                        className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                    />
                                </div>
                                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                    <img
                                        src={`${baseUrl}/uploads/${images[7].imagePath}`}
                                        className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                    />
                                </div>
                            </div>

                            <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg mt-7 bp-7">
                                <img
                                    src={`${baseUrl}/uploads/${images[14].imagePath}`}
                                    className={`${classes.image} ${classes.imageContainer} ${classes.hover08}`}
                                />
                            </div>
                        </div>
                    )}
                    {emailConfirm && (
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96">
                            <Alert onClose={() => { setEmailConfirm(false) }} severity="success">
                                <AlertTitle>Success</AlertTitle>
                                <strong>Your emeil has been successfully verified.</strong>
                            </Alert>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

}
export default HomePage;