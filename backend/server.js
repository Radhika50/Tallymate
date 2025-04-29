// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const groupRoutes = require('./routes/groupRoutes'); // Add this line
const expenseRoutes = require('./routes/expenseRoutes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));  // Authentication routes
app.use("/api/groups", groupRoutes);  // Add this line for group routes
app.use("/api/expenses", expenseRoutes);
// try {
//   const groupRoutes = require('./routes/groupRoutes');
//   app.use("/api/groups", groupRoutes);
// } catch (error) {
//   console.error("Error loading groupRoutes module:", error);
// }
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
