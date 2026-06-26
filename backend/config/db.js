const dns = require("node:dns")
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");

const connectDB = async () => {
    try {

        const conn = await mongoose.connect(process.env.Mongo_URI, {
            dbName: "shopnest-mern",
        });
        console.log("mongodb connected");

    } catch (error) {
        console.error("Mongoose failed connection :", error.message);
        process.exit(1)
    }
}
module.exports = connectDB;