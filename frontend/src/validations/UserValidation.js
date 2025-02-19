// Regexs for validation
const nameEnRegex = /^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[A-Z]{1}[a-z]{1,}|[\'\-][A-Z]{1}[a-z]{1,}|[\'\-][a-z]{1,})*$/;
const nameHeRegex = /^(?=.{1,50}$)[\u05D0-\u05EA]{1,}(?:[\'\"\-][\u05D0-\u05EA]{1,})*$/;
const emailRegex = /^[a-zA-Z0-9\.\_\%\+\-]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,70}$/;


const isValidUser = (obj) => {
    const errors = [];
    // Check user's first name
    if (!nameEnRegex.test(obj.firstName) && !nameHeRegex.test(obj.firstName)) {
        errors.push(`${obj.firstName} - שם פרטי אינו תקין`);
    }
    // Check user's last name
    if (!nameEnRegex.test(obj.lastName) && !nameHeRegex.test(obj.lastName)) {
        errors.push(`${obj.lastName} - שם משפחה אינו תקין`);

    }
    // Check user's email
    if (!emailRegex.test(obj.email)) { errors.push(`${obj.email} - אימייל אינו תקין`); }
    // Check user's password
    if (!passwordRegex.test(obj.password)) {
        errors.push(`${obj.password} - סיסמא אינה תקינה`);
        if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(obj.password)) {
            errors.push(`${obj.password} חסר סימן מיוחד`);
        }
        if (!/(?=.*[A-Za-z])/.test(obj.password)) {
            errors.push(`${obj.password} חסרה לפחות אות אחת`);
        }
        if (!/(?=.*\d)/.test(obj.password)) {
            errors.push(`${obj.password} חסר לפחות מספר אחד`);
        }
    }
    if (errors.length > 0) {
        return errors;
    }

    return true;
};

export default isValidUser;