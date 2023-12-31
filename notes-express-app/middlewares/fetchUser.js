const jwt = require("jsonwebtoken");

const fetchUser = (req, res, next) => {
    const userToken = req.header("user-token");

    if (!userToken) {
        return res.json({ error: "Please authenticate using a valid token" });
    }

    try {
        const string = jwt.verify(userToken, process.env.JWT_SECRET);
        req.user = string.user;
    } catch (error) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    next();
}

module.exports = fetchUser;