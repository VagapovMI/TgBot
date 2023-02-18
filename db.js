const Pool =require('pg').Pool
const pool = new Pool({
	user: 'postgres',
	password :'postgres',
	host:'192.168.1.201',
	port:5432,
	database:'set'
})

module.exports = pool