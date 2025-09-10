import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import ForgotPasswordPage from './pages/forgot-password.jsx';
import ResetPasswordPage from './pages/reset-password.jsx';
import ProductsPage from './pages/products.jsx';
import ProductDetailPage from './pages/product-detail.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import { ProductsProvider } from './components/context/products.context.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "user",
        element: <UserPage />
      },
      {
        path: "register",
        element: <RegisterPage />
      },
      {
        path: "login",
        element: <LoginPage />
      }
      ,
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />
      },
      {
        path: "products/:categoryId",
        element: <ProductsPage />
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <ProductsProvider>
        <RouterProvider router={router} />
      </ProductsProvider>
    </AuthWrapper>
  </React.StrictMode>,
);