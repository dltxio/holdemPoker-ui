import { Base } from "@/core/models/Base";

export class BalanceSheetForDashboard extends Base<BalanceSheetForDashboard>() {
  chipsPulledSubAgentByAdminRakelInPending: number;
  chipsPulledSubAgentByAdminRakeInApproved: number;
  chipsPulledSubAgentByAdminRakeApproved: number;
  chipsPulledSubAgentByAdminRealInPending: number;
  chipsPulledSubAgentByAdminRealInApproved: number;
  chipsPulledSubAgentByAdminRealApproved: number;
  totalTranferToPlayerByAdmin: number;
  totalOnlineChipsAdded: number;
  totalTranferToPlayerByAgent: number;
  totalTranferToPlayerBySubagent: number;
  totalPlayerScratchCardAmount: number;
  totalPlayerCashoutSuccessToAdmin: number;
  totalPlayerCashoutAmtPending: number;
  totalRakeGeneratedByAffiliate: number;
  totalFundTranferredToAgent: number;
  totalTransferToSubAgentByAgent: number;
  playerPendingCashoutToAgent: number;
  totalPlayerSucessCashoutsToAgent: number;
  totalSubAgentRealCashoutSucess: number;
  subAgentPendingRealCashoutToAgent: number;
  playerPendingCashoutToSubAgent: number;
  totalRakeGeneratedBySubaff: number;
  totalRakeGeneratedByAgent: number;
  totalRakeGeneratedBySubagent: number;
  totalRakeGeneratedByAdmin: number;
  totalPlayerRakeBack: number;
  totalPlayerSucessCashoutsToSubagent: number;
  leaderboardWinning: number;
  totalPromotionalChips: number;
  instantBonusAmountGenerated: number;
  lockedBonusReleased: number;
  totalPlayerRealChipsAvailable: number;
  playerTotalChipsOnTable: number;
  totalPotAmountOnTable: number;
  totalRoundBetAmountInGame: number;
  totalRakeAvailableAffiliate: number;
  totalRakeAvailableSubAffiliate: number;
  totalRakeAvailableAgent: number;
  subAgentPendingRakeCashoutToAgent: number;
  totalRakeAvailablesSubAgent: number;
  playerCashoutSuccessNetAmtToAdmin: number;
  affCashoutSuccessNetAmtToAdmin: number;
  totalAffCashoutRakeAmtPending: number;
  subAffCashoutSuccessNetAmtToAdmin: number;
  totalSubaffCashoutRakeAmtPending: number;
  agentCashoutRakeSuccessNetAmtToAdmin: number;
  totalAgentCashoutRakeAmtPending: number;
  totalAgentCashoutRealAmtPending: number;
  agentCashoutRealSuccessNetAmtToAdmin: number;
  totalPlayerInstantChipsAvailable: number;
  instantChipsPulled: number;
  totalAgentCashoutRealSuccessToAdmin: number;

