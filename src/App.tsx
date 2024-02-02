import { Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound/NotFound";
import Login from "./components/auth/login/Login";
import Header from "./components/Header/Header";
import Register from "./components/auth/register/Register";
import Bag from "./components/Bag/Bag";
import Product from "./components/Product/Product";
import Catalog from "./components/Catalog/Catalog";
import Navigation from "./components/Navigation/Navigation";
import { Suspense, useEffect, useState } from "react";
import Loader from "./components/Dashboard/common/Loader";
import DefaultLayout from "./components/Dashboard/layout/DefaultLayout";
import MainDashboard from "./components/Dashboard/pages/MainDashboard";
import { Toaster } from 'react-hot-toast';
import routes from './components/Dashboard/routes';
import AddProduct from "./components/Product/AddProduct";
import EditProduct from "./components/Product/EditProduct";
import AddStorage from "./components/Product/AddStorage";
import HomePage from "./components/HomePage/HomePage";
import Footer from "./components/Footer/Footer";
import DeliveryandPayment from "./components/Footer/DeliveryAndPayment";
import ReturnExchange from "./components/Footer/ReturnExchange";
import WarrantyProductCare from "./components/Footer/WarrantyProductCare";
import PrivacyPolicy from "./components/Footer/PrivacyPolicy";
import About from "./components/Footer/About";
import StoreLocations from "./components/Footer/StoreLocations";
import AdminLayout from "./components/auth/admin/AdminLayout";

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
      <Header></Header>
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

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route path="/" element={<><Navigation /><HomePage /></>}></Route>
        <Route path="catalog/:subName/:urlName" element={<><Navigation /><Catalog /></>} />
        <Route path="product/:Id" element={<><Navigation /> <Product /></>} />
        <Route path='/bag' element={<><Navigation /><Bag /> </>} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="add-product" element={<><Navigation /> <AddProduct /></>} />
          <Route path="edit-product/:Id" element={<><Navigation /> <EditProduct /></>} />
          <Route path="add-storage/:Id" element={<><Navigation /> <AddStorage /></>} />
        </Route>

        <Route path='*' element={<NotFound />} />
        <Route path="/delivery-and-payment" element={<><Navigation /><DeliveryandPayment /> </>} />
        <Route path="/return-exchange" element={<><Navigation /><ReturnExchange /></>} />
        <Route path="/warranty-product-care" element={<><Navigation /><WarrantyProductCare /></>} />
        <Route path="/privacy-policy" element={<><Navigation /><PrivacyPolicy /></>} />
        <Route path="/about" element={<><Navigation /><About /></>} />
        <Route path="/store-locations" element={<><Navigation /><StoreLocations /></>} />

      </Routes>
      <Footer></Footer>

    </>
  );
}

export default App
