const routes = require("../../src/routes");
const { secondsToMs } = require("../../utils/utilsCommands");
const OAuthClient = require("disco-oauth");
const client = new OAuthClient(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);
const internalToken = process.env.INTERNAL_TOKEN_API_ACCESS;
const config = require("../../config.json")
client.scopes = ["identify", "guilds"];
client.redirectURI = `http://localhost:3333/api/auth`

function hasHeaderAuth(req, res, next) {
  const headers = req.headers;
  if (!headers["x-access-token"])
    return res
      .status(401)
      .json({ error: true, message: "No User Token Provided" });
  if (headers["x-access-token"].split(".").length != 3)
    return res
      .status(401)
      .json({ error: true, message: "No Valid User Token Sections" });
  if (!headers.authorization)
    return res
      .status(401)
      .json({ error: true, message: "No API Token Provided" });
  if (headers.authorization.length != internalToken.length)
    return res
      .status(401)
      .json({ error: true, message: "Invalid Length API Token" });
  if (headers.authorization != internalToken)
    return res.status(401).json({ error: true, message: "Invalid API Token" });

  return next();
}

function hasInternalToken(req, res, next) {
    const headers = req.headers;
    if (!headers.authorization)
        return res.status(401).json({ error: true, message: 'No API Token Provided' })
    if (headers.authorization.length != internalToken.length)
        return res.status(401).json({ error: true, message: 'Invalid Length API Token'})
    if (headers.authorization != internalToken)
        return res.status(401).json({ error: true, message: 'Invalid API Token'})

    return next()
} 

routes.get("/api/login", hasInternalToken, (req, res) => {
  return res.redirect(client.authCodeLink);
});

routes.get("/api/auth", async (req, res) => {
  const code = req.query.code;
  let token;
  if (!code)
    return res.status(403).json({ error: true, message: "No Code Provided" });

  try {
    token = await client.getAccess(code);
    res.cookie("discordToken", token, { maxAge: secondsToMs(21600) });
    return res
      .status(200)
      .json({ error: false, message: "The user is logged" });
  } catch (error) {
    res.status(401).json({ error: true, message: "Invalid Code" });
  }
});

routes.get("/api/guilds", hasHeaderAuth, async (req, res) => {
  const auth = req.headers["x-access-token"];
  const guilds = await client.getGuilds(auth);

  return res.json(guilds);
});

routes.get("/api/user", hasHeaderAuth, async (req, res) => {
  const auth = req.headers["x-access-token"];
  const user = await client.getUser(auth);
  return res.json(user);
});

module.exports = routes;
