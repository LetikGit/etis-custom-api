const axios = require('axios')
const { ETIS_MARKS_URL } = require("../../const")
const convertToReadable = require("../../helpers/convert")
const cheerio = require('cheerio')
/**
  * Получаем информацию об оценках за контрольные точки по номеру триместра
  * 
  * @param {string} session - сессия, которую получили через /api/login
  * @param {number} trim - номер триместра, за который хотим посмотреть оценки
  * @returns {
 *     result: {boolean},
 *     error_msg: {string}, // if result: 0
 *     disciplines: {array} { // if result: 1
 *          {object}: { - объект дисциплины из триместра
 *              name: {string} - название дисциплины,
 *              marks: {array} - массив контрольный точек за дисциплину,
 *                    {object} - объект контрольной точки
 *                          name: {string} - название контрольной точки,
 *                          now: {string} - текущая оценка за КТ,
 *                          min: {string} - минимальная (проходная) оценка за КТ,
 *                          max: {string} - максимальный балл за КТ
 *          }
 *     }
 * }
 */


const marksByTrim = (req, res) => {
    const session = req.body.session
    const trimNumber = +req.params.trim

    axios.get(`${ETIS_MARKS_URL}?p_mode=current&p_term=${trimNumber}`, {
        headers: {
            Cookie: `session_id=${session}`
        },
        responseType: 'arraybuffer',
	    responseEncoding: 'binary'
    })
   .then(response => {
        const pageHtml = convertToReadable(response.data)
        $ = cheerio.load(pageHtml)
        let disciplines = []

        
        $('h3').map((i, elem) => {
            dis = $(elem).text().trim()
            if ($(elem).next().find('td.superBetterTooltip').attr('data-url')) {
                disciplines.push({
                    name: dis,
                    marks: []
                })
            }
        })

        let index = -1
        $('.common').map((i, elem) => {
            ktList = []
            markListOneDis = {}
            
            if ($(elem).find('tr').length > 2) {
                index++
                $(elem).find('td.superBetterTooltip').each(function(ind, tr) {
                    name = $(tr).parent().find('td:first-child').text()
                    now = $(tr).text()
                    min = $(tr).parent().find('td:nth-child(5)').text()
                    max = $(tr).parent().find('td:nth-child(7)').text()
                    
                    disciplines[index].marks.push({
                        name,
                        now,
                        min,
                        max,
                    })
                })
            }
        })

        res.send({
            result: 1,
            disciplines
        })
   })
}

module.exports = marksByTrim