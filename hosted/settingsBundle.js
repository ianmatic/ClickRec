"use strict";

var csrf = void 0;
var username = void 0;
// Handles changing password
var handlePasswordChange = function handlePasswordChange(e) {
    e.preventDefault();

    // passwords don't match
    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    // change password
    sendAjax('PUT', $("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), function () {
        handleSuccess("password");
        $("#successMessage").click(function (e) {
            e.preventDefault();
            createMainWindow(csrf);
        });
    });

    return false;
};

// Handles updating username
var handleUsernameChange = function handleUsernameChange(e) {
    e.preventDefault("username");
    // change username
    sendAjax('PUT', $("#changeUsernameForm").attr("action"), $("#changeUsernameForm").serialize(), function (result) {
        username = result.username;
        handleSuccess("username");
        $("#successMessage").click(function (e) {
            // setup success message link
            e.preventDefault();
            createMainWindow(csrf);
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
                    "My Account"
                ),
                React.createElement(
                    "h2",
                    { className: "subtitle" },
                    "You are logged in as ",
                    username,
                    ". ",
                    React.createElement(
                        "a",
                        { id: "logoutLink", href: "/logout" },
                        "Log out"
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
                    "Credentials"
                ),
                React.createElement(
                    "div",
                    { className: "credentialWrapper", id: "usernameInfo" },
                    React.createElement(
                        "p",
                        { className: "credentialTitle" },
                        "Username:"
                    ),
                    React.createElement(
                        "p",
                        { id: "usernameCredential" },
                        username
                    ),
                    React.createElement(
                        "a",
                        { href: "", id: "changeUsernameLink" },
                        "Change Username"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "credentialWrapper", id: "passwordInfo" },
                    React.createElement(
                        "p",
                        { className: "credentialTitle" },
                        "Password:"
                    ),
                    React.createElement(
                        "a",
                        { href: "", id: "changePasswordLink" },
                        "Change Password"
                    )
                )
            )
        )
    );
};

// Change Password Page
var ChangePasswordWindow = function ChangePasswordWindow(props) {
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
                    "Update Your Password"
                ),
                React.createElement(
                    "h2",
                    { className: "subtitle" },
                    "Enter the password you'd prefer to use"
                )
            ),
            React.createElement(
                "div",
                { className: "window" },
                React.createElement("p", { id: "errorMessage" }),
                React.createElement(
                    "form",
                    { id: "changePasswordForm",
                        name: "changePasswordForm",
                        onSubmit: handlePasswordChange,
                        action: "/changePassword",
                        method: "PUT",
                        className: "startForm"
                    },
                    React.createElement(
                        "div",
                        { className: "inputWrapper" },
                        React.createElement(
                            "label",
                            { htmlFor: "pass" },
                            "New Password"
                        ),
                        React.createElement("br", null),
                        React.createElement(
                            "div",
                            { className: "passwordWrapper" },
                            React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "Choose Password", required: true }),
                            React.createElement(
                                "button",
                                { type: "button", className: "btn btn-primary showButton", tabIndex: "-1" },
                                "Show"
                            )
                        ),
                        React.createElement("br", null)
                    ),
                    React.createElement(
                        "div",
                        { className: "inputWrapper" },
                        React.createElement(
                            "label",
                            { htmlFor: "pass2" },
                            "Confirm New Password"
                        ),
                        React.createElement("br", null),
                        React.createElement(
                            "div",
                            { className: "passwordWrapper" },
                            React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "Retype Password", required: true }),
                            React.createElement(
                                "button",
                                { type: "button", className: "btn btn-primary showButton", tabIndex: "-1" },
                                "Show"
                            )
                        )
                    ),
                    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                    React.createElement("input", { className: "startSubmit btn btn-outline-primary", type: "submit", value: "Change Password" })
                ),
                React.createElement("p", { id: "successMessage" })
            )
        )
    );
};

// change username window with form
var ChangeUsernameWindow = function ChangeUsernameWindow(props) {
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
                    "Update Your Username"
                ),
                React.createElement(
                    "h2",
                    { className: "subtitle" },
                    "Enter the username you'd prefer to use"
                )
            ),
            React.createElement(
                "div",
                { className: "window" },
                React.createElement("p", { id: "errorMessage" }),
                React.createElement(
                    "form",
                    { id: "changeUsernameForm",
                        name: "changeUsernameForm",
                        onSubmit: handleUsernameChange,
                        action: "/changeUsername",
                        method: "PUT",
                        className: "startForm"
                    },
                    React.createElement(
                        "div",
                        { className: "inputWrapper" },
                        React.createElement(
                            "label",
                            { htmlFor: "username" },
                            "New Username"
                        ),
                        React.createElement("br", null),
                        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "Choose Username", required: true })
                    ),
                    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                    React.createElement("input", { className: "startSubmit btn btn-outline-primary", type: "submit", value: "Change Username" })
                ),
                React.createElement("p", { id: "successMessage" })
            )
        )
    );
};

// render a new change password window
var createChangePasswordWindow = function createChangePasswordWindow(csrf) {
    ReactDOM.render(React.createElement(ChangePasswordWindow, { csrf: csrf }), document.querySelector("#settingsContent"));

    // setup show password buttons
    var showButtons = $(".showButton");
    showButtons.click(function (e) {
        var btn = e.target;
        // hide password
        if (btn.innerText == "Show") {
            btn.innerText = "Hide";
            $(btn).siblings().attr("type", "text");
        }
        // show Password
        else {
                btn.innerText = "Show";
                $(btn).siblings().attr("type", "password");
            }
    });
};

// render a new change username window
var createChangeUsernameWindow = function createChangeUsernameWindow(csrf) {
    ReactDOM.render(React.createElement(ChangeUsernameWindow, { csrf: csrf }), document.querySelector("#settingsContent"));
};

// render a new main window
var createMainWindow = function createMainWindow(csrf) {
    ReactDOM.render(React.createElement(MainWindow, null), document.querySelector("#settingsContent"));

    // setup changePassword link
    var changePasswordLink = document.querySelector("#changePasswordLink");
    changePasswordLink.addEventListener("click", function (e) {
        e.preventDefault();
        createChangePasswordWindow(csrf);
        return false;
    });

    // setup changeUsername link
    var changeUsernameLink = document.querySelector("#changeUsernameLink");
    changeUsernameLink.addEventListener("click", function (e) {
        e.preventDefault();
        createChangeUsernameWindow(csrf);
        return false;
    });

    //setup show password button
    var showButtons = $(".showButton");
    showButtons.click(function (e) {
        var btn = e.target;
        // hide password
        if (btn.innerText == "Show") {
            btn.innerText = "Hide";
            $(btn).siblings().attr("type", "text");
        }
        // show Password
        else {
                btn.innerText = "Show";
                $(btn).siblings().attr("type", "password");
            }
    });

    // apply dark theme if enabled
    sendAjax('GET', '/getPreferences', null, function (result) {
        if (result.theme == "dark") {
            $('head').append('<link rel="stylesheet" type="text/css" href="/assets/darkStyle.css">');
        }
    });
};

var setup = function setup(csrf) {
    // first load credentials
    sendAjax('GET', '/getCredentials', null, function (result) {
        username = result.username;
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
