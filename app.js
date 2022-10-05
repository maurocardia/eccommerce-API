const express = require("express")

const {usersRouter} = require("./routes/users.routes")
const {productsRouter} = require("./routes/products.routes")
const {cartRouter} =  require("./routes/cart.routes")

const {globalErrorHandler} = require("./controllers/error.controllers")

const app = express()

app.use(express.json())

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