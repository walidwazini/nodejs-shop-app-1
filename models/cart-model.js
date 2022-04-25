const fs = require('fs')
const path = require('path')

const cartFilePath = path.join(
  path.dirname(require.main.filename),
  'data',
  'cart.json'
)

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // fetch previous cart
    fs.readFile(cartFilePath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 }
      if (!err) {
        cart = JSON.parse(fileContent)
      }
      // Analyze the cart => find existing prod item
      const existingProductIndex =
        cart.products.findIndex(prod => prod.id === id)
      const existingProducts = cart.products[existingProductIndex]
      let updatedProducts
      // Add new product / increase qty
      if (existingProducts) {
        updatedProducts = { ...existingProducts }
        updatedProducts.qty = updatedProducts.qty + 1
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProducts
      } else {
        updatedProducts = { id: id, qty: 1 }
        cart.products = [...cart.products, updatedProducts]
      }
      cart.totalPrice = cart.totalPrice + +productPrice
      fs.writeFile(cartFilePath, JSON.stringify(cart), err => {
        console.log(err)
      })
    })
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(cartFilePath, (err, fileContent) => {
      if (err) {
        return
      }
      const updatedCart = { ...JSON.parse(fileContent) }  // fileContent is the cart.json
      const product = updatedCart.products.find(prod => prod.id === id)
      const productQty = product.qty
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id)
      updatedCart.totalPrice = updatedCart.totalPrice - (productPrice * productQty)

      fs.writeFile(cartFilePath, JSON.stringify(updatedCart), err => {
        console.log(err)
      })
    })
  }
}