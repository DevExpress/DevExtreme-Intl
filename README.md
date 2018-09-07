[![CircleCI](https://img.shields.io/circleci/project/github/DevExpress/DevExtreme-Intl/master.svg)](https://circleci.com/gh/DevExpress/devextreme-intl)

# DevExtreme-Intl

This integration module enables localization of [DevExtreme](http://js.devexpress.com/) widgets using the global [Intl](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl) object of the  ECMAScript Internationalization API.

Using *Intl* is an alternative to the *Globalize* based mechanism [documented here](https://js.devexpress.com/Documentation/Guide/Widgets/Common/UI_Widgets/Localization_-_Use_Globalize/). Please note that in comparison to *Globalize*, there are some restrictions which are described in [the section *Restrictions*](#restrictions) below.

## Getting started

### Using a script tag

Add a script tag for `devextreme-intl` behind your tag for the `devextreme` script:

```html
<script src="https://unpkg.com/devextreme-intl@18.1/dist/devextreme-intl.js"></script>
```

or

```html
<script src="https://unpkg.com/devextreme-intl@18.1/dist/devextreme-intl.min.js"></script>
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

In addition to the [DevExtreme format object structure](https://js.devexpress.com/Documentation/ApiReference/Common/Object_Structures/format/), formats can be specified which are compatible with the  `options` parameter of the Intl [NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Parameters) and [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat#Parameters).

Note that the [DevExtreme format object structure](https://js.devexpress.com/Documentation/ApiReference/Common/Object_Structures/format/) documentation page refers to special structures supported by *Globalize*. When using *DevExtreme-Intl*, these structures are either unsupported or need to adhere to [Intl](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl) structural requirements instead.

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

You can find full documentation of the localization API in the [DevExtreme documentation](https://js.devexpress.com/Documentation/Guide/Widgets/Common/UI_Widgets/Localization/).

## Restrictions

**NOTE: Starting with version 17.2, these restrictions are not relevant.**

Date parsing is not supported by the ECMAScript Internationalization API. You can read about the position of the ECMAScript community [here](https://bugs.ecmascript.org/show_bug.cgi?id=770).
As a result, some minor DevExtreme functionality is restricted.

- If you specify a [displayFormat](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDateBox/Configuration/#displayFormat) for the  [DateBox](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDateBox/) widget, any value typed into the editor by a user will not be parsed correctly.
- If you enable [searchPanel](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/searchPanel/) for the [DataGrid](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/) widget, the search by date columns will not work.
- If you configure a [format](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/#format) for a DataGrid column, any value typed into the editor by a user will not be parsed correctly.

If a widget tries to parse a value in one of these scenarios, you will see this message in the JavaScript console:

> W0012 - Date parsing is invoked while the parser is not defined.
> See: <http://js.devexpress.com/error/W0012>

You can specify a custom [parser function](https://js.devexpress.com/Documentation/ApiReference/Common/Object_Structures/format/#parser) as part of the `displayFormat` or `column.format` configuration objects to overcome this limitation. Here are some examples:

```js
// Value will be parsed correctly
$("#datebox").dxDateBox({
    value: new Date()
});

// Value will not be parsed correctly
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

// Search and manual data entry will not work for the date column
$("#datagrid").dxDataGrid({
    dataSource: dataSource,
    searchPanel: {
        visible: true
    },
    columns: [{
        dataField: "OrderDate",
        format: {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
    }]
});

// Add a custom parser function
$("#datagrid").dxDataGrid({
    dataSource: dataSource,
    searchPanel: {
        visible: true
    },
    columns: [{
        dataField: "OrderDate",
        format: {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            parser: function(dateString) {
                // return parsed date if possible
            }
        }
    }]
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
[DevExtreme License](https://js.devexpress.com/Licensing/).

**DevExtreme integration with ECMAScript Internationalization API is released as an MIT-licensed (free and open-source) add-on to DevExtreme.**

## Support & Feedback

- For support and feedback on general Intl questions, use [MDN Feedback](https://developer.mozilla.org/ru/docs/MDN/Feedback)
- For questions regarding DevExtreme libraries and JavaScript APIs, use the [DevExpress Support Center](https://www.devexpress.com/Support/Center)
- For DevExtreme Intl integration bugs, questions and suggestions, use the [GitHub issue tracker](https://github.com/DevExpress/DevExtreme-Intl/issues)
