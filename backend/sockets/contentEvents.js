// sockets/contentEvents.js
const { v4: uuid } = require("uuid");

module.exports = (io, socket) => {
  socket.on("content-change", (data) => {
    const projectId = socket.data.projectId;

    if (!projectId) {
      console.log("❌ SERVER: No projectId found for socket:", socket.id);
      return;
    }

    // Forward to other users in the project
    socket.to(projectId).emit("content-update", {
      changeId: Date.now().toString(),
      userId: socket.data.userId,
      username: socket.data.username,
      fileId: data.fileId,
      changes: data.changes,
      fullContent: data.fullContent,
      timestamp: new Date().toISOString(),
    });
  });
};