  totalSubAgentRakeCashoutSucess: number;
  instantBonusReleased: number;
  lockedBonusAmountGenerated: number;
  totalTds: number;
  totalRakeGeneratedByPlayers: number;
  totalGST: number;
  playerTotalRakebackReleased: number;
  playerTotalInstantChipsOnTable: number;
  playerCashoutSuccessTdsAmtToAdmin: number;
  playerCashoutSuccessProcessingFeesToAdmin: number;
  agentCashoutRealSuccessTdsAmtToAdmin: number;
  agentCashoutRealSuccessProcessingFeesToAdmin: number;
  totalAgentCashoutRakeSuccessToAdmin: number;
  agentCashoutRakeSuccessTdsAmtToAdmin: number;
  agentCashoutRakeSuccessProcessingFeesToAdmin: number;
  totalSubAffCashoutSuccessToAdmin: number;
  subAffCashoutSuccessTdsAmtToAdmin: number;
  subAffCashoutSuccessProcessingFeesToAdmin: number;
  totalRealAgentCashoutInApproved: number;
  agentRealCashoutNetAmtInApproved: number;
  affRakeCashoutTdsAmtInApproved: number;
  playerCashoutNetAmtPending: number;
  playerCashoutTdsAmtPending: number;
  playerCashoutProcessingFeesAmtPending: number;
  agentCashoutRealNetAmtPending: number;
  agentCashoutRealTdsAmtPending: number;
  totalAgentCashoutRealProcessingFeesAmtPending: number;
  agentCashoutRakeNetAmtPending: number;
  agentCashoutRakeTdsAmtPending: number;
  totalAgentCashoutRakeProcessingFeesAmtPending: number;
  affCashoutRakeNetAmtPending: number;
  affCashoutRakeTdsAmtPending: number;
  totalAffCashoutRakeProcessingFeesAmtPending: number;
  subaffCashoutRakeNetAmtPending: number;
  subaffCashoutRakeTdsAmtPending: number;
  totalsubAffCashoutRakeProcessingFeesAmtPending: number;
  normalGauranteedWinnings: number;
  totalReentryFees: number;
  totalReentryHouseFees: number;
  totalReentryHouseFeesNon: number;
  totalHouseFeesSitNGo: number;
  rakeToAdmin: number;
  rakeFrom1stLine: number;
  rakeFrom2ndLine: number;
  rakeToAdminReconcile: number;
  rakeTo1stLineReject: number;
  rakeTo1stLineApproved: number;
  rakeTo2ndLineReject:number;
  rakeTo2ndLineApproved:number;
  get totalSubAgentCashoutRake() {
    return this.chipsPulledSubAgentByAdminRakelInPending + this.chipsPulledSubAgentByAdminRakeInApproved + this.chipsPulledSubAgentByAdminRakeApproved;
  }
  get totalCashoutChipsSubAgent() {
    return this.chipsPulledSubAgentByAdminRealInPending + this.chipsPulledSubAgentByAdminRealInApproved + this.chipsPulledSubAgentByAdminRealApproved;
  }
  // player chips available
  // changes before adding scratch card amount
  // this.totalPlayerChipsAvailable = ((((((this.totalTranferToPlayerByAdmin + this.totalOnlineChipsAdded + this.totalTranferToPlayerByAgent + this.totalTranferToPlayerBySubagent /*+ this.leaderboardWinning*/) - (this.totalPlayerCashoutSuccessToAdmin + this.totalPlayerCashoutAmtPending)) - (this.totalRakeGeneratedByAffiliate + this.totalRakeGeneratedBySubaff + this.totalRakeGeneratedByAgent + this.totalRakeGeneratedBySubagent + this.totalRakeGeneratedByAdmin + this.totalPlayerRakeBack + this.totalGST)) + this.totalPlayerRakeBack)) - (this.totalPlayerSucessCashoutsToAgent + this.playerPendingCashoutToAgent + this.playerPendingCashoutToSubAgent + this.totalPlayerSucessCashoutsToSubagent)) + this.leaderboardWinning;
  // changes ends
  get totalPlayerChipsAvailable() {
    return ((((((this.totalTranferToPlayerByAdmin + this.totalOnlineChipsAdded + this.totalTranferToPlayerByAgent + this.totalTranferToPlayerBySubagent + this.totalPlayerScratchCardAmount) - (this.totalPlayerCashoutSuccessToAdmin + this.totalPlayerCashoutAmtPending)) - (this.totalRakeGeneratedByAffiliate + this.totalRakeGeneratedBySubaff + this.totalRakeGeneratedByAgent + this.totalRakeGeneratedBySubagent + this.totalPlayerRakeBack)) + this.totalPlayerRakeBack)) - (this.totalPlayerSucessCashoutsToAgent + this.playerPendingCashoutToAgent + this.playerPendingCashoutToSubAgent + this.totalPlayerSucessCashoutsToSubagent)) + this.leaderboardWinning;
  }

  // agent chips available
  get agentChipsAvailabe() {
    return ((((this.totalFundTranferredToAgent - (this.totalTranferToPlayerByAgent + this.totalTransferToSubAgentByAgent))) + (this.playerPendingCashoutToAgent + this.totalPlayerSucessCashoutsToAgent  /*this.subAgentPendingRakeCashoutToAgent + this.totalSubAgentRakeCashoutSucess*/)) - (this.totalAgentCashoutRealSuccessToAdmin + this.totalAgentCashoutRealAmtPending)) + (this.totalSubAgentRealCashoutSucess + this.subAgentPendingRealCashoutToAgent);
  }
  // sub agent chips available
  get subAgentChipsAvailable() {
    return ((((this.totalTransferToSubAgentByAgent) - (this.totalSubAgentRealCashoutSucess + this.subAgentPendingRealCashoutToAgent)) - this.totalTranferToPlayerBySubagent) + (this.playerPendingCashoutToSubAgent + this.totalPlayerSucessCashoutsToSubagent)) - this.totalCashoutChipsSubAgent;
  }
  // total chips given
  // previous changes
  // this.totalChipsGiven = this.leaderboardWinning + this.totalTranferToPlayerByAdmin + this.totalFundTranferredToAgent + this.totalOnlineChipsAdded + this.totalPromotionalChips + this.instantBonusAmountGenerated + this.lockedBonusReleased;

