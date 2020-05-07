let csrf;

let wishListPicker;
let inProgressPicker;
let completePicker;

let wishListSavedColor;
let inProgressSavedColor;
let completeSavedColor;

let savedLayout, savedSizingType, savedSizingValue;
let savedTypes;
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
        handleSuccess();

        // reload theme
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
    });

    return false;
};

// Handles updating layout
const handleLayoutChange = (e) => {
    e.preventDefault();
    // change layout
    sendAjax('PUT', $("#changeLayoutForm").attr("action"), $("#changeLayoutForm").serialize(), (result) => {
        handleSuccess();
    });

    return false;
};

// Handles updating types
const handleTypesChange = (e) => {
    e.preventDefault();
    let submitString = "";
    let array = [];
    $(".typeItem").each(function () {
        array.push(this.getAttribute("data-serverdata"));
    });
    // change types
    sendAjax('PUT', $("#changeTypesForm").attr("action"), `data=${JSON.stringify(array)}&_csrf=${csrf}`, (result) => {
        handleSuccess();
    });

    return false;
};

// Handles adding a new type to the list (not saving)
const handleAddType = (e) => {
    e.preventDefault();
    // change layout
    e.preventDefault();
    const val = document.querySelector("#addTextInput").value;
    $("#typesList").append(`<li data-serverdata=${val} class="typeItem"><span>${val}</span><button class="btn btn-primary"><i class="far fa-edit fa-lg"></i></button></li>`);
    $("#addTextInput").val('');
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
                    <p className="preferenceTitle">Theme:</p>
                    <p id="themeText">{`${savedTheme}`}</p>
                    <a href="" id="changeColorsLink">Change Colors</a>
                </div>
                <div className="preferenceWrapper" id="layoutInfo">
                    <p className="preferenceTitle">Layout:</p>
                    <p id="layoutText">{`${savedLayout}`}</p>
                    <p className="preferenceTitle">Sizing (Grid Only):</p>
                    <p id="sizingText">{`${savedSizingType}`}</p>
                    <a href="" id="changeLayoutLink">Change Layout</a>
                </div>
                <div className="preferenceWrapper" id="typesInfo">
                    <p className="preferenceTitle">Types:</p>
                    <p id="typeText">{`${savedTypes}`}</p>
                    <a href="" id="changeTypesLink">Change Types</a>
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
                    <div id="submitWrapper">
                        <button type="button" className="btn btn-outline-primary returnButton"><i className="fas fa-arrow-left"></i></button>
                        <input className="startSubmit btn btn-outline-primary" type="submit" value="Save Colors" />
                    </div>
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
                    </div> <br />
                    {/*Item Sizing*/}
                    <div className="inputWrapper">
                        <label htmlFor="sizingType">Sizing (Grid Only)</label><br />
                        <select className="custom-select" id="sizingTypeField" name="sizingType" required>
                            <option value="auto">Auto</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    {/*Custom Size*/}
                    <input type="range" name="sizingValue" className="custom-range" min="100" max="500" step="50" id="sizingValueRange" />

                    {/*CSRF is invisible*/}
                    <input type="hidden" name="_csrf" value={props.csrf} />

                    <div id="submitWrapper">
                        <button type="button" className="btn btn-outline-primary returnButton"><i className="fas fa-arrow-left"></i></button>
                        <input className="startSubmit btn btn-outline-primary" type="submit" value="Save Layout" />
                    </div>
                </form>
                <p id="successMessage"></p>
            </div>
        </div>
    );
};

