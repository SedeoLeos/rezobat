const DEFAULT_ABILITYS = 'AUTHENTIFICATED';
export const VERIFIED_OTP = 'VERIFIED_OTP';
export const ACTIVE_USER = 'ACTIVE_USER';
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';

export enum AbilitysEnum {
  DEFAULT_ABILITYS = 'AUTHENTIFICATED',
  VERIFIED_OTP = 'VERIFIED_OTP',
  ACTIVE_USER = 'ACTIVE_USER',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  IS_REFRESH_KEY = 'isRefresh',
}
export interface UserI {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  isAdmin: string;
}
export class TokenI<T> {
  user: T;
  abilitys: string[];
  device_name: string;
}
export class TokenBuilder<T> {
  data: TokenI<T>;
  constructor() {
    this.data = new TokenI();
    this.data.abilitys = [DEFAULT_ABILITYS];
  }
  setUser(user: T) {
    this.data.user = user;
    return this;
  }
  setDeviceName(value: string) {
    this.data.device_name = value;
    return this;
  }
  addAbilitys(value: string) {
    if (!this.data.abilitys.includes(value)) this.data.abilitys.push(value);
    return this;
  }
  removeAbilitys(value: string) {
    const abilitys = this.data.abilitys.filter((ability) => ability != value);
    this.data.abilitys = abilitys;
    return this;
  }
  removeDefaultAbilitys() {
    return this.removeAbilitys(DEFAULT_ABILITYS);
  }
  builde() {
    this.data = JSON.parse(JSON.stringify(this.data));
    return this.data;
  }
}
