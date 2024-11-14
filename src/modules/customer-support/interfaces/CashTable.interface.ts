
export interface GameInfo {
    TableName?: string;
    GameVariation?: string;
    ChipsType?: string;
    BuyIn?: string;
    Stakes?: string;
    Rake?: Date;
    CapAmount?: number;
    MaxPlayers?: number;
    Straddle?: string;
    TurnTime?: string;
}

export interface Rake {
    rakePercentTwo?: number;
    rakePercentThreeFour?: number;
    rakePercentMoreThanFive?: number;
    capTwo?: number;
    capThreeFour?: number;
    capMoreThanFive?: number;
    minStake?: number;
    maxStake?: number;
}

export interface ICashTable {
    gameInfo: GameInfo;
    rake: Rake;
    _id?: string;
    isRealMoney?: boolean;
    channelName?: string;
    turnTime?: number;
    isPotLimit?: boolean;
    maxPlayers?: number;
    smallBlind?: number;
    bigBlind?: number;
    isStraddleEnable?: boolean;
    minBuyIn?: number;
    maxBuyIn?: number;
    numberOfRebuyAllowed?: number;
    hourLimitForRebuy?: number;
    rebuyHourFactor?: number;
    gameInterval?: number;
    createdBy?: string;
    channelVariation?: string;
    minPlayers?: number;
    isPrivateTabel?: boolean;
    favourite?: boolean;
    isRunItTwice?: boolean;
    isActive?: boolean;
    channelType?: string;
    totalGame?: number;
    totalPot?: number;
    avgPot?: number;
    totalPlayer?: number;
    totalFlopPlayer?: number;
    avgFlopPercent?: number;
    totalStack?: number;
    blindMissed?: number;
    gameInfoString?: string;
    createdAt?: Date;
    updatedAt?: Date;
}


