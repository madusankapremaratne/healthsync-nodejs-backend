const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HealthSync API',
      version: '1.0.0',
      description: 'Digital Health Management Platform - RESTful API for managing medical records, prescriptions, appointments, and pharmacy services',
      contact: {
        name: 'HealthSync Team',
        email: 'support@healthsync.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.healthsync.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User unique identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            fullName: {
              type: 'string',
              description: 'User full name'
            },
            phoneNumber: {
              type: 'string',
              description: 'User phone number'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'User date of birth'
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other'],
              description: 'User gender'
            },
            address: {
              type: 'string',
              description: 'User residential address'
            },
            emergencyContact: {
              type: 'string',
              description: 'Emergency contact information'
            },
            bloodType: {
              type: 'string',
              description: 'Blood type'
            },
            allergies: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of known allergies'
            },
            chronicConditions: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of chronic medical conditions'
            }
          }
        },
        DoctorVisit: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Visit unique identifier'
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'User ID'
            },
            doctorName: {
              type: 'string',
              description: 'Doctor\'s name'
            },
            specialty: {
              type: 'string',
              description: 'Medical specialty'
            },
            visitDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time of visit'
            },
            diagnosis: {
              type: 'string',
              description: 'Medical diagnosis'
            },
            notes: {
              type: 'string',
              description: 'Additional notes'
            },
            followUpDate: {
              type: 'string',
              format: 'date',
              description: 'Follow-up appointment date'
            }
          }
        },
        Prescription: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Prescription unique identifier'
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'User ID'
            },
            visitId: {
              type: 'string',
              format: 'uuid',
              description: 'Doctor visit ID'
            },
            medicineName: {
              type: 'string',
              description: 'Medicine name'
            },
            dosage: {
              type: 'string',
              description: 'Dosage instructions'
            },
            frequency: {
              type: 'string',
              description: 'How often to take medicine'
            },
            duration: {
              type: 'string',
              description: 'Duration of treatment'
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Start date of prescription'
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'End date of prescription'
            },
            refillsRemaining: {
              type: 'integer',
              description: 'Number of refills remaining'
            },
            status: {
              type: 'string',
              enum: ['active', 'completed', 'cancelled'],
              description: 'Prescription status'
            }
          }
        },
        Appointment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Appointment unique identifier'
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'User ID'
            },
            doctorName: {
              type: 'string',
              description: 'Doctor\'s name'
            },
            specialty: {
              type: 'string',
              description: 'Medical specialty'
            },
            appointmentDate: {
              type: 'string',
              format: 'date-time',
              description: 'Appointment date and time'
            },
            reason: {
              type: 'string',
              description: 'Reason for appointment'
            },
            status: {
              type: 'string',
              enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
              description: 'Appointment status'
            },
            location: {
              type: 'string',
              description: 'Appointment location'
            }
          }
        },
        Pharmacy: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Pharmacy unique identifier'
            },
            name: {
              type: 'string',
              description: 'Pharmacy name'
            },
            address: {
              type: 'string',
              description: 'Pharmacy address'
            },
            phoneNumber: {
              type: 'string',
              description: 'Contact phone number'
            },
            latitude: {
              type: 'number',
              format: 'float',
              description: 'Latitude coordinate'
            },
            longitude: {
              type: 'number',
              format: 'float',
              description: 'Longitude coordinate'
            },
            openingHours: {
              type: 'string',
              description: 'Operating hours'
            },
            is24Hours: {
              type: 'boolean',
              description: 'Whether pharmacy is open 24 hours'
            },
            distance: {
              type: 'number',
              format: 'float',
              description: 'Distance from user location (km)'
            }
          }
        },
        Medicine: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Medicine unique identifier'
            },
            name: {
              type: 'string',
              description: 'Medicine name'
            },
            genericName: {
              type: 'string',
              description: 'Generic/scientific name'
            },
            manufacturer: {
              type: 'string',
              description: 'Manufacturer name'
            },
            category: {
              type: 'string',
              description: 'Medicine category'
            },
            description: {
              type: 'string',
              description: 'Medicine description'
            },
            sideEffects: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of potential side effects'
            },
            contraindications: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of contraindications'
            },
            requiresPrescription: {
              type: 'boolean',
              description: 'Whether prescription is required'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Error details'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Validation error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Authentication required',
                error: 'No token provided'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'User does not have permission to access this resource',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Access denied',
                error: 'Insufficient permissions'
              }
            }
          }
        },
        NotFoundError: {
          description: 'The requested resource was not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Resource not found',
                error: 'The requested item does not exist'
              }
            }
          }
        },
        ValidationError: {
          description: 'Request validation failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError'
              },
              example: {
                message: 'Validation failed',
                errors: [
                  {
                    field: 'email',
                    message: 'Email is required'
                  }
                ]
              }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'Internal server error',
                error: 'An unexpected error occurred'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Users',
        description: 'User profile management'
      },
      {
        name: 'Doctor Visits',
        description: 'Medical consultation records management'
      },
      {
        name: 'Prescriptions',
        description: 'Prescription management'
      },
      {
        name: 'Appointments',
        description: 'Medical appointment scheduling'
      },
      {
        name: 'Pharmacies',
        description: 'Pharmacy location and services'
      },
      {
        name: 'Medicines',
        description: 'Medicine catalog and information'
      },
      {
        name: 'Health',
        description: 'System health and monitoring'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/index.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
