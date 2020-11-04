const { Router } = require('express')
const routes = Router()
const membersController = require('./controllers/membersController')

routes.get('/api/moneyTop/:limit', async (req, res) => {
 const limit = parseInt(req.params.limit) || 10
 const dindinsTop = await membersController.getDinDinsTop(limit)
 return res.json(dindinsTop)
})

module.exports = routes