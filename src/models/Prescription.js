const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Prescription = sequelize.define(
    'Prescription',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      visit_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'doctor_visits',
          key: 'id',
        },
        index: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        index: true,
      },
      medication_name: {
        type: DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      generic_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dosage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dosage_unit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      frequency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      frequency_details: {
        type: DataTypes.JSON,
        defaultValue: {
          times_per_day: 1,
          specific_times: [],
          with_food: null,
        },
      },
      duration_days: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      prescription_image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      refill_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      refill_remaining: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      last_refilled_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      next_refill_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      refill_reminder_sent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      side_effects: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      contraindications: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      drug_interactions: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      tableName: 'prescriptions',
      timestamps: true,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['visit_id'] },
        { fields: ['medication_name'] },
        { fields: ['user_id', 'is_active'] },
      ],
    }
  );

  return Prescription;
};
