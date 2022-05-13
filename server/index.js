const express = require("express");
const { router } = require("./routes");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");


app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(router)

app.listen(3001, () => {
  console.log("Running on port 3001");
});

