const axios = require('axios')
const { ETIS_MARKS_URL } = require("../../const")
const convertToReadable = require("../../helpers/convert")
const cheerio = require('cheerio')

/**
  * Получаем информацию об оценках за сессии
  * 
  * @param {string} session - сессия, которую получили через /api/login
  * @returns {
 *     result: {boolean},
 *     trimCount: {number} - количество триместров, // if result: 1
 *     error_msg: {string}, // if result: 0
 *     sessionMarks: {array} { // if result: 1
    *      {object}
    *         trimNumber: {string} - номер триместра в формате "N триместр  (J курс)",
    *         attestationDate: {string} - дата аттестации,
    *         data: {array}, - массив объектами результатов за сессию
    *               {object}
    *                   name: {string} - название дисциплины,
    *                   mark: {stirng} - оценка за дисциплину,
    *                   date: {string} - дата выставления оценки,
    *                   teacher: {string} - преподаватель
 *     }
 * }
 */

const sessionMarks = (req, res) => {
    const session = req.body.session

    axios.get(ETIS_MARKS_URL, {
        headers: {
            Cookie: `session_id=${session}`
        },
        responseType: 'arraybuffer',
	    responseEncoding: 'binary'
    })
   .then(response => {
        const pageHtml = convertToReadable(response.data)
        $ = cheerio.load(pageHtml)
        
        if ($('#form').attr('action')) {
            return res.send({ result: 0, error_msg: 'Session is invalid.' })
        }

        const p_term = ($('.common').find('th').length / 5) // определяем количество триместров

        let sessionMarks = new Array(p_term) // создаем массив триместров, в который будем записывать оценки за сессии

        for (let i = 0; i < p_term; i++) {
            sessionMarks[i] = {
                trimNumber: '',
                attestationDate: '',
                data: {}
            }
        }

        let counter = -1

        let checkData = {
            info: '',
            data: []
        }

        const trimCount = $('.common').find('th').length / 5

        $('.common').find('tr').map((i, elem) => {

            let trimData = {}
            let tmpCounter = 1
            let tmpData = []

            checkData.info = ($(elem).text().indexOf('триместр') !== -1) ? $(elem).text().trim() : ''
            
            if ($(elem).text().indexOf('триместр') === -1) { // пропускаем шапку с информацией о триместре
                $(elem).find('td').map((index, el) => {
                  tmpData[tmpCounter] = $(el).text() // записываем всю информацию из строки
                  if (tmpCounter === 4) { // проверяем прочитали ли мы все столбцы с информацией
                    if (tmpData[1] && tmpData[2]) { // проверяем, то что дисциплина и оценка существуют
                        trimData = {
                            name: tmpData[1],
                            mark: tmpData[2],
                            date: tmpData[3],
                            teacher: tmpData[4]
                        }
                      checkData.data.push(trimData)
                      trimData = {}
                    }
                      tmpCounter = 1
                  } else {
                      tmpCounter++
                    }
                })
            } else {
                if (checkData.data.length > 1) {
                    sessionMarks[counter].data = checkData.data
                }
                counter++
                if (checkData.info) {
                    sessionMarks[counter].trimNumber = checkData.info.split("\n")[0]
                    sessionMarks[counter].attestationDate = checkData.info.match(/(\d{2}.\d{2}.\d{4})/) && checkData.info.match(/(\d{2}.\d{2}.\d{4})/)[0] || ''
                }
                
                
                checkData.info = {}
                checkData.data = []
            }
        })
        

		return res.send({ result: 1, trimCount, sessionMarks })
    })
}

module.exports = sessionMarks