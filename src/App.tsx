import { Route, Routes } from "react-router-dom";
import Page404 from "./components/notFound/Page404";
import Logo from "./components/logo/Logo";
import Bag from "./components/navbars/navbarsPages/bag/Bag";
import Product from "./components/user/product/Product.tsx";
import CatalogNavigation from "./components/user/catalog/CatalogNavigation";
import NavbarsPage from "./components/navbars/NavbarsPage";
import { useEffect, useState } from "react";
import Loader from "./components/Dashboard/common/Loader";
import { Toaster } from 'react-hot-toast';
import AdminPanelPage from "./components/admin/adminPanel/AdminPanelPage.tsx";
import AddStorage from "./components/admin/product/AddStorage";
import OurBrand from "./components/footer/footerPages/OurBrand";
import Footer from "./components/footer/FooterPage";
import DeliveryandPayment from "./components/footer/footerPages/DeliveryAndPayment";
import ReturnExchange from "./components/footer/footerPages/ReturnExchange";
import WarrantyProductCare from "./components/footer/footerPages/WarrantyProductCare";
import PrivacyPolicy from "./components/footer/footerPages/PrivacyPolicy";
import About from "./components/footer/footerPages/About";
import StoreLocations from "./components/footer/footerPages/StoreLocations";
import AdminLayout from "./components/layout/AdminLayout";
import AuthPanelPage from "./components/navbars/navbarsPages/auth/AuthPanelPage";
import UserPanelPage from "./components/user/userPanel/UserPanelPage";
import UserLayout from "./components/layout/UserLayout";
import GuestLayout from "./components/layout/GuestLayout";
import HomeStore from "./components/homePage/HomeStore";
import CatalogHome from "./components/user/catalog/CatalogHome";

import useAuthTokenEffect from "./useAuthTokenEffect";
import useGetFavoritesEffect from "./useGetFavoritesEffect";
import './i18n/i18n.ts';
import GeneralLayout from "./components/layout/GeneralLayout.tsx";
import ProductList from "./components/admin/product/ProductList.tsx";
import AdminHeader from "./components/admin/adminPanel/AdminHeader.tsx";
import AddPanelPage from "./components/admin/product/add-product/AddPanelPage.tsx";
import EditPanelPage from "./components/admin/product/edit-product/EditPanelPage.tsx";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    }, []);
    
    useAuthTokenEffect()
    useGetFavoritesEffect();

  return loading ? (
    <>
      <Loader />
    </>
  ) : (
    <>
      <Toaster position="top-right" reverseOrder={false} containerClassName="overflow-auto" />
      <Routes>
        {/* Гостьові маршрути */}
        <Route element={<><Logo /><NavbarsPage /><GuestLayout /><Footer/></>}>
          <Route path='/auth' element={<AuthPanelPage />} />
          <Route path="/auth/:email/:token" element={<AuthPanelPage />} />
        </Route>

        {/* Адміністраторські маршрути без Logo, NavbarsPage і Footer */}
        <Route path="/admin" element={<><AdminHeader/><AdminLayout /></>}>
          <Route path="/admin/*" element={<Page404 />} />
          <Route path="admin-panel-page" element={<AdminPanelPage />} />
          
          <Route path="product/product-list" element={<ProductList/>}/>
          <Route path="product/add-product-en" element={<AddPanelPage />} />
          <Route path="product/add-product-uk" element={<AddPanelPage />} />
          <Route path="product/add-product-es" element={<AddPanelPage />} />
          <Route path="product/add-product-fr" element={<AddPanelPage />} />
          <Route path="product/edit-product-en/:Id" element={<EditPanelPage />} />
          <Route path="product/edit-product-uk/:Id" element={<EditPanelPage />} />
          <Route path="product/edit-product-es/:Id" element={<EditPanelPage />} />
          <Route path="product/edit-product-fr/:Id" element={<EditPanelPage />} />

          <Route path="product/add-storage/:Id" element={<AddStorage />} />
        </Route>

        {/* Маршрути для користувачів з Logo, NavbarsPage і Footer */}
        <Route element={<><Logo /><NavbarsPage /><UserLayout /><Footer/></>}>
          <Route path="/account/*" element={<Page404 />} />
          <Route path="account/orders" element={<UserPanelPage />} />
          <Route path='account/profile' element={<UserPanelPage />} />
          <Route path='account/settings' element={<UserPanelPage />} />
          <Route path='account/favorites' element={<UserPanelPage />} />
          <Route path='account/bonuses' element={<UserPanelPage />} />
        </Route>

        {/* Загальні маршрути з Logo, NavbarsPage і Footer */}
        <Route element={<><GeneralLayout /><Footer/></>}>
          <Route path="/" element={<HomeStore />} />
          <Route path="/:email/:token" element={<HomeStore />} />
          <Route path="catalog/:subName/:urlName" element={<CatalogNavigation />} />
          <Route path="catalog/:subName" element={<CatalogNavigation />} />
          <Route path="catalog-home" element={<CatalogHome />} />
          <Route path="catalog-home/:gender" element={<CatalogHome />} />
          <Route path="catalog-home/search/:text" element={<CatalogHome />} />
          <Route path="product/:Id" element={<Product />} />
          <Route path='/bag' element={<Bag />} />
          <Route path="/delivery-and-payment" element={<DeliveryandPayment />} />
          <Route path="/return-exchange" element={<ReturnExchange />} />
          <Route path="/warranty-product-care" element={<WarrantyProductCare />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/our-brand" element={<OurBrand />} />
          <Route path="/about" element={<About />} />
          <Route path="/store-locations" element={<StoreLocations />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </>
  );
}

export default App
