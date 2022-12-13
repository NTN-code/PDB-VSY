import Cookies from 'js-cookie'
import {atom} from "recoil";

export const isAuthKey = atom({
    key: 'isAuthKey', // unique ID (with respect to other atoms/selectors)
    default: Cookies.get('isAuthKey') ? Cookies.get('isAuthKey')  : false, // default value (aka initial value)
});

export const sessionTokenKey = atom({
    key: "sessionTokenKey",
    default: Cookies.get('sessionTokenKey') ? Cookies.get('sessionTokenKey')  : "",
})

export const isAdminKey = atom({
    key: "isAdminKey",
    default: Cookies.get('isAdminKey') ? Cookies.get('isAdminKey')  : false,
})

export const userKey = atom({
    key: "userKey",
    default:  Cookies.get("userKey") ? JSON.parse(Cookies.get("userKey")) : {},
})

export const appKey = atom({
    key: "appKey",
    default: Cookies.get("appKey") ? Cookies.get("appKey") : ""
})


export const userIdKey = atom({
    key: "userIdKey",
    default: localStorage.getItem("userIdKey") ? localStorage.getItem("userIdKey") : 0
})


export const caretKey = atom({
    key: "caretKey",
    default: JSON.parse(localStorage.getItem("caretKey")) ? localStorage.getItem("caretKey") : localStorage.setItem("caretKey", JSON.stringify({}))
})

export const paymentBucketKey = atom({
    key: "paymentBucketKey",
    default: localStorage.getItem("paymentBucketKey") ? JSON.parse(localStorage.getItem("paymentBucketKey")) : {}
})

export const allPriceKey = atom({
    key: "allPriceKey",
    default: localStorage.getItem("allPriceKey") ? Number(localStorage.getItem("allPriceKey")) : localStorage.setItem("allPriceKey", 0)
})

export const idsForPayKey = atom({
    key: "idsForPayKey",
    default: localStorage.getItem("idsForPayKey") ? JSON.parse(localStorage.getItem("idsForPayKey")) : localStorage.setItem("idsForPayKey", JSON.stringify([]))
})
