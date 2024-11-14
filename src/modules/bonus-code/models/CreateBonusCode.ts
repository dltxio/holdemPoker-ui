export enum BonusCodeActionEnum {
    create = 'create',
    view = 'view',
    edit = 'edit'
}
export enum BonusCategoriesEnum {
    instantBonus = 'instantBonus',
    lockedBonus = 'lockedBonus',
    both = 'both',
    leaderboardEntry = 'leaderboardEntry'
}
export const BonusCategories = [
    {
        label: "Instant Bonus", value: BonusCategoriesEnum.instantBonus
    },
    {
        label: "Locked Bonus", value: BonusCategoriesEnum.lockedBonus
    },
    {
        label: "Instant and Locked Bonus", value: BonusCategoriesEnum.both
    },
    {
        label: "Leaderboard Entry", value: BonusCategoriesEnum.leaderboardEntry
    }
];

export enum LoyalityvaluesEnum {
    Bronze = '1',
    Chrome = '2',
    Silver = '3',
    Gold = '4',
    Diamond = '5',
    Platinum = '6'

}

export const Loyalityvalues = [
    {
        label: "Bronze", value: LoyalityvaluesEnum.Bronze
    },
    {
        label: "Chrome", value: LoyalityvaluesEnum.Chrome
    },
    {
        label: "Silver", value: LoyalityvaluesEnum.Silver
    },
    {
        label: "Gold", value: LoyalityvaluesEnum.Gold
    },
    {
        label: "Diamond", value: LoyalityvaluesEnum.Diamond
    },
    {
        label: "Platinum", value: LoyalityvaluesEnum.Platinum
    }
];

export enum BonusCodeTypesEnum {
    signUp = 'signUp',
    oneTime = 'oneTime',
    recurring = 'recurring'
}
export const BonusCodeTypes = [
    {
        label: "Sign Up Bonus", value: BonusCodeTypesEnum.signUp
    },
    {
        label: "One Time Bonus", value: BonusCodeTypesEnum.oneTime
    },
    {
        label: "Recurring Bonus", value: BonusCodeTypesEnum.recurring
    }
]