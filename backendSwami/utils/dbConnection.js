const mongoose = require('mongoose');
const connections = {};

const getConnection = async (dbName) => {
  if (connections[dbName]) return connections[dbName];

  const uri = `mongodb+srv://swaminathan:swaminathan@test-padmasiniadmin-1.jstwkng.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=test-padmasiniAdmin-1`;

  const conn = await mongoose.createConnection(uri); // ✅ removed deprecated options

  connections[dbName] = conn;
  return conn;
};

module.exports = getConnection;
