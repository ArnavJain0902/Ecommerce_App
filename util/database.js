// const mysql = require('mysql2')

// const pool = mysql.createPool({
//     host: 'localhost',
//     user:'root',
//     database:'shop',
//     password:'superarnav'
// })

// module.exports = pool.promise();


// const Sequelize = require("sequelize").Sequelize;

// const sequelize = new Sequelize("shop", "root", "superarnav", {
//   host: "localhost",
//   dialect: "mysql",
// });

// module.exports = sequelize;

// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// let _db;

// const mongoConnect = async (callback) => {
//   try {
//     const client = await MongoClient.connect(
//       "mongodb+srv://Arnav:superarnav@cluster0.s2mlu.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
//     );
//     _db = client.db("shop");
//     console.log("Connected to database successfully!");
//     callback();
//   } catch (err) {
//     console.log("Failed to connect to database.");
//     throw err;
//   }
// };

// const getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw "No database found!";
// };

// module.exports = {mongoConnect, getDb};


