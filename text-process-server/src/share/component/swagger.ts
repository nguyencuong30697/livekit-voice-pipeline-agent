import swaggerJSDoc from 'swagger-jsdoc';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Text Processor API Documentation',
    version: '1.0.0',
    description: 'API documentation for Text Processor Service',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: '/v1',
      description: 'Development server',
    },
  ],
  components: {
    schemas: {
      TextProcessorRequest: {
        type: 'object',
        required: ['text'],
        properties: {
          text: {
            type: 'string',
            description: 'Text to be processed',
            example: 'This is a sample text to be processed',
          },
        },
      },
      TextProcessorResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              text: {
                type: 'string',
                description: 'Processed text',
                example: 'This is a sample text to be processed',
              },
              status: {
                type: 'string',
                description: 'Status of the text processing',
                example: 'unchanged',
              },
            },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Error message',
            example: 'Invalid request',
          },
          statusCode: {
            type: 'integer',
            description: 'HTTP status code',
            example: 400,
          },
          details: {
            type: 'object',
            description: 'Error detail',
          },
        },
      },
      ServerError: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Error message',
            example: 'Server error',
          },
          statusCode: {
            type: 'integer',
            description: 'HTTP status code',
            example: 500,
          },
          details: {
            type: 'object',
            description: 'Error detail',
          },
        },
      },
    },
  },
};

// Options for the swagger docs
const swaggerOptions = {
  swaggerDefinition,
  // Path to the API docs
  apis: ['./src/modules/*/infras/transport/*.ts', './src/modules/*/model/*.ts'],
};

// Initialize swagger-jsdoc
export const swaggerSpec = swaggerJSDoc(swaggerOptions);
