const { secondsToMs } = require("../utils/utilsCommands");

module.exports = {
  configureRoutes(app, express, config) {
    console.log("[ Configurando todos as rotas e Middlewares... ]");

    const cors = require("cors");
    const compression = require("compression");
    const routes = require("../src/routes");

    try {
      app.use(express.json());
      app.use(
        cors({
          origin: config.websiteURL,
          optionsSuccessStatus: 200,
        })
      );
      app.use(routes);
      app.disable("x-powered-by");
      app.use(compression());

      console.log("[ Todos as rotas e Middlewares foram configurados ]");
    } catch (error) {
      console.error(
        "[ Ocorreu um erro ao configurar as rotas e os Middlewares: ]\n",
        error
      );
    }
  },

  configureDB(mongoose) {
    console.log("[ Conectando ao banco de dados... ]");
    try {
      const mongoConnection = process.env.MONGO_URLCONNECTION;
      mongoose.connect(mongoConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
      console.log("[ Conectado ao banco de dados ]");
    } catch (error) {
      console.error(
        "[ Ocorreu um erro ao conectar ao banco de dados: ]\n",
        error
      );
    }
  },

  connectToDiscord(bot) {
    console.log("[ Conectando ao Discord... ]");

    const Discord = require("discord.js");
    try {
      const token = process.env.DISCORD_TOKEN;
      bot.login(token);
      bot.commands = new Discord.Collection();
      console.log("[ Conectado ao Discord ]");
    } catch (error) {
      console.error("[ Ocorreu um erro ao se conectar ao Discord ]", error);
    }
  },

  startDBL(bot, members, app) {
    console.log("[ Iniciando a DBL... ]");
    try {
      const DBL = require("dblapi.js");
      const dbl = new DBL(process.env.DBL_TOKEN, {
        webhookPort: 5500,
        webhookAuth: process.env.DBL_AUTH_TOKEN,
      });
      dbl.on("error", (e) => console.error("Ocorreu um erro no DBL: \n", e));
      dbl.webhook.on("ready", (hook) => {
        console.log(
          `[ Webhook rodando em http://${hook.hostname}:${hook.port}${hook.path} ]`
        );
      });
      dbl.webhook.on("vote", async (vote) => {
        console.log("Acabaram de votar na Lilly!");
        await bot.users.fetch(vote.user).then(async (user) => {
          await user.send(lilly.defaultReply.voteReply);

          const id = String(user.id);
          const member = await members.indexMember(id);
          const money = parseInt(member.money) + 1000;
          await members.updateDataMembers({ memberId: id }, { money: money });
        });
      });
      console.log("[ DBL foi iniciada ]");

      return setInterval(
        () => dbl.postStats(bot.guilds.cache.size),
        secondsToMs(1800)
      );
    } catch (error) {
      console.error("[ Ocorreu um erro ao iniciar a DBL ]", error);
    }
  },
};
