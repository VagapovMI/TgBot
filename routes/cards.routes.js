const Router  = require('express')
const router  = new Router()
const cardsController = require('../controller/cards.controller')

router.get('/cards', cardsController.getCardsAndNumbers)

router.get('/oleg', function(req,res){
	res.send('Oleg s DR zaebal 4ort blyat')
})
router.get('/test', function (req,res){
	let test = {id:process.env.S3_ID, key:process.env.S3_ACC_KEY, bucket:process.env.S3_BUCKET}
	res.send(test)
})


module.exports = router