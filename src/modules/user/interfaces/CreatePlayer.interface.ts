import { IRoleParam } from '@/interfaces/global.interface';
import { IChipsManagement } from './CreateAgent.interface';

export interface ICreatePlayerParam {
  affiliateId?: string;
  createdBy?: string;
  emailId?: string;
  firstName?: string;
  isParent?: string;
  isParentUserName?: string;
  lastName?: string;
  loggedInUser?: string;
  mobileNumber?: number;
  parentUserRole?: IRoleParam;
  rakeBack?: number;
  status?: string;
  userName?: string;
  sponserId?: string;
}

export interface IPlayerDetailParam {
  isOrganic?: string;
  limit?: number;
  skip?: number;
  _id?: string;
}

export interface IAddress {
  address1?: string;
  address2?: string;
  city?: string;
  pincode?: string;
  state?: string;
}

export interface IBuildAccess {
  androidApp?: boolean;
  browser?: boolean;
  iosApp?: boolean;
  mac?: boolean;
  website?: boolean;
  windows?: boolean;
}

export interface IPlayerParentHistoryData {
  createParentHistory?: boolean;
}

export interface IPrefrences {
  autoBuyIn?: string;
  autoBuyInAmountInPercent?: string;
  cardColor?: boolean;
  tableLayout?: string;
}

export interface ISettings {
  avatarId: number;
  dealerChat: boolean;
  muteGameSound: boolean;
  playerChat: boolean;
  runItTwice: boolean;
  seatPrefrence: number;
  seatPrefrenceSix: number;
  seatPrefrenceTwo: number;
  tableColor: number;
}

export interface IStatistics {
  bestHand: string;
  countPointsForBonus: number;
  countPointsToChips: number;
  handsLost: number;
  handsPlayedPM: number;
  handsPlayedRM: number;
  handsWonPM: number;
  handsWonRM: number;
  megaPointLevel: number;
  megaPoints: number;
}

export interface IUpdatePlayerParam {
  address?: IAddress;
  anouncement?: any[];
  buildAccess?: IBuildAccess;
  chipsManagement?: IChipsManagement;
  claimedBonusAmount?: number;
  claimedInstantBonus?: number;
  createdAt?: number;
  dailyBonusCollectionTime?: number;
  dateOfBirth?: string | null;
  deviceType?: string;
  emailId?: string;
  emailVerificationToken?: string;
  facebookObject?: string;
  firstName?: string;
  freeChips?: number;
  gender?: string;
  googleObject?: string;
  hours?: number;
  instantBonusAmount?: number;
  ipV4Address?: string;
  ipV6Address?: string;
  isBlocked?: boolean;
  isBot?: boolean;
  isEmailVerificationTokenExpire?: string;
  isEmailVerified?: boolean;
  isMobileNumberVerified?: boolean;
  isMuckHand?: boolean;
  isNewUser?: boolean;
  isOrganic?: boolean;
  isParent?: string;
  isParentUserName?: string;
  isResetPasswordTokenExpire?: string;
  lastActiveTime?: string;
  lastLogin?: number;
  lastName?: string;
  letter?: any[];
  loggedInUser?: string;
  loginMode?: string;
  loyalityRakeLevel?: number;
  mobileNumber?: number;
  mobileNumberNew?: number;
  name?: string;
  noOfDays?: number;
  offers?: any[];
  parent?: string;
  parentType?: string;
  password?: string;
  passwordResetToken?: string;
  playerId?: string;
  playerParentHistoryData?: IPlayerParentHistoryData;
  prefrences?: IPrefrences;
  previousBonusCollectedTime?: number;
  profileImage?: string;
  profilelastUpdated?: string;
  rakeBack?: number;
  realChips?: number;
  reasonForBan?: string;
  settings?: ISettings;
  statistics?: IStatistics;
  status?: string;
  totalAvailableChips?: number;
  tournaments?: any[];
  unclaimedBonusAmount?: number;
  userName?: string;
  userRole?: IRoleParam;
  _id?: string;
  sponserId?: string;
}