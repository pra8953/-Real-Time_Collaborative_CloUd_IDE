// sockets/presenceEvents.js
module.exports = (io, socket) => {
  socket.on("user-online", () => {
    const projectId = socket.data.projectId;

    socket.to(projectId).emit("presence-update", {
      userId: socket.data.userId,
      username: socket.data.username,
      status: "online",
    });
  });

  socket.on("user-typing", () => {
    const projectId = socket.data.projectId;

    socket.to(projectId).emit("user-typing", {
      username: socket.data.username,
    });
  });

  socket.on("user-stop-typing", () => {
    const projectId = socket.data.projectId;

    socket.to(projectId).emit("user-stop-typing", {
      username: socket.data.username,
    });
  });
};
