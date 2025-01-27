import asyncHandler from "../middleware/asyncHandler.js";
import Store from "../models/storeModel.js";
import axios from "axios";

const getCord = asyncHandler(async (id) => {


    const store = await Store.findOne({ _id: id });

    // console.log(store);

    const name = store.address.postalCode == undefined ? ((store.address.city).includes(" ") ? (store.address.city).replace(" ", "%20") : store.address.city) : "''";
    const housenumber = (store.address.street).match(/\d+/) ? (store.address.street).match(/\d+/)[0] : "''";
    const street = (store.address.street).includes(" ") ? ((store.address.street).match(/[\u05D0-\u05EA]+/g)).join("%20") : (store.address.street).match(/[\u05D0-\u05EA]+/g);
    const postcode = store.address.postalCode ? store.address.postalCode : "''";
    const city = (store.address.city).includes(" ") ? (store.address.city).replace(" ", "%20") : (store.address.city);
    const key = "39158d37cd8b4972ac993a115c3e4682";





    const { data } = await axios.get(`https://api.geoapify.com/v1/geocode/search?name=${name}&housenumber=${housenumber}&street=${street}&postcode=${postcode}&city=${city}&country=ישראל&format=json&apiKey=${key}`);



    store.location.longitude = data.results[1]["lon"];
    store.location.latitude = data.results[1]["lat"];

    console.log(store);

    await store.save();



});

export default getCord;