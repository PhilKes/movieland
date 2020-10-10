// middleware/is-admin.js
import jwt_decode from "jwt-decode";
import Utils from "../service/Utils";

export default ({$auth,$events, route, redirect,from}) => {
  if(process.server){
    return
  }
  // Check if user is connected first
  if (!$auth.loggedIn) {
    $events.$emit('showLogin',route.path);
    return redirect(from.path)
  }
  let userInfo = jwt_decode(Utils.getPureToken($auth.getToken('local')));
  if (userInfo.authorities){
    if(userInfo.authorities.some(auth=> auth.authority === 'ROLE_ADMIN')=== false) {
      return redirect(from.path);
    }
  }else{

  }
}
