import { lazy } from 'react';

const Orders = lazy(() => import('../pages/Orders'));
const Settings = lazy(() => import('../../account/settings/Settings'));
const Tables = lazy(() => import('../pages/Tables'));

const coreRoutes = [
  {
    path: 'orders',
    title: 'Orders',
    component: Orders,
  },
  {
    path: 'tables',
    title: 'Tables',
    component: Tables,
  },
  {
    path: 'settings',
    title: 'Settings',
    component: Settings,
  },
];

const routes = [...coreRoutes];
export default routes;
