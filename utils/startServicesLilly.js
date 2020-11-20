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
      console.error("[ Ocorreu um erro ao configurar as rotas e os Middlewares: ]\n", error);
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
      console.error("[ Ocorreu um erro ao conectar ao banco de dados: ]\n", error);
    }
  },
};
