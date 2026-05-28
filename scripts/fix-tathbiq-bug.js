const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "public", "assets", "js", "tathbiq-ibadah.js");
let content = fs.readFileSync(filePath, "utf-8");

if (content.includes("setTathbiqIbadahStatus")) {
    // Ganti semua pemanggilan setTathbiqIbadahStatus dengan setTathbiqHarianStatus
    content = content.replaceAll("setTathbiqIbadahStatus", "setTathbiqHarianStatus");
    fs.writeFileSync(filePath, content, "utf-8");
    console.log("Successfully fixed Tathbiq upload bug (status function name).");
} else {
    console.log("No instances of setTathbiqIbadahStatus found.");
}
