/**
 * main configuration file
 */
const config = {
   production :{
       SECRET : 'SUPERSECRETPASSWORD123',
       DATABASE : 'mongodb+srv://Prakask:Prakash@cluster0-qih3q.mongodb.net/messanger?retryWrites=true&w=majority'
   },
   default : {
       SECRET : 'SUPERSECRETPASSWORD123',
       DATABASE : 'mongodb+srv://Prakask:Prakash@cluster0-qih3q.mongodb.net/messanger?retryWrites=true&w=majority'
   }
}

exports.get = function get(env){
   return config[env] || config.default
}

//mongodb://rao:raoinfotech@54.185.16.135:27017/meme-generator"
//http://192.168.42.135:3003/api/getUsers?limit=0&skip=0&order=desc
//https://secret-lowlands-34201.herokuapp.com/api/getUsers?limit=0&skip=0&order=desc