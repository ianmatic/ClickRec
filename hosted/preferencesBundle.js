"use strict";

var csrf = void 0;

var wishListPicker = void 0;
var inProgressPicker = void 0;
var completePicker = void 0;

var wishListSavedColor = void 0;
var inProgressSavedColor = void 0;
var completeSavedColor = void 0;

var savedLayout = void 0,
    savedSizingType = void 0,
    savedSizingValue = void 0;
var savedTypes = void 0;
var savedTheme = void 0;

// Handles changing colors
var handleColorChange = function handleColorChange(e) {
    e.preventDefault();

    // get the 3 colors
    var wishListColor = wishListPicker.getColor().toHEXA().toString(0);
    var inProgressColor = inProgressPicker.getColor().toHEXA().toString(0);
    var completeColor = completePicker.getColor().toHEXA().toString(0);

    // get the theme
    var theme = $("#themeField").val();

    // construct url
    var url = "wishList=" + wishListColor + "&inProgress=" + inProgressColor + "&complete=" + completeColor + "&theme=" + theme + "&_csrf=" + csrf;

    // change colors
    sendAjax('PUT', $("#changeColorForm").attr("action"), url, function () {
        handleSuccess();

        // reload theme
        sendAjax('GET', '/getPreferences', null, function (result) {

            // apply dark theme if enabled
            if (result.theme == "dark") {
                $('link[data-name="darkStyle"]').prop('disabled', false);
                $('link[data-name="lightStyle"]').prop('disabled', true);
            } else {
                $('link[data-name="darkStyle"]').prop('disabled', true);
                $('link[data-name="lightStyle"]').prop('disabled', false);
            }
        });
    });

    return false;
};

// Handles updating layout
var handleLayoutChange = function handleLayoutChange(e) {
    e.preventDefault();
    // change layout
    sendAjax('PUT', $("#changeLayoutForm").attr("action"), $("#changeLayoutForm").serialize(), function (result) {
        handleSuccess();
    });

    return false;
};

// Handles updating types
var handleTypesChange = function handleTypesChange(e) {
    e.preventDefault();
    var submitString = "";
    var array = [];
    $(".typeItem").each(function () {
        array.push(this.getAttribute("data-serverdata"));
    });
    // change types
    sendAjax('PUT', $("#changeTypesForm").attr("action"), "data=" + JSON.stringify(array) + "&_csrf=" + csrf, function (result) {
        handleSuccess();
    });

    return false;
};

// Handles adding a new type to the list (not saving)
var handleAddType = function handleAddType(e) {
    e.preventDefault();
    // change layout
    e.preventDefault();
    var val = document.querySelector("#addTextInput").value;
    $("#typesList").append("<li data-serverdata=" + val + " class=\"typeItem\"><span>" + val + "</span><button class=\"btn btn-primary\"><i class=\"far fa-edit fa-lg\"></i></button></li>");
    $("#addTextInput").val('');
    return false;
};

