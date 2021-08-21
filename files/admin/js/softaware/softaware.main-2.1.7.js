/* global parseFloat, FormData, Enumeration, google, tinymce */

/**
 * Returns the index of the regular expression of the String object.
 * @param {String} regex the regular expression to check for.
 * @param {Number} startpos optional start potision, the default is 0.
 * @returns {Number|String@call;substring@call;search} returns the index of the regular expression of the String object.
 */
String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
};
// Not tested.
String.prototype.regexLastIndexOf = function(regex, startpos) {
    regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : ""));
    if (typeof(startpos) === "undefined") {
        startpos = this.length;
    } else if (startpos < 0) {
        startpos = 0;
    }
    var stringToWorkWith = this.substring(0, startpos + 1);
    var lastIndexOf = -1;
    var nextStop = 0;
    while ((result = regex.exec(stringToWorkWith)) !== null) {
        lastIndexOf = result.index;
        regex.lastIndex = ++nextStop;
    }
    return lastIndexOf;
};
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    var searchClean = new RegExp(Softaware.Utilities.escapeRegExp(search), 'g');
    return target.replace(searchClean, replacement);
};

if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function(predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this === null) {
                throw new Softaware.Exception.IllegalStateException("'this' is null or not defined");
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new Softaware.Exception.InvalidArgumentException("predicate must be a function");
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) { // 1: the object, 2: the index, 3: the array.
                    return kValue;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return undefined.
            return undefined;
        }
    });
}

/**
 * The main package of the Library.
 * Requires jQuery at least 1.11. softaware-ext-jQuery.js
 */
if (typeof(Softaware) === "undefined") {
    Softaware = {};
}


Softaware.Type = {
    /**
     * Supported languages for the API.
     * @type Softaware.Type.Language
     */
    Language: {
        "GR": "GR",
        "EN": "EN"
    },
    /**
     * Supported selectors for the API. Follows the JQuery selector.
     * @type Softaware.Type.Selector
     */
    Selector: {
        NORMAL: "=",
        CONTAINS: "*=",
        STARTS_WITH: "^=",
        ENDS_WITH: "$="
    },
    /**
     * Format number signs.
     * @type Softaware.Type.NumberFormatSign
     */
    "NumberFormatSign": {
        "COMMA": ",",
        "DOT": ".",
        "NONE": ""
    }
};
Softaware.Model = {};
Softaware.Model.language = Softaware.Type.Language.GR;

/**
 * Pacage to store all the custom exception classes.
 * @type type
 */
Softaware.Exception = {};
/**
 * 
 * @param {String} message A message to display to the console.
 * @returns {Softaware.Exception.InvalidArgumentException}
 */
Softaware.Exception.InvalidArgumentException = function(message) {
    this.message = message;
    // Use V8's native method if available, otherwise fallback.
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, Softaware.Exception.InvalidArgumentException);
    else
        this.stack = (new Error()).stack;
};
Softaware.Exception.InvalidArgumentException.prototype = Object.create(Error.prototype);
Softaware.Exception.InvalidArgumentException.prototype.name = "InvalidArgumentException";
Softaware.Exception.InvalidArgumentException.prototype.constructor = Softaware.Exception.InvalidArgumentException;
/**
 * 
 * @param {String} message A message to display to the console.
 * @returns {Softaware.Exception.IllegalStateException}
 */
Softaware.Exception.IllegalStateException = function(message) {
    this.message = message;
    // Use V8's native method if available, otherwise fallback.
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, Softaware.Exception.IllegalStateException);
    else
        this.stack = (new Error()).stack;
};
Softaware.Exception.IllegalStateException.prototype = Object.create(Error.prototype);
Softaware.Exception.IllegalStateException.prototype.name = "IllegalStateException";
Softaware.Exception.IllegalStateException.prototype.constructor = Softaware.Exception.IllegalStateException;
/**
 * 
 * @param {String} message A message to display to the console.
 * @returns {Softaware.Exception.NumberFormatException}
 */
Softaware.Exception.NumberFormatException = function(message) {
    this.message = message;
    // Use V8's native method if available, otherwise fallback.
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, Softaware.Exception.NumberFormatException);
    else
        this.stack = (new Error()).stack;
};
Softaware.Exception.NumberFormatException.prototype = Object.create(Error.prototype);
Softaware.Exception.NumberFormatException.prototype.name = "NumberFormatException";
Softaware.Exception.NumberFormatException.prototype.constructor = Softaware.Exception.NumberFormatException;


/**
 * A JS Class to use when you wish to format numbers of an application.
 * @param {type} configurationSettings Settings to use for the format of the numbers availabe,
 * <pre>
 *  decimalSeparatorNew default value: Softaware.Type.NumberFormatSign.COMMA <br/>
 *  numberSeparatorNew default value: Softaware.Type.NumberFormatSign.DOT <br/>
 *  decimalSeparatorOld default value: Softaware.Type.NumberFormatSign.NONE <br/>
 *  numberSeparatorOld default value: Softaware.Type.NumberFormatSign.NONE <br/>
 *  countDecimalsMax default value: 2 <br/>
 *  countDecimalsMin default value: 0 <br/>
 *  </pre>
 * @returns {Softaware.NumberFormat}
 */
