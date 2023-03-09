const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

app.get("/:sessionId", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  socket.on("joinSession", (sessionId) => {
    socket.join(sessionId);
    io.to(sessionId).emit("userJoined", socket.id);
  });

  socket.on("playVideo", (data) => {
    io.to(data.sessionId).emit("playVideo", data.time);
  });

  socket.on("pauseVideo", (data) => {
    io.to(data.sessionId).emit("pauseVideo", data.time);
  });

  socket.on("seekVideo", (data) => {
    io.to(data.sessionId).emit("seekVideo", data.time);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
