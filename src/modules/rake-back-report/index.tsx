import { RouteObject } from 'react-router';

import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'rakeBackPlayerReport',
      import: () => import('./pages/rakeback-player-report/RakeBackPlayerReport')
    },
    {
      path: 'rakeBackTransactionHistory',
      import: () => import('./pages/rakeback-transaction-history-report/RakeBackTransactionHistoryReport')
    },
    {
      path: 'rakeReport',
      import: () => import('./pages/rakeback-commission-report/RakebackCommissionReport')
    },
    {
      path: 'rakeHistory',
      import: () => import('./pages/rakeback-history/RakebackHistory')
    }
  ])
}