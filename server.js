import express from "express";
import dotenv from "dotenv";
import { connect } from "./config/db.js";
import routers from "./routes/routers.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.use("/api", routers)
connect()
  .then(() => {
    try {
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error("Error starting server:", error);
    }
  })
  .catch((error) => {
    console.log("invalid database connection" + error.message);
  });
