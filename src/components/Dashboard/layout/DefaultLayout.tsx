import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { IAuthReducerState } from '../../../store/accounts/AuthReducer';
import { useSelector } from 'react-redux';

const DefaultLayout = () => {
  const navigate = useNavigate();
  const { isAuth } = useSelector((redux: any) => redux.auth as IAuthReducerState);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (!isAuth) navigate("/login");
    
  }, []);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
    {isAuth ? 
      (<>
          {/* <!-- ===== Page Wrapper Start ===== --> */}
          <div className="flex  overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* <!-- ===== Header Start ===== --> */}

        
          {/* <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
          {/* <!-- ===== Header End ===== --> */}
          
          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
              </div>
              </main>
              {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
      </>) : (    null   
      )}
      
    </div>
        
  );
};

export default DefaultLayout;
