const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })

/*
*
* Через electron (чтобы обойти капчу) логинимся в ЕТИС и получаем сессию, чтобы отдавать её в остальные методы.
* 
* 
*/


const login = async (username, password) => {
    let response
    await nightmare
	  .goto('https://student.psu.ru/pls/stu_cus_et/stu.teach_plan')
	  .type('#login', username)
	  .type('#password', password)
	  .wait(555)
	  .click('#sbmt')
	  .wait('.span3')
	  .cookies.get('session_id')
		.end()
		.then(cookies => {
		  response = cookies.value
		  nightmare.end()
		})
	  .catch(error => {
	    console.error('Login failed:', error)
        return false
	  })
    return response
}

module.exports = login