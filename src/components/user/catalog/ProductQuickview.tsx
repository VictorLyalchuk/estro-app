import { Fragment, useState } from 'react'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { IProduct, IStorages } from '../../../interfaces/Site/IProduct'
import { APP_ENV } from '../../../env/config'
import { useDispatch, useSelector } from 'react-redux';
import { IAuthReducerState } from '../../../store/accounts/AuthReducer';
import { BagReducerActionType } from '../../../store/bag/BagReducer';
import { IBag } from '../../../interfaces/Bag/IBag';
import { useNavigate } from 'react-router-dom'
import { createBag } from '../../../services/bag/bag-services'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
interface IProductQuickviewProps {
    product: IProduct;
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    size: IStorages | null;
}
const ProductQuickview: React.FC<IProductQuickviewProps> = ({ product, isOpen, setOpen, size }) => {
    const baseUrl = APP_ENV.BASE_URL;
    const [selectedSize, setSelectedSize] = useState<IStorages | null>(size);
    const { isAuth, user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClose = () => {
        setOpen(true);
    };
    const addToBag = async () => {
        if (!isAuth) {
            navigate("/auth");
        }
        else if (selectedSize) {
            const model: IBag = {
                UserId: user?.Id || "",
                UserEmail: user?.Email || "",
                productId: selectedSize?.productId || 0,
                size: selectedSize?.size || 0,
            };

            try {
                await createBag(model);
                setSelectedSize(null);
                dispatch({
                    type: BagReducerActionType.PRODUCT_BAG_COUNT,
                    payload: {
                        pluscount: 1
                    }
                });
            }
            catch (ex) {
                console.error('Error adding to bag!');
            }
        }
    }

    return (
        <>
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 hidden bg-gray-300 bg-opacity-30 transition-opacity md:block" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                                enterTo="opacity-100 translate-y-0 md:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                            >
                                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                                    <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                                        <button
                                            type="button"
                                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                                            onClick={() => setOpen(false)}
                                            tabIndex={0}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>

                                        <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                                            <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                                                <img tabIndex={0} src={`${baseUrl}/uploads/1200_${product.images?.[0]?.imagePath || '/uploads/default.jpg'}`} className="object-cover object-center" />
                                            </div>
                                            <div className="sm:col-span-8 lg:col-span-7">
                                                <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{product.name}</h2>

                                                <section aria-labelledby="information-heading" className="mt-2">
                                                    <h3 id="information-heading" className="sr-only">
                                                        Product information
                                                    </h3>

                                                    <p className="text-2xl text-gray-900">{product.price}</p>

                                                    {/* Reviews */}
                                                    {/* <div className="mt-6">
                                                        <h4 className="sr-only">Reviews</h4>
                                                        <div className="flex items-center">
                                                            <div className="flex items-center">
                                                                {[0, 1, 2, 3, 4].map((rating) => (
                                                                    <StarIcon
                                                                        key={rating}
                                                                        className={classNames(
                                                                            product.rating > rating ? 'text-gray-900' : 'text-gray-200',
                                                                            'h-5 w-5 flex-shrink-0'
                                                                        )}
                                                                        aria-hidden="true"
                                                                    />
                                                                ))}
                                                            </div>
                                                            <p className="sr-only">{product.rating} out of 5 stars</p>
                                                            <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                                {product.reviewCount} reviews
                                                            </a>
                                                        </div>
                                                    </div> */}
                                                </section>

                                                <section aria-labelledby="options-heading" className="mt-10">
                                                    <h3 id="options-heading" className="sr-only">
                                                        Product options
                                                    </h3>

                                                    <form>
                                                        {/* Sizes */}
                                                        <div className="mt-10">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="text-sm font-medium text-gray-900">Size</h4>
                                                                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                                    Size guide
                                                                </a>
                                                            </div>

                                                            <RadioGroup
                                                                value={selectedSize}
                                                                onChange={setSelectedSize}
                                                                className="mt-4">
                                                                <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                                                                <div className="grid grid-cols-4 gap-4">
                                                                    {product.storages?.map((size) => (
                                                                        <RadioGroup.Option
                                                                            key={size.size}
                                                                            value={size}
                                                                            disabled={!size.inStock}
                                                                            className={({ checked }) =>
                                                                                classNames(
                                                                                  size.inStock
                                                                                    ? 'cursor-pointer bg-gray-100 text-gray-900 shadow-sm '
                                                                                    : 'cursor-not-allowed bg-gray-50 text-gray-200',
                                                                                  checked ? 'bg-indigo-600 text-white' : '',
                                                                                  'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-indigo-600 hover:text-white focus:outline-none sm:flex-1 sm:py-6'
                                                                                )
                                                                              }
                                                                        >
                                                                            {({ active, checked }) => (
                                                                                <>
                                                                                    <RadioGroup.Label as="span">{size.size}</RadioGroup.Label>
                                                                                    {size.inStock ? (
                                                                                        <span
                                                                                            className={classNames(
                                                                                                active ? 'border' : 'border-2',
                                                                                                checked ? 'border-indigo-500' : 'border-transparent',
                                                                                                'pointer-events-none absolute -inset-px rounded-md'
                                                                                            )}
                                                                                            aria-hidden="true"
                                                                                        />
                                                                                    ) : (
                                                                                        <span
                                                                                            aria-hidden="true"
                                                                                            className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                                                                        >
                                                                                            <svg
                                                                                                className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                                                                                viewBox="0 0 100 100"
                                                                                                preserveAspectRatio="none"
                                                                                                stroke="currentColor"
                                                                                            >
                                                                                                <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                                                                            </svg>
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </RadioGroup.Option>
                                                                    ))}
                                                                </div>
                                                            </RadioGroup>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            disabled={!selectedSize}
                                                            onClick={addToBag}
                                                            tabIndex={0}
                                                            className={`mt-6 flex w-full items-center justify-center rounded-md border ${!selectedSize ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'
                                                                } px-8 py-3 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                                        >
                                                            {selectedSize ? 'Add to bag' : 'Select a size'}
                                                        </button>
                                                    </form>
                                                </section>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

        </>
    )
}

export default ProductQuickview;