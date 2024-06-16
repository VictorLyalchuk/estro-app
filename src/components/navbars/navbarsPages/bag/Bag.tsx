import { useDispatch, useSelector } from "react-redux";
import { IAuthReducerState } from "../../../../store/accounts/AuthReducer";
import { useEffect, useState } from "react";
import { BagItems, IBagUser } from "../../../../interfaces/Bag/IBagUser";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { IBagReducerState } from "../../../../store/bag/BagReducer";
import { ICardReducerState } from "../../../../store/bag/CardReducer";
import { IOrderCreate } from "../../../../interfaces/Bag/IOrderCreate";
import { APP_ENV } from "../../../../env/config";
import GoodsNotFound from "../../../../assets/goods-not-found.png";
import { FormControl, Input, TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import '../../../../satoshi.css';
import { ICity } from "../../../../interfaces/Bag/ICity";
import { IWarehouse } from "../../../../interfaces/Bag/IWarehouse";
import { RadioGroup } from '@headlessui/react';
import { IStore } from "../../../../interfaces/Catalog/IStore";
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { decrease, deleteItems, getBagByEmail, getBagItemsByEmail, increase } from "../../../../services/bag/bag-services";
import { deliveryList, paymentList } from "../../../../data/deliveryList";
import { theme } from "../../../../theme/theme";
import { validateForm } from "../../../../validations/bag/bag-validations";
import { State } from "../../../../interfaces/Custom/Phone/State";
import { validatePhoneNumber } from "../../../../validations/custom/bag-phone-validations";
import TextMaskCustom from "../../../../services/custom/phone-services";
import { createOrder } from "../../../../services/order/order-services";
import BranchShipping from "./ukraine/BranchShipping";
import PostomatShipping from "./ukraine/PostomatShipping";
import StoreShipping from "./ukraine/StoreShipping";
import { getCity, getStore, getWarehouse } from "../../../../services/shipping/shipping-services";

const Bag = () => {
  const baseUrl = APP_ENV.BASE_URL;
  const dispatch = useDispatch();
  const { total, taxes, totalWithOutTax, initialIndividualItemPrice } = useSelector((redux: any) => redux.card as ICardReducerState);
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
      <div className="container mx-auto p-8 flex  relative bg-gray-100 mx-auto max-w-7xl px-2 sm:px-2 lg:px-2   flex-col lg:flex-row justify-between">
        {bagItems && bagItems.length > 0 ? (
          <>
            <div className="w-full lg:w-2/4 p-5 lg:mb-0">
              <div className="bg-white p-5 rounded-md shadow-md mb-8">
                <div className="grid grid-rows-1">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 ">Order Summary</h1>
                  <dl className="flex mt-2">
                    <dt className="text-gray-500">Order Date&nbsp;</dt>
                    <dd className="font-medium text-gray-900"></dd>
                    <dt>
                      <span className="sr-only">Date</span>
                      <span className="mx-2 text-gray-400" aria-hidden="true">
                        &middot;
                      </span>
                    </dt>
                    <dd className="font-medium text-gray-900">
                      <time dateTime="2021-03-22">{bagUser?.orderDate}</time>
                    </dd>
                  </dl>
                </div>
              </div>
              {bagItems.map((item: BagItems, index: number) => (
                <div key={index} className="border-b bg-white pt-4 p-6 rounded-md shadow-md mb-8">
                  <div className="flex justify-between">
                    <div className="flex justify-between items-center ">
                      <h3 className="font-semibold mb-4 mr-14 ">Product {index + 1}</h3>
                      <h3 className="font-semibold mb-4">{item.name}</h3>
                    </div>
                    <button className="mb-3 group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-2.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-100 hover:border-gray-300 focus-within:outline-gray-300"
                      onClick={() => deleteItems(item, user?.Email || '', dispatch)}>
                      <TrashIcon className="w-5 h-5 mb-4stroke-gray-900 transition-all duration-500 group-hover:stroke-black"/>
                    </button>
                  </div>
                  <div className="border-t pt-4 flex">
                    <img
                      src={`${baseUrl}/uploads/1200_${item?.image || '/uploads/default.jpg'}`}
                      alt={item?.image}
                      className="w-24 h-36 object-cover rounded-md mr-4"
                    />
                    <div className="w-1/2 ml-4 mx-auto">
                      <h3 className="text-lg font-semibold mb-2 mr-auto whitespace-nowrap">Total product price: {initialIndividualItemPrice[item.id].toLocaleString('uk-UA', { minimumFractionDigits: 2 })} ₴</h3>
                      <p className="text-gray-600 mb-2">Size: {item.size}</p>
                      <p className="text-gray-600 mb-2">Article: {item.article}</p>
                      <p className="text-gray-600 mb-2">Price: {item.price.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} ₴</p>
                      <div className="flex items-center ml-auto mt-6">
                        <button
                          onClick={() => decrease(item, user?.Email || '', dispatch)}
                          className="mr-3 group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-2.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-100 hover:border-gray-300 focus-within:outline-gray-300">
                          <MinusIcon className="h-5 w-5 stroke-gray-900 transition-all duration-500 group-hover:stroke-black" />
                        </button>
                        <span
                          className="border border-gray-200 rounded-full w-10 aspect-square outline-none text-gray-900 font-semibold text-sm py-2 px-3 bg-gray-100  text-center"
                        > {item.quantity}</span>
                        <button
                          onClick={() => increase(item, user?.Email || '', dispatch)}
                          className="ml-3  group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-2.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-100 hover:border-gray-300 focus-within:outline-gray-300">
                          <PlusIcon className="h-5 w-5 stroke-gray-900 transition-all duration-500 group-hover:stroke-black" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            <div className="w-full lg:w-2/4 p-5 lg:mb-0">

              <form onSubmit={onSubmit}>

                <div className="bg-white p-5 rounded-md shadow-md mb-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold mb-4 cursor-pointer" onClick={() => handleBlockClick('personal')}>Personal Information</h3>
                  </div>

                  <div className="border-t pt-4">
                  {activeBlock === 'personal' && (
                    <div className="">

                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <ThemeProvider theme={theme}>
                        <FormControl fullWidth variant="outlined">
                          <TextField
                            name="firstName"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!errors.firstName}
                            className="mt-1"
                            size="small"
                          />
                          {errors.firstName ? (
                            <div className="h-6 text-xs text-red-500">Error: {errors.firstName}</div>
                          ) : (<div className="h-6 text-xs "> </div>)}
                        </FormControl>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <FormControl fullWidth variant="outlined">
                          <TextField
                            name="lastName"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={!!errors.lastName}
                            size="small"
                          />
                          {errors.lastName ? (
                            <div className="h-6 text-xs text-red-500">Error: {errors.lastName}</div>
                          ) : (<div className="h-6 text-xs "> </div>)}
                        </FormControl>

                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <FormControl fullWidth variant="outlined">
                          <TextField
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            size="small"
                            autoComplete="email"

                          />
                          {errors.email ? (
                            <div className="h-6 text-xs text-red-500">Error: {errors.email}</div>
                          ) : (<div className="h-6 text-xs "> </div>)}
                        </FormControl>

                        <label htmlFor="textmask" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <FormControl fullWidth variant="outlined">
                          <Input
                            name="textmask"
                            id="textmask"
                            value={values.textmask}
                            onChange={changePhoneNumber}
                            inputComponent={TextMaskCustom as any}
                            error={!!errors.phoneNumber}
                            placeholder='(099) 00-00-000'
                          />
                          {errors.phoneNumber ? (
                            <div className="h-6 text-xs text-red-500">Error: {errors.phoneNumber}</div>
                          ) : (<div className="h-6 text-xs "> </div>)}
                        </FormControl>
                      </ThemeProvider>
                    </div>
                )}
                  </div>
                </div>

                <div className={`bg-white p-5 rounded-md shadow-md mb-8 ${errors.city || errors.warehouse? 'border-2 border-red-500' : ''}`}>
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold mb-4 cursor-pointer" 
                    onClick={() => handleBlockClick('delivery')}
                    >Delivery Information</h3>
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
                            errors={errors} />
                        )}

                        {selectedShipping === 'Postomat' && (
                          <PostomatShipping
                            cityOptions={cityOptions}
                            warehouseOptions={warehouseOptions}
                            handleChangeCity={handleChangeCity}
                            handleChangeWarehouse={handleChangeWarehouse}
                            warehouseSelected={warehouseSelected}
                            selectedWarehouseOptions={selectedWarehouseOptions}
                            errors={errors} />
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
                            errors={errors} />

                        )}
                      </ThemeProvider>
                    </div> 
                    )} 
                  </div>
                </div>

                <div className="bg-white p-5 rounded-md shadow-md mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold mb-4 cursor-pointer" onClick={() => handleBlockClick('payment')}>Payment Information</h3>
                  </div>
                  <div className="border-t pt-4">
                  {activeBlock === 'payment' && (
                    <div className="mb-5 border-b pb-4">
                      <div className="pb-4">
                        <ThemeProvider theme={theme}>
                          {formData.payment === 'The money has not been paid' && (
                            <>
                              <div>
                                <RadioGroup value={selectedPayment} onChange={setSelectedPayment} >
                                  <RadioGroup.Label className="sr-only">Delivery Information</RadioGroup.Label>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {paymentList.map((payment) => (
                                      <RadioGroup.Option
                                        key={payment.id}
                                        value={payment.id}
                                        className={({ active, checked }) =>
                                          `max-w-sm rounded overflow-hidden shadow-lg cursor-pointer ${active ? 'border-2 border-indigo-600 ring-2 ring-indigo-600' : ''
                                          } ${checked ? 'border-2 border-indigo-600' : 'border-2 border-gray-200'}`
                                        }
                                      >
                                        {({ checked }) => (
                                          <div className="px-6 py-4">
                                            <div className="flex items-center justify-between">
                                              <RadioGroup.Label as="div" className="font-bold text-xl mb-2 mr-10">
                                                {payment.logo} {payment.title}
                                              </RadioGroup.Label>
                                              {checked && (
                                                <CheckCircleIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                                                // <span className="text-blue-700 font-bold">&#10003;</span>
                                              )}
                                            </div>
                                            <p className="text-gray-700 text-base">{payment.subtitle}</p>
                                          </div>
                                        )}
                                      </RadioGroup.Option>
                                    ))}
                                  </div>
                                </RadioGroup>
                              </div>

                              {selectedPayment === 'PaymentBefore' && (
                                <div className="mt-5">
                                  <button
                                    type="button"
                                    onClick={moneyPayment}
                                    className='mt-10 flex w-40 mx-auto items-center justify-center rounded-md border bg-indigo-600 hover:bg-indigo-700
                                px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                                    Pay Now
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </ThemeProvider>
                      </div>
                      <dl className="pt-2 mt-8 divide-y divide-gray-200 text-sm ">
                        <div className="flex items-center justify-between pb-4">
                          <dt className="text-gray-600">Subtotal</dt>
                          <dd className="font-medium text-gray-900">{totalWithOutTax.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} ₴</dd>
                        </div>
                        <div className="flex items-center justify-between py-4">
                          <dt className="text-gray-600">Tax</dt>
                          <dd className="font-medium text-gray-900">{taxes.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} ₴</dd>
                        </div>
                        <div className="flex items-center justify-between py-4">
                          <dt className="text-gray-600">Discount</dt>
                          <dd className="font-medium text-red-600">0 ₴</dd>
                        </div>
                        <div className="flex items-center justify-between py-4">
                          <dt className="text-gray-600">Payment</dt>
                          <dd className={`font-medium ${formData.payment === 'The money has not been paid' ? 'text-red-500' : 'text-green-500'}`}>{formData.payment}</dd>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                          <dt className="font-medium text-gray-900">Order total</dt>
                          <dd className="font-medium text-indigo-600">{total.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} ₴</dd>
                        </div>
                      </dl>

                    </div>
                    )}
                  </div>
                </div>
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
          <div className="container mx-auto p-8 flex justify-center relative bg-gray-100 mx-auto max-w-7xl px-2 sm:px-2 lg:px-2   flex-col lg:flex-row  ">
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