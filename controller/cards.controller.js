const db = require("../db")

const cities = [
	{name:'Геленджик', num:'236'} // ну и тд
]
//const numbers = [
//	{newnum: `7`, num: `8`}
//]

class CardsController{
	async getCardsAndNumbers(req,res){
		const clients = await db.query('SELECT \n' +
			'set.public.card_cards.client_id, set.public.card_cards.numberfield, set.public.card_clients.mobilephone \n' +
			'FROM\n' +
			'set.public.card_cards\n' +
			'INNER join set.public.card_clients ON set.public.card_clients.id = set.public.card_cards.client_id')
		let data = clients.rows
		for (let i=0;i<data.length; i++){
			data[i].mobilephone = data[i].mobilephone.replace(/[^0-9]/g, '')
			data[i].mobilephone = `7` + data[i].mobilephone[1] + data[i].mobilephone[2] + data[i].mobilephone[3] + data[i].mobilephone[4] + data[i].mobilephone[5] + data[i].mobilephone[6] + data[i].mobilephone[7] + data[i].mobilephone[8] + data[i].mobilephone[9] + data[i].mobilephone[10]
//			let numb = data[i].mobilephone[0]
//			for (let m=0; m < numbers.length; m++){
//				if (numbers[m].num === numb){
//					numb = numbers.newnum // даблпизда
//				}
//			}
			let first = data[i].numberfield[0]+data[i].numberfield[1]+data[i].numberfield[2]
			for (let b=0; b< cities.length;b++){
				if(cities[b].num === first){
					data[i].city = cities[b].name
				}
				else { data[i].city = `Ёбикостан` }
			}
		}
		res.send(data)
	}
}

module.exports = new CardsController()