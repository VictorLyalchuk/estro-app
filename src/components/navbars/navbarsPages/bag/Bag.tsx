import { useDispatch, useSelector } from "react-redux";
import { IAuthReducerState } from "../../../../store/accounts/AuthReducer";
import { useEffect, useState } from "react";
import { IBagUser } from "../../../../interfaces/Bag/IBagUser";
import { IBagReducerState } from "../../../../store/bag/BagReducer";
import { ICardReducerState } from "../../../../store/bag/CardReducer";
import { IOrderCreate } from "../../../../interfaces/Bag/IOrderCreate";
import GoodsNotFound from "../../../../assets/goods-not-found.png";
import { FormControl } from '@material-ui/core';
import '../../../../satoshi.css';
import { ICity } from "../../../../interfaces/Bag/ICity";
import { IWarehouse } from "../../../../interfaces/Bag/IWarehouse";
import { IStore } from "../../../../interfaces/Catalog/IStore";
import {  getBagByEmail, getBagItemsByEmail } from "../../../../services/bag/bag-services";
import { theme } from "../../../../theme/theme";
import { validateForm } from "../../../../validations/bag/bag-validations";
import { State } from "../../../../interfaces/Custom/Phone/State";
import { validatePhoneNumber } from "../../../../validations/custom/bag-phone-validations";
import { createOrder } from "../../../../services/order/order-services";
import { getCity, getStore, getWarehouse } from "../../../../services/shipping/shipping-services";
import PersonalInformation from "./bagComponents/PersonalInformation";
import DeliveryInformation from "./bagComponents/DeliveryInformation";
import PaymentInformation from "./bagComponents/PaymentInformation";
import OrderSummary from "./bagComponents/OrderSummary";

