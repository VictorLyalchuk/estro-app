import { useDispatch, useSelector } from "react-redux";
import { IAuthReducerState } from "../../../../store/accounts/AuthReducer";
import { useEffect, useState } from "react";
import { BagItems, IBagUser } from "../../../../interfaces/Info/IBagUser";
import axios from "axios";
import moment from "moment";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { BagReducerActionType, IBagReducerState } from "../../../../store/bag/BagReducer";
import { CardReducerActionType, ICardReducerState } from "../../../../store/bag/CardReducer";
import { message } from "antd";
import { IOrderCreate } from "../../../../interfaces/Info/IOrderCreate";
import { APP_ENV } from "../../../../env/config";
import GoodsNotFound from "../../../../assets/goods-not-found.png";
import { Button, FormControl, TextField } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import MaskedInput from 'react-text-mask';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(0),
    },
    input: {
    },
    button: {
      textTransform: 'none',
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      '& .MuiInputBase-root': {
        height: '60px',
      },
    },
  }),
);

interface TextMaskCustomProps {
  inputRef: (ref: HTMLInputElement | null) => void;
}

function TextMaskCustom(props: TextMaskCustomProps) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref: any) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
    />
  );
}

interface State {
  textmask: string;
}
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
  const [values, setValues] = useState<State>({
    textmask: '(   )    -  -  ',
  });

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
  }, [user, count]);

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
      address: formData.address,
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
  } else {
    console.log(formData);
}
  }

  const [formData, setFormData] = useState({
    firstName: user?.FirstName || '',
    lastName: user?.LastName || '',
    email: user?.Email || '',
    phoneNumber: user?.PhoneNumber || '',
    address: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

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
      address: string;
    } = {
      firstName: "",
      lastName: "",
      confirmPassword: "",
      phoneNumber: "",
      email: "",
      password: "",
      address: ""
    };

    if (formData.firstName.trim() === '') {
      newErrors.firstName = 'First Name is required';
      isValid = false;
    }

    if (formData.lastName.trim() === '') {
      newErrors.lastName = 'Last Name is required';
      isValid = false;
    }
    const cleanedPhoneNumber = values.textmask.replace(/\D/g, '');
    if (cleanedPhoneNumber.trim() === '') {
      newErrors.phoneNumber = 'Phone Number is required';
      isValid = false;
    }
    else if (!/^(067|095|099|066|063|098|097|096)\d{7}$/.test(cleanedPhoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
      isValid = false;
    }

    if (formData.email.trim() === '' || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChangePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    validatePhoneNumber(cleanedValue);
  };

  const validatePhoneNumber = (value: string) => {
    const isValidPrefix = /^(067|095|099|066|063|098|097|096)/.test(value.substr(0, 3));

    const isValidDigits = /^\d{7}$/.test(value.substr(3));

    const isValid = isValidPrefix && isValidDigits;

    setErrors((prevErrors) => ({
      ...prevErrors,
      phoneNumber: isValid ? '' : 'Invalid phone number format',
    }));
  };

  useEffect(() => {
    GetCity();
  }, []);

  const GetCity = async () => {
    const apiUrl = 'https://api.novaposhta.ua/v2.0/json/';
    const payload = {
      apiKey: 'f8df4fb4933f7b40c96b872a1901be8e',
      modelName: 'Address',
      calledMethod: 'getCities',
      methodProperties: {
        "FindByString": "Рівне"
      }
    };

    try {
      const response = await axios.post(apiUrl, payload);

      console.log(response.data);
    } catch (error) {
      console.error('Error fetching departments', error);
    }
  }

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
                          name="textmask"
                          value={values.textmask}
                          onChange={handleChangePhoneNumber}
                          id="formatted-text-mask-input"
                          error={!!errors.phoneNumber}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            inputComponent: TextMaskCustom as any,
                          }}
                        />
                        {errors.phoneNumber ? (
                          <div className="h-6 text-xs text-red-500">Error: {errors.phoneNumber}</div>
                        ) : (<div className="h-6 text-xs "> </div>)}
                      </FormControl>

                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-md shadow-md mb-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold mb-4">Delivery Information</h3>
                  </div>
                  <div className="border-t pt-4">
                    <div className="">
                      <label htmlFor="address" className="text-gray-600 font-semibold">
                        Delivery Address
                      </label>
                      <FormControl fullWidth className={classes.margin} variant="outlined">
                        <TextField
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          variant="outlined"
                          size="small"
                        />
                        {errors.address ? (
                          <div className="h-6 text-xs text-red-500">Error: {errors.address}</div>
                        ) : (<div className="h-6 text-xs "> </div>)}
                      </FormControl>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-md shadow-md mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold mb-4">Payment Information</h3>
                  </div>
                  <div className="border-t pt-4">
                    <div className="mb-5 border-b pb-4">

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
                    <Button className={classes.button} type="submit" variant="contained" size="large" color="primary" disableElevation>
                      Proceed to Checkout
                    </Button>
                  </FormControl>

                  {/* <button type="submit"

                    className="bg-blue-500 text-white px-6 py-3 rounded-md custom-button-style">
                    Proceed to Checkout
                  </button> */}
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