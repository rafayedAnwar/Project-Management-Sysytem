const User = require('../Models/userModel');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token required' });
        }
        
        // Extract the token (remove 'Bearer ' prefix)
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }
        
        try {
            // In this simple implementation, the token is just the user ID
            // Find the user with this ID
            console.log('Attempting to find user with token:', token);
            const user = await User.findById(token);
            
            if (!user) {
                console.log('User not found for token:', token);
                return res.status(401).json({ error: 'Invalid token - User not found' });
            }
            
            console.log('User found:', user.fullName);
            
            // Add user to request object
            req.user = {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                titles: user.titles
            };
            
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({ error: 'Invalid token - ' + error.message });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = authMiddleware;