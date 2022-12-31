---
layout: '../../layouts/BlogPost.astro'
title: 'Useful utilities for Google Apps Script'
description: 'Things I learned when building a Google Sheets app'
pubDate: 'Mar 09 2022'
heroImage: '/placeholder-hero.jpg'
---

I recently wrote some Google Apps Script code for a fellowship program I did in undergrad. During a conversation with their leadership, I realized that I could write a Google Sheets app that automates some of their administrative tasks as a way to give back to a program that gave me so many opportunities.

This was my first time using Google Apps Script with Google Sheets, and I was super impressed by the quality of Google's library and documentation. This was definitely the most fun I've had writing code in a long time.

Over the course of the project, I wrote several helper functions and worked through some quick ways to get around the library's abstractions. I also had several bookmarks for documentation pages that I found myself referencing constantly. All of this is documented in my Obsidian vault, but I decided to publish them here in case they can be useful to anyone else.

## Documentation to bookmark
The Google Apps Script documentation for interacting with Sheets and Drive is really good, but it's not easy to navigate. I had the following pages bookmarked for easy access.
- Customizing the UI: [Custom menus](https://developers.google.com/apps-script/guides/menus), [Dialogues and sidebars](https://developers.google.com/apps-script/guides/dialogs)
- Specific classes for Google Sheets: [SpreadsheetApp](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app),  [Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet), [Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet), [Range](https://developers.google.com/apps-script/reference/spreadsheet/range)
- [Standard JS array methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) on MDN web docs

## Force refresh a cell range
When your script is manipulating cells with formulas, sometimes you need to force a range of cells to reevaulate before continuing. Most of the time, `SpreadsheetApp.flush()` is enough to do the job, but occaisionally the formulas get torn up. This is a handy little function to help with that— it simply reevaulates every cell in the range.

```javascript
function updateData(sheetName, inputRange) {
	var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
	var range = '';	
	var originalFormulas = []
	
	range = spreadsheet.getSheetByName(sheetName).getRange(inputRange);
	originalFormulas = range.getFormulas();

	const modified = originalFormulas.map(function (row) {
		return row.map(function (col) {
			return col.replace('=', '?');
		});
	});

	range.setFormulas(modified);
	SpreadsheetApp.flush();
	range.setFormulas(originalFormulas);
}
```

## Manually manage app permissions
For the most part, the Google Apps Script IDE does a pretty good job of identifying the necessary permissions that users need to grant your app, but it's not perfect. I ran into at least one instance where this didn't happen, so I've made a habit of manually listing the permissions I need in the `appsscript.json` config file.

It's really easy to set these explicit permissions by following [this guide in the Google Apps Script documentation](https://developers.google.com/apps-script/concepts/scopes#setting_explicit_scopes)

## Using standard Javascript array methods with cell data
There are some quirks with the way that the Google Apps Script library returns cell data in an array, but it's pretty easy to navigate around this using the standard JS array methods. For anyone who's less familiar with Javascript's built-in utility methods for arrays, these are some common ones to know.

Getting an array of cell values always returns a two-dimensional array, even when the range you selected only includes a single row or column of data. Most of the time, what you actually want here is a flattened, one-dimensional array.
```js
// In:  [ ["Value1"], ["Value2"], ["Value3"]]
// Out: [ "Value 1, Value2, Value3" ]
Range.getValues().flat()
```
Additionally, when working with a dynamic amount of data in an open-ended cell range (`C2:C` for example), `Range.getValues()` will return empty strings for any empty cells that are included in that range. Usually, you don't want that. Usually, I combine this with `Array.flat()` to get a 1-dimensional filtered array, but you can use it without flattening too if you're dealing with a true 2D array.
```js
// In:  [ ["Value1"], ["Value2"], ["Value3"], [""], [""] ]
// Out: [ "Value 1, Value2, Value3" ]
Range.getValues().flat().filter(item => item != '')
```

## Getting the parent folder of a Google Sheet
Getting the parent folder of an active Google Sheet is weirdly difficult. Once you get the spreadsheet ID, `File.getParents()` returns an object that contains *all* of the parent folders associated with this Sheet (Google Drive allows for a file to be associated with multiple folders, which I think is fairly rare). As a result, you actually need to append the `Parents.next()` method to return the first parent object. If the file is only associate with only one parent, then this will always return the proper folder.

This is useful for specifying where file exports, mail merge outputs, etc... should be stored.
```js
var thisSheet = SpreadsheetApp.getActiveSpreadsheet().getId();
var parent = DriveApp.getFileById(thisSheet).getParents().next();
```

I'd love to hear your feedback on these—am I overlooking a better way to do these things? You can find me [on Twitter](https://twitter.com/samlinville).