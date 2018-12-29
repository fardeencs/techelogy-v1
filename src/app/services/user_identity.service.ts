import { SESSION } from '../modules/constants';
import { TokenModel } from '../models/token.model';
import { UserModel } from '../models/user/user.model';

export class UserIdentityService {
  constructor() {

  }

  /**
   * Set Token
   * @param data
   */
  public static setCredentials(data: TokenModel) {
    if (data.sessionId) {
      this.setToken(data.sessionId);
    }
    if (data.userInfo) {
      this.setProfile(data.userInfo);
    }
  }

  /**
   * Set User Profile
   * @param token
   */
  public static setToken(token: string = '') {
    sessionStorage.setItem(SESSION.TOKEN_KEYWORD, token);
  }

  /**
   * Set User Profile
   * @param data
   */
  public static setProfile(data: UserModel) {
    if (data.firstname !== '') {
      const obj = UserModel.toProfileModel(data);
      sessionStorage.setItem(SESSION.PROFILE_KEYWORD, JSON.stringify(obj));
    }
  }

  /**
   *
   * @returns {any}
   */
  public static getProfile() {
    let result: any = '';
    if (sessionStorage.length) {
      const session = sessionStorage;
      if (session[SESSION.PROFILE_KEYWORD]) {
        result = JSON.parse(session[SESSION.PROFILE_KEYWORD]);
      }
    }
    return result;
  }

  /**
   * Clear login data
   */
  public static clearCredentials() {
    sessionStorage.clear();
  }


  /**
   *
   * @returns {boolean}
   */
  public static isLoggedIn() {
    return this.getToken() ? true : false;
  }

  /**
   *
   * @returns {any}
   */
  public static getToken() {
    let result: any = '';
    if (sessionStorage.length) {
      const token = sessionStorage.getItem(SESSION.TOKEN_KEYWORD);
      if (token) {
        result = token;
      }
    }
    return result;
  }
}