// Info Page
var MainWindow = function MainWindow(props) {
    return (
        // below top header
        React.createElement(
            "div",
            { className: "windowContainer" },
            React.createElement(
                "header",
                { className: "titleHeader" },
                React.createElement(
                    "h1",
                    { className: "title" },
                    "My Preferences"
                ),
                React.createElement(
                    "h2",
                    { className: "subtitle" },
                    "Change colors and the layout here. ",
                    React.createElement(
                        "a",
                        { id: "homeLink", href: "/" },
                        "Home"
                    ),
                    "."
                )
            ),
            React.createElement(
                "div",
                { className: "window", id: "settingsMainWindow" },
                React.createElement(
                    "h5",
                    { id: "windowTitle" },
                    "Preferences"
                ),
                React.createElement(
                    "div",
                    { className: "preferenceWrapper", id: "colorsInfo" },
                    React.createElement(
                        "p",
                        { className: "preferenceTitle" },
                        "Colors:"
                    ),
                    React.createElement(
                        "div",
                        { className: "colorsContainer" },
                        React.createElement(
                            "div",
                            { className: "colorWrapper" },
                            React.createElement(
                                "p",
                                { className: "colorTitle" },
                                "Wish List"
                            ),
                            React.createElement("div", { id: "wishListPreview", className: "colorPreview wishList" })
                        ),
                        React.createElement(
                            "div",
                            { className: "colorWrapper" },
                            React.createElement(
                                "p",
                                { className: "colorTitle" },
                                "In Progress"
                            ),
                            React.createElement("div", { id: "inProgressPreview", className: "colorPreview inProgress" })
                        ),
                        React.createElement(
                            "div",
                            { className: "colorWrapper" },
                            React.createElement(
                                "p",
                                { className: "colorTitle" },
                                "Complete"
                            ),
                            React.createElement("div", { id: "completePreview", className: "colorPreview complete" })
                        )
                    ),
                    React.createElement(
                        "p",
                        { className: "preferenceTitle" },
                        "Theme:"
                    ),
                    React.createElement(
                        "p",
                        { id: "themeText" },
                        "" + savedTheme
                    ),
                    React.createElement(
                        "a",
                        { href: "", id: "changeColorsLink" },
                        "Change Colors"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "preferenceWrapper", id: "layoutInfo" },
                    React.createElement(
                        "p",
                        { className: "preferenceTitle" },
                        "Layout:"
                    ),
                    React.createElement(
                        "p",
                        { id: "layoutText" },
                        "" + savedLayout
                    ),
                    React.createElement(
                        "p",
                        { className: "preferenceTitle" },
                        "Sizing (Grid Only):"
                    ),
                    React.createElement(
                        "p",
                        { id: "sizingText" },
                        "" + savedSizingType
                    ),
                    React.createElement(
                        "a",
                        { href: "", id: "changeLayoutLink" },
                        "Change Layout"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "preferenceWrapper", id: "typesInfo" },
                    React.createElement(
                        "p",
                        { className: "preferenceTitle" },
                        "Types:"
                    ),
                    React.createElement(
                        "p",
                        { id: "typeText" },
                        "" + savedTypes
                    ),
                    React.createElement(
                        "a",
                        { href: "", id: "changeTypesLink" },
                        "Change Types"
                    )
                ),
                React.createElement(
                    "div",
                    { id: "mainPreviewPage" },
                    React.createElement(
                        "label",
                        { "for": "targetFrame" },
                        "Preview:"
                    ),
                    React.createElement("iframe", { className: "preview", id: "mainPreview", src: "main.html", tabindex: "-1", name: "targetframe", allowTransparency: "true", scrolling: "no", frameborder: "0" })
                )
            )
        )
    );
};

// change colors window with form
var ChangeColorsWindow = function ChangeColorsWindow(props) {
    return (
        // below top header
        React.createElement(
            "div",
            { className: "windowContainer" },
            React.createElement(
                "header",
                { className: "titleHeader" },
                React.createElement(
                    "h1",
                    { className: "title" },
                    "Change Your Colors"
                ),
                React.createElement(
                    "h2",
                    { className: "subtitle" },
                    "Pick and choose the colors you'd prefer to use"
                )
            ),
            React.createElement(
                "div",
                { className: "window" },
                React.createElement("p", { id: "errorMessage" }),
                React.createElement(
                    "form",
                    { id: "changeColorForm",
                        name: "changeColorForm",
                        onSubmit: handleColorChange,
                        action: "/changeColors",
                        method: "PUT",
                        className: "startForm"
                    },
                    React.createElement(
                        "div",
                        { id: "colorPreviewPage" },
                        React.createElement(
                            "p",
                            null,
                            "Preview"
                        ),
                        React.createElement("iframe", { className: "preview", src: "main.html", tabindex: "-1", name: "targetframe", allowTransparency: "true", scrolling: "no", frameborder: "0" })
                    ),
                    React.createElement(
                        "div",
                        { className: "inputWrapper" },
                        React.createElement(
                            "label",
                            { htmlFor: "wishlist" },
                            "Wishlist "
                        ),
                        React.createElement("input", { id: "wishlistColor", type: "button", className: "wishListPickr", name: "wishlist" })
                    ),
                    React.createElement(
                        "div",
                        { className: "inputWrapper" },
                        React.createElement(
                            "label",
                            { htmlFor: "inProgress" },
                            "In Progress "
                        ),
                        React.createElement("input", { id: "inProgressColor", type: "button", className: "inProgressPickr", name: "inProgress" })
                    ),
                    React.createElement(
                        "div",
                        { className: "inputWrapper" },
                        React.createElement(
                            "label",
                            { htmlFor: "complete" },
                            "Complete "
                        ),
                        React.createElement("input", { id: "completeColor", type: "button", className: "completePickr", name: "complete" })
                    ),
                    React.createElement(
                        "div",
                        { className: "inputWrapper" },
                        React.createElement(
                            "label",
                            { htmlFor: "theme" },
                            "Theme"
                        ),
                        React.createElement("br", null),
                        React.createElement(
                            "select",
                            { className: "custom-select", id: "themeField", name: "theme", required: true },
                            React.createElement(
                                "option",
                                { value: "light" },
                                "Light"
                            ),
                            React.createElement(
                                "option",
                                { value: "dark" },
                                "Dark"
                            )
                        )
                    ),
                    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                    React.createElement(
                        "div",
                        { id: "submitWrapper" },
                        React.createElement(
                            "button",
                            { type: "button", className: "btn btn-outline-primary returnButton" },
                            React.createElement("i", { className: "fas fa-arrow-left" })
                        ),
                        React.createElement("input", { className: "startSubmit btn btn-outline-primary", type: "submit", value: "Save Colors" })
                    )
                ),
                React.createElement("p", { id: "successMessage" })
            )
        )
    );
};

