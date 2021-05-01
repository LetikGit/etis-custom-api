const axios = require('axios')
const { ETIS_DEFAULT_URL } = require("../../const")
const convertToReadable = require("../../helpers/convert")
const cheerio = require('cheerio')
const ETIS_PAGE_SELECTORS = require('../../selectors/index.js');
/**
  * Получаем основную информацию об аккаунте
  * 
  * @param {string} session - сессия, которую получили через /api/login
  * @returns {
 *     result: {boolean},
 *     error_msg: {string}, // if result: 0
 *     studentData: {object} { // if result: 1
 *          fullname: {string} - полное имя студента,
 *          birthday: {string} - дата рождения студента,
 *          specialization: {string} - название специализации,
 *          studyType: {string} - тип обучения (очное / заочное...),
 *          studyStartedYear: {string} - год начала обучения,
 *          missingClassesCount: {number} - количество пропущенных занятий,
 *          anonceCount: {number} - количество объявлений,
 *          msgCount: {number} - количество сообщений
 *     }
 * }
 */


const account = (req, res) => {

    const session = req.body.session
    console.log(session)
    axios.get(ETIS_DEFAULT_URL, {
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

        
        const headerStudentData = ETIS_PAGE_SELECTORS.studentHeaderData($)
        
        const fullname = headerStudentData[0].split("(")[0].trim()
        const birthday = headerStudentData[0].split("(")[1].split(" ")[0]
        const specialization = headerStudentData[1].trim()
        const studyType = headerStudentData[2].trim()
        const studyStartedYear = headerStudentData[3].trim()
        const missingClassesCount = $('.span3 li').find('a[href="stu.absence"]').text().trim().match(/\((.+?)\)/) ? parseInt($('.span3 li').find('a[href="stu.absence"]').text().trim().match(/\((.+?)\)/)[1]) : (parseInt($('.span3 li').find('a[href="stu.absence"] .badge').text()) || 0)
        const anonceCount = parseInt($('.span3 li').find('a[href="stu.stu.announce"] .badge').text()) || 0
        const msgCount = parseInt($('.span3 li').find('a[href="stu.teacher_notes"] .badge').text()) || 0
        
        const studentData = {
            fullname,
            birthday,
            specialization,
            studyType,
            studyStartedYear,
            missingClassesCount,
            anonceCount,
            msgCount
        }

		return res.send({ result: 1, studentData })
    })
}

module.exports = account