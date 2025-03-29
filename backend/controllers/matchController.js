const axios = require('axios');
const User = require("../models/User");
const ContestPool = require("../models/ContestPool");


exports.getUpcomingMatch = async (req, res) => {
    const url = "https://www.hindustantimes.com/static-content/10s/cricket-liupre.json";

    try {
        const response = await axios.get(url);
        const data = response.data;

        // Filter matches for IPL 2025
        const upcomingMatches = data.upcoming
            .filter(match => match.seriesname === "Indian Premier League, 2025")
            .map(match => ({
                matchId: match.matchId,
                teams: `${match.teama} vs ${match.teamb}`,
                teama_short: `${match.teama_short} vs ${match.teamb_short}`,
                date: match.matchdate_ist,
                time: match.matchtime_ist,
                venue: match.venue,
                series: match.seriesname,
                matchType: match.matchtype,
                matchfile: match.matchfile
            }));

        res.status(200).json({
            success: true,
            count: upcomingMatches.length,
            matches: upcomingMatches
        });
    } catch (error) {
        console.error("Error fetching match data:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching match data" 
        });
    }
};

exports.getUpcomingParGet = async (req, res) => {
    const url = "https://www.hindustantimes.com/static-content/10s/cricket-liupre.json";
    const { Id } = req.params; // Fixed typo

    try {
        const response = await axios.get(url);
        const data = response.data;

        // Filter matches for IPL 2025
        const upcomingMatches = data.upcoming
            .filter(match => match.seriesname === "Indian Premier League, 2025")
            .filter(match => match.matchfile === Id) // Proper filtering condition
            .map(match => ({
                matchId: match.matchId,
                teams: `${match.teama} vs ${match.teamb}`,
                teama_short: `${match.teama_short} vs ${match.teamb_short}`,
                date: match.matchdate_ist,
                time: match.matchtime_ist,
                venue: match.venue,
                series: match.seriesname,
                matchType: match.matchtype,
                matchfile: match.matchfile
            }));

        res.status(200).json({
            upcomingMatches
        });
    } catch (error) {
        console.error("Error fetching match data:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching match data" 
        });
    }
};




exports.getMatchById = async (req, res) => {
    const  {matchId} = req.params;
    const url = `https://www.hindustantimes.com/static-content/10s/cricket-liupre-7126.json`;
    try {
        const response = await axios.get(url);
        const data = response.data;

        const match = data.live.find(match => match.matchfile === matchId) || 
                     data.upcoming.find(match => match.matchfile === matchId) || 
                     data.results.find(match => match.matchfile === matchId);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        res.status(200).json(match);
    } catch (error) {
        console.error("Error fetching match data:", error);
        res.status(500).json({ message: "Error fetching match data" });
    }
}

exports.getLiveScore = async (req, res) => {
    const url = "https://www.hindustantimes.com/static-content/10s/cricket-liupre-7126.json";

    try {
        const response = await axios.get(url);
        const data = response.data;

        // Filter to get only live matches and extract key information
        const liveMatches = data.live.map(match => ({
            matchId: match.matchId,
            teams: {
                team1: match.teamlist[0].name_Full,
                team2: match.teamlist[1].name_Full,
                shortNames: {
                    team1: match.teamlist[0].name_Short,
                    team2: match.teamlist[1].name_Short
                }
            },
            status: match.matchdetail.status,
            venue: match.matchdetail.venue.name,
            toss: match.matchdetail.equation,
            currentInnings: {
                battingTeam: match.innings[0].battingteam === match.teamlist[0].team_Id 
                    ? match.teamlist[0].name_Short 
                    : match.teamlist[1].name_Short,
                score: match.innings[0].total,
                wickets: match.innings[0].wickets,
                overs: match.innings[0].overs,
                runRate: match.innings[0].runrate
            },
            timestamp: data.timestamp
        }));

        res.status(200).json({
            liveMatches: liveMatches,
            totalLiveMatches: liveMatches.length
        });
    } catch (error) {
        console.error("Error fetching live scores:", error);
        res.status(500).json({ message: "Error fetching live scores" });
    }
};


