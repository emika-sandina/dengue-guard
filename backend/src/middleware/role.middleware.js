// to ensure that the user is moh officer
export const authorizeMOH = (req, res, next) => {
  if (req.user && req.user.role === 'moh') {
    return next(); 
  } else {
    return res.status(403).json({ message: "Access Denied: MOH officers only" });
  }
};