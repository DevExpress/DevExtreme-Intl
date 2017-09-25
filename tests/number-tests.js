var QUnit = require('qunitjs');
var locale = require('devextreme/localization').locale;
var numberLocalization = require('devextreme/localization/number');

require('../src/number');

[ 'de', 'en', 'ja', 'ru' ].forEach(function(localeId) {
    var getIntlFormatter = function(format) {
        return (new Intl.NumberFormat(localeId, format)).format;
    };

    QUnit.module('number - ' + localeId, {
        beforeEach: function() {
            locale(localeId);
        },
        afterEach: function() {
            locale('en');
        }
    });

    QUnit.test('format', function(assert) {
        var separator = localeId === 'de' || localeId === 'ru' ? ',' : '.';
        function getLocalizedFixedNumber(integerPart, fractionPart) {
            return integerPart + separator + fractionPart;
        }
        var assertData = [
            {
                value: 43789,
                format: 'decimal',
                intlFormat: {
                    maximumFractionDigits: 0,
                    minimumIntegerDigits: 1,
                    round: 'floor',
                    useGrouping: false
                }
            },
            { value: 437, format: { type: 'decimal' }, expected: '437' },
            { value: 437, format: { type: 'decimal', precision: 5 }, expected: '00437' },
            { value: 2, format: { type: 'decimal', precision: 2 }, expected: '02' },
            { value: 12, format: { type: 'decimal', precision: 2 }, expected: '12' },
            { value: 2, format: { type: 'decimal', precision: 3 }, expected: '002' },
            { value: 12, format: { type: 'decimal', precision: 3 }, expected: '012' },
            { value: 123, format: { type: 'decimal', precision: 3 }, expected: '123' },

            { value: 12.345, format: 'fixedPoint', expected: '12' },
            { value: 12.345, format: { type: 'fixedPoint' }, expected: '12' },
            { value: 1, format: { type: 'fixedPoint', precision: null }, expected: '1' },
            { value: 1.2, format: { type: 'fixedPoint', precision: null }, expected: getLocalizedFixedNumber(1, 2) },
            { value: 1.22, format: { type: 'fixedPoint', precision: null }, expected: getLocalizedFixedNumber(1, 22) },
            { value: 1.222, format: { type: 'fixedPoint', precision: null }, expected: getLocalizedFixedNumber(1, 222) },
            { value: 1.2225, format: { type: 'fixedPoint', precision: null }, expected: getLocalizedFixedNumber(1, 2225) },
            { value: 1.22222228, format: { type: 'fixedPoint', precision: null }, expected: getLocalizedFixedNumber(1, 22222228) },
            {
                value: 12.345,
                format: { type: 'fixedPoint', precision: 1 },
                intlFormat: { maximumFractionDigits: 1, minimumFractionDigits: 1 }
            },
            {
                value: 12.345,
                format: { type: 'fixedPoint', precision: 2 },
                intlFormat: { maximumFractionDigits: 2, minimumFractionDigits: 2 }
            },
            {
                value: 12.34,
                format: { type: 'fixedPoint', precision: 3 },
                intlFormat: { maximumFractionDigits: 3, minimumFractionDigits: 3 }
            },

            { value: 0.45, format: 'percent', intlFormat: { style: 'percent' } },
            { value: 0.45, format: { type: 'percent' }, intlFormat: { style: 'percent' } },
            { value: 0.45, format: { type: 'percent', precision: 2 }, intlFormat: { style: 'percent', minimumFractionDigits: 2 } },

            {
                value: 1204,
                format: 'currency',
                intlFormat: { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }
            },
            {
                value: 12,
                format: { type: 'currency' },
                intlFormat: { style: 'currency', currency: 'USD', minimumFractionDigits: 0 } },
            {
                value: 1,
                format: { type: 'currency', precision: 2 },
                intlFormat: { style: 'currency', currency: 'USD' }
            },
            {
                value: 1,
                format: { type: 'currency', precision: 3 },
                intlFormat: { style: 'currency', currency: 'USD', minimumFractionDigits: 3 }
            },
            {
                value: 1,
                format: { type: 'currency', precision: 2, currency: 'USD' },
                intlFormat: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }
            },
            {
                value: -1204,
                format: { type: 'currency', precision: 2 },
                intlFormat: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }
            },

            {
                value: 12345.67,
                format: { type: 'currency largeNumber', precision: 2 },
                expected: getIntlFormatter({style: 'currency', currency: 'USD', minimumFractionDigits: 2 })(12.34567).replace(/(\d|.$)(\D*)$/, '$1K$2')
            },
            {
                value: 12345.67,
                format: { type: 'currency thousands', precision: 2 },
                expected: getIntlFormatter({style: 'currency', currency: 'USD', minimumFractionDigits: 2 })(12.34567).replace(/(\d|.$)(\D*)$/, '$1K$2')
            },
            {
                value: 12345.67,
                format: { type: 'currency millions', precision: 3 },
                expected: getIntlFormatter({style: 'currency', currency: 'USD', minimumFractionDigits: 3 })(0.012).replace(/(\d|.$)(\D*)$/, '$1M$2')
            }
        ];

        assertData.forEach(function(data) {
            var expected = data.expected;

            if(data.intlFormat) {
                expected = getIntlFormatter(data.intlFormat)(data.value, data.intlFormat);
                assert.equal(numberLocalization.format(data.value, data.intlFormat), expected);
            }

            assert.equal(numberLocalization.format(data.value, data.format), expected);
        });
    });

    QUnit.test('parse', function(assert) {
        assert.equal(numberLocalization.parse(getIntlFormatter({ maximumFractionDigits: 0, minimumFractionDigits: 0 })(437)), 437);
        assert.equal(numberLocalization.parse(getIntlFormatter({ maximumFractionDigits: 1, minimumFractionDigits: 1 })(1.2)), 1.2);
        assert.equal(numberLocalization.parse(getIntlFormatter({ maximumFractionDigits: 0, minimumFractionDigits: 0 })(12000)), 12000);
        assert.equal(numberLocalization.parse(getIntlFormatter({ maximumFractionDigits: 0, minimumFractionDigits: 0 })(-10)), -10);

        assert.equal(numberLocalization.parse(getIntlFormatter({ style: 'currency', currency: 'USD', minimumFractionDigits: 1 })(1.2)), 1.2);
    });

    QUnit.test('format by a function', function(assert) {
        assert.equal(numberLocalization.format(437, function(value) { return '!' + value; }), '!437');
        assert.equal(numberLocalization.format(437, { formatter: function(value) { return '!' + value; } }), '!437');
    });

    QUnit.test('parse by a function', function(assert) {
        assert.equal(numberLocalization.parse('!437', { parser: function(text) { return Number(text.substr(1)); } }), 437);
    });

    QUnit.module('currency', {
        beforeEach: function() {
            locale('en');
        },
        afterEach: function() {
            locale('en');
        }
    });

    QUnit.test('getOpenXmlCurrencyFormat', function(assert) {
        var nonBreakingSpace = '\xa0',
            expectedResults = {
                RUB: {
                    de: '#,##0{0} RUB',
                    en: 'RUB#,##0{0}',
                    ja: 'RUB#,##0{0}',
                    ru: '#,##0{0} ₽'
                },
                USD: {
                    de: '#,##0{0} $',
                    en: '$#,##0{0}',
                    ja: '$#,##0{0}',
                    ru: '#,##0{0} $'
                }
            };

        for(var currency in expectedResults) {
            for(var localeId in expectedResults[currency]) {
                var expected = expectedResults[currency][localeId];

                locale(localeId);
                assert.equal(numberLocalization.getOpenXmlCurrencyFormat(currency), expected.replace(' ', nonBreakingSpace));
            }
        }
    });
});
