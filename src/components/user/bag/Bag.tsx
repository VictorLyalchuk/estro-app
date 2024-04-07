import { useDispatch, useSelector } from "react-redux";
import { IAuthReducerState } from "../../../store/accounts/AuthReducer";
import { useEffect, useState } from "react";
import { BagItems, IBagUser } from "../../../interfaces/Info/IBagUser";
import axios from "axios";
import moment from "moment";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { BagReducerActionType, IBagReducerState } from "../../../store/bag/BagReducer";
import { CardReducerActionType, ICardReducerState } from "../../../store/bag/CardReducer";
import { Form, Input, message } from "antd";
import { IOrderCreate } from "../../../interfaces/Info/IOrderCreate";
import { APP_ENV } from "../../../env/config";

const Bag = () => {
  const baseUrl = APP_ENV.BASE_URL;
  const { user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
  const [bagUser, setBagUser] = useState<IBagUser>();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { count } = useSelector((redux: any) => redux.bagReducer as IBagReducerState);
  const { total } = useSelector((redux: any) => redux.cardReducer as ICardReducerState);
  const { taxes } = useSelector((redux: any) => redux.cardReducer as ICardReducerState);
  const { totalWithOutTax } = useSelector((redux: any) => redux.cardReducer as ICardReducerState);
  const { initialIndividualItemPrice } = useSelector((redux: any) => redux.cardReducer as ICardReducerState);
  const bagItems = useSelector((state: { cardReducer: ICardReducerState }) => state.cardReducer.items) || [];

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

  const onSubmit = async (values: any) => {

    const model: IOrderCreate = {
      email: values.email,
      emailUser: user?.Email || "",
      firstName: values.firstName,
      lastName: values.lastName,
      phonenumber: values.phonenumber,
      address: values.address,
    };
    console.log(model);
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
  const onSubmitFailed = (errorInfo: any) => {
    console.log("Error Form data", errorInfo);
  }


  return (
    <div className="bg-gray-100">
      <div className="container mx-auto p-8 flex  relative bg-gray-100 mx-auto max-w-7xl px-2 sm:px-2 lg:px-2   flex-col lg:flex-row justify-between">
        <div className="w-full lg:w-2/4 p-5 mb-8 lg:mb-0">
          <div className="mb-4 ">
            {bagItems && bagItems.length > 0 ? (
              bagItems.map((item, index) => (
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
                      src={`${baseUrl}/uploads/320_${item?.image || '/uploads/default.jpg'}`}
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
                          <MinusIcon className="h-5 w-3"  />
                        </button>
                        <span className="mx-2 w-3">{item.quantity}</span>
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md ml-2 hover:bg-gray-300" onClick={() => increase(item)} >
                          <PlusIcon className="h-5 w-3 " />

                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <p></p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-2/4 p-5 lg:mb-0">
          {bagItems && bagItems.length > 0 ? (
            <Form
              form={form}
              encType="multipart/form-data"
              initialValues={{ remember: true }}
              onFinish={onSubmit}
              onFinishFailed={onSubmitFailed}
            >
              <div className="bg-white p-5 rounded-md shadow-md ">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
                  <h3 className="text-2xl font-semibold mb-4">{bagUser?.orderDate}</h3>
                </div>
                <div className="border-t pt-4">


                  <div className="mb-5 border-b pb-4">

                    <div className="sm:col-span-2">
                      <label htmlFor="firstName" className="text-gray-600 mb-4 font-semibold">
                        First Name
                      </label>
                      <Form.Item
                        name="firstName"
                        htmlFor="firstName"
                        noStyle>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          autoComplete="firstName"
                          placeholder="Enter your First Name"
                          className="text-gray-600 mb-4 font-semibold "
                          required
                        />
                      </Form.Item >
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="lastName" className="text-gray-600 mb-4 font-semibold">
                        Last Name
                      </label>
                      <Form.Item
                        name="lastName"
                        htmlFor="lastName"
                        noStyle>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          autoComplete="lastName"
                          placeholder="Enter your Last Name"
                          className="text-gray-600 mb-4 font-semibold "
                          required
                        />
                      </Form.Item >
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="phonenumber" className="text-gray-600 mb-4 font-semibold">
                        Phone number
                      </label>
                      <Form.Item
                        name="phonenumber"
                        htmlFor="phonenumber"
                        noStyle>
                        <Input
                          id="phonenumber"
                          name="phonenumber"
                          type="tel"
                          pattern="[0-9]*"
                          autoComplete="phonenumber"
                          placeholder="Enter your Phone number"
                          className="text-gray-600 mb-4 font-semibold "
                          required
                        />
                      </Form.Item >
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="text-gray-600 mb-4 font-semibold">
                        Email
                      </label>
                      <Form.Item
                        name="email"
                        htmlFor="email"
                        noStyle>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your Email"
                          className="text-gray-600 mb-4 font-semibold "
                          required
                        />
                      </Form.Item >
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="text-gray-600 mb-4 font-semibold">
                        Delivery Address
                      </label>
                      <Form.Item
                        name="address"
                        htmlFor="address"
                        noStyle>
                        <Input
                          id="address"
                          name="address"
                          type="text"
                          placeholder="Enter Delivery Address"
                          className="text-gray-600 mb-4 font-semibold "
                          required
                        />
                      </Form.Item >
                    </div>
                    {/* <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-md custom-button-style">
                Proceed to Checkout
              </button> */}
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
              {/* Checkout Button */}
              <div className="mt-8 flex justify-end">
                <button type="submit"
                  // onClick={onSubmit} 
                  className="bg-blue-500 text-white px-6 py-3 rounded-md custom-button-style">
                  Proceed to Checkout
                </button>
              </div>
            </Form>
          ) : (
            <div className="container mx-auto p-8 flex justify-center relative bg-gray-100 mx-auto max-w-7xl px-2 sm:px-2 lg:px-2   flex-col lg:flex-row  ">
              <div className="w-full lg:w-2/4 p-5 mb-8 lg:mb-0">
                <div className="mt-8 flex justify-center">
                  <p>No items in the bag.</p>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Bag;