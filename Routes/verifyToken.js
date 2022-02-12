const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	console.log(req.body);
	if (req.headers["x-access-token"]) {
		const accessToken = req.headers["x-access-token"].split(" ")[1];
		jwt.verify(accessToken, process.env.JWT_SEC, (err, user) => {
			if (err) return next(new Error("verifyToken",403,"Token is not valid"));
			else {
				req.user = user;
                console.log(user);
				next();
			}
		});
	} else {
		return next(new Error("verifyToken",401,"You are not Authenticated"));
	}
};

const verifyTokenAndAuthorization = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.id === req.params.userId || req.user.id == req.body.userId) {
			next();
		} else {
			// const error 
			return next(new Error("verifyToken",403,"You are not allowed to do that"));
		}
	});
};

module.exports = {
	verifyToken, 
	verifyTokenAndAuthorization
}