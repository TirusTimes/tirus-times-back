export enum Status {
  Open = 'OPEN',
  Started = 'STARTED',
  Finished = 'FINISHED',
  Evaluate = 'EVALUATE',
}

export interface IUser {
  username: string
  firstname: string
  lastname: string
  email: string
  password: string
  position: string
  age: number
  gender: string
  teamId: number
}

export interface IGroup {
  name: string
  adminID: number
}
export interface IMatch {
  location: string
  date: Date
  time: string
  playerLimit: number
  players: IUser[]
  adminID: number
  status: Status
  groupId: number
}
export type IMatchUpdate = Omit<IMatch, 'status' | 'players'>;

export interface IAvaliation {
  userId: string
  avaliation: number
}