const Bag = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
  const { count } = useSelector((redux: any) => redux.bag as IBagReducerState);
  const [bagUser, setBagUser] = useState<IBagUser>();
  const bagItems = useSelector((state: { card: ICardReducerState }) => state.card.items) || [];

  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<string | ''>('');

  const [warehouseSelected, setSelectedWarehouse] = useState(false);

  const [warehouseOptions, setWarehouseOptions] = useState<IWarehouse[]>([]);
  const [cityOptions, setCityOptions] = useState<ICity[]>([]);

  const [city, setCity] = useState<string>('');
  const [warehouse, setWarehouse] = useState<string>('');

  const [selectedStore, setSelectedStore] = useState<IStore | null>(null); // вибраний магазин об'єкт
  const [selectedWarehouseOptions, setSelectedWarehouseOptions] = useState<IWarehouse | null>(null);

  const [selectedStoreCity, setSelectedStoreCity] = useState<string | null>(''); // вибраний магазин назва
  const [storeOptions, setStoreOptions] = useState<IStore[]>([]); // список не фільрованих магазинів
  const [filteredStores, setFilteredStores] = useState(storeOptions); // список фільтрованих магазин 
  const [storeCities, setStoreCities] = useState<string[]>([]); // список міст магазинів

  const [activeBlock, setActiveBlock] = useState('personal');
  const [values, setValues] = useState<State>({
    textmask: '(   )    -  -  ',
  });

  const [formData, setFormData] = useState({
    firstName: user?.FirstName || '',
    lastName: user?.LastName || '',
    email: user?.Email || '',
    phoneNumber: user?.PhoneNumber || '',
    address: '',
    payment: 'The money has not been paid',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    city: '',
    warehouse: '',
  });

  useEffect(() => {
    if (user) {
      getBagByEmail(user?.Email).then(data => setBagUser(data));
      getBagItemsByEmail(user?.Email, dispatch);
      setValues((prevValues) => ({
        ...prevValues,
        textmask: user?.PhoneNumber,
      }));
    }

    getCity().then(resp => setCityOptions(resp));

    getStore().then(resp => {
      setStoreOptions(resp.storeOptions);
      setStoreCities(resp.storeCities);
    });
  }, [user, count]);

  useEffect(() => {
    getWarehouse(city).then(resp => setWarehouseOptions(resp));
  }, [city]);

  useEffect(() => {
    clearFields();
    setSelectedStoreCity('');
  }, [selectedShipping]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const model: IOrderCreate = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phonenumber: formData.phoneNumber,
      email: formData.email,
      emailUser: user?.Email || "",
      payment: formData.payment,
      state: "Ukraine",
      region: selectedWarehouseOptions?.SettlementAreaDescription || "",
      city: selectedWarehouseOptions?.CityDescription || selectedStore?.city || "",
      street: selectedWarehouseOptions?.Description || (selectedStore ? `${selectedStore.name} ${selectedStore.address}` : ""),
    };
    event.preventDefault();
    const { isValid, newErrors } = validateForm(formData, city, warehouse, selectedShipping, values.textmask);
    setErrors(newErrors);
    if (isValid) {
      createOrder(model, dispatch);
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const changePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    const cleanedValue = value.replace(/\D/g, '');
    setFormData((prevData) => ({
      ...prevData,
      phoneNumber: cleanedValue,
    }));

    validatePhoneNumber(cleanedValue, errors, setErrors);
  };

  const handleChangeCity = (_e: React.ChangeEvent<{}>, value: ICity | null) => {
    if (value) {
      setSelectedWarehouse(true);
      setCity(value.Ref);
    }
  }

  const handleChangeWarehouse = (_e: React.ChangeEvent<{}>, value: IWarehouse | null) => {
    if (!value) {
      setSelectedWarehouseOptions(null);
    } else {
      setWarehouse(value.Ref);
      setSelectedWarehouseOptions(value);
    }
  }

  const handleChangeStoreCity = (_e: React.ChangeEvent<{}>, value: string | null) => {
    if (value !== selectedStoreCity) {
      setSelectedWarehouse(true);
      setSelectedStoreCity(value);
      const filtered = value ? storeOptions.filter(store => store.city === value) : storeOptions;
      setFilteredStores(filtered);
      setCity(value || '');
      if (selectedStore && selectedStore.city !== value) {
        setSelectedStore(null);
        setWarehouse('');
      }
    }
  }

  const handleChangeStore = (_e: React.ChangeEvent<{}>, value: IStore | null) => {
    if (value) {
      setSelectedStore(value);
      setWarehouse(value?.name);
    };
  }

  const clearFields = async () => {
    setWarehouse("");
    setCity("");
    setSelectedWarehouseOptions(null);
    setSelectedStore(null);
    setSelectedWarehouse(false);
  };

  const moneyPayment = async () => {
    setFormData((prevData) => ({
      ...prevData,
      payment: 'The money has been paid',
    }));
  };

  const handleBlockClick = (blockName: string) => {
    if (activeBlock !== blockName) {
      setActiveBlock(blockName);
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto p-8 flex  relative bg-gray-100 mx-auto max-w-7xl px-2 sm:px-2 lg:px-2   flex-col lg:flex-row justify-between min-h-[780px]">
        {bagItems && bagItems.length > 0 ? (
          <>
            {/* Order Summary */}
            <OrderSummary
              bagUser={bagUser}
              bagItems={bagItems}
              email={user?.Email}
              dispatch={dispatch}
            />

            <div className="w-full lg:w-2/4 p-5 lg:mb-0">
              <form onSubmit={onSubmit}>

                {/* Personal Information */}
                <PersonalInformation
                  theme={theme}
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                  activeBlock={activeBlock}
                  handleBlockClick={handleBlockClick}
                  changePhoneNumber={changePhoneNumber}
                  values={values}
                />

                {/* Shipping */}
                <DeliveryInformation
                  theme={theme}
                  errors={errors}
                  activeBlock={activeBlock}
                  handleBlockClick={handleBlockClick}
                  selectedShipping={selectedShipping}
                  setSelectedShipping={setSelectedShipping}
                  cityOptions={cityOptions}
                  warehouseOptions={warehouseOptions}
                  handleChangeCity={handleChangeCity}
                  handleChangeWarehouse={handleChangeWarehouse}
                  warehouseSelected={warehouseSelected}
                  selectedWarehouseOptions={selectedWarehouseOptions}
                  storeCities={storeCities}
                  filteredStores={filteredStores}
                  handleChangeStoreCity={handleChangeStoreCity}
                  handleChangeStore={handleChangeStore}
                  selectedStoreCity={selectedStoreCity}
                  selectedStore={selectedStore}
                />
                {/* Patment */}
                <PaymentInformation
                  theme={theme}
                  formData={formData}
                  activeBlock={activeBlock}
                  handleBlockClick={handleBlockClick}
                  selectedPayment={selectedPayment}
                  setSelectedPayment={setSelectedPayment}
                  moneyPayment={moneyPayment}
                />

                {/* Checkout Button */}
                <div className="mt-8 flex justify-end">
                  <FormControl fullWidth variant="outlined">
                    <button
                      type="submit"
                      className='flex w-full items-center justify-center rounded-md border bg-indigo-600 hover:bg-indigo-700
                  px-8 py-3 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                      Confirm The Order
                    </button>
                  </FormControl>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="container mx-auto p-8 flex justify-center relative bg-gray-100 mx-auto max-w-7xl px-2 sm:px-2 lg:px-2 flex-col lg:flex-row">
            <div className="w-full lg:w-2/4 p-5 mb-8 lg:mb-0">
              <div className="mt-8 flex justify-center">
                <img src={GoodsNotFound}></img>
              </div>
              <div className="mt-8 flex justify-center">
                <p>No items in the bag.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}

export default Bag;