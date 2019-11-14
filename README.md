# i18n-manager
Import/export capability for i18n translation files from/to Excel file.

## Options
|Command|Type|Description|
|:---|:---|:---|
|`-i, --import`|`boolean`|Import translations from excel file|
|`-e, --export`|`boolean`|Export translations to excel file|
|`--translation-assets-dir <i18n-trans-path>`|`value`|Path to translation directory|
|`--translation-file <xls-file-path>`|`value`|Path to excel file|
|`-h, --help`|`boolean`|output usage information|

**Note:** 
- `-i, --import` or `-e, --export` command is required
- `--translation-assets-dir <i18n-trans-path>` command is required
- `--translation-file <xls-file-path>` command is required

## Examples

### Import translations from excel file to json files
`i18n-manager -i --translation-assets-dir ./locales --translation-file ./Translations.xlsx` 

### Export translations from json files to excel file
`i18n-manager -e --translation-assets-dir ./locales --translation-file ./Translations.xlsx` 

