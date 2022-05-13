const { Router } = require("express");

const UserController = require('./controllers/UserController');
const TimeController = require('./controllers/TimeController');
const SchedulingController = require('./controllers/SchedulingController');
const RoleController = require('./controllers/RoleController');

const bcrypt = require("bcrypt");
const { createTokens } = require("./JWT");
const { validateToken } = require('./middlewares/validateToken');
const { verifyPermission } = require("./middlewares/verifyPermission");

const router = Router();

router.post("/api/scheduling", [validateToken, verifyPermission([1, 2, 3, 4])], SchedulingController.insertScheduling);

router.get("/api/scheduling/reports/:initialDate/:finalDate", [validateToken, verifyPermission([1, 3])], async (req, res) => {
  const { initialDate, finalDate } = req.params;

  console.log(initialDate, finalDate);

  const formatedInitialDate = initialDate.split("-").reverse().join("-");

  const formatedFinalDate = finalDate.split("-").reverse().join("-");

  const generalData = await SchedulingController.selectDateIntervalData(formatedInitialDate, formatedFinalDate);

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

  const tecniciansData = await SchedulingController.selectTecniciansReportData(formatedInitialDate, formatedFinalDate);

  finalData.tecnicians = tecniciansData;

  const greetersData = await SchedulingController.selectGreetersReportData(formatedInitialDate, formatedFinalDate);

  finalData.greeters = greetersData;

  console.log(initialDate, finalDate);
  return res.status(200).json(finalData);
})

router.patch("/api/scheduling/:id", [validateToken, verifyPermission([1, 2, 3, 4])], SchedulingController.updateScheduling);

router.patch("/api/scheduling/finish/:id", [validateToken, verifyPermission([1, 2, 3])], SchedulingController.finishScheduling);

router.patch("/api/scheduling/meet/:id", [validateToken, verifyPermission([1, 2, 3])], SchedulingController.meetScheduling);

router.patch("/api/scheduling/reopen/:id", [validateToken, verifyPermission([1, 2, 3])], SchedulingController.reopenScheduling);

router.patch("/api/scheduling/cancel/:id", [validateToken, verifyPermission([1, 2, 3])], SchedulingController.cancelScheduling);

router.get("/api/scheduling/", [validateToken, verifyPermission([1, 2, 3, 4])], SchedulingController.selectSchedulings)

router.get("/api/scheduling/history", [validateToken, verifyPermission([1, 2, 3, 4])], SchedulingController.selectSchedulingsHistory);

router.get("/api/scheduling/month-numbers", [validateToken, verifyPermission([1, 2, 3, 4])], SchedulingController.selectMonthNumbers);

router.get("/api/scheduling/:id", [validateToken, verifyPermission([1, 2, 3, 4])], SchedulingController.selectScheduling);

router.get("/api/scheduling/times/:dateOfCollect/:schedulingId?", [validateToken, verifyPermission([1, 2, 3, 4])], TimeController.selectAvailableTimes);

router.post("/api/user/", [validateToken, verifyPermission([1, 3])], UserController.insertUser);

router.get("/api/user/", [validateToken, verifyPermission([1, 3])], UserController.selectUsers);

router.patch("/api/user/:id", [validateToken, verifyPermission([1, 3])], UserController.updateUser);

router.patch("/api/user/inactivate/:id", [validateToken, verifyPermission([1, 3])], UserController.inactivateUser);

router.patch("/api/user/activate/:id", [validateToken, verifyPermission([1, 3])], UserController.activateUser);

router.get("/api/user/:id", [validateToken, verifyPermission([1, 3])], UserController.selectUser);

router.get("/api/role", [validateToken, verifyPermission([1, 3])], RoleController.selectRoles);

router.get("/api/time/", [validateToken, verifyPermission([1, 2, 3])], TimeController.selectTimes);

router.post("/api/time/", [validateToken, verifyPermission([1, 2, 3])], TimeController.insertTime);

router.patch("/api/time/inactivate/:id", [validateToken, verifyPermission([1, 2, 3])], TimeController.inactivateTime);

router.patch("/api/time/activate/:id", [validateToken, verifyPermission([1, 2, 3])], TimeController.activateTime);

router.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;

  const userData = await UserController.selectUserDataForLogin(username);

  if(!userData){
    return res.status(400).json({error: "Usuário não existe!"});
  }
  
  const dbPassword = userData['password'];

  bcrypt.compare(password, dbPassword).then((match) => {
    if(!match) {
      return res.status(401).json({error: "Usuário ou senha incorretos!"});
    }

    if(userData.active !== 1){
      return res.status(401).json({error: "Usuário inativo!"})
    }

    const accessToken = createTokens(userData);

    res.cookie("access-token", accessToken, {
        maxAge: 60*60*12*1000,
        httpOnly: true
    });

    res.cookie("user-id", userData['id'], {
      maxAge: 60*60*12*1000,
      httpOnly: true
    })

    return res.json({
      auth: true, 
      user: {
        id: userData['id'],
        name: userData['username'],
        role: userData['role']
      }
    });
  })
});

router.get("/verifyAuthentication", validateToken, async (req, res) => {
  res.status(200).json({isAuthenticated: true});
})

router.get("/deleteCookie", async (req, res) => {
  res.status(200).clearCookie('access-token').clearCookie('user-id').send('Cookie deleted');
})

module.exports = { router }