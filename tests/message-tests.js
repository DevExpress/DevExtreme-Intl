var QUnit = require('qunitjs');
var dxConfig = require('devextreme/core/config');
var messageLocalization = require('devextreme/localization/message');
var $ = require('jquery');

require('devextreme/localization/de/core.de.js');
require('devextreme/localization/ja/core.ja.js');
require('devextreme/localization/ru/core.ru.js');

require('../src/message');

messageLocalization.load({ en: { onlyDefaultLocaleKey: 'Base value' } });

[ 'de', 'en', 'ja', 'ru' ].forEach(function(locale) {
    QUnit.module('message - ' + locale, {
        beforeEach: function() {
            var dictionary = {};

            dictionary[locale] = {
                addedKey: locale + 'TestValue',
                hello: locale + ' Hello, {0} {1}'
            };

            messageLocalization.load(dictionary);

            dxConfig({ locale: locale });
        },
        afterEach: function() {
            dxConfig({ locale: 'en' });
        }
    });

    QUnit.test('format', function(assert) {
        assert.equal(messageLocalization.format('addedKey'), locale + 'TestValue', 'message formatted correctly');
        assert.equal(messageLocalization.format('onlyDefaultLocaleKey'), 'Base value' , 'message formatted by default locale');
    });

    QUnit.test('getFormatter', function(assert) {
        assert.equal(messageLocalization.getFormatter('hello')(['John', 'Smith']), locale + ' Hello, John Smith');
        assert.equal(messageLocalization.getFormatter('hello')('John', 'Smith'), locale + ' Hello, John Smith');
    });

    QUnit.test('localizeString', function(assert) {
        var toLocalize,
            localized;

        toLocalize = '@addedKey @@addedKey @';
        localized = messageLocalization.localizeString(toLocalize);
        assert.equal(localized, locale + 'TestValue @addedKey @', 'string localized correctly');

        toLocalize = 'E-mails such as email@addedKey.com are not localized';
        localized = messageLocalization.localizeString(toLocalize);
        assert.equal(localized, toLocalize, 'localizeString doesn\'t affect e-mails');

        toLocalize = '@unknownKey';
        localized = messageLocalization.localizeString(toLocalize);
        assert.equal(localized, toLocalize, 'localizeString doesn\'t affect unknown keys');
    });

    var loadingLocalization = {
        'de': 'Laden...', 'en': 'Loading...', 'ja': '読み込み中…', 'ru': 'Загрузка...'
    };

    QUnit.test('localizeNode', function(assert) {
        var $node = $(
                '<div data=\'@Loading\'> \
                    @Loading \
                    <div data=\'@Loading\' class=\'inner\'> \
                        @Loading \
                    </div> \
                </div>'),
            $contents = $node.contents(),
            expected = loadingLocalization[locale];

        messageLocalization.localizeNode($node);

        assert.equal($node.attr('data'), expected);

        assert.equal($.trim($contents.eq(0).text()), expected);
        assert.equal($contents.eq(1).attr('data'), expected);
        assert.equal($.trim($contents.eq(1).text()), expected);

        $node = $('<iframe data=\'@Loading\'></iframe>');

        messageLocalization.localizeNode($node);
        assert.equal($node.attr('data'), '@Loading', 'localizeNode: iframes should be ignored');
    });

    QUnit.test('setup', function(assert) {
        var localized = messageLocalization.localizeString('@addedKey #addedKey');
        assert.equal(localized, locale + 'TestValue #addedKey');

        try {
            messageLocalization.setup('#');

            localized = messageLocalization.localizeString('@addedKey #addedKey');
            assert.equal(localized, '@addedKey ' + locale + 'TestValue');
        }
        finally {
            messageLocalization.setup('@');
        }
    });
});
