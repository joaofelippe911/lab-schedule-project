const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { createTokens, validateToken } = require("./JWT");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "p4$$@w0rd1",
  database: "bioprev",
});

app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/api/scheduling/times/get/:dateOfCollect", (req, res) => {

  const date = req.params.dateOfCollect;

  const sqlSelect = "SELECT id, hour FROM times WHERE NOT id IN (SELECT id_time FROM scheduling WHERE date = ?)";


  db.query(sqlSelect, date, (err, result) => {
    if (err) {
      console.log(err);
      res.send([]);
    } else if (result) {
      res.send(result);
    } else {
      return;
    }
  })
})

app.get("/api/scheduling/times/getOnViewing", (req, res) => {
  const date = req.query.dateOfCollect;
  const scheduleId = req.query.scheduleId;

  const sqlSelect = "SELECT id, hour FROM times WHERE NOT id IN (SELECT id_time FROM scheduling WHERE date = ? AND NOT id = ?)";

  console.log(sqlSelect);
  console.log(date, scheduleId)

  db.query(sqlSelect, [date, scheduleId], (err, result) => {
    if (err) {
      console.log(err);
      res.send([]);
    } else if (result) {
      res.send(result);
    } else {
      return;
    }
  })
})

app.post("/api/insert", (req, res) => {

    const { patientName, cpf, birth, phone, address, neighborhood, number, cep, date, time, responsibleName, responsiblePhone, requisitationNumber, price, note } = req.body;

    const sqlInsert = "INSERT INTO scheduling (patient_name, cpf, birth, phone, address, neighborhood, number, cep, date, id_time, responsible_name, responsible_phone, requisitation_number, price, note, id_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,2)";

    db.query(sqlInsert, [patientName, cpf, birth, phone, address, neighborhood, number, cep, date, time, responsibleName, responsiblePhone, requisitationNumber, price, note], (err, result) => {
      console.log(err);
      res.send(result);
    })
});

app.post("/api/update", (req, res) => {
  const { scheduleId, date, time, requisitationNumber, price, note } = req.body;

  const sqlUpdate = "UPDATE scheduling SET date = ?, id_time = ?, requisitation_number = ?, price = ?, note = ? WHERE scheduling.id = ?";

  db.query(sqlUpdate, [date, time, requisitationNumber, price, note, scheduleId], (err, result) => {
    console.log(err);
    res.send(result);
  })
})

app.post("/admin/register", (req, res) => {
  const { username, password, role } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    const sqlInsert = "INSERT INTO user (username, password, role) VALUES (?,?,?)";

    db.query(sqlInsert, [username, hash, role], (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({error: err});
      } else if (result) {
        res.json("Usuário registrado!");
      } else {
        return;
      }
    })
  })
})

app.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;

  console.log("passei aqui autenticando")

  console.log(username, password);

  const sqlQuery = "SELECT id, username, password FROM user WHERE username = ? LIMIT 1";

  const user = await db.query(sqlQuery, [username], (err, result) => {
    if(!result[0]) {
      res.status(400).json({error: "User doesn't exists!"});
    } else {
      const dbPassword = result[0]['password'];

      bcrypt.compare(password, dbPassword).then((match) => {
        if(!match) {
          res.status(401).json({error: "Wrong username and password combination"});
        } else {
          const accessToken = createTokens(result[0]);

          res.cookie("access-token", accessToken, {
              maxAge: 60*60*12*1000,
              httpOnly: true
          });

          res.json({
            auth: true, 
            user: {
              id: result[0]['id'],
              name: result[0]['username']
            }
          });
        }
      })
    }
  });
});

app.get("/verifyAuthentication", validateToken, async (req, res) => {
  console.log("Passei aqui verificando")
  res.status(200).json({isAuthenticated: true});
})

app.get("/deleteCookie", async (req, res) => {
  res.status(200).clearCookie('access-token').send('Cookie deleted');
})

app.get("/admin/", validateToken, async (req, res) => {

  const sqlQuery = "SELECT scheduling.id schedule_id, scheduling.patient_name, scheduling.address, scheduling.neighborhood, scheduling.number, scheduling.cep, scheduling.phone, scheduling.date, scheduling.price, scheduling.requisitation_number, times.hour FROM scheduling INNER JOIN times ON (times.id = scheduling.id_time) ORDER BY date ASC, hour ASC";

  db.query(sqlQuery, (err, result) => {
    res.json(result);
  })
})

app.post("/admin/search-schedule", validateToken, async (req, res) => {
  const { id } = req.body;

  const sqlQuery = "SELECT scheduling.id schedule_id, scheduling.patient_name, scheduling.cpf, scheduling.birth, scheduling.address, scheduling.neighborhood, scheduling.number, scheduling.cep, scheduling.phone, scheduling.date, scheduling.price, scheduling.requisitation_number, scheduling.responsible_name, scheduling.responsible_phone, scheduling.note, scheduling.id_time time, times.hour FROM scheduling INNER JOIN times ON (times.id = scheduling.id_time) WHERE scheduling.id = ? LIMIT 1";

  db.query(sqlQuery, [id], (err, result) => {
    res.json(result);
  })
  
})

app.listen(3001, () => {
  console.log("Running on port 3001");
});
