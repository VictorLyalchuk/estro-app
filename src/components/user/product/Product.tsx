import { useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { RadioGroup } from '@headlessui/react'
import { Link, useNavigate, useParams } from "react-router-dom";
import { IProduct, IStorages } from '../../../interfaces/Site/IProduct';
import axios from 'axios';
import { Carousel, message } from 'antd';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useDispatch, useSelector } from 'react-redux';
import { BagReducerActionType } from '../../../store/bag/BagReducer';
import { IBag } from '../../../interfaces/Info/IBag';
import { IAuthReducerState } from '../../../store/accounts/AuthReducer';
import {APP_ENV} from "../../../env/config";

const productDefault = {
  description:
    'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
  highlights: [
    'Hand cut and sewn locally',
    'Dyed with our proprietary colors',
    'Pre-washed & pre-shrunk',
    'Ultra-soft 100% cotton',
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
}
const reviews = { href: '#', average: 4, totalCount: 117 }

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Product() {
  const baseUrl = APP_ENV.BASE_URL;
  const { Id } = useParams();
  const { isAuth, user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
  const [product, setProduct] = useState<IProduct>();
  const [selectedSize, setSelectedSize] = useState<IStorages | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get<IProduct>(`${baseUrl}/api/Product/ProductByID/${Id}`)
      .then(resp => {
        setProduct(resp.data);
      });
  }, [Id]);


  
  if (!product) {
    return <p></p>
  }

  const handleImageChange = (index: number) => {
    openModal(index);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addToBag = async () => {
    if (!isAuth) {
      navigate("/register");
    }
    else {
      const model: IBag = {
        UserId: user?.Id || "",
        UserEmail: user?.Email || "",
        productId: selectedSize?.productId || 0,
        // productQuantity : selectedSize?.productQuantity || 0,
        size: selectedSize?.size || 0,
      };

      try {
        await axios.post(`${baseUrl}/api/Bag/CreateBag`, model, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        setSelectedSize(null);
        dispatch({
          type: BagReducerActionType.PRODUCT_BAG_COUNT,
          payload: {
            pluscount: 1
          }
        });
        // navigate("/bag");
      }
      catch (ex) {
        message.error('Error adding to bag!');
      }
    }
  }

  return (
    <div className="overflow-hidden rounded-sm border-stroke bg-gray-100 shadow-default dark:border-strokedark dark:bg-boxdark text-body">

      <div className="pt-6">
        <nav aria-label="Breadcrumb" >
          <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {/* {product .breadcrumbs.map((breadcrumb) => ( */}

            <li key={product.id}>
              <div className="flex items-center">
                <a
                  // href={`/catalog/${product.urlMainCategoryName}`} 
                  className="mr-2 text-sm font-medium text-gray-900">
                  {product.mainCategoryName}
                </a>
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>

            <li key={product.id}>
              <div className="flex items-center">
                <a
                  // href={`/catalog/${product.urlSubCategoryName}`} 
                  className="mr-2 text-sm font-medium text-gray-900">
                  {product.subCategoryName}
                </a>
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>

            <li key={product.id}>
              <div className="flex items-center">
                <Link to={`/catalog/${product.urlSubCategoryName}/${product.urlCategoryName}`} className="mr-2 text-sm font-medium text-gray-900">
                  {product.categoryName}
                </Link>
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>

            </li>
            {/* ))} */}
            <li className="text-sm">
              {/* <a href={product.urlCategoryName} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {product.categoryName}
              </a> */}
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <Slider  {...settings} className='btn-indigo-500 '>
            {product.images?.map((image, index) => (
              <div
                key={image.id}
                onClick={() => handleImageChange(index)}
                className={`aspect-h-4 aspect-w-3 overflow-hidden rounded-lg ${index === currentImageIndex ? 'lg:block' : 'hidden lg:grid lg:grid-cols-1 lg:gap-y-8'
                  }`}
              >
                <img
                  src={`${baseUrl}/uploads/1200_${image?.imagePath || '/uploads/default.jpg'}`}
                  alt={product.name}
                  className="h-full w-full object-cover object-center cursor-pointer"
                />
              </div>
            ))}
          </Slider >
          {isModalOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center">
              <div className="max-w-3xl w-full max-h-full overflow-hidden">
                <Carousel {...settings}>
                  {product?.images?.map((image, index2) => (
                    <div key={index2} className="relative h-full w-full">
                      <img
                        src={`${baseUrl}/uploads/1200_${image?.imagePath || '/uploads/default.jpg'}`}
                        alt={product.name}
                        className="h-full w-full object-cover object-center cursor-pointer"
                      />
                    </div>
                  ))}
                </Carousel>
                <button
                  onClick={closeModal}
                  className="absolute top-0 right-0 mt-4 mr-4 text-white text-xl cursor-pointer"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 lg:row-span-3 lg:mt-0 lg:col-start-3">
            {/* Options */}
            <div className="mt-9 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl font-medium  text-gray-900">{product.name}</p>
            </div>

            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-red-800">{product.price} ₴</p>
            </div>
            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      // key={rating}
                      className={classNames(
                        reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div>

            <form className="mt-10">
              {/* Sizes */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Size guide
                  </a>
                </div>

                <RadioGroup value={selectedSize}
                  onChange={setSelectedSize}
                  className="mt-4">
                  <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                  <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                    {product.storages?.map((size) => (
                      <RadioGroup.Option
                        key={size.size}
                        value={size}
                        disabled={!size.inStock}
                        className={({ active }) =>
                          classNames(
                            size.inStock
                              ? 'cursor-pointer bg-gray-100 text-gray-900 shadow-sm '
                              : 'cursor-not-allowed bg-gray-50 text-gray-200',
                            active ? 'bg-indigo-600 text-white ' : '',
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
                                  'pointer-events-none absolute -inset-px rounded-md '
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
                className={`mt-10 flex w-full items-center justify-center rounded-md border ${!selectedSize ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'
                  } px-8 py-3 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                Add to bag
              </button>
            </form>

            <div className="mt-8">
              <h3 className="text-1xl text-gray-900">Article: {product.article}</h3>
            </div>
            <div className="mt-4">
              <h3 className="text-1xl text-gray-900">Color: {product.color}</h3>
            </div>
            <div className="mt-4">
              <h3 className="text-1xl text-gray-900">Material: {product.material}</h3>
            </div>
            <div className="mt-4">
              <h3 className="text-1xl text-gray-900">Period: {product.purpose}</h3>
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className=" mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-1 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          {/* lg:border-r */}

          <div className="py-10 lg:col-span-3 lg:col-start-1 lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h2 className="text-sm font-medium text-gray-900">Description</h2>


              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {productDefault.highlights.map((highlight) => (
                    <li
                      // key={highlight} 
                      className="text-gray-400">
                      <span className="text-sm text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{productDefault.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
