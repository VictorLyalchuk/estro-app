import { useDispatch, useSelector } from "react-redux";
import { IAuthReducerState } from "../../../../store/accounts/AuthReducer";
import { useEffect, useState } from "react";
import { BagItems, IBagUser } from "../../../../interfaces/Bag/IBagUser";
import axios from "axios";
import moment from "moment";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { BagReducerActionType, IBagReducerState } from "../../../../store/bag/BagReducer";
import { CardReducerActionType, ICardReducerState } from "../../../../store/bag/CardReducer";
import { message } from "antd";
import { IOrderCreate } from "../../../../interfaces/Bag/IOrderCreate";
import { APP_ENV } from "../../../../env/config";
import GoodsNotFound from "../../../../assets/goods-not-found.png";
import { FormControl, TextField, TextFieldProps } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import '../../../../satoshi.css';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { JSX } from "react/jsx-runtime";
import { ICity } from "../../../../interfaces/Bag/ICity";
import { IWarehouse } from "../../../../interfaces/Bag/IWarehouse";
import { RadioGroup } from '@headlessui/react';
import { IStore } from "../../../../interfaces/Site/IStore";

const theme = createTheme({
  typography: {
    fontFamily: 'Satoshi, sans-serif',
  },
  overrides: {
    MuiTextField: {
      root: {
        fontFamily: 'Satoshi, sans-serif',
      },
    },
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(0),
    },
    button: {
      textTransform: 'none',
    },
    satoshiFont: {
      fontFamily: 'Satoshi, sans-serif',
    },
  }),
);

const deliveryList = [
  { id: 'Branch', title: 'Sending to the Branch', subtitle: 'Money Transfer Fees' },
  { id: 'Postomat', title: 'Sending to the Postomat', subtitle: 'Full payment required' },
  { id: 'Store', title: 'Sending to the Store', subtitle: 'Free shipping' },
];

