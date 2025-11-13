const express = require("express");
const app = express();
const PORT = 3000;

// Simple GET request to fetch data of user
app.get("/user", (req, res) => {
    console.log("user requested", res);
  res.json({ name: "Japjyot Suri" });
});

app.listen(PORT, () => {
  console.log(`✅ Mock server running at http://localhost:${PORT}`);
});
