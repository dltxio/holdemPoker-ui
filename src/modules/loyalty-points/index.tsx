import { RouteObject } from 'react-router';

import { loadable } from '@/components/shared/Loadable';

const Create = loadable(() => import('./pages/create-loyalty-point/Create'));
const List = loadable(() => import('./pages/List'));
const Edit = loadable(() => import('./pages/Edit'));

export const Router: RouteObject = {
  path: '',
  children: [
    {
      path: 'listLoyaltyPoints',
      element: <List/>
    },
    {
      path: 'createLoyaltyPoints',
      element: <Create/>
    },
    {
      path: 'loyaltyPoints/:id',
      element: <Edit/>
    },
  ]
}