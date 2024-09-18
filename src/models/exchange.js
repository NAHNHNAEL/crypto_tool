import { create } from "browser-sync";
import e from "express";
import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema({
    exchangeID: {
        type: String,
        required: true,
    },
    exchangeName: {
        type: String,
        required: true,
    },
    exchangeType: {
        type: String,
        required: true,
    },
    exchangeUrl: {
        type: String,
    },
    createdAt: {
        type: Date,
        required: true,
    },
});

const Exchange = mongoose.models.Exchange || mongoose.model("Exchange", exchangeSchema);

export default Exchange;
