import { Route, Routes } from "react-router-dom";
import NotFound from "./components/notFound/NotFound";
import Logo from "./components/logo/Logo";
import Bag from "./components/header/headerPages/bag/Bag";
import Product from "./components/user/product/Product";
import Catalog from "./components/user/catalog/Catalog";
import Header from "./components/header/HeaderPage";
import { Suspense, useEffect, useState } from "react";
import Loader from "./components/Dashboard/common/Loader";
import DefaultLayout from "./components/Dashboard/layout/DefaultLayout";
import MainDashboard from "./components/Dashboard/pages/MainDashboard";
import { Toaster } from 'react-hot-toast';
import routes from './components/Dashboard/routes';
import AddProduct from "./components/admin/product/AddProduct";
import EditProduct from "./components/admin/product/EditProduct";
import AddStorage from "./components/admin/product/AddStorage";
import HomePage from "./components/homePage/HomePage";
import Footer from "./components/footer/FooterPage";
import DeliveryandPayment from "./components/footer/footerPages/DeliveryAndPayment";
import ReturnExchange from "./components/footer/footerPages/ReturnExchange";
import WarrantyProductCare from "./components/footer/footerPages/WarrantyProductCare";
import PrivacyPolicy from "./components/footer/footerPages/PrivacyPolicy";
import About from "./components/footer/footerPages/About";
import StoreLocations from "./components/footer/footerPages/StoreLocations";
import AdminLayout from "./components/layout/AdminLayout";
import AuthPage from "./components/header/headerPages/auth/AuthPage";
import AccountPage from "./components/account/AccountPage";

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <>
      <Loader />
    </>
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      <Logo/>
      <Header />
      <Routes>
        <Route path='/dashboard' element={<DefaultLayout />}>
          <Route index element={<MainDashboard />} />
          {routes.map((routes, index) => {
            const { path, component: Component } = routes;
            return (
              <Route
                key={index}
                path={path}
                element={
                  <Suspense fallback={<Loader />}>
                    <Component />
                  </Suspense>
                }
              />
            );
          })}
        </Route>

        <Route path='/auth' element={<AuthPage />} />
        <Route path="/auth/:email/:token" element={<AuthPage/>} />

        <Route path="/" element={<HomePage />}></Route>
        <Route path="catalog/:subName/:urlName" element={<Catalog />} />
        <Route path="product/:Id" element={<Product />} />
        <Route path='/bag' element={<Bag /> } />

        <Route path='account/settings' element={<AccountPage /> } />
        <Route path='account/settings/:email/:token' element={<AccountPage /> } />




        <Route path="/admin" element={<AdminLayout />}>
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:Id" element={ <EditProduct />} />
          <Route path="add-storage/:Id" element={ <AddStorage />} />
        </Route>

        <Route path='*' element={<NotFound />} />
        <Route path="/delivery-and-payment" element={<DeliveryandPayment /> } />
        <Route path="/return-exchange" element={<ReturnExchange />} />
        <Route path="/warranty-product-care" element={<WarrantyProductCare />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/store-locations" element={<StoreLocations />} />

      </Routes>
      <Footer/>

    </>
  );
}

export default App
