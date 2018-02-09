Core.extend("fb", function (core) {
        var init = function () {
        };
        
        var login = function () {
            CordovaFacebook.login({
               permissions: ['email'],
               onSuccess: onLogin,
               onFailure: onFailure
            });
        };
        
        var logout = function () {
            CordovaFacebook.logout({
               onSuccess: onLogout
            });
        };
        
        var onLogin = function(result) {
            if(result.declined.length > 0) {
               alert("The User declined something!");
            }
         } ;
        
        
        var onLogout = function() {
            alert("The user is now logged out");
         };
         
        var onSuccess = function(result) {
            if(result.declined.length > 0) {
               alert("The User declined something!");
            }
         } ;
        
        var onFailure = function(result) {
            if(result.cancelled) {
               alert("The user doesn't like my app");
            } else if(result.error) {
               alert("There was an error:" + result.errorLocalized);
            }
         }

	return {
            init : init,
            login : login,
            logout : logout
        };
});