const { db } = require('../db');

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

module.exports = { selectRoles }