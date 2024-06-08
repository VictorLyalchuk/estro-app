import { useState, useEffect, Fragment } from 'react';
import { IHomeImage } from '../../interfaces/Catalog/IHomeImage';
import { APP_ENV } from "../../env/config";
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { ConfirmEmail } from '../../services/accounts/account-services';
import { GetAllImage } from '../../services/images/images-services';
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'

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
    const [open, setOpen] = useState(true)
    useEffect(() => {
        homePage(email, token);
    }, [email, token]);

    const homePage = async (email: string | null | undefined, token: string | null | undefined) => {
        if (email && token) {
            ConfirmEmail(email, token, (error) => {
                if (error) {
                    console.error("Email verification error:", error);
                } else {
                    setEmailConfirm(true);
                }
            });
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
                            <Transition.Root show={open} as={Fragment}>
                                <Dialog as="div" className="relative z-10" onClose={() => { setEmailConfirm(false) }}>
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                                    </Transition.Child>

                                    <div className="fixed inset-0 z-10 overflow-y-auto">
                                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                            <Transition.Child
                                                as={Fragment}
                                                enter="ease-out duration-300"
                                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                                leave="ease-in duration-200"
                                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                            >
                                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                                    <div>
                                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                            <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                                        </div>
                                                        <div className="mt-3 text-center sm:mt-5">
                                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                                Success
                                                            </Dialog.Title>
                                                            <div className="mt-2">
                                                                <p className="text-sm text-gray-500">
                                                                    Your emeil has been successfully verified
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-5 sm:mt-6">
                                                        <button
                                                            type="button"
                                                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                            onClick={() => setOpen(false)}
                                                        >
                                                            Go back to site
                                                        </button>
                                                    </div>
                                                </Dialog.Panel>
                                            </Transition.Child>
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition.Root>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

}
export default HomePage;