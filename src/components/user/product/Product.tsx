import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Image, message } from 'antd';
import { StarIcon } from '@heroicons/react/20/solid'
import { RadioGroup } from '@headlessui/react'
import { IProduct, IStorages } from '../../../interfaces/Product/IProduct';
import { BagReducerActionType } from '../../../store/bag/BagReducer';
import { IAuthReducerState } from '../../../store/accounts/AuthReducer';
import { IBag } from '../../../interfaces/Bag/IBag';
import { APP_ENV } from "../../../env/config";
import { getProductById } from '../../../services/product/product-services';
import { createBag } from '../../../services/bag/bag-services';
import Carousel from 'react-material-ui-carousel';
import Slider from 'react-slick';
import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline'
import { RootState } from '../../../store/store';
import { addToFavorite, removeFromFavorite } from '../../../store/favourites/FavoritesReducer';
import { addFavoriteProduct, removeFavoriteProduct } from '../../../services/userFavoriteProducts/user-favorite-products-services';
import { IFavoriteProducts } from '../../../interfaces/FavoriteProducts/IFavoriteProducts';
import Brightness1RoundedIcon from '@mui/icons-material/Brightness1Rounded';
import WomanSizeGuideComponent from './WomanSizeGuideComponent';
import ManSizeGuideComponent from './ManSizeGuideComponent';

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favoriteProducts = useSelector((state: RootState) => state.favorites.favoriteProducts);
  const isFavorite = (productId: number) => favoriteProducts.some((product: { productId: number }) => product.productId === productId);
  const [isQuickviewOpen, setQuickviewOpen] = useState(false);

  useEffect(() => {
    if (Id) {
      getProductById(Id)
        .then(data => setProduct(data))
        .catch(error => console.error('Error fetching product data:', error));
    }
  }, [Id]);

  if (!product) {
    return <p></p>
  }

  const addToBag = async () => {
    if (!isAuth) {
      navigate("/auth");
    }
    else {
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
        message.error('Error adding to bag!');
      }
    }
  }

  const favoriteToggle = async (product: IProduct, e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    if (user) {
      const favoriteProduct: IFavoriteProducts = {
        userId: user?.Id,
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        productImage: product.imagesPath?.[0] ?? '',
        storages: product.storages || null
      };
      if (!isFavorite(product.id)) {
        dispatch(addToFavorite(favoriteProduct));
        await addFavoriteProduct(favoriteProduct);
      } else {
        dispatch(removeFromFavorite(favoriteProduct));
        await removeFavoriteProduct(favoriteProduct);
      }
    }
  };

  const renderSizeGuide = (isQuickviewOpen: boolean) => {
    if (!isQuickviewOpen || typeof product.mainCategoryName !== 'string') {
      return null;
    }

    switch (product.mainCategoryName) {
      case 'Woman':
        return (
          <WomanSizeGuideComponent
            isOpen={isQuickviewOpen}
            setOpen={setQuickviewOpen}
          />
        );
      case 'Man':
        return (
          <ManSizeGuideComponent
            isOpen={isQuickviewOpen}
            setOpen={setQuickviewOpen}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className="overflow-hidden rounded-sm border-stroke bg-gray-100 shadow-default dark:border-strokedark dark:bg-boxdark text-body">

      <div className="pt-6">
        <nav aria-label="Breadcrumb" >
          <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <li key={`${product.id}-mainCategory`}>
              <div className="flex items-center">
                <Link to={`/catalog-home/${product.urlMainCategoryName}`} className="mr-2 text-sm font-medium text-gray-900">
                  {product.mainCategoryName}
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

            <li key={`${product.id}-subCategory`}>

              <div className="flex items-center">
                <Link to={`/catalog/${product.urlSubCategoryName}`} className="mr-2 text-sm font-medium text-gray-900">
                  {product.subCategoryName}
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
            <li key={`${product.id}-category`}>
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
            <li className="text-sm">
            </li>
          </ol>
        </nav>
        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl px-6 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <Slider>
            <Carousel swipe animation="fade" duration={1500} autoPlay={true} indicatorIconButtonProps={{ style: { width: '35px', height: '35px', }, }}
              IndicatorIcon={<Brightness1RoundedIcon fontSize='small' />}
              indicators={true} className="h-full w-full" >
              {product.images?.map((image, index) => (
                <div key={index} className="aspect-h-4 aspect-w-3 rounded" >
                  <Image
                    src={`${baseUrl}/uploads/1200_${image?.imagePath || '/uploads/imagenot.webp'}`}
                    alt={product.name}
                    className="h-full w-full object-cover object-center cursor-pointer"
                  />
                </div>
              ))}
            </Carousel>
          </Slider >
          <div className="mt-4 lg:row-span-3 lg:mt-0 lg:col-start-3">
            {/* Options */}
            <div className="mt-9 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl font-medium  text-gray-900">{product.name}</p>
            </div>
            <div className="lg:row-span-3 lg:mt-0">
              <div className="mt-4 flex items-center justify-between">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-red-800">{product.price.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} €</p>

              </div>
            </div>
            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating, index) => (
                    <StarIcon
                      key={index}
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
                  <a onClick={() => setQuickviewOpen(true)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                    Size guide
                  </a>
                </div>

                {renderSizeGuide(isQuickviewOpen)}

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
                        className={({ active, checked }) =>
                          classNames(
                            size.inStock
                              ? 'cursor-pointer bg-gray-100 text-gray-900 shadow-sm '
                              : 'cursor-not-allowed bg-gray-50 text-gray-200',
                            active ? 'bg-indigo-600 text-white ' : '',
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
              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  disabled={!selectedSize}
                  onClick={addToBag}
                  className={`p-2 mr-3 flex w-full items-center justify-center rounded-md border ${!selectedSize ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'
                    } px-8 py-3 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  {selectedSize ? 'Add to bag' : 'Select a size'}
                </button>

                <div className="cursor-pointer">
                  {isFavorite(product.id) ? (
                    <button className="shrink-0 hover:bg-gray-200 p-2 rounded-xl">
                      <HeartIcon className="w-9 h-9 stroke-1" onClick={(e) => favoriteToggle(product, e)} />
                    </button>

                  ) : (
                    <button className="shrink-0 hover:bg-gray-200 p-2 rounded-xl">
                      <OutlineHeartIcon className="w-9 h-9 stroke-1" onClick={(e) => favoriteToggle(product, e)} />
                    </button>
                  )}
                </div>
              </div>
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
                  {product.highlights.map((highlight, index) => (
                    <li
                      key={index}
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
                <p className="text-sm text-gray-600">{product.details}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}