const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://doadmin:C150p2k3h8v4LlK7@thecyberhub-db-65797903.mongo.ondigitalocean.com/thecyberhub?tls=true&authSource=admin&replicaSet=thecyberhub-db")
        console.log(`MongoDB Connected: ${conn.connection.host}`.yellow.underline.bold)
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;
