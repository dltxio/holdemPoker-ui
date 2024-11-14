import { RouteObject } from 'react-router';

import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'playerChatManagement',
      import: () => import('./pages/player-chat/PlayerChat')
    },
    {
      path: 'chatHistory',
      import: () => import('./pages/chat-history/ChatHistory')
    }
  ])
}