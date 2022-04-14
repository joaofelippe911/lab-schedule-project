const bcrypt = require("bcrypt");
const mysql = require("mysql");
const { getFirstDayOfTheWeek, getLastDayOfTheWeek } = require("./utils/dates");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "p4$$@w0rd1",
    database: "bioprev"
})

const insertScheduling = async function(req, res){

    const { patientName, cpf, birth, phone, address, neighborhood, number, cep, date, time, responsibleName, responsiblePhone, requisitationNumber, price, note, userId} = req.body;

    const sql = "INSERT INTO scheduling (patient_name, cpf, birth, phone, address, neighborhood, number, cep, date, id_time, responsible_name, responsible_phone, requisitation_number, price, note, id_greeter) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(sql, [patientName, cpf, birth, phone, address, neighborhood, number, cep, date, time, responsibleName, responsiblePhone, requisitationNumber, price, note, userId], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).json({error: err});
        }

        return res.status(200).json(result);
    })
}

const updateScheduling = async function(req, res){

    const { date, time, requisitationNumber, price, note } = req.body;
    const scheduleId = req.params.id;
    const sql = "UPDATE scheduling SET date = ?, id_time = ?, requisitation_number = ?, price = ?, note = ? WHERE scheduling.id = ?";

    console.debug("new update scheduling", scheduleId);

    db.query(sql, [date, time, requisitationNumber, price, note, scheduleId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({error: err});
        }
        console.debug("ok", result);
        return res.status(200).json(result);
    })
}

const finishScheduling = async function(req, res){
    const { userId } = req.body;
    const scheduleId = req.params.id;

    const sql = "UPDATE scheduling SET id_status = 3, id_user = ? WHERE id = ?";
    db.query(sql, [userId, scheduleId], (err, result) => {
        if(err) {
            console.log(err)
            return res.status(500).json({error: err});
        }
        return res.status(200).json(result)
    });
}

const meetScheduling = async function(req, res){
    const { userId } = req.body;
    const scheduleId = req.params.id;

    const sql = "UPDATE scheduling SET id_status = 2, id_user = ? WHERE id = ?";
    db.query(sql, [userId, scheduleId], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).json({error: err});
        }

        return res.status(200).json(result);
    })
}

const reopenScheduling = async function(req, res){
    const scheduleId = req.params.id;

    const sql = "UPDATE scheduling SET id_status = 1, id_user = NULL WHERE id = ?";

    db.query(sql, [scheduleId], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).json({error: err});
        }

        return res.status(200).json(result);
    })
}

const selectSchedulings = async function(req, res){
    const sql = "SELECT scheduling.id schedule_id, scheduling.patient_name, scheduling.address, scheduling.neighborhood, scheduling.number, scheduling.cep, scheduling.phone, scheduling.date, scheduling.price, scheduling.requisitation_number, status.name sname, times.hour FROM scheduling INNER JOIN times ON (times.id = scheduling.id_time) INNER JOIN status ON (status.id = scheduling.id_status) WHERE NOT id_status = 3 ORDER BY date ASC, hour ASC";

    db.query(sql, (err, result) => {
        if(err){
            return res.status(500).json({error: err});
        }

        return res.status(200).json(result);
    })
}

const selectSchedulingHistory = async function(req, res){
    const isUnlimited  = req.query.isUnlimited;

    let sql = "SELECT scheduling.id schedule_id, scheduling.patient_name, scheduling.address, scheduling.neighborhood, scheduling.number, scheduling.cep, scheduling.phone, scheduling.date, scheduling.price, scheduling.requisitation_number, user.username, times.hour FROM scheduling INNER JOIN times ON (times.id = scheduling.id_time) INNER JOIN user ON (user.id = scheduling.id_user) WHERE id_status = 3 ORDER BY date DESC, hour DESC";

    if(isUnlimited !== 'true') {
        sql += " LIMIT 10";
    }

    db.query(sql, (err, result) => {
        if(err){
            return res.status(500).json({error: err});
        }

        return res.status(200).json(result);
    })
}

const selectScheduling = async function(req, res){
    const id  = req.params.id;

    const sql = "SELECT scheduling.id schedule_id, scheduling.patient_name, scheduling.cpf, scheduling.birth, scheduling.address, scheduling.neighborhood, scheduling.number, scheduling.cep, scheduling.phone, scheduling.date, scheduling.price, scheduling.requisitation_number, scheduling.responsible_name, scheduling.responsible_phone, scheduling.note, scheduling.id_status, scheduling.id_time time, times.hour FROM scheduling INNER JOIN times ON (times.id = scheduling.id_time) WHERE scheduling.id = ? LIMIT 1";

    db.query(sql, [id], (err, result) => {
        if(err){
            return res.status(500).json({error: err});
        }
        if(result.length == 0){
          return res.status(400).json({error: "User not found!"});
        }

        return res.status(200).json(result);
    })
}

