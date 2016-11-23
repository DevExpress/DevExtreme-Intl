[![Run Status](https://api.shippable.com/projects/5819ee767d9db80f006078c2/badge?branch=master)](https://app.shippable.com/projects/5819ee767d9db80f006078c2)

# DevExtreme-Intl

This integration module allows [DevExtreme](http://js.devexpress.com/) widgets to be localized by ECMAScript Internationalization API using global [Intl](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl) object.

## Getting started

### Using bundle

Include `devextreme-intl` bundle after `devextreme` script

```html
<script src="https://unpkg.com/devextreme-intl/dist/devextreme-intl.js"></script>
```
or
```html
<script src="https://unpkg.com/devextreme-intl/dist/devextreme-intl.min.js"></script>
```

See [example using bundle](/blob/master/examples/bundled.html).

### Using modules

1. Install `devextreme-intl` package

    `npm install devextreme-intl`

2. Include `devextreme-intl` package into your application entry

    ```js
    require('devextreme-intl');
    ```


See [example using modules](/blob/master/examples/modular.html).

## Browser support

[Older browsers](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl#Browser_compatibility) doesn't support ECMAScript Internationalization API. You can use [Intl.js polyfill](https://github.com/andyearnshaw/Intl.js/#intljs-) for wider browser support.

## API

In addition to [DevExtreme format object structure](https://js.devexpress.com/Documentation/16_2/ApiReference/Common/Object_Structures/format/) formats can be specified as an `options` parameter of Intl [NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Parameters) and [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat#Parameters).

Example of using Intl formats in the DataGrid columns:

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

See more exapmles [here](/tree/master/examples).

Read full localization API in [DevExtreme documentation](https://js.devexpress.com/Documentation/16_2/Guide/UI_Widgets/Common/Localization/).

## Restrictions

In the [DateBox](https://js.devexpress.com/Documentation/16_2/ApiReference/UI_Widgets/dxDateBox/) with specified [displayFormat](https://js.devexpress.com/Documentation/16_2/ApiReference/UI_Widgets/dxDateBox/Configuration/#displayFormat) typed value cannot be parsed. You can specify the custom [parser](https://js.devexpress.com/Documentation/16_2/ApiReference/Common/Object_Structures/format/#parser) in DevExtreme format object to overcome this limitation.

```js
// Will be parsed
$("#datebox").dxDateBox({
    value: new Date()
});

// Will not be parsed
$("#datebox").dxDateBox({
    value: new Date(),
    displayFormat: {
        year: "numeric",
        month: "long"
    }
});

// Will be parsed by custom parser method
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

### Install development external dependencies

    npm install

### Tests

    npm test

### Build

Build the distribution UMD bundles `devextreme-intl.js` and `devextreme-intl.min.js` into the `/dist` folder.

    npm run build

## License

Familiarize yourself with the
[DevExtreme Commerical License](https://www.devexpress.com/Support/EULAs/DevExtreme.xml).

**DevExtreme integration with ECMAScript Internationalization API is released as a MIT-licensed (free and open-source) add-on to DevExtreme.**

## Support & Feedback

* For the Support & Feedback on general Intl questions, use the [MDN Feedback](https://developer.mozilla.org/ru/docs/MDN/Feedback)
* For questions regarding DevExtreme libraries and JavaScript API, use [DevExpress Support Center](https://www.devexpress.com/Support/Center)
* For DevExtreme Intl integration bugs, questions and suggestions, use the [GitHub issue tracker](https://github.com/DevExpress/DevExtreme-Intl/issues)