exports.getPlayerStats = async (req, res) => {
    const { Id } = req.params; 
    const url = `https://www.hindustantimes.com/static-content/10s/${Id}.json`;
    
    try {
        const response = await axios.get(url);
        const data = response.data;

        const teamStats = Object.keys(data.Teams).reduce((acc, teamId) => {
            const team = data.Teams[teamId];
            acc[teamId] = {
                Name_Full: team.Name_Full,
                Name_Short: team.Name_Short,
                Players: Object.keys(team.Players).reduce((playerAcc, playerId) => {
                    const player = team.Players[playerId];
                    const formattedName = player.Name_Full.toLowerCase().replace(/\s+/g, '-');
                    
                    playerAcc[playerId] = {
                        Name_Full: player.Name_Full,
                        Image: `https://www.hindustantimes.com/static-content/1y/cricket-logos/players/${formattedName}.png`,
                        Role: player.Role,
                        Batting: {
                            Runs: player.Batting.Runs,
                            Average: player.Batting.Average,
                            Strikerate: player.Batting.Strikerate
                        },
                        Bowling: {
                            Wickets: player.Bowling.Wickets,
                            Average: player.Bowling.Average,
                            Economyrate: player.Bowling.Economyrate
                        }
                    };

                    return playerAcc;
                }, {})
            };
            return acc;
        }, {});

        res.status(200).json(teamStats);
    } catch (error) {
        console.error("Error fetching player stats:", error);
        res.status(500).json({ message: "Error fetching player stats" });
    }
};

exports.getPlayerPicture = async (req, res) => {
    const name = "Virat Kohli";
const formattedName = name.toLowerCase().replace(/\s+/g, '-');
const url = `https://www.hindustantimes.com/static-content/1y/cricket-logos/players/${formattedName}.png`;


    res.status(200).json({ imageUrl: url });
}

exports.SaveTeams = async (req, res) => {
    try {
      const paymentData = req.body;
      const user = req.user; // From authentication middleware
  

  
      // Validate required fields
      if (
        !paymentData ||
        !paymentData.paymentId ||
        !paymentData.matchId ||
        !paymentData.contestId ||
        !paymentData.selectedPlayers ||
        !paymentData.captain ||
        !paymentData.viceCaptain ||
        !paymentData.matchDetails
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment data provided',
        });
      }
  
      // Prepare team data to match TeamSchema
      const teamData = {
        paymentId: paymentData.paymentId,
        amount: paymentData.amount || 0,
        matchId: paymentData.matchId,
        contestId: paymentData.contestId,
        selectedPlayers: paymentData.selectedPlayers.map((player) => ({
          name: player.name,
          team: player.team,
          selectedBy: player.selectedBy,
          points: player.points,
          credits: player.credits,
          status: player.status,
          playedLastMatch: player.playedLastMatch,
          selected: player.selected,
          image: player.image,
        })),
        captain: paymentData.captain,
        viceCaptain: paymentData.viceCaptain,
        matchDetails: {
          matchId: paymentData.matchDetails.matchId,
          teams: paymentData.matchDetails.teams,
          teama_short: paymentData.matchDetails.teama_short,
          date: paymentData.matchDetails.date,
          time: paymentData.matchDetails.time,
          venue: paymentData.matchDetails.venue,
          series: paymentData.matchDetails.series,
          matchType: paymentData.matchDetails.matchType,
          matchfile: paymentData.matchDetails.matchfile,
        },
      };
  
      // Prepare transaction data to match TransactionSchema
      const transactionData = {
        type: 'Buy teams',
        date: new Date(), // Will be overridden by default Date.now if not specified
        rupees: paymentData.amount || 0,
        state: 'completed',
      };
  
      // Update user with both team and transaction data
      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        {
          $push: {
            yourTeams: teamData, // Add new team to yourTeams array
            transactionHistory: transactionData, // Add new transaction to transactionHistory array
          },
        },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Team and transaction saved successfully',
        team: teamData,
        transaction: transactionData, // Optionally return transaction data in response
      });
    } catch (error) {
      console.error('Error saving team and transaction:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  };


  exports.getPlayerTeamDetail = async (req, res) => {
    try {
        const { teamId } = req.params;  
        const user = req.user;

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not authenticated' 
            });
        }
         const currentUser = await User.findById(user.id)
        const team = currentUser.yourTeams.find(team => team.paymentId === teamId);

        if (!team) {
            return res.status(404).json({ 
                success: false, 
                message: 'Team not found' 
            });
        }

        return res.status(200).json({
            success: true,
            data: team
        });

    } catch (error) {
        console.error('Error in getPlayerTeamDetail:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message 
        });
    }
};

