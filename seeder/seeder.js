const mongoose = require("mongoose");
const Home = require("../models/Home");
const { homes } = require("./data");
// require('dotenv').config({ path: 'next.config.js' })

const seedHomes = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://bayodeol:Mo8Jl1Hg0Dbk@amgdgluster.rp0da.mongodb.net/hhj?retryWrites=true&w=majority"
    );

    await Home.deleteMany();
    console.log("Homes are deleted");

    await Home.insertMany(homes);
    console.log("Homes are added");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

seedHomes();
