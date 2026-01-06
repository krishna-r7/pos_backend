
import { Request, Response } from "express";
import Item from "../item/item.model";
import { applyOffer } from "../../utils/applyOffer";
import { getOrCreateOpenBill } from "./bill.service";
import Bill, { BillStatus } from "./bill.model";
import { recalculateBillTotals, reapplyOfferForBillItem } from "../../utils/bill.utils";



export class BillController {

  addItemToBill = async (req: Request, res: Response) => {
    try {
      const { itemId, quantity, cashierId } = req.body;

      const item = await Item.findById(itemId).populate("offers");
      if (!item) {
        res.status(404).json({ message: "Item not found" });
        return;
      }

      const bill = await getOrCreateOpenBill(cashierId);

      const alreadyExists = bill.items.some(
        (i) => i.itemId.toString() === itemId && i.deletedAt === null
      );

      if (alreadyExists) {
        return res.status(400).json({
          message: "Item already added to bill. Update quantity instead.",
        });
      }

      const offerResult = await applyOffer(
        item.price,
        quantity,
        item.offers as any[]
      );

      bill.items.push({
        itemId: item._id,
        itemName: item.name,
        unitPrice: item.price,
        quantity,
        availableOffer: {
          offerId: offerResult.offerId,
          offerName: offerResult.offerName,
          discountAmount: offerResult.discountAmount,
          freeQty: offerResult.freeQty,
          isApplied: offerResult.isApplied,
        },
        finalItemTotal: offerResult.finalTotal,
      });

      bill.subTotal = bill.items.reduce(
        (sum, i) => sum + (i.unitPrice || 0) * i.quantity,
        0
      );

      bill.finalPayableAmount = bill.items.reduce(
        (sum, i) => sum + i.finalItemTotal,
        0
      );

      bill.totalDiscount = bill.subTotal - bill.finalPayableAmount;


      await bill.save();

      return res.status(200).json({ status: 200, message: "Item added to bill", bill });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({ message: "Failed to add item" });
    }
  };

  getCurrentBill = async (req: Request, res: Response): Promise<void> => {
    try {
      const cashierId = req.params.cashierId;
      console.log(cashierId);
      const bill = await Bill.findOne({
        cashierId,
        status: BillStatus.OPEN,
      });
      console.log(bill);

      if (!bill) {
        res.status(200).json({ message: "Bill not found", items: [], subTotal: 0, totalDiscount: 0, finalPayableAmount: 0 });
        return;
      }

      const activeItems = bill.items.filter(
        (item) => item.deletedAt === null
      );

      const subTotal = activeItems.reduce(
        (sum, i) => sum + (i.unitPrice || 0) * i.quantity,
        0
      );

      const finalPayableAmount = activeItems.reduce(
        (sum, i) => sum + i.finalItemTotal,
        0
      );

      const totalDiscount = subTotal - finalPayableAmount;

      res.status(200).json({ status: 200,
        items: activeItems,
        subTotal,
        totalDiscount,
        finalPayableAmount,
        id: bill._id,
        message: "Bill fetched successfully",
      });

      // res.status(200).json({ message: "Bill fetched successfully", bill });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch bill" });
    }
  };


  createBill = async (req: Request, res: Response): Promise<void> => {
    try {
      const { billId } = req.params;

      const bill = await Bill.findOne({
        status: BillStatus.OPEN,
        _id: billId,
      });

      if (!bill || bill.items.length === 0) {
        res.status(400).json({ status: 400, message: "No active bill found" });
        return;
      }

      bill.status = BillStatus.COMPLETED;
      bill.generatedAt = new Date();

      await bill.save();

      res.status(200).json({ status: 200, message: "Bill generated successfully", bill });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({ status: 500, message: "Failed to generate bill" });
    }
  };


  updateItemQuantity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { itemId, quantity, cashierId , billId,productId } = req.body;

      const bill = await Bill.findOne({
        status: BillStatus.OPEN,
        _id: billId,
      });

      if (!bill) {
        res.status(404).json({  status: 400, message: "No active bill found" });
        return;
      }

      const billItem = bill.items.find(
        (i) => i._id.toString() === itemId
      );

      if (!billItem) {
        res.status(404).json({ status: 400,  message: "Item not found in bill" });
        return;
      }

      const updatedItem = await reapplyOfferForBillItem(productId, quantity);

      billItem.quantity = quantity;
      billItem.availableOffer = updatedItem.availableOffer;
      billItem.finalItemTotal = updatedItem.finalItemTotal;

      const totals = recalculateBillTotals(bill);
      bill.subTotal = totals.subTotal;
      bill.finalPayableAmount = totals.finalPayableAmount;
      bill.totalDiscount = totals.totalDiscount;

      await bill.save();

      res.status(200).json({ status: 200, message: "Item quantity updated", bill });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({ status: 500, message: "Failed to update quantity" });
    }
  };

  removeItemFromBill = async (req: Request, res: Response): Promise<void> => {
    try {
      const { itemId,billId } = req.body;

      const bill = await Bill.findOne({
        status: BillStatus.OPEN,
        _id: billId,
      });

      if (!bill) {
        res.status(404).json({ status: 400, message: "No active bill found" });
        return;
      }

      const billItem = bill.items.find(
        (i) => i._id.toString() === itemId
      );

      if (!billItem) {
        res.status(404).json({ status: 400, message: "Item not found in bill" });
        return;
      }

      billItem.deletedAt = new Date();

      const activeItems = bill.items.filter(i => i.deletedAt === null);

      bill.subTotal = activeItems.reduce(
        (sum, i) => sum + (i.unitPrice || 0) * i.quantity,
        0
      );

      bill.finalPayableAmount = activeItems.reduce(
        (sum, i) => sum + i.finalItemTotal,
        0
      );

      bill.totalDiscount = bill.subTotal - bill.finalPayableAmount;

      await bill.save();
      res.status(200).json({ status: 200, message: "Item removed from bill", bill });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({ status: 500, message: "Failed to remove item" });
    }
  };

  getHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cashierId } = req.query;
      let page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || 10;

      let filter: any = { status: BillStatus.COMPLETED };

      if (cashierId) {
        filter.cashierId = cashierId;
      }

      const bills = await Bill.find(
        filter
      ).sort({ generatedAt: -1 }).skip((page - 1) * limit).limit(limit).lean();

      const cleanedBills = bills.map((bill: any) => ({
        ...bill, items: bill.items.filter(
          (item: any) => item.deletedAt === null
        ),
      }));

      console.log(cleanedBills[0].items);



      const total = cleanedBills.length;
      const totalPages = Math.ceil(total / limit);
      

      res.status(200).json({ message: "Bill history fetched successfully",
        bills:cleanedBills, 
        pagination: {
        page,
        limit,
        total,
        totalPages,

      } });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch bill history" });
    }
  };

};