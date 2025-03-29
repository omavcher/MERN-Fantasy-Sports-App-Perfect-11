const express = require('express');
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/get-upcoming',authMiddleware , matchController.getUpcomingMatch);
router.get('/upcoming/:Id' ,authMiddleware , matchController.getUpcomingParGet);
router.get('/get/:matchId' ,authMiddleware  , matchController.getMatchById);
router.get('/live-score' ,authMiddleware , matchController.getLiveScore);
router.get('/player-stats/:Id' ,authMiddleware, matchController.getPlayerStats);
router.post("/teams/save",authMiddleware , matchController.SaveTeams);
router.get("/players/show/:teamId",authMiddleware , matchController.getPlayerTeamDetail);
router.get("/ipl-news",authMiddleware, matchController.getIPLnewshi);
router.get("/my-matches",authMiddleware, matchController.getMyMatchesHome);
router.get("/my-contest", authMiddleware, matchController.getMyContest);
router.get("/my-terms", authMiddleware, matchController.getAllTeamData);






router.get("/update10x" , authMiddleware, matchController.update10X);


router.get('/pro',matchController.getPlayerPicture);
module.exports = router; 