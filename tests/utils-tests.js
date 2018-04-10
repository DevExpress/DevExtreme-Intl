var QUnit = require('qunitjs');
var compareVersions = require('../src/utils').compareVersions;

QUnit.module('compareVersions');

QUnit.test('base', function(assert) {
    assert.equal(compareVersions('17.2.5', '17.2.4'), 1);
    assert.equal(compareVersions('17.2.5', '17.2.5'), 0);
    assert.equal(compareVersions('17.2.5', '17.2.6'), -1);

    assert.equal(compareVersions('17.2.5', '17.2'), 1);
    assert.equal(compareVersions('17.2', '17.2.5'), -1);

    assert.equal(compareVersions('17.2.10', '17.2.5'), 1);
});
