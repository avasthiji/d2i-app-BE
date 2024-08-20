require("dotenv").config();
const connectDB = require('./config/database.js')
const app = require("./app.js");
const PORT = process.env.PORT || 4114;
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("EXPRESS Error : ", error);
      throw error;
    });
    app.listen(PORT, () => {
      console.log(`Server is runnig at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed !!!", err);
  });
