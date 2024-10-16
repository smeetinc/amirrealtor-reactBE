const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter home name"],
      trim: true,
      maxLength: [200, "Home name cannot exceed 100 characters"],
    },
    description: [
      {
        content: {
          type: String,
          required: [true, "Please enter home name"],
        },
      },
    ],
    amenities: [
      {
        name: {
          type: String,
        },
      },
    ],
    area: {
      type: String,
      required: [true, "Please enter home area"],
    },
    bedrooms: {
      type: Number,
      required: [true, "Please enter number of bedrooms"],
    },
    bathroom: {
      type: Number,
      required: [true, "Please enter number of bathrooms"],
    },
    size: {
      type: String,
      required: [true, "Please enter home size"],
    },
    propertyType: {
      type: String,
      required: [true, "Please enter property type"],
    },

    pricePerYearRent: {
      type: Number,
      required: [true, "Please enter home price per year rent"],
      default: 0.0,
    },
    priceToBuy: {
      type: Number,
      required: [true, "Please enter home price to buy"],
      default: 0.0,
    },
    address: {
      type: String,
      required: [true, "Please enter home address"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please enter home category"],
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    owner: {
      type: String,
      required: [true, "Please enter home owner name"],
      trim: true,
      maxLength: [200, "Home owner name cannot exceed 100 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Home", homeSchema);
