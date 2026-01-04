import { applyOffer } from "./applyOffer";
import Item from "../api/item/item.model";


export const recalculateBillTotals = (bill: any) => {

    const activeItems = bill.items.filter(
        (i: any) => i.deletedAt === null
    );
    const subTotal = activeItems.reduce(
        (sum: number, item: any) => sum + item.unitPrice * item.quantity,
        0
    );

    const finalPayableAmount = activeItems.reduce(
        (sum: number, item: any) => sum + item.finalItemTotal,
        0
    );

    return {
        subTotal,
        finalPayableAmount,
        totalDiscount: subTotal - finalPayableAmount,
    };
};


export const reapplyOfferForBillItem = async (
    itemId: string,
    quantity: number
) => {
    const item = await Item.findById(itemId).populate("offers");
    if (!item) {
        throw new Error("Item not found");
    }

    const offerResult = applyOffer(
        item.price,
        quantity,
        item.offers as any[]
    );

    return {
        unitPrice: item.price,
        appliedOffer: {
            offerId: offerResult.offerId,
            offerName: offerResult.offerName,
            discountAmount: offerResult.discountAmount,
            freeQty: offerResult.freeQty,
        },
        finalItemTotal: offerResult.finalTotal,
    };
};
