import { RouteObject } from 'react-router';

import { routesWithLazy } from '@/helpers/routing';

export const Router: RouteObject = {
  path: '',
  children: routesWithLazy([
    {
      path: 'createUser',
      import: () => import('./pages/create-user/CreateUser')
    },
    {
      path: 'viewUser/:id',
      import: () => import('./pages/view-user/ViewUser')
    },
    {
      path: 'editUser/:id',
      import: () => import('./pages/edit-user/EditUser')
    },
    {
      path: 'listUsers',
      import: () => import('./pages/list-users/ListUsers')
    },
    {
      path: 'createAffiliate',
      import: () => import('./pages/create-agent/CreateAgent')
    },
    {
      path: 'createSubAffiliateByAdmin',
      import: () => import('./pages/create-sub-agent/CreateSubAgent')
    },
    {
      path: 'createSubAffiliateByAffiliate',
      import: () => import('./pages/create-sub-agent/CreateSubAgent')
    },
    {
      path: 'listOfAffiliate',
      import: () => import('./pages/list-agent/ListAgent')
    },
    {
      path: 'listOfAffiliate/view/:id',
      import: () => import('./pages/view-agent/ViewAgent')
    },
    {
      path: 'listOfAffiliate/edit/:id',
      import: () => import('./pages/edit-agent/EditAgent')
    },
    {
      path: 'listSubAffiliate',
      import: () => import('./pages/list-sub-agents/ListSubAgents')
    },
    {
      path: 'listSubAffiliate/:username',
      import: () => import('./pages/list-sub-agents/ListSubAgents')
    },
    {
      path: 'listSubAffiliate/view/:id',
      import: () => import('./pages/view-sub-agent/ViewSubAgent')
    },
    {
      path: 'listSubAffiliate/edit/:id',
      import: () => import('./pages/edit-sub-agent/EditSubAgent')
    },
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
    {
      path: 'createAff',
      import: () => import('./pages/create-affiliate/CreateAffiliate')
    },
    {
      path: 'listAff',
      import: () => import('./pages/list-affiliate/ListAffiliate')
    },
    {
      path: 'listNewAffiliate/view/:id',
      import: () => import('./pages/view-affiliate/ViewAffiliate')
    },
    {
      path: 'listNewAffiliate/edit/:id',
      import: () => import('./pages/edit-affiliate/EditAffiliate')
    },
    {
      path: 'listNewSubAffiliate/view/:id',
      import: () => import('./pages/view-sub-affiliate/ViewSubAffiliate')
    },
    {
      path: 'listNewSubAffiliate/edit/:id',
      import: () => import('./pages/edit-sub-affiliate/EditSubAffiliate')
    },
    {
      path: 'createSubaff',
      import: () => import('./pages/create-sub-affiliate/CreateSubAffiliate')
    },
    {
      path: 'createSubaffByAff',
      import: () => import('./pages/create-sub-affiliate/CreateSubAffiliate')
    },
    {
      path: 'listSubaff',
      import: () => import('./pages/list-sub-affiliate/ListSubAffiliate')
    },
    {
      path: 'listSubaff/:username',
      import: () => import('./pages/list-sub-affiliate/ListSubAffiliate')
    }
  ])
}