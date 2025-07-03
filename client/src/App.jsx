import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import PrivateRouteEmp from "./components/PrivateRouteEmp";
import AddEmployee from "./pages/AddEmployee";
import UpdateEmployee from "./pages/UpdateEmployee";
import SearchEmployee from "./pages/SearchEmployee";
import ListEmployees from "./pages/ListEmployees";
import ListBankDetails from "./pages/ListBankDetails";
import UpdateBank from "./pages/UpdateBank";
import EmpSignIn from "./empPages/EmpSignIn";
import EmpHome from "./empPages/EmpHome";
import RequestLeave from "./empPages/RequestLeave";
import ViewAllLeaves from "./pages/ViewAllLeaves";
import UpdateLeave from "./pages/UpdateLeave";
import ViewLeave from "./empPages/ViewLeave";
import GenerateSlip from "./pages/GenerateSlip";
import SearchSlip from "./pages/SearchSlip";
import GetSlip from "./pages/GetSlip";
import MayBeShow from "./components/MayBeShow";
import EmpHomeContent from "./empPages/EmpHomeContent";
import ViewDetails from "./empPages/ViewDetails";
import HomeContent from "./pages/HomeContent";
import Account from "./pages/Account";
import LeaveCalendar from "./pages/LeaveCalendar";

export default function App() {
  return (
    <SocketProvider>
      <div className="flex flex-col h-screen">
        <BrowserRouter>
          <MayBeShow>
            <Header />
          </MayBeShow>

          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="get-slip/:empRef/:month" element={<GetSlip />} />

            <Route element={<PrivateRoute />}>
              <Route path="/Profile" element={<Profile />} />
              <Route path="home" element={<Home />}>
                <Route path="" element={<HomeContent />} />
                <Route path="add-employee" element={<AddEmployee />} />
                <Route path="generate-slip" element={<GenerateSlip />} />
                <Route path="update-employee" element={<UpdateEmployee />} />
                <Route path="search-employee" element={<SearchEmployee />} />
                <Route path="search-slip" element={<SearchSlip />} />
                <Route path="list-employees" element={<ListEmployees />} />
                <Route path="list-bank-details" element={<ListBankDetails />} />
                <Route path="view-all-leaves" element={<ViewAllLeaves />} />
                <Route path="leave-calendar" element={<LeaveCalendar />} />
                <Route
                  path="update-bank-details/:empid"
                  element={<UpdateBank />}
                />
                <Route path="edit-leave/:id" element={<UpdateLeave />} />
                <Route path="account" element={<Account />} />
              </Route>
            </Route>

            <Route path="/employee-signin" element={<EmpSignIn />}></Route>
            <Route element={<PrivateRouteEmp />}>
              <Route path="employee-home" element={<EmpHome />}>
                <Route path="" element={<EmpHomeContent />} />
                <Route path="request-leave" element={<RequestLeave />} />
                <Route path="view-leave/:id" element={<ViewLeave />} />
                <Route path="view-details/:empid" element={<ViewDetails />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </SocketProvider>
  );
}