// Change Layout Page
var ChangeLayoutWindow = function ChangeLayoutWindow(props) {
    return (
        // below top header
        React.createElement(
            "div",
            { className: "windowContainer" },
            React.createElement(
                "header",
                { className: "titleHeader" },
                React.createElement(
                    "h1",
                    { className: "title" },
                    "Update Your Layout"
                ),
                React.createElement(
                    "h2",
                    { className: "subtitle" },
                    "Select the layout you'd prefer to use"
                )
            ),
            React.createElement(
                "div",
                { className: "window" },
                React.createElement("p", { id: "errorMessage" }),
                React.createElement(
                    "form",
                    { id: "changeLayoutForm",
                        name: "changeLayoutForm",
                        onSubmit: handleLayoutChange,
                        action: "/changeLayout",
                        method: "PUT",
                        className: "startForm"
                    },
                    React.createElement(
                        "div",
                        { id: "layoutPreviewPage" },
                        React.createElement(
                            "p",
                            null,
                            "Preview"
                        ),
                        React.createElement("iframe", { className: "preview", src: "main.html", tabindex: "-1", name: "targetframe", allowTransparency: "true", scrolling: "no", frameborder: "0" })
                    ),
                    React.createElement(
                        "div",
                        { className: "inputWrapper" },
                        React.createElement(
                            "label",
                            { htmlFor: "layout" },
                            "Layout"
                        ),
                        React.createElement("br", null),
                        React.createElement(
                            "select",
                            { className: "custom-select", id: "layoutField", name: "layout", required: true },
                            React.createElement(
                                "option",
                                { value: "table" },
                                "Table"
                            ),
                            React.createElement(
                                "option",
                                { value: "grid" },
                                "Grid"
                            )
                        )
                    ),
                    " ",
                    React.createElement("br", null),
                    React.createElement(
                        "div",
                        { className: "inputWrapper" },
                        React.createElement(
                            "label",
                            { htmlFor: "sizingType" },
                            "Sizing (Grid Only)"
                        ),
                        React.createElement("br", null),
                        React.createElement(
                            "select",
                            { className: "custom-select", id: "sizingTypeField", name: "sizingType", required: true },
                            React.createElement(
                                "option",
                                { value: "auto" },
                                "Auto"
                            ),
                            React.createElement(
                                "option",
                                { value: "custom" },
                                "Custom"
                            )
                        )
                    ),
                    React.createElement("input", { type: "range", name: "sizingValue", className: "custom-range", min: "100", max: "500", step: "50", id: "sizingValueRange" }),
                    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                    React.createElement(
                        "div",
                        { id: "submitWrapper" },
                        React.createElement(
                            "button",
                            { type: "button", className: "btn btn-outline-primary returnButton" },
                            React.createElement("i", { className: "fas fa-arrow-left" })
                        ),
                        React.createElement("input", { className: "startSubmit btn btn-outline-primary", type: "submit", value: "Save Layout" })
                    )
                ),
                React.createElement("p", { id: "successMessage" })
            )
        )
    );
};

