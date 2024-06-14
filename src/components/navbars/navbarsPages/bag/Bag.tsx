import { useDispatch, useSelector } from "react-redux";
import { IAuthReducerState } from "../../../../store/accounts/AuthReducer";
import { useEffect, useState } from "react";
import { BagItems, IBagUser } from "../../../../interfaces/Bag/IBagUser";
import axios from "axios";
import moment from "moment";
import { BanknotesIcon, BuildingStorefrontIcon, CreditCardIcon, EnvelopeIcon, MinusIcon, PlusIcon, Squares2X2Icon, TrashIcon } from "@heroicons/react/24/outline";
import { BagReducerActionType, IBagReducerState } from "../../../../store/bag/BagReducer";
import { CardReducerActionType, ICardReducerState } from "../../../../store/bag/CardReducer";
import { message } from "antd";
import { IOrderCreate } from "../../../../interfaces/Bag/IOrderCreate";
import { APP_ENV } from "../../../../env/config";
import GoodsNotFound from "../../../../assets/goods-not-found.png";
import { FormControl, TextField, TextFieldProps } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import '../../../../satoshi.css';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { JSX } from "react/jsx-runtime";
import { ICity } from "../../../../interfaces/Bag/ICity";
import { IWarehouse } from "../../../../interfaces/Bag/IWarehouse";
import { RadioGroup } from '@headlessui/react';
import { IStore } from "../../../../interfaces/Catalog/IStore";
import { CheckCircleIcon } from '@heroicons/react/20/solid'
// import ButtonLeft from "./ButtonLeft";
// import ButtonRight from "./ButtonRight";

const theme = createTheme({
  typography: {
    fontFamily: 'Satoshi, sans-serif',
  },
});

const deliveryList = [
  { id: 'Branch', title: 'Sending to the Branch', logo: <Squares2X2Icon className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }}/>, subtitle: 'Money Transfer Fees' },
  { id: 'Postomat', title: 'Sending to the Postomat', logo: <EnvelopeIcon className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }}/>, subtitle: 'Full payment required' },
  { id: 'Store', title: 'Sending to the Store', logo: <BuildingStorefrontIcon className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }}/>, subtitle: 'Free shipping' },
];

