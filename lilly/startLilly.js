const { configureDB, configureRoutes, connectToDiscord, startDBL } = require('../utils/startServicesLilly')

module.exports = {
    startLilly(app, express, config, mongoose, bot, members) {
        try {
            configureRoutes(app, express, config)
            configureDB(mongoose)
            connectToDiscord(bot)
            startDBL(bot, members, app)
            
            console.log('[ Lilly iniciada com sucesso ]')
        } catch (error) {
            console.log('[ Não foi possível iniciar a Lilly pelo seguinte erro: ]', error)
        }
    }
}
