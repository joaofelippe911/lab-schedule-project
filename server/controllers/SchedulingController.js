const { db } = require('../db');
const { getFirstAndLastDayOfTheWeek } = require("../utils/dates");

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
    const finishDate = new Date().toLocaleDateString("PT-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).split("/").reverse().join("-");

    const sql = "UPDATE scheduling SET id_status = 3, id_user = ?, finished_at = ? WHERE id = ?";
    db.query(sql, [userId, finishDate, scheduleId], (err, result) => {
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

const cancelScheduling = async function(req, res){
  const scheduleId = req.params.id;

  const sql = "UPDATE scheduling SET id_status = 4, id_user = NULL WHERE id = ?";

  db.query(sql, [scheduleId], (err, result) => {
    if(err){
      console.log(err)
      return res.status(500).json({error: err});
    }

    return res.status(200).json(result);
  })
}

const selectSchedulings = async function(req, res){
    const sql = "SELECT scheduling.id scheduling_id, scheduling.patient_name, scheduling.address, scheduling.neighborhood, scheduling.number, scheduling.cep, scheduling.phone, scheduling.date, scheduling.price, scheduling.requisitation_number, status.name sname, time.hour FROM scheduling INNER JOIN time ON (time.id = scheduling.id_time) INNER JOIN status ON (status.id = scheduling.id_status) WHERE NOT id_status = 3 AND NOT id_status = 4 ORDER BY date ASC, hour ASC";

    db.query(sql, (err, result) => {
        if(err){
            return res.status(500).json({error: err});
        }

        return res.status(200).json(result);
    })
}

const selectSchedulingsHistory = async function(req, res){
    const isUnlimited  = req.query.isUnlimited;

    let sql = "SELECT scheduling.id scheduling_id, scheduling.patient_name, scheduling.address, scheduling.neighborhood, scheduling.number, scheduling.cep, scheduling.phone, scheduling.date, scheduling.price, scheduling.requisitation_number, scheduling.id_status as status, user.username, time.hour FROM scheduling INNER JOIN time ON (time.id = scheduling.id_time) LEFT JOIN user ON (user.id = scheduling.id_user) WHERE id_status = 3 OR id_status = 4 ORDER BY date DESC, hour DESC";

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

    const sql = "SELECT scheduling.id scheduling_id, scheduling.patient_name, scheduling.cpf, scheduling.birth, scheduling.address, scheduling.neighborhood, scheduling.number, scheduling.cep, scheduling.phone, scheduling.date, scheduling.price, scheduling.requisitation_number, scheduling.responsible_name, scheduling.responsible_phone, scheduling.note, scheduling.id_status, scheduling.id_time time, time.hour FROM scheduling INNER JOIN time ON (time.id = scheduling.id_time) WHERE scheduling.id = ? LIMIT 1";

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
  
    const currentDateSplited = date.toLocaleDateString('pt-br', {
      year: "numeric",
      month: '2-digit',
      day: '2-digit',
    }).split("/");
    
    const currentYearAndMonth =  currentDateSplited[2] + '-' + currentDateSplited[1] + '%';
    const currentDate = currentDateSplited.reverse().join("-");
    const { firstDayOfTheWeek, lastDayOfTheWeek } = getFirstAndLastDayOfTheWeek();

    const finalCardData = {
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
      const sql = "SELECT count(*) as total, SUM(scheduling.price) as amount, id_user as uid, user.username FROM scheduling INNER JOIN user ON (user.id = scheduling.id_user) WHERE (finished_at BETWEEN ? AND ?) AND (id_status = 3) GROUP BY id_user ORDER BY total DESC";
  
      db.query(sql, [initialDate, finalDate], (err, result) => {
        return err ? reject(err) : resolve(result);
      });
    })
  }
  
  function selectGreetersReportData(initialDate, finalDate){
    initialDate += " 00:00:00:000";
    finalDate += " 23:59:59:998";
    return new Promise((resolve, reject) => {
      const sql = "SELECT count(*) as total, user.id, user.username FROM scheduling INNER JOIN user ON (user.id = scheduling.id_greeter) WHERE created_at BETWEEN ? AND ? GROUP BY scheduling.id_greeter ORDER BY total DESC";
  
      db.query(sql, [initialDate, finalDate], (err, result) => {
        return err ? reject(err) : resolve(result);
      })
    })
  }

module.exports = { insertScheduling, updateScheduling, finishScheduling, meetScheduling, reopenScheduling, cancelScheduling, selectSchedulings, selectSchedulingsHistory, selectScheduling, selectMonthNumbers, selectDateIntervalData, selectTecniciansReportData, selectGreetersReportData }