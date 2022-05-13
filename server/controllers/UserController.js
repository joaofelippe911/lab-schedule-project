const bcrypt = require("bcrypt");
const { db } = require('../db');

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

  function selectUserDataForLogin(username){
    return new Promise((resolve, reject) => {
      const sql = "SELECT id, username, role, active, password FROM user WHERE username = ? LIMIT 1";
  
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

  module.exports = { insertUser, selectUsers, updateUser, inactivateUser, activateUser, selectUser, selectUserDataForLogin, selectUserRole }