Softaware.NumberFormat = function(configurationSettings) {
    this.settings = {
        decimalSeparatorNew: Softaware.Type.NumberFormatSign.COMMA,
        numberSeparatorNew: Softaware.Type.NumberFormatSign.DOT,
        decimalSeparatorOld: Softaware.Type.NumberFormatSign.NONE,
        numberSeparatorOld: Softaware.Type.NumberFormatSign.NONE,
        countDecimalsMax: 2,
        countDecimalsMin: 0
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.initialize = function(settings) {
        // Set the separator options.
        this.setSettings(settings);

        // Check if the configuration for fix, min and max decimals is correct.
        if (this.settings.countDecimalsMin > this.settings.countDecimalsMax) {
            throw new IllegalStateException("Min decimal number is more than max decimal number.");
        }
    };
    /**
     * Format a number with the configuration set.
     * @param {type} number The original number that will be formated.
     * @returns {Number}
     */
    this.format = function(number) {
        // Check the arguments.
        if (typeof(number) === "undefined") {
            throw new Softaware.Exception.InvalidArgumentException("Not valid number: " + number);
        }

        // Check if this number is in the correct old format.
        var decimalOld = "";
        var numberOld = number.toString(); // Number without separators.
        // Check the old decimal separator.
        if (this.settings.decimalSeparatorOld !== Softaware.Type.NumberFormatSign.NONE) {
            // Get the numbers and decimals.
            var numberArray = numberOld.split(this.settings.decimalSeparatorOld);
            if (numberArray.length === 2) {
                numberOld = numberArray[0];
                decimalOld = numberArray[1];
            }
        }
        // Validate the old number separator format.
        if (this.settings.numberSeparatorOld !== Softaware.Type.NumberFormatSign.NONE && numberOld.length > 3) {
            var numberArray = numberOld.split(this.settings.numberSeparatorOld);
            if (numberArray.length > 0) {
                throw new Softaware.Exception.NumberFormatException("The argument number was having a not valid old number format.");
            }
            numberOld = "";
            for (var i = 0; i < numberArray.length; i++) {
                numberOld += numberArray[i];
            }
        }

        // Format this number to the new format.
        var decimalNew = "";
        var numberNew = numberOld;
        // Check the decimals.
        if (this.settings.decimalSeparatorNew !== Softaware.Type.NumberFormatSign.NONE) {
            decimalNew = decimalOld;
            // In case of less numers than min fill with zeros.
            if (this.settings.countDecimalsMin > decimalNew.length) {
                var zeros = this.settings.countDecimalsMin - decimalNew.length;
                for (var i = 0; i < zeros; i++) {
                    decimalNew += "0";
                }
            }

            // In case of more numbers than max fix them.
            if (this.settings.countDecimalsMax < decimalNew.length) {
                var decimalTemp = "0." + decimalNew;
                decimalTemp = parseFloat(decimalTemp).toFixed(this.settings.countDecimalsMax);
                decimalTemp = decimalTemp.toString();
                decimalNew = decimalTemp.substr(decimalTemp.indexOf(".") + 1);
            }
        }
        // Check the numbers.
        if (this.settings.numberSeparatorNew !== Softaware.Type.NumberFormatSign.NONE) {
            numberNew = "";
            var counter = 0;
            for (var i = numberOld.length - 1; i >= 0; i--) {
                // Add the separator.
                if (counter !== 0 && counter % 3 === 0) {
                    numberNew = this.settings.numberSeparatorNew + numberNew;
                }
                // Add the next number.
                numberNew = numberOld.charAt(i) + numberNew;
                counter++;
            }
        }

        return numberNew + (decimalNew.length === 0 ? "" : this.settings.decimalSeparatorNew + decimalNew);
    };
    this.prependWithZeros = function(numberToPrepend, totalLength) {
        // Convert to string.
        var numberString = "" + numberToPrepend;
        // Get the String length.
        var currentLength = numberString.length;

        // Validation if the current length is more than the total.
        if (currentLength > totalLength) {
            console.log("WARN - NumberFormat:formatToString: Be carefull! You requested to convert to length:" + totalLength + " a number(" + numberToPrepend + ") with length:" + currentLength);
        }

        // Make this number to have total length.
        var prepend = "";
        for (var i = totalLength; i > 0; i--) {
            if (i > currentLength) {
                prepend += "" + 0;
            }
        }

        return prepend + numberString;
    };
    // Constructor.
    {
        this.initialize(configurationSettings);
    }
};
Softaware.TextUtils = function() {};
Softaware.TextUtils.textToElement = function(text, element) {
    if (typeof text === "undefined" || text === null || typeof element === "undefined" || element === null) {
        //        throw new Softaware.Exception.InvalidArgumentException("text:" + text + ", $element:" + $element);
        console.log("Softaware.TextUtils.textToElement::text:" + text + ", $element:" + element);
        return;
    }
    if ($(element).isFormElement()) {
        if (($(element).is("input[type='radio']") || $(element).is("input[type='checkbox']")) && $(element).parent().is("label")) {
            //            $(element).prop("checked", true);
            //            $(element).parent().addClass("active");
            $(element).parent().trigger("click");
        } else {
            $(element).val(text.toString());
        }
    } else {
        $(element).html(text.toString());
    }
};
Softaware.TextUtils.textToUrl = function(text) {
    if (typeof text === "undefined" || text === null) {
        throw new Softaware.Exception.InvalidArgumentException("text:" + text);
    }
    var transformArray = [
        // No tonoi.
        {
            "key": "ά",
            "value": "α"
        },
        {
            "key": "έ",
            "value": "ε"
        },
        {
            "key": "ή",
            "value": "η"
        },
        {
            "key": "ί",
            "value": "ι"
        },
        {
            "key": "ϊ",
            "value": "ι"
        },
        {
            "key": "ΐ",
            "value": "ι"
        },
        {
            "key": "ό",
            "value": "ο"
        },
        {
            "key": "ύ",
            "value": "υ"
        },
        {
            "key": "ϋ",
            "value": "υ"
        },
        {
            "key": "ΰ",
            "value": "υ"
        },
        {
            "key": "ώ",
            "value": "ω"
        },
        // Spaces and sympols.
        {
            "key": " ",
            "value": "-"
        },
        {
            "key": ",",
            "value": "-"
        },
        {
            "key": "_",
            "value": "-"
        },
        {
            "key": "=",
            "value": "-"
        },
        {
            "key": "\"",
            "value": "-"
        },
        {
            "key": "\'",
            "value": "-"
        },
        {
            "key": ">",
            "value": "-"
        },
        {
            "key": "<",
            "value": "-"
        },
        {
            "key": "#",
            "value": "-"
        },
        {
            "key": "%",
            "value": "-"
        },
        {
            "key": ":",
            "value": "-"
        },
        {
            "key": ";",
            "value": "-"
        },
        {
            "key": "!",
            "value": "-"
        },
        // Regex special chars => @&\.*?+[]{}|()^$/~`
        {
            "key": "@",
            "value": "-"
        },
        {
            "key": "&",
            "value": "-"
        },
        {
            "key": "\\",
            "value": "-"
        },
        {
            "key": ".",
            "value": "-"
        },
        {
            "key": "*",
            "value": "-"
        },
        {
            "key": "?",
            "value": "-"
        },
        {
            "key": "+",
            "value": "-"
        },
        {
            "key": "[",
            "value": "-"
        },
        {
            "key": "]",
            "value": "-"
        },
        {
            "key": "{",
            "value": "-"
        },
        {
            "key": "}",
            "value": "-"
        },
        {
            "key": "|",
            "value": "-"
        },
        {
            "key": "(",
            "value": "-"
        },
        {
            "key": ")",
            "value": "-"
        },
        {
            "key": "^",
            "value": "-"
        },
        {
            "key": "$",
            "value": "-"
        },
        {
            "key": "/",
            "value": "-"
        },
        {
            "key": "~",
            "value": "-"
        },
        {
            "key": "`",
            "value": "-"
        }
    ];

    // Url must have all characters lower.
    text = text.toString().toLowerCase();

    // Convert the special characters using the array map.
    for (var i = 0; i < transformArray.length; i++) {
        text = text.replaceAll(transformArray[i].key, transformArray[i].value);
    }

    // Remove multiple '-' instances in the string.
    while (text.indexOf("--") > -1) {
        text = text.replaceAll("--", "-");
    }

    // Remove start and end '-'
    if (text.indexOf("-") === 0) {
        text = text.substring(1);
    }
    if (text.lastIndexOf("-") === (text.length - 1)) {
        text = text.substring(0, text.length - 1);
    }

    return text;
};

/**
 * This class is available for extension. It represents a domain.
 * Example of extension,
 * <pre>
 *  var MyDomain = function () {
 *      this.__proto__ = new Softaware."Domain"({
 *          rootUrl: "/rest/MyDomain/",
 *          idAttribute: "id"
 *      });
 *  }
 *  </pre>
 *  
 * @param {Object} settings Override the rootUrl and idAttribute of the domain.
 */
Softaware.Domain = function(settings) {
    /**
     * The url to use in case it will call RESTFull services.
     */
    this.rootUrl = settings.rootUrl ? settings.rootUrl : "";
    /**
     * The attribute name of the id of the domain.
     */
    this.idAttribute = settings.idAttribute ? settings.idAttribute : "";
    /**
     * JSON value with the data of the specified object.
     */
    this.model = settings.model ? settings.model : {};
    /**
     * Validation rules to use with JQuery Validate Library.
     */
    this.validation = {};
};


/**
 * A class to use for working with RestFull Services on the domains.
 * @returns {Softaware.Service}
 */
Softaware.Service = {
    /**
     * Using the domain rootUrl, makes a REST call for creating the model of the domain.
     * @param {Softaware.Domain} domain The domain to use and create.
     * @param {Object} options Optional parameter that will append the AJAX call settings.
     * @returns {void} nothing.
     * @throws {Softaware.Exception.InvalidArgumentException} in case of a domain that is not an instance of Softaware.Domain.
     */
    create: function(domain, options) {
        if (!(domain instanceof Softaware.Domain)) {
            throw new Softaware.Exception.InvalidArgumentException("domain:" + domain + ", options(optional):" + options);
        }
        var optionsStatic = {
            type: "POST",
            dataType: "json",
            url: domain.rootUrl,
            data: JSON.stringify(domain.model),
            success: function(model, status, xhr) {
                domain.model = model;
                return false;
            },
            error: function(xhr, status, error) {
                return false;
            }
        };
        var optionsHeaders = {};
        if (domain.model && domain.model instanceof FormData) {
            optionsHeaders = {
                type: "POST",
                data: domain.model,
                processData: false,
                cache: false,
                contentType: false,
                headers: {
                    "Accept": "application/json; charset=UTF-8"
                }
            };
        } else {
            optionsHeaders = {
                headers: {
                    "Accept": "application/json; charset=UTF-8",
                    "Content-Type": "application/json; charset=UTF-8"
                }
            };
        }

        $.ajax($.extend({}, optionsStatic, optionsHeaders, options));
    },
    /**
     * Read an object using a REST call for the specified domain.
     * @param {Softaware.Domain} domain The domain to use and read from server side.
     * @param {Object} options Optional parameter that will append the AJAX call settings.
     * @returns {void} nothing.
     * @throws {Softaware.Exception.InvalidArgumentException} in case of a domain that is not an instance of Softaware.Domain.
     */
    read: function(domain, options) {
        if (!(domain instanceof Softaware.Domain)) {
            throw new Softaware.Exception.InvalidArgumentException("domain:" + domain + ", options(optional):" + options);
        }
        var optionsStatic = {
            type: "GET",
            dataType: "json",
            headers: {
                "Accept": "application/json; charset=UTF-8",
                "Content-Type": "application/json; charset=UTF-8"
            },
            url: domain.rootUrl + domain.model[domain.idAttribute],
            data: {},
            success: function(model, status, xhr) {
                domain.model = model;
                return false;
            },
            error: function(xhr, status, error) {
                return false;
            }
        };

        $.ajax($.extend({}, optionsStatic, options));
    },
    /**
     * Update an object using a REST call for the specified domain.
     * @param {Softaware.Domain} domain The domain to use and update.
     * @param {Object} options Optional parameter that will append the AJAX call settings.
     * @returns {void} nothing.
     * @throws {Softaware.Exception.InvalidArgumentException} in case of a domain that is not an instance of Softaware.Domain.
     */
    update: function(domain, options) {
        if (!(domain instanceof Softaware.Domain)) {
            throw new Softaware.Exception.InvalidArgumentException("domain:" + domain + ", options(optional):" + options);
        }
        var optionsStatic = {
            type: "PUT",
            dataType: "json",
            url: domain.rootUrl + domain.model[domain.idAttribute],
            data: JSON.stringify(domain.model),
            success: function(model, status, xhr) {
                domain.model = model;
                return false;
            },
            error: function(xhr, status, error) {
                return false;
            }
        };
        var optionsHeaders = {};
        if (domain.model && domain.model instanceof FormData) {
            optionsHeaders = {
                type: "POST",
                data: domain.model,
                processData: false,
                cache: false,
                contentType: false,
                headers: {
                    "Accept": "application/json; charset=UTF-8"
                }
            };
        } else {
            optionsHeaders = {
                headers: {
                    "Accept": "application/json; charset=UTF-8",
                    "Content-Type": "application/json; charset=UTF-8"
                }
            };
        }

        $.ajax($.extend({}, optionsStatic, optionsHeaders, options));
    },
    /**
     * Delete an object using a REST call for the specified domain.
     * @param {Softaware.Domain} domain The domain to use and delete.
     * @param {Object} options Optional parameter that will append the AJAX call settings.
     * @returns {void} nothing.
     * @throws {Softaware.Exception.InvalidArgumentException} in case of a domain that is not an instance of Softaware.Domain.
     */
    remove: function(domain, options) {
        if (!(domain instanceof Softaware.Domain)) {
            throw new Softaware.Exception.InvalidArgumentException("domain:" + domain + ", options(optional):" + options);
        }
        var optionsStatic = {
            type: "DELETE",
            dataType: "json",
            headers: {
                "Accept": "application/json; charset=UTF-8",
                "Content-Type": "application/json; charset=UTF-8"
            },
            data: JSON.stringify(domain.model),
            url: domain.rootUrl + domain.model[domain.idAttribute],
            success: function(model, status, xhr) {
                return false;
            },
            error: function(xhr, status, error) {
                return false;
            }
        };

        $.ajax($.extend({}, optionsStatic, options));
    },
    readAllToBuffer: function(url, buffer) {
        if (!url || !buffer) {
            throw new Softaware.Exception.InvalidArgumentException("url:" + url + ", buffer:" + buffer);
        }
        Softaware.Service.readAll(url, {
            success: function(domains, status, xhr) {
                for (var i = 0; i < domains.length; i++)
                    buffer.push(domains[i]);
            }
        });
    },
    /**
     * 
     * @param {type} url The url to hit.
     * @param {type} formSelectSelectors It must be an array of selectors
     * @param {type} valueAttributes THe attribute to use as value
     * @param {type} textAttributes The attribute to use as text.
     * @returns {undefined}
     */
    readAllToFormSelect: function(url, formSelectSelectors, valueAttributes, textAttributes) {
        if (!url || !formSelectSelectors || !valueAttributes || !textAttributes) {
            throw new Softaware.Exception.InvalidArgumentException("url:" + url + ", formSelectSelectors:" + formSelectSelectors + ", valueAttributes:" + valueAttributes + ", textAttributes:" + textAttributes);
        }

        // Call the url and initialize the select form elements with the models fetched.
        Softaware.Service.readAll(url, {
            success: function(models, status, xhr) {
                for (var i = 0; i < formSelectSelectors.length; i++)
                    $(formSelectSelectors[i]).initSelectFromDatas(models, valueAttributes, textAttributes);
            }
        });
    },
    /**
     * Makes an ajax call for the sepcified url.
     * @param {type} url The url to use to read all.
     * @param {type} options Optional parameter, a json object to append as settings to the AJAX call.
     * @returns {undefined} Nothing
     */
    readAll: function(url, options) {
        if (!url) {
            throw new Softaware.Exception.InvalidArgumentException("url:" + url + ", options(optional):" + options);
        }
        var optionsStatic = {
            type: "GET",
            dataType: "json",
            headers: {
                "Accept": "application/json; charset=UTF-8",
                "Content-Type": "application/json; charset=UTF-8"
            },
            url: url,
            success: function(domains, status, xhr) {
                return false;
            },
            error: function(xhr, status, error) {
                return false;
            }
        };

        $.ajax($.extend({}, optionsStatic, options));
    },
    find: function(models, searchIdOrModel) {
        if (!(models instanceof Array) || typeof(searchIdOrModel) === "undefined") {
            throw new Softaware.Exception.InvalidArgumentException("models:" + models + ", searchIdOrModel:" + searchIdOrModel);
        }
        var result = {};
        var searchId = searchIdOrModel[this.idAttribute] ? searchIdOrModel[this.idAttribute] : searchIdOrModel;

        var current;
        for (var i = 0, len = this.datas.length; i < len; i++) {
            current = this.datas[i][this.idAttribute];
            if (typeof(current) !== "undefined" && current !== null && typeof(searchId) !== "undefined" && searchId !== null) {
                if (this.datas[i][this.idAttribute].toString() === searchId.toString()) {
                    result = this.datas[i];
                    break;
                }
            }
        }

        return result;
    },
    indexOf: function(searchIdOrModel) {
        if (typeof(this.datas) === "undefined" || !this.datas.length || this.datas.length <= 0) {
            console.log("datas not defined or empty.");
            return {};
        }
        var result = -1;
        var searchId = searchIdOrModel[this.idAttribute] ? searchIdOrModel[this.idAttribute] : searchIdOrModel;

        for (var i = 0, len = this.datas.length; i < len; i++) {
            if (this.datas[i][this.idAttribute] === searchId) {
                result = i;
                break;
            }
        }

        return result;
    }
};


/**
 * This package contains static general porpuse methods.
 * @type type
 */
Softaware.Utilities = {
    /**
     * Converts a string path to a value that is existing in a json object.
     * 
     * @param {Object} jsonData Json data to use for searching the value.
     * @param {String} path the path to use to find the value.
     * @returns {valueOfThePath|null}
     */
    jsonPathToValue: function jsonPathToValue(jsonData, path) {
        if (!(jsonData instanceof Object) || typeof(path) === "undefined") {
            throw new Softaware.Exception.InvalidArgumentException("jsonData:" + jsonData + ", path:" + path);
        }
        path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        path = path.replace(/^\./, ''); // strip a leading dot
        var pathArray = path.split('.');
        for (var i = 0, n = pathArray.length; i < n; ++i) {
            var key = pathArray[i];
            if (key in jsonData) {
                if (jsonData[key] !== null) {
                    jsonData = jsonData[key];
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
        return jsonData;
    },
    /**
     * Converts a json attribute to json object or array.<br/>
     * For example the json {"json.attr1.attr2":"value"} converts to {"json":{"attr1":{"attr2":"value"}}}.<br/>
     * Another example includes an array {"array[0].attr1.attr2":"value"} converts to {"array":[{"attr1":{"attr2":"value"}}]}.<br/>
     * For common usage call it with only the data as parameter.
     * 3 bugs
     * - attr.arr and attr.arramand will be confused.
     * - array.json.attr -> array."".attr
     * - array.array -> problem
     * @param {type} data The data that includes the complex attributes.
     * @param {type} attrRef (Do not use) The resulting json object.
     * @param {type} attrName (Do not use) The current root attribute name.
     * @returns {Object} An object with all the keys which include dots and brackets are converted.
     */
    convertJsonAttributeToJsonOrArray: function(data, attrRef, attrName) {
        if (!(data instanceof Object)) {
            throw new Softaware.Exception.InvalidArgumentException("data:" + data + ", attrRef:" + attrRef + ", attrName:" + attrName);
        }
        // Validate.
        data = data instanceof Object ? data : {};
        attrRef = attrRef || {};
        attrName = attrName || "";

        // Sort the data attributes.
        var dataAttribute = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                dataAttribute.push(key);
            }
        }
        dataAttribute.sort();

        // Read each key.
        var key, attrNameLeft, jsonIndex, arrayIndex;
        for (var index = 0; index < dataAttribute.length; index++) {
            key = dataAttribute[index];

            // Check if this key is not existing any more.
            if (typeof(data[key]) === "undefined") {
                continue;
            }

            // Check if this key is what i am searching for.
            var keyName = key.substring(0, attrName.length);
            if (keyName === attrName) {
                // Bug fixed in version 0.1.15. It must follows . [ or nothing after keyName on key.
                // Bug was raised when we had for ex. element.id and elementRequest.id.
                if (attrName.length !== 0 && key.length > attrName.length) {
                    var keyFollows = key.substring(attrName.length, attrName.length + 1);
                    if (keyFollows !== "." && keyFollows !== "[") {
                        continue;
                    }
                }

                // Get the attribute name that is usefull from key (from attrName until the end) and the json and array indexes.
                attrNameLeft = attrName.length === 0 ? key : key.substring(attrName.length + 1);
                jsonIndex = attrNameLeft.indexOf(".");
                arrayIndex = attrNameLeft.indexOf("[");

                // Check if this key is just an attribute.
                if (jsonIndex < 0 && arrayIndex < 0) {
                    // Add it to attrRef and remove it from data.
                    attrRef[attrNameLeft] = data[key];
                    delete data[key];
                    continue;
                }

                // Check if this key includes a json. If it does initialize the json in attrRef and call myself.
                if (jsonIndex < arrayIndex || arrayIndex === -1) {
                    var jsonAttr = attrNameLeft.substring(0, jsonIndex);
                    var jsonName = key.substring(0, (attrName.length === 0 ? 0 : attrName.length + 1) + jsonIndex);
                    if (typeof(attrRef[jsonAttr]) === "undefined") {
                        attrRef[jsonAttr] = {};
                    }
                    // Bug fix in 0.1.11 -> attribute name same with function name. Function names are not including . or [.
                    //                    var attributeValueAlreadyCreated = attrRef[jsonAttr];
                    //                    if(typeof(attributeValueAlreadyCreated) === "function") {
                    //                        attributeValueAlreadyCreated = {};
                    //                    }
                    if (jsonAttr === "constructor") {
                        attrRef.constructor = {};
                    }
                    // Recursiveness.
                    Softaware.Utilities.convertJsonAttributeToJsonOrArray(data, attrRef[jsonAttr], jsonName);
                    continue;
                }

                // Check if this key includes an array. If it does initialize the array or push another json on it and call myself to construct it.
                if (jsonIndex > arrayIndex || jsonIndex === -1) {
                    var arrayAttr = attrNameLeft.substring(0, arrayIndex);
                    var arrayName = key.substring(0, attrName.length + attrNameLeft.indexOf("]") + 1);
                    if (typeof(attrRef[arrayAttr]) === "undefined") {
                        attrRef[arrayAttr] = new Array();
                    }

                    // Get the array index number.
                    var attrNameLeftCut = attrNameLeft.substring(0, attrNameLeft.indexOf("]") + 1);
                    var arrayNo = attrNameLeftCut.match(/\[\d+\]/gi);
                    arrayNo = parseInt(arrayNo[0].substring(1, arrayNo[0].length - 1));

                    // Check if there is already an object on this position of the array.
                    // Change 1.20: Check if the lenght is more than the arrayNo and reset the arrayNo.
                    if (attrRef[arrayAttr].length <= arrayNo) {
                        arrayNo = attrRef[arrayAttr].length; // Reset the arrayNo.
                        attrRef[arrayAttr][arrayNo] = {};
                    }

                    // Recursiveness.
                    Softaware.Utilities.convertJsonAttributeToJsonOrArray(data, attrRef[arrayAttr][arrayNo], arrayName);
                    continue;
                }
            }
        }
        return attrRef;
    },
    /**
     * Get the value of key inside an enumeration.
     * @param {type} enumeration An Enumeration type.
     * @param {type} keyToSearch The key of the enumeration
     * @param {type} attributeName The attribute name to get its value.
     * @returns {String} the value of the attribute of the enumeration.
     */
    enumerationKeyToAttribute: function(enumeration, keyToSearch, attributeName) {
        if (!(enumeration instanceof Object) || typeof(keyToSearch) === "undefined" || typeof(attributeName) === "undefined") {
            throw new Softaware.Exception.InvalidArgumentException("enumeration:" + enumeration + ", keyToSearch:" + keyToSearch + ", attributeName:" + attributeName);
        }
        var attributeValue = null;
        $.each(enumeration, function(key, value) {
            if (keyToSearch !== null && key === keyToSearch.toString()) {
                attributeValue = value[attributeName];
            }
        });
        return attributeValue;
    },
    /**
     * WIth a given text, replaes the parameters that may exist in there with data from data.
     * @param {String} text The text to use as template. Use {paramName} for parameters.
     * @param {Object} data The json to use for the data to include in template.
     * @returns {unresolved}
     */
    textFromTemplate: function(text, data) {
        data = typeof data !== "object" ? {} : data;
        return text.replace(/\{([a-zA-Z\.\_]+)\}/gi, function(match, key) {
            var value = Softaware.Utilities.jsonPathToValue(data, key);
            return typeof value === null ? match : value;
        });
    },
    /**
     * Make a scan to dom using the selector and make changes depending the attributes of the dom elements and the data argument provided.
     * 
     * @param {Object} data
     * @param {String or Jquery Object} domSelector
     * @returns {undefined}
     */
    dataToDom: function(data, domSelector) {
        /**
         * Manage the attribute data-name
         * <br/><br/>
         * Set the value/text of this element using data.
         * The value of the attribute will be searhed as a key in data.
         * 
         * @param {Object} data
         * @param {String or Jquery Object} domSelector
         * @returns {void}
         */
        this.name = function(data, domSelector) {
            var items = $(domSelector).find("*[data-name]");
            if (items.length === 0) {
                return;
            }

            // Check each item.
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var value = $(item).attr("data-name");
                var valueToSet = Softaware.Utilities.jsonPathToValue(data, value);
                Softaware.TextUtils.textToElement(valueToSet === null ? "" : valueToSet.toString(), item);
                //                if ($(item).isFormElement()) {
                //                    $(item).val(valueToSet === null ? "" : valueToSet.toString());
                //                } else {
                //                    $(item).html(valueToSet === null ? "" : valueToSet.toString());
                //                }
            }

        };
        /**
         * Manage the attribute data-default
         * <br/><br/>
         * In case of an element without value, set this value.
         * 
         * @param {String or Jquery Object} domSelector
         * @returns {void}
         */
        this.defaultValue = function(domSelector) {
            var items = $(domSelector).find("*[data-default]");
            if (items.length === 0) {
                return;
            }

            // Check each item.
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var value = $(item).attr("data-default");

                // Set the default value.
                if ($(item).isFormElement()) {
                    // Validation if it is empty. ButtonsGroups must not have a label active.
                    if (($(item).is("input[type='radio']") || $(item).is("input[type='checkbox']")) && $(item).parent().is("label")) {
                        if ($(item).closest("div").find("label.active").length > 0) {
                            continue;
                        }
                    } else {
                        var curValue = $(item).val();
                        if (typeof(curValue) !== "undefined" && curValue !== null && curValue.trim().length > 0) {
                            continue;
                        }
                    }
                    Softaware.TextUtils.textToElement(value, item);
                } else {
                    // Validation if it is empty.
                    if ($(item).text().trim().length > 0) {
                        continue;
                    }
                    $(item).html(value);
                }
            }
        };
        /**
         * Manage the attribute data-numberFormat-details
         * <br/><br/>
         * Format the number of the field in a preffered way.
         * <br/><br/>
         * You have to specify, comma separetaed the above,<br/>
         * - the current character that separates the numeric of type {@link Softaware.Type.NumberFormatSign},<br/>
         * - the current character that separates the decimal numbers of type {@link Softaware.Type.NumberFormatSign},<br/>
         * - the new character that separates the numerics of type {@link Softaware.Type.NumberFormatSign},<br/>
         * - the new character that will separate the decimal numbers of type {@link Softaware.Type.NumberFormatSign},<br/>
         * - the new minimum decimal numbers to show,<br/>
         * - the new maximum decimal numbers to show.<br/>
         * 
         * @param {String or Jquery Object} domSelector
         * @returns {void}
         */
        this.numberFormatComplex = function(domSelector) {
            var items = $(domSelector).find("*[data-numberFormat-details]");
            if (items.length === 0) {
                return;
            }

            // Check each item.
            for (var i = 0; i < items.length; i++) {
                // Get the current item, the value of it and the attribute value of it.
                var item = items[i];
                var value = $(item).isFormElement() ? $(item).val() : $(item).text();
                var attributeValue = $(item).attr("data-numberFormat-details");
                var values = attributeValue.split(",");

                // Validation.
                if (values.length !== 6) {
                    continue;
                }

                // Create an object to use for the conversion.
                var itemNumberFormat = new Softaware.NumberFormat({
                    numberSeparatorOld: Softaware.Type.NumberFormatSign[values[0]],
                    decimalSeparatorOld: Softaware.Type.NumberFormatSign[values[1]],
                    numberSeparatorNew: Softaware.Type.NumberFormatSign[values[2]],
                    decimalSeparatorNew: Softaware.Type.NumberFormatSign[values[3]],
                    countDecimalsMin: parseInt(values[4]),
                    countDecimalsMax: parseInt(values[5])
                });

                // Set the converted value.
                Softaware.TextUtils.textToElement(itemNumberFormat.format(value), item);
                //                if ($(item).isFormElement()) {
                //                    $(item).val(itemNumberFormat.format(value));
                //                } else {
                //                    $(item).text(itemNumberFormat.format(value));
                //                }
            }
        };
        /**
         * Manage the attribute data-float-fixed
         * <br/><br/>
         * In case of an element with a float value, set the number of decimals.
         * 
         * @param {String or Jquery Object} domSelector
         * @returns {void}
         */
        this.floatFixed = function(domSelector) {
            var items = $(domSelector).find("*[data-float-fixed]");
            if (items.length === 0) {
                return;
            }

            // Check each item.
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var value = parseFloat($(item).attr("data-float-fixed"));
                if ((value | 0)) {
                    $(item).text(value);
                }
            }
        };
        /**
         * Manage the attribute data-enumeration and the optional attribute data-enumeration-key
         * <br/><br/>
         * Change the value to a value from Enumeration. The current value must be a key in the Enumeration.<br/>
         * Requires the existence of the object Enumeration.<br/>
         * The default key is the <b>name</b>.
         * 
         * @param {String or Jquery Object} domSelector
         * @returns {void}
         */
        this.enumeration = function(domSelector) {
            var items = $(domSelector).find("*[data-enumeration]");
            if (items.length === 0) {
                return;
            }

            // Validation.
            if (typeof(Enumeration) === "undefined") {
                console.log("Enumeration is not defined. You have to define it like Enumeration = { 'MyEnum':{..} }");
                return;
            }

            // Check each item.
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var enumerationKey = $(item).attr("data-enumeration");
                var enumerationObject = $(item).isFormElement() ? $(item).val() : $(item).text();

                // Validate.
                if (typeof(Enumeration[enumerationKey]) === "undefined") {
                    console.log(enumerationKey + " is not defined. You have to define it like Enumeration = { '" + enumerationKey + "':{..} }");
                    return;
                }

                // data-enumeration-key
                var enumerationAttributeName = $(item).attr("data-enumeration-key"); // I can set the enumeration key by own but the default is the name.
                enumerationAttributeName = typeof(enumerationAttributeName) !== "undefined" ? enumerationAttributeName : "name"; // DEFAULT KEY is name!

                // Set the converted value.
                var value = Softaware.Utilities.enumerationKeyToAttribute(Enumeration[enumerationKey], enumerationObject, enumerationAttributeName);
                Softaware.TextUtils.textToElement(value, item);
                //                if ($(item).isFormElement()) {
                //                    $(item).val(value);
                //                } else {
                //                    $(item).text(value);
                //                }
            }
        };
        /**
         * Manage the attribute data-template and optional data-template-key, data-template-separator
         * <br/><br/>
         * The value of this attribute is a template that will be used to generate the content of the element.<br/>
         * Use the data-template-key in case you have an array. The value of this attribute will be the json path to the array.<br/>
         * The parameters inside the template will be replaced with the data value or data[data-template-key] value in case of an array.<br/>
         * In case of an array, the template will run for each item in the array. The default separator is the new line.<br/>
         * If you wish to use your own separator then use the attribute data-template-separator.
         * 
         * 
         * @param {Object} data
         * @param {String or Jquery Object} domSelector
         * @returns {void}
         */
        this.template = function(data, domSelector) {
            var items = $(domSelector).find("*[data-template]");
            if (items.length === 0) {
                return;
            }

            // Check each item.
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var text = $(item).attr("data-template");

                // Validation.
                if (typeof(text) === "undefined") {
                    console.log("For each data-template-key you have to set also data-template.");
                }

                // data-template-key
                var key = $(item).attr("data-template-key");
                if (typeof key !== "undefined" && key !== null) {
                    var key = $(item).attr("data-template-key");
                    data = Softaware.Utilities.jsonPathToValue(data, key); // Prune to the array.
                    if (data === null) {
                        console.log("The data-template-key (" + key + ") is not existing.");
                    }
                    // Generate the value.
                    var separator = $(item).attr("data-template-separator") || "<br/>";
                    var html = "";
                    for (var i = 0; i < data.length; i++) {
                        html += Softaware.Utilities.textFromTemplate(text, data[i]) + separator;
                    }
                    var value = html.length <= 1 ? html : html.substring(0, html.length - separator.length); // Remove the last separator added.

                    // Set the converted value.
                    Softaware.TextUtils.textToElement(value, item);
                    //                    if ($(item).isFormElement()) {
                    //                        $(item).val(value);
                    //                    } else {
                    //                        $(item).html(value);
                    //                    }
                }

                // In case of object.
                if (!(typeof key !== "undefined" && key !== null)) {
                    // Generate the value.
                    var value = Softaware.Utilities.textFromTemplate(text, data);

                    // Set the converted value.
                    Softaware.TextUtils.textToElement(value, item);
                    //                    if ($(item).isFormElement()) {
                    //                        $(item).val(value);
                    //                    } else {
                    //                        $(item).html(value);
                    //                    }
                }
            }
        };
        /**
         * Manage the attribute data-image [data-image-alt]
         * <br/><br/>
         * Add one image inside the element. In case you wish to add more use the data-template attribute.<br/>
         * The value of the attribute will be a template for the filename to use.<br/>
         * You can add the data-image-alt and set a template to use for the alt of the image.<br/>
         * 
         * @param {Object} data
         * @param {String or Jquery Object} domSelector
         * @returns {void}
         */
        this.image = function(data, domSelector) {
            var items = $(domSelector).find("*[data-image]");
            if (items.length === 0) {
                return;
            }

            // Check each item.
            for (var i = 0; i < items.length; i++) {
                // Initialize params.
                var item = items[i];
                var imageSrc = $(item).attr("data-image");
                var imageAlt = $(item).attr("data-image-alt");
                imageAlt = imageAlt ? imageAlt : "";

                // Get the source and alt from template.
                imageSrc = Softaware.Utilities.textFromTemplate(imageSrc, data);
                imageAlt = Softaware.Utilities.textFromTemplate(imageAlt, data);

                // Set the converted value.
                $(item).html("<img src='" + imageSrc + "' alt='" + imageAlt + "' class='img-responsive' />");
            }
        };
        /**
         * Manage the attribute data-hyperlink data-hyperlink-text [data-hyperlink-target]
         * <br/><br/>
         * Add a hyperlink element inside the element. In case you wish to add more use the data-template attribute.<br/>
         * The value of the attribute data-hyperlink will be a template for the href.<br/>
         * The value of the attribute data-hyperlink-text will be a template for the text.<br/>
         * You can add the data-hyperlink-target and set the value for the target. The default is the _blank.<br/>
         * 
         * @param {Object} data
         * @param {String or Jquery Object} domSelector
         * @returns {void}
         */
        this.hyperlink = function(data, domSelector) {
            var items = $(domSelector).find("*[data-hyperlink]");
            if (items.length === 0) {
                return;
            }

            // Check each item.
            for (var i = 0; i < items.length; i++) {
                // Initialize params.
                var item = items[i];
                var href = $(item).attr("data-hyperlink");
                var text = $(item).attr("data-hyperlink-text");
                var target = $(item).attr("data-hyperlink-target");
                target = target ? target : "_blank";

                // Get the source and alt from template.
                href = Softaware.Utilities.textFromTemplate(href, data);
                text = Softaware.Utilities.textFromTemplate(text, data);

                // Set the converted value.
                $(item).html("<a href='" + href + "' target='" + target + "'>" + text + "</a>");
            }
        };
        // Convert all.
        {
            if (!(data instanceof Object) || typeof(domSelector) === "undefined") {
                throw new Softaware.Exception.InvalidArgumentException("data:" + data + ", domSelector:" + domSelector);
            }

            // Set attributes.
            this.name(data, domSelector); // data-name
            this.defaultValue(domSelector); // data-default

            // Format/Change attributes.
            this.numberFormatComplex(domSelector); // data-numberFormat-details
            this.floatFixed(domSelector); // data-float-fixed
            this.enumeration(domSelector); // data-enumeration [data-enumeration-key]
            this.template(data, domSelector); // data-template [data-template-key data-template-separator]

            // Not form changes.
            this.image(data, domSelector); // data-image [data-image-alt]
            this.hyperlink(data, domSelector); // data-hyperlink data-hyperlink-text [data-hyperlink-target]
        }
    },
    /**
     * Loads the json values to the form elements.
     * 
     * @param {Object} data
     * @param {String or JQuery object} formSelector
     * @returns {void}
     */
    dataToForm: function(data, formSelector) {
        /**
         * Initialize all the form fields with values depending the data.
         * 
         * @param {Object} data
         * @param {String or Jquery Object} formSelector
         * @returns {void}
         */
        this.initialize = function(data, formSelector) {
            // For each child on the current node.
            var formFields = $(formSelector).formFieldsToArray();
            for (var i = 0; i < formFields.length; i++) {
                var formField = formFields[i];

                // Store the value to dom.
                if ($(formField).is("input[type='radio']") || $(formField).is("input[type='checkbox']")) {
                    // In case of a radio button group OR a checkbox group.
                    for (var j = 0; j < $(formField).length; j++) {
                        var input = $(formField)[j];
                        var value = Softaware.Utilities.jsonPathToValue(data, $(input).attr("name"));
                        if (value !== null && $(input).val() === value.toString()) {
                            Softaware.TextUtils.textToElement(value, formField);
                            //                            $(input).prop("checked", true);
                            //                            $(input).parent().addClass("active");
                        }
                    }
                } else if (typeof $(formField).attr("name") !== "undefined") {
                    var value = Softaware.Utilities.jsonPathToValue(data, $(formField).attr("name"));
                    if (value !== null) {
                        Softaware.TextUtils.textToElement(value, formField);
                        //                        $(formField).val(value);
                    }
                }
            }
        };
        /**
         * Manage the attribute data-checkbox-array
         * <br/><br/>
         * Check checkboxes depending the jsons in a specific array in data.
         * <br/><br/>
         * Add this attribute to input type=checkbox <b>only</b>.
         * <br/><br/>
         * - Example of data, <br/>
         * data = { testArray = [ {key: "value1"}, {key: "value2"} ] }; <br/>
         * - This item will be checked, <br/>
         * input type="text" name="testArray" value="value1" data-checkbox-array="key" <br/>
         * - This item will <b>not</b> be checked,<br/>
         * input type="text" name="testArray" value="notExistingInData" data-checkbox-array="key" <br/>
         * 
         * @param {Object} data
         * @param {String or Jquery Object} formSelector
         * @returns {void}
         */
        this.checkbox_array = function(data, formSelector) {
            var items = $(formSelector).find("*[data-checkbox-array]");
            if (items.length === 0) {
                return;
            }

            // Check each item.
            for (var i = 0; i < items.length; i++) {
                // Get the item and validate.
                var item = items[i];
                if (!$(item).is("input[type='checkbox']")) {
                    continue;
                }
                var checkboxArrayKey = $(items[i]).attr("name");
                if (!(data[checkboxArrayKey] instanceof Array)) {
                    continue;
                }

                // For each item in the array.
                var key = $(item).attr("data-checkbox-array");
                var value = $(item).val();

                for (var j = 0; j < data[checkboxArrayKey].length; j++) {
                    var jsonInArray = data[checkboxArrayKey][j]; // The current item/json.

                    // Json.
                    if (jsonInArray instanceof Object && jsonInArray[key].toString() === value.toString()) { // Check if the value of the current json is equal with the current checkbox.
                        $(item).prop("checked", true);
                        $(item).parent().addClass("active");
                    }

                    // Item.
                    if (typeof jsonInArray === "string" && jsonInArray.toString() === value.toString()) { // Check if the value of the current item is equal with the current checkbox.
                        $(item).prop("checked", true);
                        $(item).parent().addClass("active");
                    }
                }
            }
        };
        // Load data to form.
        {
            // Argument Validation.
            if (typeof(formSelector) === "undefined" || !(data instanceof Object)) {
                throw new Softaware.Exception.InvalidArgumentException("selector:" + formSelector + ", data:" + data);
            }
            // Validation of formSelector.
            if ($(formSelector).length === 0) {
                throw new Softaware.Exception.InvalidArgumentException("The provided selector is not existing. selector:" + formSelector);
            }
            if (!$(formSelector).is("form")) {
                throw new Softaware.Exception.InvalidArgumentException("The provided selector is not a form. selector:" + formSelector);
            }

            // Load data to form.
            this.initialize(data, formSelector);
            this.checkbox_array(data, formSelector); // data-checkbox-array
        }
    },
    /**
     * Loads the form values to the data argument.
     * 
     * @param {String or Jquery object} formSelector the dom jQuery selector or object.
     * @returns {Object or FormData}
     */
    formToData: function(formSelector) {
        /**
         * Manage the attribute data-checkbox-array
         * <br/><br/>
         * Removes the value from data of this checkboxes. Works only with the checked checkboxes.<br/>
         * Adds in data the name as array and pushes the checked values as objects.<br/>
         * Example: list.attr1, list.attr1 to list: [{attr1:"value"},{attr1:"value"}].<br/>
         * Use the attribute name for the json key for the array. Use the value of the attribute data-checkbox-array for the key in each object in the array.
         * 
         * @param {Object} data
         * @param {String or Jquery Object} formSelector
         * @returns {void}
         */
        this.checkbox_array = function(data, formSelector) {
            var items = $(formSelector).find("input[type='checkbox'][data-checkbox-array]");
            if (items.length === 0) {
                return;
            }

            // Check each item.
            var buffer = {};
            for (var i = 0; i < items.length; i++) {
                // Get the item and validate.
                var item = items[i];
                if (!$(item).is(":checked")) {
                    continue;
                }
                // Get the names.
                var prependName = $(item).attr("name");
                var appendName = $(item).attr("data-checkbox-array");

                // MULTIPART.
                if (data instanceof FormData) {
                    // Get the next number and include for this entry in FormData.
                    if (!buffer[prependName]) {
                        data.delete(prependName);
                        buffer[prependName] = 0;
                    }
                    data.append(prependName + "[" + buffer[prependName] + "]." + appendName, $(item).val());
                    buffer[prependName] = buffer[prependName] + 1;
                }

                // NOT MULTIPART.
                if (!(data instanceof FormData)) {
                    // Get the next number and include for this entry in FormData.
                    if (!buffer[prependName]) {
                        delete data[prependName];
                        buffer[prependName] = 0;
                        data[prependName] = [];
                    }
                    if (appendName) {
                        data[prependName][buffer[prependName]] = {};
                        data[prependName][buffer[prependName]][appendName] = $(item).val();
                    } else {
                        data[prependName].push($(item).val());
                    }
                    buffer[prependName] = buffer[prependName] + 1;
                }
            }
        };
        // Convert all.
        {
            if (typeof(formSelector) === "undefined") {
                throw new Softaware.Exception.InvalidArgumentException("formSelector:" + formSelector);
            }
            // Validation of formSelector.
            if ($(formSelector).length === 0) {
                throw new Softaware.Exception.InvalidArgumentException("The provided selector is not existing. selector:" + formSelector);
            }
            if (!$(formSelector).is("form")) {
                throw new Softaware.Exception.InvalidArgumentException("The provided selector is not a form. selector:" + formSelector);
            }

            // Get the form values and store them to an object.
            var formData;
            if ($(formSelector).hasFile()) {
                formData = new FormData($(formSelector)[0]);
            } else {
                formData = $(formSelector).serializeObject();
            }

            // Form changes.
            this.checkbox_array(formData, formSelector); // data-checkbox-array

            return formData;
        }
    },
    /**
     * Generates a string using the arguments.
     * @param {Number} length the length of the generated string. Default 6.
     * @param {Boolean} allowDuplicates true in case you allow duplicates. Default true.
     * @param {Boolean} lettersLower true in case you allow lower case letters. Default true.
     * @param {Boolean} lettersCapital true in case you allow capital case letters. Default true.
     * @param {Boolean} numbers true in case you allow numbers. Default true.
     * @returns {String}
     */
    generateString: function(length, allowDuplicates, lettersLower, lettersCapital, numbers) {
        // Argument check.
        length = typeof length === 'undefined' ? 6 : length;
        allowDuplicates = typeof allowDuplicates === "undefined" ? true : allowDuplicates;
        var possible = "";
        if (typeof lettersLower === "undefined" || lettersLower === true) {
            possible += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }
        if (typeof lettersCapital === "undefined" || lettersCapital === true) {
            possible += "abcdefghijklmnopqrstuvwxyz";
        }
        if (typeof numbers === "undefined" || numbers === true) {
            possible += "0123456789";
        }

        // Validation.
        if (length > possible.length) {
            throw new Softaware.Exception.IllegalStateException("length cannot be more than possible total lenght.");
        }

        // String generation.
        var text = "";
        for (var i = 0; i < length; i++) {
            var index = Math.floor(Math.random() * possible.length);
            text += possible.charAt(index);
            if (!allowDuplicates) {
                possible = possible.slice(0, index) + possible.slice(index + 1);
            }
        }

        return text;
    },
    /**
     * Generate a uuid for general porpuse use.
     * 
     * @returns {String} the generated uuid.
     */
    generateUUID: function guid() {
        function uuidPart() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return uuidPart() + uuidPart() + '-' + uuidPart() + '-' + uuidPart() + '-' +
            uuidPart() + '-' + uuidPart() + uuidPart() + uuidPart();
    },
    /**
     * Copies a text to clipboard.
     * 
     * @param {type} text the text to copy to clipboard.
     * @returns {undefined}
     */
    copyToClipboard: function(text) {
        if (!text) {
            throw new Softaware.Exception.InvalidArgumentException("Not valid argument (text:" + text + ")");
        }

        // Generate an id to use for the generated textarea.
        var id = id = Softaware.Utilities.generateString(20);

        // Generate a textarea to use as container for the text.
        $("body").append($("<textarea id='" + id + "'>" + text + "</textarea>"));

        // Create a textarea, set the correct text, copy it.
        window.getSelection().removeAllRanges();
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(id));
            range.select().createTextRange();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(document.getElementById(id));
            window.getSelection().addRange(range);
            document.execCommand("Copy");
        }

        // Remove textarea.
        $("#" + id).remove();
    },
    /**
     * Escape regural expression special characters.
     * @param {type} str
     * @returns {unresolved}
     */
    escapeRegExp: function(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    },
    /**
     * DEPRECATED - MOVED IN THE autoConfigurationMethod!
     * @param {type} domSelector
     * @returns {undefined}
     */
    autoConfiguration: function(domSelector) {
        /**
         * Manage the data-daterangepicker<br/>
         * In case of an element that has this attribute, initialize on it the daterangepicker.<br/>
         * The value of the attribute is optional and is the date format. The default is the DD.MM.YYYY.
         * 
         * @param {type} selector
         * @returns {undefined}
         */
        this.daterangepicker = function(selector) {
            // Check the existance of the attribute.
            var items = $(selector).find("input[data-daterangepicker]");
            if (items.length === 0) {
                return;
            }

            // Check the existance of the library.    
            if (typeof($.fn.daterangepicker) !== "function") {
                throw "daterangepicker library is missing.";
            }

            // For each item.
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var value = $(item).attr("data-daterangepicker");
                $(item).daterangepicker({
                    singleDatePicker: true,
                    showDropdowns: true,
                    locale: {
                        format: (value ? value : "DD.MM.YYYY")
                    }
                });
                // Clear button if exists.
                var btn = $(item).closest("div").find("button");
                if (btn.length > 0) {
                    $(btn).on("click", function(event) {
                        event.stopPropagation();
                        var input = $(this).closest("div").find("input");
                        $(input).val("");
                        $(input).datepicker("refresh");
                        return false;
                    });
                }
            }
        };
        /**
         * Manage the data-datepicker<br/>
         * In case of an element that has this attribute, initialize on it the datetimepicker for only dates (not time).<br/>
         * The value of the attribute is optional and is the date format. The default is the DD.MM.YYYY.
         * 
         * @param {type} selector
         * @returns {undefined}
         */
        this.datepicker = function(selector) {
            // Check the existance of the attribute.
            var items = $(selector).find("input[data-datepicker]");
            if (items.length === 0) {
                return;
            }

            // Check the existance of the library.    
            if (typeof($.fn.datetimepicker) !== "function") {
                throw "datetimepicker library is missing.";
            }

            // For each item.
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var value = $(item).attr("data-datepicker");
                value = typeof value === "undefined" || value === null || value.length === 0 ? "DD.MM.YYYY" : value;
                $(item).datetimepicker({
                    viewMode: "days",
                    format: value
                });
            }
        };
        /**
         * Manage the data-datetimepicker<br/>
         * In case of an element that has this attribute, initialize on it the datetimepicker for only dates (not time).<br/>
         * The value of the attribute is optional and is the date format. The default is the DD.MM.YYYY HH:mm.
         * 
         * @param {type} selector
         * @returns {undefined}
         */
        this.datepicker = function(selector) {
            // Check the existance of the attribute.
            var items = $(selector).find("input[data-datetimepicker]");
            if (items.length === 0) {
                return;
            }

            // Check the existance of the library.    
            if (typeof($.fn.datetimepicker) !== "function") {
                throw "datetimepicker library is missing.";
            }

            // For each item.
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var value = $(item).attr("data-datetimepicker");
                value = typeof value === "undefined" || value === null || value.length === 0 ? "DD.MM.YYYY HH:mm" : value;
                $(item).datetimepicker({
                    viewMode: "days",
                    format: value
                });
            }
        };
        /**
         * Manage the attribute data-select-enum and the optional data-select-enum-key.
         * <br/><br/>
         * The value of the data-select-enum must be an array of enums.<br/>
         * The value of the data-select-enum-key must be a key inside all enums that will be selected.<br/>
         * The default key is the name.
         * 
         * @param {type} selector
         * @returns {undefined}
         */
        this.selectFromEnum = function(selector) {
            // Check the existance of the attribute.
            var items = $(selector).find("select[data-select-enum]");
            if (items.length === 0) {
                return;
            }

            // For each item.
            for (var i = 0; i < items.length; i++) {
                var item = items[i];

                // Construct the select options.
                var enumeration = $(item).attr("data-select-enum");
                var key = $(item).attr("data-select-enum-key");

                $(item).initSelectFromEnumeration(Enumeration[enumeration], key);
            }
        };
        /**
         * Manage the attribute data-select-url and the optionals data-select-url-value and data-select-url-text and data-select-callback and data-select-editable.
         * <br/><br/>
         * The value of the data-select-url must be a String url. The data of the url are cached in cse the url is used again.<br/>
         * The value of the data-select-url-value must be a String with a value that exists as a key in the data.
         * The value of the key will be used as value for the options.<br/>
         * The value of data-select-callback must be a function that will be called after fetching data.<br/>
         * The default value of data-select-url-value is the id.<br/>
         * The value of the data-select-url-text must be a String with a value that exists as a key in the data.
         * The value of the key will be used as text for the options.<br/>
         * The default value of data-select-url-value is the title.<br/>
         * In case of the existance of data-select-editable and the existance of the correct library, the select will be converted to editable.<br/>
         * Save the data fetched in an array with global visibility with name data_select_url and with keys the urls.
         * 
         * 
         * @param {type} selector
         * @returns {undefined}
         */
        this.selectFromUrl = function(selector) {
            // Check the existance of the attribute.
            var items = $(selector).find("select[data-select-url]");
            if (items.length === 0) {
                return;
            }

            // For each item get the data.
            var selects = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];

                // Construct the select data.
                var select = {};
                select.index = i;
                select.url = $(item).attr("data-select-url");
                select.value = $(item).attr("data-select-url-value");
                select.text = $(item).attr("data-select-url-text");
                select.callback = $(item).attr("data-select-callback");
                select.editable = $(item).is("[data-select-editable]");
                selects.push(select);
            }

            // Request for data and build the selects.
            var requestedUrls = []; // cache the requested url to prevent from duplicate requests.
            data_select_url = {}; // Global var to store the data fetched.
            for (var i = 0; i < selects.length; i++) {
                // Duplicate validation.
                if (jQuery.inArray(selects[i].url, requestedUrls) >= 0) {
                    continue;
                }
                requestedUrls.push(selects[i].url);

                // Request data.
                Softaware.Service.readAll(selects[i].url, {
                    success: function(models) {
                        for (var j = 0; j < selects.length; j++) {
                            if (selects[j].url === this.url && models.length > 0) {
                                // Add options in select.
                                $(items[j]).initSelectFromDatas(models,
                                    selects[j].value ? selects[j].value : "id",
                                    selects[j].text ? selects[j].text : "title");
                                // Make it editable.
                                if (selects[j].editable) {
                                    // Check the existance of the library.    
                                    if (typeof($.fn.editableSelect) !== "function") {
                                        throw new Softaware.Exception.IllegalStateException("editableSelect library is missing.");
                                    }
                                    $(items[j]).editableSelect({
                                        effects: "slide"
                                    });
                                }
                                // Save it to global var data_select_url
                                data_select_url[selects[j].url] = models;
                                // Callback.
                                if (typeof selects[j].callback !== "undefined" && typeof window[selects[j].callback] === "function") {
                                    window[selects[j].callback]();
                                }
                            }
                        }
                    }
                });
            }
        };
        /**
         * Manage the attribute data-mapkey-array.
         * <br/><br/>
         * The value of the data-mapkey must be an array of json with two
         * attributes: "s" as the source and "t" as the target. When the users
         * presses a key then if the key is included in the json as "s" value,
         * it will be convertet to the json "t" value.
         * 
         * @param {type} selector to search for elements with this attribute.
         * @returns {void}
         */
        this.mapkeyArray = function(selector) {
            // Check the existance of the attribute.
            var items = $(selector).find("*[data-mapkey-array]");
            if (items.length === 0) {
                return;
            }

            // For each item.
            for (var i = 0; i < items.length; i++) {
                var item = items[i];

                // Add the event listener.
                //                    $(item).on("propertychange change keypress paste input", function (event) {
                $(item).on("input", function(event) {
                    event.stopPropagation();

                    // Get the source and target language.
                    var replacesArray = JSON.parse($(this).attr("data-mapkey-array"));

                    // For each replace character, replace it.
                    for (var i = 0; i < replacesArray.length; i++) {
                        $(this).val($(this).val().replaceAll(replacesArray[i].s, replacesArray[i].t));
                    }

                    // Do not propagate.
                    return false;
                });
            }
        };
        /**
         * Manage the attribute data-mapkey-url.
         * <br/><br/>
         * The value of the data-mapkey-url is not considered. This attributes
         * allows only url approved characters. The conversions is implemented
         * in the Softaware.TextUtils.textToUrl text converter.<br/>
         * 
         * @param {type} selector to search for elements with this attribute.
         * @returns {void}
         */
        this.mapkeyAsUrl = function(selector) {
            // Check the existance of the attribute.
            var items = $(selector).find("*[data-mapkey-url]");
            if (items.length === 0) {
                return;
            }

            // For each item.
            for (var i = 0; i < items.length; i++) {
                var item = items[i];

                // Add the event listener.
                $(item).on("input", function(event) {
                    event.stopPropagation();

                    // Convert the value to a valid url.
                    $(this).val(Softaware.TextUtils.textToUrl($(this).val()));

                    // Do not propagate.
                    return false;
                });
            }
        };
        /**
         * Manage the attribute data-mapkey-lang.
         * <br/><br/>
         * The value of the data-mapkey-lang must be a target and a source language separated with underscore (_).<br/>
         * When the users presses a key then if the key is included in the source language map, it will be convertet to the target language character.
         * 
         * @param {type} selector to search for elements with this attribute.
         * @returns {void}
         */
        this.mapkeyLang = function(selector) {
            this.getLanguageMapper = function(languageSource, languageTarget) {
                // Check if the map is already defined.
                if (typeof langugageCharMap === "undefined") {
                    langugageCharMap = {};
                }
                if (typeof langugageCharMap[languageSource] === "undefined") {
                    langugageCharMap[languageSource] = {};
                }

                // Initialize or get the language mapper.
                if (typeof langugageCharMap[languageSource][languageTarget] === "undefined") {
                    switch (languageSource) {
                        case Softaware.Type.Language.GR:
                            switch (languageTarget) {
                                case Softaware.Type.Language.EN:
                                    langugageCharMap[languageSource][languageTarget] = {
                                        "α": "a",
                                        "ά": "a",
                                        "β": "b",
                                        "γ": "g",
                                        "δ": "d",
                                        "ε": "e",
                                        "έ": "e",
                                        "ζ": "z",
                                        "η": "h",
                                        "ή": "h",
                                        "θ": "th",
                                        "ι": "i",
                                        "ί": "i",
                                        "ϊ": "i",
                                        "ΐ": "i",
                                        "κ": "k",
                                        "λ": "l",
                                        "μ": "m",
                                        "ν": "n",
                                        "ξ": "ks",
                                        "ο": "o",
                                        "ό": "o",
                                        "π": "p",
                                        "ρ": "r",
                                        "σ": "s",
                                        "ς": "s",
                                        "τ": "t",
                                        "υ": "y",
                                        "ύ": "y",
                                        "ϋ": "y",
                                        "ΰ": "y",
                                        "φ": "f",
                                        "χ": "x",
                                        "ψ": "ps",
                                        "ω": "o",
                                        "ώ": "o",
                                        "Α": "A",
                                        "Ά": "A",
                                        "Β": "B",
                                        "Γ": "G",
                                        "Δ": "D",
                                        "Ε": "E",
                                        "Έ": "E",
                                        "Ζ": "Z",
                                        "Η": "H",
                                        "Ή": "H",
                                        "Θ": "TH",
                                        "Ι": "I",
                                        "Ί": "I",
                                        "Ϊ": "I",
                                        "Κ": "K",
                                        "Λ": "L",
                                        "Μ": "M",
                                        "Ν": "N",
                                        "Ξ": "KS",
                                        "Ο": "O",
                                        "Ό": "O",
                                        "Π": "P",
                                        "Ρ": "R",
                                        "Σ": "S",
                                        "Τ": "T",
                                        "Υ": "Y",
                                        "Ύ": "Y",
                                        "Ϋ": "Y",
                                        "Φ": "F",
                                        "Χ": "X",
                                        "Ψ": "PS",
                                        "Ω": "O",
                                        "Ώ": "O"
                                    };
                                    break;
                                case Softaware.Type.Language.GR:
                                default:
                                    throw new Softaware.Exception.IllegalStateException("Language(" + languageTarget + ") is not supported as target for Language(" + languageSource + ").");
                            }
                            break;
                        case Softaware.Type.Language.EN:
                        default:
                            throw new Softaware.Exception.IllegalStateException("Language(" + languageSource + ") is not supported as source.");
                    }
                }

                return langugageCharMap[languageSource][languageTarget];
            };
            // Check the existance of the attribute.
            var items = $(selector).find("*[data-mapkey-lang]");
            if (items.length === 0) {
                return;
            }

            // For each item.
            for (var i = 0; i < items.length; i++) {
                var item = items[i];

                // Get the source and target language.
                var languages = $(item).attr("data-mapkey-lang");
                var languageSource = languages.split("_")[0];
                var languageTarget = languages.split("_")[1];

                // Add the event listener.
                var self = this;
                $(item).keypress(function(event) {
                    event.stopPropagation();
                    // Get the mapper to use.
                    var mapper = self.getLanguageMapper(languageSource, languageTarget);
                    // Get the key pressed.
                    var keyPressed = String.fromCharCode(event.which);
                    // Get the key to set. In case it doesn't exist in the mapper, get the key pressed.
                    var keyToSet = mapper[keyPressed] || keyPressed;
                    // Set the key to the dom.
                    this.value = this.value + keyToSet;

                    // Do not propagate.
                    return false;
                });
            }
        };
        /**
         * Manage the attribute data-colorpicker.
         * <br/><br/>
         * The value of the data-colorpicker will be ignored.<br/>
         * 
         * @param {type} selector
         * @returns {undefined}
         */
        this.colorpicker = function(selector) {
            // Check the existance of the attribute.
            var items = $(selector).find("*[data-colorpicker]");
            if (items.length === 0) {
                return;
            }

            // Check the existance of the library.    
            if (typeof($.fn.colorpicker) !== "function") {
                throw "colorpicker library is missing.";
            }

            // For each item.
            $("*[data-colorpicker]").colorpicker();
        };
        /**
         * Manage the attribute data-bind-target.
         * <br/><br/>
         * The value of the data-bind-target must be a selector of a type.<br/>
         * 
         * @param {type} selector
         * @returns {undefined}
         */
        this.binding = function(selector) {
            // Check the existance of the attribute.
            var items = $(selector).find("*[data-bind-target]");
            if (items.length === 0) {
                return;
            }

            // For each one add a listener.
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                // INPUT[TEXT] OR TEXTAREA.
                if ($(item).is("input[type='text']") || $(item).is("textarea")) {
                    //                    $(item).on("propertychange change keypress paste input", function (event) {
                    $(item).on("input", function(event) {
                        event.stopPropagation();

                        var sourceText = $(this).val(); // The text of this input[type='text'] or textareaa.

                        // For each target of this bind source, update the content.
                        var targetElements = $($(this).attr("data-bind-target"));
                        for (var j = 0; j < targetElements.length; j++) {
                            Softaware.TextUtils.textToElement(sourceText, $(targetElements[j]));

                            // Trigger the change event.
                            if ($(targetElements[j]) !== $(this)) {
                                $(targetElements[j]).trigger("input");
                            }
                        }

                        return false;
                    });
                }
            }
        };
        // Run.
        {
            autoConfiguration(typeof domSelector === "undefined" ? "body" : domSelector);
            return;

            // DEPRECATED - MOVED IN THE autoConfigurationMethod!
            // Check the argument.
            domSelector = typeof domSelector === "undefined" ? "body" : domSelector;

            // For each autoconfig.
            this.daterangepicker(domSelector); // data-daterangepicker
            this.datepicker(domSelector); // data-datepicker
            this.selectFromEnum(domSelector); // data-select-enum [data-select-enum-key]
            this.selectFromUrl(domSelector); // data-select-url [data-select-url-value] [data-select-url-text] [data-select-callback] [data-select-editable]
            this.mapkeyArray(domSelector); // data-mapkey-array
            this.mapkeyAsUrl(domSelector); // data-mapkey-url
            this.mapkeyLang(domSelector); // data-mapkey-lang
            this.colorpicker(domSelector); // data-colorpicker
            this.binding(domSelector); // data-bind-target

            // For each module. 
        }
    },
    /**
     * Extracts modules from properties and returns them in array.
     * 
     * @param {type} selector the selector to search for modules.
     * @returns {Array} empty array or filled with the modules found as attributes inside the element.
     */
    extractModules: function(selector) {
        /**
         * Manage the attribute softaware-mdl-tab.<br/>
         * Every time only one module of this type must exists.
         * 
         * @param {Array} modules
         * @param {JQuery element} element
         * @returns {void}
         */
        this.tabsBootstrap = function(modules, element) {
            var tabsEnable = $(element).attr("softaware-mdl-tab");

            // Validate tabs found.
            if (typeof tabsEnable === typeof undefined) {
                return;
            }

            // Add the module in the array.
            modules.push(new Softaware.Module.TabsBootstrap());
        };
        /**
         * Manage the attribute softaware-mdl-tinyMce.<br/>
         * Every time only one module of this type must exists.<br/>
         * System checks for textarea elements with attribute tinyMce-element
         * and creates a Softaware.Module.TextEdirorTinyMCE module for them.
         * 
         * @param {Array} modules
         * @param {JQuery element} element
         * @param {String} selector
         * @returns {void}
         */
        this.tinyMce = function(modules, element, selector) {
            //            var tinyMceEnable = $(element).attr("softaware-mdl-tinyMce");
            //
            //            // Validate tabs found.
            //            if (typeof tinyMceEnable === "undefined") {
            //                return;
            //            }

            // Get the textareas that will have tinyMce.
            var elements = $(element).find("textarea[tinyMce-element]");
            if (elements.length === 0) {
                return;
            }

            // Configure the selector in case of a class name.
            if (selector.startsWith(".")) {
                selector = selector.substring(1);
            }

            // For each one generate the id and add the module.
            for (var i = 0; i < elements.length; i++) {
                // Generate the id of the element.
                var name = $(elements[i]).attr("name");
                var idValue = "tinyMce-" + selector + "-" + name;
                $(elements[i]).attr("id", idValue);

                // Add the module.
                modules.push(new Softaware.Module.TextEdirorTinyMCE({
                    selector: idValue,
                    renderAttribute: name
                }));
            }
        };
        this.moduleMatcher = function(modules, selector) {
            if (typeof Softaware.Cache !== "undefined") {

                // TinyMceEditor Module.
                if (typeof Softaware.Cache.tinyMceEditor !== "undefined") {
                    for (var i = 0; i < Softaware.Cache.tinyMceEditor.length; i++) {
                        var module = Softaware.Cache.tinyMceEditor[i];
                        var element = $(selector).find("#" + module.domId);
                        if ($(element).length > 0) {
                            modules.push(module.module);
                        }
                    }
                }
            }
        };
        // Extract modules.
        {
            // Argument validation.
            if (typeof selector === "undefined" || $(selector).length === 0) {
                throw new Softaware.Exception.InvalidArgumentException("Not valid selector:" + selector);
            }

            // Vars.
            var modules = [];
            var element = $(selector);

            // DEPRECATED.
            {
                // Check for existance of modules.
                this.tabsBootstrap(modules, element); // softaware-mdl-tab
                this.tinyMce(modules, element, selector); // softaware-mdl-tinyMce
            }

            // New feature for extracting the modules.
            this.moduleMatcher(modules, selector);

            return modules;
        }
    }
};