const selectMonthNumbers = async function(req, res){
  const date = new Date();

  let currentDateSplited = date.toLocaleDateString('pt-br', {
    year: "numeric",
    month: '2-digit',
    day: '2-digit',
  }).split("/");

  let currentDate = currentDateSplited[2] + '-' + currentDateSplited[1] + '-' + currentDateSplited[0];
  let currentYearAndMonth =  currentDateSplited[2] + '-' + currentDateSplited[1] + '%';
  const firstDayOfTheWeek = getFirstDayOfTheWeek(date);
  const lastDayOfTheWeek = getLastDayOfTheWeek(date);
  let finalCardData = {
    currentDay: {
      total: 0,
      finished: 0
    },
    currentWeek: { 
      total: 0,
      finished: 0},
    currentMonth: {
      total: 0,
      finished: 0
    }
  }

  const sqlCurrenDate = "SELECT count(*) as qtd, id_status FROM scheduling WHERE date = ? GROUP BY id_status";
  const sqlCurrentWeek = "SELECT count(*) as qtd, id_status FROM scheduling WHERE date BETWEEN ? AND ? GROUP BY id_status";
  const sqlCurrentMonth = "SELECT count(*) as qtd, id_status FROM scheduling WHERE date LIKE ? GROUP BY id_status";

  db.query(sqlCurrenDate, [currentDate], (err, result) => {
    result.map((data)=> {
      finalCardData.currentDay.total += data.qtd;
      if(data.id_status == 3) {
        finalCardData.currentDay.finished += data.qtd;
      }
    })

    db.query(sqlCurrentWeek, [firstDayOfTheWeek, lastDayOfTheWeek], (err, result) => {
      result.map((data)=> {
        finalCardData.currentWeek.total += data.qtd;
        if(data.id_status == 3) {
          finalCardData.currentWeek.finished += data.qtd;
        }
      })

      db.query(sqlCurrentMonth, [currentYearAndMonth], (err, result) => {
        result.map((data)=> {
          finalCardData.currentMonth.total += data.qtd;
          if(data.id_status == 3) {
            finalCardData.currentMonth.finished += data.qtd;
          }
        })
        console.log(finalCardData);
        return res.json(finalCardData);
      })
    })
  })
}

function selectDateIntervalData(initialDate, finalDate){
  return new Promise((resolve, reject) => {
    const sql = "SELECT count(*) as total, id_status as status, SUM(price) as amount FROM scheduling WHERE date BETWEEN ? AND ? GROUP BY id_status";

    db.query(sql, [initialDate, finalDate], (err, result) => {
      return err ? reject(err) : resolve(result);
    })
  })
}

function selectTecniciansReportData(initialDate, finalDate){
  return new Promise((resolve, reject) => {
    const sql = "SELECT count(*) as total, SUM(scheduling.price) as amount, id_user as uid, user.username FROM scheduling INNER JOIN user ON (user.id = scheduling.id_user) WHERE DATE BETWEEN ? AND ? GROUP BY id_user ORDER BY total DESC";

    db.query(sql, [initialDate, finalDate], (err, result) => {
      return err ? reject(err) : resolve(result);
    });
  })
}

function selectGreetersReportData(initialDate, finalDate){
  return new Promise((resolve, reject) => {
    const sql = "SELECT count(*) as total, user.id, user.username FROM scheduling INNER JOIN user ON (user.id = scheduling.id_greeter) WHERE date BETWEEN ? AND ? GROUP BY scheduling.id_greeter ORDER BY total DESC";

    db.query(sql, [initialDate, finalDate], (err, result) => {
      return err ? reject(err) : resolve(result);
    })
  })
}

const selectTimes = async function(req, res){
  const sql = "SELECT times.id, times.hour, times.status, count(id_time) as total FROM times LEFT JOIN scheduling ON (times.id = scheduling.id_time) GROUP BY times.id ORDER BY hour";
  db.query(sql, (err, result) => {
    if(err){
      console.log(err);
      return res.status(500).json({error: err})
    }

    return res.status(200).json(result)
  })
}

const selectAvailableTimes = async function(req, res){
  console.log("passei aq")
  const date = req.params.dateOfCollect;
  const scheduleId = req.params.scheduleId;
  console.debug("scheduleId", scheduleId);
  let sql = "SELECT id, hour FROM times WHERE NOT id IN (SELECT id_time FROM scheduling WHERE date = ?";
  if(scheduleId !== undefined){
    sql += " AND NOT id = ?";
  }
  sql += ") ORDER BY hour ASC";
  
  db.query(sql, [date, scheduleId], (err, result) => {
    if(err){
      return res.status(400).json({error: err})
    }

    return res.status(200).json(result);
  })
}

