require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("./config/passportSetup");
const session = require("express-session");
const dbConnect = require("./config/db");
const indexRoute = require("./routes/index.routes");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

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

// socket.io logic
require("./sockets/socketHandler")(io);

app.get("/", (req, res) => {
  res.send("Backend is live!!");
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  console.log(`Socket.io running on port ${PORT}`);
});
