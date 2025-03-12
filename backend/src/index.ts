import express, { NextFunction, Request, Response } from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";
import errorHandler from "./middleware/errorhandler";

const client = new MongoClient(
  process.env.MONGO_URI || "mongodb://localhost:27017"
);

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

app.listen(8001, () => {
  console.log("Server is listening");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});
