import { BanknotesIcon, CreditCardIcon } from "@heroicons/react/24/outline";

export  const paymentList = [
    { id: 'PaymentAfter', title: 'Payment upon receipt', logo: <BanknotesIcon className="size-10 hover:text-indigo-700" style={{ transition: "color 0.3s" }} />, subtitle: 'Delivery payment at the carriers rates, including cash on delivery services. The service is available for goods worth 1,000 hryvnias or more. WARNING! All ordered goods are sent by separate parcels.' },
    { id: 'PaymentBefore', title: 'Payment on the website', logo: <CreditCardIcon className="size-10 hover:text-indigo-700" style={{ transition: "color 0.3s" }} />, subtitle: 'If the cost of a product unit is over 1,000 hryvnias - delivery is free. WARNING! All goods are sent by separate parcels' },
  ];