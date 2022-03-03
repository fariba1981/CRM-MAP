import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
import ActiveAccount from './pages/ActiveAccount';
import Locations from './pages/Locations';
import Show from './pages/Show'
import AddLocation from './pages/Addlocation';
import Search from './pages/Search'
import ShowGoogle from './pages/ShowGoogle'
// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'locations', element: <Locations/> },
        { path: 'addlocation', element: <AddLocation/> },
        { path: 'blog', element: <Blog /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: 'dashboard', element: <Navigate to="/dashboard/app" /> },
        { path: 'activeaccount', element: <ActiveAccount/> },
        { path: '*', element: <Navigate to="/404" /> },
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> },
    { path: 'show', element: <Show/> },
    { path: 'search', element: <Search/> },
    { path: 'showgoogle', element: <ShowGoogle/> }
  ]);
}
