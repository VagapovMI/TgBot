const db = require("../db")
const createCsvWriter = require(`csv-writer`).createObjectCsvWriter;
const cities = [
	{name:'Сочи', num:'231'},
	{name:'Адлер', num:'232'},
	{name:'Новороссийск', num:'233'},
	{name:'Новороссийск2', num:'234'},
	{name:'Сочи2', num:'235'},
	{name:'Геленджик', num:'236'},
	{name:'Симферополь', num:'821'},
	{name:'Севастополь', num:'822'},
	{name:'Евпатория', num:'823'},
	{name:'Керчь', num:'824'},
	{name:'Симферополь2', num:'825'},
	{name:'Севастополь2', num:'826'},
	{name:'Череповец', num:'351'},
	{name:'Череповец2', num:'352'},
	{name:'Вологда', num:'353'},
	{name:'Братск', num:'381'},
	{name:'Омск3', num:'553'},
	{name:'Рязань2', num:'622'},
	{name:'Рязань2', num:'100'},
	{name:'Рыбинск', num:'761'},
	{name:'Архангельск', num:'291'},
	{name:'Екатеринбург', num:'661'},
	{name:'Екатеринбург2', num:'662'},
	{name:'Владивосток', num:'251'},
	{name:'Владивосток2', num:'252'},
	{name:'Владивосток3', num:'253'},
	{name:'Энгельс', num:'641'},
	{name:'Улан-Удэ', num:'931'}
]
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
			if(data[i].mobilephone[0] === `8`) {
				data[i].mobilephone = data[i].mobilephone.replace( data[i].mobilephone[0], '7')
			} else if (data[i].mobilephone[0] === `9`)
			     {
					 data[i].mobilephone = '7' + data[i].mobilephone
			     } else {}
			let first = data[i].numberfield[0]+data[i].numberfield[1]+data[i].numberfield[2]
			for (let b=0; b< cities.length;b++){
				if(cities[b].num === first){
					data[i].city = cities[b].name
				}
			}
		}
		res.send(data)

		const csvWriter = createCsvWriter({
			path: `cards.csv`,
			header: [
				{id: `mobilephone`, title: `Mobile` },
				{id: `numberfield`, title: `Card`},
				{id: `city`, title: `City`},
			]
		});
		csvWriter.writeRecords(data)
			.then(() => {
				console.log(`Done`);
			});
	}
}
module.exports = new CardsController()

const S3 = require('aws-sdk/clients/s3')
const file = 'cards.csv'
const objectKey = 'objectkey'
const copyObjectKey = 'objectkeycopy'
const bucketParams = { Bucket: process.env.S3_BUCKET }
const uploadParams = { Bucket: bucketParams.Bucket, Key: '', Body: '' }
const copyParams = { Bucket: bucketParams.Bucket, CopySource: `${bucketParams.Bucket}/${objectKey}`, Key: copyObjectKey }

console.log('Создание клиента')
const s3 = new S3({
	accessKeyId: process.env.S3_ID,
	secretAccessKey: process.env.S3_ACC_KEY,
	endpoint: 'https://s3.timeweb.com',
	s3ForcePathStyle: true,
	region: 'ru-1',
	apiVersion: 'latest',
})

const runTest = async () => {
	try {
		console.log('Загрузка файла в бакет')

		const fs = require('fs')
		const fileStream = fs.createReadStream(file)
		fileStream.on('error', function (err) {
			console.log('File Error', err)
		})
		uploadParams.Body = fileStream
		const path = require('path')
		uploadParams.Key = path.basename(file)

		const res = await s3.upload(uploadParams).promise()
		console.log('Success', res)
	} catch (e) {
		console.log('Error', e)
	}
	try {
		console.log('Копирование объекта')
		const res = await s3.copyObject(copyParams).promise()
		console.log('Success', res)
	} catch (e) {
		console.log('Error', e)
	}
}
runTest()
	.then(_ => {
		console.log('Done')
	})
	.catch(e => {
		console.log('Error', e)
	})
