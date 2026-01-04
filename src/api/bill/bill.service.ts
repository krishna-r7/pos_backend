import Bill, { BillStatus } from "./bill.model";

export const getOrCreateOpenBill = async (cashierId: string) => {
  let bill = await Bill.findOne({
    cashierId,
    status: BillStatus.OPEN,
  });

  if (!bill) {
    bill = await Bill.create({
      cashierId,
      items: [],
    });
  }

  return bill;
};
