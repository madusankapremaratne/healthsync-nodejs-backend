const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

// Load all models
const modelsPath = __dirname;
fs.readdirSync(modelsPath)
  .filter((file) => file.endsWith('.js') && file !== 'index.js')
  .forEach((file) => {
    const model = require(path.join(modelsPath, file));
    
    // Handle both single model exports and multiple model exports
    if (typeof model === 'function') {
      const ModelClass = model(sequelize, Sequelize.DataTypes);
      db[ModelClass.name] = ModelClass;
    } else if (typeof model === 'object' && model !== null) {
      // Multiple models exported from one file
      Object.entries(model).forEach(([key, modelFunction]) => {
        const ModelClass = modelFunction(sequelize, Sequelize.DataTypes);
        db[ModelClass.name] = ModelClass;
      });
    }
  });

// Define associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add User associations
if (db.User && db.DoctorVisit) {
  db.User.hasMany(db.DoctorVisit, { foreignKey: 'user_id', as: 'visits' });
  db.DoctorVisit.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
}

if (db.User && db.Prescription) {
  db.User.hasMany(db.Prescription, { foreignKey: 'user_id', as: 'prescriptions' });
  db.Prescription.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
}

if (db.User && db.Appointment) {
  db.User.hasMany(db.Appointment, { foreignKey: 'user_id', as: 'appointments' });
  db.Appointment.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
}

// Add DoctorVisit associations
if (db.DoctorVisit && db.Prescription) {
  db.DoctorVisit.hasMany(db.Prescription, { foreignKey: 'visit_id', as: 'prescriptions' });
  db.Prescription.belongsTo(db.DoctorVisit, { foreignKey: 'visit_id', as: 'visit' });
}

// Add Pharmacy associations
if (db.Pharmacy && db.MedicineInventory) {
  db.Pharmacy.hasMany(db.MedicineInventory, { foreignKey: 'pharmacy_id', as: 'inventory' });
  db.MedicineInventory.belongsTo(db.Pharmacy, { foreignKey: 'pharmacy_id', as: 'pharmacy' });
}

if (db.Medicine && db.MedicineInventory) {
  db.Medicine.hasMany(db.MedicineInventory, { foreignKey: 'medicine_id', as: 'inventory' });
  db.MedicineInventory.belongsTo(db.Medicine, { foreignKey: 'medicine_id', as: 'medicine' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
