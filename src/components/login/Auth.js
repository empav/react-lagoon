import { loginRedux, logoutRedux } from '../user/UserActions';
import store from '../../store/store';

class Auth {
  static login(credentials) {
    return store.dispatch(loginRedux(credentials));
  }
  static logout() {
    return store.dispatch(logoutRedux());
  }
}

export default Auth;
