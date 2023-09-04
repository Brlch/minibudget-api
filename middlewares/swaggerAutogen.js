import swaggerAutogen from 'swagger-autogen';

const options = {
  openapi: '3.0.0', // Enable OpenAPI 3.0
  language: 'en-US', // Change response language
  disableLogs: false, // Enable logs
  autoHeaders: true, // Enable automatic headers capture
  autoQuery: true, // Enable automatic query capture
  autoBody: true // Enable automatic body capture
};

const doc = {
  info: {
    version: '1.0.0',
    title: 'MiniBudget API',
    description: 'API documentation for the MiniBudget mobile application'
  },
  host: 'api.myminibudget.com',
  schemes: ['http'] // Schemes used (http or https)
};

const outputFile = '../docs/swagger/swagger-output.json';
const endpointsFiles = ['../index.js'];

swaggerAutogen(options)(outputFile, endpointsFiles, doc).then(async () => {
  console.log('Swagger documentation generated successfully!');
});
