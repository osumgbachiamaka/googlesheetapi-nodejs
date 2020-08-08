
const authentication = require('../google/index')
const { google } = require('googleapis')
const sheets = google.sheets('v4')

const saveToSheet = async (auth, data) => {
    const request = {
      spreadsheetId: '1_c4TS8WO0VqX336OauvYaVlxRzuEkaZ50hJf6yQxZok',
      range: 'new users!A1:B',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: data // data to save to sheet
      },
      auth: auth
    }

    try {
      const response = (await sheets.spreadsheets.values.append(request)).data
      // send response back
      return 'Success - Google Sheet Updated'
    } catch (err) {
      return `${err}` //returns only the error object
    }
}

exports.saveUsers = (req, res) => {
  const data = [['amaka', '2 lokoja'], ['uche']]
    authentication.authenticated()
    .then((auth) => {
        saveToSheet(auth, data)
        .then(resp => {
            res.status(200).
            json({
            message: resp
            })
        })
        .catch(err=> {
            res.status(404).
            json({
            error: `i no gree save data to sheet, ${err}`
            })
        })
    })
    .catch(err => {
        res.status(401)
        .json(`you know wetin happen, ${err}`)
    })
}