const ss= require('sessionstorage');

class Operations {
    constructor() {}

    CheckLogin(){
        console.log("checking login")

        var s =ss.setItem("test","just checking")
        console.log(s)
        
        var status = ss.getItem("login");
        console.log(status)
        return status
    }

    Login(username, password) {
        if(ss.getItem("login")){
            return "User has login";
        }
        else if(username =="admin" &&password =="888888"){
            ss.setItem("login",true);
            return "User login Success";
        }
        return "success";
      }
}

module.exports = Operations;

