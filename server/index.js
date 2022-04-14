const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { createTokens, validateToken } = require("./JWT");
const { verifyPermission } = require("./middlewares/verifyPermission");
const db = require('./db');

app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


// POST /api/schedules/ OK
app.post("/api/schedules", [validateToken, verifyPermission([1, 2, 3, 4])], db.insertScheduling);

app.get("/api/schedules/reports/:initialDate/:finalDate", [validateToken, verifyPermission([1, 3])], async (req, res) => {
  const { initialDate, finalDate } = req.params;

  console.log(initialDate, finalDate);

  const initialDateSplited = initialDate.split("-");
  const formatedInitialDate = initialDateSplited[2] + "-" + initialDateSplited[1] + "-" + initialDateSplited[0];

  const finalDateSplited = finalDate.split("-");
  const formatedFinalDate = finalDateSplited[2] + "-" + finalDateSplited[1] + "-" + finalDateSplited[0];


  const generalData = await db.selectDateIntervalData(formatedInitialDate, formatedFinalDate);

  let finalData = {
    general: {
      total: 0,
      finished: 0,
      amount: 0
    }    
  }

  generalData.forEach((group) => {
    finalData.general.total += group.total;
    if(group.status == 3) {
      finalData.general.finished += group.total;
      finalData.general.amount += group.amount;
    }
  })

  const tecniciansData = await db.selectTecniciansReportData(formatedInitialDate, formatedFinalDate);

  finalData.tecnicians = tecniciansData;

  const greetersData = await db.selectGreetersReportData(formatedInitialDate, formatedFinalDate);

  finalData.greeters = greetersData;
  return res.status(200).json(finalData);
})

// PUT /api/schedules/:id OK
app.put("/api/schedules/:id", [validateToken, verifyPermission([1, 2, 3, 4])], db.updateScheduling);

// PUT /api/schedules/finish/:id OK
app.put("/api/schedules/finish/:id", [validateToken, verifyPermission([1, 2, 3])], db.finishScheduling);

// PUT /api/schedules/meet/:id OK
app.put("/api/schedules/meet/:id", [validateToken, verifyPermission([1, 2, 3])], db.meetScheduling);

// PUT /api/schedules/reopen/:id OK
app.put("/api/schedules/reopen/:id", [validateToken, verifyPermission([1, 2, 3])], db.reopenScheduling);

// GET /api/schedules/ OK
app.get("/api/schedules/", [validateToken, verifyPermission([1, 2, 3, 4])], db.selectSchedulings)

// GET /api/schedules/history OK
app.get("/api/schedules/history", [validateToken, verifyPermission([1, 2, 3, 4])], db.selectSchedulingHistory);

// GET /api/schedules/month-numbers OK
app.get("/api/schedules/month-numbers", [validateToken, verifyPermission([1, 2, 3, 4])], db.selectMonthNumbers);

// GET /api/schedules/:id OK
app.get("/api/schedules/:id", [validateToken, verifyPermission([1, 2, 3, 4])], db.selectScheduling);

// GET /api/schedules/times/:dateOfCollect OK
app.get("/api/schedules/times/:dateOfCollect/:scheduleId?", [validateToken, verifyPermission([1, 2, 3, 4])], db.selectAvailableTimes);

// POST /api/users/ OK
app.post("/api/users/", [validateToken, verifyPermission([1, 3])], db.insertUser);

// GET /api/users OK
app.get("/api/users/", [validateToken, verifyPermission([1, 3])], db.selectUsers);

// PUT /api/users/:id OK
app.put("/api/users/:id", [validateToken, verifyPermission([1, 3])], db.updateUser);

// PUT /api/users/inactivate/:id OK
app.put("/api/users/inactivate/:id", [validateToken, verifyPermission([1, 3])], db.inactivateUser);

// PUT /api/users/activate/:id
app.put("/api/users/activate/:id", [validateToken, verifyPermission([1, 3])], db.activateUser);

// GET /api/users/:id
app.get("/api/users/:id", [validateToken, verifyPermission([1, 3])], db.selectUser);

// GET /api/roles/
app.get("/api/roles", [validateToken, verifyPermission([1, 3])], db.selectRoles);

app.get("/api/times", [validateToken, verifyPermission([1, 2, 3])], db.selectTimes);

app.patch("/api/times/inactivate/:id", [validateToken, verifyPermission([1, 2, 3])], db.inactivateHorary);

app.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;

  const user = await db.selectUserDataForLogin(username);

  if(!user){
    return res.status(400).json({error: "User doesn't exists!"});
  } 
  
  const dbPassword = user['password'];

  bcrypt.compare(password, dbPassword).then((match) => {
    if(!match) {
      return res.status(401).json({error: "Wrong username and password combination"});
    } 

    const accessToken = createTokens(user);

    res.cookie("access-token", accessToken, {
        maxAge: 60*60*12*1000,
        httpOnly: true
    });

    res.cookie("user-id", user['id'], {
      maxAge: 60*60*12*1000,
      httpOnly: true
    })

    return res.json({
      auth: true, 
      user: {
        id: user['id'],
        name: user['username'],
        role: user['role']
      }
    });
  })
});

app.get("/verifyAuthentication", validateToken, async (req, res) => {
  res.status(200).json({isAuthenticated: true});
})

app.get("/deleteCookie", async (req, res) => {
  res.status(200).clearCookie('access-token').clearCookie('user-id').send('Cookie deleted');
})

app.listen(3001, () => {
  console.log("Running on port 3001");
});

