let csrf;
let username;
// Handles changing password
const handlePasswordChange = (e) => {
    e.preventDefault();


    // passwords don't match
    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    // change password
    sendAjax('PUT', $("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), () => {
        handleSuccess("password");
        $("#successMessage").click((e) => {
            e.preventDefault();
            createMainWindow(csrf);
        })
    });

    return false;
};

// Handles updating username
const handleUsernameChange = (e) => {
    e.preventDefault("username");
    // change username
    sendAjax('PUT', $("#changeUsernameForm").attr("action"), $("#changeUsernameForm").serialize(), (result) => {
        username = result.username;
        handleSuccess("username");
        $("#successMessage").click((e) => { // setup success message link
            e.preventDefault();
            createMainWindow(csrf);
        })
    });

    return false;
};

// Info Page
const MainWindow = (props) => {
    return (
        // below top header
        <div className="windowContainer">
            {/*Title and subtitle */}
            <header className="titleHeader">
                <h1 className="title">My Account</h1>
                <h2 className="subtitle">You are logged in as {username}. <a id="logoutLink" href="/logout">Log out</a>.</h2>
            </header>
            {/*Information*/}
            <div className="window" id="settingsMainWindow">
                <h5 id="windowTitle">Credentials</h5>
                <div className="credentialWrapper" id="usernameInfo">
                    <p className="credentialTitle">Username:</p>
                    <p id="usernameCredential">{username}</p>
                    <a href="" id="changeUsernameLink">Change Username</a>
                </div>
                <div className="credentialWrapper" id="passwordInfo">
                    <p className="credentialTitle">Password:</p>
                    <a href="" id="changePasswordLink">Change Password</a>
                </div>
            </div>
        </div>
    );
};

// Change Password Page
const ChangePasswordWindow = (props) => {
    return (
        // below top header
        <div className="windowContainer">
            {/*Title and subtitle*/}
            <header className="titleHeader">
                <h1 className="title">Update Your Password</h1>
                <h2 className="subtitle">Enter the password you'd prefer to use</h2>
            </header>
            {/*Error message and form*/}
            <div className="window">
                <p id="errorMessage"></p>
                <form id="changePasswordForm"
                    name="changePasswordForm"
                    onSubmit={handlePasswordChange}
                    action="/changePassword"
                    method="PUT"
                    className="startForm"
                >
                    {/*Password*/}
                    <div className="inputWrapper">
                        <label htmlFor="pass">New Password</label><br />
                        {/*Actual password field only takes up part of space, show password button takes up the rest */}
                        <div className="passwordWrapper">
                            <input id="pass" type="password" name="pass" placeholder="Choose Password" required />
                            <button type="button" className="btn btn-primary showButton" tabIndex="-1">Show</button>
                        </div><br />
                    </div>
                    {/*Confirm Password*/}
                    <div className="inputWrapper">
                        <label htmlFor="pass2">Confirm New Password</label><br />
                        {/*Actual password field only takes up part of space, show password button takes up the rest */}
                        <div className="passwordWrapper">
                            <input id="pass2" type="password" name="pass2" placeholder="Retype Password" required />
                            <button type="button" className="btn btn-primary showButton" tabIndex="-1">Show</button>
                        </div>
                    </div>
                    {/*CSRF is invisible*/}
                    <input type="hidden" name="_csrf" value={props.csrf} />

                    <div id="submitWrapper">
                        <button type="button" className="btn btn-outline-primary returnButton"><i className="fas fa-arrow-left"></i></button>
                        <input className="startSubmit btn btn-outline-primary" type="submit" value="Change Password" />
                    </div>
                </form>
                <p id="successMessage"></p>
            </div>
        </div>
    );
};

// change username window with form
const ChangeUsernameWindow = (props) => {
    return (
        // below top header
        <div className="windowContainer">
            {/*Title and subtitle*/}
            <header className="titleHeader">
                <h1 className="title">Update Your Username</h1>
                <h2 className="subtitle">Enter the username you'd prefer to use</h2>
            </header>
            {/*Error/Success message and form*/}
            <div className="window">
                <p id="errorMessage"></p>
                <form id="changeUsernameForm"
                    name="changeUsernameForm"
                    onSubmit={handleUsernameChange}
                    action="/changeUsername"
                    method="PUT"
                    className="startForm"
                >
                    {/*Username*/}
                    <div className="inputWrapper">
                        <label htmlFor="username">New Username</label><br />
                        <input id="user" type="text" name="username" placeholder="Choose Username" required />
                    </div>
                    {/*CSRF is invisible*/}
                    <input type="hidden" name="_csrf" value={props.csrf} />

                    <div id="submitWrapper">
                        <button type="button" className="btn btn-outline-primary returnButton"><i className="fas fa-arrow-left"></i></button>
                        <input className="startSubmit btn btn-outline-primary" type="submit" value="Change Username" />
                    </div>
                </form>
                <p id="successMessage"></p>
            </div>
        </div>
    );
};

// render a new change password window
const createChangePasswordWindow = (csrf) => {
    ReactDOM.render(
        <ChangePasswordWindow csrf={csrf} />,
        document.querySelector("#settingsContent")
    );

    // setup show password buttons
    const showButtons = $(".showButton");
    showButtons.click(function (e) {
        const btn = e.target;
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

    // setup back button
    $(".returnButton").click((e) => {
        e.preventDefault();
        setup(csrf);
    });

};

// render a new change username window
const createChangeUsernameWindow = (csrf) => {
    ReactDOM.render(
        <ChangeUsernameWindow csrf={csrf} />,
        document.querySelector("#settingsContent")
    );

    // setup back button
    $(".returnButton").click((e) => {
        e.preventDefault();
        setup(csrf);
    });
};

// render a new main window
const createMainWindow = (csrf) => {
    ReactDOM.render(
        <MainWindow />,
        document.querySelector("#settingsContent")
    );

    // setup changePassword link
    const changePasswordLink = document.querySelector("#changePasswordLink");
    changePasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePasswordWindow(csrf);
        return false;
    });

    // setup changeUsername link
    const changeUsernameLink = document.querySelector("#changeUsernameLink");
    changeUsernameLink.addEventListener("click", (e) => {
        e.preventDefault();
        createChangeUsernameWindow(csrf);
        return false;
    });

    //setup show password button
    const showButtons = $(".showButton");
    showButtons.click(function (e) {
        const btn = e.target;
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
    sendAjax('GET', '/getPreferences', null, (result) => {
        // apply dark theme if enabled
        if (result.theme == "dark") {
            $('link[data-name="darkStyle"]').prop('disabled', false);
            $('link[data-name="lightStyle"]').prop('disabled', true);
        } else {
            $('link[data-name="darkStyle"]').prop('disabled', true);
            $('link[data-name="lightStyle"]').prop('disabled', false);
        }
    });
};

const setup = (csrf) => {
    // first load credentials
    sendAjax('GET', '/getCredentials', null, (result) => {
        username = result.username;
        createMainWindow(csrf);
    });

};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        csrf = result.csrfToken;
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});