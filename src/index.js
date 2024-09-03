import express from 'express';
import morgan from 'morgan';
import engine from 'ejs-mate';
import mainRouter from './routers/mainRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import User from './models/user.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();
// Set the port
const port =3000;

// Body parser middleware to handle post requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setting views folder and view engine
app.set('views', path.join(__dirname, 'views'));
// Setting public folder is static folder
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// Setting morgan to log HTTP requests
app.use(morgan('dev'));

// Setting using mongoose to connect to MongoDB

mongoose.connect('mongodb://localhost:27017/trade_crypto', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Setting session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }}
));


// Kiểm tra và tạo tài khoản admin mặc định nếu chưa tồn tại
async function createDefaultAdmin() {
  const adminEmail = 'leanhnhan96@gmail.com';
  const adminPassword = '12345';

  try {
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (!existingAdmin) {
          const adminUser = new User({
              username: 'admin',
              email: adminEmail,
              password: adminPassword,
              role: 'admin',
              isVerified: true
          });
          await adminUser.save();
           // Kiểm tra giá trị băm sau khi lưu
          const savedUser = await User.findOne({ email: adminEmail });
          console.log('Default admin account created');
      } else {
          console.log('Admin account already exists');
      }
  } catch (error) {
      console.error('Error creating default admin account:', error);
  }
}

createDefaultAdmin();

app.use('/', mainRouter);
 
app.listen(port, () => { console.log(`Server is running on port ${port}`) });