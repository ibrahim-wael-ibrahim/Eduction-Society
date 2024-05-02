function diffAndComparison(obj1, obj2) {
    let result ={};

    for (let key in obj2) {
        if (key === 'institution' || obj2[key] === undefined) {
            continue;
        }
        if (obj1.hasOwnProperty(key)) {
            if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
                let difference = diffAndComparison(obj1[key], obj2[key]);
                if (Object.keys(difference).length > 0) {
                    result[key] = difference;
                }
            } else if (obj1[key] !== obj2[key]) {
                result[key] = obj2[key];
            }
        } else {
            result[key] = obj2[key];
        }
    }

    return Object.keys(result).length === 0 ? false : result;
}

export default diffAndComparison;
