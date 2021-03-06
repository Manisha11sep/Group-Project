const axios = require('axios')

module.exports = {

  auth: (req, res) => {
    
      axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, 
        {client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            code: req.query.code,
            grant_type: 'authorization_code',
            redirect_uri: `http://${req.headers.host}/auth/callback`
        }).then( accessTokenResponse => {
          const accessToken = accessTokenResponse.data.access_token;
            // console.log('-------------accessToken', accessToken)
              return axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo/?access_token=${accessToken}`)
          .then( userInfoResponse => {
            // console.log("response from auth0",userInfoResponse)
              const userData = userInfoResponse.data;
              const name = userData.name;
              const email = userData.email;
              // ffffffconsole.log(email)
              req.app.get('db').findUser(email).then(response =>{
               
                // console.log("response from database",response)
                if(response.length){
                  // console.log("response from session",response[0].userid)
                  // console.log(response[0].userid)
                  if(response[0].userid === 13 || response[0].userid === 14 || response[0].userid === 15){
                    req.session.user.isAdmin = true
                  }
                  req.session.user.userid = response[0].userid;
                  req.session.user.name = response[0].username;
                  req.session.user.email = response[0].useremail;
                  req.session.user.cart = []
                    res.redirect('/redirect');
                }
                else
                {
                  req.app.get('db').createUser([name,email]).then(response => {
                    req.session.user.id = response[0].userid;
                    req.session.user.name = response[0].username;
                    req.session.user.email = response[0].useremail;
                    req.session.user.cart = []
                        res.redirect('/redirect');
                })
              }
            
              }).catch(error => {
                console.log("create customer controller error", error);
              
            });
          });
        })
      },
      logout: (req, res) => {
        req.session.destroy();
        res.status(200).send("logged out").catch(error => {
          console.log(error);
        
      });
    },

        
          }  

