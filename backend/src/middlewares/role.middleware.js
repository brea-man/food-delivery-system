const authorizeRoles = (...allowedRoles) => {
  const roles = allowedRoles.flat();
  return (req, res, next) => {
    console.log("ALLOWED ROLES:", roles);
    console.log("ROLE FROM TOKEN:", req.user?.role); // remove after debug

    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires one of: ${roles.join(", ")}`
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };
