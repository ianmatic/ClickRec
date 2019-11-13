// Handles logging into app
const handleLogin = (e) => {
    e.preventDefault();

    // login
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

// Handles making a new account on app
const handleSignup = (e) => {
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
const LoginWindow = (props) => {
    return (
        // below top header
        <div className="windowContainer">
            {/*Title and subtitle */}
            <header className="titleHeader">
                <h1 className="title">Login to your account</h1>
                <h2 className="subtitle">Need an account? <a id="signUpLink" href="/signup">Create One</a>.</h2>
            </header>
            {/*Error message and form */}
            <div className="window">
                <p id="errorMessage"></p>
                <form id="loginForm" name="loginForm"
                    onSubmit={handleLogin}
                    action="/login"
                    method="POST"
                    className="mainForm"
                >
                    {/*Username*/}
                    <div className="inputWrapper">
                        <label htmlFor="username">Username</label> <br />
                        <input id="user" type="text" name="username" placeholder="Your Username" required />
                    </div> <br />
                    {/*Password*/}
                    <div className="inputWrapper">
                        <label htmlFor="pass">Password</label> <br />
                        {/*Actual password field only takes up part of space, show password button takes up the rest */}
                        <div className="passwordWrapper">
                            <input id="pass" type="password" name="pass" placeholder="Your Password" required />
                            <button type="button" className="btn btn-primary showButton">Show</button>
                        </div> <br />
                    </div>
                    {/*CSRF is invisible*/}
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <input className="formSubmit btn btn-outline-primary" type="submit" value="Sign Up" />
                </form>
            </div>
        </div>
    );
};

const SignupWindow = (props) => {
    return (
        // below top header
        <div className="windowContainer">
            {/*Title and subtitle*/}
            <header className="titleHeader">
                <h1 className="title">Create an account</h1>
                <h2 className="subtitle">Already Have an account? <a id="loginLink" href="/login">Log in</a>.</h2>
            </header>
            {/*Error message and form*/}
            <div className="window">
                <p id="errorMessage"></p>
                <form id="signupForm"
                    name="signupForm"
                    onSubmit={handleSignup}
                    action="/signup"
                    method="POST"
                    className="mainForm"
                >
                    {/*Username*/}
                    <div className="inputWrapper">
                        <label htmlFor="username">Username</label> <br />
                        <input id="user" type="text" name="username" placeholder="Choose Username" required />
                    </div>  <br />
                    {/*Password*/}
                    <div className="inputWrapper">
                        <label htmlFor="pass">Password</label><br />
                        {/*Actual password field only takes up part of space, show password button takes up the rest */}
                        <div className="passwordWrapper">
                            <input id="pass" type="password" name="pass" placeholder="Choose Password" required />
                            <button type="button" className="btn btn-primary showButton">Show</button>
                        </div><br />
                    </div>
                    {/*Confirm Password*/}
                    <div className="inputWrapper">
                        <label htmlFor="pass2"> Retype Password</label><br />
                        {/*Actual password field only takes up part of space, show password button takes up the rest */}
                        <div className="passwordWrapper">
                            <input id="pass2" type="password" name="pass2" placeholder="Retype Password" required />
                            <button type="button" className="btn btn-primary showButton">Show</button>
                        </div>
                    </div> <br />
                    {/*CSRF is invisible*/}
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <input className="formSubmit btn btn-outline-primary" type="submit" value="Login" />
                </form>
            </div>
        </div>
    );
};

// render a new login window
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );

    // setup signup link
    const signupbutton = document.querySelector("#signUpLink");
    signupbutton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

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
};

// render a new signup window
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );

    // setup login link
    const loginbutton = document.querySelector("#loginLink");
    loginbutton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    //setup show password buttons
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
};

// default to login window
const setup = (csrf) => {
    createLoginWindow(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});