import { RouteObject } from 'react-router';
import { loadable } from '@/components/shared/Loadable';

const Login = loadable(() => import('./pages/login/Login'));
const ForgotPassword = loadable(() => import('./pages/forgot-password/ForgotPassword'));
const GoogleAuthenticator = loadable(() => import('./pages/google-authenticator/GoogleAuthenticator'));
const ForgotPassowrdPLayer = loadable(() => import('./pages/forgot-password-player/ForgotPassword'));
const NewPassword = loadable(() => import('./pages/new-password/NewPassword'));

export const Router: RouteObject = {
  path: '',
  children: [
    {
      path: 'login',
      element: <Login />
    },
    {
      path: 'forgotPassword',
      element: <ForgotPassword />
    },
    {
      path: 'googleAuthen',
      element: <GoogleAuthenticator />
    },
    {
      path: 'resetPasswordPlayer/:forgotPlayerId/:status',
      element: <ForgotPassowrdPLayer />
    },
    {
      path: 'resetPassword/:forgotId',
      element: <NewPassword />
    }
  ]
}