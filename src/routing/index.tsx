import { RouterProvider, } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { RootBoundary } from '@/components/shared/RootBoundary';
import { App } from '@/metronic/app/App';

// Layouts
import { MasterLayout } from '@/metronic/_metronic/layout/MasterLayout';
import { AuthLayout } from '@/layouts/auth/AuthLayout';

// Routes
import { MetronicRoute } from './metronic';

// Guards
import { PublicGuard } from '@/guards/PublicGuard';
import { PrivateGuard } from '@/guards/PrivateGuard';

// Components
import { Loading } from '@/components/shared/loading/Loading';

// Modules
import * as Auth from '@/modules/auth';
import * as Home from '@/modules/home';
import * as Account from '@/modules/account';
import * as Dashboard from '@/modules/dashboard';
import * as Activity from '@/modules/activity';
import * as Game from '@/modules/game';
import * as Spam from '@/modules/spam';
import * as BonusCode from '@/modules/bonus-code';
import * as BonusChip from '@/modules/bonus-chip';
import * as ScratchCard from '@/modules/scratch-card';
import * as LoyaltyPoints from '@/modules/loyalty-points';
import * as Leaderboard from '@/modules/leaderboard';
import * as LeaderboardSet from '@/modules/leaderboard-set';
import * as LeaderboardReport from '@/modules/leaderboard-report';
import * as Chips from '@/modules/chip';
import * as TransactionHistory from '@/modules/transaction-history';
import * as TransactionHistoryRole from '@/modules/transaction-history/indexRole';
import * as User from '@/modules/user';
import * as UserRole from '@/modules/user/indexRole';
import * as UserRole1 from '@/modules/user/indexRole1';
import * as Cashout from '@/modules/cashout';
import * as RakeAnalytics from '@/modules/rake-analytics';
import * as PlayerReport from '@/modules/player-report';
import * as ChipReport from '@/modules/chip-report';
import * as CustomerSupport from '@/modules/customer-support';
import * as CashoutReport from '@/modules/cashout-report';
import * as PullChips from '@/modules/pull-chips';
import * as RakeBackReport from '@/modules/rake-back-report';
import * as Passbook from '@/modules/passbook';
import * as Chat from '@/modules/chat';
import * as Broadcast from '@/modules/broadcast';
import * as PlayerBuildAccess from '@/modules/player-build-access';
import * as RakebackConfig from "@/modules/rakeback-config";

const modules = [
  Home,
  Account,
  Dashboard,
  Activity,
  Game,
  Spam,
  BonusCode,
  BonusChip,
  ScratchCard,
  LoyaltyPoints,
  Leaderboard,
  LeaderboardSet,
  LeaderboardReport,
  Chips,
  TransactionHistory,
  User,
  Cashout,
  RakeAnalytics,
  PlayerReport,
  ChipReport,
  CustomerSupport,
  CashoutReport,
  PullChips,
  RakeBackReport,
  Passbook,
  Chat,
  Broadcast,
  PlayerBuildAccess,
  RakebackConfig
];

const modulesLevel1 = [
  Home,
  // Account,
  Dashboard,
  // Activity,
  // Game,
  // Spam,
  // BonusCode,
  // BonusChip,
  ScratchCard,
  // LoyaltyPoints,
  // Leaderboard,
  // LeaderboardSet,
  // LeaderboardReport,
  Chips,
  TransactionHistoryRole,
  UserRole1,
  Cashout,
  RakeAnalytics,
  PlayerReport,
  // ChipReport,
  // CustomerSupport,
  CashoutReport,
  PullChips,
  // RakeBackReport,
  // Passbook,
  // Chat,
  // Broadcast,
  PlayerBuildAccess,
  // RakebackConfig
];

const modulesLevel = [
  Home,
  // Account,
  Dashboard,
  // Activity,
  // Game,
  // Spam,
  // BonusCode,
  // BonusChip,
  ScratchCard,
  // LoyaltyPoints,
  // Leaderboard,
  // LeaderboardSet,
  // LeaderboardReport,
  Chips,
  // TransactionHistory,
  UserRole,
  Cashout,
  RakeAnalytics,
  PlayerReport,
  // ChipReport,
  // CustomerSupport,
  CashoutReport,
  PullChips,
  // RakeBackReport,
  // Passbook,
  // Chat,
  // Broadcast,
  PlayerBuildAccess,
  // RakebackConfig
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RootBoundary />,
    children: [
      {
        path: '/',
        element: <PrivateGuard children={<MasterLayout />} />,
        children: []
      },
      {
        element: <PublicGuard children={<AuthLayout />} />,
        children: [
          Auth.Router
        ]
      },
      {
        element: <PrivateGuard children={<MasterLayout />} />,
        children: [
          ...modules.map(x => x.Router),
        ]
      },
      MetronicRoute
    ]
  }
], {
  basename: process.env.PUBLIC_URL
})

const routerLevel = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RootBoundary />,
    children: [
      {
        path: '/',
        element: <PrivateGuard children={<MasterLayout />} />,
        children: []
      },
      {
        element: <PublicGuard children={<AuthLayout />} />,
        children: [
          Auth.Router
        ]
      },
      {
        element: <PrivateGuard children={<MasterLayout />} />,
        children: [
          ...modulesLevel.map(x => x.Router),
        ]
      },
      MetronicRoute
    ]
  }
], {
  basename: process.env.PUBLIC_URL
})

const routerLevel1 = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RootBoundary />,
    children: [
      {
        path: '/',
        element: <PrivateGuard children={<MasterLayout />} />,
        children: []
      },
      {
        element: <PublicGuard children={<AuthLayout />} />,
        children: [
          Auth.Router
        ]
      },
      {
        element: <PrivateGuard children={<MasterLayout />} />,
        children: [
          ...modulesLevel1.map(x => x.Router),
        ]
      },
      MetronicRoute
    ]
  }
], {
  basename: process.env.PUBLIC_URL
})


const Router = ({ role }: any) => (
  role > 0 ? (
    <RouterProvider
    router={router}
    fallbackElement={<Loading />}
  />
  ) : role === 0 ? (
    <RouterProvider
      router={routerLevel}
      fallbackElement={<Loading />}
    />
    ) : (
      <RouterProvider
        router={routerLevel1}
        fallbackElement={<Loading />}
      />
  )
)

export default Router;