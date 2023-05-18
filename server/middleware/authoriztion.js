const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();

const authorize  = requiredRole => {
    return (req, res, next) => {

        const token = req.header("X-Authorization");

        if(!token) return res.status(401).json({
            message: "X-Authorization header not found",
            status: 401
        })

        try {
            
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY || "jwtPrivateKey")

            if(requiredRole && requiredRole !== decoded.role) return res.status(403).json({
                message: "Access denied. You are not authorized to access this resource!",
                status: 403
            })
            req.user = decoded
            next()
        } 
        catch (err) {
            res.status(400).json({
                message: "Invalid token",
                status: 400
            })      
        }
    }
}

module.exports = authorize