module.exports = {
  configureRoutes(app, express, config) {
    console.log(
      "\033[1;33m[ Configurando todos as rotas e Middlewares... ]\033[m"
    );

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

      console.log(
        "\033[1;32m[ Todos as rotas e Middlewares foram configurados ]\033[m"
      );
    } catch (error) {
      console.error(
        "\033[1;31m[ Ocorreu um erro ao configurar as rotas e os Middlewares: ]\n \033[m",
        error
      );
    }
  },

  configureDB(mongoose) {
    console.log("\033[1;33m[ Conectando ao banco de dados... ]\033[m");
    try {
      const mongoConnection = process.env.MONGO_URLCONNECTION;
      mongoose.connect(mongoConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
      console.log("\033[1;32m[ Conectado ao banco de dados ]\033[m");
    } catch (error) {
      console.error(
        "\033[1;31m[ Ocorreu um erro ao conectar ao banco de dados: ]\n \033[m",
        error
      );
    }
  },
};
