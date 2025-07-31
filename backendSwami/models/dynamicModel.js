const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  userName: String,
  gmail: String,
  password: String,
  role: String,
  coursetype: String,
  courseName: String,
  standards: [mongoose.Schema.Types.Mixed],  // allow arrays of anything
  subjects: [mongoose.Schema.Types.Mixed],
  phoneNumber: String,
  _class: String
}, { timestamps: true });

function getUserModel(dbName, collectionName) {
  const db = mongoose.connection.useDb(dbName);
   if (db.models[collectionName]) {
    return db.models[collectionName];
  }
  return db.model(collectionName, userSchema, collectionName);
}

module.exports = getUserModel;
