const qtyRegex = /^[0-9]{1,3}$/;
const totalPriceRegex = /^\d{1,5}(\.\d{1,2})?$/;

const isValidCart = (obj) => {
    if (obj.orderItems) {
        for (let orderItem of obj.orderItems) {
            if (!qtyRegex.test(orderItem.qty)) {
                throw new Error(`qty of ${orderItem} is not valid`);
            }
        }
    }
    if (!totalPriceRegex.test(obj.totalPrice)) { throw new Error("Total price is not valid"); }
    return true;
};

export default isValidCart;