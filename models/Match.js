const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const MatchSchema = new Schema(
  {
    BookToChange: {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
    BookToReceive: {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },

    status: { type: string, required: true }, // pending / exchanged / rejected
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Match = model("Match", MatchSchema);

module.exports = Match;
