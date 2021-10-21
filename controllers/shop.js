const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
      isLoggedIn: req.session.isLoggedIn
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product
  .findById(prodId)
  .then(product =>{

    res.render('shop/product-detail', {
      product: product,
      pageTitle: "Shop", //product.title,
      path: '/products',
      isLoggedIn: req.session.isLoggedIn
    });
  })
  // Product.findById(prodId, product => {
  // });
};

exports.getIndex = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      isLoggedIn: req.session.isLoggedIn,
      
    });
  });
};

exports.getCart = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .then(user => {
    products = user.cart.items
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products,
      isLoggedIn: req.session.isLoggedIn
    })
  }).catch( err =>{
    console.log(err)
  })
  
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  .then(product => {
    return req.user.addToCart(product)
  })
  .then(result => {
    console.log(result)
  res.redirect('/cart');
  }) 
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
  .removeFromCart(prodId)
  .then(result =>{
    res.redirect('/cart')
  }).catch(err =>{
    console.log(err)
  })
 
};

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isLoggedIn: req.session.isLoggedIn
    });

  }).catch(err => {console.log(err)})
};

exports.postOrder = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .then(user => {
      products = user.cart.items.map(i => {
        return {quantity: i.quantity, product: {...i.productId._doc}}
      })
      
  const order = new Order({
    user: {
      email: req.session.user.email,
      userId: req.user._id
    },
    products: products
  })
   return order.save()
  })
  .then(result =>{
    req.user.clearCart()
  })
  .then(result => {
    res.redirect('/orders')
  }).catch(err =>{console.log(err)})
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    isLoggedIn: req.session.isLoggedIn
  });
};
