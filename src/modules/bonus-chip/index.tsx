import { RouteObject } from 'react-router';

import { loadable } from '@/components/shared/Loadable';

const Transfer = loadable(() => import('./pages/bonus-transfer/BonusTransfer'));
const TransferHistory = loadable(() => import('./pages/bonus-transfer-history/BonusTransferHistory'));

export const Router: RouteObject = {
  path: '',
  children: [
    {
      path: 'instantBonusTransfer',
      element: <Transfer/>
    },
    {
      path: 'instantBonusHistory',
      element: <TransferHistory/>
    },
  ]
}