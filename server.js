const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { sequelize, connectDB } = require("./config/database");
const models = require("./models");
const app = express();
connectDB();
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");

app.use(cors());
app.use(helmet());
//app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse form data

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

sequelize.sync().then(() => {
  console.log("All models were synchronized successfully.");
});
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
  