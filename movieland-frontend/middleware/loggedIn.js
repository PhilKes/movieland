export default ({$events,$auth,from,route,redirect,app}) => {
  if(process.server){
    return
  }

  if (!$auth.loggedIn) {
    $events.$emit('showLogin',route.path);
    console.log("NOT LOGGED",from.path)
    return redirect(from.path)
  }
}