  // new changes 
  get totalChipsGiven () {
    console.log(this.leaderboardWinning , this.totalTranferToPlayerByAdmin , this.totalFundTranferredToAgent , this.totalOnlineChipsAdded , this.totalPromotionalChips , this.instantBonusAmountGenerated , this.lockedBonusReleased , this.totalPlayerScratchCardAmount);
    return this.leaderboardWinning + this.totalTranferToPlayerByAdmin + this.totalFundTranferredToAgent + this.totalOnlineChipsAdded + this.totalPromotionalChips + this.instantBonusAmountGenerated + this.lockedBonusReleased + this.totalPlayerScratchCardAmount;
  }
  // total available chips
  // changes before aading player actual chips.
  // this.totalAvailableChips = (((this.agentChipsAvailabe + this.subAgentChipsAvailable + this.totalPlayerChipsAvailable + this.totalPromotionalChips+this.instantBonusAmountGenerated + this.lockedBonusReleased) - (this.totalPlayerInstantChipsAvailable))) - this.instantChipsPulled;
  // changes end
  // previous changes with promotional chips
  // this.totalAvailableChips = (this.agentChipsAvailabe + this.subAgentChipsAvailable /*+ this.totalPlayerChipsAvailable*/ + this.totalPlayerRealChipsAvailable + this.totalPromotionalChips + this.playerTotalChipsOnTable/*+ this.instantBonusAmountGenerated + this.lockedBonusReleased*/) /*- (this.totalPlayerInstantChipsAvailable))) - this.instantChipsPulled*/;
  // changes end
  get totalAvailableChips() {
    return (this.agentChipsAvailabe + this.subAgentChipsAvailable /*+ this.totalPlayerChipsAvailable*/ + this.totalPlayerRealChipsAvailable + /*this.totalPromotionalChips +*/ this.playerTotalChipsOnTable/*+ this.instantBonusAmountGenerated + this.lockedBonusReleased*/ + this.totalPotAmountOnTable + this.totalRoundBetAmountInGame) /*- (this.totalPlayerInstantChipsAvailable))) - this.instantChipsPulled*/;
  }
  // total rake liability
  get totalRakeLiability() {
    return this.totalRakeAvailableAffiliate + this.totalRakeAvailableSubAffiliate + (this.totalRakeAvailableAgent + this.subAgentPendingRakeCashoutToAgent) + this.totalRakeAvailablesSubAgent;
  }
  // total cashout player 
  get totalCashoutPlayer() {
    return (this.playerCashoutSuccessNetAmtToAdmin || 0) + (this.totalPlayerCashoutAmtPending || 0);
    // this.totalCashoutPlayer = (this.totalPlayerCashoutSuccessToAdmin || 0) + (this.totalPlayerCashoutAmtPending || 0);
  }
  // Total admin rake
  get totalAdminRake() {
    return this.totalRakeGeneratedByAdmin;
  }

  // total rake cashout aff
  get totalCashoutRakeAff() {
    const total = this.affCashoutSuccessNetAmtToAdmin + this.totalAffCashoutRakeAmtPending + this.subAffCashoutSuccessNetAmtToAdmin + this.totalSubaffCashoutRakeAmtPending;
    return isNaN(total) ? 0 : total;
  }

  // total agent cashout rake
  get totalAgentCashoutRake() {
    return this.agentCashoutRakeSuccessNetAmtToAdmin + this.totalAgentCashoutRakeAmtPending;
  }
  // total cashout chips agent
  get totalCashoutChipsAgent() {
    return this.totalAgentCashoutRealAmtPending + this.agentCashoutRealSuccessNetAmtToAdmin;
  }

  // total available instant chips
  get totalInstantAvailable() {
    return this.totalPlayerInstantChipsAvailable;
  }

  // total aggregate chips calculation i.e to be subtracted from total chips given
  // this.totalAggregateChips = parseFloat((this.totalAvailableChips + this.totalRakeLiability + this.totalCashoutPlayer + this.totalAdminRake + this.totalCashoutRakeAff + this.totalGST + this.totalTds +this.totalAgentCashoutRake + this.totalCashoutChipsAgent + this.totalInstantAvailable + this.totalCashoutChipsSubAgent + this.instantChipsPulled).toFixed(2));
  get totalAggregateChips () {
    console.log(this.totalAvailableChips , this.totalRakeLiability , this.totalCashoutPlayer , this.totalAdminRake , this.totalCashoutRakeAff , this.totalAgentCashoutRake , this.totalCashoutChipsAgent , this.totalInstantAvailable , this.totalCashoutChipsSubAgent , this.instantChipsPulled , this.totalSubAgentCashoutRake)
    return parseFloat((this.totalAvailableChips + this.totalRakeLiability + this.totalCashoutPlayer  + this.totalCashoutRakeAff + this.totalAgentCashoutRake + this.totalCashoutChipsAgent + this.totalInstantAvailable + this.totalCashoutChipsSubAgent + this.instantChipsPulled + this.totalSubAgentCashoutRake).toFixed(2));
  }
  // net balance calculation
  get netBalance() {
    return (this.totalChipsGiven - (isNaN(this.totalAggregateChips) ? 0 : this.totalAggregateChips)) - this.rakeToAdmin - (this.rakeFrom1stLine - this.rakeTo1stLineReject- this.rakeTo1stLineApproved) - (this.rakeFrom2ndLine - this.rakeTo2ndLineReject - this.rakeTo2ndLineApproved) - (this.rakeTo1stLineReject + this.rakeTo2ndLineReject);
  }

  get totalPlayerChipsReal() {
    return ((this.totalPlayerChipsAvailable + this.lockedBonusReleased + (this.instantBonusAmountGenerated - this.totalPlayerInstantChipsAvailable)) - this.instantChipsPulled).toFixed(2)
  }

  get totalAmountPotBetOnTable() {
    return this.totalPotAmountOnTable + this.totalRoundBetAmountInGame
  }

  get totalAgentAvailableRake() {
    return this.totalRakeAvailableAgent + this.subAgentPendingRakeCashoutToAgent
  }
}