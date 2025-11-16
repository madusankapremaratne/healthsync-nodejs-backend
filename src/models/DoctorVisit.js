const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DoctorVisit = sequelize.define(
    'DoctorVisit',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      doctor_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'doctors',
          key: 'id',
        },
      },
      doctor_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      doctor_specialty: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hospital_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      visit_date: {
        type: DataTypes.DATE,
        allowNull: false,
        index: true,
      },
      visit_type: {
        type: DataTypes.ENUM('consultation', 'follow-up', 'emergency', 'routine'),
        defaultValue: 'consultation',
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      diagnosis: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      symptoms: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      treatment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      prescription_image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      prescription_extracted_data: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      follow_up_required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      follow_up_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      follow_up_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      vital_signs: {
        type: DataTypes.JSON,
        defaultValue: {
          blood_pressure: null,
          heart_rate: null,
          temperature: null,
          weight: null,
          height: null,
        },
      },
      tests_ordered: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      attachments: {
        type: DataTypes.JSON,
        defaultValue: [],
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
      tableName: 'doctor_visits',
      timestamps: true,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['visit_date'] },
        { fields: ['user_id', 'visit_date'] },
      ],
    }
  );

  return DoctorVisit;
};
