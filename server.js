//サーバーを立ち上げる

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
// const io = require("socket.io")(server);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = 3000;

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("message.sqlite3");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res, next) => {
  db.serialize(() => {
    db.all("select * from messages", (err, rows) => {
      if (!err) {
        let data = {
          title: "チャットメッセージ",
          content: rows,
        };
        res.render("main", data);
        next();
      } else {
        res.render("main", { test: "エラー" });
      }
    });
  });
});

// app.post("/", (req, res, next) => {
//   const tx = req.body.message;
//   db.serialize(() => {
//     db.run("insert into messages (text) values(?)", tx);
//     res.redirect("/");
//     next();
//   });
// });

io.on("connection", (socket) => {
  console.log("ユーザーが接続しました");

  socket.on("send message", (msg) => {
    db.serialize(() => {
      db.run("insert into messages (text) values(?)", msg);
      // res.redirect("/");
      // next();
    });
    io.emit("show message", msg);
  });
});

server.listen(PORT, () => {
  console.log("3000をlisten");
});
