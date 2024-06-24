import { ThemeProvider } from '@material-ui/core/styles';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import PostomatShipping from '../ukraineDelivery/PostomatShipping';
import BranchShipping from '../ukraineDelivery/BranchShipping';
import StoreShipping from '../ukraineDelivery/StoreShipping';
import { IWarehouse } from '../../../../../interfaces/Bag/IWarehouse';
import { ICity } from '../../../../../interfaces/Bag/ICity';
import { IStore } from '../../../../../interfaces/Catalog/IStore';
import { deliveryList } from '../../../../../data/deliveryList';

interface DeliveryInformationProps {
  theme: any;
  errors: { city?: string; warehouse?: string };
  activeBlock: string;
  handleBlockClick: (block: string) => void;
  selectedShipping: string;
  setSelectedShipping: (value: string) => void;
  cityOptions: ICity[];
  warehouseOptions: IWarehouse[];
  handleChangeCity: (event: React.ChangeEvent<{}>, value: ICity | null) => void;
  handleChangeWarehouse: (event: React.ChangeEvent<{}>, value: IWarehouse | null) => void;
  warehouseSelected: boolean;
  selectedWarehouseOptions: IWarehouse | null;
  storeCities: string[];
  filteredStores: IStore[];
  handleChangeStoreCity: (event: React.ChangeEvent<{}>, value: string | null) => void;
  handleChangeStore: (event: React.ChangeEvent<{}>, value: IStore | null) => void;
  selectedStoreCity: string | null;
  selectedStore: IStore | null;
}

const DeliveryInformation: React.FC<DeliveryInformationProps> = ({
  theme,
  errors,
  activeBlock,
  handleBlockClick,
  selectedShipping,
  setSelectedShipping,
  cityOptions,
  warehouseOptions,
  handleChangeCity,
  handleChangeWarehouse,
  warehouseSelected,
  selectedWarehouseOptions,
  storeCities,
  filteredStores,
  handleChangeStoreCity,
  handleChangeStore,
  selectedStoreCity,
  selectedStore,
}) => {
  return (
    <div className={`bg-white p-5 rounded-md shadow-md mb-8 ${errors.city || errors.warehouse ? 'border-2 border-red-500' : ''}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold mb-4 cursor-pointer" onClick={() => handleBlockClick('delivery')}>
          Delivery Information
        </h3>
      </div>
      <div className="border-t pt-4">
        {activeBlock === 'delivery' && (
          <div className="">
            <ThemeProvider theme={theme}>
              <div >
                <RadioGroup value={selectedShipping} onChange={setSelectedShipping} >
                  <RadioGroup.Label className="sr-only">Delivery Information</RadioGroup.Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deliveryList.map((delivery) => (
                      <RadioGroup.Option
                        key={delivery.id}
                        value={delivery.id}
                        className={({ active, checked }) =>
                          `max-w-sm rounded overflow-hidden shadow-lg cursor-pointer ${active ? 'border-2 border-indigo-600 ring-2 ring-indigo-600' : ''
                          } ${checked ? 'border-2 border-indigo-600' : 'border-2 border-gray-200'}
                                    ${selectedShipping === '' ? 'border-2 border-red-500' : ''}`
                        }
                      >
                        {({ checked }) => (
                          <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                              <RadioGroup.Label as="div" className="font-bold text-xl mb-2 mr-10">
                                {delivery.logo}{delivery.title}
                              </RadioGroup.Label>
                              {checked && (
                                <CheckCircleIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                              )}
                            </div>
                            <p className="text-gray-700 text-base">{delivery.subtitle}</p>
                          </div>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {selectedShipping === 'Branch' && (
                <BranchShipping
                  cityOptions={cityOptions}
                  warehouseOptions={warehouseOptions}
                  handleChangeCity={handleChangeCity}
                  handleChangeWarehouse={handleChangeWarehouse}
                  warehouseSelected={warehouseSelected}
                  selectedWarehouseOptions={selectedWarehouseOptions}
                  errors={errors}
                />
              )}

              {selectedShipping === 'Postomat' && (
                <PostomatShipping
                  cityOptions={cityOptions}
                  warehouseOptions={warehouseOptions}
                  handleChangeCity={handleChangeCity}
                  handleChangeWarehouse={handleChangeWarehouse}
                  warehouseSelected={warehouseSelected}
                  selectedWarehouseOptions={selectedWarehouseOptions}
                  errors={errors}
                />
              )}

              {selectedShipping === 'Store' && (
                <StoreShipping
                  storeCities={storeCities}
                  filteredStores={filteredStores}
                  handleChangeStoreCity={handleChangeStoreCity}
                  handleChangeStore={handleChangeStore}
                  warehouseSelected={warehouseSelected}
                  selectedStoreCity={selectedStoreCity}
                  selectedStore={selectedStore}
                  errors={errors}
                />
              )}
            </ThemeProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryInformation;