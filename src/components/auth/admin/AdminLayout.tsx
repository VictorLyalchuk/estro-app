import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { IAuthReducerState } from "../login/AuthReducer";


const AdminLayout = () => {
  const { isAuth, user } = useSelector((redux: any) => redux.auth as IAuthReducerState);

  const navigate = useNavigate();

  const isAdmin = isAuth && user?.Role==="Admin";
  useEffect(() => {
    if (!isAuth) navigate("/login");
    if(isAuth) {
      if(user?.Role!="Admin") {
        navigate("/pages/403")
      }
    }
  }, [isAuth, user]);

  return (
    <>
            {isAdmin && <Outlet />}

    </>
  );
};

export default AdminLayout;