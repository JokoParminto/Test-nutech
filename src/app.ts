import express from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { routes } from './routes/routes'
import dotenv from 'dotenv'
dotenv.config()
import path from 'path'
const app = express()

app.use(express.json())
const port = process.env.PORT

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Test API Documentation',
    version: '1.0.0',
    description: 'API Documentation with Bearer Token Authentication',
  },
  tags: [
    {
      name: "1. Module Membership"
    },
    {
      name: "2. Module Information"
    }
    
  ],
  servers: [
    {
      url: 'http://localhost:3200',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Path to your API route files
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/uploads', express.static(path.join(__dirname, './uploads')))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use('/api/v1', routes); // Example route for user

app.listen(port, () => {
  console.log('Server running on http://localhost:' + port);
});
