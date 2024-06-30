import { BuildingStorefrontIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export const deliveryList = [
    { id: 'Address', title: 'Shipping to the Address', logo: <EnvelopeIcon className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }} />, subtitle: 'Paid shipping' },
    { id: 'Store', title: 'Shipping to the Store', logo: <BuildingStorefrontIcon className="size-7 hover:text-indigo-700" style={{ transition: "color 0.3s" }} />, subtitle: 'Free shipping' },
  ];