const express = require('express')
const cardsRouter  = require('./routes/cards.routes')
const PORT  = process.env.PORT || 3030
require('dotenv').config();
const app  = express()

app.use(express.json())
app.use('/api', cardsRouter)

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))