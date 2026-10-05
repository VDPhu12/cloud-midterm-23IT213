const mongoose = require("mongoose");

const readConnection = mongoose.createConnection(
  process.env.MONGO_READ_URI
);

const writeConnection = mongoose.createConnection(
  process.env.MONGO_WRITE_URI
);

readConnection.on("connected", () => {
  console.log("Read database connected");
});

writeConnection.on("connected", () => {
  console.log("Write database connected");
});

readConnection.on("error", (error) => {
  console.error(
    "Read database error:",
    error.message
  );
});

writeConnection.on("error", (error) => {
  console.error(
    "Write database error:",
    error.message
  );
});

module.exports = {
  readConnection,
  writeConnection
};