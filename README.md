[![Run Status](https://api.shippable.com/projects/5819ee767d9db80f006078c2/badge?branch=master)](https://app.shippable.com/projects/5819ee767d9db80f006078c2)

# DevExtreme-Intl

This integration module enables localization of [DevExtreme](http://js.devexpress.com/) widgets using the global [Intl](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl) object of the  ECMAScript Internationalization API.

## Getting started

### Using a script tag

Add a script tag for `devextreme-intl` behind your tag for the `devextreme` script:

```html
<script src="https://unpkg.com/devextreme-intl/dist/devextreme-intl.js"></script>
```
or
```html
<script src="https://unpkg.com/devextreme-intl/dist/devextreme-intl.min.js"></script>
```

See [this example with the relevant script tag in place](/examples/bundled.html).

### Using npm modules

1. Install the `devextreme-intl` module:

    `npm install devextreme-intl`

2. Use an `import` call to make `devextreme-intl` available to your code:

    ```js
    import 'devextreme-intl';
    ```


See [this example using modules](/examples/modular.html).

## Browser support

[Some older browsers](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl#Browser_compatibility) don't support the ECMAScript Internationalization API. You can use the [Intl.js polyfill](https://github.com/andyearnshaw/Intl.js/#intljs-) to support a wide range of browsers.

## API

In addition to the [DevExtreme format object structure](https://js.devexpress.com/Documentation/16_2/ApiReference/Common/Object_Structures/format/), formats can be specified which are compatible with the  `options` parameter of the Intl [NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Parameters) and [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat#Parameters).

Here is an example for the use of Intl formats in DataGrid columns:

```js
$("#datagrid").dxDataGrid({
    dataSource: dataSource,
    columns: [{
        dataField: "OrderDate",
        format: { year: "2-digit", month: "narrow", day: "2-digit" }
    }, {
        dataField: "SaleAmount",
        format: { style: "currency", currency: "EUR", useGrouping: true, minimumSignificantDigits: 3 }
    }]
});
```

See [more examples here](/examples).

You can find full documentation of the localization API in the [DevExtreme documentation](https://js.devexpress.com/Documentation/16_2/Guide/Widgets/Common/UI_Widgets/Localization/).

## Restrictions

If you specify a [displayFormat](https://js.devexpress.com/Documentation/16_2/ApiReference/UI_Widgets/dxDateBox/Configuration/#displayFormat) for the  [DateBox](https://js.devexpress.com/Documentation/16_2/ApiReference/UI_Widgets/dxDateBox/) widget, the typed value will not be parsed correctly. You can specify a custom [parser function](https://js.devexpress.com/Documentation/16_2/ApiReference/Common/Object_Structures/format/#parser) as part of the `displayFormat` configuration object to overcome this limitation. Here is an example:

```js
// value will be parsed correctly
$("#datebox").dxDateBox({
    value: new Date()
});

// value will not be parsed correctly
$("#datebox").dxDateBox({
    value: new Date(),
    displayFormat: {
        year: "numeric",
        month: "long"
    }
});

// Add a custom parser function
$("#datebox").dxDateBox({
    value: new Date(),
    displayFormat: {
        year: "numeric",
        month: "long",
        parser: function(dateString) {
            // return parsed date if possible
        }
    }
});
```

## Development

### Install external development dependencies

    npm install

### Run tests

    npm test

### Build

Build the distribution UMD bundles `devextreme-intl.js` and `devextreme-intl.min.js` into the `/dist` folder.

    npm run build

## License

Familiarize yourself with the
[DevExtreme Commerical License](https://www.devexpress.com/Support/EULAs/DevExtreme.xml).

**DevExtreme integration with ECMAScript Internationalization API is released as an MIT-licensed (free and open-source) add-on to DevExtreme.**

## Support & Feedback

* For support and feedback on general Intl questions, use [MDN Feedback](https://developer.mozilla.org/ru/docs/MDN/Feedback)
* For questions regarding DevExtreme libraries and JavaScript APIs, use the [DevExpress Support Center](https://www.devexpress.com/Support/Center)
* For DevExtreme Intl integration bugs, questions and suggestions, use the [GitHub issue tracker](https://github.com/DevExpress/DevExtreme-Intl/issues)
