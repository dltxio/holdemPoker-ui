import { HomeFilled, SettingFilled, DashboardFilled } from '@ant-design/icons';

export const NavItems = [
  {
    name: 'Dashboard',
    code: 1400,
    iconClass: 'bi-house-door',
    status: true,
    route: '/dashboard',
    children: []
  },
  {
    name: 'Accounts',
    code: 1401,
    iconClass: 'bi-house-door',
    status: true,
    children: [
      {
        name: 'Account Details',
        code: 1402,
        route: '/accountDetails',
        iconClass: 'bi-puzzle',
        status: true,
      },
      {
        name: 'Balance Sheet',
        code: 1403,
        route: '/balanceSheet',
        iconClass: 'bi-puzzle',
        status: true,
      }
    ]
  },
  {
    name: 'Activity',
    code: 2201,
    iconClass: 'bi-house-door',
    status: true,
    children: [
      {
        name: 'Activity Details',
        code: 2202,
        route: '/activityDetails',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Game Management',
    code: 101,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Table View & Creation',
        code: 102,
        route: '/listTable',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Spam Management',
    code: 502,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Spam Words Addition',
        code: 501,
        route: '/spamWords',
        iconClass: 'bi-house-door',
        status: true
      }
    ]
  },
  {
    name: 'Bonus Code Management',
    code: 401,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Generate Bonus Code',
        code: 402,
        route: '/generateBonusCode',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Bonus Code List',
        code: 403,
        route: '/listBonusDeposit',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Promotional Bonus ',
        code: 404,
        route: '/promotionalBonusCode',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Bonus Chips Management',
    code: 810,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Bonus Transfer',
        code: 811,
        route: '/instantBonusTransfer',
        iconClass: 'bi-puzzle',
        status: true
      }, {
        name: 'Bonus Transfer History',
        code: 812,
        route: '/instantBonusHistory',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Scratch Card Management',
    code: 701,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Generate Scratch Card',
        code: 702,
        route: '/generateCardAffiliate',
        iconClass: 'bi-puzzle',
        status: true,
        children: [
          {
            name: 'Agent/Sub-Agent',
            code: 7021,
            route: '/generateCardAffiliate',
            iconClass: 'bi-puzzle',
            status: true
          },
          {
            name: 'Emergency',
            code: 7022,
            route: '/generateCardEmergency',
            iconClass: 'bi-puzzle',
            status: true
          },
          {
            name: 'Promotions',
            code: 7023,
            route: '/generateCardPromotions',
            iconClass: 'bi-puzzle',
            status: true
          },
          {
            name: 'High-Rollers',
            code: 7024,
            route: '/generateCardHighRollers',
            iconClass: 'bi-puzzle',
            status: true
          }
        ]
      },
      {
        name: 'Approve Scratch Card',
        code: 703,
        route: '/approveScratchCard',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Scratch Card History',
        code: 704,
        route: '/scratchCardHistory',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Loyalty Points Management',
    code: 801,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Set Loyalty Points by Level',
        code: 802,
        route: '/createLoyaltyPoints',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'List Loyalty Points',
        code: 803,
        route: '/listLoyaltyPoints',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Leader Board Management',
    code: 804,
    iconClass: 'bi-award',
    status: true,
    children: [
      {
        name: 'Create Leaderboard',
        code: 805,
        route: '/createLeaderboard',
        iconClass: 'bi-award',
        status: true
      },
      {
        name: 'List Leaderboard ',
        code: 806,
        route: '/viewLeaderboard',
        iconClass: 'bi-award',
        status: true
      },
      {
        name: 'Current Leaderboard Participants',
        code: 807,
        route: '/currentLeaderboardParticipants',
        iconClass: 'bi-award',
        status: true
      },
      {
        name: "Direct Leaderboard Entry",
        code: 808,
        route: '/directEntry',
        iconClass: 'bi-award',
        status: true
      },
      {
        name: "Direct Entry History",
        code: 809,
        route: '/directEntryHistory',
        iconClass: 'bi-award',
        status: true
      }
    ]
  },
  {
    name: 'Leaderboard Set Management',
    code: 8100,
    iconClass: 'bi-award',
    status: true,
    children: [
      {
        name: 'Create Leaderboard Set',
        code: 8110,
        route: '/createLeaderboardCategory',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'List Leaderboard Set',
        code: 8120,
        route: '/listLeaderboardCategory',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Leaderboard Reports',
    code: 1707,
    iconClass: 'bi-award',
    status: true,
    children: [
      {
        name: 'Leaderboard Report',
        code: 1708,
        route: '/LeaderboardReport',
        iconClass: 'bi-award',
        status: true
      },
      {
        name: 'Leaderboard Chart',
        code: 1709,
        route: '/leaderboardChart',
        iconClass: 'bi-bar-chart',
        status: true
      },
      {
        name: 'Detailed Leaderboard Report',
        code: 1710,
        route: 'leaderboardReport/detail/:id',
      },
    ]
  },
  {
    name: 'Chips Management',
    code: 1000,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Transfer To Player',
        code: 1001,
        route: '/transferFund',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Transfer To Agent',
        code: 1002,
        route: '/transferFundToAffiliate',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Transfer History Player',
        code: 1005,
        route: '/transferHistoryPlayer',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Transfer History Agent/Sub-Agent',
        code: 1006,
        route: '/transferHistoryAffiliate',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Transaction History Report',
    code: 1101,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'View Transaction History',
        code: 1102,
        route: '/transactionHistoryReport',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },

  {
    name: 'User Management',
    code: 1201,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Create user',
        code: 1202,
        route: '/createUser',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'List Users',
        code: 1203,
        route: '/listUsers',
        iconClass: 'bi-puzzle',
        status: true
      },
      // {
      //   name: 'Create Agent',
      //   code: 1204,
      //   route: '/createAffiliate',
      //   iconClass: 'bi-puzzle',
      //   status: true
      // },
      // {
      //   name: 'Create Sub-Agent',
      //   code: 1207,
      //   route: '/createSubAffiliateByAdmin',
      //   iconClass: 'bi-puzzle',
      //   status: true
      // },
      // {
      //   name: 'List Agent',
      //   code: 1205,
      //   route: '/listOfAffiliate',
      //   iconClass: 'bi-puzzle',
      //   status: true
      // },
      // {
      //   name: 'List Sub-Agent',
      //   code: 1209,
      //   route: '/listSubAffiliate',
      //   iconClass: 'bi-puzzle',
      //   status: true
      // },
      {
        name: 'Create Player',
        code: 1210,
        route: '/createPlayer',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'List Players',
        code: 1206,
        route: '/listPlayer',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Create Aff',
        code: 1211,
        route: '/createAff',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'List Aff',
        code: 1212,
        route: '/listAff',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Create Sub-Aff',
        code: 1213,
        route: '/createSubaff',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'List Sub-Aff',
        code: 1214,
        route: '/listSubaff',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Cashout Dashboard',
    code: 1301,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Pending Cashout Requests',
        code: 1303,
        route: '/pendingCashOut',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Cashout Payment',
        code: 1304,
        route: '/approveCashout',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Cashout History',
        code: 1305,
        route: '/cashoutHistory',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Rake Analytics',
    code: 1501,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Rake Commission Report',
        code: 1505,
        route: '/rakeReportCommission',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Daily Rake Commission Chart for the month',
        code: 1508,
        route: '/dailyRakeChart',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Rake Commission Summary by Date',
        code: 1502,
        route: '/rakeByDate',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Rake Commission Summary by Agent/Player',
        code: 1503,
        route: '/rakeByAffiliateOrPlayer',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Rake Commission Summary by Cash Table',
        code: 1506,
        route: '/rakeByCashTable',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Rake Commission Summary by Game Variants',
        code: 1510,
        route: '/gameVariantsRakeReport',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Rake Commission Chart by Time of day',
        code: 1509,
        route: '/rakeByTimeOfDay',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Rake Commission Summary Datewise',
        code: 1504,
        route: '/rakeDatewise',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Table Rake Commission Report',
        code: 1507,
        route: '/tableRakeReport',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Monthly Rake Report',
        code: 1511,
        route: '/RakeBackMonthlyReport',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Player Report Management',
    code: 1601,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Player Report',
        code: 1603,
        route: '/findPlayerReport',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Player Rake Chart',
        code: 1604,
        route: '/findPlayerChart',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Player Games Played Chart',
        code: 1605,
        route: '/findPlayerChartGamesPlayed',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Player Banned Report',
        code: 1606,
        route: '/findMonthlyPlayerBannedReport',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Player Chips Report',
        code: 1607,
        route: '/playerChipsReport',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Player Loyality Points Report',
        code: 1608,
        route: '/playerLoyalityPointsReport',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Player Bonus Report',
        code: 1609,
        route: '/playerBonusReport',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Player Info Report',
        code: 1610,
        route: '/playerInfoReport',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Player Parent History',
        code: 1611,
        route: '/playerParentHistory',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Player Locked Bonus Report',
        code: 1612,
        route: '/playerLockedBonus',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Locked Bonus Claimed History',
        code: 1613,
        route: '/lockedBonusClaimedHistory',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Player Hand History',
        code: 1614,
        route: '/playerHandHistory',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Chips Reports',
    code: 1701,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Daily Add Chips Report',
        code: 1703,
        route: '/dailyChipsReport',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Monthly Add Chips Report',
        code: 1704,
        route: '/monthlyChipsReport',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Daily Add Chips Chart',
        code: 1705,
        route: '/dailyChipsChart',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Monthly Bonus Chips Report',
        code: 1706,
        route: '/monthlyBonusChipsReport',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Customer Support Management',
    code: 1801,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Profile Details',
        code: 1803,
        route: '/profileDetailsPlayer',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Transaction History',
        code: 1805,
        route: '/transactionHistoryCustomerSupport',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Player Game History',
        code: 1807,
        route: '/playerGameHistoryCustomerSupport',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Player Loyality Points History',
        code: 1808,
        route: '/playerMagnetChipsHistoryCustomerSupport',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Player Info Report',
        code: 1809,
        route: '/playerInfoReportCustomerSupport',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Cashout Report',
    code: 2101,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Daily Cashout Report',
        code: 2103,
        route: '/dailyCashoutDataReport',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Monthly Cashout',
        code: 2104,
        route: '/monthlyCashoutDataReport',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Daily Cashout Chart',
        code: 2105,
        route: '/dailyCashoutChart',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Broadcast Management',
    code: 2301,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Broadcast to game',
        code: 2303,
        route: '/broadcastToGame',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Pull Chips',
    code: 3001,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Pull Chips Agent/Sub-Agent',
        code: 3002,
        route: '/pullChipsAffiliate',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Pull Chips Player',
        code: 3006,
        route: '/pullChipsPlayerByAdmin',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Pull Instant Chips Player',
        code: 3007,
        route: '/pullInstantChipsPlayerByAdmin',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Instant Chips Pull History',
        code: 3008,
        route: '/instantChipsPullHistory',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  }, {
    name: 'Rake Back Report',
    code: 4001,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Rakeback Player Report',
        code: 4002,
        route: '/rakeBackPlayerReport',
        iconClass: 'bi-puzzle',
        status: true
      },
    
      {
        name: 'Rake Commission Report',
        code: 4002,
        route: '/rakeReport',
        iconClass: 'icon-puzzle',
        status: true

      },
      {
          name: 'Rake History',
          code: 1505,
          route: '/rakeHistory',
          iconClass: 'icon-puzzle',
          status: true
      },
    ]
  },
  {
    name: 'Passbook',
    code: 5001,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Player Passbook',
        code: 5002,
        route: '/playerPassbook',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Chat Management',
    code: 8001,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Player Chat Management',
        code: 8002,
        route: '/playerChatManagement',
        iconClass: 'bi-puzzle',
        status: true
      },
      {
        name: 'Chat History',
        code: 8003,
        route: '/chatHistory',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Player Build Access Management',
    code: 2900,
    iconClass: 'bi-gear',
    status: true,
    children: [
      {
        name: 'Player Build Access',
        code: 2901,
        route: '/playerBuildAccess',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  },
  {
    name: 'Rakeback management',
    code: 2902,
    iconClass: 'icon-settings',
    status: true,
    children: [
      {
        name: 'Rakeback Config',
        code: 2903,
        route: '/rakebackConfig',
        iconClass: 'bi-puzzle',
        status: true
      }
    ]
  }
];

export const NavIcons: any = {
  'bi-house-door': HomeFilled,
  'bi-gear': SettingFilled,
  'icon-dashboard': DashboardFilled
};