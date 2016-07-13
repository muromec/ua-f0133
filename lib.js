function pad(value, len) {
    value = String(value || '');
    while (value.length < len) {
        value = '0' + value;
    }
    return value;

}

function ensure(value, len, strict, reason) {
    value = value ? value.toString() : '';
    if (!strict) {
        return pad(value, len);
    }
    if (value.length !== len) {
        console.warn('Ensure failed', value, len, strict);
        throw new Error(reason || 'Incorrect len');
    }

    return value;
}

function parseState(state) {
    if (state === 'tax') {
        return 1;
    }

    if (state === 'new') {
        return 2;
    }

    if (state === 'amend') {
        return 3;
    }

    if (state === 1 || state === 2 || state === 3) {
        return state;
    }

    throw new Error('State can be `tax`, `new` or `amend`, when ommited defaults to `tax`'); 
}

function parse(value, key) {
    if (key === 'state') {
        return parseState(value);
    }

    return value;
}

function join(fields, options) {
    return fields.reduce(function (acc, field) {
        var part = ensure(
            parse(options[field.key] || field.def, field.key),
            field.len, 
            field.strict, field.reason
        );
        return acc + part;
    }, '');
}

var FORMAT = [
    {key: 'taxOffice', len: 4},
    {key: 'taxId', len: 10, strict: true},
    {key: 'form', len: 8, strict: true},
    {key: 'state', len: 1, def: 1, strict: true},
    {key: 'amend', len: 2, def: 0},
    {key: 'seq', len: 7, def: 1},
    {key: 'period', len: 1, strict: true},
    {key: 'months', len: 2},
    {key: 'year', len: 4, strict: true},
    {key: 'taxOffice2', len: 4, strict: true},
    {key: 'format', len: 4, def: '.xml'},
];

function fixYear(value) {
    if (value && value.length === 2) {
        return '20' + value;
    }

    return value;
}

function guessMonths(period) {
    if (period === 2) {
        return 3;
    }

    if (period === 3) {
        return 6;
    }

    if (period === 4) {
        return 9;
    }

    if (period === 5) {
        return 12;
    }


    throw new Error('Cannot guess period length in months');
}

function shortcut(options) {
    return Object.assign({}, options, {
        year: fixYear(options.year),
        months: options.months || guessMonths(options.period),
        taxOffice2: options.taxOffice2 || options.taxOffice,
    });
}

function formatFileName(options) {
    return join(FORMAT, shortcut(options || {}));
}

module.exports = {
    formatFileName: formatFileName,
};
