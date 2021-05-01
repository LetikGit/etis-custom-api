const axios = require('axios')
const { ETIS_TEACHERS_URL } = require("../../const")
const convertToReadable = require("../../helpers/convert")
const cheerio = require('cheerio')

/**
  * Получаем информацию о списке преподавателей
  * 
  * @param {string} session - сессия, которую получили через /api/login
  * @returns {
 *     result: {boolean},
 *     error_msg: {string}, // if result: 0
 *     teachers: {array} { // if result: 1
    *      {object}
    *         name: {string} - имя преподавателя,
    *         avatar_url: {string} - ссылка на фотографию,
    *         cafedra: {string} - кафедра преподавателя,
    *         discipline: {string} - дисциплина, которую преподаватель ведет
 *     }
 * }
 */

const teachers = (req, res) => {
    const session = req.body.session

    axios.get(ETIS_TEACHERS_URL, {
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

        let teachers = []

	    $('.teacher_info').each(function() {
	        teachers.push({
	            name: $(this).find('.teacher_name').text().trim(),
	            avatar_url: 'https://student.psu.ru/pls/stu_cus_et/' + $(this).find('.teacher_photo img').attr("src"),
	            cafedra: $(this).find('.chair').text().trim(),
	            discipline: $(this).find('.dis').text().trim()
	        })
	    })

        res.send({
            result: 1,
            teachers
        })
    })
}

module.exports = teachers