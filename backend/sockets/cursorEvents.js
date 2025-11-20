// sockets/cursorEvents.js
module.exports = (io, socket) => {
  socket.on("cursor-move", (data) => {
    const projectId = socket.data.projectId;
    if (!projectId) {
      console.log("❌ No projectId found for cursor move");
      return;
    }
    console.log(`🖱️ Cursor move from ${socket.data.username}:`, data.cursor);

    // forward cursor position to others
    socket.to(projectId).emit("cursor-update", {
      userId: socket.data.userId,
      username: socket.data.username,
      cursor: data.cursor,
      selection: data.selection,
    });
  });
};
