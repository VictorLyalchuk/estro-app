import { RadioGroup } from '@headlessui/react';
import { ThemeProvider } from "@material-ui/core/styles";
import { paymentList } from '../../../../../data/paymentList';
import { useSelector } from 'react-redux';
import { ICardReducerState } from '../../../../../store/bag/CardReducer';
import { ArrowDownIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';

interface PaymentInformationProps {
  theme: any;
  errors: { paymentMethod?: string };
  formData: { payment: string, paymentMethod: string; };
  activeBlock: string[] | null;
  handleBlockClick: (block: string) => void;
  selectedPayment: string | '';
  setSelectedPayment: (value: string) => void;
}

const PaymentInformation: React.FC<PaymentInformationProps> = ({
  theme,
  errors,
  formData,  
  activeBlock,
  handleBlockClick,
  selectedPayment,
  setSelectedPayment,
}) => {
  const { total, taxes, totalWithOutTax } = useSelector((redux: any) => redux.card as ICardReducerState);

  return (
    <div className={`bg-white p-5 rounded-md shadow-md mb-4`}>
      <div className="flex justify-between items-center mb-4" onClick={() => handleBlockClick('payment')}>
        <h3 className="text-2xl font-semibold cursor-pointer" >Payment Information</h3>
        {activeBlock?.includes('payment') ? (
          <div className='group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-2.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-100 hover:border-gray-300 focus-within:outline-gray-300'>
            <ArrowDownIcon className="h-5 w-5 cursor-pointer stroke-gray-900 transition-all duration-500 group-hover:stroke-black" />
          </div>
        ) : (
          <div className='group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-2.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-100 hover:border-gray-300 focus-within:outline-gray-300'>
            <ArrowLongRightIcon className="h-5 w-5 cursor-pointer stroke-gray-900 transition-all duration-500 group-hover:stroke-black" />
          </div>
        )}
      </div>
      <div className="border-t pt-4">
        {activeBlock?.includes('payment') && (
          <div className="mb-5 border-b pb-4">
            <div className="pb-4">
              <ThemeProvider theme={theme}>
                {formData.payment === 'The money has not been paid' && (
                  <>
                    <div>
                      <RadioGroup value={selectedPayment} onChange={setSelectedPayment}>
                        <RadioGroup.Label className="sr-only">Payment Information</RadioGroup.Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {paymentList.map((payment) => (
                            <RadioGroup.Option
                              key={payment.id}
                              value={payment.id}
                              className={({ active, checked }) =>
                                `max-w-sm rounded overflow-hidden shadow-lg cursor-pointer hover:border-indigo-600 ${active ? 'ring-2 ring-indigo-600 border-2 border-indigo-600 ' : ''
                                } ${checked ? 'ring-2 ring-indigo-600 border-2 border-indigo-600' : 'border-2 border-gray-200'} ${errors.paymentMethod ? ' border-red-600' : ''}`}>
                              <div className="px-4 py-1 flex-1 ">
                                <div className="flex justify-center item-center">
                                  <RadioGroup.Label as="div">
                                    {payment.logo}
                                  </RadioGroup.Label>
                                </div>
                              </div>
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                )}
              </ThemeProvider>
            </div>
            <dl className="pt-2 mt-8 divide-y divide-gray-200 text-sm ">
              <div className="flex items-center justify-between pb-4">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium text-gray-900">{totalWithOutTax.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} €</dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">Tax</dt>
                <dd className="font-medium text-gray-900">{taxes.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} €</dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">Discount</dt>
                <dd className="font-medium text-red-600">0 €</dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">Payment</dt>
                <dd className={`font-medium ${formData.payment === 'The money has not been paid' ? 'text-red-500' : 'text-green-500'}`}>{formData.payment}</dd>
              </div>
              <div className="flex items-center justify-between pt-4">
                <dt className="font-medium text-gray-900">Order total</dt>
                <dd className="font-medium text-indigo-600">{total.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} €</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentInformation;