require('dotenv').config({ path: '../.env' }); // ✅ Top of file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;
app.set('trust proxy', 1); 
const session = require('express-session');
const RedisStore = require('connect-redis');
const RedisSessionStore = RedisStore(session);
const Redis = require('ioredis');
app.use(cors({
  origin: ['http://localhost:5173',
  'https://celebrated-eclair-e6ee30.netlify.app'], // 👈 your React app's address
  credentials: true               // 👈 required to accept cookies or headers
}));
const redisClient = new Redis(process.env.REDIS_URL); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
// const redisClient = new Redis({
//   host: 'localhost', // or your Redis host
//   port: 6379,
//   // password: 'your_password', // if password is set
// });
//console.log('MongoDB URI:', process.env.MONGODB_URI); // ✅ Debug log
app.use(session({
  store: new RedisSessionStore({ client: redisClient }),
  secret: 'your_session_secret', // 🔐 use strong secret in .env
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // Set to true if using HTTPS
    httpOnly: true,
    sameSite:'none',
    maxAge: 1000 *60 *60 *24// 1 day
  }
}));
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection failed:', err));

const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);
const registerRoutes = require('./routes/register');
app.use('/register', registerRoutes);
// app.get('/', (req, res) => {
//    //req.session.counter = (req.session.counter || 0) + 1;
//   res.send('Welcome to the Node + MongoDB CRUD API');
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