const inactivateHorary = async function(req, res){
  const id = req.params.id;
  const sql = "UPDATE times SET status = 0 WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if(err){
      return res.status(500).json({error: err})
    }

    return res.status(200).json(result)
  })
}

const insertUser = async function(req, res){
  const { username, password, role } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    const sql = "INSERT INTO user (username, password, role) VALUES (?,?,?)";

    db.query(sql, [username, hash, role], (err, result) => {
      if(err){
        if(err.errno == 1062) {
          return res.json({status: "failed", error: "User already exists", code: 1062});
        }
        console.log(err);
        return res.status(500).json({error: err});
      }

      return res.status(200).json(result);
    })
  })
}

const selectUsers = async function(req, res){
  const sql = "SELECT user.id uid, user.username, user.active, role.name rname FROM user INNER JOIN role ON (role.id = user.role) ORDER BY user.active DESC, user.username ASC";

  db.query(sql, (err, result) => {
    if(err) {
      console.log(err);
      return res.status(500).json({error: err});
    } 

    return res.status(200).json(result);
  })
}

const updateUser = async function(req, res){
  const { username, role, newPassword } = req.body;
  const userId = req.params.id;

  if(newPassword !== undefined) {
    bcrypt.hash(newPassword, 10).then((hash) => { 
      const sql = "UPDATE user SET username = ?, role = ?, password = ? WHERE id = ?";

      db.query(sql, [username, role, hash, userId], (err, result) => {
        if(err){
          if(err.errno == 1062){
            return res.json({status: "failed", error: "Username already exists!", code: 1062})
          }

          return res.status(500).json({error: err});
        }

        return res.status(200).json(result);
      })
    });
    
  } else {
    const sql = "UPDATE user SET username = ?, role = ? WHERE id = ?";

    db.query(sql, [username, role, userId], (err, result) => {
      if(err){
        if(err.errno == 1062){
          return res.json({status: "failed", error: "Username already exists!", code: 1062})
        }

        return res.status(500).json({error: err});
      }

      return res.status(200).json(result);
    })
  }
}

const inactivateUser = async function(req, res){
  const userId = req.params.id;

  sql = "UPDATE user SET active = 0 WHERE id = ?";

  db.query(sql, [userId], (err, result) => {
    if(err){
      console.log(err);
      return res.status(500).json({error: err});
    } 

    return res.status(200).json(result);
  })
}

const activateUser = async function(req, res){
  const userId = req.params.id;

  sql = "UPDATE user SET active = 1 WHERE id = ?";

  db.query(sql, [userId], (err, result) => {
    if(err){
      console.log(err);
      return res.status(500).json({error: err});
    }

    return res.status(200).json(result);
  })

}

const selectUser = async function(req, res){
  const userId = req.params.id;

  const sql = "SELECT user.username, user.active, user.role, role.name rname FROM user INNER JOIN role ON (role.id = user.role) WHERE user.id = ? LIMIT 1";

  db.query(sql, [userId], (err, result) => {
    if(err){
      console.log(err);
      return res.status(500).json({error: err});
    }
    
    return res.status(200).json(result);
  })
}

const selectRoles = async function(req, res){
  const sql = "SELECT * FROM role";

  db.query(sql, (err, result) => {
    if(err){
      console.log(err);
      return res.status(500).json({error: err});
    }

    return res.status(200).json(result);
  })
}


function selectUserDataForLogin(username){
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, username, role, password FROM user WHERE username = ? LIMIT 1";

    db.query(sql, [username], (err, result) => {
      if(err){
        console.log(err);
        return reject(null);
      }

      return resolve(result[0]);
    })
  })
}


function selectUserRole(userId){
    return new Promise((resolve, reject) => {
        const sql = "SELECT role FROM user WHERE id = ?";

        db.query(sql, [userId], (err, result) => {
            return err ? reject(null) : resolve(result[0].role);
        })
    })
}

module.exports = { insertScheduling, updateScheduling, finishScheduling, meetScheduling, reopenScheduling, selectSchedulings, selectUserRole, selectSchedulingHistory, selectScheduling, selectMonthNumbers, selectTimes, selectAvailableTimes, inactivateHorary,  insertUser, selectUsers, updateUser, inactivateUser, activateUser, selectUser, selectRoles, selectUserDataForLogin, selectDateIntervalData, selectTecniciansReportData, selectGreetersReportData };