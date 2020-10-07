// middleware/is-admin.js
import jwt_decode from "jwt-decode";

export default ({$auth, store, route, redirect,from}) => {
  // Check if user is connected first
  console.log("user",$auth.user)
  if (!$auth.loggedIn) {
    return redirect('/login')
  }
  let userInfo = jwt_decode($auth.getToken('local'));
  console.log("checkUser",userInfo)
  if (userInfo.authorities){
    if(userInfo.authorities.some(auth=> auth.authority === 'ROLE_ADMIN')=== false)
      return redirect(from);
  }else{
    return redirect(from);
  }
}
