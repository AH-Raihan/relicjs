// A very simple middleware for demonstration
// In a real app, this would involve token validation, session checks, etc.
const authMiddleware = (req, res, next) => {
  // Example: Check for a query parameter to simulate authentication
  // http://localhost:3000/?isAuthenticated=true
  if (req.query.isAuthenticated === 'true') {
    console.log('User is authenticated.');
    return next();
  }
  console.log('User is not authenticated. Access granted for demo purposes.');
  // For this demo, we'll allow access but you could redirect or send an error
  // return res.status(401).send('Unauthorized');
  next();
};

module.exports = authMiddleware;