const jwt = require('jsonwebtoken');
const CustomError = require('../errors/CustomError');

const verifyToken = (req, res, next) => {
	if (req.headers["x-access-token"]) {
		const accessToken = req.headers["x-access-token"].split(" ")[1];
		jwt.verify(accessToken, process.env.JWT_SEC, (err, user) => {
			if (err) {
				return next(new CustomError("verifyToken",403,"Token is not valid"));
			}
			else {
				req.user = user;
				next();
			}
		});
	} else {
		return next(new CustomError("verifyToken",401,"You are not Authenticated"));
	}
};

const verifyTokenAndAuthorization = (req, res, next) => {
	verifyToken(req, res, (err) => {
		if(err) return next(err);
		// console.log(req.user)
		if (req.user.id === req.params.userId || req.user.id == req.body.userId || req.query.userId == req.user.id) {
			next();
		} else {
			return next(new CustomError("verifyToken",403,"You are not allowed to do that"));
		}
	});
};

module.exports = {
	verifyToken, 
	verifyTokenAndAuthorization
}