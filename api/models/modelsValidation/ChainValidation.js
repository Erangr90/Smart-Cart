// Regexs for validation
const nameEnRegex = /^(?=.{2,50}$)[A-Z]{1}[a-z]{1,}(?:[A-Z]{1}[a-z]{1,}|[\'\-\&][A-Z]{1}[a-z]{1,}|[\'\-\&][a-z]{1,})*$/;
const nameHeRegex = /^(?=.{1,50}$)[\u05D0-\u05EA]{2,}(?:[\s\&\-]+[\u05D0-\u05EA0-9]{2,}|[\"\]+[\u05D0-\u05EA]+)*$/;
// const emailRegex = /^[a-zA-Z0-9\.\_\%\+\-]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$/;
// const businessNumberRegex = /^\d{2,10}$/;
// const phoneRegex = /^0\d{1,2}-?\d{7}$/;
const imageRegex = /^[\w\d\/\/\-\.\u05D0-\u05EA]{2,80}$/;


const isValidChain = (obj) => {
    const errors = [];
    if (!nameEnRegex.test(obj.name) && !nameHeRegex.test(obj.name)) { errors.push(`${obj.name} - Name is not valid `); }
    // if (!businessNumberRegex.test(obj.businessNumber)) { errors.push(`${obj.businessNumber} - businessNumber is not valid `); }
    // if (!emailRegex.test(obj.email)) { errors.push(`${obj.email} - email is not valid `); }
    // if (!phoneRegex.test(obj.phone)) { errors.push(`${obj.phone} - phone is not valid `); }
    if (obj.image && !imageRegex.test(obj.image)) { errors.push(`${obj.image} - image is not valid`); }
    if (errors.length > 0) {
        throw new Error([...errors]);
    } else {
        return true;
    }

};
export default isValidChain;