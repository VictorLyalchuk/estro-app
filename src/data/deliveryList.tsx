import { BanknotesIcon, BuildingStorefrontIcon, CreditCardIcon, EnvelopeIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

export const deliveryList = [
    { id: 'Branch', title: 'Sending to the Branch', logo: <Squares2X2Icon className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }} />, subtitle: 'Money Transfer Fees' },
    { id: 'Postomat', title: 'Sending to the Postomat', logo: <EnvelopeIcon className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }} />, subtitle: 'Full payment required' },
    { id: 'Store', title: 'Sending to the Store', logo: <BuildingStorefrontIcon className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }} />, subtitle: 'Free shipping' },
  ];
  
  export  const paymentList = [
    { id: 'PaymentAfter', title: 'Payment upon receipt', logo: <BanknotesIcon className="size-10 hover:text-indigo-700" style={{ transition: "color 0.3s" }} />, subtitle: 'Delivery payment at the carriers rates, including cash on delivery services. The service is available for goods worth 1,000 hryvnias or more. WARNING! All ordered goods are sent by separate parcels.' },
    { id: 'PaymentBefore', title: 'Payment on the website', logo: <CreditCardIcon className="size-10 hover:text-indigo-700" style={{ transition: "color 0.3s" }} />, subtitle: 'If the cost of a product unit is over 1,000 hryvnias - delivery is free. WARNING! All goods are sent by separate parcels' },
  ];