const paymentList = [
  { id: 'PaymentAfter', title: 'Payment upon receipt', logo: <BanknotesIcon className="size-10 hover:text-indigo-700" style={{ transition: "color 0.3s" }}/>, subtitle: 'Delivery payment at the carriers rates, including cash on delivery services. The service is available for goods worth 1,000 hryvnias or more. WARNING! All ordered goods are sent by separate parcels.' },
  { id: 'PaymentBefore', title: 'Payment on the website', logo: <CreditCardIcon className="size-10 hover:text-indigo-700" style={{ transition: "color 0.3s" }}/>, subtitle: 'If the cost of a product unit is over 1,000 hryvnias - delivery is free. WARNING! All goods are sent by separate parcels' },
];
const Bag = () => {
  const baseUrl = APP_ENV.BASE_URL;
  const { user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
  const [bagUser, setBagUser] = useState<IBagUser>();
  const dispatch = useDispatch();
  const { count } = useSelector((redux: any) => redux.bag as IBagReducerState);
  const { total } = useSelector((redux: any) => redux.card as ICardReducerState);
  const { taxes } = useSelector((redux: any) => redux.card as ICardReducerState);
  const { totalWithOutTax } = useSelector((redux: any) => redux.card as ICardReducerState);
  const { initialIndividualItemPrice } = useSelector((redux: any) => redux.card as ICardReducerState);
  const bagItems = useSelector((state: { card: ICardReducerState }) => state.card.items) || [];
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [warehouseSelected, setSelectedWarehouse] = useState(false);
  const [warehouseOptions, setWarehouseOptions] = useState<IWarehouse[]>([]);
  const [selectedWarehouseOptions, setSelectedWarehouseOptions] = useState<IWarehouse | null>(null);
  const [warehouse, setWarehouse] = useState<string>('');
  const [cityOptions, setCityOptions] = useState<ICity[]>([]);
  const [city, setCity] = useState<string>('');
  const [storeOptions, setStoreOptions] = useState<IStore[]>([]);
  const [filteredStores, setFilteredStores] = useState(storeOptions);
  const [storeCities, setStoreCities] = useState<string[]>([]);
  const [selectedStoreCity, setSelectedStoreCity] = useState<string | null>('');
  const [selectedStore, setSelectedStore] = useState<IStore | null>(null);

  useEffect(() => {
    if (user) {
      axios.get<IBagUser>(`${baseUrl}/api/Bag/GetBagByEmail/${user?.Email}`)
        .then(resp => {
          const formattedData: IBagUser = {
            id: resp.data.id,
            countProduct: resp.data.countProduct,
            userEmail: resp.data.userEmail,
            userId: resp.data.userId,
            orderDate: moment(resp.data.orderDate, 'YYYY-MM-DD').format('DD MMMM YYYY'),
          };
          setBagUser(formattedData);
        })
        .catch(itemsError => {
          console.error("Error fetching bag items:", itemsError);
        });

      axios.get<BagItems[]>(`${baseUrl}/api/Bag/GetBagItemsByEmail/${user?.Email}`)
        .then(itemsResp => {
          dispatch({
            type: CardReducerActionType.SET,
            payload: {
              items: itemsResp.data
            }
          });
        })
        .catch(error => {
          console.error("Error fetching bag data:", error);
        });
    }
    getCity();
    getStore();
    // setSelectedShipping('Branch');
    // setSelectedPayment('PaymentAfter');
  }, [user, count]);

  useEffect(() => {
    getWarehouse();
  }, [city]);

  useEffect(() => {
    clearFields();
  }, [selectedShipping]);

  const refreashCount = async () => {
    axios.get<number>(`${baseUrl}/api/Bag/GetCountBagByEmail/${user?.Email}`)
      .then(resp => {
        dispatch({
          type: BagReducerActionType.GET_PRODUCT_BAG_COUNT,
          payload: {
            count: resp.data
          }
        });
      });
  }

  const deleteItems = async (item: BagItems) => {
    const itemId = item.id
    if (itemId) {

      try {
        await axios.delete(`${baseUrl}/api/Bag/DeleteBagItem/${item.id}`)
        dispatch({
          type: CardReducerActionType.DELETE,
          payload: {
            itemId: itemId
          }
        });
        await refreashCount();
      } catch (error) {
        console.error("Error deleting bag items:", error);
      }

    }
  }

  const increase = async (item: BagItems) => {
    if (item.quantity < 10) {
      await axios.post(`${baseUrl}/api/Bag/SetIncrease/${item.id}`);
      await refreashCount();
    }
  }
  const decrease = async (item: BagItems) => {
    if (item.quantity > 1) {
      await axios.post(`${baseUrl}/api/Bag/SetDecrease/${item.id}`)
      await refreashCount();
    }
  }
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
    if (validateForm()) {
      try {
        await axios.post(`${baseUrl}/api/OrderControllers/CreateOrder`, model, {
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
      catch (ex) {
        message.error('Error adding product!');
      }
      dispatch({
        type: CardReducerActionType.DELETE_ALL,
      });
      dispatch({
        type: BagReducerActionType.DELETE_PRODUCT_BAG_COUNT,
        payload: {
          minuscount: 0
        }
      });
    }
  }

  const [formData, setFormData] = useState({
    firstName: user?.FirstName || '',
    lastName: user?.LastName || '',
    email: user?.Email || '',
    phoneNumber: '+38' + user?.PhoneNumber,
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: {
      firstName: string;
      lastName: string;
      confirmPassword: string;
      phoneNumber: string;
      email: string;
      password: string;
      city: string;
      warehouse: string;
    } = {
      firstName: "",
      lastName: "",
      confirmPassword: "",
      phoneNumber: "",
      email: "",
      password: "",
      city: "",
      warehouse: "",
    };

    if (formData.firstName.trim() === '') {
      newErrors.firstName = 'First Name is required';
      isValid = false;
    }

    if (formData.lastName.trim() === '') {
      newErrors.lastName = 'Last Name is required';
      isValid = false;
    }

    if (formData.email.trim() === '' || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }

    if (city.trim() === '') {
      newErrors.city = 'City is required';
      isValid = false;
    }

    if (selectedShipping === 'Branch') {
      if (warehouse.trim() === '') {
        newErrors.warehouse = 'Warehouse is required';
        isValid = false;
      }
    }
    if (selectedShipping === 'Postomat') {
      if (warehouse.trim() === '') {
        newErrors.warehouse = 'Postomat is required';
        isValid = false;
      }
    }
    if (selectedShipping === 'Store') {
      if (warehouse.trim() === '') {
        newErrors.warehouse = 'Store is required';
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
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
    }
  }

  const handleChangeStore = (_e: React.ChangeEvent<{}>, value: IStore | null) => {
    if (value) {
      setSelectedStore(value);
      setWarehouse(value?.name);
    };
  }

  const getWarehouse = async () => {
    const apiUrl = 'https://api.novaposhta.ua/v2.0/json/';
    const payload = {
      apiKey: 'f8df4fb4933f7b40c96b872a1901be8e',
      modelName: 'Address',
      calledMethod: 'getWarehouses',
      methodProperties: {
        "CityRef": city
      }
    };

    try {
      const response = await axios.post(apiUrl, payload);
      setWarehouseOptions(response.data.data);
    } catch (error) {
      console.error('Error fetching warehouses', error);
    }
  }

  const getCity = async () => {
    const apiUrl = 'https://api.novaposhta.ua/v2.0/json/';
    const payload = {
      apiKey: 'f8df4fb4933f7b40c96b872a1901be8e',
      modelName: 'Address',
      calledMethod: 'getCities',
      methodProperties: {
      }
    };

    try {
      const response = await axios.post(apiUrl, payload);
      setCityOptions(response.data.data);
    } catch (error) {
      console.error('Error fetching cities', error);
    }
  }

  const getStore = async () => {
    try {
      const resp = await axios.get<IStore[]>(`${baseUrl}/api/StoreControllers/StoreAll`);
      setStoreOptions(resp.data);
      const uniqueCities = Array.from(new Set(resp.data.map(option => option.city)));
      setStoreCities(uniqueCities);

    } catch (error) {
      console.error('Error fetching stores', error);
    }
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
                    <div className="flex justify-between">
                      <h3 className="font-semibold mb-4 mr-14">Product {index + 1}</h3>
                      <h3 className="font-semibold mb-4">{item.name}</h3>
                    </div>
                    <button className="font-medium text-gray-700 hover:text-indigo-500">
                      <TrashIcon className="w-5 h-5 mb-4"
                        onClick={() => deleteItems(item)}
                      />
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
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md mr-2 hover:bg-gray-300" onClick={() => decrease(item)}>
                          <MinusIcon className="h-5 w-3" />
                        </button>
                        <span className="mx-2 w-3">{item.quantity}</span>
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md ml-2 hover:bg-gray-300" onClick={() => increase(item)} >
                          <PlusIcon className="h-5 w-3 " />
                        </button>


                        {/* <button className="group rounded-l-xl px-5 py-[10px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300" onClick={() => decrease(item)}>
                          <ButtonLeft  />
                        </button>
                        <span className="border-y border-gray-200 outline-none text-gray-900 font-semibold text-lg w-full max-w-[73px] min-w-[60px] placeholder:text-gray-900 py-[7px]  text-center bg-transparent">{item.quantity}</span>
                        <button className="group rounded-r-xl px-5 py-[10px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:border-indigo-50 hover:bg-indigo-600 hover:text-white hover:shadow-gray-300 focus-within:outline-gray-300" onClick={() => increase(item)} >
                          <ButtonRight  />

                        </button> */}
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
                    <h3 className="text-2xl font-semibold mb-4">Personal Information</h3>
                  </div>

                  <div className="border-t pt-4">
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

                        <label htmlFor="formatted-text-mask-input" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <FormControl fullWidth variant="outlined">
                          <TextField
                            name="formatted-text-mask-input"
                            id="formatted-text-mask-input"
                            value={formData.phoneNumber}
                            size="small"
                            disabled
                            InputProps={{
                              style: { fontWeight: 'bold' },
                            }}
                          />
                          {errors.phoneNumber ? (
                            <div className="h-6 text-xs text-red-500">Error: {errors.phoneNumber}</div>
                          ) : (<div className="h-6 text-xs "> </div>)}
                        </FormControl>
                      </ThemeProvider>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-md shadow-md mb-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold mb-4">Delivery Information</h3>
                  </div>
                  <div className="border-t pt-4">
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
                                    } ${checked ? 'border-2 border-indigo-600' : 'border-2 border-gray-200'}`
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
                          <div className="mt-5">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>

                            <FormControl fullWidth variant="outlined">
                              <Autocomplete
                                id="city"
                                options={cityOptions.filter(option => option.SettlementTypeDescription === 'місто')}
                                getOptionLabel={(option) => option.Description}
                                onChange={handleChangeCity}
                                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    size="small"
                                    error={!!errors.city}
                                  />
                                )}
                              />
                              {errors.city ? (
                                <div className="h-6 text-xs text-red-500">Error: {errors.city}</div>
                              ) : (<div className="h-6 text-xs "> </div>)}
                            </FormControl>

                            <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-2">
                              Warehouse
                            </label>

                            <FormControl fullWidth variant="outlined">
                              <Autocomplete
                                id="warehouse"
                                options={warehouseOptions.filter(option => option.CategoryOfWarehouse === 'Branch')}
                                getOptionLabel={(option) => option.Description}
                                value={warehouseOptions.find(option => option.CityRef === selectedWarehouseOptions?.CityRef) || null}
                                onChange={handleChangeWarehouse}
                                disabled={!warehouseSelected}
                                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    size="small"
                                    error={!!errors.warehouse}
                                  />
                                )}
                              />
                              {errors.warehouse ? (
                                <div className="h-6 text-xs text-red-500">Error: {errors.warehouse}</div>
                              ) : (<div className="h-6 text-xs "> </div>)}
                            </FormControl>
                          </div>
                        )}

                        {selectedShipping === 'Postomat' && (
                          <div className="mt-5">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>

                            <FormControl fullWidth variant="outlined">
                              <Autocomplete
                                id="city"
                                options={cityOptions.filter(option => option.SettlementTypeDescription === 'місто')}
                                getOptionLabel={(option) => option.Description}
                                onChange={handleChangeCity}
                                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    size="small"
                                    error={!!errors.city}
                                  />
                                )}
                              />
                              {errors.city ? (
                                <div className="h-6 text-xs text-red-500">Error: {errors.city}</div>
                              ) : (<div className="h-6 text-xs "> </div>)}
                            </FormControl>

                            <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-2">
                              Postomat
                            </label>

                            <FormControl fullWidth variant="outlined">
                              <Autocomplete
                                id="warehouse"
                                options={warehouseOptions.filter(option => option.CategoryOfWarehouse === 'Postomat')}
                                getOptionLabel={(option) => option.Description}
                                value={warehouseOptions.find(option => option.CityRef === selectedWarehouseOptions?.CityRef) || null}
                                onChange={handleChangeWarehouse}
                                disabled={!warehouseSelected}
                                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    size="small"
                                    error={!!errors.warehouse}
                                  />
                                )}
                              />
                              {errors.warehouse ? (
                                <div className="h-6 text-xs text-red-500">Error: {errors.warehouse}</div>
                              ) : (<div className="h-6 text-xs "> </div>)}
                            </FormControl>
                          </div>
                        )}

                        {selectedShipping === 'Store' && (
                          <div className="mt-5">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>

                            <FormControl fullWidth variant="outlined">
                              <Autocomplete
                                id="city"
                                options={storeCities}
                                onChange={handleChangeStoreCity}
                                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    size="small"
                                    error={!!errors.city}
                                  />
                                )}
                              />
                              {errors.city ? (
                                <div className="h-6 text-xs text-red-500">Error: {errors.city}</div>
                              ) : (<div className="h-6 text-xs "> </div>)}
                            </FormControl>

                            <label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-2">
                              Store
                            </label>

                            <FormControl fullWidth variant="outlined">
                              <Autocomplete
                                id="store"
                                options={filteredStores}
                                getOptionLabel={(option) => option.name}
                                value={selectedStoreCity ? selectedStore : null}
                                onChange={handleChangeStore}
                                disabled={!warehouseSelected}
                                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    size="small"
                                    error={!!errors.warehouse}
                                  />
                                )}
                              />
                              {errors.warehouse ? (
                                <div className="h-6 text-xs text-red-500">Error: {errors.warehouse}</div>
                              ) : (<div className="h-6 text-xs "> </div>)}
                            </FormControl>
                          </div>
                        )}
                      </ThemeProvider>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-md shadow-md mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold mb-4">Payment Information</h3>
                  </div>
                  <div className="border-t pt-4">
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