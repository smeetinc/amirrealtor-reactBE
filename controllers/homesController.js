const Home = require("../models/Home");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc Get all homes
// @route GET /homes
// @access Private
const getAllHomes = asyncHandler(async (req, res) => {
  // Get all homes from MongoDB
  const homes = await Home.find().lean();

  // If no homes
  if (!homes?.length) {
    return res.status(400).json({ message: "No homes found at the moment" });
  }
  return res.status(200).json({ homes });
});

// @desc Get home details by ID
// @route GET /homes/:id
// @access Private
const getHomeDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) {
    return res.status(400).json({ message: "Home ID required" });
  }

  // Find home by ID
  const home = await Home.findById(id).lean();

  if (!home) {
    return res.status(404).json({ message: "Home not found" });
  }

  return res.status(200).json(home);
});

// @desc Create new home
// @route POST /homes
// @access Private
const createNewHome = asyncHandler(async (req, res) => {
  console.log("Console from post request => ", req.body);
  const {
    name,
    description,
    priceToBuy,
    bathrooms,
    bedrooms,
    size,
    propertyType,
    pricePerYearRent,
    address,
    location,
    ratings,
    numOfReviews,
    images,
    category,
    reviews,
    owner,
    user,
    area,
    amenities,
  } = req.body;

  // Confirm data
  if (
    !user ||
    !name ||
    !description ||
    !priceToBuy ||
    !bathrooms ||
    !bedrooms ||
    !size ||
    !propertyType ||
    !pricePerYearRent ||
    !address ||
    !images ||
    !category ||
    !area ||
    !amenities
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate name
  const duplicate = await Home.findOne({ name }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate home name" });
  }

  // Create and store the new home
  const home = await Home.create({
    name,
    description,
    priceToBuy,
    bathrooms,
    bedrooms,
    size,
    propertyType,
    pricePerYearRent,
    address,
    location,
    ratings,
    numOfReviews,
    images,
    category,
    reviews,
    owner,
    user,
    area,
    amenities,
  });

  if (home) {
    // Created
    return res.status(201).json({ message: "New home created" });
  } else {
    return res.status(400).json({ message: "Invalid home data received" });
  }
});

// @desc Update a home
// @route PATCH /homes
// @access Private
const updateHome = asyncHandler(async (req, res) => {
  const {
    id,
    name,
    description,
    priceToBuy,
    bathrooms,
    bedrooms,
    size,
    propertyType,
    pricePerYearRent,
    address,
    location,
    ratings,
    numOfReviews,
    images,
    category,
    reviews,
    owner,
    user,
    completed,
  } = req.body;

  // Confirm data
  if (
    !id ||
    name ||
    description ||
    priceToBuy ||
    bathrooms ||
    bedrooms ||
    size ||
    propertyType ||
    pricePerYearRent ||
    address ||
    location ||
    ratings ||
    !numOfReviews ||
    images ||
    category ||
    reviews ||
    owner ||
    user ||
    typeof completed !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm home exists to update
  const home = await Home.findById(id).exec();

  if (!home) {
    return res.status(400).json({ message: "Home not found" });
  }

  // Check for duplicate home
  const duplicate = await Home.findOne({ home }).lean().exec();

  // Allow renaming of the original home
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate home title" });
  }

  home.user = user;
  home.name = name;
  home.description = description;
  home.priceToBuy = priceToBuy;
  home.pricePerYearRent = pricePerYearRent;
  home.bathrooms = bathrooms;
  home.bedrooms = bedrooms;
  home.size = size;
  home.propertyType = propertyType;
  home.images = images;
  home.address = address;
  home.location = location;
  home.ratings = ratings;
  home.numOfReviews = numOfReviews;
  home.category = category;
  home.owner = owner;
  home.reviews = reviews;

  home.completed = completed;

  const updatedHome = await home.save();

  res.json(`'${updatedHome.name}' updated`);
});

// @desc Delete a home
// @route DELETE /homes
// @access Private
const deleteHome = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Home ID required" });
  }

  // Confirm note exists to delete
  const home = await Home.findById(id).exec();

  if (!home) {
    return res.status(400).json({ message: "Home not found" });
  }

  const result = await home.deleteOne();

  const reply = `Home '${result.name}' with ID ${result._id} deleted`;

  res.json(reply);
});

// @desc Search homes with pagination
// @route GET /homes/search
// @access Private
const searchHomes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  // Build search filters from a general search query
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } }, // Case-insensitive search for name
      { location: { $regex: search, $options: "i" } }, // Case-insensitive search for location
      { address: { $regex: search, $options: "i" } }, // Case-insensitive search for address
      { category: { $regex: search, $options: "i" } }, // Case-insensitive search for category
      { propertyType: { $regex: search, $options: "i" } }, // Case-insensitive search for propertyType
    ];
  }

  // Pagination logic
  const skip = (page - 1) * limit;

  // Fetch homes with pagination and filters
  const homes = await Home.find(query).limit(Number(limit)).skip(skip).lean();
  const totalHomes = await Home.countDocuments(query);

  return res.status(200).json({
    totalHomes,
    totalPages: Math.ceil(totalHomes / limit),
    currentPage: Number(page),
    homes,
  });
});

module.exports = {
  getAllHomes,
  createNewHome,
  updateHome,
  deleteHome,
  getHomeDetails,
  searchHomes,
};
