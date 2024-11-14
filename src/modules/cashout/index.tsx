import { RouteObject } from 'react-router';

import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'pendingCashOut',
      import: () => import('./pages/PendingCashout')
    },
    {
      path: 'directCashoutHistory',
      import: () => import('./pages/DirectCashoutHistory')
    },
    {
      path: 'cashoutDirect',
      import: () => import('./pages/CashoutDirect')
    },
    {
      path: 'approveCashout',
      import: () => import('./pages/CashoutPayment')
    },
    {
      path: 'cashoutHistory',
      import: () => import('./pages/CashoutHistory')
    },
    {
      path: 'cashoutRequest',
      import: () => import('./pages/cashout-request/CashoutRequest')
    },
    {
      path: 'cashoutSubAffiliate',
      import: () => import('./pages/cashout-request-subagent/CashoutRequest')
    },
    {
      path: 'pendingCashOutAffiliate',
      import: () => import('./pages/PendingCashOutAffiliate')
    }
  ])
}