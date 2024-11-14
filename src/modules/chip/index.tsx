import { RouteObject } from 'react-router';

import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'transferFund',
      import: () => import('./pages/transfer-to-player/TransferToPlayer')
    },
    {
      path: 'transferFundToAffiliate',
      import: () => import('./pages/transfer-to-agent/TransferToAgent')
    },
    {
      path: 'transferFundToSubAffiliate',
      import: () => import('./pages/transfer-to-sub-agent/TransferToAgent')
    },
    {
      path: 'transferHistoryAffiliate',
      import: () => import('./pages/transfer-history-agent/TransferHistoryAgent')
    },
    {
      path: 'transferHistoryPlayer',
      import: () => import('./pages/transfer-history-player/TransferHistoryPlayer')
    }
  ])
}