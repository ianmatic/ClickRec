"use strict";

var csrf = void 0;

var wishListPicker = void 0;
var inProgressPicker = void 0;
var completePicker = void 0;

var wishListSavedColor = void 0;
var inProgressSavedColor = void 0;
var completeSavedColor = void 0;

var savedLayout = void 0;

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
        handleSuccess("colors");

        // reload theme
        sendAjax('GET', '/getPreferences', null, function (result) {

            // apply dark theme if enabled
            if (result.theme == "dark") {
                $('head').append('<link rel="stylesheet" title="darkTheme" type="text/css" href="/assets/darkStyle.css">');
            } else {
                $('link[title="darkTheme"]').remove();
            }
        });

        $("#successMessage").click(function (e) {
            e.preventDefault();
            setup(csrf);
        });
    });

    return false;
};

// Handles updating layout
var handleLayoutChange = function handleLayoutChange(e) {
    e.preventDefault();
    // change layout
    sendAjax('PUT', $("#changeLayoutForm").attr("action"), $("#changeLayoutForm").serialize(), function (result) {
        handleSuccess("layout");
        $("#successMessage").click(function (e) {
            // setup success message link
            e.preventDefault();
            setup(csrf);
        });
    });

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
                        { id: "themeText" },
                        savedTheme + " theme"
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
                        "a",
                        { href: "", id: "changeLayoutLink" },
                        "Change Layout"
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
                    React.createElement("input", { className: "startSubmit btn btn-outline-primary", type: "submit", value: "Save Colors" })
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
                    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                    React.createElement("input", { className: "startSubmit btn btn-outline-primary", type: "submit", value: "Save Layout" })
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
        document.querySelector('iframe').contentWindow.loadContentFromServer(savedLayout, this.value);
    });
};

// render a new change layout window
var createChangeLayoutWindow = function createChangeLayoutWindow(csrf) {
    ReactDOM.render(React.createElement(ChangeLayoutWindow, { csrf: csrf }), document.querySelector("#preferencesContent"));

    // update select to loaded value
    $("#layoutField option[value=" + savedLayout).prop('selected', 'selected');

    // update preview on change
    $('#layoutField').on('change', function (e) {
        document.querySelector('iframe').contentWindow.loadContentFromServer(this.value, savedTheme);
    });
};

// render a new main window
var createMainWindow = function createMainWindow(csrf) {
    ReactDOM.render(React.createElement(MainWindow, null), document.querySelector("#preferencesContent"));

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
};

// default to start window
var setup = function setup(csrf) {
    createMainWindow(csrf);
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

        // apply dark theme if enabled
        if (savedTheme == "dark") {
            $('head').append('<link rel="stylesheet" title="darkTheme" type="text/css" href="/assets/darkStyle.css">');
        } else {
            $('link[title="darkTheme"]').remove();
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
    $("#errorMessage").text(message);
    $("#successMessage").empty();
};

// display success message in settings
var handleSuccess = function handleSuccess(keyword) {
    document.querySelector("#successMessage").innerHTML = "<p id=\"successMessage\">Successfully updated your " + keyword + ". <a href=\"\" id=\"successLink\">Click here</a> to go back to preferences.</p>";
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
