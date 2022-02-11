const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
	console.log(authHeader);
	if (req.headers.accessToken) {
		const accessToken = req.headers.accessToken.split(" ")[2];

		jwt.verify(accessToken, process.env.JWT_SEC, (err, user) => {
			if (err) res.status(403).json("Token is not valid");
			else {
				req.user = user;
                console.log(user);
				next();
			}
		});
	} else {
		return res.status(401).json("You are not authenticated");
	}
};

const verifyTokenAndAuthorization = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.id === req.params.user_id || req.user.id == req.body.user_id) {
			next();
		} else {
			res.status(403).json("You are not allowed to do that");
		}
	});
};

