let fs = require('fs')

function isEmail(email) {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== '' && email.match(emailFormat)) {
    return true;
  }

  return false;
}

module.exports.getAddressFromTextFile = function (filepath) {
  let file = {
    exist: true,
    extension: require('path').extname(filepath),
    content: ''
  }

  let extensionErrorMsg = 'Sorry, you needed to put addresses list into csv file. Separated each address by new line'

  if (file.extension !== '.csv') throw new Error(extensionErrorMsg)
  let csvData = [];

  try {
    var data = fs.readFileSync('./io-file/' + filepath)
      .toString() // convert Buffer to string
      .split('\n') // split string to lines
      .map(e => e.trim()) // remove white spaces for each line
      .map(e => e.split(',').map(e => e.trim()));

    data.forEach(element => {
      element.forEach(rowData => {
        if (isEmail(rowData)) {
          csvData.push(rowData)
        }
      });
    });
  } catch (e) {
    if (e.code === 'ENOENT') console.log('File not found!', e)
    else console.log('Error: ', e)
    file.exist = false;
  } finally {
    if (!csvData) {
      console.log('Error, File not found!')
      return []
    } else {
      let addressObject = {}

      csvData.forEach((address) => {
        if (address.length > 0) {
          addressObject[address] = true
        }
      })

      console.log('Start email verification...');
      return Object.keys(addressObject)
    }
  }
}