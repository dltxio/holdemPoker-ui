import { RouteObject } from 'react-router';

import { loadable } from '@/components/shared/Loadable';

const ViewTransactionHistory = loadable(() => import('./pages/view-transaction-history/ViewTransactionHistory'));
const ViewDepositInvoice = loadable(() => import("./pages/vew-deposit-info/ViewDepositInfo"));

export const Router: RouteObject = {
  path: '',
  children: [
    {
      path: 'depositInvoice',
      element: <ViewDepositInvoice />
    },
    {
      path: 'transactionHistoryReport',
      element: <ViewTransactionHistory />
    }
  ]
}