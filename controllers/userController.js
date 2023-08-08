const userModel = require("../models/userModel");
const moment = require("moment");
const csv = require("fast-csv");
const fs = require("fs");

//register
exports.userpost = async (req, res) => {
  const file = req.file.filename;
  const { fname, lname, email, mobile, gender, location, status } = req.body;

  if (
    !fname ||
    !lname ||
    !email ||
    !mobile ||
    !gender ||
    !location ||
    !status ||
    !file
  ) {
    res.status(401).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      res.status(409).json({
        success: false,
        message: "user already exist! ",
      });
    } else {
      const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

      const userData = new userModel({
        fname,
        lname,
        email,
        mobile,
        gender,
        location,
        status,
        profile: file,
        datecreated,
      });

      await userData.save();
      res.status(201).json({
        success: true,
        message: "user registered successfully ",
        userData,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//get users
exports.userget = async (req, res) => {
  const search = req.query.search || "";
  const gender = req.query.gender || "";
  const status = req.query.status || "";
  const sort = req.query.sort || "";
  const page = req.query.page || 1;
  const ITEM_PER_PAGE = 4;

  const query = {
    $or: [
      { fname: { $regex: search, $options: "i" } },
      { lname: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  };

  if (gender !== "All") {
    query.gender = gender;
  }
  if (status !== "All") {
    query.status = status;
  }

  try {
    const skip = (page - 1) * ITEM_PER_PAGE;

    const count = await userModel.countDocuments(query);

    const usersData = await userModel
      .find(query)
      .sort({ datecreated: sort == "new" ? -1 : 1 })
      .limit(ITEM_PER_PAGE)
      .skip(skip);

    const pageCount = Math.ceil(count / ITEM_PER_PAGE);

    if (!usersData) {
      res.status(404).json({
        success: false,
        message: "Users not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "fetched user correctly",
      pagination: { count, pageCount },
      usersData,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getSingleuser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await userModel.findById(id);
    if (!userData) {
      res.status(404).json({
        success: false,
        message: "Users not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "fetched single user correctly",
      userData,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    fname,
    lname,
    email,
    mobile,
    gender,
    location,
    status,
    user_profile,
  } = req.body;
  const file = req.file ? req.file.filename : user_profile;

  const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

  try {
    const updateUser = await userModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          fname,
          lname,
          email,
          mobile,
          gender,
          location,
          status,
          profile: file,
          dateUpdated,
        },
      },
      { new: true }
    );

    await updateUser.save();
    res.status(200).json({
      success: true,
      message: "updated user correctly",
      updateUser,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "delete user correctly",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.userStatus = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  try {
    const statusUpdate = await userModel.findByIdAndUpdate(
      id,
      { $set: { status: data } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "user status updated",
      statusUpdate,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.userExport = async (req, res) => {
  try {
    const usersData = await userModel.find();
    const csvStream = csv.format({ headers: true });

    if (!fs.existsSync("public/files/export/")) {
      if (!fs.existsSync("public/files")) {
        fs.mkdirSync("public/files/");
      }

      if (!fs.existsSync("public/files/export")) {
        fs.mkdirSync("./public/files/export/");
      }
    }

    const writableStream = fs.createWriteStream(
      "public/files/export/users.csv"
    );

    csvStream.pipe(writableStream);
    writableStream.on("finish", function () {
      res.json({
        downloadUrl: `http://localhost:5000/files/export/users.csv`,
      });
    });

    if (usersData.length > 0) {
      usersData.map((user) => {
        csvStream.write({
          FirstName: user.fname ? user.fname : "-",
          LastName: user.lname ? user.lname : "-",
          Email: user.email ? user.email : "-",
          DateUpdated: user.mobile ? user.mobile : "-",
          Gender: user.gender ? user.gender : "-",
          Status: user.status ? user.status : "-",
          Profile: user.profile ? user.profile : "-",
          Location: user.location ? user.location : "-",
          DateCreated: user.datecreated ? user.datecreated : "-",
          DateUpdated: user.dateUpdated ? user.dateUpdated : "-",
        });
      });
    }

    csvStream.end();
    writableStream.end();
  } catch (error) {
    console.log(error);
  }
};
