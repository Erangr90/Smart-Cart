// Regexs for validation
const nameEnRegex = /^(?=.{1,50}$)[A-Z]{1}[a-z0-9]{1,50}(?:[A-Z]{1}[\"]{1}[a-z]{1,50}|[a-z\"]{1,}[a-z])*$/;
const nameHeRegex = /^(?=.{1,50}$)[\u05D0-\u05EA\"]{1,}[\u05D0-\u05EA]*$/;


const isValidUnit = (obj) => {
    return nameEnRegex.test(obj.name_he) || nameHeRegex.test(obj.name_en);
};

export default isValidUnit;