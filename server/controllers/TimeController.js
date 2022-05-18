const { db } = require('../db');

const selectTimes = async function(req, res){
    const sql = "SELECT time.id, time.hour, time.status, count(id_time) as total FROM time LEFT JOIN scheduling ON (time.id = scheduling.id_time) GROUP BY time.id ORDER BY hour";
    db.query(sql, (err, result) => {
      if(err){
        console.log(err);
        return res.status(500).json({error: err})
      }
  
      return res.status(200).json(result)
    })
  }
    
  const insertTime = async function(req, res){
    const { hour } = req.body;
    const sql = "INSERT INTO time (hour) VALUES (?)";
  
    db.query(sql, [hour], (err, result) => {
      if(err){
        if(err.errno === 1062) {
          return res.json({error: "Horary already exists!", code: 1062})
        }
        console.log(err);
        return res.status(500).json({error: err});
      }
  
      return res.status(200).json(result);
    })
  }
  
  const selectAvailableTimes = async function(req, res){
    const date = req.params.dateOfCollect;
    const scheduleId = req.params.schedulingId;
    let sql = "SELECT id, hour FROM time WHERE NOT id IN (SELECT id_time FROM scheduling WHERE date = ?";
    if(scheduleId !== undefined){
      sql += " AND NOT id = ?";
    }
    sql += ") AND status = 1 ORDER BY hour ASC";
    
    db.query(sql, [date, scheduleId], (err, result) => {
      if(err){
        return res.status(400).json({error: err})
      }
  
      return res.status(200).json(result);
    })
  }
  
  const inactivateTime = async function(req, res){
    const id = req.params.id;
    const sql = "UPDATE time SET status = 0 WHERE id = ?";
  
    db.query(sql, [id], (err, result) => {
      if(err){
        return res.status(500).json({error: err})
      }
  
      return res.status(200).json(result)
    })
  }
  
  const activateTime = async function(req, res){
    const id = req.params.id;
    const sql = "UPDATE time SET status = 1 WHERE id = ?";
  
    db.query(sql, [id], (err, result) => {
      if(err){
        return res.status(500).json({error: err})
      }
  
      return res.status(200).json(result)
    })
  }

module.exports = { selectTimes, insertTime, selectAvailableTimes, inactivateTime, activateTime }