exports.getAllTeamData = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not authenticated' 
            });
        }

        // Find user and populate their teams with necessary data
        const currentUser = await User.findById(user.id).select('yourTeams'); // Only return teams data

        if (!currentUser) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        if (!currentUser.yourTeams || currentUser.yourTeams.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No teams found for this user' 
            });
        }

        return res.status(200).json({
            success: true,
            data: currentUser.yourTeams // Return just the teams array
        });

    } catch (error) {
        console.error('Error in getAllTeamData:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message 
        });
    }
};




  exports.getIPLnewshi = async (req, res) => {
    try {
      const url = 'https://personalize.hindustantimes.com/ht-cricket-feed?propertyId=ht&platformId=web&numStories=7&subscriber=false&offset=1&htfpId=WINHTVAN90341742411552';
  
      const response = await axios.get(url);
      const data = response.data;
  
      const filteredData = data.items.map(item => ({
        title: item.title,
        thumbnailURL: item.thumbnailURL,
        link: item.link,           // Keeping link as it might be important for frontend
        author: item.author,       // Author could be useful info
        published: item.published, // Published date might be relevant
        likeCount: item.likeCount  // Like count as an indicator of popularity
      }));
  
      res.status(200).json({
        status: 'success',
        items: filteredData
      });
    } catch (error) {
      console.error('Error fetching IPL news:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch IPL news'
      });
    }
  };


  exports.getMyMatchesHome = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find user and project only the required fields from yourTeams
        const user = await User.findById(userId, {
            'yourTeams.paymentId': 1,
            'yourTeams.matchId': 1,
            'yourTeams.matchDetails': 1,
            'yourTeams.createdAt': 1
        }).lean();

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Extract and format the teams data with only the required fields
        const formattedTeams = user.yourTeams.map(team => ({
            paymentId: team.paymentId,
            matchId: team.matchId,
            matchDetails: team.matchDetails,
            createdAt: team.createdAt
        }));

        // Sort teams by createdAt in descending order (newest first)
        const sortedTeams = formattedTeams.sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json({
            success: true,
            data: {
                teams: sortedTeams
            }
                });

    } catch (error) {
        console.error('Error fetching user matches:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching user matches',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


exports.getMyContest = async (req, res) => {
  try {
      const userId = req.user.id;

      // Get user details
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ 
              success: false, 
              message: 'User not found' 
          });
      }

      // Find all contest pools where user is a participant
      const contestPools = await ContestPool.find({
          'participants.userId': userId
      }).lean();

      if (!contestPools || contestPools.length === 0) {
          return res.status(404).json({ 
              success: false, 
              message: 'No contest pools found for this user' 
          });
      }

      // Calculate total winnings
      let totalWinnings = 0;
      let totalContests = 0;
      let wonContests = 0;
      let lostContests = 0;
      let pendingContests = 0;

      // Format the response data
      const formattedContests = contestPools.map(contest => {
          const userParticipation = contest.participants.find(
              p => p.userId.toString() === userId.toString()
          );

          // Update statistics
          totalContests++;
          if (userParticipation.playstatus === 'win') {
              wonContests++;
              totalWinnings += userParticipation.winamount;
          } else if (userParticipation.playstatus === 'lose') {
              lostContests++;
          } else {
              pendingContests++;
          }

          return {
              name: user.name,
              contestId: contest.contestId,
              matchId: contest.matchId,
              status: contest.status,
              joinedAt: userParticipation.joinedAt,
              rank: userParticipation.rank,
              score: userParticipation.score,
              totalSpots: contest.totalSpots,
              entryFee: contest.entryFee,
              originalFee: contest.originalFee,
              prizePool: contest.prizePool,
              maxEntriesPerUser: contest.maxEntriesPerUser,
              spotsLeft: contest.spotsLeft,
              teamId: userParticipation.teamId,
              playstatus: userParticipation.playstatus,
              winamount: userParticipation.winamount,
              additionalPrize: contest.additionalPrize,
              totalWinnings
          };
      });

      // Sort contests by joinedAt (newest first)
      formattedContests.sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));

      res.status(200).json({
          success: true,
          data: {
              contests: formattedContests
          },
          message: 'User contests fetched successfully'
      });

  } catch (error) {
      console.error('Error fetching user contests:', error);
      res.status(500).json({
          success: false,
          message: 'Internal server error while fetching user contests',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
  }
};


exports.getUserTeams = async (req, res) => {
  try {
      const userId = req.user.id;

      // Find user with teams populated and match details
      const user = await User.findById(userId)
          .select('yourTeams name')
          .lean();

      if (!user) {
          return res.status(404).json({ 
              success: false, 
              message: 'User not found' 
          });
      }

      if (!user.yourTeams || user.yourTeams.length === 0) {
          return res.status(200).json({ 
              success: true, 
              data: {
                  user: {
                      name: user.name,
                      totalTeams: 0,
                      totalSpent: 0
                  },
                  teams: [] 
              },
              message: 'User has no teams created yet' 
          });
      }

      // Calculate stats
      const totalSpent = user.yourTeams.reduce((sum, team) => sum + team.amount, 0);
      
      // Format response with additional calculated fields
      const formattedTeams = user.yourTeams.map(team => {
          // Calculate team value
          const teamValue = team.selectedPlayers.reduce(
              (sum, player) => sum + player.credits, 0
          );

          return {
              teamId: team._id,
              paymentId: team.paymentId,
              amount: team.amount,
              matchId: team.matchId,
              contestId: team.contestId,
              captain: team.captain,
              viceCaptain: team.viceCaptain,
              createdAt: team.createdAt,
              teamValue,
              matchDetails: team.matchDetails,
              players: team.selectedPlayers.map(player => ({
                  name: player.name,
                  team: player.team,
                  credits: player.credits,
                  points: player.points,
                  status: player.status,
                  isCaptain: player.name === team.captain,
                  isViceCaptain: player.name === team.viceCaptain,
                  image: player.image
              }))
          };
      });

      // Sort teams by createdAt (newest first)
      formattedTeams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      res.status(200).json({
          success: true,
          data: {
              user: {
                  name: user.name,
                  totalTeams: user.yourTeams.length,
                  totalSpent,
                  lastTeamCreated: user.yourTeams.length > 0 
                      ? user.yourTeams[0].createdAt 
                      : null
              },
              teams: formattedTeams
          },
          message: 'User teams fetched successfully'
      });

  } catch (error) {
      console.error('Error fetching user teams:', error);
      res.status(500).json({
          success: false,
          message: 'Internal server error while fetching user teams',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
  }
};








exports.update10X = async (req, res) => {
  try {
    // Get authenticated user
    const usered = req.user;
    if (!usered) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }

    // Find user and populate teams
    const user = await User.findById(usered.id).populate('yourTeams');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const teams = user.yourTeams;
    if (!teams || teams.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No teams found for user'
      });
    }

    // Update playing history
    const uniqueMatchIds = new Set(teams.map(team => team.matchId));
    user.playingHistory.contests = teams.length;
    user.playingHistory.matches = uniqueMatchIds.size;
    user.playingHistory.series = 1; // Update this logic if you have series data
    user.playingHistory.sports = 1;

    // Process each team
    for (const team of teams) {
      let contestPool = await ContestPool.findOne({ 
        contestId: team.contestId,
        matchId: team.matchId 
      });

      // Fetch match status and data
      const statusUrl = 'https://www.hindustantimes.com/static-content/10s/cricket-liupre-7126.json';
      const matchUrl = `https://www.hindustantimes.com/static-content/10s/${team.matchId}.json`;
      let matchStatus = 'upcoming';
      let matchData;

      try {
        // Get match status
        const statusResponse = await axios.get(statusUrl);
        const statusData = statusResponse.data;
        const liveMatch = statusData.live?.find(match => match.matchfile === team.matchId);
        const upcomingMatch = statusData.upcoming?.find(match => match.matchfile === team.matchId);

        if (liveMatch) matchStatus = 'active';
        else if (upcomingMatch) matchStatus = 'upcoming';

        // Get detailed match data if active or completed
        if (matchStatus === 'active' || (contestPool && contestPool.status === 'completed')) {
          const matchResponse = await axios.get(matchUrl);
          matchData = matchResponse.data;
        }
      } catch (apiError) {
        console.error('API fetch error:', apiError.message);
      }

      // Create new contest pool if it doesn't exist
      if (!contestPool) {
        contestPool = new ContestPool({
          contestId: team.contestId,
          matchId: team.matchId,
          prizePool: determinePrizePool(team.amount),
          entryFee: team.amount,
          originalFee: team.amount + 10,
          totalSpots: 50000,
          spotsLeft: 50000 - 1,
          maxEntriesPerUser: Math.floor(Math.random() * (8 - 3 + 1)) + 3,
          participants: [{
            userId: user._id,
            teamId: team._id,
            score: 0
          }],
          status: matchStatus,
          link: `/team-selection/${team.matchId}/${team.contestId}`
        });
      } else {
        // Update existing contest pool
        const teamExists = contestPool.participants.some(p => 
          p.teamId.toString() === team._id.toString()
        );

        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        
        if (contestPool.createdAt < fiveDaysAgo && matchStatus !== 'active') {
          contestPool.status = 'completed';
        } else {
          contestPool.status = matchStatus;
        }

        if (!teamExists && contestPool.spotsLeft > 0) {
          const userEntries = contestPool.participants.filter(p => 
            p.userId.toString() === user._id.toString()
          ).length;

          if (userEntries < contestPool.maxEntriesPerUser && contestPool.entryFee === team.amount) {
            contestPool.participants.push({
              userId: user._id,
              teamId: team._id,
              score: 0
            });
            contestPool.spotsLeft -= 1;
          }
        }
      }

      // Calculate scores if match data is available
      if (matchData) {
        let totalTeamScore = 0;
        const updatedPlayers = team.selectedPlayers.map(player => {
          let playerScore = calculatePlayerScore(player, matchData, team);
          
          totalTeamScore += playerScore;
          return { ...player.toObject(), points: playerScore };
        });

        // Update team in user's document
        team.selectedPlayers = updatedPlayers;
        
        // Update participant's score in contest pool
        const participant = contestPool.participants.find(p => 
          p.teamId.toString() === team._id.toString()
        );
        if (participant) {
          participant.score = totalTeamScore;
        }

        // Update contest pool status to completed if match is finished
        if (matchData.Matchdetail.Status === 'Innings Break' || matchData.Matchdetail.Status === 'Completed') {
          contestPool.status = 'completed';
          await updateContestRankings(contestPool);
        }
      }

      await contestPool.save();
    }

    await user.save();
    return res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error('Error in update10X:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    });
  }
};

// Helper function to calculate individual player score
const calculatePlayerScore = (player, matchData, team) => {
  let score = 0;

  // Batting points
  const batsman = matchData.Innings[0]?.Batsmen.find(b => b.Batsman === player._id?.toString());
  if (batsman) {
    score += parseInt(batsman.Runs || 0); // 1 point per run
    score += parseInt(batsman.Fours || 0) * 1; // 1 extra point per four
    score += parseInt(batsman.Sixes || 0) * 2; // 2 extra points per six
    
    const strikeRate = parseFloat(batsman.Strikerate || 0);
    if (strikeRate > 150) score += 10;
    else if (strikeRate > 120) score += 5;
  }

  // Bowling points
  const bowler = matchData.Innings[0]?.Bowlers.find(b => b.Bowler === player._id?.toString());
  if (bowler) {
    score += parseInt(bowler.Wickets || 0) * 25; // 25 points per wicket
    score += parseInt(bowler.Maidens || 0) * 12; // 12 points per maiden
    
    const economy = parseFloat(bowler.Economyrate || 0);
    if (economy < 5) score += 15;
    else if (economy < 7) score += 10;
    else if (economy < 9) score += 5;
  }

  // Fielding points
  const fieldingCount = matchData.Innings[0]?.FallofWickets.filter(f => 
    f.Fielder === player._id?.toString() || f.Fielder1 === player._id?.toString()
  ).length;
  score += fieldingCount * 10;

  // Apply captain/vice-captain multipliers
  if (team.captain === player._id?.toString()) {
    score *= 2;
  } else if (team.viceCaptain === player._id?.toString()) {
    score *= 1.5;
  }

  return score;
};

// Helper function to update contest rankings
const updateContestRankings = async (contestPool) => {
  // Sort participants by score
  const sortedParticipants = contestPool.participants.sort((a, b) => b.score - a.score);
  
  // Assign ranks and winnings
  sortedParticipants.forEach((participant, index) => {
    participant.rank = index + 1;
    participant.winamount = calculateWinnings(participant.rank, contestPool.prizePool);
    participant.playstatus = participant.rank === 1 ? 'win' : 'lose';
  });
};

// Helper function to calculate winnings based on rank
const calculateWinnings = (rank, prizePool) => {
  // Simple distribution logic (customize as needed)
  if (rank === 1) return prizePool * 0.5; // 50% for 1st
  if (rank === 2) return prizePool * 0.3; // 30% for 2nd
  if (rank === 3) return prizePool * 0.2; // 20% for 3rd
  return 0; // No winnings for others
};

// Helper function to determine prize pool
const determinePrizePool = (entryFee) => {
  switch(entryFee) {
    case 29: return 30000000;
    case 19: return 20000000;
    case 59: return 140000000;
    case 65: return 200000000;
    default: return entryFee * 100000;
  }
};