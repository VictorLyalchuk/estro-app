import { BuildingStorefrontIcon, EnvelopeIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

export const deliveryList = [
    { id: 'Branch', title: 'Sending to the Branch', logo: <Squares2X2Icon className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }} />, subtitle: 'Money Transfer Fees' },
    { id: 'Postomat', title: 'Sending to the Postomat', logo: <EnvelopeIcon className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }} />, subtitle: 'Full payment required' },
    { id: 'Store', title: 'Sending to the Store', logo: <BuildingStorefrontIcon className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }} />, subtitle: 'Free shipping' },
  ];