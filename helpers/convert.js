var iconv = require("iconv-lite");

/*
* Переводим в адекватную кодировку, чтобы текст можно было распарсить и отдать.
*
*/

const convertToReadable = (data) => {
    const response = iconv.decode(data.toString('binary'), 'win1251')
    return response
}

module.exports = convertToReadable