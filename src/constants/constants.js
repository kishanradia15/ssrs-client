export const DEBITCARD = 'debitCard';
export const NETBANKING = 'netBanking';
export const PAYTM = 'paytm';
export const OFFLINE = 'offline';
export const ONLINE = 'online';

export const paymentMode = [OFFLINE, PAYTM, NETBANKING, DEBITCARD]

export const collectionTypeCategory = {
    DELIVERY: "Delivery",
    PICKUP: "Pickup"
}

export const defaultCart = {
    collectionType: {},
    collectionTypeCost: 0,
    orderId: "",
    orders: [],
    ordersCost: 0,
    requestedBy: "",
    status: 20,
    totalCost: 0,
    _id: "1",
    pickup: '',
    delivery: ''
}