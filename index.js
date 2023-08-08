require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectDb } = require("./db/conn");
const router = require("./routes/router");
const app = express();
const PORT = process.env.PORT || 5000;

connectDb();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static("./uploads"));
app.use("/files", express.static("./public/files"));
app.use(router);

app.get("/", (req, res) => {
  res.status(200).json("server start");
});

app.listen(PORT, () => {
  console.log(`server start at port no. ${PORT}`);
});
