import { RouteObject } from 'react-router';

import { loadable } from '@/components/shared/Loadable';

const Create = loadable(() => import('./pages/create-bonus-code/Create'));
const Edit = loadable(() => import('./pages/edit-bonus-code/Edit'));
const List = loadable(() => import('./pages/List'));
const Promotion = loadable(() => import('./pages/promotion/Promotion'));

export const Router: RouteObject = {
  path: '',
  children: [
    {
      path: 'listBonusDeposit',
      element: <List/>
    },
    {
      path: 'bonusDeposit/:id',
      element: <Edit/>
    },
    {
      path: 'generateBonusCode',
      element: <Create/>
    },
    {
      path: 'promotionalBonusCode',
      element: <Promotion/>
    }
  ]
}