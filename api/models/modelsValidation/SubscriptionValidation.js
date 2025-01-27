// Regexs for validation
const nameEnRegex = /^(?=.{1,50}$)[A-Z]{1}[a-z0-9\&\s]{1,}(?:[A-Z]{1}[a-z0-9\&\s]{1,}|[\'\-\s][A-Z]{1}[a-z0-9\&\s]{1,}|[\'\-\s][a-z0-9]{1,})*$/;
const nameHeRegex = /^(?=.{1,50}$)[\u05D0-\u05EA0-9]{1,}(?:[\'\"\-\s][\u05D0-\u05EA0-9]{1,})*$/;
const numberRegex = /^\d{1,5}(\.\d{1,2})?$/;
const descriptionRegex = /^(?=.{1,255}$)[a-zA-Z\u05D0-\u05EA0-9\!\@\#\[\]\{\}\s\$%\^\&*\)\(\\\+\=\.\_\:\'\;\/\<\>\|\?\"\`\~\,\-]*$/;

const isValidSubscription = (obj) => {
    const errors = [];
    // Check subscription's name
    if (!nameEnRegex.test(obj.name) && !nameHeRegex.test(obj.name)) {
        errors.push(`${obj.name} - Name is not valid`);
    }
    // Check subscription's price and discount
    if (!numberRegex.test(obj.price) || !numberRegex.test(obj.discount)) { errors.push(`${obj.price} - Price or discount is not valid`); }
    // Check subscription's description
    if (!descriptionRegex.test(obj.description)) { errors.push(`${obj.description} - Description is not valid`); }
    if (errors.length > 0) {
        throw new Error(...errors);
    }
    return true;
};

export default isValidSubscription;