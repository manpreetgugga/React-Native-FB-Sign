import React, { Component } from 'react';
import { View, Text, StyleSheet,Image,Button } from 'react-native';
import { LoginButton } from 'react-native-fbsdk';

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
} = FBSDK;

const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;


export default class App extends Component {

   state = {  
        name: '',
        email: '',
        profile : ''  
    }  


  _responseInfoCallback(error: ?Object, result: ?Object) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
     } else {
      alert('Success fetching data: ' + JSON.stringify(result));
     }
   }

  render() {
    const infoRequest = new GraphRequest('/me', 
      {
        parameters: {
         'fields': {
              'string' : 'email,name,picture.type(large)'
          }
        }
      },
     (err, res) => {
       this.setState({
                     name: res.name,
                     email: res.email,
                    profile : res.picture.data.url  
       });
      console.log(err, JSON.stringify(res));
      });

    const facebookLogin = () => {
       LoginManager.logInWithPermissions(["public_profile", "email"]).then(
        function(result) {
          if (result.isCancelled) {
            console.log("Login cancelled");
          }
          else {
            console.log("Login success with permissions: " + result.grantedPermissions.toString());
            new GraphRequestManager().addRequest(infoRequest).start();
          }
        },
        function(error) {
          console.log("Login fail with error: " + error);	
        });
     }

     if(this.state.profile.trim()=="") {    
       console.log(this.state.profile)
       facebookLogin()
     }


   return (<View style={styles.container}>
       <Image style={styles.tinyLogo} source={this.state.profile ? {uri: this.state.profile } : null}/>
       <Text style={{ margin : 5,fontSize: 20}}>{this.state.name }</Text>
       <Text style={{fontSize: 20,margin : 5}}>{this.state.email  }</Text>
        </View>
    );
  }
};

const styles = StyleSheet.create({  
    container: {  
        flex: 1,  
        justifyContent: 'center',  
        alignItems: 'center',  
    },
    tinyLogo: {
     width: 200,
     height: 200,
    },  
});  

module.exports = App;
