require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("./config/passportSetup");
const session = require("express-session");
const dbConnect = require("./config/db");
const indexRoute = require("./routes/index.routes");

const app = express();
const PORT = process.env.PORT || 3600;

// db connection
dbConnect();

// origin allow
app.use(cors());

// requesting parsing
app.use(express.json());

// Session setup for Passport
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// routing
app.use("/api", indexRoute);

app.get("/", (req, res) => {
  res.send("Backend is live!!");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
