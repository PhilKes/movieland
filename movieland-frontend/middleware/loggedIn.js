import jwt_decode from "jwt-decode";

export default ({$events,$auth,from,route,redirect,app}) => {
  if(process.server){
    return
  }
  console.log("route",from)

  if (!$auth.loggedIn) {
    $events.$emit('showLogin',route.path);
    return redirect(from.path)
  }
  let userInfo = jwt_decode($auth.getToken('local'));
  console.log("checkUser",userInfo)
  if (userInfo.authorities){
    if(userInfo.authorities.some(auth=> auth.authority === 'ROLE_ADMIN')=== false)
      return redirect('/');
  }else{
    return redirect('/');
  }
}
