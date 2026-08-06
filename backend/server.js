import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5500;
const URI = process.env.MONGODB_URI;

//connect to mongoDB

mongoose
  .connect(URI)
  .then(() => console.log("connected to mongoDB"))
  .catch((error) => console.log("MongoDB connection error: ", error));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
