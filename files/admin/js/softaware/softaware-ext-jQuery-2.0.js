/* global Softaware */

/**
 * JQuery extension. Supports custom methods.
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
    $.fn.resetForm = function() {
        if ($.type(this) === "undefined")
            return false;

        // Form inputs.
        this.find("input:text, input:password, input:file, select, textarea").val("");
        this.find("input:radio, input:checkbox").attr("checked", false);
        this.find("input:radio, input:checkbox").attr("selected", false);
        this.find("input:radio, input:checkbox").each(function() {
            $(this).parent().removeClass("active");
        });

        // Has error fields.
        this.find(".has-error").each(function() {
            $(this).removeClass("has-error");
        });

        // Disabled fields.
        this.find("*[disabled]").removeAttr("disabled");
    };
    $.fn.serializeObject = function() {
        var object = {};
        var array = this.serializeArray();
        $.each(array, function() {
            if (object[this.name] !== undefined) {
                if (!object[this.name].push) {
                    object[this.name] = [object[this.name]];
                }
                object[this.name].push(this.value || "");
            } else {
                object[this.name] = this.value || "";
            }
        });
        return object;
    };
    $.fn.initSelectFromEnumeration = function(enumeration, attributeName, attributeValue) {
        if (typeof(attributeName) === "undefined") {
            attributeName = "name";
        }

        var self = this;

        $.each(enumeration, function(key, value) {
            var option = "<option value='" + (typeof(attributeValue) !== "undefined" && value[attributeValue] ? value[attributeValue] : key) + "'>" + value[attributeName] + "</option>";
            $(self).append(option);
        });
    };
    $.fn.initialSelectValue = function(text) {
        $(this).append($("<option></option>").attr("value", "-1")
            .attr("selected", "selected")
            .attr("disabled", "disabled")
            .text(text));
    };
    $.fn.initSelectFromDatas = function(datas, valueAttr, textAttr, extraAttr) {
        if (typeof(datas) === "undefined") {
            return;
        }
        var self = this;

        $.each(datas, function(key, data) {
            // Compute the text of the options.
            var textToShow = "";
            if (textAttr instanceof Array) {
                for (var i = 0; i < textAttr.length; i++) {
                    textToShow += Softaware.Utilities.jsonPathToValue(data, textAttr[i]);
                }
            } else {
                textToShow = Softaware.Utilities.jsonPathToValue(data, textAttr);
            }

            // More attributes.
            var attributesToAdd = "";
            if (typeof(extraAttr) !== "undefined") {
                for (var key in extraAttr) {
                    var value = "";
                    if (extraAttr[key] instanceof Array) {
                        for (var i = 0; i < extraAttr[key].length; i++) {
                            value += Softaware.Utilities.jsonPathToValue(data, extraAttr[key][i]);
                        }
                    } else {
                        value += Softaware.Utilities.jsonPathToValue(data, extraAttr[key]);
                    }
                    attributesToAdd += " " + key + "='" + value + "'";
                }
            }

            var option = "<option value='" + data[valueAttr] + "'" + attributesToAdd + ">" + textToShow + "</option>";
            $(self).append(option);
        });
    };
    $.fn.formFieldsToArray = function() {
        var fields = [];
        fields = fields.concat($(this).find("input").toArray());
        fields = fields.concat($(this).find("select").toArray());
        fields = fields.concat($(this).find("textarea").toArray());
        return fields;
    };
    $.fn.addBracketsInName = function(index) {
        var fieldName = $(this).attr("name");
        var prependName = fieldName.substring(0, fieldName.lastIndexOf("."));
        var appendName = fieldName.substring(fieldName.lastIndexOf(".") + 1);
        $(this).attr("name", prependName + "[" + index + "]." + appendName);

        return true;
    };
    $.fn.removeBracketsInName = function() {
        var fieldName = $(this).attr("name");

        // Check if the field includes brackets.
        var startIndex = fieldName.regexIndexOf(/\[\d+\]\./);
        if (startIndex === -1) {
            return false;
        }
        var endIndex = fieldName.regexIndexOf(/\]\./);

        // Create the name.
        var prependName = fieldName.substring(0, startIndex);
        var appendName = fieldName.substring(endIndex + 1);
        $(this).attr("name", prependName + appendName);

        return true;
    };
    $.fn.isFormElement = function() {
        return $(this).is("input") || $(this).is("select") || $(this).is("textarea");
    };
    //    //=> Is this needed?
    if ($.fn.dataTableExt && $.fn.dataTableExt.oApi) {
        $.fn.dataTableExt.oApi.fnStandingRedraw = function(oSettings) {
            // redraw to account for filtering and sorting
            // concept here is that (for client side) there is a row got inserted at the end (for an add)
            // or when a record was modified it could be in the middle of the table
            // that is probably not supposed to be there - due to filtering / sorting
            // so we need to re process filtering and sorting
            // BUT - if it is server side - then this should be handled by the server - so skip this step
            if (oSettings.oFeatures.bServerSide === false) {
                var before = oSettings._iDisplayStart;
                oSettings.oApi._fnReDraw(oSettings);
                //iDisplayStart has been reset to zero - so lets change it back
                oSettings._iDisplayStart = before;
                oSettings.oApi._fnCalculateEnd(oSettings);
            }

            //draw the "current" page
            oSettings.oApi._fnDraw(oSettings);
        };
    }
    $.fn.hasFile = function() {
        if ($.type(this) === "undefined")
            return false;

        var hasFile = false;
        $.each($(this).find(":file"), function(key, input) {
            if ($(input).val().length > 0) {
                hasFile = true;
            }
        });

        return hasFile;
    };
    $.fn.disableMe = function() {
        // Validate.
        if ($.type(this) === "undefined")
            return false;

        // Disable only input elements.
        if ($(this).is("input") || $(this).is("select") || $(this).is("textarea")) {
            // In case it is a radio inside a label.
            if ($(this).is("[type='radio']") && $(this).parent().is("label.btn")) {
                $("input[name='safeHtml']").closest("label").addClass("disabled");
                $(this).closest("div").css("pointer-events", "none");
            }

            // General input disable.
            $(this).prop("disabled", true);
        }
    };
    $.fn.enableMe = function() {
        // Validate.
        if ($.type(this) === "undefined")
            return false;

        // Enable only input elements.
        if ($(this).is("input") || $(this).is("select") || $(this).is("textarea")) {
            // In case it is a radio inside a label.
            if ($(this).is("[type='radio']") && $(this).parent().is("label.btn")) {
                $("input[name='safeHtml']").closest("label").removeClass("disabled");
                $(this).closest("div").css("pointer-events", "auto");
            }

            // General input enable.
            $(this).prop("disabled", false);
        }
    };
    $.fn.toggleDisable = function() {
        if ($.type(this) === "undefined")
            return false;

        // Toggle only input elements.
        if ($(this).is("input") || $(this).is("select") || $(this).is("textarea")) {
            var isDisabled = $(this).is(":disabled");

            // In case it is a radio inside a label.
            if ($(this).is("[type='radio']") && $(this).parent().is("label.btn")) {
                $("input[name='safeHtml']").closest("label").toggleClass("disabled");
                $(this).closest("div").css("pointer-events", isDisabled ? "auto" : "none");
            }

            // General input enale.
            $(this).prop("disabled", !isDisabled);
        }
    };
}(jQuery));