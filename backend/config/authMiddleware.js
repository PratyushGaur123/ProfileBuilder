const jwt = require('jsonwebtoken');
module.exports.userAuth = function (req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const words = token.split(" ");

        if (words.length !== 2 || !words[1]) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const jwtToken = words[1];

        const decoded = jwt.verify(jwtToken, process.env.CODEIAL_JWT_SECRET);
        req.user = decoded.id ;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }
}
