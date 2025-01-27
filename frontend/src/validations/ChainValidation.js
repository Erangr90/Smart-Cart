// Regexs for validation
const nameEnRegex = /^(?=.{2,50}$)[A-Z]{1}[a-z]{1,}(?:[A-Z]{1}[a-z]{1,}|[\'\-\&][A-Z]{1}[a-z]{1,}|[\'\-\&][a-z]{1,})*$/;
const nameHeRegex = /^(?=.{1,50}$)[\u05D0-\u05EA]{2,}(?:[\s\&\-]+[\u05D0-\u05EA0-9]{2,}|[\"\]+[\u05D0-\u05EA]+)*$/;
// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const businessNumberRegex = /^\d{2,10}$/;
// const phoneRegex = /^0\d{1,2}-?\d{7}$/;
const imageRegex = /^[\w\d\/\/\-\.\u05D0-\u05EA]{2,80}$/;


const isValidChain = (obj) => {
    const errors = [];
    if (!nameEnRegex.test(obj.name) && !nameHeRegex.test(obj.name)) { errors.push("שם לא תקין"); }
    // if (!businessNumberRegex.test(obj.businessNumber)) { errors.push("מספר עסק לא תקין"); }
    // if (!emailRegex.test(obj.email)) { errors.push("אימייל לא תקין"); }
    // if (!phoneRegex.test(obj.phone)) { errors.push("מספר טלפון לא תקין"); }
    if (obj.image && !imageRegex.test(obj.image)) { errors.push("כתובת התמונה אינו תקין"); }
    return errors.length > 0 ? errors : true;

};
export default isValidChain;