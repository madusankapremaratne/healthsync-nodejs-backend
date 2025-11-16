const { DataTypes } = require('sequelize');

// Pharmacy Model
const PharmacyModel = (sequelize) => {
  return sequelize.define(
    'Pharmacy',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        defaultValue: 'Sri Lanka',
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      operating_hours: {
        type: DataTypes.JSON,
        defaultValue: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '20:00' },
          saturday: { open: '09:00', close: '18:00' },
          sunday: { open: '10:00', close: '16:00' },
        },
      },
      delivery_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      delivery_radius_km: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      pickup_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      api_integrated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      api_provider: {
        type: DataTypes.ENUM('custom', 'third-party', 'manual'),
        defaultValue: 'manual',
      },
      api_key: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      rating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 4.5,
      },
      reviews_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'pharmacies',
      timestamps: true,
      indexes: [
        { fields: ['name'] },
        { fields: ['city'] },
        { fields: ['is_active'] },
      ],
    }
  );
};

// Medicine Model
const MedicineModel = (sequelize) => {
  return sequelize.define(
    'Medicine',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      generic_name: {
        type: DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      brand_name: {
        type: DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      strength: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      form: {
        type: DataTypes.ENUM('tablet', 'capsule', 'liquid', 'injection', 'cream', 'ointment', 'drops', 'inhaler', 'syrup', 'powder'),
        allowNull: false,
      },
      manufacturer: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
        index: true,
      },
      therapeutic_use: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      contraindications: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      side_effects: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      drug_interactions: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      dosage_instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      storage_instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      requires_prescription: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'medicines',
      timestamps: true,
      indexes: [
        { fields: ['generic_name'] },
        { fields: ['brand_name'] },
        { fields: ['category'] },
      ],
    }
  );
};

// Medicine Inventory Model (Pharmacy-specific inventory)
const MedicineInventoryModel = (sequelize) => {
  return sequelize.define(
    'MedicineInventory',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      pharmacy_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'pharmacies',
          key: 'id',
        },
        index: true,
      },
      medicine_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'medicines',
          key: 'id',
        },
        index: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      quantity_in_stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      batch_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expiry_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      discount_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
      },
      last_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'medicine_inventory',
      timestamps: true,
      indexes: [
        { fields: ['pharmacy_id'] },
        { fields: ['medicine_id'] },
        { fields: ['pharmacy_id', 'medicine_id'] },
      ],
    }
  );
};

module.exports = {
  Pharmacy: PharmacyModel,
  Medicine: MedicineModel,
  MedicineInventory: MedicineInventoryModel,
};
