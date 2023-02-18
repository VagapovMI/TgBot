const db = require("../db")

class CardsController{
	async getCardsAndNumbers(req,res){
		const clients = await db.query('SELECT \n' +
			'set.public.card_cards.client_id, set.public.card_cards.numberfield, set.public.card_clients.mobilephone \n' +
			'FROM\n' +
			'set.public.card_cards\n' +
			'INNER join set.public.card_clients ON set.public.card_clients.id = set.public.card_cards.client_id')
		res.send(clients.rows)
	}
}

module.exports = new CardsController()