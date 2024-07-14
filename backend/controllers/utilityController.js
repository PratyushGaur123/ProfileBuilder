const User = require('../models/user');

module.exports.fetchRandomUsers = async function (req, res){
    try {
        if(!req.user.id){
            return res.status(401).json({
                message: "User not authenticated"
            });
        }
        const randomUsers = await User.find({
            _id: {
                $ne: req.user.id
            }
        }).select('firstName lastName _id email gender').limit(4);

        return res.status(200).json({
            message: "Random Users fetched successfully",
            data: {
                randomUsers
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports.authCheck = async function (req, res) {
    return res.status(200).json({
        message: "Auth Check Successful",
        data: {
            isValid: true
        }
    });
}