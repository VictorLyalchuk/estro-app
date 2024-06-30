import { useEffect, useState } from 'react';
import { IStore } from '../../../interfaces/Catalog/IStore';
import { getCity, getStore } from '../../../services/shipping/shipping-services';
import { ICity } from '../../../interfaces/Address/ICity';

const StoreLocations = () => {
  const [storeOptions, setStoreOptions] = useState<IStore[]>([]);
  const [cityOptions, setCityOptions] = useState<ICity[]>([]);
  const [selectedCity, setSelectedCity] = useState('Kiyv');

  useEffect(() => {
    getStore().then(resp => {setStoreOptions(resp);});
    getCity().then(resp => {setCityOptions(resp);});
  }, []);

  const filteredStores = selectedCity
    ? storeOptions.filter(store => store.city === selectedCity)
    : storeOptions;

  return (
    <>
      <div className="bg-gray-100 min-h-[900px]">
        <div className="text-gray-700 mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 text-center p-8">
          <h2 className="text-4xl font-bold mb-4 text-center">Estro Store</h2>
          {/* Sidebar для кнопок */}
          <div className=" p-4 bg-transparent cursor-pointer">

            {cityOptions.map(city => (
              <a
                key={city.id}
                onClick={() => setSelectedCity(city.cityName)}
                className={`text-gray-700 mr-2 py-1 px-2 w-full rounded-md focus:outline-none hover:text-indigo-500 ${selectedCity === city.cityName ? 'bg-indigo-500 text-white hover:text-white' : 'bg-transparent'
                  }`}
              >
                {city.cityName}
              </a>
            ))}
          </div>

          {/* Контент з магазинами */}
          <div className=" p-4" >
            <h2 className="text-2xl font-bold mb-4 mx-auto">{selectedCity}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 text-gray-700 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 ">
              {filteredStores.map((store, index) => (
                <div key={index} className="bg-white rounded-md p-6 shadow-md mb-2 mt-2 hover:bg-indigo-400 hover:text-white">
                  <div className="mx-auto max-w-2xl px-8 py-8 sm:px-6 sm:pt-8 lg:max-w-7xl lg:px-8 hover:bg-indigo-400">
                      <h3 className="text-xl font-semibold mb-2">{store.name}</h3>
                      <p className="text-sm mb-2">{store.address}</p>
                      <p className="text-sm mb-2">{store.workingHours}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreLocations;