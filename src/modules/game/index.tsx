import { RouteObject } from 'react-router';

import { loadable } from '@/components/shared/Loadable';

const ListTable = loadable(() => import('./pages/ListTable'));
const AddTable = loadable(() => import('./pages/add-table/AddTable'));
const EditTable = loadable(() => import('./pages/edit-table/EditTable'));
const View = loadable(() => import('./pages/view/View'));
const Duplicate = loadable(() => import('./pages/duplicate/Duplicate'));
const ViewUpdatesList = loadable(() => import('./pages/view-updates-list/ViewUpdatesList'));
const ViewUpdateRecord = loadable(() => import('./pages/view-update-record/ViewUpdateRecord'));

export const Router: RouteObject = {
  path: '',
  children: [
    {
      path: 'listTable',
      element: <ListTable/>
    },
    {
      path: 'createTable',
      element: <AddTable/>
    },
    {
      path: 'table/edit/:id',
      element: <EditTable/>
    },
    {
      path: 'table/view/:id',
      element: <View/>
    },
    {
      path: 'table/duplicate/:id',
      element: <Duplicate/>
    },
    {
      path: 'table/viewUpdatesList/:id',
      element: <ViewUpdatesList/>
    },
    {
      path: 'table/viewUpdateRecord/:id',
      element: <ViewUpdateRecord />
    }
  ]
}