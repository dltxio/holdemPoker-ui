import { RouteObject } from 'react-router';

import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'broadcastToGame',
      import: () => import('./pages/BroadcastToGame')
    }
  ])
}