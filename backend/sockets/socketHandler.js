const projectRoom = require("./projectRoom");
const cursorEvents = require("./cursorEvents");
const contentEvents = require("./contentEvents");
const presenceEvents = require("./presenceEvents");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("✨ New user connected:", socket.id);
    console.log("🔑 Socket auth:", socket.handshake.auth);

    // Register modules
    projectRoom(io, socket);
    cursorEvents(io, socket);
    contentEvents(io, socket);
    presenceEvents(io, socket);

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};
