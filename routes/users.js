var express = require("express");
var router = express.Router();
const usersController = require("../controllers/usersController");

const authRoleAccess = (req, res, next) => {
  const { role } =
    req.headers["x-access-token"];

  if (role !== "admin") {
    return res.status(403).json({
      status: 403,
      message: "Access forbidden",
    });
  }

  next();
};

// Get User Info
router.get("/info", usersController.getUserInfo);
// Update User Info
router.put("/info", usersController.updateUserInfo);
// Change Password User Info
router.put("/ubah_password", usersController.changePasswordUserInfo);
// Get Count Users
router.get("/count", authRoleAccess, usersController.getCountAll);
// Get Users
router.get("/", authRoleAccess, usersController.getAll);
// Get Users by Username
router.get("/:username", authRoleAccess, usersController.getByUsername);
// Add Users
router.post("/", authRoleAccess, usersController.create);
// Update Users
router.put("/:username", authRoleAccess, usersController.update);
// Delete Users
router.delete("/:username", authRoleAccess, usersController.delete);
// Change Password User
router.put("/:username/ubah_password", authRoleAccess, usersController.changePassword);

module.exports = router;
