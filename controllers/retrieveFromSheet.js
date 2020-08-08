const authentication = require('../google/index')
const { google } = require('googleapis')

const getFromSheet =  (auth) => {
  return new Promise((sucess, failed) => {
    const sheets = google.sheets({version: 'v4', auth})
    sheets.spreadsheets.values.get({
      spreadsheetId: '1_c4TS8WO0VqX336OauvYaVlxRzuEkaZ50hJf6yQxZok',
      range: 'approved!A:D',
    }, (err, res) => {
      if (err){
        return failed(err) 
      }
      const rows = res.data.values

      if (rows.length) {
          var rowHead = rows.shift()
          const retrievedfct = rows.map((row) => {
              return rowHead.reduce( (obj, key, i) => {
                obj[key] = row[i]
                return obj
              }, {})
          })
          sucess(retrievedfct)   
      } else {
        failed('No data found.')
      }
    })
  })
}


exports.retrieveUsers = (req, res) => {
  authentication.authenticated()
  .then((auth) => {
    getFromSheet(auth).then((response) => {
      res.status(200).
      json({
        message: response
      })
    })
    .catch(err => {
      res.status(404).
      json({
        error: `i no gree fetch data from sheet, ${err}`
      })
    })
  })
  .catch(err => {
    res.status(401).
    json({
      error: `you know wetin happen, ${err}`
    })
  })
}
