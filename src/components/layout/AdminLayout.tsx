import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { IAuthReducerState } from "../../store/accounts/AuthReducer";


const AdminLayout = () => {
  const { isAuth, user } = useSelector((redux: any) => redux.auth as IAuthReducerState);

  const navigate = useNavigate();

  const isAdmin = isAuth && user?.Role === "Administrator";
  useEffect(() => {
    if (!isAuth) navigate("/login");
    if (isAuth) {
      if (user?.Role != "Administrator") {
        navigate("/404")
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