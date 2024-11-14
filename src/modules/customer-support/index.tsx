import { RouteObject } from 'react-router';

import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'profileDetailsPlayer',
      import: () => import('./pages/profile-detail/ProfileDetail')
    },
    {
      path: 'transactionHistoryCustomerSupport',
      import: () => import('./pages/TransactionHistory')
    },
    {
      path: 'playerGameHistoryCustomerSupport',
      import: () => import('./pages/PlayerGameHistory')
    },
    {
      path: 'playerMagnetChipsHistoryCustomerSupport',
      import: () => import('./pages/player-loyality-points-history/PlayerLoyalityPointsHistory')
    },
    {
      path: 'playerInfoReportCustomerSupport',
      import: () => import('./pages/PlayerInfoReport')
    }
  ])
}