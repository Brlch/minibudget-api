import jwt from 'jsonwebtoken';
import '../config.js'; 

const jwtSecret = process.env.JWT_SECRET;
console.log("SECRETTTT",jwtSecret);
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];  // because the format is "Bearer <token>"

        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);  // Forbidden
            }

            req.user = user;  // Add user info to request
            next();
        });
    } else {
        res.sendStatus(401);  // Unauthorized
    }
}

export default authenticateJWT;
