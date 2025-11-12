require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const compression = require("compression");
const { default: helmet } = require("helmet");
const cookieParser = require("cookie-parser");
const router = require("../routes/mainRoute");
const errorHandler = require("../middlewares/errorHandler");
const { mongodbConnect } = require("../databases/mongodb/mongodbConnect");
const { connectRedis } = require("../databases/redis/redisJwt");
const useragent = require("express-useragent");

// --- SỬA LẠI TẠI ĐÂY ---
// Gộp tất cả URL được phép vào một mảng
const allowedOrigins = [
  'https://coffee-kimphu-angular-kimphu111s-projects.vercel.app', // URL cũ
  'https://coffee-kimphu-angular.vercel.app', // Vercel (Production)
  'http://localhost:4200',                                      // Local
  'http://127.0.0.1:4200'                                       // Local
];
// --- KẾT THÚC SỬA ---

// test

// config
require("express-async-handler");

// init middlewares
app.use(
  cors({
    origin: allowedOrigins, // <-- GÁN MẢNG ĐÃ SỬA VÀO ĐÂY
    credentials: true, // Cho phép gửi và nhận cookie
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(useragent.express());

// init databases
mongodbConnect();
connectRedis();

// init routes
app.use("/", router);

// init error handler
app.use(errorHandler);

module.exports = app;