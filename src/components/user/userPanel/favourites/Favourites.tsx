import { useSelector } from "react-redux";
import { SettingsUserProps } from "../../../../interfaces/Custom/Phone/ProfileUser/ProfileUserProps";
import { RootState } from "../../../../store/store";
import { APP_ENV } from "../../../../env/config";
import { Link } from "react-router-dom";
import { useState } from "react";

const Favourites: React.FC<SettingsUserProps> = () => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const favoriteProducts = useSelector((state: RootState) => state.favourites.favoriteProducts);
  const baseUrl = APP_ENV.BASE_URL;

  const handleLoadAllProducts = () => {
    setShowAllProducts((prevShowAllProducts) => !prevShowAllProducts);
  };
  const displayedProducts = showAllProducts ? favoriteProducts : favoriteProducts.slice(0, 6);

  return (
    <>
      <div className="bg-white rounded-md shadow-md mb-8 mt-8">
        <div className="mx-auto max-w-2xl px-8 py-8 sm:px-6 sm:pt-8 lg:max-w-7xl lg:px-8">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div className="px-4 py-6 sm:p-6 lg:pb-8">
              <div className="sm:flex sm:items-baseline sm:justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">My Favorites</h2>
                <button onClick={handleLoadAllProducts} className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
                  {showAllProducts ? 'Show less' : 'Browse all favorites'}
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 lg:gap-x-8">
                {displayedProducts.map((product, index) => (
                  <div key={index} className="group relative mb-14 pb-7 hover13">
                    <div className=" w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2 sm:min-h-auto">
                      <img
                        src={`${baseUrl}/uploads/1200_${product.productImage || '/uploads/default.jpg'}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-gray-900">
                      <Link to={`/product/${product.productId}`}>
                        <span className="absolute inset-0" />
                        {product.productName}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.productPrice.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} ₴</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 sm:hidden">
                <button onClick={handleLoadAllProducts} className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                  {showAllProducts ? 'Show less' : 'Browse all favorites'}
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </div>
              <div className="container mx-auto flex relative max-w-7xl lg:flex-row justify-between m-0">
                <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between ">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{displayedProducts.length}
                      </span> results
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Favourites;