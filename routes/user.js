const express = require("express");
const catchAsync = require("../utils/CatchAsync");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const users = require("../controller/users");

router.route("/register")
      .get(users.renderRegister)
      .post(catchAsync(users.register));

router.route("/login")
      .get(users.renderLogin)
      .post(
        storeReturnTo,
        passport.authenticate("local", {
          failureFlash: true,
          failureRedirect: "/login",
        }),
        users.login
      );

router.route('/logout')
      .get(users.logout);

module.exports = router;
