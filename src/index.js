import express from 'express';
import morgan from 'morgan';
import engine from 'ejs-mate';
import mainRouter from './routers/mainRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
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


app.use('/', mainRouter);
 
app.listen(port, () => { console.log(`Server is running on port ${port}`) });