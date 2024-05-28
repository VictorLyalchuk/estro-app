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
const money = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 hover:text-indigo-700" style={{ transition: "color 0.3s" }}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
</svg>);

const card = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 hover:text-indigo-700" style={{ transition: "color 0.3s" }}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
</svg>);

const branch = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
</svg>);

const postomat = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
</svg>);

const store = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
</svg>);

const deliveryList = [
  { id: 'Branch', title: 'Sending to the Branch', logo: branch, subtitle: 'Money Transfer Fees' },
  { id: 'Postomat', title: 'Sending to the Postomat', logo: postomat, subtitle: 'Full payment required' },
  { id: 'Store', title: 'Sending to the Store', logo: store, subtitle: 'Free shipping' },
];

const paymentList = [
  { id: 'PaymentAfter', title: 'Payment upon receipt', logo: money, subtitle: 'Delivery payment at the carriers rates, including cash on delivery services. The service is available for goods worth 1,000 hryvnias or more. WARNING! All ordered goods are sent by separate parcels.' },
  { id: 'PaymentBefore', title: 'Payment on the website', logo: card, subtitle: 'If the cost of a product unit is over 1,000 hryvnias - delivery is free. WARNING! All goods are sent by separate parcels' },
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
    setSelectedPayment('PaymentAfter');
  }, [user, count]);

  useEffect(() => {
    GetWarehouse();
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
    // const quant = item.quantity;
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

        refreashCount();

        // dispatch({
        //   type: BagReducerActionType.DELETE_PRODUCT_BAG_COUNT,
        //   payload: {
        //     delete: quant
        //   }
        // });
      } catch (error) {
        console.error("Error deleting bag items:", error);
      }

    }
  }

  const increase = async (item: BagItems) => {
    if (item.quantity < 10) {
      await axios.post(`${baseUrl}/api/Bag/SetIncrease/${item.id}`);
      refreashCount();
      // dispatch({
      //   type: BagReducerActionType.PRODUCT_BAG_COUNT,
      //   payload: {
      //     pluscount: 1
      //   }
      // });
    }
  }
  const decrease = async (item: BagItems) => {
    if (item.quantity > 1) {
      await axios.post(`${baseUrl}/api/Bag/SetDecrease/${item.id}`)
      refreashCount();
      // dispatch({
      //   type: BagReducerActionType.DECREASE_PRODUCT_BAG_COUNT,
      //   payload: {
      //     minuscount: 1
      //   }
      // });
    }
  }
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    const model: IOrderCreate = {
      email: formData.email,
      emailUser: user?.Email || "",
      firstName: formData.firstName,
      lastName: formData.lastName,
      phonenumber: formData.phoneNumber,
      payment: formData.payment,
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
                  <div className="border-t pt-4 flex">
                    <img
                      src={`${baseUrl}/uploads/1200_${item?.image || '/uploads/default.jpg'}`}
                      alt={item?.image}
                      className="w-24 h-36 object-cover rounded-md mr-4"
                    />
                    <div className="w-1/2 ml-4 mx-auto">
                      <h3 className="text-lg font-semibold mb-2 mr-auto " style={{ whiteSpace: 'nowrap' }}>Total product price: {initialIndividualItemPrice[item.id].toLocaleString('uk-UA', { minimumFractionDigits: 2 })} ₴</h3>
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
                            id="firstName"
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
                        <label htmlFor="lastName" className="text-gray-600 font-semibold">
                          Last Name
                        </label>
                        <FormControl fullWidth className={classes.margin} variant="outlined">
                          <TextField
                            name="lastName"
                            id="lastName"
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
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            variant="outlined"
                            size="small"
                            autoComplete="email"

                          />
                          {errors.email ? (
                            <div className="h-6 text-xs text-red-500">Error: {errors.email}</div>
                          ) : (<div className="h-6 text-xs "> </div>)}
                        </FormControl>

                        <label htmlFor="formatted-text-mask-input" className="text-gray-600 font-semibold">
                          Phone Number
                        </label>
                        <FormControl fullWidth className={classes.margin} variant="outlined">
                          <TextField
                            name="formatted-text-mask-input"
                            id="formatted-text-mask-input"
                            value={formData.phoneNumber}
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
                                          {delivery.logo}{delivery.title}
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
                            <label htmlFor="city" className="text-gray-600 font-semibold">
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

                            <label htmlFor="warehouse" className="text-gray-600 font-semibold">
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
                            <label htmlFor="city" className="text-gray-600 font-semibold">
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

                            <label htmlFor="warehouse" className="text-gray-600 font-semibold">
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
                            <label htmlFor="city" className="text-gray-600 font-semibold">
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

                            <label htmlFor="store" className="text-gray-600 font-semibold">
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

                          {formData.payment === 'The money has not been paid' && (
                            <>
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
                                                {payment.logo} {payment.title}
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
                      <div className="text-base	flex justify-between items-center ">
                        <p className="text-base	font-semibold">Subtotal:</p>
                        <p className="text-base">{totalWithOutTax.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} ₴</p>
                      </div>
                      <div className="text-base	flex justify-between items-center">
                        <p className="text-base	font-semibold">Taxes:</p>
                        <p className="text-base">{taxes.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} ₴</p>
                      </div>
                      <div className="text-base	flex justify-between items-center">
                        <p className="text-base	font-semibold">Discount:</p>
                        <p className="text-base">0 ₴</p>
                      </div>
                      <div className="text-base	flex justify-between items-center">
                        <p className="text-base	font-semibold">Payment:</p>
                        <p className={`text-base ${formData.payment === 'The money has not been paid' ? 'text-red-500' : 'text-green-500'}`}>{formData.payment}</p>
                      </div>
                      <div className="text-2xl flex justify-between items-center mt-4 border-t pt-4">
                        <p className="text-2xl font-semibold">Total:</p>
                        <p className="text-2xl">{total.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} ₴</p>
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