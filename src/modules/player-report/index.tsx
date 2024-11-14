import { RouteObject } from 'react-router';

import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'findPlayerReport',
      import: () => import('./pages/player-report/PlayerReport')
    },
    {
      path: 'findPlayerChart',
      import: () => import('./pages/player-rake-chart/PlayerRakeChart')
    },
    {
      path: 'findPlayerChartGamesPlayed',
      import: () => import('./pages/player-games-played-chart/PlayerGamesPlayedChart')
    },
    {
      path: 'findMonthlyPlayerBannedReport',
      import: () => import('./pages/player-banned-report/PlayerBannedReport')
    },
    {
      path: 'playerChipsReport',
      import: () => import('./pages/player-chips-report/PlayerChipsReport')
    },
    {
      path: 'playerLoyalityPointsReport',
      import: () => import('./pages/player-loyality-points-report/PlayerLoyalityPointsReport')
    },
    {
      path: 'playerBonusReport',
      import: () => import('./pages/player-bonus-report/PlayerBonusReport')
    },
    {
      path: 'playerInfoReport',
      import: () => import('./pages/player-info-report/PlayerInfoReport')
    },
    {
      path: 'playerParentHistory',
      import: () => import('./pages/player-parent-history/PlayerParentHistory')
    },
    {
      path: 'playerLockedBonus',
      import: () => import('./pages/player-locked-bonus-report/PlayerLockedBonusReport')
    },
    {
      path: 'lockedBonusClaimedHistory',
      import: () => import('./pages/locked-bonus-claimed-history/LockedBonusClaimedHistory')
    },
    {
      path: 'playerHandHistory',
      import: () => import('./pages/player-hand-story/PlayerHandHistory')
    },
  ])
}