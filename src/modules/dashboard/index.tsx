import { RouteObject } from 'react-router';

import { loadable } from '@/components/shared/Loadable';

const Dashboard = loadable(() => import('./pages/Dashboard'));

export const Router: RouteObject = {
  path: 'dashboard',
  children: [
    {
      path: '',
      index: true,
      element: <Dashboard/>
    }
  ]
}