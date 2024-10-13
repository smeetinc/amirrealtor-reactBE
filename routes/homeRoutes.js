const express = require("express");
const router = express.Router();
const homesController = require("../controllers/homesController");

router
  .route("/")
  .get(homesController.getAllHomes) // List all homes
  .post(homesController.createNewHome) // Create new home
  .patch(homesController.updateHome) // Update home
  .delete(homesController.deleteHome); // Delete home

// Route for searching homes with filters and pagination
router.route("/search").get(homesController.searchHomes);

// Route for getting a single home by ID
router.route("/:id").get(homesController.getHomeDetails);

module.exports = router;
