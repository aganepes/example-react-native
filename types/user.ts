export type TUser = {
  id?:string,
  name: string,
  lastname:string,
  username:string,
  surename?:string,
  pasportSerial?:string,
  password:string,
  pushToken?:string
}

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterData = Omit<TUser, 'id'>;