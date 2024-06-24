import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChangeEvent, FormEvent, useEffect, Fragment, useState } from "react";
import "./index.css";

interface VisaCreditCardProps {
    submitBtnColor?: string;
    submitBtnTxt?: string;
    onSubmit?: (event: FormEvent, creditCardData: CreditCardData) => void;
    isOpen: boolean;
    setOpen: (value: boolean) => void;
}

interface CreditCardData {
    creditCardNumber: string;
    creditCardHolderName: string;
    creditCardExpMonth: string;
    creditCardExpYear: string;
    creditCardCvv: string;
}

const VisaCreditCard: React.FC<VisaCreditCardProps> = ({
    submitBtnColor = "",
    submitBtnTxt = "Pay now",
    onSubmit,
    isOpen,
    setOpen,
}) => {
    const [creditCardNumber, setCreditCardNumber] = useState("");
    const [creditCardHolderName, setCreditCardHolderName] = useState("");
    const [creditCardExpMonth, setCreditCardExpMonth] = useState("");
    const [creditCardExpYear, setCreditCardExpYear] = useState("");
    const [creditCardCvv, setCreditCardCvv] = useState("");
    const [shouldFlipCreditCardOnCvv, setShouldFlipCreditCardOnCvv] = useState(false);
    const [creditCardYearRangeArr, setCreditCardYearRangeArr] = useState<number[]>([]);

    const getExpYearRange = () => {
        const currentYear = new Date().getUTCFullYear();
        const yearRangeArr = Array.from({ length: 11 }, (_, i) => currentYear + i);

        setCreditCardYearRangeArr(yearRangeArr);
    };

    const handleSubmit = (eventOfSubmission: FormEvent) => {
        eventOfSubmission.preventDefault();

        const creditCardData: CreditCardData = {
            creditCardNumber,
            creditCardHolderName,
            creditCardExpMonth,
            creditCardExpYear,
            creditCardCvv,
        };

        if (onSubmit) {
            onSubmit(eventOfSubmission, creditCardData);
        }
    };

    const cardNumberOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCreditCardNumber(event.target.value);
    };

    const cardHolderNameOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCreditCardHolderName(event.target.value);
    };

    const monthOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setCreditCardExpMonth(event.target.value);
    };

    const yearOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setCreditCardExpYear(event.target.value);
    };

    const cvvOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCreditCardCvv(event.target.value);
        setShouldFlipCreditCardOnCvv(true);
    };

    const cvvOnBlur = () => {
        setShouldFlipCreditCardOnCvv(false);
    };

    useEffect(() => {
        getExpYearRange();
    }, []);

    const handleClose = () => {
        setOpen(true);
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 hidden bg-gray-300 bg-opacity-80 transition-opacity md:block" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                            enterTo="opacity-100 translate-y-0 md:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 md:scale-100"
                            leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                        >
                            <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                                <div className="relative flex w-full items-center overflow-hidden bg-gray-100 px-4 pb-8 pt-14  sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                                    <button
                                        type="button"
                                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                                        onClick={() => setOpen(false)}
                                        tabIndex={0}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>


                                    <div className="checkout react-fancy-visa-card">
                                        <div className={`credit-card-box ${shouldFlipCreditCardOnCvv ? 'hover' : ''}`}>
                                            <div className="flip">
                                                <div className="front bg-gradient-to-br from-blue-500 to-blue-700 relative rounded-lg p-8 text-white">
                                                    <div className="chip absolute w-16 h-12 top-2 left-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-lg"></div>
                                                    <div className="logo"></div>
                                                    <div className="number text-xl">{creditCardNumber.replace(/(\d{4})/g, '$1 ').trim()}</div>
                                                    <div className="card-holder">
                                                        <label className="text-xs opacity-50">Card holder</label>
                                                        <div>{creditCardHolderName}</div>
                                                    </div>
                                                    <div className="card-expiration-date">
                                                        <label className="text-xs opacity-50">Expires</label>
                                                        <div>{creditCardExpMonth}/{creditCardExpYear.slice(-2)}</div>
                                                    </div>
                                                </div>
                                                <div className="back bg-gradient-to-br from-blue-500 to-blue-700 relative rounded-lg p-8 text-white transform rotate-y-180">
                                                    <div className="strip h-1/5 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600"></div>
                                                    <div className="logo"></div>
                                                    <div className="ccv">
                                                        <label className="text-xs opacity-50">CCV</label>
                                                        <div>{creditCardCvv}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <form className="form" autoComplete="off" noValidate onSubmit={handleSubmit}>
                                            <fieldset>
                                                <label htmlFor="card-number">Card Number</label>
                                                <input onChange={cardNumberOnChange} id="card-number" className="input-cart-number" maxLength={16} />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="card-holder">Card holder</label>
                                                <input onChange={cardHolderNameOnChange} type="text" id="card-holder" />
                                            </fieldset>
                                            <fieldset className="fieldset-expiration">
                                                <label className="expiration" htmlFor="card-expiration-month">
                                                    Expiration Month / Year
                                                </label>
                                                <div className="select">
                                                    <select onChange={monthOnChange} id="card-expiration-month">
                                                        <option></option>
                                                        {Array.from({ length: 12 }, (_, i) => (
                                                            <option key={i} value={String(i + 1).padStart(2, "0")}>
                                                                {String(i + 1).padStart(2, "0")}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="select">
                                                    <select onChange={yearOnChange} id="card-expiration-year">
                                                        <option key={0}></option>
                                                        {creditCardYearRangeArr.map((year, index) => (
                                                            <option key={index} value={year}>
                                                                {year}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </fieldset>
                                            <fieldset className="fieldset-ccv">
                                                <label htmlFor="card-ccv">CCV</label>
                                                <input onChange={cvvOnChange} onBlur={cvvOnBlur} id="card-ccv" maxLength={3} />
                                            </fieldset>
                                            <button className="btn" style={{ background: submitBtnColor }}>
                                                <i className="fa fa-lock"></i>
                                                {submitBtnTxt !== "" ? submitBtnTxt : "Pay now"}
                                            </button>
                                        </form>
                                    </div>

                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default VisaCreditCard;
