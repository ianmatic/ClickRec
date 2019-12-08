let csrf;

let wishListPicker;
let inProgressPicker;
let completePicker;

let wishListSavedColor;
let inProgressSavedColor;
let completeSavedColor;

let savedLayout;

let savedTheme;

// Handles changing colors
const handleColorChange = (e) => {
    e.preventDefault();

    // get the 3 colors
    const wishListColor = wishListPicker.getColor().toHEXA().toString(0);
    const inProgressColor = inProgressPicker.getColor().toHEXA().toString(0);
    const completeColor = completePicker.getColor().toHEXA().toString(0);

    // get the theme
    const theme = $("#themeField").val();

    // construct url
    const url = `wishList=${wishListColor}&inProgress=${inProgressColor}&complete=${completeColor}&theme=${theme}&_csrf=${csrf}`;

    // change colors
    sendAjax('PUT', $("#changeColorForm").attr("action"), url, () => {
        handleSuccess("colors");

        // reload theme
        sendAjax('GET', '/getPreferences', null, (result) => {
    
            // apply dark theme if enabled
            if (result.theme == "dark") {
                $('head').append('<link rel="stylesheet" title="darkTheme" type="text/css" href="/assets/darkStyle.css">');
            } else {
                $('link[title="darkTheme"]').remove();
            } 
        });

        $("#successMessage").click((e) => {
            e.preventDefault();
            setup(csrf);
        });
    });

    return false;
};

