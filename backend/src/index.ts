import express, { NextFunction, Request, Response } from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";
import errorHandler from "./middleware/errorhandler";
import { seedDatabase } from "./database/seed-database";
import lostOnCampusRoutes from "./routers/college.route";

export const client = new MongoClient(
  process.env.MONGO_URI || "mongodb://localhost:27017"
);

export const db = client.db("college_database");
export const collection = db.collection("locations");

async function startServer() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Database Connected");
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
    process.exit(1);
  }
}

startServer();

const app = express();
app.use(express.json());

app.listen(8000, () => {
  console.log("Server is listening");
});

app.use("/v1", lostOnCampusRoutes);

// seedDatabase();

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});
