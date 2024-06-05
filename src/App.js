import React, { Component, Suspense } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './scss/style.scss';
import ProtectedRoutes from './utils/protectedRoutes';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('./views/pages/login/userLogin'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const AddUser = React.lazy(() => import('./views/users/addUser/addUser'))
const ShowUsers = React.lazy(() => import('./views/users/showUsers/showUsers'))
const NewApp = React.lazy(() => import('./views/apps/newApp/newApp'))
const ShowApps = React.lazy(() => import('./views/apps/showApps/showApps'))
const ApplicationDetails = React.lazy(() => import('./views/apps/showApps/applicationDetail.js'))

class App extends Component {
  render() {
    return (
      <Router>
        <Suspense fallback={loading}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<DefaultLayout />} />
            <Route path="#/dashboard" element={<Dashboard />} />
            <Route path="#/users" element={<AddUser />} />
            <Route path="#/users/addUser" element={<AddUser />} />
            <Route path="#/users/showUsers" element={<ShowUsers />} />
            <Route path="/apps" element={<NewApp />} />
            <Route path="#/apps/newApp" element={<NewApp />} />
            <Route path="#/apps/showApps" element={<ShowApps />} />
            <Route path="#/apps/:appId" element={<ApplicationDetails />} />
          </Routes>
        </Suspense>
      </Router>
    );
  }
}

export default App;