// Change Types Page
var ChangeTypesWindow = function ChangeTypesWindow(props) {
    return (
        // below top header
        React.createElement(
            "div",
            { className: "windowContainer" },
            React.createElement(
                "header",
                { className: "titleHeader" },
                React.createElement(
                    "h1",
                    { className: "title" },
                    "Change Your Types"
                ),
                React.createElement(
                    "h2",
                    { className: "subtitle" },
                    "Add, Remove, Or Edit The Types You'd Like To Use"
                )
            ),
            React.createElement(
                "div",
                { className: "window" },
                React.createElement("p", { id: "errorMessage" }),
                React.createElement(
                    "div",
                    { id: "manageTypesWrapper" },
                    React.createElement(
                        "form",
                        { id: "addTypeInput",
                            className: "input-group",
                            onSubmit: handleAddType
                        },
                        React.createElement("input", { id: "addTextInput", type: "text", className: "form-control", placeholder: "New Type", required: true }),
                        React.createElement(
                            "div",
                            { className: "input-group-append" },
                            React.createElement("input", { className: "btn btn-outline-primary", type: "submit", id: "addTypeButton", value: "Add" })
                        )
                    ),
                    React.createElement("i", { className: "fas fa-trash", id: "deleteTypeButton" })
                ),
                React.createElement(
                    "form",
                    { id: "changeTypesForm",
                        name: "changeTypesForm",
                        onSubmit: handleTypesChange,
                        action: "/changeTypes",
                        method: "PUT",
                        className: "startForm"
                    },
                    React.createElement(
                        "div",
                        { className: "inputWrapper", id: "typesLabel" },
                        React.createElement(
                            "label",
                            { htmlFor: "Types" },
                            "Types:"
                        ),
                        React.createElement("br", null)
                    ),
                    React.createElement("div", { id: "typesListContainer" }),
                    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                    React.createElement(
                        "div",
                        { id: "submitWrapper" },
                        React.createElement(
                            "button",
                            { type: "button", className: "btn btn-outline-primary returnButton" },
                            React.createElement("i", { className: "fas fa-arrow-left" })
                        ),
                        React.createElement("input", { className: "startSubmit btn btn-outline-primary", type: "submit", value: "Save Types" })
                    )
                ),
                React.createElement("p", { id: "successMessage" })
            )
        )
    );
};

// render a new change password window
var createChangeColorWindow = function createChangeColorWindow(csrf) {
    ReactDOM.render(React.createElement(ChangeColorsWindow, { csrf: csrf }), document.querySelector("#preferencesContent"));

    // setup color pickers
    // wishlist
    wishListPicker = Pickr.create({
        el: '.wishListPickr',
        theme: 'nano',

        swatches: null,
        comparison: false,

        default: wishListSavedColor,

        components: {

            // Main components
            preview: true,
            hue: true,

            // Input / output Options
            interaction: {
                input: true,
                hex: true,
                rgba: true
            }
        }
    }).on('change', function (color) {
        $("iframe").contents().find(".wishList").attr('style', 'background-color: ' + color.toHEXA().toString(0) + " !important");
    });
    // in progress
    inProgressPicker = Pickr.create({
        el: '.inProgressPickr',
        theme: 'nano',

        swatches: null,
        comparison: false,

        default: inProgressSavedColor,

        components: {

            // Main components
            preview: true,
            hue: true,

            // Input / output Options
            interaction: {
                input: true,
                hex: true,
                rgba: true
            }
        }
    }).on('change', function (color) {
        $("iframe").contents().find(".inProgress").attr('style', 'background-color: ' + color.toHEXA().toString(0) + " !important");
    });
    // complete
    completePicker = Pickr.create({
        el: '.completePickr',
        theme: 'nano',

        swatches: null,
        comparison: false,

        default: completeSavedColor,

        components: {

            // Main components
            preview: true,
            hue: true,

            // Input / output Options
            interaction: {
                input: true,
                hex: true,
                rgba: true
            }
        }
    }).on('change', function (color) {
        $("iframe").contents().find(".complete").attr('style', 'background-color: ' + color.toHEXA().toString(0) + " !important");
    });

    // setup theme select
    // update select to loaded value
    $("#themeField option[value=" + savedTheme).prop('selected', 'selected');

    // update preview on change
    $('#themeField').on('change', function (e) {
        document.querySelector('iframe').contentWindow.loadContentFromServer(savedLayout, this.value, savedSizingValue);
    });

    // setup back button
    $(".returnButton").click(function (e) {
        e.preventDefault();
        setup(csrf);
    });
};

