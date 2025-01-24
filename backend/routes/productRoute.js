const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  removeProduct,
  getOneProduct,
  createProductReview,
  getProductReviews,
  removeReview,
  getAdminProducts,
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const upload = require("../middleware/multer");

const router = express.Router();

router.route("/products").get(getAllProducts);
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
router
  .route("/admin/products/create")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    upload.array("images"),
    createProduct
  );
router
  .route("/admin/products/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    upload.array("images"),
    updateProduct
  )
  .delete(isAuthenticatedUser, authorizeRoles("admin"), removeProduct);
router.route("/products/:id").get(getOneProduct);
router.route("/review").put(isAuthenticatedUser, createProductReview);
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, removeReview);

module.exports = router;
