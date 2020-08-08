
const fs = require('fs')
const readline = require('readline')
const {google} = require('googleapis')

// If modifying these scopes, delete token.json.
// SCOPE gives additional rules to the sheet, you can restrict rule to readonly or give full access
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// The path were your token.json file is saved, depends totally on you.
const TOKEN_PATH = './google/token.json'

class Authentication {
  authenticated(){
    return new Promise((success, failed) => {
      // Load client secrets from a local file.
        let credentials = this.getClientSecret()
        let authorized = this.authorize(credentials)
        authorized.then(success, failed)
      })
    
  }
  getClientSecret(){
    return require('./credentials.json')
  }
  
  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  authorize(credentials) {
    const {client_secret, client_id, redirect_uris} = credentials.web
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0])
  
        return new Promise((success, failed) => {
          // Check if we have previously stored a token.
          fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
              this.getNewToken(oAuth2Client)
              .then((oAuth2ClientNew) => {
                success(oAuth2ClientNew)
              }, (err) => {
                failed(err)
              })
            } else {
              oAuth2Client.setCredentials(JSON.parse(token))
              success(oAuth2Client)
            }    
          })
        })
    }
  
  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  getNewToken(oAuth2Client, callback) {
    return new Promise((success, failed) => {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      })
      console.log('Authorize this app by visiting this url:', authUrl)
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close()
        oAuth2Client.getToken(code, (err, token) => {
          if (err) {
            failed('Error while trying to retrieve access token', err)
          } 
          oAuth2Client.setCredentials(token)
          // Save the token for later program executions
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err)
            console.log('Token stored to', TOKEN_PATH)
          })
          success(oAuth2Client)
        })
      })
    })
  }
}


module.exports = new Authentication