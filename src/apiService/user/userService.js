import sendRequest from "../core/sendRequest";

var userService = {
    UpdateUser: async function(oldUserInfo, newUserInfo) {
        console.log(oldUserInfo, newUserInfo);
        let response = await sendRequest(
            '/UpdateUser',
            [oldUserInfo, newUserInfo],
            'POST'
        );

        return response;
    },
    
    DeleteUser: async function(user) {
        console.log(user);
        let response = await sendRequest(
            '/DeleteUser',
            user,
            'POST'
        );

        return response;
    },
    
    AddUser: async function(user) {
        console.log(user);        
        let response = await sendRequest(
            '/AddUser',
            user,
            'POST'
        );

        return response;
    },
    
    GetUserList: async function() {
        let response = await sendRequest(
            '/GetAllUsers',
            {},
            'GET'
        );  
        
        return response;
    },

    CheckLogin: async function(user) {
        let response = await sendRequest(
            '/login',
            user,
            'POST'
        );

        return response;
    },

    GetLoginUser: async function() {
        let response = await sendRequest(
            '/getLoginUser',
            {},
            'GET'
        );

        return response;
    }
}


export default userService