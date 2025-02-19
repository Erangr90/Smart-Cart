const nameEnRegex = /^(?=.{1,50}$)[A-Z]{1}[a-z]{1,}(?:[A-Z]{1}[a-z]{1,}|[\'\-][A-Z]{1}[a-z]{1,}|[\'\-][a-z]{1,})*$/;
const nameHeRegex = /^(?=.{1,50}$)[\u05D0-\u05EA]{1,}(?:[\'\"\-][\u05D0-\u05EA]{1,})*$/;
const emailRegex = /^[a-zA-Z0-9\.\_\%\+\-]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,70}$/;


const isValidUser = (obj) => {
    const errors = [];
    // Check user's first name
    if (!nameEnRegex.test(obj.firstName) && !nameHeRegex.test(obj.firstName)) {
        errors.push(`${obj.firstName} - First name is not valid`);
    }
    // Check user's last name
    if (!nameEnRegex.test(obj.lastName) && !nameHeRegex.test(obj.lastName)) {
        errors.push(`${obj.lastName} - Last name is not valid`);

    }
    // Check user's email
    if (!emailRegex.test(obj.email)) { errors.push(`${obj.email} - Email is not valid`); }
    // Check user's password
    if (!passwordRegex.test(obj.password)) { errors.push(`${obj.password} - Password name is not valid`); }
    if (errors.length > 0) {
        throw new Error(...errors);
    }

    return true;
};

export default isValidUser;