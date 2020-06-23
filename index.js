const express = require('express')
const bodyParser = require('body-parser')

const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')

const mongoose = require('mongoose')

const User = require('./models/user')

const app = express()
const PORT = 3005

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.set('view engine', 'ejs')

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

const URI = 'mongodb+srv://ollivolt:ollivoltpass@cluster0.5xmcc.mongodb.net/main?retryWrites=true&w=majority'
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const dbConnection = mongoose.connection
dbConnection.on('error', (err) => console.log(`Connection error: ${err}`))
dbConnection.once('open', () => console.log('DB Connected'))

app.get('/', (req, res) => {
    res.render('index', {name: 'transferred variable'})
})

app.get('/users', async (req, res) => {

    const users = await User.find({})

    res.render('users', {users})
})

app.get('/user', async (req, res) => {

    const id = req.query.id
    const user = await User.findById(id)

    res.render('user', {user})
})

app.post('/user', async (req, res) => {
    await User.findByIdAndRemove(req.query.id)

    res.redirect('/users')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', urlencodedParser, async (req, res) => {
    if (!req.body) {
        return res.sendStatus(400)
    }

    const { name, age, login } = req.body

    await User.create({name, age: parseInt(age), login, creationDate: (new Date)})

    res.redirect('/users')
})

app.get('/find', (req, res) => {
    res.render('find')
})

app.post('/find', urlencodedParser, async (req, res) => {
    const { name = undefined, login = undefined } = req.body
    const users = await User.find({name, login})

    res.render('users', {users})
})

app.listen(PORT, (err) => {
    console.log(err ? err : 'Server started')
})