// Change Types Page
const ChangeTypesWindow = (props) => {
    return (
        // below top header
        <div className="windowContainer">
            {/*Title and subtitle*/}
            <header className="titleHeader">
                <h1 className="title">Change Your Types</h1>
                <h2 className="subtitle">Add, Remove, Or Edit The Types You'd Like To Use</h2>
            </header>
            {/*Error message and form*/}
            <div className="window">
                <p id="errorMessage"></p>
                {/*Add Type*/}
                <div id="manageTypesWrapper">
                    <form id="addTypeInput"
                        className="input-group"
                        onSubmit={handleAddType}
                    >
                        <input id="addTextInput" type="text" className="form-control" placeholder="New Type" required />
                        <div className="input-group-append">
                            <input className="btn btn-outline-primary" type="submit" id="addTypeButton" value="Add" />
                        </div>
                    </form>
                    <i className="fas fa-trash" id="deleteTypeButton"></i>
                </div>
                <form id="changeTypesForm"
                    name="changeTypesForm"
                    onSubmit={handleTypesChange}
                    action="/changeTypes"
                    method="PUT"
                    className="startForm"
                >
                    {/*Types*/}
                    <div className="inputWrapper" id="typesLabel">
                        <label htmlFor="Types">Types:</label><br />
                    </div>
                    <div id="typesListContainer"></div>
                    {/*CSRF is invisible*/}
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <div id="submitWrapper">
                        <button type="button" className="btn btn-outline-primary returnButton"><i className="fas fa-arrow-left"></i></button>
                        <input className="startSubmit btn btn-outline-primary" type="submit" value="Save Types" />
                    </div>
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
        document.querySelector('iframe').contentWindow.loadContentFromServer(savedLayout, this.value, savedSizingValue);
    });

    // setup back button
    $(".returnButton").click((e) => {
        e.preventDefault();
        setup(csrf);
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
    $(`#sizingTypeField option[value=${savedSizingType}]`).prop('selected', 'selected');
    document.querySelector("#sizingValueRange").style.display = savedSizingType === "auto" && "none" || "inline-block";
    document.querySelector("#sizingValueRange").value = parseInt(savedSizingValue, 10);

    // update preview on change
    $('#layoutField').on('change', function (e) {
        document.querySelector('iframe').contentWindow.loadContentFromServer(this.value, savedTheme, $(`#sizingValueRange`).val());
    });
    $(`#sizingTypeField`).on('change', function (e) {
        // toggle range
        document.querySelector("#sizingValueRange").style.display = this.value === "auto" && "none" || "inline-block";
        document.querySelector("#sizingValueRange").value = this.value === "auto" && "300px" || parseInt(savedSizingValue, 10);
        document.querySelector('iframe').contentWindow.loadContentFromServer($('#layoutField').val(), savedTheme, $(`#sizingValueRange`).val());
    });
    $(`#sizingValueRange`).on('input', function (e) {
        if (savedLayout === "grid") {
            let value = parseInt(this.value, 10);
            $("iframe").contents().find(".gridItemWrapper").css("height", this.value);
            $("iframe").contents().find(".gridItemWrapper").css("width", (value * 0.67) + "px");
            $("iframe").contents().find(".gridItemType, .gridItemName").css('font-size', (value / 16.67) + "px");
            $("iframe").contents().find(".gridItemNotes").css('font-size', (value / 20) + "px");
            $("iframe").contents().find(".gridDropDownWrapper, .gridItemDeleteButton i").css('transform', `scale(${value / 400}`);
        }
    });

    // setup back button
    $(".returnButton").click((e) => {
        e.preventDefault();
        setup(csrf);
    });
};

// helper function for toggling functionality of edit type buttons
function SetupEditTypeButtons() {
    // setup edit buttons
    $(".editTypeButton").click(function (e) {
        e.preventDefault();
        const span = $(this).siblings();
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
const createChangeTypesWindow = (csrf) => {
    ReactDOM.render(
        <ChangeTypesWindow csrf={csrf} />,
        document.querySelector("#preferencesContent")
    );

    // render list of types
    ReactDOM.render(
        <TypesList types={savedTypes} />, document.querySelector("#typesListContainer"));
    // setup delete button
    $("#deleteTypeButton").click((e) => {
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
        }
        else {
            $(".editTypeButton").unbind("click");
            $(".typeItem").each(function () {
                const typeButton = $(this).find('i');
                const typeValue = $(this).find('span');

                typeButton[0].className = "far fa-square editTypeButton fa-lg";
                typeButton.click((e) => {
                    if (e.target.className === "far fa-square editTypeButton fa-lg") {
                        e.target.className = "far fa-check-square editTypeButton fa-lg";
                        $(e.target).closest(".typeItem").addClass("marked");
                    }
                    else {
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
    $(".returnButton").click((e) => {
        e.preventDefault();
        setup(csrf);
    });
};

// build list of types
const TypesList = function (props) {

    // build li's with attached buttons
    const contentNodes = props.types.map(function (content) {
        return <li data-serverdata={content} className="typeItem"><span>{content}</span><i className="far fa-edit editTypeButton fa-lg"></i></li>
    });

    return (
        // need to wrap in div to submit, so submit with tbody then swap with table tbody
        <ul id="typesList">
            {contentNodes}
        </ul>
    );
};

// render a new main window
const createMainWindow = (csrf) => {
    ReactDOM.render(
        <MainWindow />,
        document.querySelector("#preferencesContent")
    );
    document.querySelector("#typeText").innerHTML = document.querySelector("#typeText").innerHTML.replace(/,/g, ', ');

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

    // setup changeTypes link
    const changeTypesLink = document.querySelector("#changeTypesLink");
    changeTypesLink.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        createChangeTypesWindow(csrf);
        return false;
    };
    revealContent();
};

// default to start window
const setup = (csrf) => {
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

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        csrf = result.csrfToken;
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});