// Handles updating layout
const handleLayoutChange = (e) => {
    e.preventDefault();
    // change layout
    sendAjax('PUT', $("#changeLayoutForm").attr("action"), $("#changeLayoutForm").serialize(), (result) => {
        handleSuccess("layout");
        $("#successMessage").click((e) => { // setup success message link
            e.preventDefault();
            setup(csrf);
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
                <h1 className="title">My Preferences</h1>
                <h2 className="subtitle">Change colors and the layout here. <a id="homeLink" href="/">Home</a>.</h2>
            </header>
            {/*Information*/}
            <div className="window" id="settingsMainWindow">
                <h5 id="windowTitle">Preferences</h5>
                <div className="preferenceWrapper" id="colorsInfo">
                    <p className="preferenceTitle">Colors:</p>
                    <div className="colorsContainer">
                        <div className="colorWrapper">
                            <p className="colorTitle">Wish List</p>
                            <div id="wishListPreview" className="colorPreview wishList"></div>
                        </div>
                        <div className="colorWrapper">
                            <p className="colorTitle">In Progress</p>
                            <div id="inProgressPreview" className="colorPreview inProgress"></div>
                        </div>
                        <div className="colorWrapper">
                            <p className="colorTitle">Complete</p>
                            <div id="completePreview" className="colorPreview complete"></div>
                        </div>
                    </div>
                    <p id="themeText">{`${savedTheme} theme`}</p>
                    <a href="" id="changeColorsLink">Change Colors</a>
                </div>
                <div className="preferenceWrapper" id="layoutInfo">
                    <p className="preferenceTitle">Layout:</p>
                    <p id="layoutText">{`${savedLayout}`}</p>
                    <a href="" id="changeLayoutLink">Change Layout</a>
                </div>
                <div id="mainPreviewPage">
                    {/*Main preview */}
                    <label for="targetFrame">Preview:</label>
                    <iframe className="preview" id="mainPreview" src="main.html" tabindex="-1" name="targetframe" allowTransparency="true" scrolling="no" frameborder="0" >
                    </iframe>
                </div>
            </div>
        </div>
    );
};

// change colors window with form
const ChangeColorsWindow = (props) => {
    return (
        // below top header
        <div className="windowContainer">
            {/*Title and subtitle*/}
            <header className="titleHeader">
                <h1 className="title">Change Your Colors</h1>
                <h2 className="subtitle">Pick and choose the colors you'd prefer to use</h2>
            </header>
            {/*Error/Success message and form*/}
            <div className="window">
                <p id="errorMessage"></p>
                <form id="changeColorForm"
                    name="changeColorForm"
                    onSubmit={handleColorChange}
                    action="/changeColors"
                    method="PUT"
                    className="startForm"
                >
                    <div id="colorPreviewPage">
                        <p>Preview</p>
                        <iframe className="preview" src="main.html" tabindex="-1" name="targetframe" allowTransparency="true" scrolling="no" frameborder="0" >
                        </iframe>
                    </div>
                    {/*Wishlist*/}
                    <div className="inputWrapper">
                        <label htmlFor="wishlist">Wishlist </label>
                        <input id="wishlistColor" type="button" className="wishListPickr" name="wishlist" />
                    </div>
                    {/*InProgress*/}
                    <div className="inputWrapper">
                        <label htmlFor="inProgress">In Progress </label>
                        <input id="inProgressColor" type="button" className="inProgressPickr" name="inProgress" />
                    </div>
                    {/*Complete*/}
                    <div className="inputWrapper">
                        <label htmlFor="complete">Complete </label>
                        <input id="completeColor" type="button" className="completePickr" name="complete" />
                    </div>

                    {/*Theme*/}
                    <div className="inputWrapper">
                        <label htmlFor="theme">Theme</label><br />
                        <select className="custom-select" id="themeField" name="theme" required>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                    {/*CSRF is invisible*/}
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <input className="startSubmit btn btn-outline-primary" type="submit" value="Save Colors" />
                </form>
                <p id="successMessage"></p>
            </div>
        </div>
    );
};

// Change Layout Page
const ChangeLayoutWindow = (props) => {
    return (
        // below top header
        <div className="windowContainer">
            {/*Title and subtitle*/}
            <header className="titleHeader">
                <h1 className="title">Update Your Layout</h1>
                <h2 className="subtitle">Select the layout you'd prefer to use</h2>
            </header>
            {/*Error message and form*/}
            <div className="window">
                <p id="errorMessage"></p>
                <form id="changeLayoutForm"
                    name="changeLayoutForm"
                    onSubmit={handleLayoutChange}
                    action="/changeLayout"
                    method="PUT"
                    className="startForm"
                >
                    <div id="layoutPreviewPage">
                        <p>Preview</p>
                        <iframe className="preview" src="main.html" tabindex="-1" name="targetframe" allowTransparency="true" scrolling="no" frameborder="0" >
                        </iframe>
                    </div>
                    {/*Layout*/}
                    <div className="inputWrapper">
                        <label htmlFor="layout">Layout</label><br />
                        <select className="custom-select" id="layoutField" name="layout" required>
                            <option value="table">Table</option>
                            <option value="grid">Grid</option>
                        </select>
                    </div>
                    {/*CSRF is invisible*/}
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <input className="startSubmit btn btn-outline-primary" type="submit" value="Save Layout" />
                </form>
                <p id="successMessage"></p>
            </div>
        </div>
    );
};

// render a new change password window
const createChangeColorWindow = (csrf) => {
    ReactDOM.render(
        <ChangeColorsWindow csrf={csrf} />,
        document.querySelector("#preferencesContent")
    );

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
    }).on('change', color => {
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
    }).on('change', color => {
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
    }).on('change', color => {
        $("iframe").contents().find(".complete").attr('style', 'background-color: ' + color.toHEXA().toString(0) + " !important");
    });

    // setup theme select
    // update select to loaded value
    $(`#themeField option[value=${savedTheme}`).prop('selected', 'selected');

    // update preview on change
    $('#themeField').on('change', function (e) {
        document.querySelector('iframe').contentWindow.loadContentFromServer(savedLayout, this.value);
    });
};

// render a new change layout window
const createChangeLayoutWindow = (csrf) => {
    ReactDOM.render(
        <ChangeLayoutWindow csrf={csrf} />,
        document.querySelector("#preferencesContent")
    );

    // update select to loaded value
    $(`#layoutField option[value=${savedLayout}`).prop('selected', 'selected');

    // update preview on change
    $('#layoutField').on('change', function (e) {
        document.querySelector('iframe').contentWindow.loadContentFromServer(this.value, savedTheme);
    });
};

// render a new main window
const createMainWindow = (csrf) => {
    ReactDOM.render(
        <MainWindow />,
        document.querySelector("#preferencesContent")
    );

    // setup changeColors link
    const changeColorsLink = document.querySelector("#changeColorsLink");
    changeColorsLink.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        createChangeColorWindow(csrf);
        return false;
    };

    // setup changeLayout link
    const changeLayoutLink = document.querySelector("#changeLayoutLink");
    changeLayoutLink.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        createChangeLayoutWindow(csrf);
        return false;
    };
};

// default to start window
const setup = (csrf) => {
    createMainWindow(csrf);
    sendAjax('GET', '/getPreferences', null, (result) => {

        // get the saved colors
        wishListSavedColor = result.wishListColor;
        inProgressSavedColor = result.inProgressColor;
        completeSavedColor = result.completeColor;

        // update css rule
        let sheet = window.document.styleSheets[0];
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

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        csrf = result.csrfToken;
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});