import { OfferType } from "../api/offer/offer.model";

export const applyOffer = ( unitPrice: number, quantity: number, offers: any[]) => {

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

    if (offer.type === OfferType.PERCENTAGE) {
        discountAmount = (unitPrice * quantity * offer.discountPercent) / 100;
    }

    if (offer.type === OfferType.QUANTITY && quantity >= offer.minQty) {
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