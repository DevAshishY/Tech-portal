// import express from "express";
// import next from "next";
// import dotenv from "dotenv";
// import cors from "cors";

// dotenv.config();

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(async () => {
//   const server = express();

//   server.use(
//     cors({
//       origin: "*",
//       methods: ["GET", "POST", "PUT", "DELETE"],
//       credentials: true,
//     })
//   );

//   server.use(express.json());

//   // ✅ Test route
//   server.get("/ping", (req, res) => {
//     res.send("🚀 Server is running successfully");
//   });

//   // ✅ Next.js handles everything else
//   server.all("/*", (req, res) => handle(req, res));

//   const PORT = process.env.PORT || 3000;
//   server.listen(PORT, () => {
//     console.log(`✅ Server running at http://localhost:${PORT}`);
//   });
// });
import express from "express";
import next from "next";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// ✅ MongoDB Connection
const connectDB = async () => {
  if (mongoose.connection.readyState) return; 

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || "milobook", 
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

app.prepare().then(async () => {
  await connectDB(); 

  const server = express();

  server.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

  // server.use(express.json());

  // ✅ Test route
  server.get("/ping", (req, res) => {
    res.send("🚀 Server and MongoDB are running successfully");
  });

  server.all("/*", (req, res) => handle(req, res));

  const PORT = process.env.PORT || 4702;
  server.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
});


// nRYwbVvslzrANxNf
// anju_db_user