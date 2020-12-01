const mongoose = require('mongoose')

// Criando Schema

const LillySchema = new mongoose.Schema({
    selectLilly: {
        type: 'string',
        default: 'lilly',
        unique: true,
    },
    usedCommands: {
        type: Number,
        default: 0,
        min: 0
    },
    lottery: {
        type: Object,
        default: {
            accumulatedMoney: 0, // Prêmio acumulado
            lastWinners: [], // ID do último ganhador
            lastNumbers: [], // Últimos números  sorteados
            currentAward: 0, // Prêmio atual
            participants: 0, // Quantidade de participantes
            nextDraw: 0 // Segundos restantes para o próximo sorteio
        }
    }
})

mongoose.model('Lilly', LillySchema)