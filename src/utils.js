var compareVersions = function(x, y) {
    x = x.split('.');
    y = y.split('.');

    var length = Math.max(x.length, y.length);

    for(var i = 0; i < length; i++) {
        var xItem = parseInt(x[i] || 0, 10),
            yItem = parseInt(y[i] || 0, 10);

        if(xItem < yItem) {
            return -1;
        }
        if(xItem > yItem) {
            return 1;
        }
    }
    return 0;
};
exports.compareVersions = compareVersions;
