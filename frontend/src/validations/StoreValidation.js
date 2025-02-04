// Regexs for validation
const nameEnRegex = /^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[A-Z]{1}[a-z]{1,}|[\'\-\&][A-Z]{1}[a-z]{1,}|[\'\-\&\s][a-z0-9]{1,})*$/;
const nameHeRegex = /^(?=.{1,50}$)[\u05D0-\u05EA]{1,}(?:[\'\"\-\s\&][\u05D0-\u05EA0-9]{1,})*$/;
// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const businessNumberRegex = /^\d{2,10}$/;
const cityNameEnRegex = /^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[\'\-\s][A-Z]{1}[a-z]{1,}|[\'\-\s][a-z])*$/;
const cityNameHeRegex = /^(?=.{1,50}$)[\u05D0-\u05EA]{1,}(?:[\'\"\-\s][\u05D0-\u05EA]{1,})*$/;
const streetNameEnRegex = /^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[\'\-\s][A-Z]{1}[a-z]{1,}\s[0-9]+|[\'\-\s][a-z]\s[0-9]+)*$/;
const streetNameHeRegex = /^(?=.{1,50}$)[\u05D0-\u05EA]{1,}(?:[\'\"\-\s][\u05D0-\u05EA]{1,}|[\u05D0-\u05EA]+\s[0-9]+)*$/;
const postalCodeRegex = /^\d{3,10}$/;
// const phoneRegex = /^0\d{1,2}-?\d{7}$/;
// const branchNumberRegex = /^\d{2,10}$/;
const imageRegex = /^[\w\d\/\/\-\.\u05D0-\u05EA]{2,80}$/;


const isValidStore = (obj) => {
    const errors = [];
    if (!nameEnRegex.test(obj.name) && !nameHeRegex.test(obj.name)) { errors.push(`שם אינו תקין `); }
    // if (!businessNumberRegex.test(obj.businessNumber)) { errors.push(`מספר עסק אינו תקין`); }
    if (!cityNameEnRegex.test(obj.address.city) && !cityNameHeRegex.test(obj.address.city)) { errors.push(`שם עיק אינו תקין`); }
    if (!streetNameEnRegex.test(obj.address.street) && !streetNameHeRegex.test(obj.address.street)) { errors.push(`שם הרחוב אינו תקין`); }
    if (obj.address.postalCode && !postalCodeRegex.test(obj.address.postalCode)) { errors.push(`מיקוד אינו תקין `); }
    // if (!emailRegex.test(obj.email)) { errors.push(`אימייל אינו תקין `); }
    // if (!phoneRegex.test(obj.phone)) { errors.push(`טלפון אינו תקין `); }
    // if (!branchNumberRegex.test(obj.branchNumber)) { errors.push(`מספר סניף אינו תקין `); }
    if (obj.image && !imageRegex.test(obj.image)) { errors.push(`כתובת תמונה אינה תקינה`); }
    if (errors.length > 0) {
        return errors;
    } else {
        return true;
    }

};

export default isValidStore;