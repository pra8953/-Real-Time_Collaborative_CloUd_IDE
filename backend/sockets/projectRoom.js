module.exports = (io, socket) => {
  socket.on("join-project", ({ projectId, userId, username }) => {
    console.log("👤 SERVER: User joining project:", {
      projectId,
      userId,
      username,
      socketId: socket.id,
    });

    socket.join(projectId);
    socket.data.userId = userId;
    socket.data.username = username;
    socket.data.projectId = projectId;

    // ✅ Confirm room join
    const roomSize = io.sockets.adapter.rooms.get(projectId)?.size || 0;
    console.log(
      `✅ SERVER: User ${username} joined project ${projectId}. Room size: ${roomSize}`
    );

    // ✅ Send confirmation to joining user
    socket.emit("join-confirmation", {
      projectId,
      roomSize,
      message: "Successfully joined project",
    });

    // Notify others
    socket.to(projectId).emit("user-joined", {
      userId,
      username,
      socketId: socket.id,
    });
    console.log(`📢 SERVER: Notified others about ${username} joining`);
  });

  socket.on("leave-project", ({ projectId }) => {
    socket.leave(projectId);
    console.log(`User left project: ${projectId}`);
  });
};
