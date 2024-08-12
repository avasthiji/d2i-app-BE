const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

//routesImport
const userRoutes = require("./routes/userRoutes");
const metricRoutes = require("./routes/metricRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(
  cors({
    origin: "http://127.0.0.1:5173", // Replace with your frontend URL if different
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type",
  })
);

app.use(express.json());

//connect to MongoDb
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Import and use routes
app.use("/api", userRoutes);
app.use("/api/metrics", metricRoutes);
// Define Routes
app.get("/", (req, res) => {
  console.log("Home Route Accessed");

  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
