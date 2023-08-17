const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const path = require('path');

const app = express();
let cnt = 0;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/openTab", async (req, res) => {
  const delay = 5000; // 5 seconds in milliseconds

  const openNewTab = () => {
    cnt++;
    let url = `https://example${cnt}.com`;
    const command =
      process.platform === "darwin"
        ? "open"
        : process.platform === "win32"
        ? "start"
        : "xdg-open";
    exec(`${command} ${url}`, (error) => {
      if (error) {
        console.error(`Failed to open new tab: ${error}`);
        res.status(500).send("Failed to open new tab");
      }
    });
  };

  const delayExecution = async (count) => {
    for (let i = 0; i < count; i++) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      openNewTab();
    }
    res.send("New tabs opened successfully");
  };

  await delayExecution(10000000);
});
app.use(express.static("dist"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.listen(8000, () => {
  console.log("Server started on port 8000");
});
