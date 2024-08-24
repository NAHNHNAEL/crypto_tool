import express from 'express';
import morgan from 'morgan';
import engine from 'ejs-mate';
import mainRouter from './routers/mainRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port =3000;

// Lấy đường dẫn thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setting EJS is default template engine
app.set('views', path.join(__dirname, 'views'));
// Setting public folder is static folder
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// Setting morgan to log HTTP requests
app.use(morgan('dev'));


app.use('/', mainRouter);
 
app.listen(port, () => { console.log(`Server is running on port ${port}`) });