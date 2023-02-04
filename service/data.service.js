// import model account
const db = require('./db')

// import jsonwebtoken
const jwt = require('jsonwebtoken')

// login function
const login = (acno, pswd) => {
    console.log('inside login function defintion');
    // check acno and pswd in present in mongo db
    // asynchronous function (promise methode used to resolve)
    return db.Account.findOne({
        acno,
        password: pswd
    }).then((result) => {
        if (result) {
            // acno n pswd present in db
            console.log('Login Successfull');

            // currentacno
            let currentAcno = acno

            // generate token 
            const token = jwt.sign({
                currentAcno: acno
            },
                'secretkey123')
            return {
                status: true,
                message: 'login Successfull',
                username: result.username,
                statusCode: 200,
                token,
                currentAcno
            }
        }
        else {
            console.log('Invalid Account / Password');
            return {
                status: false,
                message: 'Invalid Account / Password',
                statusCode: 400
            }
        }
    })
}

// Register function
const register = (acno, pswd, uname) => {
    console.log('inside register function defintion');
    // check acno and pswd in present in mongo db
    // asynchronous function (promise methode used to resolve)
    return db.Account.findOne({
        acno,
    }).then((result) => {
        if (result) {
            // acno n  present in db
            console.log('Already Registerd');
            return {
                status: false,
                message: 'Already Registerd',
                statusCode: 404
            }
        }
        else {
            console.log('Register Successful');
            let newAccont = new db.Account({
                acno,
                password: pswd,
                username: uname,
                balance: 0,
                transaction: []
            })
            newAccont.save()
            return {
                status: true,
                message: 'Register Successfull',
                statusCode: 200
            }
        }
    })
}

// Deposit Function
const deposit = (req, acno, pswd, amount) => {

    let amt = Number(amount)
    console.log('inside deposit function defintion');
    // check acno and pswd in present in mongo db
    // asynchronous function (promise methode used to resolve)
    return db.Account.findOne({
        acno,
        password: pswd
    }).then((result) => {
        if (result) {
            // acno n pswd present in db
            if (req.currentAcno != acno) {
                return {
                    status: false,
                    message: 'Denied',
                    statusCode: 404
                }
            }

            result.balance += amt
            result.transaction.push({
                type: 'CREDIT',
                amount: amt
            })
            result.save()
            console.log('Deposit Successfull');
            return {
                status: true,
                message: `${amount} Credited Successfully`,
                statusCode: 200
            }
        }
        else {
            console.log('Invalid Account / Password');
            return {
                status: false,
                message: 'Invalid Account / Password',
                statusCode: 400
            }
        }
    })
}

// Withdraw Function
const withdraw = (req, acno, pswd, amount) => {

    let amt = Number(amount)
    console.log('inside withdraw function defintion');
    // check acno and pswd in present in mongo db
    // asynchronous function (promise methode used to resolve)
    return db.Account.findOne({
        acno,
        password: pswd
    }).then((result) => {
        if (result) {
            // acno n pswd present in db

            if (req.currentAcno != acno) {
                return {
                    status: false,
                    message: 'operation denied, only allows own account transaction.',
                    statusCode: 404
                }
            }
            // check suffiecient balance
            if (result.balance < amt) {
                // insufficient balance
                return {
                    status: false,
                    message: 'Insufficient balance.',
                    statusCode: 404
                }
            }
            // perform withdraw
            result.balance -= amt
            result.transaction.push({
                type: 'DEBIT',
                amount: amt
            })
            result.save()
            console.log('Debited Successfull');
            return {
                status: true,
                message: `${amount} Debited Successfully`,
                statusCode: 200
            }
        }
        else {
            console.log('Invalid Account / Password');
            return {
                status: false,
                message: 'Invalid Account / Password',
                statusCode: 400
            }
        }
    })
}

// getBalance

const getBalance = (acno) => {
    return db.Account.findOne({
        acno
    }).then(
        (result) => {
            if (result) {
                // acno present in db
                let balance = result.balance
                result.transaction.push({
                    type: 'BALANCE ENQUIRY',
                    amount: 'NIL'
                })
                result.save()
                // send to client
                return {
                    status: true,
                    statusCode: 200,
                    message: `Your current balance is:${balance}`
                }
            }
            else {
                // acno not present in db
                // send to client
                return {
                    status: false,
                    statusCode: 400,
                    message: `Invalid Account Number`
                }
            }
        }
    )

}


// getTransaction

const getTransaction = (acno) => {
    return db.Account.findOne({
        acno
    }).then(
        (result) => {
            if (result) {
                // send to client
                return {
                    status: true,
                    statusCode: 200,
                    transaction:result.transaction
                }
            }
            else {
                // acno not present in db
                // send to client
                return {
                    status: false,
                    statusCode: 404,
                    message: `Invalid Account Number`
                }
            }
        }
    )

}

// deleteAccount
const deleteAccount = (acno) =>{

    return db.Account.deleteOne({
        acno
    }).then((result)=>{
        if(result){
            // send to client
            return {
                status:true,
                statusCode:200,
                message:'Account deleted successfully'
            }
        }
        else{
            // acno not present in db
            // send to client
            return{
                status:false,
                statusCode:404,
                message:'Invalid account number'
            }
        }
    })
}



// export login
module.exports = {
    login,
    register,
    deposit,
    withdraw,
    getBalance,
    getTransaction,
    deleteAccount
}