const paymentList = [
  { id: 'PaymentAfter', title: 'Payment upon receipt', subtitle: 'Delivery payment at the carriers rates, including cash on delivery services. The service is available for goods worth 1,000 hryvnias or more. WARNING! All ordered goods are sent by separate parcels.' },
  { id: 'PaymentBefore', title: 'Payment on the website', subtitle: 'If the cost of a product unit is over 1,000 hryvnias - delivery is free. WARNING! All goods are sent by separate parcels' },
];
const Bag = () => {
  const baseUrl = APP_ENV.BASE_URL;
  const { user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
  const [bagUser, setBagUser] = useState<IBagUser>();
  const dispatch = useDispatch();
  const { count } = useSelector((redux: any) => redux.bagReducer as IBagReducerState);
  const { total } = useSelector((redux: any) => redux.cardReducer as ICardReducerState);
  const { taxes } = useSelector((redux: any) => redux.cardReducer as ICardReducerState);
  const { totalWithOutTax } = useSelector((redux: any) => redux.cardReducer as ICardReducerState);
  const { initialIndividualItemPrice } = useSelector((redux: any) => redux.cardReducer as ICardReducerState);
  const bagItems = useSelector((state: { cardReducer: ICardReducerState }) => state.cardReducer.items) || [];
  const classes = useStyles();

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
    GetCity();
    GetStore();
    setSelectedShipping('Branch');
  }, [user, count]);

  useEffect(() => {
    GetWarehouse();
  }, [city]);

  useEffect(() => {
    clearFields();
  }, [selectedShipping]);

  const deleteItems = async (item: BagItems) => {
    const quant = item.quantity;
    const itemId = item.id
    await axios.delete(`${baseUrl}/api/Bag/DeleteBagItem/${item.id}`)
    dispatch({
      type: BagReducerActionType.DELETE_PRODUCT_BAG_COUNT,
      payload: {
        delete: quant
      }
    });
    dispatch({
      type: CardReducerActionType.DELETE,
      payload: {
        itemId: itemId
      }
    });
  }
  const increase = async (item: BagItems) => {
    const itemId = item.id
    if (item.quantity < 10) {
      await axios.post(`${baseUrl}/api/Bag/SetIncrease/${item.id}`);
      dispatch({
        type: BagReducerActionType.PRODUCT_BAG_COUNT,
        payload: {
          pluscount: 1
        }
      });
      dispatch({
        type: CardReducerActionType.ADD_QUANTITY,
        payload: {
          itemId: itemId
        }
      });
    }
  }
  const decrease = async (item: BagItems) => {
    const itemId = item.id
    if (item.quantity > 1) {
      await axios.post(`${baseUrl}/api/Bag/SetDecrease/${item.id}`)
      dispatch({
        type: BagReducerActionType.DECREASE_PRODUCT_BAG_COUNT,
        payload: {
          minuscount: 1
        }
      });
      dispatch({
        type: CardReducerActionType.SUBTRACT_QUANTITY,
        payload: {
          itemId: itemId
        }
      });
    }
  }
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    const model: IOrderCreate = {
      email: formData.email,
      emailUser: user?.Email || "",
      firstName: formData.firstName,
      lastName: formData.lastName,
      phonenumber: formData.phoneNumber,
      address: selectedWarehouseOptions ? selectedWarehouseOptions?.CityDescription + ', ' + selectedWarehouseOptions?.Description : selectedStore?.city + ' ' + selectedStore?.name + ' ' + selectedStore?.address,
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

  const GetWarehouse = async () => {
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

  const GetCity = async () => {
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

  const GetStore = async () => {
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

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto p-8 flex  relative bg-gray-100 mx-auto max-w-7xl px-2 sm:px-2 lg:px-2   flex-col lg:flex-row justify-between">
        {bagItems && bagItems.length > 0 ? (
          <>
            <div className="w-full lg:w-2/4 p-5 lg:mb-0">
              <div className="bg-white p-5 rounded-md shadow-md mb-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold">Order Summary</h3>
                  <h3 className="text-2xl font-semibold">{bagUser?.orderDate}</h3>
                </div>
              </div>
              {bagItems.map((item, index) => (
                <div key={item.id} className="border-b bg-white pt-4 p-6 rounded-md shadow-md mb-8">
                  <div className="flex justify-end">
                  </div>
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
                  <div className="border-t pt-4 flex ">
                    <img
                      src={`${baseUrl}/uploads/1200_${item?.image || '/uploads/default.jpg'}`}
                      alt={item?.image}
                      className="w-24 h-36 object-cover rounded-md mr-4"
                    />
                    <div className="w-1/2 ml-4">
                      <h3 className="text-lg font-semibold mb-2">Total product price: {initialIndividualItemPrice[item.id]} ₴</h3>
                      <p className="text-gray-600 mb-2">Size: {item.size}</p>
                      <p className="text-gray-600 mb-2">Article: {item.article}</p>
                      <p className="text-gray-600 mb-2">Price: {item.price} ₴</p>
                      <div className="flex items-center ml-auto mt-6">
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md mr-2 hover:bg-gray-300" onClick={() => decrease(item)}>
                          <MinusIcon className="h-5 w-3" />
                        </button>
                        <span className="mx-2 w-3">{item.quantity}</span>
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md ml-2 hover:bg-gray-300" onClick={() => increase(item)} >
                          <PlusIcon className="h-5 w-3 " />

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
                    <h3 className="text-2xl font-semibold mb-4">Personal Information</h3>
                  </div>

                  <div className="border-t pt-4">
                    <div className="">

                      <label htmlFor="firstName" className="text-gray-600 font-semibold">
                        First Name
                      </label>
                      <ThemeProvider theme={theme}>
                        <FormControl fullWidth className={classes.margin} variant="outlined">
                          <TextField
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!errors.firstName}
                            variant="outlined"
                            size="small"
                          />
                          {errors.firstName ? (
                            <div className="h-6 text-xs text-red-500">Error: {errors.firstName}</div>
                          ) : (<div className="h-6 text-xs "> </div>)}
                        </FormControl>
                        <label htmlFor="LastName" className="text-gray-600 font-semibold">
                          Last Name
                        </label>
                        <FormControl fullWidth className={classes.margin} variant="outlined">
                          <TextField
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={!!errors.lastName}
                            variant="outlined"
                            size="small"
                          />
                          {errors.lastName ? (
                            <div className="h-6 text-xs text-red-500">Error: {errors.lastName}</div>
                          ) : (<div className="h-6 text-xs "> </div>)}
                        </FormControl>

                        <label htmlFor="email" className="text-gray-600 font-semibold">
                          Email
                        </label>
                        <FormControl fullWidth className={classes.margin} variant="outlined">
                          <TextField
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            variant="outlined"
                            size="small"
                          />
                          {errors.email ? (
                            <div className="h-6 text-xs text-red-500">Error: {errors.email}</div>
                          ) : (<div className="h-6 text-xs "> </div>)}
                        </FormControl>

                        <label htmlFor="phoneNumber" className="text-gray-600 font-semibold">
                          Phone Number
                        </label>
                        <FormControl fullWidth className={classes.margin} variant="outlined">
                          <TextField
                            name="PhoneNumber"
                            value={formData.phoneNumber}
                            id="formatted-text-mask-input"
                            variant="outlined"
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

                        <div className={classes.margin}>
                          <RadioGroup value={selectedShipping} onChange={setSelectedShipping} >
                            <RadioGroup.Label className="sr-only">Delivery Information</RadioGroup.Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {deliveryList.map((delivery) => (
                                <RadioGroup.Option
                                  key={delivery.id}
                                  value={delivery.id}
                                  className={({ active, checked }) =>
                                    `max-w-sm rounded overflow-hidden shadow-lg cursor-pointer ${active ? 'border-2 border-blue-700' : ''
                                    } ${checked ? 'border-2 border-blue-700' : 'border-2 border-gray-200'}`
                                  }
                                >
                                  {({ checked }) => (
                                    <div className="px-6 py-4">
                                      <div className="flex items-center justify-between">
                                        <RadioGroup.Label as="div" className="font-bold text-xl mb-2 mr-10">
                                          {delivery.title}
                                        </RadioGroup.Label>
                                        {checked && (
                                          <span className="text-blue-700 font-bold">&#10003;</span>
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
                            <label htmlFor="address" className="text-gray-600 font-semibold">
                              City
                            </label>

                            <FormControl fullWidth className={classes.margin} variant="outlined">
                              <Autocomplete
                                id="city"
                                options={cityOptions.filter(option => option.SettlementTypeDescription === 'місто')}
                                getOptionLabel={(option) => option.Description}
                                onChange={handleChangeCity}
                                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
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

                            <label htmlFor="address" className="text-gray-600 font-semibold">
                              Warehouse
                            </label>

                            <FormControl fullWidth className={classes.margin} variant="outlined">
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
                                    variant="outlined"
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
                            <label htmlFor="address" className="text-gray-600 font-semibold">
                              City
                            </label>

                            <FormControl fullWidth className={classes.margin} variant="outlined">
                              <Autocomplete
                                id="city"
                                options={cityOptions.filter(option => option.SettlementTypeDescription === 'місто')}
                                getOptionLabel={(option) => option.Description}
                                onChange={handleChangeCity}
                                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
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

                            <label htmlFor="address" className="text-gray-600 font-semibold">
                              Postomat
                            </label>

                            <FormControl fullWidth className={classes.margin} variant="outlined">
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
                                    variant="outlined"
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
                            <label htmlFor="address" className="text-gray-600 font-semibold">
                              City
                            </label>

                            <FormControl fullWidth className={classes.margin} variant="outlined">
                              <Autocomplete
                                id="city"
                                options={storeCities}
                                onChange={handleChangeStoreCity}
                                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
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

                            <label htmlFor="address" className="text-gray-600 font-semibold">
                              Store
                            </label>

                            <FormControl fullWidth className={classes.margin} variant="outlined">
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
                                    variant="outlined"
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

                          <div className={classes.margin}>
                            <RadioGroup value={selectedPayment} onChange={setSelectedPayment} >
                              <RadioGroup.Label className="sr-only">Delivery Information</RadioGroup.Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {paymentList.map((payment) => (
                                  <RadioGroup.Option
                                    key={payment.id}
                                    value={payment.id}
                                    className={({ active, checked }) =>
                                      `max-w-sm rounded overflow-hidden shadow-lg cursor-pointer ${active ? 'border-2 border-blue-700' : ''
                                      } ${checked ? 'border-2 border-blue-700' : 'border-2 border-gray-200'}`
                                    }
                                  >
                                    {({ checked }) => (
                                      <div className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                          <RadioGroup.Label as="div" className="font-bold text-xl mb-2 mr-10">
                                            {payment.title}
                                          </RadioGroup.Label>
                                          {checked && (
                                            <span className="text-blue-700 font-bold">&#10003;</span>
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
                                // onClick={addToBag}
                                className='mt-10 flex w-40 mx-auto items-center justify-center rounded-md border bg-indigo-600 hover:bg-indigo-700
                                px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                                Pay Now
                              </button>
                            </div>
                          )}
                        </ThemeProvider>
                      </div>
                      <div className="flex justify-between items-center ">
                        <p className="text-lg font-semibold">Without Taxes:</p>
                        <p className="text-lg">{totalWithOutTax} ₴</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold">Taxes:</p>
                        <p className="text-lg">{taxes} ₴</p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-xl font-semibold">Total Sum:</p>
                        <p className="text-xl">{total} ₴</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Checkout Button */}

                <div className="mt-8 flex justify-end">
                  <FormControl fullWidth className={classes.margin} variant="outlined">
                    {/* <Button className={classes.button} type="submit" variant="contained" size="large" color="primary" disableElevation>
                    Confirm The Order
                    </Button> */}
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