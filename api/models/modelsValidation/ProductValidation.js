// Regexs for validation
const nameEnRegex = /^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[A-Z]{1}[a-z]{1,}|[\'\-\&\s][A-Z]{1}[a-z]{1,}|[\'\-\&\s][a-z]{1,})*$/;
const nameHeRegex = /^(?=.{1,50}$)[\u05D0-\u05EA]{1,}(?:[\'\"\-\&\%][\u05D0-\u05EA]{1,})*$/;
const imageRegex = /^[\w\d\/\/\-\.\u05D0-\u05EA]{2,80}$/;
const manufacturerEnRegex = /^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[A-Z]{1}[a-z]{1,}|[\'\-\&][A-Z]{1}[a-z]{1,}|[\'\-\&][a-z]{1,})*$/;
const manufacturerHeRegex = /^(?=.{1,50}$)[\u05D0-\u05EA]{1,}(?:[\'\"\-\&][\u05D0-\u05EA]{1,})*$/;
const descriptionRegex = /^(?=.{1,255}$)[a-zA-Z\u05D0-\u05EA0-9\!\@\#\[\]\{\}\s\$\%\^\&\*\)\(\\\+\=\.\_\:\'\;\/\<\>\|\?\"\`\~\,\-]*$/;
const barcodeRegex = /^\d{2,50}$/;
const measureRegex = /^[0-9]{1,7}$/;
const country_codeRegex = /^[A-Z]{2,3}$/;

const isValidProduct = (obj) => {
    const errors = [];
    if (!nameEnRegex.test(obj.name) && !nameHeRegex.test(obj.name)) { errors.push(`${obj.name} - Name is not valid `); }
    if (obj.image && !imageRegex.test(obj.image)) { errors.push(`${obj.image} - Image is not valid `); }
    if (!manufacturerEnRegex.test(obj.manufacturer) && !manufacturerHeRegex.test(obj.manufacturer)) { errors.push(`${obj.manufacturer} - Manufacturer is not valid `); }
    if (!descriptionRegex.test(obj.description)) { errors.push(`${obj.description} - Description is not valid `); }
    if (!barcodeRegex.test(obj.barcode)) { errors.push(`${obj.barcode} - BarCode is not valid `); }
    if (!measureRegex.test(obj.measure)) { errors.push(`${obj.measure} - Measure is not valid `); }
    if (!nameEnRegex.test(obj.country) && !nameHeRegex.test(obj.country)) { errors.push(`${obj.country} - Country is not valid `); }
    if (!country_codeRegex.test(obj.country_code)) { errors.push(`${obj.country_code} - Country Code is not valid`); }
    if (errors.length > 0) {
        throw new Error(...errors);
    }
    return true;

};

export default isValidProduct;