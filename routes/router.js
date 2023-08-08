const express = require("express");
const {
  userpost,
  userget,
  getSingleuser,
  updateUser,
  deleteUser,
  userStatus,
  userExport,
} = require("../controllers/userController");
const { upload } = require("../multerConfig/storageConfig");

const router = express.Router();

router.post("/user/register", upload.single("user_profile"), userpost);

router.get("/user/details", userget);

router.get("/user/:id", getSingleuser);

router.put("/user/edit/:id", upload.single("user_profile"), updateUser);

router.delete("/user/delete/:id", deleteUser);

router.put("/user/status/:id", userStatus);

router.get("/user-export",userExport);



module.exports = router;
