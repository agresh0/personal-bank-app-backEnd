// using express ,create server

// 1.import express (using require)

const express = require('express')

// import data service

const dataService = require('./service/data.service')

// import cors

const cors = require('cors')

// import jsonwebtoken
const jwt = require('jsonwebtoken')



// 2.create an server app using express
const app = express()

// using cors define origin to server app
app.use(cors({
    origin:['http://localhost:4200']
}))

// to parse json data (for understand json data to java script)
app.use(express.json())

// 3.set up port for server app
app.listen(3000,()=>{
    console.log('Server started at port 3000');
})

// application specific middleware
const appMiddleware = (req,res,next)=>{
    console.log('This is application specific middleware');
    next()
}
app.use(appMiddleware)


// router specific middleware -router validation 
const jwtMiddleware = (req,res,next)=>{
    console.log('inside router specific function');
    // get token from request headers x-access-token key
    let token = req.headers['x-access-token']
    // verify token using jasonwebtoken
    try{
        let data = jwt.verify(token,'secretkey123')
        req.currentAcno = data.currentAcno
        next()
    }
    catch{
        res.status(404).json({
            status:false,
            message:'Authentication failed..,Please log in'
        })
    }

};

// 1.login Api
app.post('/login',(req,res)=>{
    console.log("inside login function");
    console.log(req.body);
    // asynchronus
    dataService.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    })

//  2.Register Api
app.post('/register',(req,res)=>{
    console.log("inside register function");
    console.log(req.body);
    // asynchronus
    dataService.register(req.body.acno,req.body.pswd,req.body.uname)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    })

// 3.Deposit api
app.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log("inside deposit function");
    console.log(req.body);
    // asynchronus
    dataService.deposit(req,req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    })

    // 4.Withdraw api
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    console.log("inside withdraw function");
    console.log(req.body);
    // asynchronus
    dataService.withdraw(req, req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    })

        // 5.getBalance api
app.post('/getBalance',jwtMiddleware,(req,res)=>{
    console.log("inside getBalance function");
    console.log(req.body);
    // asynchronus
    dataService.getBalance(req.body.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result);
    })
    })

    // 6.getTransaction api
app.post('/getTransaction',jwtMiddleware,(req,res)=>{
    console.log("inside getTransaction function");
    console.log(req.body);
    // asynchronus
    dataService.getTransaction(req.body.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    });
    });


    // 7.deleteAccount api
app.delete('/deleteAccount/:acno',jwtMiddleware,(req,res)=>{
    console.log("inside deleteAccount function");
    // asynchronus
    dataService.deleteAccount(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    });
    });









// // http requests
// app.get('/',(req,res)=>{
//     res.send('GET METHODE')
// })

// app.post('/',(req,res)=>{
//     res.send('POST METHODE')
// })

// app.put('/',(req,res)=>{
//     res.send('PUT METHODE')
// })

// app.patch('/',(req,res)=>{
//     res.send('PATCH METHODE')
// })

// app.delete('/',(req,res)=>{
//     res.send('DELETE METHODE')
// })

// // http request -REST API -BANK API
// app.post('/login',(req,res)=>{
    
// })