/**
 * Package for storing modules.
 * @type type
 */
Softaware.Module = {};
/**
 * This method calls dynamiccaly a method of a module.
 * 
 * @param {type} moduleArray
 * @param {type} moduleType
 * @param {type} methodName
 * @param {type} param1
 * @param {type} param2
 * @param {type} param3
 * @returns {Array} the return values of each method called.
 */
Softaware.Module.callMethod = function(moduleArray, moduleType, methodName, param1, param2, param3) {
    if (typeof moduleArray === "undefined" || typeof moduleType === "undefined" || typeof methodName === "undefined") {
        throw new Softaware.Exception.InvalidArgumentException("moduleArray:" + moduleArray + ", methodName:" + methodName + ", event:" + methodName);
    }
    // Call the method for the object or Array.
    var buffer = [];
    for (var i = 0; i < moduleArray.length; i++) {
        var module = moduleArray[i];
        if (module instanceof moduleType.classRef) {
            buffer.push(module[methodName](param1, param2, param3));
        }
    }
    return buffer;
};
Softaware.Module.Notification = function(configurationSettings) {
    /* global PNotify */
    this.settings = {
        selectorBlock: ".alert.alert-danger",
        selectorMessage: ".alert.alert-danger span",
        visibleTime: 4500,
        defaultTitle: {
            successGR: "Επιτυχία",
            successEN: "Success",
            infoGR: "Πληροφορία",
            infoEN: "Information",
            errorGR: "Πρόβλημα",
            errorEN: "Error",
            darkGR: "Προσοχή",
            darkEN: "Warning"
        },
        defaultMessages: {
            successGR: "Η ενέργεια ολοκληρώθηκε με επιτυχία.",
            successEN: "This action completed successfully.",
            infoGR: "",
            infoEN: "",
            errorGR: "Προέκυψε ενα πρόβλημα. Παρακαλώ ανανεώστε τη σελίδα και προσπαθήστε ξανα.",
            errorEN: "A problem occured. Please, refresh the page and try again.",
            darkGR: "",
            darkEN: ""
        }
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.showPkNotification = function(type, message, title) {

        if (typeof(PNotify) !== "function") {
            throw new Error("You didn't include PNotify library.");
        }
        // Defaults.
        type = type ? type : "error"; // Valid values: success info error dark
        message = message ? message : this.settings.defaultMessages[type + Softaware.Model.language];
        title = title ? title : this.settings.defaultTitle[type + Softaware.Model.language];

        // Show the notification.
        new PNotify({
            title: title,
            text: message,
            type: type,
            nonblock: {
                nonblock: true,
                nonblock_opacity: .2
            }
        });
    };
    this.showModalNotification = function(selector, message) {
        // Get the message.
        message = message ? message : this.settings.defaultMessages["error" + Softaware.Model.language];

        // Show the notification.
        var $alertBlock = $(selector + " " + this.settings.selectorBlock);
        var $alertMessage = $(selector + " " + this.settings.selectorMessage);
        $alertMessage.html(message);
        $alertBlock
            .show()
            .fadeOut(this.settings.visibleTime);
    };
    // Constructor.
    {
        this.setSettings(configurationSettings);
    }
};
Softaware.Module.TabsBootstrap = function(configurationSettings) {
    this.settings = {
        blockSelector: "body",
        headerSelector: ".tab-header",
        contentSelector: ".tab-content"
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.refresh = function(blockSelector, headerSelector, contentSelector) {
        blockSelector = blockSelector ? blockSelector : this.settings.blockSelector;
        headerSelector = headerSelector ? headerSelector : this.settings.headerSelector;
        contentSelector = contentSelector ? contentSelector : this.settings.contentSelector;

        // nav nav-tabs remove active tabs.
        $(blockSelector + " " + headerSelector + " li").each(function() {
            $(this).removeClass("active");
        });
        $(blockSelector + " " + contentSelector).children().each(function() {
            $(this).removeClass("active");
        });

        $(blockSelector + " " + headerSelector + " li:first").addClass("active");
        $(blockSelector + " " + contentSelector + " div:first").addClass("active");
    };
    // Constructor.
    {
        this.setSettings(configurationSettings);
    }
};
Softaware.Module.MapGoogle = function(configurationSettings) {
    this.map = null;
    this.settings = {
        blockSelector: "google-map",
        centerLat: "",
        centerLng: "",
        zoom: 8,
        findLocation: {
            buttonSelector: null, // REQUIRED
            addressNameInputSelector: null,
            addressNoInputSelector: null,
            countryValue: null,
            postalInputSelector: null
        },
        onLocationByAddressSuccess: function(lat, lon) {
            console.log("GoogleMapView:onLocationByAddressSuccess -> Not overrided.");
        },
        onAddressByLocationSuccess: function(lat, lon) {
            console.log("GoogleMapView:onAddressByLocationSuccess -> Not overrided.");
        },
        onMapClick: function(self, map, lat, lon) {}
    };
    this.map = null;
    this.markerArray = new Array();
    this.setSettings = function(settings) {
        this.settings = $.extend(true, {}, this.settings, settings);
    };
    this.addMarker = function(lat, lon, title) {
        if (typeof(google) === "undefined") {
            throw "You have to include the google library.";
        }
        if (typeof(lat) === "undefined" || typeof(lon) === "undefined") {
            console.log("GoogleMapView:addMarker -> No lat/lng defined.");
            return false;
        }
        title = title ? title : "";

        var location = new google.maps.LatLng(lat, lon);
        var marker = new google.maps.Marker({
            position: location,
            map: this.map,
            title: title
        });
        this.markerArray.push(marker);
    };
    this.clearMarkers = function() {
        if (!this.map || typeof(this.map) === "undefined" || this.map === null) {
            console.log("GoogleMapView:reload -> No map defined.");
            return false;
        }

        // Clear markers.
        for (var i = 0; i < this.markerArray.length; i++) {
            this.markerArray[i].setMap(null);
        }
        this.markerArray = new Array();
    };
    this.findLocationByAddress = function(address) {
        if (typeof(address) === "undefined") {
            console.log("GoogleMapView:findLocationByAddress -> No address defined.");
            return false;
        }
        var self = this;

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': address
        }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var location = results[0].geometry.location;
                if (typeof(location) === "undefined") {
                    console.log("Location object not defined from geocoder correctly.");
                }
                var lat = location.lat();
                var lon = location.lng();
                if (typeof(lat) === "undefined" || typeof(lon) === "undefined") {
                    console.log("Location's lat and lon objects not defined from geocoder correctly.");
                }

                self.settings.onLocationByAddressSuccess(lat, lon);
            } else {
                console.log("GoogleMapView:findLocationByAddress -> Geocode was not successful for the following reason: " + status);
            }
        });
    };
    this.findAddressByLocation = function(lat, lng) {
        if (typeof(lat) === "undefined" || typeof(lng) === "undefined") {
            console.log("GoogleMapView:addMarker -> No lat/lng defined.");
            return false;
        }
        var self = this;

        var location = new google.maps.LatLng(lat, lng);
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'latLng': location
        }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    var location = results[1].formatted_address;
                    if (typeof(location) === "undefined") {
                        console.log("Location object not defined from geocoder correctly.");
                    }
                    var lat = location.lat();
                    var lon = location.lon();
                    if (typeof(lat) === "undefined" || typeof(lon) === "undefined") {
                        console.log("Location's lat and lon objects not defined from geocoder correctly.");
                    }

                    self.settings.onAddressByLocationSuccess(lat, lon);
                } else {
                    console.log("GoogleMapView:findAddressByLocation -> No results found");
                }
            } else {
                console.log("GoogleMapView:findAddressByLocation -> Geocode was not successful for the following reason: " + status);
            }
        });
    };
    this.setZoom = function(zoomValue) {
        if (typeof(zoomValue) === "undefined") {
            console.log("GoogleMapView:setZoom -> No zoomValue defined.");
            return false;
        }

        this.map.setZoom(zoomValue);
        this.settings.zoom = zoomValue;
    };
    this.setCenterWithLocation = function(lat, lon) {
        if (typeof(lat) === "undefined" || typeof(lon) === "undefined") {
            console.log("GoogleMapView:setCenter -> No location defined.");
            return false;
        }

        var location = new google.maps.LatLng(lat, lon);
        this.map.setCenter(location);
        this.settings.center = location;
    };
    this.setCenterWithLatLng = function(lat, lng) {
        if (typeof(lat) === "undefined" || typeof(lng) === "undefined") {
            console.log("GoogleMapView:setCenter -> No lat/lng defined.");
            return false;
        }

        var center = new google.maps.LatLng(lat, lng);
        this.map.setCenter(center);
        this.settings.center = center;
    };
    this.refresh = function() {
        // Redraw the map.
        var zoom = this.map.getZoom();
        var center = this.map.getCenter();
        google.maps.event.trigger(this.map, "resize");
        this.map.setZoom(zoom);
        this.map.setCenter(center);
    };
    // Constructor
    {
        if (typeof(google) === "undefined" || typeof(google.maps) === "undefined") {
            throw "Google Maps Library is not included!";
        }
        // Add settings.
        var self = this;
        this.setSettings(configurationSettings);

        // Initialize the map.
        var center = new google.maps.LatLng(this.settings.centerLat, this.settings.centerLng);
        var mapOptions = {
            center: center,
            zoom: this.settings.zoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var block = $(this.settings.blockSelector);
        if (block.length > 0) {
            this.map = new google.maps.Map(block[0], mapOptions);
        } else {
            console.log("Softaware.Module.MapGoogle: blockSelector not found.");
        }

        // Check if button to find address is enable.
        if (typeof(this.settings.findLocation) !== "undefined" && this.settings.findLocation !== null &&
            typeof(this.settings.findLocation.buttonSelector) !== "undefined") {
            $(this.settings.findLocation.buttonSelector).on("click", function() {
                // Initialization.
                var searchArray = new Array();
                var settings = self.settings.findLocation;

                // Get values.
                searchArray[0] = settings.addressNameValue ? settings.addressNameValue :
                    settings.addressNameInputSelector ? $(settings.addressNameInputSelector).val() : "";
                searchArray[1] = settings.addressNoValue ? settings.addressNoValue :
                    settings.addressNoInputSelector ? $(settings.addressNoInputSelector).val() : "";
                searchArray[2] = settings.cityValue ? settings.cityValue :
                    settings.cityInputSelector ? $(settings.cityInputSelector).val() : "";
                searchArray[3] = settings.countryValue ? settings.countryValue :
                    settings.countryInputSelector ? $(settings.countryInputSelector).val() : "";
                searchArray[4] = settings.postalValue ? settings.postalValue :
                    settings.postalInputSelector ? $(settings.postalInputSelector).val() : "";

                // Construct search string.
                var address = "";
                for (var i = 0; i < searchArray.length; i++) {
                    if (typeof(searchArray[i]) !== "undefined" && searchArray[i].length > 0) {
                        address += searchArray[i] + ", ";
                    }
                }
                if (!address) {
                    return;
                }
                address = address.substring(0, address.length - 2);

                // Find it.
                self.findLocationByAddress(address);
            });
        }

        // Add on click event.
        google.maps.event.addListener(this.map, "click", function(event) {
            var location = event.latLng;
            if (typeof(location) === "undefined") {
                console.log("Location object not defined on map click correctly.");
            }
            var lat = location.lat();
            var lon = location.lng();
            if (typeof(lat) === "undefined" || typeof(lon) === "undefined") {
                console.log("Location's lat and lon objects not defined on map click correctly.");
            }

            self.settings.onMapClick(self, self.map, lat, lon);
        });
    }
};
//=> Deprecated - Replaces with autoConfiguration method.
Softaware.Module.AutoCompleteTypeHaid = function(configurationSettings) {
    this.settings = {
        /**
         * The selector for the input text.
         */
        selector: "",
        /**
         * Required field (or models). The url to fetch the models.
         */
        fetchUrl: null,
        /**
         * Required field (or fetchUrl). The models to use.
         */
        models: [],
        /**
         * Required field (or valueFromFunction). The attribute to use from the mosel.
         */
        valueFromModelAttribute: null,
        /**
         * Required field (or valueFromModelAttribute). The function to fetch the correct value to show.
         * 
         * @param {Object} model The current model to check if it will be selected or not.
         */
        valueFromFunction: function(model) {
            return "Not Set";
        },
        typeAhaidOptions: {
            hint: true,
            highlight: true,
            minLength: 1
        },
        onInitializeFinish: function(self) {},
        onAfterOptionSelection: function(event, typeAhaidObj, self) {}
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.initiliaze = function(models) {
        if (!models) {
            throw new Softaware.Exception.InvalidArgumentException("Models has not a valid value. models:" + models);
        }
        var self = this;
        // Get the correct data array.
        self.settings.models = models;

        // Initilize the auto complete combobox.
        $(self.settings.selector).typeahead(self.settings.typeAhaidOptions, { //=> BUG - self is not defined, i am not sure if this is working when multiple DIFFERENT object are created.
            displayKey: "result",
            source: self.matchFunction
        });
        $(self.settings.selector).on("typeahead:selected", function(event) {
            self.settings.onAfterOptionSelection(event, this, self);
        });

        //=> EVENT
        self.settings.onInitializeFinish(self);
    };
    this.matchFunction = function(q, cb) {
        // An array that will be populated with substring matches
        var matches = [];

        // Regex used to determine if a string contains the substring `q`
        var regex = new RegExp(q.replace("(", "\\(").replace(")", "\\)"), 'i');

        // Iterate through the pool of strings and for any string that contains the substring `q`, add it to the `matches` array
        var value;
        $.each(self.settings.models, function(i, model) {
            value = self.modelToValue(model);
            if (regex.test(value)) {
                // The typeahead jQuery Module expects suggestions to a JavaScript object, refer to typeahead docs for more info
                matches.push({
                    result: value
                });
            }
        });

        cb(matches);
    };
    this.modelToValue = function(model) {
        if (!model) {
            throw new Softaware.Exception.InvalidArgumentException("Model has not a valid value. model:" + model);
        }

        // Return the correct value.
        if (this.settings.valueFromModelAttribute !== null) {
            return model[this.settings.valueFromModelAttribute];
        } else if (typeof(this.settings.valueFromFunction) === "function") {
            return this.settings.valueFromFunction(model);
        } else {
            throw new Softaware.Exception.IllegalStateException("You have to set the param valueFromModelAttribute OR valueFromFunction in settings.");
        }
    };
    this.createModel = function(model) {
        if (!model) {
            throw new Softaware.Exception.InvalidArgumentException("Model has not a valid value. model:" + model);
        }

        // Check if this value allready exists.
        for (var i = 0; i < this.settings.models.length; i++) {
            if (this.modelToValue(this.settings.models[i]) === this.modelToValue(model)) {
                return;
            }
        }

        // Add it.
        this.settings.models.push(model);
    };
    // Constructor.
    {
        if (typeof($.fn.typeahead) !== "function") {
            throw "typeahead library is missing.";
        }
        // Add settings.
        var self = this;
        this.setSettings(configurationSettings);

        // Fetch data if a url has been givven or initize just with the collection givven.
        if (self.settings.fetchUrl) {
            $.getJSON(self.settings.fetchUrl, function(models) {
                self.initiliaze(models);
            });
        } else if (self.settings.models) {
            self.initiliaze(self.settings.models);
        } else {
            throw new Softaware.Exception.IllegalStateException("You have to set the param fetchUrl OR models in settings.");
        }
    }
};
Softaware.Module.TextEdirorTinyMCE = function(configurationSettings) {
    this.settings = {
        width: "100%",
        heigth: 200,
        selector: "textarea", // It must be a class. Just the name - without dot. \\=>DEPRECATED
        renderAttribute: "",
        config: {
            selector: "textarea",
            theme: "modern", // advanced
            width: "100%",
            height: 200,
            plugins: [
                "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
                "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                "save table contextmenu directionality emoticons template paste textcolor"
            ],
            toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link transferimage image | preview media fullpage | forecolor backcolor | fontsizeselect",
            extended_valid_elements: "iframe[src|frameborder|style|scrolling|class|width|height|name|align]",
            style_formats: [{
                    title: "Header 1",
                    block: "h1",
                    styles: {}
                },
                {
                    title: "Header 2",
                    block: "h2",
                    styles: {}
                },
                {
                    title: "Header 3",
                    block: "h3",
                    styles: {}
                },
                {
                    title: "Header 4",
                    block: "h4",
                    styles: {}
                }
            ],
            relative_urls: false, // Produce different results for it's URLs in images and links.
            remove_script_host: false,
            entity_encoding: "raw",

            mode: "textareas",
            force_br_newlines: true,
            force_p_newlines: false,
            forced_root_block: ""
        }
    };
    this.current = null;
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.initialize = function() {
        if (typeof(tinymce) === "undefined") {
            throw "You have to include the tinyMce library.";
        }
        // Initialize the instance.
        this.current = new tinymce.Editor(this.settings.selector, $.extend({}, this.settings.config, {
            width: this.settings.width,
            heigth: "500px" //this.settings.heigth
        }), tinymce.EditorManager);


        /**
         * @param {type} event The jQuery event.
         * this workaround makes magic happen
         * thanks @harry: http://stackoverflow.com/questions/18111582/tinymce-4-links-plugin-modal-in-not-editable
         */
        $(document).on('focusin', function(event) {
            if ($(event.target).closest(".mce-window").length) {
                event.stopImmediatePropagation();
            }
        });

        this.render();
    };
    this.clear = function() {
        if (this.current === null) {
            console.log("instance not constructed.");
            return;
        }

        this.current.setContent("");
    };
    this.saveToTextarea = function() {
        if (this.current === null) {
            console.log("instance not constructed.");
            return;
        }

        this.current.save();
    };
    this.setContent = function(data) {
        if (this.current === null) {
            console.log("instance not constructed.");
            return;
        }

        if (data && data[this.settings.renderAttribute]) {
            this.current.setContent(data[this.settings.renderAttribute] || "");
        }
    };
    this.render = function() {
        if (this.current === null) {
            console.log("instance not constructed.");
            return;
        }

        this.current.render();
    };
    //Constructor
    {
        // Init.
        this.setSettings(configurationSettings);
        this.initialize();
    }
};
Softaware.Module.BadgesBootstrap = function(configurationSettings) {
    this.settings = null;
    this.buffer = [];
    this.getSettings = function() {
        if (!this.settings) {
            // STANDARD SETTINGS.
            this.settings = {
                selector: "#badgeList-container",
                // Load data on init.
                modelIdSelectedArray: [],
                modelIdAttibute: "id",
                modelTitleAttibute: "title",
                modelDataAttibute: "data",
                // Styling.
                buttonCss: "btn btn-primary btn-xs",
                buttonStyle: "display:inline-block; margin:2px;",
                closeSignCss: "remove glyphicon glyphicon-remove-sign glyphicon-white",
                // Events.
                beforeDomConstructionAdd: function(current, id, title, data) {},
                afterDomConstruction: function(plugin) {},
                beforeAdd: function(id, title, data) {},
                beforeRemove: function(model) {}
            };
        }
        return this.settings;
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.initialize = function() {
        var self = this;
        // Create the DOM objects.
        this.domConstruction();

        // Add the event.
        $(this.settings.selector).on("click", "button i", function(event) {
            self.removeBadge($(this).parent().attr("id"));
        });
    };
    this.domConstruction = function() { // Not tested.
        // pointers/variables.
        var modelIdSelectedArray = this.settings.modelIdSelectedArray;
        var id = this.settings.modelIdAttibute;
        var title = this.settings.modelTitleAttibute;
        var data = this.settings.modelDataAttibute;
        var current;

        // For each selected id add a button.
        for (var i = 0; i < modelIdSelectedArray.length; i++) {
            current = modelIdSelectedArray[i];

            //=> Before add event.
            this.settings.beforeDomConstructionAdd(current, id, title, data);

            // Create the badge.
            this.addBadge(current[id], current[title], current[data]);
        }
        this.settings.afterDomConstruction(this);
    };
    this.clear = function() {
        // Clear dom.
        $(this.settings.selector).empty();

        // Clear buffer.
        this.buffer = [];
    };
    this.getBadgeSource = function(id, title) {
        return "<button id='badgeListPlugin-" + id + "' class='" + this.settings.buttonCss + "' type='button' style='" + this.settings.buttonStyle + "'>" +
            title + " <i class='" + this.settings.closeSignCss + "'></i></button>";
    };
    this.isModelExisting = function(id) {
        var isExisting = false;
        for (var i = 0; i < this.buffer.length; i++) {
            if (this.buffer[i].id === id) { // == to === 27-05-2016
                isExisting = true;
            }
        }
        return isExisting;
    };
    this.addBadge = function(id, title, data) {
        data = data || {};

        // Check if this button is exeisting.
        if (this.isModelExisting(id)) {
            console.log("This id already existing.");
            return;
        }

        //=> Before add event.
        this.settings.beforeAdd(id, title, data);

        // Create the button.
        var $button = $(this.getBadgeSource(id, title));

        // Append it to the DOM container.
        $(this.settings.selector).append($button);

        // Append it to the buffer.
        this.buffer.push({
            "id": id,
            "title": title,
            "data": data
        });

        return true;
    };
    this.removeBadge = function(domId) {
        // Get the jQuery item.
        var $item = $(this.settings.selector + " #" + domId);

        // Is this id existing.
        var id = domId.substring(domId.lastIndexOf("-") + 1);
        if (!this.isModelExisting(id)) {
            console.log("This id is not existing.");
            return;
        }

        // Find the item.
        var model = {};
        for (var i = 0; i < this.buffer.length; i++) {
            if (this.buffer[i].id === id) { // == to === 27-05-2016
                model = this.buffer[i];
            }
        }

        //=> Before remove event.
        this.settings.beforeRemove(model);

        // Remove it from DOM.
        $item.remove();

        // Remove it from the buffer.
        for (var i = 0; i < this.buffer.length; i++) {
            if (this.buffer[i].id === id) { // == to === 27-05-2016
                this.buffer.splice(i, 1);
            }
        }
    };
    // Constructor
    {
        this.setSettings(configurationSettings);
        this.initialize();
    }
};
Softaware.Module.AuthorizationUseCaseButton = function(configurationSettings) {
    this.authorityJson = {
        "useCaseCategory": {
            "title": "The main category title",
            "authorityArray": [{
                "id": "",
                "authority": "R|C|U|D|Down|Up",
                "tooltip": "A tooltip for this authority."
            }]
        }
    };
    this.settings = {
        selector: "#authorizationUseCase-List",
        fetchUrl: "",
        dataArray: [], // Array with json values containing key and description attributes. One for each existing use case. {id:"", key:"", description:""}
        authorityNameArray: [], // Array with json values containing key and title attributes. One for each use case category. {key:"", title:""}
        checkBoxName: "useCaseList",
        idAttribute: "id",
        keyAttribute: "key",
        descriptionAttribute: "description",
        nameAttribute: "name",
        authorityText: {
            "GR": {
                "R": {
                    "value": "R",
                    "name": "Προβολή"
                },
                "C": {
                    "value": "C",
                    "name": "Δημιουργία"
                },
                "U": {
                    "value": "U",
                    "name": "Επεξεργασία"
                },
                "D": {
                    "value": "D",
                    "name": "Διαγραφή"
                },
                "Down": {
                    "value": "Down",
                    "name": "Κατέβασμα"
                },
                "Up": {
                    "value": "Up",
                    "name": "Ανέβασμα"
                }
            },
            "EN": {
                "R": {
                    "value": "R",
                    "name": "Read"
                },
                "C": {
                    "value": "C",
                    "name": "Create"
                },
                "U": {
                    "value": "U",
                    "name": "Update"
                },
                "D": {
                    "value": "D",
                    "name": "Delete"
                },
                "Down": {
                    "value": "Down",
                    "name": "Download"
                },
                "Up": {
                    "value": "Up",
                    "name": "Upload"
                }
            }
        }
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.initializeAuthorityJson = function(dataArray) {
        if (typeof(dataArray) === "undefined" || typeof(this.settings.authorityNameArray) === "undefined") {
            console.log("AuthorizationUseCaseButtonView:initializeDOM -> no dataArray/authorityNameArray defined.");
            return;
        }
        var authorityCached = this.settings.authorityText[Softaware.Model.language];

        // Create the authorityJson. Initialize it to make it sorted as the authorityNameArray.
        this.authorityJson = {};
        for (var i = 0; i < this.settings.authorityNameArray.length; i++) {
            this.authorityJson[this.settings.authorityNameArray[i].key] = {
                "title": this.settings.authorityNameArray[i].title,
                "authorityArray": []
            };
        }

        var useCase;
        for (var i = 0; i < dataArray.length; i++) {
            useCase = dataArray[i];

            // Get the key value of this object.
            if (!useCase[this.settings.keyAttribute] || useCase[this.settings.keyAttribute].split("_").length < 2) {
                console.log("AuthorizationUseCaseButtonView:initializeDOM -> an object on the array was not including the key attribute.");
                continue;
            }

            // Get the key and the authority.
            var lastIndex = useCase[this.settings.keyAttribute].lastIndexOf("_");
            var categoryKey = useCase[this.settings.keyAttribute].substring(0, lastIndex);
            var authority = useCase[this.settings.keyAttribute].substring(lastIndex + 1);

            // Check if the authority is a valid one.
            if (!authorityCached[authority]) {
                console.log("AuthorizationUseCaseButtonView:initializeDOM -> an object on the array was not having a valid authority.");
                continue;
            }

            // Get the category title.
            var categoryTitle = "";
            $.each(this.settings.authorityNameArray, function(key, useCaseCategory) {
                if (useCaseCategory.key === categoryKey) {
                    categoryTitle = useCaseCategory.title;
                }
            });
            if (!categoryTitle) {
                console.log("AuthorizationUseCaseButtonView:initializeDOM -> category title not found on the authorityNameArray setting.");
                continue;
            }

            // Check if this authority is a new one.
            if (this.authorityJson[categoryKey]) {
                this.authorityJson[categoryKey].authorityArray.push({
                    "id": useCase[this.settings.idAttribute] ? useCase[this.settings.idAttribute] : "-1",
                    "authority": authority,
                    "tooltip": useCase[this.settings.descriptionAttribute] ? useCase[this.settings.descriptionAttribute] : ""
                });
            } else {
                this.authorityJson[categoryKey] = {
                    "title": categoryTitle,
                    "authorityArray": [{
                        "id": useCase[this.settings.idAttribute] ? useCase[this.settings.idAttribute] : "-1",
                        "authority": authority,
                        "tooltip": useCase[this.settings.descriptionAttribute] ? useCase[this.settings.descriptionAttribute] : ""
                    }]
                };
            }
        }

        // Initialize on DOM.
        this.initializeDomButtons();
    };
    this.initializeDomButtons = function() {
        var authorityCached = this.settings.authorityText[Softaware.Model.language];

        // Get and check the container.
        var $container = $(this.settings.selector);
        if ($container.length === 0) {
            console.log("AuthorizationUseCaseButtonView:initializeDOM -> not valid selector.");
            return;
        }

        // Initialize the buttons.
        for (var i in this.authorityJson) {
            var category = this.authorityJson[i];
            // Add the tittle.
            var $innerContainer = $("<div class='btn-group col-lg-12' data-toggle='buttons'></div>");

            // Check all the array of authorities and manage the ones that this authority includes. On this way i insert them sorted.
            for (var j in authorityCached) {
                var currentAuthority = authorityCached[j];
                // Find if the current authority exists on the category->authorityArray.
                for (var i = 0; i < category.authorityArray.length; i++) {
                    // Is this authority existing.
                    if (category.authorityArray[i].authority === currentAuthority.value) {
                        var checkbox = '<label class="btn btn-default col-lg-3">' +
                            '<input type="checkbox" name="' + self.settings.checkBoxName + '" value="' + category.authorityArray[i].id + '"/>' +
                            currentAuthority.name +
                            '</label>';
                        $innerContainer.append(checkbox);
                    }
                }
            }

            // Append this container to container.
            var currentCategoryBlock = $("<div class='form-group col-lg-12'></div>");
            currentCategoryBlock.append("<label>" + category.title + "</label>");
            currentCategoryBlock.append($innerContainer);

            $container.append(currentCategoryBlock);
        }
    };
    this.clear = function() {
        //            $(this.settings.selector).find("input[type='checkbox'] .active").each(function() {
        //                $(this).click();
        //            });
    };
    this.render = function(dataArray) {
        var self = this;

        // Clear selections.

        // Click the correct use cases.
        $.each(dataArray[this.settings.checkBoxName], function(key, useCase) {
            $(self.settings.selector + " input[type='checkbox'][value='" + useCase[self.settings.idAttribute] + "']").closest("label").click();
        });
    };
    this.convertToArrayOfObjects = function(data) {
        if (typeof(data) === "undefined") {
            console.log("AuthorizationUseCaseButtonView:convertToArrayOfObjects: undefined data.");
            return;
        }
    };
    // Constructor.
    {
        // Add settings.
        var self = this;
        this.setSettings(configurationSettings);

        // Fetch data if not givven.
        if (this.settings.fetchUrl) {
            $.getJSON(this.settings.fetchUrl, function(dataArray) {
                self.initializeAuthorityJson(dataArray);
            });
        } else if (this.settings.dataArray) {
            self.initializeAuthorityJson(this.settings.dataArray);
        } else {
            console.log("AuthorizationUseCaseButtonView:Constructor -> No fetch url and dataArray given. I will not be initialize and i will die.");
        }
    }
};
Softaware.Module.CreateMultipleWithBlocks = function(configurationSettings) {
    this.counter = 0;
    this.settings = {
        triggerBtn: "",
        ulSelector: "",
        templateSelector: "",
        modelClass: null,
        maxItemsAllowed: 9999999,
        maxItemsAllowedAlertMsg: "",
        defaultMessage: {
            maxItemsAlertGR: "Δεν μπορείτε να προσθέσετε άλλη πληροφορία.",
            maxItemsAlertEN: "Maximum Items Reached."
        },
        onAfterCreateBlock: function(self) {},
        onDeleteBlockBefore: function(itemDom) {},
        onAfterDeleteBlock: function(itemDom) {}
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.initialize = function() {
        var self = this;
        self.counter = 0;

        // Add block action.
        $(self.settings.triggerBtn).on("click", function(event) {
            event.stopPropagation();
            self.createBlock(event);
            return false;
        });
        // Delete block action.
        $(self.settings.ulSelector).on("click", "button", function(event) {
            event.stopPropagation();
            self.deleteBlock(event);
            return false;
        });
    };
    this.createBlock = function(event) {
        var self = this;

        // Check if list is full.
        if (self.counter >= self.settings.maxItemsAllowed) {
            var message = self.settings.maxItemsAllowedAlertMsg ? self.settings.maxItemsAllowedAlertMsg : self.settings.defaultMessage["maxItemsAlert" + Softaware.Model.language];
            new Softaware.Modal.PopUp().info({
                message: message
            });
            return;
        }

        //=> ADD ITEM
        var html = $(self.settings.templateSelector).html();
        $(self.settings.ulSelector).append(html);
        // Check if there are any tooltips.
        if (typeof($.fn.tooltip) === "function") {
            $(self.settings.ulSelector + " [data-toggle='tooltip']").tooltip();
        }

        self.settings.onAfterCreateBlock(self);
    };
    this.deleteBlock = function(event) {
        if (!event) {
            throw new Softaware.Exception.InvalidArgumentException("No event defined.");
        }

        // Find the element.
        var self = this;
        var element = event.currentTarget;
        $(element).closest("li");
        var itemDom = $(element).closest("li");

        self.settings.onDeleteBlockBefore(itemDom, element);

        itemDom.remove();

        self.settings.onAfterDeleteBlock(itemDom, element);
    };
    this.clear = function() {
        //  Initialize the list when the block is opening.
        $(this.settings.ulSelector).empty();
        this.counter = 0;
    };
    this.validate = function() {
        var validation = new this.settings.modelClass().validation;
        if (validation) {
            var isValid = true;
            var validation = $.extend({}, Softaware.ValidationStyle.jQueryPopover, validation);
            var $li = $(this.settings.ulSelector + ">li");
            for (var i = 0; i < $li.length; i++) {
                // Get the form fields of this li.
                var fields = [];
                fields = fields.concat($($li[i]).find("input").toArray());
                fields = fields.concat($($li[i]).find("select").toArray());
                fields = fields.concat($($li[i]).find("textarea").toArray());
                // Get the preprended name.
                var formFieldsPrependName = $(fields[0]).attr("name");
                formFieldsPrependName = formFieldsPrependName.substring(0, formFieldsPrependName.lastIndexOf("."));
                // Rename all the form fields.
                for (var j = 0; j < fields.length; j++) {
                    var fieldName = $(fields[j]).attr("name");
                    $(fields[j]).attr("name", fieldName.substring(fieldName.lastIndexOf(".") + 1));
                }
                // Wrap li contents inside a form.
                $($li[i]).wrap("<form></form>");
                // Validate the form.
                var formValidator = $($li[i]).closest("form").validate(validation);
                if (!formValidator.form()) {
                    isValid = false;
                }
                // Reset by unwrapping the form and rename the fields.
                $($li[i]).unwrap();
                // Rename all the form fields again.
                for (var j = 0; j < fields.length; j++) {
                    var fieldName = $(fields[j]).attr("name");
                    $(fields[j]).attr("name", formFieldsPrependName + "." + fieldName);
                }
            }
            return isValid;
        } else {
            console.log("The domain " + this.settings.modelClass + " is not using validation.");
        }
        return true;
    };
    this.fieldNameToArray = function() {
        var counter = 0;
        // Loop the li elements.
        var $li = $(this.settings.ulSelector + ">li");
        for (var i = 0; i < $li.length; i++) {
            // Get the form fields of this li.
            var fields = $($li[i]).formFieldsToArray();
            // Get the preprended name.
            var formFieldsPrependName = $(fields[0]).attr("name");
            formFieldsPrependName = formFieldsPrependName.substring(0, formFieldsPrependName.lastIndexOf("."));
            // Rename all the form fields to array format.
            for (var j = 0; j < fields.length; j++) {
                $(fields[j]).removeBracketsInName();
                $(fields[j]).addBracketsInName(counter);
                //                var fieldNameAll = $(fields[j]).attr("name");
                //                var fieldName = fieldNameAll.substring(fieldNameAll.lastIndexOf(".") + 1);
                //                $(fields[j]).attr("name", formFieldsPrependName + "[" + counter + "]." + fieldName);
            }
            counter++;
        }
    };
    // Constructor.
    {
        this.setSettings(configurationSettings);
        this.initialize();
    }
};
Softaware.Module.TagsWithAutoFill = function(configurationSettings) {
    var self = this;
    this.tagContainer = null;
    this.settings = {
        /**
         * Required field. The selector for the input text.
         */
        selector: "",
        /**
         * Required field. The models to use. An array of JSON objects.
         */
        models: [],
        /**
         * Required field. Prepend value for the key,
         * ex "hashTags" -> sends hashTags:[{valueKey:""},{valueKey:""}] or hashTags[0].valueKey="", hashTags[1].valueKey=""
         */
        valueKeyRoot: null,
        /**
         * Required field. This value is used to fetch the preffered attributed from selected json objects.
         */
        valueKey: "id",
        /**
         * Required field. This value is used to fetch the preffered text to show, from selected json objects.
         */
        textKey: "title",
        /**
         * Classes for the container div class. For bootstrap project they may be "form-group col-lg-12"
         */
        containerClass: "",
        /**
         * Class for the input field class. For bootstrap project it may be "form-control"
         */
        inputClass: "",
        /**
         * In case you use only models, tags will be json objects which are selected from typeahaid models. In other case tags will be everything the user enters.
         */
        useTagFromModels: false
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.initialize = function() {
        // Initialize tagsinput with typeahaid.
        this.tagContainer = $(this.settings.selector);
        var useOnlyModelsConfig = {};
        if (this.settings.useTagFromModels) {
            useOnlyModelsConfig = {
                itemValue: this.settings.valueKey,
                itemText: this.settings.textKey
            };
        }
        this.tagContainer.tagsinput($.extend({}, useOnlyModelsConfig, {
            width: "auto",
            typeahead: $.extend({}, {
                hint: true,
                highlight: true,
                minLength: 1
            }, {
                source: this.matchFunction,
                displayKey: this.settings.textKey,
                afterSelect: function() {
                    // Clear the input so the user will have an empty input to write text into. In contrast to show the last tag entered.
                    this.$element[0].value = "";
                }
            })
        }));
        $(".bootstrap-tagsinput").addClass(this.settings.containerClass);
        $(".bootstrap-tagsinput > input").addClass(this.settings.inputClass);
    };
    this.matchFunction = function(query) {
        if (!query) {
            throw new Softaware.Exception.InvalidArgumentException("Not valid argument (query:" + query + ").");
        }
        // An array that will be populated with substring matches
        var matches = [];
        // Regex used to determine if a string contains the substring `q`
        var regex = new RegExp(query.replace("(", "\\(").replace(")", "\\)"), 'i');
        // Iterate through the pool of strings and for any string that contains the substring `q`, add it to the `matches` array
        $.each(self.settings.models, function(i, model) {
            if (regex.test(model[self.settings.textKey])) {
                // The typeahead jQuery Module expects suggestions to a JavaScript object, refer to typeahead docs for more info
                matches.push(self.settings.useTagFromModels ? model : model[self.settings.textKey]);
            }
        });
        return matches;
    };
    this.clear = function() {
        this.tagContainer.tagsinput("removeAll");
    };
    this.domToData = function(data) {
        if (!data || !(data instanceof Object)) {
            throw new Softaware.Exception.InvalidArgumentException("Not valid argument (data:" + data + ").");
        }
        // Init usefull variables.
        var inputName = $(this.settings.selector).attr("name");
        var keyRoot = this.settings.valueKeyRoot;
        var key = this.settings.valueKey;

        // In case of a multipart/form-data request.
        if (data instanceof FormData) {
            data.delete(inputName);
            var array = this.tagContainer.tagsinput("items");
            if (array.length === 0) {
                // Set a default value or make a check server side.
            }
            for (var i = 0; i < array.length; i++) {
                data.append(keyRoot + "[" + i + "]" + "." + key, (this.settings.useTagFromModels ? array[i][key] : array[i]));
            }
        }

        // In case of a non multipart/form-data request.
        if (!(data instanceof FormData)) {
            delete data[inputName];
            data[keyRoot] = [];
            var array = this.tagContainer.tagsinput("items");
            for (var i = 0; i < array.length; i++) {
                var model = {};
                model[key] = this.settings.useTagFromModels ? array[i][key] : array[i];
                data[keyRoot].push(model);
            }
        }
    };
    this.dataToDom = function(data) {
        if (!data || !(data instanceof Object) || !data[this.settings.valueKeyRoot]) {
            throw new Softaware.Exception.InvalidArgumentException("Argument is not valid. data:" + data);
        }
        if (!data[this.settings.valueKeyRoot]) {
            console.log("Not valid data, key=" + this.settings.valueKeyRoot + " is not existing. -> " + data);
            return;
        }
        var array = data[this.settings.valueKeyRoot];
        for (var i = 0; i < array.length; i++) {
            if (this.settings.useTagFromModels) {
                var model = this.settings.models.filter(function(model) {
                    if (model[self.settings.textKey] === array[i][self.settings.textKey])
                        return model;
                })[0];
                this.tagContainer.tagsinput("add", model);
            } else {
                this.tagContainer.tagsinput("add", array[i][self.settings.textKey]);
            }
        }
    };
    // Constructor.
    {
        if (typeof($.fn.typeahead) !== "function") {
            throw new Softaware.Exception.IllegalStateException("typeahead library is missing. Use https://cdnjs.cloudflare.com/ajax/libs/bootstrap-3-typeahead/4.0.2/bootstrap3-typeahead.js");
        }
        if (typeof($.fn.tagsinput) !== "function") {
            throw new Softaware.Exception.IllegalStateException("tagsinput library is missing. Use https://cdnjs.cloudflare.com/ajax/libs/bootstrap-tagsinput/0.8.0/bootstrap-tagsinput.min.js");
        }
        this.setSettings(configurationSettings);
        this.initialize();
    }
};
Softaware.Type.ModuleType = {
    Notification: {
        "name": "notification",
        classRef: Softaware.Module.Notification
    },
    TabsBootstrap: {
        "name": "TabsBootstrap",
        classRef: Softaware.Module.TabsBootstrap
    },
    MapGoogle: {
        "name": "googleMap",
        classRef: Softaware.Module.MapGoogle
    },
    AutoCompleteTypeHaid: {
        "name": "BadgesBootstrap",
        classRef: Softaware.Module.BadgesBootstrap
    },
    TextEdirorTinyMCE: {
        "name": "TextEdirorTinyMCE",
        classRef: Softaware.Module.TextEdirorTinyMCE
    },
    BadgesBootstrap: {
        "name": "BadgesBootstrap",
        classRef: Softaware.Module.BadgesBootstrap
    },
    CreateMultipleWithBlocks: {
        "name": "CreateMultipleWithBlocks",
        classRef: Softaware.Module.CreateMultipleWithBlocks
    },
    //        "imageSelectList": {"name": "imageSelectList"},
    //        "imageDisplaySimpleList": {"name": "imageDisplaySimpleList"},
    //        "checkBoxAsButtonList": {"name": "checkBoxAsButtonList"},
    AuthorizationUseCaseButton: {
        "name": "AuthorizationUseCaseButton",
        classRef: Softaware.Module.AuthorizationUseCaseButton
    },
    TagsWithAutoFill: {
        "name": "TagsWithAutoFill",
        classRef: Softaware.Module.TagsWithAutoFill
    }
};

Softaware.Form = {};
/**
 * Form to use when you wish to create a model with AJAX and JSON from a form.
 * @param {type} configurationSettings Settings for the form.
 * @returns {Softaware.Form.Create}
 */
Softaware.Form.Create = function(configurationSettings) {
    this.settings = {
        module: [],
        blockSelector: "body",
        csrfToken: (csrfToken || null),
        domainClass: null,
        createSelector: ".block-create-action",
        clearAfterSuccess: false,
        validation: {},
        onCreateStart: function(self) {},
        onValidationComplete: function(self, domain, domData, ajaxOptions, formValidator, isFormValid) {},
        onCreateRequestStart: function(self, domain, domData, ajaxOptions) {},
        onCreateSuccessStart: function(model, self, btn, domain) {},
        onCreateSuccessFinish: function(model, self, btn, domain) {},
        onCreateErrorStart: function(xhr, self, btn) {},
        onCreateErrorFinish: function(xhr, self, btn) {}
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.initialize = function() {
        var self = this;

        //==> INIT MODULES
        if (self.settings.module.length === 0) {
            self.settings.module = Softaware.Utilities.extractModules(self.settings.blockSelector);
        }

        //==> INIT EVENTS
        $(self.settings.blockSelector).on("click", self.settings.createSelector, function(event) {
            event.stopPropagation();
            try {
                self.create(event);
            } catch (e) {
                console.log(e);
            }
            return false;
        });
        // Module -> CreateMultipleWithBlocks clear.
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.CreateMultipleWithBlocks, "clear");
    };
    this.create = function(event) {
        if (!event) {
            throw new Softaware.Exception.InvalidArgumentException("event:" + event);
        }
        var self = this;
        var btn = $(event.currentTarget);
        self.settings.onCreateStart(this);
        // Module -> TextEdirorTinyMCE saveToTextarea.
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.TextEdirorTinyMCE, "saveToTextarea");
        var $form = $(self.settings.blockSelector + " form");

        //==> GET MODEL FROM FORM
        var domain = new self.settings.domainClass();
        // Module -> CreateMultipleWithBlocks fieldNameToArray.
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.CreateMultipleWithBlocks, "fieldNameToArray");
        var domData = Softaware.Utilities.formToData($form);
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.TagsWithAutoFill, "domToData", domData);
        if (!(domData instanceof FormData)) {
            domData = Softaware.Utilities.convertJsonAttributeToJsonOrArray(domData); // Solve the Jackson configuration problem for ACCEPT_SINGLE_VALUE_AS_ARRAY DeserializationFeature.
        }

        //==> VALIDATE DATA
        var ajaxOptions = {};
        var validation = Softaware.ValidationStyle.jQueryPopover;
        if (domain.validation) {
            validation = $.extend(true, {}, validation, domain.validation);
        }
        if (self.settings.validation) {
            validation = $.extend(true, {}, validation, {
                rules: self.settings.validation
            });
        }
        if (validation.rules) {
            var formValidator = $form.validate(validation);
            var isFormValid = formValidator.form();
            // Module -> CreateMultipleWithBlocks validate.
            var isMultipleBlocksValid = Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.CreateMultipleWithBlocks, "validate");
            // Check the validation results and complete.
            for (var i = 0; i < isMultipleBlocksValid.length; i++) {
                isFormValid = isFormValid && isMultipleBlocksValid[i];
            }
            // Complete validation.
            var customValidation = self.settings.onValidationComplete(self, domain, domData, ajaxOptions, formValidator, isFormValid);
            isFormValid = isFormValid && (typeof(customValidation) === "undefined" || customValidation);
            if (!isFormValid) {
                return false;
            }
        } else {
            console.log("The domain is not using validation.");
        }

        // Create the model.
        ajaxOptions.url = domain.rootUrl + (self.settings.csrfToken ? "?_csrf=" + self.settings.csrfToken : "");
        self.settings.onCreateRequestStart(self, domain, domData, ajaxOptions);
        btn.button("loading");
        domain.model = domData;
        Softaware.Service.create(domain, $.extend({}, ajaxOptions, {
            success: function(model, data, response) {
                //==> INSERT SUCCESS
                btn.button("reset");
                // Run the start event.
                self.settings.onCreateSuccessStart(model, self, btn, domain);

                if (model.errormessage) {
                    // Show the error and do not close the modal.
                    new Softaware.Module.Notification().showPkNotification("error", model.errormessage);
                } else {
                    if (self.settings.clearAfterSuccess) {
                        $form.resetForm();
                    }

                    new Softaware.Module.Notification().showPkNotification("success");
                }

                // Run the finalize event.
                self.settings.onCreateSuccessFinish(model, self, btn, domain);
            },
            error: function(xhr, status, error) {
                //==> UPDATE ERROR
                btn.button("reset");
                // Run the start event.
                self.settings.onCreateErrorStart(xhr, self, btn);

                // Show notification.
                if (xhr.responseJSON && xhr.responseJSON.errormessage) {
                    new Softaware.Module.Notification().showPkNotification("error", xhr.responseJSON.errormessage);
                } else {
                    new Softaware.Module.Notification().showPkNotification("error");
                }

                // Run the finalize event.
                self.settings.onCreateErrorFinish(xhr, self, btn);
            }
        }));
    };
    // Constructor.
    {
        this.setSettings(configurationSettings);
        this.initialize();
    }
};
/**
 * Form to use when you wish to load data and to be able update a model with AJAX and JSON from a form.
 * @param {type} configurationSettings Settings for the form.
 * @returns {Softaware.Form.Create}
 */
Softaware.Form.Update = function(configurationSettings) {
    this.currentDomain = null;
    this.settings = {
        module: [],
        blockSelector: "body",
        csrfToken: (csrfToken || null),
        domain: null, // The domain to use in case of not fetching data.
        domainClass: null, // The class of the model.
        updateSelector: ".block-update-action",
        fetchEnable: false,
        fetchUrl: null,
        clearAfterSuccess: false,
        renderOnStart: true,
        validation: {},
        onFetchBefore: function(self, ajaxOptions) {},
        onRenderStart: function(self) {},
        onRenderComplete: function(self) {},
        onUpdateStart: function(self) {},
        onValidationComplete: function(self, domain, domData, ajaxOptions, formValidator, isFormValid) {},
        onUpdateRequestStart: function(self, domain, domData, ajaxOptions) {},
        onUpdateSuccessStart: function(model, self, btn) {},
        onUpdateSuccessFinish: function(model, self, btn) {},
        onUpdateErrorStart: function(xhr, self, btn) {},
        onUpdateErrorFinish: function(xhr, self, btn) {}
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.initialize = function() {
        var self = this;
        var ajaxOptions = {};

        //==> INIT MODULES
        if (self.settings.module.length === 0) {
            self.settings.module = Softaware.Utilities.extractModules(self.settings.blockSelector);
        }

        //==> INIT EVENTS
        $(self.settings.blockSelector).on("click", self.settings.updateSelector, function(event) {
            event.stopPropagation();
            try {
                self.update(event);
            } catch (e) {
                console.log(e);
            }
            return false;
        });

        //==> Current Model.
        if (self.settings.fetchEnable) {
            // Fetch the data from REST.
            self.settings.onFetchBefore(self, ajaxOptions);
            self.currentDomain = new self.settings.domainClass();
            Softaware.Service.read(self.currentDomain, $.extend({}, ajaxOptions, {
                url: self.settings.fetchUrl,
                success: function(data) {
                    self.currentDomain.model = data;

                    //==> RENDER
                    self.render();

                },
                error: function(xhr, status, error) {
                    console.log("UpdateForm:render -> fetch model retured an error.");
                }
            }));
        } else {
            self.currentDomain = self.settings.domain;
            if (typeof(self.currentDomain) === "undefined" || self.currentDomain === null) {
                throw "UpdateForm:initialize -> The curModel is null.";
            }
            //==> RENDER
            self.render();
        }
    };
    this.update = function(event) {
        if (typeof(event) === "undefined" || event === null) {
            console.log("UpdateForm:update -> No event defined.");
            return false;
        }

        var self = this;
        var btn = $(event.currentTarget);
        self.settings.onUpdateStart(this);
        // Module -> tinyMCE saveToTextarea.
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.TextEdirorTinyMCE, "saveToTextarea");
        var $form = $(self.settings.blockSelector + " form");

        //==> GET MODEL FROM FORM
        var domain = new self.settings.domainClass();
        var domData = Softaware.Utilities.formToData($form);
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.TagsWithAutoFill, "domToData", domData);
        if (!(domData instanceof FormData)) {
            domData = Softaware.Utilities.convertJsonAttributeToJsonOrArray(domData); // Solve the Jackson configuration problem for ACCEPT_SINGLE_VALUE_AS_ARRAY DeserializationFeature.
        }

        //==> VALIDATE DATA
        var ajaxOptions = {};
        var validation = Softaware.ValidationStyle.jQueryPopover;
        if (domain.validation) {
            validation = $.extend(true, {}, validation, domain.validation);
        }
        if (self.settings.validation) {
            validation = $.extend(true, {}, validation, {
                rules: self.settings.validation
            });
        }
        if (validation.rules) {
            var formValidator = $form.validate(validation);
            var isFormValid = formValidator.form();
            // Complete validation.
            var customValidation = self.settings.onValidationComplete(self, domain, domData, ajaxOptions, formValidator, isFormValid);
            isFormValid = isFormValid && (typeof(customValidation) === "undefined" || customValidation);
            if (!isFormValid) {
                return false;
            }
        } else {
            console.log("The domain is not using validation.");
        }

        // Loading Bootstrap Animation.
        btn.button("loading");

        // Update the model.
        ajaxOptions.url = self.currentDomain.rootUrl + self.currentDomain.model[self.currentDomain.idAttribute] +
            (self.settings.csrfToken ? "?_csrf=" + self.settings.csrfToken : "");
        self.settings.onUpdateRequestStart(self, domain, domData, ajaxOptions);
        domain.model = domData;
        Softaware.Service.update(domain, $.extend({}, ajaxOptions, {
            success: function(model, data, response) {
                //==> UPDATE SUCCESS
                btn.button("reset");
                // Run the start event.
                self.settings.onUpdateSuccessStart(model, self, btn);

                if (model.errormessage) {
                    // Show the error and do not close the modal.
                    new Softaware.Module.Notification().showPkNotification("error", model.errormessage);
                } else {
                    if (self.settings.clearAfterSuccess) {
                        $form.resetForm();
                    }

                    self.currentDomain = domain;
                    new Softaware.Module.Notification().showPkNotification("success");
                }

                // Run the finalize event.
                self.settings.onUpdateSuccessFinish(model, self, btn);
            },
            error: function(xhr, status, error) {
                //==> UPDATE ERROR
                btn.button("reset");
                // Run the start event.
                self.settings.onUpdateErrorStart(xhr, self, btn);

                // Show notification.
                if (xhr.responseJSON && xhr.responseJSON.errormessage) {
                    new Softaware.Module.Notification().showPkNotification("error", xhr.responseJSON.errormessage);
                } else {
                    new Softaware.Module.Notification().showPkNotification("error");
                }

                // Run the finalize event.
                self.settings.onUpdateErrorFinish(xhr, self, btn);
            }
        }));
    };
    this.render = function() {
        var self = this;
        self.settings.onRenderStart(self);
        if (typeof self.currentDomain === "undefined") {
            console.log("UpdateForm:render -> No model provided.");
            return false;
        }

        Softaware.Utilities.dataToForm(self.currentDomain.model, $(self.settings.blockSelector + " form"));
        // Plugin -> CheckBoxAsButtonListView.
        //        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.checkBoxAsButtonList, "select", self.currentDomain);
        // Plugin -> ImageSelectListView.
        //        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.imageSelectList, "loadImages", self.currentDomain);
        // Module -> ImageSelectListView.
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.AuthorizationUseCaseButton, "render", self.currentDomain.model);
        // Module -> tinyMCE setContent.
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.TextEdirorTinyMCE, "setContent", self.currentDomain.model);

        self.settings.onRenderComplete(self);
    };
    // Constructor.
    {
        this.setSettings(configurationSettings);
        this.initialize();
    }
};
Softaware.Form.ReadToUrl = function(configurationSettings) {
    this.settings = {
        module: [],
        domain: null,
        displayAll: null,
        blockSelector: "body",
        triggerButtonSelector: ".form-readToUrl-open",
        url: "/",
        target: "_blank",
        // Events.
        beforeWindowOpen: function(domain, ajaxOptions) {}
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.initialize = function() {
        var self = this;

        //==> INIT EVENTS
        $(self.settings.blockSelector).on("click", self.settings.triggerButtonSelector + ":not(.disabled)", function(event) {
            event.stopPropagation();
            self.open();
            return false;
        });
    };
    this.open = function() {
        var self = this;

        //==> GET DATA FROM DISPLAY ALL VIEW
        if (self.settings.displayAll !== null) {
            self.settings.domain = self.settings.displayAll.getSelectedDomain();
            if (self.settings.domain === null) {
                console.log("ReadToUrlView:open -> No selected model.");
                new Softaware.Modal.PopUp().info({
                    message: self.settings.displayAll.getNoSelectionErrorMsg()
                });
                new ErrorModalView({
                    message: self.settings.displayAll.getNoSelectionErrorMsg()
                });
                return false;
            }
        }

        //==> Before window open event.
        var ajaxOptions = {};
        self.settings.beforeWindowOpen(self.settings.domain, ajaxOptions);
        this.setSettings(ajaxOptions);

        //==> OPEN WINDOW WITH URL
        window.open(Softaware.Utilities.textFromTemplate(self.settings.url, self.settings.domain === null ? {} : self.settings.domain.model), self.settings.target, "", false);
    };
    // Constructor.
    {
        this.setSettings(configurationSettings);
        this.initialize();
    }
};


Softaware.Modal = {};
/**
 * @param {type} configurationSettings Settings for the modal.
 * @returns {Softaware.Modal.CustomModal}
 */
Softaware.Modal.PopUp = function(configurationSettings) {
    this.settings = {
        title: {
            info: {
                GR: "Ουυπς!",
                EN: "Οοοps!"
            },
            confirm: {
                GR: "Επιβεβαίωση",
                EN: "Confirmation"
            }
        },
        modalOptions: {
            backdrop: "static"
        },
        sourceCode: {
            "info": {
                "bootstrap": '<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" id="softaware-infomodal">' +
                    '<div class="modal-dialog modal-md">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                    '<h4 class="modal-title">{title}</h4>' +
                    '</div>' +
                    '<div class="modal-body ">' +
                    '<div class="row">' +
                    '<div class="col-lg-12" data-name="content">{message}</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<div class="navbar-right">' +
                    '<button type="button" class="btn btn-default" data-dismiss="modal">ΟΚ</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
            },
            "confirm": {
                "bootstrap": '<div class="modal fade modal-confirm" tabindex="-1" role="dialog" aria-hidden="true">' +
                    '<div class="modal-dialog modal-md">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                    '<h4 class="modal-title">{title}</h4>' +
                    '</div>' +
                    '<div class="modal-body ">' +
                    '<div class="row">' +
                    '<div class="col-lg-12" data-name="content">{message}</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>' +
                    '<button type="button" class="btn btn-primary modal-popUp-action">{buttonTitle}</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
            }
        }
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.info = function(infoModalData) {
        var infoSettings = {
            message: infoModalData.message || "",
            title: infoModalData.title || this.settings.title.info[Softaware.Model.language]
        };

        var html = Softaware.Utilities.textFromTemplate(this.settings.sourceCode.info.bootstrap, infoSettings);
        $(document.body).remove("#softaware-infomodal");
        $(document.body).append(html);

        // Open modal.
        $("#softaware-infomodal").modal();
    };
    this.confirm = function(confirmModalData) {
        var confirmSettings = {
            modalSelector: confirmModalData.modalSelector || ".modal-confirm",
            title: confirmModalData.title || this.settings.title.confirm[Softaware.Model.language],
            message: confirmModalData.message || "",
            buttonTitle: confirmModalData.buttonTitle || "OK",
            actionBtnSelector: confirmModalData.actionBtnSelector || ".modal-popUp-action",
            onModalAfterOpen: function(self) {},
            onModalClose: function(self) {},
            actionFunction: confirmModalData.actionFunction || function(event) {}
        };

        var html = Softaware.Utilities.textFromTemplate(this.settings.sourceCode.confirm.bootstrap, confirmSettings);
        $(document.body).remove(confirmSettings.modalSelector);
        $(document.body).append(html);

        // On modal After Open.
        $(confirmSettings.modalSelector).on("shown.bs.modal", function(event) {
            event.stopPropagation();
            confirmSettings.onModalAfterOpen(event);
            return false;
        });
        // Set the event for the create action.
        $(confirmSettings.modalSelector + " " + confirmSettings.actionBtnSelector).on("click", function(event) {
            event.stopPropagation();
            confirmSettings.actionFunction(event);
            return false;
        });
        // On modal Close.
        $(confirmSettings.modalSelector).on("hidden.bs.modal", function(event) {
            event.stopPropagation();
            confirmSettings.onModalClose(event);
            // Remove modal.
            $(confirmSettings.modalSelector).remove();
            return false;
        });
        // Open modal.
        $(confirmSettings.modalSelector).modal();
    };
    // Constructor.
    {
        this.setSettings(configurationSettings);
    }
};
/**
 * @param {type} configurationSettings Settings for the modal.
 * @returns {Softaware.Modal.Create}
 */
Softaware.Modal.Create = function(configurationSettings) {
    this.settings = {
        module: [],
        displayAll: null,
        csrfToken: (csrfToken || null),
        domainClass: null, // The class of the model.
        blockSelector: "body",
        triggerBtnSelector: ".modal-create-open",
        modalSelector: ".modal-create",
        actionBtnSelector: ".modal-create-action",
        modalOptions: {
            backdrop: "static"
        },
        validation: {},
        onModalBeforeOpen: function(self) {},
        onModalAfterOpen: function(self) {},
        onModalClose: function(self, event) {},
        onCreateStart: function(self) {},
        onValidationComplete: function(self, domain, domData, ajaxOptions, formValidator, isFormValid) {},
        onCreateRequestStart: function(self, domain, domData, ajaxOptions) {},
        onCreateSuccessStart: function(model, self, btn, domain) {},
        onCreateSuccessFinish: function(model, self, btn, domain) {},
        onCreateErrorStart: function(xhr, self, btn) {},
        onCreateErrorFinish: function(xhr, self, btn) {}
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.initialize = function() {
        var self = this;

        //==> INIT MODULES
        if (self.settings.module.length === 0) {
            self.settings.module = Softaware.Utilities.extractModules(self.settings.modalSelector);
        }

        //==> INIT EVENTS
        // Set the event for the open action.
        $(self.settings.blockSelector).on("click", self.settings.triggerBtnSelector + ":not(.disabled)", function(event) {
            event.stopPropagation();
            self.open();
            return false;
        });
        // Set the event for the create action.
        $(self.settings.modalSelector + " " + self.settings.actionBtnSelector).on("click", function(event) {
            event.stopPropagation();
            self.create(event);
            return false;
        });
        // On modal After Open.
        $(self.settings.modalSelector).on("shown.bs.modal", function(event) {
            event.stopPropagation();
            var elementToFocus = $(this).find("[autofocus]");
            if (elementToFocus[0]) {
                elementToFocus[0].focus();
            }
            self.settings.onModalAfterOpen(self);
            return false;
        });
        // On modal Close.
        $(self.settings.modalSelector).on("hidden.bs.modal", function(event) {
            event.stopPropagation();
            self.settings.onModalClose(self, event);
            return false;
        });
    };
    this.open = function() {
        var self = this;
        if (!self.settings.modalSelector) {
            console.log("CreateModal:open -> No modalSelector attribute defined.");
            return false;
        }

        //==> RESET FORM
        $(self.settings.modalSelector + " form").resetForm();
        // Module -> Tab initialization.
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.TabsBootstrap, "refresh", self.settings.modalSelector);
        // Plugin -> ImageSelectListView clear.
        //        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.imageSelectList, "clear");
        // Module -> CreateMultipleWithBlocks clear.
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.CreateMultipleWithBlocks, "clear");
        // Plugin -> CheckBoxAsButtonListView clear.
        //        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.checkBoxAsButtonList, "clear");
        // Module -> tinyMCE clear.
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.TextEdirorTinyMCE, "clear");
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.TagsWithAutoFill, "clear");

        Softaware.Utilities.dataToDom({}, self.settings.modalSelector);
        //==> OPEN MODAL
        self.settings.onModalBeforeOpen(self);
        $(self.settings.modalSelector).modal(self.settings.modalOptions);
    };
    this.create = function(event) {
        if (!event) {
            throw new Softaware.Exception.InvalidArgumentException("event:" + event);
        }
        var self = this;
        var btn = $(event.currentTarget);
        self.settings.onCreateStart(self);
        // Module -> TextEdirorTinyMCE saveToTextarea.
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.TextEdirorTinyMCE, "saveToTextarea");
        var $form = $(self.settings.modalSelector + " form");

        //==> GET MODEL FROM FORM
        var domain = new self.settings.domainClass();
        // Module -> CreateMultipleWithBlocks fieldNameToArray.
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.CreateMultipleWithBlocks, "fieldNameToArray");
        var domData = Softaware.Utilities.formToData($form);
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.TagsWithAutoFill, "domToData", domData);
        if (!(domData instanceof FormData)) {
            domData = Softaware.Utilities.convertJsonAttributeToJsonOrArray(domData); // Solve the Jackson configuration problem for ACCEPT_SINGLE_VALUE_AS_ARRAY DeserializationFeature.
        }

        //==> VALIDATE DATA
        var ajaxOptions = {};
        var validation = Softaware.ValidationStyle.jQueryPopover;
        if (domain.validation) {
            validation = $.extend(true, {}, validation, domain.validation);
        }
        if (self.settings.validation) {
            validation = $.extend(true, {}, validation, {
                rules: self.settings.validation
            });
        }
        if (validation.rules) {
            var formValidator = $form.validate(validation);
            var isFormValid = formValidator.form();
            // Module -> CreateMultipleWithBlocks validate.
            var isMultipleBlocksValid = Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.CreateMultipleWithBlocks, "validate");
            // Check the validation results and complete.
            for (var i = 0; i < isMultipleBlocksValid.length; i++) {
                isFormValid = isFormValid && isMultipleBlocksValid[i];
            }
            // Complete validation.
            var customValidation = self.settings.onValidationComplete(self, domain, domData, ajaxOptions, formValidator, isFormValid);
            isFormValid = isFormValid && (typeof(customValidation) === "undefined" || customValidation);
            if (!isFormValid) {
                return false;
            }
        } else {
            console.log("The domain is not using validation.");
        }

        // Loading Bootstrap Animation.
        btn.button("loading");

        // Insert the model.
        ajaxOptions.url = domain.rootUrl + (self.settings.csrfToken ? "?_csrf=" + self.settings.csrfToken : "");
        self.settings.onCreateRequestStart(self, domain, domData, ajaxOptions);
        domain.model = domData;
        Softaware.Service.create(domain, $.extend({}, ajaxOptions, {
            success: function(model, data, response) {
                //==> INSERT SUCCESS
                btn.button("reset");
                // Run the start event.
                self.settings.onCreateSuccessStart(model, self, btn, domain);

                if (model.errormessage) {
                    // Show the error and do not close the modal.
                    new Softaware.Module.Notification().showPkNotification("error", model.errormessage);
                } else {

                    //==> INSERT INTO DISPLAY ALL VIEW
                    if (self.settings.displayAll) {
                        self.settings.displayAll.createModel(model);
                    }
                    //==> CLOSE MODAL
                    $(self.settings.modalSelector).modal("hide");
                }

                // Run the fnalize event.
                self.settings.onCreateSuccessFinish(model, self, btn, domain);
            },
            error: function(xhr, status, error) {
                //==> INSERT ERROR
                btn.button("reset");
                // Run the start event.
                self.settings.onCreateErrorStart(xhr, self, btn);

                // Show notification.
                if (xhr.responseJSON && xhr.responseJSON.errormessage) {
                    new Softaware.Module.Notification().showPkNotification("error", xhr.responseJSON.errormessage);
                } else {
                    new Softaware.Module.Notification().showPkNotification("error");
                }

                // Run the finalize event.
                self.settings.onCreateErrorFinish(xhr, self, btn);
            }
        }));
    };
    // Constructor.
    {
        this.setSettings(configurationSettings);
        this.initialize();
    }
};
Softaware.Modal.Read = function(configurationSettings) {
    this.currentDomain = null;
    this.settings = {
        module: [],
        displayAll: null,
        domain: null, // A ready to use domain. Do not use in case of fetching.
        csrfToken: (csrfToken || null),
        blockSelector: "body",
        triggerBtnSelector: ".modal-read-open",
        modalSelector: ".modal-read",
        fetchEnable: false,
        fetchUrl: null,
        modalOptions: {
            backdrop: "static"
        },
        onModalBeforeOpen: function(self) {},
        onModalAfterOpen: function(self) {},
        onModalClose: function(self, event) {},
        onFetchBefore: function(self, ajaxOptions) {},
        onRenderStart: function(self) {},
        onRenderComplete: function(self) {}
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.initialize = function() {
        var self = this;

        //==> INIT MODULES
        if (self.settings.module.length === 0) {
            self.settings.module = Softaware.Utilities.extractModules(self.settings.modalSelector);
        }

        //==> INIT EVENTS
        // Set the event for the open action.
        $(self.settings.blockSelector).on("click", self.settings.triggerBtnSelector + ":not(.disabled)", function(event) {
            event.stopPropagation();
            self.open();
            return false;
        });
        // On modal After Open.
        $(self.settings.modalSelector).on("shown.bs.modal", function(event) {
            event.stopPropagation();
            var elementToFocus = $(this).find("[autofocus]");
            if (elementToFocus[0]) {
                elementToFocus[0].focus();
            }
            self.settings.onModalAfterOpen(self);
            return false;
        });
        // On modal Close.
        $(self.settings.modalSelector).on("hidden.bs.modal", function(event) {
            event.stopPropagation();
            self.settings.onModalClose(self, event);
            return false;
        });
    };
    this.open = function() {
        var self = this;
        var ajaxOptions = {};

        //==> GET DATA FROM DISPLAY ALL VIEW
        if (self.settings.displayAll !== null) {
            self.currentDomain = self.settings.displayAll.getSelectedDomain();
            if (self.currentDomain === null) {
                console.log("No selected model.");
                new Softaware.Modal.PopUp().info({
                    message: self.settings.displayAll.getNoSelectionErrorMsg()
                });
                return false;
            }
        } else {
            if (self.settings.domain === null) {
                throw "You must set the displayAll or the domain settings.";
            }
            self.currentDomain = self.settings.domain;
        }

        if (self.settings.fetchEnable) {
            // Fetch the data from REST.
            self.settings.onFetchBefore(self, self.currentDomain, ajaxOptions);
            Softaware.Service.read(self.currentDomain, $.extend({}, ajaxOptions, {
                url: self.settings.fetchUrl,
                success: function(data) {
                    self.currentDomain.model = data;
                    //==> RENDER
                    self.render();
                    //==> OPEN MODAL
                    self.settings.onModalBeforeOpen(self);
                    $(self.settings.modalSelector).modal(self.settings.modalOptions);
                },
                error: function(xhr, status, error) {
                    console.log("ReadModal:open -> fetch model retured an error.");
                }
            }));
        } else {
            //==> RENDER
            self.render();
            //==> OPEN MODAL
            self.settings.onModalBeforeOpen(self);
            $(self.settings.modalSelector).modal(self.settings.modalOptions);
        }
    };
    this.render = function() {
        var self = this;
        if (typeof(this.currentDomain) === "undefined" || this.currentDomain === null) {
            throw "ReadModal:render -> No model defined.";
        }
        this.settings.onRenderStart(this);

        // Module -> Tab initialization.
        Softaware.Module.callMethod(this.settings.module, Softaware.Type.ModuleType.TabsBootstrap, "refresh", self.settings.modalSelector);
        // ImageDisplaySimpleList clear.
        //        Softaware.Module.callMethod(this.settings.module, Softaware.Type.ModuleType.imageDisplaySimpleList, "clear");

        // I have to clear the values of the modal and set the dafault value before fetching.
        // Render model to form using the JQuery custom method.
        //            $(this.settings.modalSelector + " form").renderModelToDOMonRead(this.curModel); //=> DEPRICATED UNDER TESTING..
        Softaware.Utilities.dataToDom(this.currentDomain.model, this.settings.modalSelector);
        //        Softaware.Module.callMethod(this.settings.module, Softaware.Type.ModuleType.imageDisplaySimpleList, "render", this.currentDomain);
        this.settings.onRenderComplete(this);
    };
    // Constructor.
    {
        this.setSettings(configurationSettings);
        this.initialize();
    }
};
Softaware.Modal.Update = function(configurationSettings) {
    this.currentDomain = null;
    this.settings = {
        module: [],
        displayAll: null,
        domain: null, // A ready to use domain. Do not use in case of fetching.
        csrfToken: (csrfToken || null),
        blockSelector: "body",
        triggerBtnSelector: ".modal-update-open",
        modalSelector: ".modal-update",
        actionBtnSelector: ".modal-update-action",
        fetchEnable: false,
        fetchUrl: null,
        validation: {},
        modalOptions: {
            backdrop: "static"
        },
        onModalBeforeOpen: function(self) {},
        onModalAfterOpen: function(self) {},
        onModalClose: function(self, event) {},
        onFetchBefore: function(self, ajaxOptions) {},
        onRenderStart: function(self, crudApp) {},
        onRenderComplete: function(self) {},
        onUpdateStart: function(self) {},
        onValidationComplete: function(self, domain, domData, ajaxOptions, formValidator, isFormValid) {},
        onUpdateRequestStart: function(self, domain, domData, ajaxOptions) {},
        onUpdateSuccessStart: function(model, self, btn) {},
        onUpdateSuccessFinish: function(model, self, btn) {},
        onUpdateErrorStart: function(xhr, self, btn) {},
        onUpdateErrorFinish: function(xhr, self, btn) {}
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.initialize = function() {
        var self = this;

        //==> INIT MODULES
        if (self.settings.module.length === 0) {
            self.settings.module = Softaware.Utilities.extractModules(self.settings.modalSelector);
        }

        //==> INIT EVENTS
        // Set the event for the open action.
        $(self.settings.blockSelector).on("click", self.settings.triggerBtnSelector + ":not(.disabled)", function(event) {
            event.stopPropagation();
            self.open();
            return false;
        });
        // Set the event for the update action.
        $(self.settings.modalSelector + " " + self.settings.actionBtnSelector).on("click", function(event) {
            event.stopPropagation();
            try {
                self.update(event);
            } catch (e) {
                console.log(e);
            }
            return false;
        });
        // On modal Open.
        $(self.settings.modalSelector).on("shown.bs.modal", function(event) {
            event.stopPropagation();
            var elementToFocus = $(this).find("[autofocus]");
            if (elementToFocus[0]) {
                elementToFocus[0].focus();
            }
            self.settings.onModalAfterOpen(self);
            return false;
        });
        // On modal Close.
        $(self.settings.modalSelector).on("hidden.bs.modal", function(event) {
            event.stopPropagation();
            self.settings.onModalClose(self, event);
            return false;
        });
    };
    this.open = function() {
        var self = this;
        var ajaxOptions = {};

        //==> GET DATA FROM DISPLAYALL OR FROM SETTINGS
        if (self.settings.displayAll !== null) {
            self.currentDomain = self.settings.displayAll.getSelectedDomain();
            if (self.currentDomain === null) {
                console.log("No selected model.");
                new Softaware.Modal.PopUp().info({
                    message: self.settings.displayAll.getNoSelectionErrorMsg()
                });
                return false;
            }
        } else {
            if (self.settings.domain === null) {
                throw "You must set the displayAll or the domain settings.";
            }
            self.currentDomain = self.settings.domain;
        }

        //==> FETCH THE FULL DATA OR USE THE EXISTING AND RENDER + OPEN THE MODAL
        if (self.settings.fetchEnable) {
            // Fetch the data from REST.
            self.settings.onFetchBefore(self, ajaxOptions);
            Softaware.Service.read(self.currentDomain, $.extend({}, ajaxOptions, {
                url: self.settings.fetchUrl,
                success: function(data) {
                    self.currentDomain.model = data;
                    //==> RENDER
                    self.render();
                    //==> OPEN MODAL
                    self.settings.onModalBeforeOpen(self);
                    $(self.settings.modalSelector).modal(self.settings.modalOptions);
                },
                error: function(xhr, status, error) {
                    console.log("UpdateModal:open -> fetch model retured an error.");
                }
            }));
        } else {
            //==> RENDER
            self.render();
            //==> OPEN MODAL
            self.settings.onModalBeforeOpen(self);
            $(self.settings.modalSelector).modal(self.settings.modalOptions);
        }
    };
    this.update = function(event) {
        if (typeof(event) === "undefined" || event === null) {
            throw new Softaware.Exception.InvalidArgumentException("event:" + event);
        }
        var self = this;
        var btn = $(event.currentTarget);
        self.settings.onUpdateStart(self);
        // Module -> tinyMCE saveToTextarea.
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.TextEdirorTinyMCE, "saveToTextarea");
        var $form = $(self.settings.modalSelector + " form");

        //==> GET MODEL FROM FORM
        var domain = new self.settings.domainClass();
        var domData = Softaware.Utilities.formToData($form);
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.TagsWithAutoFill, "domToData", domData);
        if (!(domData instanceof FormData)) {
            domData = Softaware.Utilities.convertJsonAttributeToJsonOrArray(domData); // Solve the Jackson configuration problem for ACCEPT_SINGLE_VALUE_AS_ARRAY DeserializationFeature.
        }

        //==> VALIDATE DATA
        var ajaxOptions = {};
        var validation = Softaware.ValidationStyle.jQueryPopover;
        if (domain.validation) {
            validation = $.extend(true, {}, validation, domain.validation);
        }
        if (self.settings.validation) {
            validation = $.extend(true, {}, validation, {
                rules: self.settings.validation
            });
        }
        if (validation.rules) {
            var formValidator = $form.validate(validation);
            var isFormValid = formValidator.form();
            //            // Module -> CreateMultipleWithBlocks validate.
            //            var isMultipleBlocksValid = Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.CreateMultipleWithBlocks, "validate");
            //            // Check the validation results and complete.
            //            for (var i = 0; i < isMultipleBlocksValid.length; i++) {
            //                isFormValid = isFormValid && isMultipleBlocksValid[i];
            //            }
            // Complete validation.
            var customValidation = self.settings.onValidationComplete(self, domain, domData, ajaxOptions, formValidator, isFormValid);
            isFormValid = isFormValid && (typeof(customValidation) === "undefined" || customValidation);
            if (!isFormValid) {
                return false;
            }
        } else {
            console.log("The domain is not using validation.");
        }

        // Loading Bootstrap Animation.
        btn.button("loading");

        // Update the model.
        ajaxOptions.url = self.currentDomain.rootUrl + self.currentDomain.model[self.currentDomain.idAttribute] +
            (self.settings.csrfToken ? "?_csrf=" + self.settings.csrfToken : "");
        self.settings.onUpdateRequestStart(self, domain, domData, ajaxOptions);
        domain.model = domData;
        Softaware.Service.update(domain, $.extend({}, ajaxOptions, {
            success: function(model, data, response) {
                //==> UPDATE SUCCESS
                btn.button("reset");
                // Run the start event.
                self.settings.onUpdateSuccessStart(model, self, btn);

                if (model.errormessage) {
                    // Show the error and do not close the modal.
                    new Softaware.Module.Notification().showPkNotification("error", model.errormessage);
                } else {

                    //==> UPDATE DISPLAY ALL VIEW
                    if (self.settings.displayAll) {
                        self.settings.displayAll.updateSelectedModel(model);
                    }
                    //==> CLOSE MODAL
                    $(self.settings.modalSelector).modal("hide");
                }

                // Run the finalize event.
                self.settings.onUpdateSuccessFinish(model, self, btn);
            },
            error: function(xhr, status, error) {
                //==> UPDATE ERROR
                btn.button("reset");
                // Run the start event.
                self.settings.onUpdateErrorStart(xhr, self, btn);

                // Show notification.
                if (xhr.responseJSON && xhr.responseJSON.errormessage) {
                    new Softaware.Module.Notification().showPkNotification("error", xhr.responseJSON.errormessage);
                } else {
                    new Softaware.Module.Notification().showPkNotification("error");
                }

                // Run the finalize event.
                self.settings.onUpdateErrorFinish(xhr, self, btn);
            }
        }));
    };
    this.render = function() {
        var self = this;
        if (self.currentDomain === null) {
            throw new Softaware.Exception.IllegalStateException("UpdateModal:render -> No model defined.");
        }
        self.settings.onRenderStart(self);

        //==> RESET FORM
        $(self.settings.modalSelector + " form").resetForm();
        // Module -> Tab initialization.
        Softaware.Module.callMethod(this.settings.module, Softaware.Type.ModuleType.TabsBootstrap, "refresh", self.settings.modalSelector);
        // Plugin -> ImageSelectListView clear.
        //        Softaware.Module.callMethod(this.settings.module, Softaware.Type.ModuleType.imageSelectList, "clear");
        // Module -> CreateMultipleWithBlocks clear.
        //        Softaware.Module.callMethod(this.settings.module, Softaware.Type.ModuleType.CreateMultipleWithBlocks, "clear");
        // Plugin -> CheckBoxAsButtonListView clear.
        //        Softaware.Module.callMethod(this.settings.module, Softaware.Type.ModuleType.checkBoxAsButtonList, "clear");
        // Module -> tinyMCE clear.
        Softaware.Module.callMethod(this.settings.module, Softaware.Type.ModuleType.TextEdirorTinyMCE, "clear");
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.TagsWithAutoFill, "clear");

        Softaware.Utilities.dataToForm(self.currentDomain.model, $(self.settings.modalSelector + " form"));
        Softaware.Utilities.dataToDom(self.currentDomain.model, $(self.settings.modalSelector));

        // Plugin -> CheckBoxAsButtonListView.
        //        Softaware.Module.callMethod(this.settings.module, Softaware.Type.ModuleType.checkBoxAsButtonList, "select", self.curModel);
        // Plugin -> ImageSelectListView.
        //        Softaware.Module.callMethod(this.settings.module, Softaware.Type.ModuleType.imageSelectList, "loadImages", self.curModel);
        // Module -> ImageSelectListView.
        Softaware.Module.callMethod(this.settings.module, Softaware.Type.ModuleType.AuthorizationUseCaseButton, "render", self.currentDomain.model);
        // Module -> tinyMCE setContent.
        Softaware.Module.callMethod(this.settings.module, Softaware.Type.ModuleType.TextEdirorTinyMCE, "setContent", self.currentDomain.model);
        Softaware.Module.callMethod(self.settings.module, Softaware.Type.ModuleType.TagsWithAutoFill, "dataToDom", self.currentDomain.model);
        self.settings.onRenderComplete(self);
    };
    // Constructor.
    {
        this.setSettings(configurationSettings);
        this.initialize();
    }
};
Softaware.Modal.Delete = function(configurationSettings) {
    this.currentDomain = null;
    this.settings = {
        module: [],
        displayAll: null,
        domain: null, // A ready to use domain. Do not use in case of fetching.
        csrfToken: (csrfToken || null),
        blockSelector: "body",
        triggerBtnSelector: ".modal-delete-open",
        modalSelector: ".modal-delete",
        actionBtnSelector: ".modal-delete-action",
        modalOptions: {
            backdrop: "static"
        },
        onModalBeforeOpen: function(self) {},
        onModalAfterOpen: function(self) {},
        onModalClose: function(self, event) {},
        onRenderStart: function(self) {},
        onRenderComplete: function(self) {},
        onDeleteStart: function(self) {},
        onDeleteRequestStart: function(self, ajaxOptions) {},
        onDeleteSuccessStart: function(model, self, btn) {},
        onDeleteSuccessFinish: function(model, self, btn) {}
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.initialize = function() {
        var self = this;

        //==> INIT MODULES
        if (self.settings.module.length === 0) {
            self.settings.module = Softaware.Utilities.extractModules(self.settings.modalSelector);
        }

        //==> INIT EVENTS
        // Set the event for the open action.
        $(self.settings.blockSelector).on("click", self.settings.triggerBtnSelector + ":not(.disabled)", function(event) {
            event.stopPropagation();
            self.open();
            return false;
        });
        // Set the event for the remove action.
        $(self.settings.modalSelector + " " + self.settings.actionBtnSelector).on("click", function(event) {
            event.stopPropagation();
            try {
                self.delete(event);
            } catch (e) {
                console.log(e);
            }
            return false;
        });
        // On modal Open.
        $(self.settings.modalSelector).on("shown.bs.modal", function(event) {
            event.stopPropagation();
            var elementToFocus = $(this).find("[autofocus]");
            if (elementToFocus[0]) {
                elementToFocus[0].focus();
            }
            self.settings.onModalAfterOpen(self);
            return false;
        });
        // On modal Close.
        $(self.settings.modalSelector).on("hidden.bs.modal", function(event) {
            event.stopPropagation();
            self.settings.onModalClose(self, event);
            return false;
        });
    };
    this.open = function() {
        var self = this;

        //==> GET DATA FROM DISPLAYALL OR FROM SETTINGS
        if (self.settings.displayAll !== null) {
            self.currentDomain = self.settings.displayAll.getSelectedDomain();
            if (self.currentDomain === null) {
                console.log("No selected model.");
                new Softaware.Modal.PopUp().info({
                    message: self.settings.displayAll.getNoSelectionErrorMsg()
                });
                return false;
            }
        } else {
            if (self.settings.domain === null) {
                throw "You must set the displayAll or the domain settings.";
            }
            self.currentDomain = self.settings.domain;
        }

        //==> RENDER
        self.render();

        //==> OPEN MODAL
        self.settings.onModalBeforeOpen(self);
        $(self.settings.modalSelector).modal(self.settings.modalOptions);
    };
    this.delete = function(event) {
        if (typeof(event) === "undefined" || event === null) {
            console.log("DeleteModal:remove -> No event defined.");
            return false;
        }
        var self = this;
        var btn = $(event.currentTarget);
        self.settings.onDeleteStart(this);

        // Loading Bootstrap Animation.
        btn.button("loading");

        // Before Destroy event.
        //            var ajaxOptions = {wait: true};
        var ajaxOptions = {};
        ajaxOptions.url = self.currentDomain.rootUrl + self.currentDomain.model[self.currentDomain.idAttribute] +
            (self.settings.csrfToken ? "?_csrf=" + self.settings.csrfToken : "");
        self.settings.onDeleteRequestStart(self, ajaxOptions);

        // Delete the model.
        Softaware.Service.remove(self.currentDomain, $.extend({}, ajaxOptions, {
            success: function(model, status, xhr) {
                //==> DELETE SUCCESS
                btn.button("reset");

                if (model.errormessage) {
                    // Show the error and do not close the modal.
                    new Softaware.Module.Notification().showPkNotification("error", model.errormessage);
                } else {
                    // Run the start event.
                    self.settings.onDeleteSuccessStart(model, self, btn);

                    //==> DELETE FROM DISPLAY ALL VIEW
                    if (self.settings.displayAll) {
                        self.settings.displayAll.deleteSelectedModel(model);
                    }
                    //==> CLOSE MODAL
                    $(self.settings.modalSelector).modal("hide");

                    // Run the finalize event.
                    self.settings.onDeleteSuccessFinish(model, self, btn);
                }
            },
            error: function(xhr, status, error) {
                //==> DELETE ERROR
                btn.button("reset");

                // Show notification.
                if (xhr.responseJSON && xhr.responseJSON.errormessage) {
                    new Softaware.Module.Notification().showPkNotification("error", xhr.responseJSON.errormessage);
                } else {
                    new Softaware.Module.Notification().showPkNotification("error");
                }
            }
        }));
    };
    this.render = function() {
        var self = this;
        self.settings.onRenderStart(self);

        if (self.currentDomain === null) {
            throw "The current domain cannot be null";
        }

        Softaware.Utilities.dataToDom(this.currentDomain.model, this.settings.modalSelector);

        self.settings.onRenderComplete(self);
    };
    // Constructor.
    {
        this.setSettings(configurationSettings);
        this.initialize();
    }
};

Softaware.DisplayAll = {};
Softaware.DisplayAllType = function() {
    this.empty = function() {
        throw "UnsupportedOperationException";
    };
    this.loadData = function(modelArray) {
        throw "UnsupportedOperationException";
    };
    this.createModel = function(model) {
        throw "UnsupportedOperationException";
    };
    this.updateSelectedModel = function(model) {
        throw "UnsupportedOperationException";
    };
    this.deleteSelectedModel = function() {
        throw "UnsupportedOperationException";
    };
    /**
     * 
     * @param {type} fetchEnable
     * @param {type} fetchUrl
     * @param {type} selectedRow
     * @returns {Softaware.Domain} return a Softaware.Domain object type or null.
     */
    this.getSelectedDomain = function(fetchEnable, fetchUrl, selectedRow) {
        throw "UnsupportedOperationException";
    };
    this.getNoSelectionErrorMsg = function() {
        throw "UnsupportedOperationException";
    };
    this.getModels = function() {
        throw "UnsupportedOperationException";
    };
};
Softaware.DisplayAll.Table = function(configurationSettings) {
    this.__proto__ = new Softaware.DisplayAllType();
    this.dataTable = null;
    this.selectedRow = null;
    this.settings = {
        blockSelector: "body",
        domainClass: null,
        fetchEnable: true,
        fetchUrl: "",
        selectedRowClass: "selectedRow",
        dataTable_customFilterSelector: "",
        dataTableOptions: null,
        popoverAttribute: null,
        generalLang: {
            "GR": {},
            "EN": {
                "searchField": "Search.."
            }
        },
        noSelectionErrorMsg: {
            "GR": "Θα πρέπει να επιλέξετε κάποια γραμμή από τον πίνακα.",
            "EN": "You should choose a row from the table."
        },
        afterFetchModels: function(modelArray) {},
        afterRowCreation: function(row, data, index) {},
        afterRowChange: function(row, data, index) {},
        afterRowSelection: function(self, event) {}
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.dataTableOptions = {
        "stateSave": true,
        "processing": true,
        "displayLength": 20,
        "lengthMenu": [
            [10, 20, 25, 50],
            [10, 20, 25, 50]
        ],
        "searching": true,
        "ordering": true,
        dom: "Bfrtip", // lBfrtip
        buttons: [{
            extend: "pageLength",
            className: "btn"
        }, {
            extend: "copy",
            className: "btn"
        }, {
            extend: "csv",
            className: "btn"
        }, {
            extend: "excel",
            className: "btn"
        }, {
            extend: "pdf",
            className: "btn"
        }, {
            extend: "print",
            className: "btn"
        }],
        responsive: !0
        //        "fnRowCallback": function (nRow, aData, iDisplayIndex) {
        //            // Lazy loading images.
        //            // Add down of the table cell a temporary element with tableview-img-source attribute.
        //            // This attribute will include a url to an image.
        //            // This temporary element will be replaced with an image from this url.
        //            $("td *[tableview-img-source]", nRow).each(function () {
        //                // Get the table column.
        //                var $parent = $(this).parent("td");
        //                if ($parent.length <= 0) {
        //                    return;
        //                }
        //
        //                // Add the image.
        //                $($parent).append("<img src='" + $(this).attr("tableview-img-source") + "' style='max-height:100px; max-width:250px;'/>");
        //                // Remove the temp element.
        //                $(this).remove();
        //            });
        //
        //            return nRow;
        //        }
    };
    this.dataTableLanguage = {
        "GR": {
            "language": {
                "zeroRecords": "Δεν βρέθηκαν αποτελέσματα.",
                "processing": "Φόρτωση Δεδομένων...",
                "lengthMenu": "Εγγραφές ανα σελίδα: _MENU_",
                "search": "",
                "info": "Συνολικά _TOTAL_ Εγγραφές",
                "infoFiltered": "στα _MAX_",
                "infoEmpty": "Βρέθηκαν 0",
                "emptyTable": "Καμία εγγραφή",
                "paginate": {
                    "next": "Επόμ.",
                    "previous": "Προηγ."
                },
                "loadingRecords": "Παρακαλώ περιμένετε..."
            }
        },
        "EN": {
            "language": {
                "zeroRecords": "No results found.",
                "processing": "Loading Data...",
                "lengthMenu": "Records per page: _MENU_",
                "search": "",
                "info": "Total Records _TOTAL_",
                "infoFiltered": "to _MAX_",
                "infoEmpty": "Found 0",
                "emptyTable": "No records",
                "paginate": {
                    "next": "Next",
                    "previous": "Previous"
                },
                "loadingRecords": "Please wait..."
            }
        }
    };
    this.initialize = function() {
        var self = this;

        self.initializeDataTable();

        // Initialize an empty collection. // DEPRECATED - IT IS USED ONLY ONCE SO TRANSFER THIS CHUNK IN THE CORRECT PLACE!!
        if (self.settings.domainClass === null) {
            console.log("TableView:initialize -> No collection defined.");
            return false;
        }

        // Get the rows.
        if (self.settings.fetchEnable) {
            // Get the url to fetch.
            var fetchUrl;
            if (self.settings.fetchUrl) {
                fetchUrl = self.settings.fetchUrl;
            } else {
                var domainTemp = new self.settings.domainClass();
                fetchUrl = domainTemp.rootUrl;
            }

            Softaware.Service.readAll(fetchUrl, {
                success: function(modelArray, response) {
                    // Load data to datatable.
                    self.loadData(modelArray);
                    self.settings.afterFetchModels(modelArray);
                },
                error: function(response, errorText) {
                    console.log("TableView:initialize -> An error occured when trying to get models from REST.");
                }
            });
        }
    };
    this.initializeDataTable = function() {
        var self = this;

        // Add the row creation events.
        self.dataTableOptions.fnRowCallback = function(nRow, aData, iDisplayIndex) {
            // Lazy loading images.
            // Add down of the table cell a temporary element with tableview-img-source attribute.
            // This attribute will include a url to an image.
            // This temporary element will be replaced with an image from this url.
            $("td *[tableview-img-source]", nRow).each(function() {
                // Get the table column.
                var $parent = $(this).parent("td");
                if ($parent.length <= 0) {
                    return;
                }

                // Add the image.
                $($parent).append("<img src='" + $(this).attr("tableview-img-source") + "' style='max-height:100px; max-width:250px;'/>");
                // Remove the temp element.
                $(this).remove();
            });

            // Custom observer.
            self.settings.afterRowChange(nRow, aData, iDisplayIndex);

            return nRow;
        };
        self.dataTableOptions.createdRow = function(row, data, index) {
            self.settings.afterRowCreation(row, data, index);
        };

        // Get the language.
        var dataTableLanguage = self.dataTableLanguage[Softaware.Model.language];

        // Initialize the table.
        self.dataTable = $("table", self.settings.blockSelector).DataTable(
            $.extend(true, {}, self.dataTableOptions, dataTableLanguage, self.settings.dataTableOptions));

        // Set the select row action.
        $(self.settings.blockSelector + " tbody").on("click", "tr", function(event) {
            //            event.stopPropagation();//=> I can't add a button in the row because the event is not bubbled.
            self.selectRow(event);
            self.settings.afterRowSelection(self, event);
            //            return false;
        });

        // Set the filter action.
        $(self.settings.blockSelector + " .dataTables_filter input[type='search']").on("keyup", function(event) {
            event.stopPropagation();
            self.filter(event);
            return false;
        });

        // Set the popover action.
        if (self.settings.popoverAttribute) {
            $(self.settings.blockSelector + " tbody").on("mouseover", "tr", function(event) {
                event.stopPropagation();
                self.popover(event);
                return false;
            });
        }

        // Get the state save filtering value.
        $(self.settings.blockSelector + " input[type='search']").attr("placeholder", self.settings.generalLang[Softaware.Model.language].searchField);
    };
    this.selectRow = function(event) {
        if (typeof(event) === "undefined" || event === null) {
            console.log("TableView:selectRow -> No event defined.");
            return {};
        }

        var self = this;
        var element = event.currentTarget; // It is a tr element
        var selectedRowClass = self.settings.selectedRowClass;

        // Mark row with a specific class(selectedRow_class) or toggle select if selected already.
        if ($(element).hasClass(selectedRowClass)) {
            $(element).removeClass(selectedRowClass);
            //remove refernce to selected row
            self.selectedRow = null;
        } else {
            // Unselect other rows --> single row selection
            self.dataTable.$("tr." + self.settings.selectedRowClass).removeClass(self.settings.selectedRowClass);
            // Select this row.
            $(element).addClass(selectedRowClass);
            // Save selected row to this.selectedRow for further use.
            self.selectedRow = element;
        }
    };
    this.filter = function(event) {
        if (typeof(event) === "undefined" || event === null) {
            console.log("TableView:filter -> No event defined.");
            return false;
        }

        // Get the value to search.
        var element = event.currentTarget;
        var value = $(element).val();

        this.dataTable
            .search(value)
            .draw(true);
    };
    this.popover = function(event) {
        if (typeof(event) === "undefined" || event === null) {
            console.log("TableView:popover -> No event defined.");
            return false;
        }

        var self = this;
        var element = event.currentTarget;

        // Bugg at request element -- destroy and create popover is a draft solution.
        $(element).popover("destroy");

        // Get data from model via the popover_attribute of model.
        var domain = self.getSelectedDomain(false, "", element);
        if (!domain) { // In case the table is empty.
            return;
        }
        var popoverContent = domain.model[self.settings.popoverAttribute];
        popoverContent.trim();

        // Show popover only if popoverContent is not empty.
        if (popoverContent.length > 0) {
            $(element).popover({
                placement: "top",
                content: popoverContent,
                container: "body",
                trigger: "hover"
            });
            $(element).popover("show");
        }
    };
    // COMMON PUBLIC INTERFACE
    this.empty = function() {
        this.dataTable.clear().draw();
    };
    this.loadData = function(modelArray) {
        if (typeof(modelArray) === "undefined" || modelArray === null) {
            console.log("TableView:loadData -> No collection defined.");
            return false;
        }
        if (this.dataTable === null) {
            this.initializeDataTable();
        }

        // Clear the current data from datatable.
        this.dataTable.clear().draw();

        // Convert collection to a readable json array and add it to datatable.
        this.dataTable.rows.add(modelArray).draw();
    };
    this.createModel = function(model) {
        if (typeof(model) === "undefined" || model === null) {
            console.log("TableView:createModel -> No model defined.");
            return false;
        }

        this.dataTable.row.add(model).draw(false);
    };
    this.updateSelectedModel = function(model) {
        var row = this.selectedRow;
        if (!model || !row) {
            console.log("TableView:updateSelectedModel -> No model or row defined.");
            return false;
        }

        this.dataTable.row(row).data(model).draw(false);
    };
    this.deleteSelectedModel = function() {
        var row = this.selectedRow;
        if (typeof(row) === "undefined" || row === null) {
            console.log("TableView:deleteSelectedModel -> No model or row defined.");
            return false;
        }

        this.dataTable.row(row).remove().draw(false);
        this.settings.selectedRow = null;
    };
    this.getSelectedDomain = function(fetchEnable, fetchUrl, selectedRow) {
        var row = typeof(selectedRow) === "undefined" ? this.selectedRow : selectedRow;
        if (typeof(row) === "undefined" || row === null) {
            console.log("TableView:getSelectedModel -> No row defined.");
            return null;
        }

        var data = this.dataTable.row(row).data();
        if (typeof(data) === "undefined" || data === null) {
            console.log("TableView:getSelectedModel -> No row selected.");
            return null;
        }

        // Get table data.
        if (fetchEnable) {
            // Not Yet Implemented.
            throw "Fetch is not yet implemented.";
        } else {
            var domain = new this.settings.domainClass();
            domain.model = data;
            return domain;
        }
    };
    this.getNoSelectionErrorMsg = function() {
        return this.settings.noSelectionErrorMsg[Softaware.Model.language];
    };
    this.getModels = function() {
        if (!this.dataTable) {
            return [];
        }
        return this.dataTable.rows().data().toArray();;
    };
    // Constructor.
    {
        this.setSettings(configurationSettings);
        this.initialize();
    }
};
Softaware.DisplayAll.BlockForOne = function(configurationSettings) {
    this.currentDomain = null;
    this.settings = {
        blockSelector: "body",
        module: [],
        domainClass: null,
        fetchEnable: true, // Two options, one to set the domainToUse with fetchEnable=false. The other to set the fetchUrl with fetchEnable=true.
        fetchUrl: null, // Use a custom url instead of the rootUrl of the domainClass.
        domainToUse: null, // A ready to use domain. Do not use in case of fetching.
        onRenderStart: function(self) {},
        onRenderComplete: function(self) {}
    };
    this.setSettings = function(settings) {
        this.settings = $.extend({}, this.settings, settings);
    };
    this.initialize = function() {
        var self = this;

        //==> LOAD DATA
        if (self.settings.domainToUse) {
            self.loadData(self.settings.domainToUse);
        } else if (self.settings.fetchEnable) {
            var domain = new self.settings.domainClass();

            Softaware.Service.read(domain, {
                url: self.settings.fetchUrl,
                success: function(model, response) {
                    domain.model = model;
                    self.loadData(domain);
                },
                error: function(response, errorText) {
                    console.log("An error occured when trying to get the model from REST. Response:" + response);
                }
            });
        } else {
            throw new Softaware.Exception.IllegalStateException("You have to set the domainToUse with fetchEnable=false or to set the fetchUrl with fetchEnable=true.");
        }
    };
    this.render = function() {
        var self = this;
        if (!this.currentDomain) {
            throw new Softaware.Exception.IllegalStateException("No model defined.");
        }
        this.settings.onRenderStart(this);

        // Module -> Tab initialization.
        Softaware.Module.callMethod(this.settings.module, Softaware.Type.ModuleType.TabsBootstrap, "refresh", self.settings.modalSelector);
        // ImageDisplaySimpleList clear.
        //        Softaware.Module.callMethod(this.settings.module, Softaware.Type.ModuleType.imageDisplaySimpleList, "clear");

        // I have to clear the values of the modal and set the dafault value before fetching.
        // Render model to form using the JQuery custom method.
        //            $(this.settings.modalSelector + " form").renderModelToDOMonRead(this.curModel); //=> DEPRICATED UNDER TESTING..
        Softaware.Utilities.dataToDom(this.currentDomain.model, this.settings.blockSelector);
        //        Softaware.Module.callMethod(this.settings.module, Softaware.Type.ModuleType.imageDisplaySimpleList, "render", this.currentDomain);
        this.settings.onRenderComplete(this);
    };
    // COMMON PUBLIC INTERFACE
    this.empty = function() {
        throw new Softaware.Exception.IllegalStateException("Operation not supported");
    };
    this.loadData = function(domain) {
        if (domain) {
            this.currentDomain = domain;
        }
        this.render();
    };
    this.createModel = function(model) {
        throw new Softaware.Exception.IllegalStateException("Operation not supported");
    };
    this.updateSelectedModel = function(model) {
        this.currentDomain.model = model;
        this.loadData();
    };
    this.deleteSelectedModel = function() {
        // In case of deletion it has to be redirected to somewhere else. Nothing to do from here.
        return;
    };
    /**
     * 
     * @param {type} fetchEnable
     * @param {type} fetchUrl
     * @param {type} selectedRow
     * @returns {Softaware.Domain} return a Softaware.Domain object type or null.
     */
    this.getSelectedDomain = function(fetchEnable, fetchUrl, selectedRow) {
        return this.currentDomain;
    };
    this.getNoSelectionErrorMsg = function() {
        throw new Softaware.Exception.IllegalStateException("Operation not supported");
    };
    this.getModels = function() {
        return [this.currentDomain];
    };
    // Constructor.
    {
        this.setSettings(configurationSettings);
        this.initialize();
    }
};

/**
 * It may contain one of the following:
 * tinyMceEditor -> [] : Contains id (the dom id) and value (the Softaware.Module.TextEdirorTinyMCE object).
 * 
 * @type type
 */
Softaware.Cache = {};

function autoConfiguration(domSelector) {
    this.domSelector = "body";
    /**
     * Manage the data-daterangepicker<br/>
     * In case of an element that has this attribute, initialize on it the daterangepicker.<br/>
     * The value of the attribute is optional and is the date format. The default is the DD.MM.YYYY.
     * 
     * @param {type} selector
     * @returns {undefined}
     */
    this.daterangepicker = function(selector) {
        // Check the existance of the attribute.
        var items = $(selector).find("input[data-daterangepicker]");
        if (items.length === 0) {
            return;
        }

        // Check the existance of the library.    
        if (typeof($.fn.daterangepicker) !== "function") {
            throw "daterangepicker library is missing.";
        }

        // For each item.
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var value = $(item).attr("data-daterangepicker");
            $(item).daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                locale: {
                    format: (value ? value : "DD.MM.YYYY")
                }
            });
            // Clear button if exists.
            var btn = $(item).closest("div").find("button");
            if (btn.length > 0) {
                $(btn).on("click", function(event) {
                    event.stopPropagation();
                    var input = $(this).closest("div").find("input");
                    $(input).val("");
                    $(input).datepicker("refresh");
                    return false;
                });
            }
        }
    };
    /**
     * Manage the data-datepicker<br/>
     * In case of an element that has this attribute, initialize on it the datetimepicker for only dates (not time).<br/>
     * The value of the attribute is optional and is the date format. The default is the DD.MM.YYYY.
     * 
     * @param {type} selector
     * @returns {undefined}
     */
    this.datepicker = function(selector) {
        // Check the existance of the attribute.
        var items = $(selector).find("input[data-datepicker]");
        if (items.length === 0) {
            return;
        }

        // Check the existance of the library.    
        if (typeof($.fn.datetimepicker) !== "function") {
            throw "datetimepicker library is missing.";
        }

        // For each item.
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var value = $(item).attr("data-datepicker");
            value = typeof value === "undefined" || value === null || value.length === 0 ? "DD.MM.YYYY" : value;
            $(item).datetimepicker({
                viewMode: "days",
                format: value
            });
        }
    };
    /**
     * Manage the data-datetimepicker<br/>
     * In case of an element that has this attribute, initialize on it the datetimepicker for only dates (not time).<br/>
     * The value of the attribute is optional and is the date format. The default is the DD.MM.YYYY HH:mm.
     * 
     * @param {type} selector
     * @returns {undefined}
     */
    this.datepicker = function(selector) {
        // Check the existance of the attribute.
        var items = $(selector).find("input[data-datetimepicker]");
        if (items.length === 0) {
            return;
        }

        // Check the existance of the library.    
        if (typeof($.fn.datetimepicker) !== "function") {
            throw "datetimepicker library is missing.";
        }

        // For each item.
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var value = $(item).attr("data-datetimepicker");
            value = typeof value === "undefined" || value === null || value.length === 0 ? "DD.MM.YYYY HH:mm" : value;
            $(item).datetimepicker({
                viewMode: "days",
                format: value
            });
        }
    };
    /**
     * Manage the attribute data-select-enum and the optional data-select-enum-key.
     * <br/><br/>
     * The value of the data-select-enum must be an array of enums.<br/>
     * The value of the data-select-enum-key must be a key inside all enums that will be selected.<br/>
     * The default key is the name.
     * 
     * @param {type} selector
     * @returns {undefined}
     */
    this.selectFromEnum = function(selector) {
        // Check the existance of the attribute.
        var items = $(selector).find("select[data-select-enum]");
        if (items.length === 0) {
            return;
        }

        // For each item.
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            // Construct the select options.
            var enumeration = $(item).attr("data-select-enum");
            var key = $(item).attr("data-select-enum-key");

            $(item).initSelectFromEnumeration(Enumeration[enumeration], key);
        }
    };
    /**
     * Manage the attribute data-select-url and the optionals data-select-url-value and data-select-url-text and data-select-callback and data-select-editable.
     * <br/><br/>
     * The value of the data-select-url must be a String url. The data of the url are cached in cse the url is used again.<br/>
     * The value of the data-select-url-value must be a String with a value that exists as a key in the data.
     * The value of the key will be used as value for the options.<br/>
     * The value of data-select-callback must be a function that will be called after fetching data.<br/>
     * The default value of data-select-url-value is the id.<br/>
     * The value of the data-select-url-text must be a String with a value that exists as a key in the data.
     * The value of the key will be used as text for the options.<br/>
     * The default value of data-select-url-value is the title.<br/>
     * In case of the existance of data-select-editable and the existance of the correct library, the select will be converted to editable.<br/>
     * Save the data fetched in an array with global visibility with name data_select_url and with keys the urls.
     * 
     * 
     * @param {type} selector
     * @returns {undefined}
     */
    this.selectFromUrl = function(selector) {
        // Check the existance of the attribute.
        var items = $(selector).find("select[data-select-url]");
        if (items.length === 0) {
            return;
        }

        // For each item get the data.
        var selects = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            // Construct the select data.
            var select = {};
            select.index = i;
            select.url = $(item).attr("data-select-url");
            select.value = $(item).attr("data-select-url-value");
            select.text = $(item).attr("data-select-url-text");
            select.callback = $(item).attr("data-select-callback");
            select.editable = $(item).is("[data-select-editable]");
            selects.push(select);
        }

        // Request for data and build the selects.
        var requestedUrls = []; // cache the requested url to prevent from duplicate requests.
        data_select_url = {}; // Global var to store the data fetched.
        for (var i = 0; i < selects.length; i++) {
            // Duplicate validation.
            if (jQuery.inArray(selects[i].url, requestedUrls) >= 0) {
                continue;
            }
            requestedUrls.push(selects[i].url);

            // Request data.
            Softaware.Service.readAll(selects[i].url, {
                success: function(models) {
                    for (var j = 0; j < selects.length; j++) {
                        if (selects[j].url === this.url && models.length > 0) {
                            // Add options in select.
                            $(items[j]).initSelectFromDatas(models,
                                selects[j].value ? selects[j].value : "id",
                                selects[j].text ? selects[j].text : "title");
                            // Make it editable.
                            if (selects[j].editable) {
                                // Check the existance of the library.    
                                if (typeof($.fn.editableSelect) !== "function") {
                                    throw new Softaware.Exception.IllegalStateException("editableSelect library is missing.");
                                }
                                $(items[j]).editableSelect({
                                    effects: "slide"
                                });
                            }
                            // Save it to global var data_select_url
                            data_select_url[selects[j].url] = models;
                            // Callback.
                            if (typeof selects[j].callback !== "undefined" && typeof window[selects[j].callback] === "function") {
                                window[selects[j].callback]();
                            }
                        }
                    }
                }
            });
        }
    };
    /**
     * Manage the attribute data-mapkey-array.
     * <br/><br/>
     * The value of the data-mapkey must be an array of json with two
     * attributes: "s" as the source and "t" as the target. When the users
     * presses a key then if the key is included in the json as "s" value,
     * it will be convertet to the json "t" value.
     * 
     * @param {type} selector to search for elements with this attribute.
     * @returns {void}
     */
    this.mapkeyArray = function(selector) {
        // Check the existance of the attribute.
        var items = $(selector).find("*[data-mapkey-array]");
        if (items.length === 0) {
            return;
        }

        // For each item.
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            // Add the event listener.
            //                    $(item).on("propertychange change keypress paste input", function (event) {
            $(item).on("input", function(event) {
                event.stopPropagation();

                // Get the source and target language.
                var replacesArray = JSON.parse($(this).attr("data-mapkey-array"));

                // For each replace character, replace it.
                for (var i = 0; i < replacesArray.length; i++) {
                    $(this).val($(this).val().replaceAll(replacesArray[i].s, replacesArray[i].t));
                }

                // Do not propagate.
                return false;
            });
        }
    };
    /**
     * Manage the attribute data-mapkey-url.
     * <br/><br/>
     * The value of the data-mapkey-url is not considered. This attributes
     * allows only url approved characters. The conversions is implemented
     * in the Softaware.TextUtils.textToUrl text converter.<br/>
     * 
     * @param {type} selector to search for elements with this attribute.
     * @returns {void}
     */
    this.mapkeyAsUrl = function(selector) {
        // Check the existance of the attribute.
        var items = $(selector).find("*[data-mapkey-url]");
        if (items.length === 0) {
            return;
        }

        // For each item.
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            // Add the event listener.
            $(item).on("input", function(event) {
                event.stopPropagation();

                // Convert the value to a valid url.
                $(this).val(Softaware.TextUtils.textToUrl($(this).val()));

                // Do not propagate.
                return false;
            });
        }
    };
    /**
     * Manage the attribute data-mapkey-lang.
     * <br/><br/>
     * The value of the data-mapkey-lang must be a target and a source language separated with underscore (_).<br/>
     * When the users presses a key then if the key is included in the source language map, it will be convertet to the target language character.
     * 
     * @param {type} selector to search for elements with this attribute.
     * @returns {void}
     */
    this.mapkeyLang = function(selector) {
        this.getLanguageMapper = function(languageSource, languageTarget) {
            // Check if the map is already defined.
            if (typeof langugageCharMap === "undefined") {
                langugageCharMap = {};
            }
            if (typeof langugageCharMap[languageSource] === "undefined") {
                langugageCharMap[languageSource] = {};
            }

            // Initialize or get the language mapper.
            if (typeof langugageCharMap[languageSource][languageTarget] === "undefined") {
                switch (languageSource) {
                    case Softaware.Type.Language.GR:
                        switch (languageTarget) {
                            case Softaware.Type.Language.EN:
                                langugageCharMap[languageSource][languageTarget] = {
                                    "α": "a",
                                    "ά": "a",
                                    "β": "b",
                                    "γ": "g",
                                    "δ": "d",
                                    "ε": "e",
                                    "έ": "e",
                                    "ζ": "z",
                                    "η": "h",
                                    "ή": "h",
                                    "θ": "th",
                                    "ι": "i",
                                    "ί": "i",
                                    "ϊ": "i",
                                    "ΐ": "i",
                                    "κ": "k",
                                    "λ": "l",
                                    "μ": "m",
                                    "ν": "n",
                                    "ξ": "ks",
                                    "ο": "o",
                                    "ό": "o",
                                    "π": "p",
                                    "ρ": "r",
                                    "σ": "s",
                                    "ς": "s",
                                    "τ": "t",
                                    "υ": "y",
                                    "ύ": "y",
                                    "ϋ": "y",
                                    "ΰ": "y",
                                    "φ": "f",
                                    "χ": "x",
                                    "ψ": "ps",
                                    "ω": "o",
                                    "ώ": "o",
                                    "Α": "A",
                                    "Ά": "A",
                                    "Β": "B",
                                    "Γ": "G",
                                    "Δ": "D",
                                    "Ε": "E",
                                    "Έ": "E",
                                    "Ζ": "Z",
                                    "Η": "H",
                                    "Ή": "H",
                                    "Θ": "TH",
                                    "Ι": "I",
                                    "Ί": "I",
                                    "Ϊ": "I",
                                    "Κ": "K",
                                    "Λ": "L",
                                    "Μ": "M",
                                    "Ν": "N",
                                    "Ξ": "KS",
                                    "Ο": "O",
                                    "Ό": "O",
                                    "Π": "P",
                                    "Ρ": "R",
                                    "Σ": "S",
                                    "Τ": "T",
                                    "Υ": "Y",
                                    "Ύ": "Y",
                                    "Ϋ": "Y",
                                    "Φ": "F",
                                    "Χ": "X",
                                    "Ψ": "PS",
                                    "Ω": "O",
                                    "Ώ": "O"
                                };
                                break;
                            case Softaware.Type.Language.GR:
                            default:
                                throw new Softaware.Exception.IllegalStateException("Language(" + languageTarget + ") is not supported as target for Language(" + languageSource + ").");
                        }
                        break;
                    case Softaware.Type.Language.EN:
                    default:
                        throw new Softaware.Exception.IllegalStateException("Language(" + languageSource + ") is not supported as source.");
                }
            }

            return langugageCharMap[languageSource][languageTarget];
        };
        // Check the existance of the attribute.
        var items = $(selector).find("*[data-mapkey-lang]");
        if (items.length === 0) {
            return;
        }

        // For each item.
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            // Get the source and target language.
            var languages = $(item).attr("data-mapkey-lang");
            var languageSource = languages.split("_")[0];
            var languageTarget = languages.split("_")[1];

            // Add the event listener.
            var self = this;
            $(item).keypress(function(event) {
                event.stopPropagation();
                // Get the mapper to use.
                var mapper = self.getLanguageMapper(languageSource, languageTarget);
                // Get the key pressed.
                var keyPressed = String.fromCharCode(event.which);
                // Get the key to set. In case it doesn't exist in the mapper, get the key pressed.
                var keyToSet = mapper[keyPressed] || keyPressed;
                // Set the key to the dom.
                this.value = this.value + keyToSet;

                // Do not propagate.
                return false;
            });
        }
    };
    /**
     * Manage the attribute data-bind-target.
     * <br/><br/>
     * The value of the data-bind-target must be a selector of a type.<br/>
     * 
     * @param {type} selector
     * @returns {undefined}
     */
    this.binding = function(selector) {
        // Check the existance of the attribute.
        var items = $(selector).find("*[data-bind-target]");
        if (items.length === 0) {
            return;
        }

        // For each one add a listener.
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            // INPUT[TEXT] OR TEXTAREA.
            if ($(item).is("input[type='text']") || $(item).is("textarea")) {
                //                    $(item).on("propertychange change keypress paste input", function (event) {
                $(item).on("input", function(event) {
                    event.stopPropagation();

                    var sourceText = $(this).val(); // The text of this input[type='text'] or textareaa.

                    // For each target of this bind source, update the content.
                    var targetElements = $($(this).attr("data-bind-target"));
                    for (var j = 0; j < targetElements.length; j++) {
                        Softaware.TextUtils.textToElement(sourceText, $(targetElements[j]));

                        // Trigger the change event.
                        if ($(targetElements[j]) !== $(this)) {
                            $(targetElements[j]).trigger("input");
                        }
                    }

                    return false;
                });
            }
        }
    };
    /**
     * Set the attribute data-tinyMceEditor only in a textarea element. The
     * textarea will be upgraded to a tinyMce editor. Uses the wrapper
     * Softaware.Module.TextEdirorTinyMCE for this library.
     * <br/>
     * In case you have already define an id for the textarea, the value of the
     * data-tinyMceEditor will be ignored. Alternative it will be set and used
     * as the element id.
     * <br/>
     * In case you haven't define an id and a value for the data attribute,
     * this method will generate one for both of them like "tinyMceEditor-[\d]".
     * 
     * @param {type} selector
     * @returns {undefined}
     */
    this.tinyMceEditor = function(selector) {
        // Get the textareas that will have tinyMce.
        var elements = $(selector).find("textarea[data-tinyMceEditor]");
        if (elements.length === 0) {
            return;
        }

        // Initialize the cache.
        if (typeof Softaware.Cache.tinyMceEditor === "undefined") {
            Softaware.Cache.tinyMceEditor = [];
        }

        // For each one generate the id and add the module.
        for (var i = 0; i < elements.length; i++) {
            // Check if the name is defined.
            var elementName = $(elements[i]).attr("name");
            if (typeof elementName === "undefined" || elementName.length === 0) {
                console.log("data-tinyMceEditor is defined without the attribute name defined.");
                continue;
            }

            // Check if the element includes an id.
            var elementId = $(elements[i]).attr("data-tinyMceEditor");
            if (typeof elementId === "undefined" || elementId.length === 0) {
                // Check if an identifier is defined in the data attribute.
                var tinyMceId = $(elements[i]).attr("data-tinyMceEditor");
                if (typeof tinyMceId === "undefined" || tinyMceId.length === 0) {
                    // Define it.
                    tinyMceId = "tinyMceEditor-" + i;
                    $(elements[i]).attr("data-tinyMceEditor", tinyMceId);
                    elementId = tinyMceId;
                }
                $(elements[i]).attr("id", elementId);
            }

            // Add the module.
            Softaware.Cache.tinyMceEditor.push({
                "domId": elementId,
                "module": new Softaware.Module.TextEdirorTinyMCE({
                    selector: elementId,
                    renderAttribute: elementName
                })
            });
        }
    };
    /**
     * Manage the attribute data-colorpicker.
     * <br/><br/>
     * The value of the data-colorpicker will be ignored.<br/>
     * 
     * @param {type} selector
     * @returns {undefined}
     */
    this.colorpicker = function(selector) {
        // Check the existance of the attribute.
        var items = $(selector).find("*[data-colorpicker]");
        if (items.length === 0) {
            return;
        }

        // Check the existance of the library.    
        if (typeof($.fn.colorpicker) !== "function") {
            throw "colorpicker library is missing.";
        }

        // For each item.
        $("*[data-colorpicker]").colorpicker();
    };
    /**
     * Set the attribute data-spectrum in input type text. It will hide the
     * input and show the spectrum tool for color selection.
     * 
     * @param {type} selector
     * @returns {undefined}
     */
    this.spectrum = function(selector) {
        // Get the textareas that will have tinyMce.
        var elements = $(selector).find("input[type='text'][data-spectrum]");
        if (elements.length === 0) {
            return;
        }

        // Check the existance of the library.    
        if (typeof($.fn.spectrum) !== "function") {
            throw "spectrum library is missing.";
        }

        // For each one generate the id and add the module.
        for (var i = 0; i < elements.length; i++) {
            // Check if the element includes an id.
            var elementId = $(elements[i]).attr("data-spectrum");
            if (typeof elementId === "undefined" || elementId.length === 0) {
                // Check if an identifier is defined in the data attribute.
                var spectrumId = $(elements[i]).attr("data-spectrum");
                if (typeof spectrumId === "undefined" || spectrumId.length === 0) {
                    // Define it.
                    spectrumId = "spectrum-" + i;
                    $(elements[i]).attr("data-spectrum", spectrumId);
                    elementId = spectrumId;
                }
                $(elements[i]).attr("id", elementId);
            }

            // Add the module.
            $("#" + spectrumId).spectrum({
                preferredFormat: "hex",
                replacerClassName: "form-control",
                showInput: true
            });
        }
    };
    /**
     * Set the attribute data-typeAhead in an input element to make it use the
     * typeahaid library with auto complete functionallity.<br/>
     * The data to use will be fetch by a url set in the data-typeAhead-url
     * attribute.<br/>
     * The template to use to generate the array of data will be set in the
     * data-typeAhead-template attribute. In case the fetched data are in an
     * array then this attribute must be ignored.<br/>
     * <br/>
     * Example:
     * 
     * @param {type} selector
     * @returns {undefined}
     */
    this.autoCompleteTypeAhead = function(selector) {
        // Get the textareas that will have tinyMce.
        var elements = $(selector).find("input[data-typeAhead]");
        if (elements.length === 0) {
            return;
        }

        // Library existance.
        if (typeof($.fn.typeahead) !== "function") {
            throw "typeahead library is missing.";
        }

        // For each one generate the id and add the module.
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var url = $(element).attr("data-typeAhead-url");
            var template = $(element).attr("data-typeAhead-template");
            Softaware.Service.readAll(url, {
                success: function(models) {
                    var datas = [];
                    if (typeof template === "undefined") {
                        datas = models;
                    } else {
                        for (var i = 0; i < models.length; i++) {
                            datas.push(Softaware.Utilities.textFromTemplate(template, models[i]));
                        }
                    }
                    $(element).typeahead({
                        source: datas
                    });
                }
            });
        }
    }; {
        // Check the argument.
        this.domSelector = typeof domSelector === "undefined" ? "body" : domSelector;

        // For each autoconfig.
        this.daterangepicker(domSelector); // data-daterangepicker
        this.datepicker(domSelector); // data-datepicker
        this.selectFromEnum(domSelector); // data-select-enum [data-select-enum-key]
        this.selectFromUrl(domSelector); // data-select-url [data-select-url-value] [data-select-url-text] [data-select-callback] [data-select-editable]
        this.mapkeyArray(domSelector); // data-mapkey-array
        this.mapkeyAsUrl(domSelector); // data-mapkey-url
        this.mapkeyLang(domSelector); // data-mapkey-lang
        this.binding(domSelector); // data-bind-target
        this.autoCompleteTypeAhead(domSelector); // data-typeAhead

        // Color pickers.
        this.colorpicker(domSelector); // data-colorpicker
        this.spectrum(domSelector); // data-spectrum

        // Wrapped.
        this.tinyMceEditor(domSelector); // data-tinyMceEditor
    }
}

/**
 * Bugs Report.
 * Softaware.Modal.Delete -> Sends body with the model that is not required.
 */