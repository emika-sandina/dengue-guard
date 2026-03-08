import { supabase } from '../supabase.js';

export const authenticate = async (req, res, next) => {
    // extract the token from the authorization header 
    // "Authorization": "Bearer " + token
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify the token is valid with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // Attach user + token to request so controllers can use them
  req.user = user;
  req.token = token;

  next(); // pass control to the controller
};