import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth.js';
import multer from 'multer';
import { mkdir } from 'fs/promises';
import prisma from './lib/prisma.js';
import adminRoutes from './routes/admin.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 4003;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = join(process.cwd(), 'uploads', 'licenses');
    await mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Admin routes
app.use('/admin', adminRoutes);

// File upload endpoint
app.post('/upload-license', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const filePath = `/uploads/licenses/${req.file.filename}`;

    // Update the driver's car with the new license picture path
    const driver = await prisma.driver.findUnique({
      where: { userId: req.user.id },
      include: { car: true }
    });

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    if (!driver.car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    await prisma.driver.update({
      where: { userId: req.user.id },
      data: {
        car: {
          update: {
            licensePicture: filePath
          }
        }
      }
    });

    res.json({ 
      path: filePath,
      message: 'License uploaded and updated successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Read schema
const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');

// Import resolvers
import { resolvers } from './resolvers.js';

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: false, // Disable CSRF protection
    introspection: true // Enable introspection
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Ensure we always have a user object, even if null
        const user = req?.user || null;
        return { user };
      },
    })
  );

  // Add a simple HTML page for the playground
  app.get('/graphql', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GraphQL Playground</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/css/index.css" />
          <link rel="shortcut icon" href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/favicon.png" />
          <script src="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/js/middleware.js"></script>
        </head>
        <body>
          <div id="root">
            <style>
              body {
                background-color: rgb(23, 42, 58);
                font-family: Open Sans, sans-serif;
                height: 90vh;
              }
              #root {
                height: 100%;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .playgroundIn {
                animation: playgroundIn 0.5s ease-out forwards;
              }
              @keyframes playgroundIn {
                from {
                  opacity: 0;
                  transform: translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            </style>
          </div>
          <script>
            window.addEventListener('load', function (event) {
              GraphQLPlayground.init(document.getElementById('root'), {
                endpoint: '/graphql',
                settings: {
                  'request.credentials': 'same-origin'
                }
              })
            });
          </script>
        </body>
      </html>
    `);
  });

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });
}

startApolloServer().catch(console.error);

export default app;