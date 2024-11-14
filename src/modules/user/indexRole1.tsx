import { RouteObject } from 'react-router';

import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'createPlayer',
      import: () => import('./pages/create-player/CreatePlayer')
    },
    {
      path: 'createPlayerByAffiliate',
      import: () => import('./pages/create-player/CreatePlayer')
    },
    {
      path: 'listPlayer',
      import: () => import('./pages/list-players/ListPlayers')
    },
    {
      path: 'listPlayer/:username',
      import: () => import('./pages/list-players/ListPlayers')
    },
    {
      path: 'listAffiliatePlayer/:isParentUserName',
      import: () => import('./pages/list-affiliate-players/ListAffiliatePlayers')
    },
    {
      path: 'player/view/:id',
      import: () => import('./pages/view-player/ViewPlayer')
    },
    {
      path: 'player/edit/:id',
      import: () => import('./pages/edit-player/EditPlayer')
    },
  ])
}