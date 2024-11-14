import { RouteObject } from 'react-router';

import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'playerBuildAcess',
      import: () => import('./pages/player-build-access/PlayerBuildAccess')
    }
  ])
}