// render a new change layout window
var createChangeLayoutWindow = function createChangeLayoutWindow(csrf) {
    ReactDOM.render(React.createElement(ChangeLayoutWindow, { csrf: csrf }), document.querySelector("#preferencesContent"));

    // update select to loaded value
    $("#layoutField option[value=" + savedLayout).prop('selected', 'selected');
    $("#sizingTypeField option[value=" + savedSizingType + "]").prop('selected', 'selected');
    document.querySelector("#sizingValueRange").style.display = savedSizingType === "auto" && "none" || "inline-block";
    document.querySelector("#sizingValueRange").value = parseInt(savedSizingValue, 10);

    // update preview on change
    $('#layoutField').on('change', function (e) {
        document.querySelector('iframe').contentWindow.loadContentFromServer(this.value, savedTheme, $("#sizingValueRange").val());
    });
    $("#sizingTypeField").on('change', function (e) {
        // toggle range
        document.querySelector("#sizingValueRange").style.display = this.value === "auto" && "none" || "inline-block";
        document.querySelector("#sizingValueRange").value = this.value === "auto" && "300px" || parseInt(savedSizingValue, 10);
        document.querySelector('iframe').contentWindow.loadContentFromServer($('#layoutField').val(), savedTheme, $("#sizingValueRange").val());
    });
    $("#sizingValueRange").on('input', function (e) {
        if (savedLayout === "grid") {
            var value = parseInt(this.value, 10);
            $("iframe").contents().find(".gridItemWrapper").css("height", this.value);
            $("iframe").contents().find(".gridItemWrapper").css("width", value * 0.67 + "px");
            $("iframe").contents().find(".gridItemType, .gridItemName").css('font-size', value / 16.67 + "px");
            $("iframe").contents().find(".gridItemNotes").css('font-size', value / 20 + "px");
            $("iframe").contents().find(".gridDropDownWrapper, .gridItemDeleteButton i").css('transform', "scale(" + value / 400);
        }
    });

    // setup back button
    $(".returnButton").click(function (e) {
        e.preventDefault();
        setup(csrf);
    });
};

// helper function for toggling functionality of edit type buttons
function SetupEditTypeButtons() {
    // setup edit buttons
    $(".editTypeButton").click(function (e) {
        e.preventDefault();
        var span = $(this).siblings();
        // disable
        if (span.attr('contenteditable') === "true") {
            span[0].focus();
            span.attr('contenteditable', 'false');
            span.css('text-overflow', 'ellipsis');
            this.className = "far fa-edit editTypeButton fa-lg";
            this.parentElement.setAttribute("data-serverdata", span.text());
        }
        // enable
        else {
                span.attr('contenteditable', 'true');
                span[0].focus();
                span.css('text-overflow', 'inherit');
                this.className = "far fa-save editTypeButton fa-lg";
            }
    });
}

// render a new change types window
var createChangeTypesWindow = function createChangeTypesWindow(csrf) {
    ReactDOM.render(React.createElement(ChangeTypesWindow, { csrf: csrf }), document.querySelector("#preferencesContent"));

    // render list of types
    ReactDOM.render(React.createElement(TypesList, { types: savedTypes }), document.querySelector("#typesListContainer"));
    // setup delete button
    $("#deleteTypeButton").click(function (e) {
        $(".typeItem").each(function () {
            $(this).find('span').attr('contenteditable', 'false');
        });
        if ($("#deleteTypeButton").hasClass("saveDeletion")) {
            $(".typeItem").each(function () {
                $(this).find('i')[0].className = 'far fa-edit editTypeButton fa-lg';
                if ($(this).hasClass("marked")) {
                    $(this).remove();
                }
            });
            SetupEditTypeButtons();
            $("#deleteTypeButton").removeClass("saveDeletion"); // update delete button
        } else {
            $(".editTypeButton").unbind("click");
            $(".typeItem").each(function () {
                var typeButton = $(this).find('i');
                var typeValue = $(this).find('span');

                typeButton[0].className = "far fa-square editTypeButton fa-lg";
                typeButton.click(function (e) {
                    if (e.target.className === "far fa-square editTypeButton fa-lg") {
                        e.target.className = "far fa-check-square editTypeButton fa-lg";
                        $(e.target).closest(".typeItem").addClass("marked");
                    } else {
                        e.target.className = "far fa-square editTypeButton fa-lg";
                        $(e.target).closest(".typeItem").removeClass("marked");
                    }
                });
            });

            $("#deleteTypeButton").addClass("saveDeletion"); // update delete button
        }
    });

    SetupEditTypeButtons();

    // setup back button
    $(".returnButton").click(function (e) {
        e.preventDefault();
        setup(csrf);
    });
};

