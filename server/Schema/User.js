const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let profile_imgs_name_list = [
  "Garfield",
  "Tinkerbell",
  "Annie",
  "Loki",
  "Cleo",
  "Angel",
  "Bob",
  "Mia",
  "Coco",
  "Gracie",
  "Bear",
  "Bella",
  "Abby",
  "Harley",
  "Cali",
  "Leo",
  "Luna",
  "Jack",
  "Felix",
  "Kiki",
];
let profile_imgs_collections_list = [
  "notionists-neutral",
  "adventurer-neutral",
  "fun-emoji",
];

const userSchema = new Schema(
  {
    personal_info: {
      fullname: {
        type: String,
        required: true,
        minlength: 3,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
          validator: function (v) {
            return (
              v &&
              v.length > 0 &&
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
            );
          },
          message: (props) => `${props.value} is not a valid email address!`,
        },
      },
      password: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
      },
      bio: {
        type: String,
        maxlength: [200, "Bio should not be more than 200"],
        default: "",
      },
      profile_img: {
        type: String,
        default:
          "https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg",
      },
    },
    social_links: {
      youtube: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
    account_info: {
      total_posts: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
    },
    google_auth: {
      type: Boolean,
      default: false,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogs",
      },
    ],
  },
  { timestamps: true }
);

userSchema.index({ "personal_info.email": 1 }, { unique: true });

module.exports = mongoose.model("users", userSchema);
