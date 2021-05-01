const login = require('../../utils/login.js')

/**
  * Логинимся в ЕТИС и получаем сессию
  * 
  * @param {string} username - логин в ЕТИС
  * @param {string} password - пароль в ЕТИС
  * @returns {
  *     result: {boolean},
  *     error_msg: {string}, // if result: 0
  *     session: {string} // if result: 1
  * }
  */

const session = async (req, res) => {

    const username = req.body.username
    const password = req.body.password

    if (!username || !password) {
        return res.send({ result: 0, error_msg: 'Empty username / password.' })
    }

    const session = await login(username, password)
    
	if (session) {
        return res.send({ result: 1, session })
    } else {
        return res.send({ result: 0, error_msg: 'Login failed.' })
    }
}

module.exports = session