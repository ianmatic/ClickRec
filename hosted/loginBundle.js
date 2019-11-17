"use strict";

// Handles logging into app
var handleLogin = function handleLogin(e) {
    e.preventDefault();

    // login
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

// Handles making a new account on app
var handleSignup = function handleSignup(e) {
    e.preventDefault();

    // Passwords don't match
    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    // signup
    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

// Login page
var LoginWindow = function LoginWindow(props) {
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
                    "Login to your account"
                ),
                React.createElement(
                    "h2",
                    { className: "subtitle" },
                    "Need an account? ",
                    React.createElement(
                        "a",
                        { id: "signUpLink", href: "/signup" },
                        "Create One"
                    ),
                    "."
                )
            ),
            React.createElement(
                "div",
                { className: "window" },
                React.createElement("p", { id: "errorMessage" }),
                React.createElement(
                    "form",
                    { id: "loginForm", name: "loginForm",
                        onSubmit: handleLogin,
                        action: "/login",
                        method: "POST",
                        className: "startForm"
                    },
                    React.createElement(
                        "div",
                        { className: "inputWrapper" },
                        React.createElement(
                            "label",
                            { htmlFor: "username" },
                            "Username"
                        ),
                        " ",
                        React.createElement("br", null),
                        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "Your Username", required: true })
                    ),
                    " ",
                    React.createElement("br", null),
                    React.createElement(
                        "div",
                        { className: "inputWrapper" },
                        React.createElement(
                            "label",
                            { htmlFor: "pass" },
                            "Password"
                        ),
                        " ",
                        React.createElement("br", null),
                        React.createElement(
                            "div",
                            { className: "passwordWrapper" },
                            React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "Your Password", required: true }),
                            React.createElement(
                                "button",
                                { type: "button", className: "btn btn-primary showButton" },
                                "Show"
                            )
                        ),
                        " ",
                        React.createElement("br", null)
                    ),
                    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                    React.createElement("input", { className: "startSubmit btn btn-outline-primary", type: "submit", value: "Login" })
                )
            )
        )
    );
};

// Signup page
var SignupWindow = function SignupWindow(props) {
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
                    "Create an account"
                ),
                React.createElement(
                    "h2",
                    { className: "subtitle" },
                    "Already Have an account? ",
                    React.createElement(
                        "a",
                        { id: "loginLink", href: "/login" },
                        "Log in"
                    ),
                    "."
                )
            ),
            React.createElement(
                "div",
                { className: "window" },
                React.createElement("p", { id: "errorMessage" }),
                React.createElement(
                    "form",
                    { id: "signupForm",
                        name: "signupForm",
                        onSubmit: handleSignup,
                        action: "/signup",
                        method: "POST",
                        className: "startForm"
                    },
                    React.createElement(
                        "div",
                        { className: "inputWrapper" },
                        React.createElement(
                            "label",
                            { htmlFor: "username" },
                            "Username"
                        ),
                        " ",
                        React.createElement("br", null),
                        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "Choose Username", required: true })
                    ),
                    "  ",
                    React.createElement("br", null),
                    React.createElement(
                        "div",
                        { className: "inputWrapper" },
                        React.createElement(
                            "label",
                            { htmlFor: "pass" },
                            "Password"
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
                            "Confirm Password"
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
                    " ",
                    React.createElement("br", null),
                    React.createElement("div", { id: "recaptcha", "data-sitekey": "6Lc1lsIUAAAAAFTfmkhNent8xUg2NZzgP-ahr9Ws" }),
                    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                    React.createElement("input", { className: "startSubmit btn btn-outline-primary", type: "submit", value: "Sign Up" })
                )
            )
        )
    );
};

// render a new login window
var createLoginWindow = function createLoginWindow(csrf) {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#loginContent"));

    // setup signup link
    var signupbutton = document.querySelector("#signUpLink");
    signupbutton.addEventListener("click", function (e) {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

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

// render a new signup window
var createSignupWindow = function createSignupWindow(csrf) {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#loginContent"));

    grecaptcha.render("recaptcha", {
        sitekey: '6Lc1lsIUAAAAAFTfmkhNent8xUg2NZzgP-ahr9Ws'
    });

    // setup login link
    var loginbutton = document.querySelector("#loginLink");
    loginbutton.addEventListener("click", function (e) {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    //setup show password buttons
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

// default to login window
var setup = function setup(csrf) {
    createLoginWindow(csrf);
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
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

var handleSuccess = function handleSuccess(keyword) {
    var successDiv = "<p id=\"successMessage\">Successfully updated your " + keyword + ". <a href=\"\" id=\"successLink\">Click here</a> to go back to settings.</p>";
    $(successDiv).insertAfter($("form"));
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
