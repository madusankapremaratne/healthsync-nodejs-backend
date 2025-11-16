const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Appointment = sequelize.define(
    'Appointment',
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
      appointment_date: {
        type: DataTypes.DATE,
        allowNull: false,
        index: true,
      },
      appointment_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      duration_minutes: {
        type: DataTypes.INTEGER,
        defaultValue: 30,
      },
      appointment_type: {
        type: DataTypes.ENUM('online', 'in-person', 'phone'),
        defaultValue: 'in-person',
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'),
        defaultValue: 'scheduled',
        index: true,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      booking_platform: {
        type: DataTypes.ENUM('doc990', 'echannelling', 'manual'),
        defaultValue: 'manual',
      },
      booking_platform_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      confirmation_number: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      consultation_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      is_follow_up: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      follow_up_for_visit_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'doctor_visits',
          key: 'id',
        },
      },
      reminder_sent_24h: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      reminder_sent_1h: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      cancellation_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cancelled_by: {
        type: DataTypes.ENUM('user', 'doctor', 'system'),
        allowNull: true,
      },
      cancelled_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      prescription_issued: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      appointment_link: {
        type: DataTypes.STRING,
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
      tableName: 'appointments',
      timestamps: true,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['appointment_date'] },
        { fields: ['status'] },
        { fields: ['user_id', 'appointment_date'] },
      ],
    }
  );

  return Appointment;
};
