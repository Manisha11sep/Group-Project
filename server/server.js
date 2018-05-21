require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session")
const massive = require("massive")
import userCtrl from './user_controller'
import productCtrl from './product_controller'
import orderCtrl from './order_controller'

const app = express()
app.use(bodyParser.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
)
massive(process.env.CONNECTION_STRING)
  .then(db => {
    app.set("db", db)
  })
  .catch(err => console.log("error", err))

const PORT = 9000
app.listen(PORT, () => {
  console.log(`It's over ${PORT}!!!`)
})

app.get("/api/shop", productCtrl.getProducts)
app.delete("/api/shop/:id", productCtrl.deleteProduct)
app.put("/api/shop/:id", productCtrl.updateProduct)
app.post("/api/shop", productCtrl.createProduct)

app.get("/auth/callback", userCtrl.auth)
app.post("/api/logout", userCtrl.logout)
app.get("/api/user-data", (req, res) => {
  res.json({ user: req.session.user })
})
app.post("/api/cart", userCtrl.cart)
app.get("/api/admin", userCtrl.admin)