const express = require('express');
const { logger } = require('./middleware/logEvents');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');


const app = express();
const path = require('path');

const PORT = process.env.PORT || 3500;

app.use(logger);

const whitelist = ['http://localhost:3201', 'http://localhost:3500', 'http://127.0.0.1:3500/']

const corsOptions = {
    origin: (origin, callback)=>{
        if(whitelist.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        }
        else{
            callback( new Error("Not allowed by cors"));
        }
    },
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

//serve static files
app.use('/', express.static(path.join(__dirname, './public')));

app.use('/subdir', express.static(path.join(__dirname, './public')));

//routes

app.use('/', require('./routes/root'));

app.use('/subdir',require('./routes/subdir'));
app.use('/employees', require('./routes/api/employees'));



//app.use(errorHandler)

app.all('*',(req,res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')){
        res.sendFile(path.json({error: "404 not found"}));
    }
    else{
        send.type('txt').send('404 not found')
    }
});

app.listen(PORT, ()=>console.log(`Server running on PORT ${PORT}`));

