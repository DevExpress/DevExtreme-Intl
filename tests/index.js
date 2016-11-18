var testsContext = require.context('.', true, /-tests$/);
testsContext.keys().forEach(function(path) {
    try {
        testsContext(path);
    } catch(err) {
        console.error('[ERROR] WITH SPEC FILE: ', path); // eslint-disable-line
        console.error(err); // eslint-disable-line
    }
});
