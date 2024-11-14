
import { Base } from "@/core/models/Base";

export enum BroadcastToEnum {
    players = 'players',
    table = 'table'
}

export const BroadcastToList = [
    {
        label: 'All players',
        value: BroadcastToEnum.players
    },
    {
        label: 'Table',
        value: BroadcastToEnum.table
    }
]

export const ChannelVariation = [
    {
        label: 'Texas Hold’em',
        value: 'Texas Hold’em'
    },
    {
        label: 'Omaha',
        value: 'Omaha'
    },
    {
        label: 'Omaha Hi-Lo',
        value: 'OmahaHiLo'
    }
];

export const ChipsType = [
    {
        label: 'Real Money',
        value: "true"
    },
    {
        label: 'Play Money',
        value: "false"
    }
];
export class BroadcastToGame extends Base<BroadcastToGame>() {

}