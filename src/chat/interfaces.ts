export interface IMessage {
  message: string;
  timestamp: number;
  user: IUser;
  isStatusMessage: boolean;
}

export interface IUser {
  userId?: string;
  nickname: string;
}