// build list of types
var TypesList = function TypesList(props) {

    // build li's with attached buttons
    var contentNodes = props.types.map(function (content) {
        return React.createElement(
            "li",
            { "data-serverdata": content, className: "typeItem" },
            React.createElement(
                "span",
                null,
                content
            ),
            React.createElement("i", { className: "far fa-edit editTypeButton fa-lg" })
        );
    });

    return (
        // need to wrap in div to submit, so submit with tbody then swap with table tbody
        React.createElement(
            "ul",
            { id: "typesList" },
            contentNodes
        )
    );
};

// render a new main window
var createMainWindow = function createMainWindow(csrf) {
    ReactDOM.render(React.createElement(MainWindow, null), document.querySelector("#preferencesContent"));
    document.querySelector("#typeText").innerHTML = document.querySelector("#typeText").innerHTML.replace(/,/g, ', ');

    // setup changeColors link
    var changeColorsLink = document.querySelector("#changeColorsLink");
    changeColorsLink.onclick = function (e) {
        e.stopPropagation();
        e.preventDefault();
        createChangeColorWindow(csrf);
        return false;
    };

    // setup changeLayout link
    var changeLayoutLink = document.querySelector("#changeLayoutLink");
    changeLayoutLink.onclick = function (e) {
        e.stopPropagation();
        e.preventDefault();
        createChangeLayoutWindow(csrf);
        return false;
    };

    // setup changeTypes link
    var changeTypesLink = document.querySelector("#changeTypesLink");
    changeTypesLink.onclick = function (e) {
        e.stopPropagation();
        e.preventDefault();
        createChangeTypesWindow(csrf);
        return false;
    };
    revealContent();
};

// default to start window
var setup = function setup(csrf) {
    sendAjax('GET', '/getPreferences', null, function (result) {

        // get the saved colors
        wishListSavedColor = result.wishListColor;
        inProgressSavedColor = result.inProgressColor;
        completeSavedColor = result.completeColor;

        // update css rule
        var sheet = window.document.styleSheets[0];
        sheet.addRule('.wishList', 'background-color: ' + wishListSavedColor + " !important;");
        sheet.addRule('.inProgress', 'background-color: ' + inProgressSavedColor + " !important;");
        sheet.addRule('.complete', 'background-color: ' + completeSavedColor + " !important;");

        savedLayout = result.layout;
        savedTheme = result.theme;
        savedSizingType = result.sizingType;
        savedSizingValue = result.sizingValue;
        savedTypes = result.types;

        // apply dark theme if enabled
        if (savedTheme == "dark") {
            $('link[data-name="darkStyle"]').prop('disabled', false);
            $('link[data-name="lightStyle"]').prop('disabled', true);
        } else {
            $('link[data-name="darkStyle"]').prop('disabled', true);
            $('link[data-name="lightStyle"]').prop('disabled', false);
        }

        createMainWindow(csrf);
    });
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        csrf = result.csrfToken;
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

// display error message
var handleError = function handleError(message) {
    if (document.querySelector("#errorMessage").innerHTML !== "") {
        $("#errorMessage").removeClass("flash");
        $("#errorMessage")[0].offsetWidth;
        $("#errorMessage").addClass("flash");
    }
    $("#errorMessage").text(message);
    $("#successMessage").empty();
};

// display success message in settings
var handleSuccess = function handleSuccess() {
    if (document.querySelector("#successMessage").innerHTML !== "") {
        $("#successMessage").removeClass("flash");
        $("#successMessage")[0].offsetWidth;
        $("#successMessage").addClass("flash");
    }

    document.querySelector("#successMessage").innerHTML = "Success!";

    $("#errorMessage").empty();
};

// redirect to different page
var redirect = function redirect(response) {
    window.location = response.redirect;
};

// ajax helper function
var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

// reveal content when page is done loading
var revealContent = function revealContent() {
    // only reveal once per page load
    if (!$('.fadeOutWrapper').hasClass('invisible')) {
        // Fade in/out
        $(".invisible").removeClass('invisible'); // reveal the content

        $('.fadeOutWrapper').addClass('fadeOut');
        $('.fadeOutWrapper').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
            // when the animation finishes
            $(this).addClass('invisible'); // make the logo invisible
        });
    }
};
