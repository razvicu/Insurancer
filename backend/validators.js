
validateId = function(value) {
    if (!isNaN(value)) {
        return '';
    } else {
        return 'Id invalid.';
    }
}

validateInsuredName = function(value) {
    if (value.length > 3) {
        return '';
    } else {
        return 'Numele este prea scurt';
    }
}

validateLicensePlate = function(value) {
    if (/[a-zA-Z]{1,2}[0-9]{2,3}[a-zA-Z]{3}/.test(value)) {
        return '';
    } else {
        return 'Numar de inmatriculare gresit';
    }
}

validatePhoneNumber = function(value) {
    if (/0(2|7)[0-9]{8}/.test(value)) {
        return '';
    } else {
        return 'Numar de telefon gresit';
    }
}

validateExpirationDate = function(value) {
    if (/[1-9][0-9]{3}-(0[1-9]|1[0-2])-([0-2][0-9]|30|31)/.test(value)) {
        return '';
    } else {
        return 'Data expirarii gresita';
    }
}

module.exports = {
    validateId: validateId,
    validateInsuredName: validateInsuredName,
    validateLicensePlate: validateLicensePlate,
    validatePhoneNumber: validatePhoneNumber,
    validateExpirationDate: validateExpirationDate
}
