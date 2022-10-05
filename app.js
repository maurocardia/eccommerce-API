const express = require("express")
const helmet = require ("helmet")
const compression = require("compression")
const morgan = require("morgan")

const {usersRouter} = require("./routes/users.routes")
const {productsRouter} = require("./routes/products.routes")
const {cartRouter} =  require("./routes/cart.routes")

const {globalErrorHandler} = require("./controllers/error.controllers")

const app = express()


app.use(express.json())

app.use(helmet())
app.use(compression())

if(process.env.NODE_ENV === "development")app.use(morgan("dev"))
else if(process.env.NODE_ENV === "production") app.use(morgan("combined"))

app.use("/api/v1/users", usersRouter)
app.use("/api/v1/products", productsRouter)
app.use("/api/v1/carts", cartRouter)
    
app.use(globalErrorHandler)

app.all("*",(req, res)=>{
    res.status(404).json({
        status: "error",
        messaje: `${req.method} ${req.url} does no exists  in our server`
        })
})

module.exports = {app}