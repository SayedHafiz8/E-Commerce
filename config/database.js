const mongoose = require("mongoose");
const dbConnection = () => {
    mongoose.connect(process.env.db_url).then((conn) => {
        console.log(`Database is connected :${conn.connection.host}`)
    })
}
module.exports = dbConnection;