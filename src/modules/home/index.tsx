import { RouteObject } from 'react-router';
import { UnAuthenticatedLayout } from '@/components/layout/UnAuthenticated';
import { loadable } from '@/components/shared/Loadable';

const Home = loadable(() => import('./pages/Home'));

export const Router: RouteObject = {
  path: '',
  children: [
    {
      path: '',
      element: <Home/>
    }
  ]
}