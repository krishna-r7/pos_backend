"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyOffer = void 0;
const offer_model_1 = require("../api/offer/offer.model");
const applyOffer = (unitPrice, quantity, offers) => {
    const validOffers = offers
        .filter(o => o.isActive)
        .sort((a, b) => a.priority - b.priority);
    if (validOffers.length === 0) {
        return {
            offerId: null,
            offerName: "No Offer",
            discountAmount: 0,
            freeQty: 0,
            finalTotal: unitPrice * quantity,
            isApplied: false,
        };
    }
    const offer = validOffers[0];
    let discountAmount = 0;
    let freeQty = 0;
    if (offer.type === offer_model_1.OfferType.PERCENTAGE) {
        discountAmount = (unitPrice * quantity * offer.discountPercent) / 100;
    }
    if (offer.type === offer_model_1.OfferType.QUANTITY && quantity >= offer.minQty) {
        discountAmount = offer.discountAmount;
    }
    return {
        offerId: offer._id,
        offerName: offer.name,
        discountAmount,
        freeQty,
        finalTotal: unitPrice * quantity - discountAmount,
        isApplied: discountAmount > 0,
    };
};
exports.applyOffer = applyOffer;
