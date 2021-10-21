const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isLoggedIn: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({title:title, imageUrl:imageUrl, description:description, price:price, userId:req.user});
  product.save()
  .then(result => {
    console.log('Created Product')
    res.redirect('/');

  }).catch(err=>{
    console.log('Product not Created')
    console.log(err)
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
    if (!product) {
      console.log('no product found')
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      isLoggedIn: req.session.isLoggedIn
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
  .then(product =>{
    product.title = updatedTitle
    product.price = updatedPrice
    product.imageUrl = updatedImageUrl
    product.description - updatedDesc

    return product.save()
  })
  .then(result =>{
    console.log('UPADATED PRODUCT')
    res.redirect('/admin/products');
  })
  // const updatedProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImageUrl,
  //   updatedDesc,
  //   updatedPrice
  // );
  // updatedProduct.save();
};

exports.getProducts = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isLoggedIn: req.session.isLoggedIn
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
  .then(result => {
    console.log('DELETED PRODUCT')
    res.redirect('/admin/products');
  }).catch(err => {
    console.log('An errored ocurred in deleting product.')
  });
};
