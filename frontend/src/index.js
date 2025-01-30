import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import HomeScreen from './screens/HomeScreen';
// import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/users/LoginScreen';
import RegisterScreen from './screens/users/RegisterScreen';
import ProfileScreen from './screens/users/ProfileScreen';
import PricesList from "./screens/admin/prices/PricesList";
import EditPrice from "./screens/admin/prices/EditPrice";
import ProductsList from "./screens/admin/products/ProductsList";
import EditProduct from "./screens/admin/products/EditProduct";
import ProductPricesList from "./screens/admin/products/ProductPricesList";
import SubscriptionsList from "./screens/admin/subscriptions/SubscriptionsList";
import EditSubscription from "./screens/admin/subscriptions/EditSubscription";
import UnitsOfMeasureList from "./screens/admin/unitsOfMeasure/UnitsOfMeasureList";
import EditUnitOfMeasure from "./screens/admin/unitsOfMeasure/EditUnitOfMeasure";
import UsersList from './screens/admin/users/UsersList';
import EditUser from './screens/admin/users/EditUser';
import CategoriesList from './screens/admin/categories/CategoriesList';
import EditCategory from './screens/admin/categories/EditCategory';
import StoresList from "./screens/admin/stores/StoresList";
import EditStore from "./screens/admin/stores/EditStore";
import ChainsList from "./screens/admin/chains/ChainsList";
import EditChain from "./screens/admin/chains/EditChain";
import CreatePrice from "./screens/admin/prices/CreatePrice";
import StorePricesList from './screens/admin/stores/StorePricesList';
import ChainPricesList from './screens/admin/chains/ChainPricesList';
import store from './store';
import { Provider } from 'react-redux';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<HomeScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      <Route
        path='/search/:keyword/page/:pageNumber'
        element={<HomeScreen />}
      />
      {/* <Route path='/cart' element={<CartScreen />} /> */}
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      {/* Registered users */}
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfileScreen />} />
      </Route>
      {/* Admin users */}
      <Route path='' element={<AdminRoute />}>
        {/* Users */}
        <Route path='/admin/users' element={<UsersList />} />
        <Route path='/admin/users/search/:keyword' element={<UsersList />} />
        <Route path='/admin/users/page/:pageNumber' element={<UsersList />} />
        <Route
          path='/admin/users/search/:keyword/page/:pageNumber'
          element={<UsersList />}
        />
        <Route path='/admin/user/:id/edit' element={<EditUser />} />\
        {/* Categories */}
        <Route path='/admin/categories' element={<CategoriesList />} />
        <Route path='/admin/categories/search/:keyword' element={<CategoriesList />} />
        <Route path='/admin/categories/page/:pageNumber' element={<CategoriesList />} />
        <Route
          path='/admin/categories/search/:keyword/page/:pageNumber'
          element={<CategoriesList />}
        />
        <Route path='/admin/category/:id/edit' element={<EditCategory />} />
        {/* Stores */}
        <Route path='/admin/stores' element={<StoresList />} />
        <Route path='/admin/stores/search/:keyword' element={<StoresList />} />
        <Route path='/admin/stores/page/:pageNumber' element={<StoresList />} />
        <Route
          path='/admin/stores/search/:keyword/page/:pageNumber'
          element={<StoresList />}
        />
        <Route path='/admin/store/:id/edit' element={<EditStore />} />
        <Route path='/admin/store/:id/prices' element={<StorePricesList />} />
        {/* Chains */}
        <Route path='/admin/chains' element={<ChainsList />} />
        <Route path='/admin/chains/search/:keyword' element={<ChainsList />} />
        <Route path='/admin/chains/page/:pageNumber' element={<ChainsList />} />
        <Route
          path='/admin/chains/search/:keyword/page/:pageNumber'
          element={<ChainsList />}
        />
        <Route path='/admin/chain/:id/edit' element={<EditChain />} />
        <Route path='/admin/chain/:id/prices' element={<ChainPricesList />} />
        {/* Prices */}
        <Route path='/admin/prices' element={<PricesList />} />
        <Route path='/admin/prices/search/:keyword' element={<PricesList />} />
        <Route path='/admin/prices/page/:pageNumber' element={<PricesList />} />
        <Route
          path='/admin/prices/search/:keyword/page/:pageNumber'
          element={<PricesList />}
        />
        <Route path='/admin/price/:id/edit' element={<EditPrice />} />
        <Route path='/admin/price/create' element={<CreatePrice />} />
        {/* Products */}
        <Route path='/admin/products/page/:pageNumber' element={<ProductsList />} />
        <Route exact path='/admin/products/search/:keyword/page/:pageNumber' element={<ProductsList />} />
        <Route path='/admin/product/:id/edit' element={<EditProduct />} />
        <Route path='/admin/product/:id/prices' element={<ProductPricesList />} />
        {/* Subscriptions */}
        <Route path='/admin/subscriptions' element={<SubscriptionsList />} />
        <Route path='/admin/subscription/:id/edit' element={<EditSubscription />} />
        {/* Units Of Measure */}
        <Route path='/admin/unitsOfMeasure' element={<UnitsOfMeasureList />} />
        <Route path='/admin/unitOfMeasure/:id/edit' element={<EditUnitOfMeasure />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        {/* <PayPalScriptProvider deferLoading={true}> */}
        <RouterProvider router={router} />
        {/* </PayPalScriptProvider> */}
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
