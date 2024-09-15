import mongoose from "mongoose";

const tokenListSchema = new mongoose.Schema({
    tokenName: {
        type: String,
        required: true,
    },
    key1: {
        type: Number,
        required: true,
    },
    key2: {
        type: Number,
        required: false,
    },
    key3: {
        type: Number,
        required: false,
    },
    key4: {
        type: Number,
        required: false,
    },
    key5: {
        type: Number,
        required: false,
    },
    target1: {
        type: Number,
        required: true,
    },
    target2: {
        type: Number,
        required: false,
    },
    target3: {
        type: Number,
        required: false,
    },
    target4: {
        type: Number,
        required: false,
    },
    target5: {
        type: Number,
        required: false,
    },
    target6: {
        type: Number,
        required: false,
    },
    target7: {
        type: Number,
        required: false,
    },
    exchange: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const TokenList = mongoose.models.TokenList || mongoose.model("TokenList", tokenListSchema);

export default TokenList;