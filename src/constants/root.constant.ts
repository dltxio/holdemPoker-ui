export const ROOT = {
  turnTimesList: [
    {
      key: 'standard', value: 30, label: 'Standard (30s)'
    },
    {
      key: 'medium', value: 20, label: 'Medium (20s)'
    },
    {
      key: 'turbo', value: 15, label: 'Turbo (15s)'
    },
    {
      key: 'hyTurbo', value: 10, label: 'Hyper-Turbo (10s)'
    },
  ],
  websiteLink: 'https://texashodl.net/',
  event: {
    cashGameTableChange: 'CASHGAMETABLECHANGE'
  },
  broadcast: {
    tableUpdate: 'tableUpdate',
    addTable: 'addTable',
    removeTable: 'removeTable'
  },
  employeeList: [
    {
      label: 'Director', value: 6
    },
    {
      label: 'General Manager', value: 5
    },
    {
      label: 'Service Delivery Manager', value: 4
    },
    {
      label: 'Team Leader', value: 3
    },
    {
      label: 'Senior Executive', value: 2
    },
    {
      label: 'Executive', value: 1
    }
  ],
  employeeStatus: [
    { 
      label: 'Active', value: 'Active'
    },
    { 
      label: 'Block', value: 'Block'
    }
  ],
  GoogleAuthenStatus: [
    // {
    //   label: '--Select Enable 2FA(google authenticator)--', value: ''
    // },
    { 
      label: 'true', value: 'true'
    },
    // { 
    //   label: 'false', value: 'false'
    // }
  ],
  bonusCodeTypes: [
    {
      name: 'Sign Up Bonus', type: 'signUp'
    },
    {
      name: 'One Time Bonus', type: 'oneTime'
    },
    {
      name: 'Recurring Bonus', type: 'recurring'
    },
  ],
  filterModuleSubAffiliate: [1208, 1209, 1007, 1301, 1302, 1303, 1305, 3008, 1213, 1214],
  filterModuleAffiliate: [2005, 1213, 1214],
  filterModuleNewAff: [701, 702, 704, 1000, 1001, 1007, 1005, 1006, 1101, 1102, 1208, 1209, 2001, 2003, 2004, 2005, 3001, 3008, 3010, 2101, 2103, 2104, 2105],
  filterModuleNewSubaff: [701, 702, 704, 1000, 1001, 1007, 1005, 1006, 1101, 1102, 1208, 1209, 1213, 1214, 2001, 2003, 2004, 2005, 3001, 3008, 3010, 2101, 2103, 2104, 2105],
  antiBankingTime: 900
}