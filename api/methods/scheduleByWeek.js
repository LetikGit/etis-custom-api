const axios = require('axios')
const { ETIS_TIMETABLE_BYWEEK_URL } = require("../../const")
const convertToReadable = require("../../helpers/convert")
const cheerio = require('cheerio')

/**
  * Получаем расписание по номеру недели
  * 
  * @param {string} session - сессия, которую получили через /api/login
  * @param {number} week - номер недели
  * @returns {
 *     result: {boolean},
 *     error_msg: {string}, // if result: 0
 *     scheduleData: {array} { // if result: 1
 *          {object}: { - объект дисциплины из триместра
 *              title: {string} - день недели и дата (прим: Понедельник, 19 апреля),
 *              weekday: {number} - номер недели (начинается с 1),
 *              pairs: {array} - массив пар за день
 *                    {object} - объект пары
 *                          pair_num: {string} - номер пары (начинается с 1),
 *                          pair_time: {string} - начало пары,
 *                          pair_teacher: {string} - преподаватель,
 *                          pair_dis: {string} - название дисциплины
 *                          pair_aud: {string} - номер аудитории
 *          }
 *     }
 * }
 */

const scheduleByWeek = (req, res) => {
    const session = req.body.session
    const selectedWeek = req.params.week

    axios.get(ETIS_TIMETABLE_BYWEEK_URL + selectedWeek, {
        headers: {Cookie: `session_id=${session}`},
        responseType: 'arraybuffer',
        responseEncoding: 'binary'
    })
    .then(response => {
        const pageHtml = convertToReadable(response.data)
        $ = cheerio.load(pageHtml)

        let dataFull = []
        let week = []
        let week_periods = []

        $('.week').map((day, elem) => {
            let tmp = $(elem).find('a').text()

            if (tmp === '') {
              tmp = $(elem).text()
            }

            week_periods.push({
                week: tmp.trim()
            })
        })

        let week_data = {
            start: $('.week-select').find('span').text().match(/(0[1-9]|[12][0-9]|3[01])[-.]\d\d/g)[0],
            end: $('.week-select').find('span').text().match(/(0[1-9]|[12][0-9]|3[01])[-.]\d\d/g)[1],
            week: selectedWeek
        }
        
        $('.day').map((day, elem) => {

            let dayInfo = {}
            dayInfo.title = $(elem).find('h3').text()
            dayInfo.weekday = day + 1
            let pairs = []

            $(elem).find('tr').each((i, tr) => {

                if ($(tr).find('td.pair_info .dis').length) {

                    for (let counter = 0; counter < $(tr).find('td.pair_info .dis').length; counter++) {

                        pair_num = $(tr).find('td.pair_num').text().slice(0, 1)
                        pair_time = $(tr).find('td.pair_num .eval').text()
                        pair_teacher = $(tr).find(`td.pair_info .teacher`).eq(counter).find('a').text().replace('оценить занятие', '')
                        pair_dis = $(tr).find(`td.pair_info .dis`).eq(counter).text().trim()
                        pair_aud = $(tr).find(`td.pair_info .aud`).eq(counter).text()

                        if (pair_dis !== '') {

                            let pair = {
                                pair_num,
                                pair_time,
                                pair_teacher,
                                pair_dis,
                                pair_aud
                            }

                            pairs.push(pair)
                        }

                    }
                }
            })

            if (pairs.length === 0)
                pairCount = 0
                    
            dayInfo.pairs = pairs

            week.push(dayInfo)
        })

        dataFull = week

        res.send({
            scheduleData: dataFull,
            week_periods, 
            selectedItem: week_data
        })
    })
}


module.exports = scheduleByWeek