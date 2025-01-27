// Regexs for validation
const nameEnRegex = /^(?=.{1,50}$)[A-Z]{1}[a-z0-9]{1,}(?:\s[A-Z]{1}[a-z0-9\&\s]{1,}|[\'\-\s\&][A-Z]{1}[a-z0-9\s]{1,}|[\'\-\s][a-z0-9]{1,})*$/;
const nameHeRegex = /^(?=.{1,50}$)[\u05D0-\u05EA]{2,}(?:[\s\&\-]+[\u05D0-\u05EA]{2,}|[\"\/]+[\u05D0-\u05EA]+)*$/;

const isValidCategory = (obj) => {
    // Check category's name
    return nameEnRegex.test(obj.name) || nameHeRegex.test(obj.name);
};

export default isValidCategory;