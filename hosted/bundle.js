"use strict";

var layout = void 0;
var theme = void 0;

// used in all layouts
function setupControlListeners() {
    // stop propagation to allow multi-level select
    $('.dropdown-menu option, .dropdown-menu select').click(function (e) {
        e.stopPropagation();
    });

    // match filter color with selection
    $("#statusFilter, #typeFilter").change(function () {
        var select = $("#statusFilter");
        select.css("background-color", select.find(":selected").css("background-color"));

        filterContent($("#typeFilter").val(), $("#statusFilter").val());
    });

    $(".deleteButtonContainer").click(function (e) {
        var button = e.target;
        // unmark row
        if (button.className.includes("marked")) {
            button.classList.remove("marked");
        } // mark row
        else {
                button.className += " marked";
            }
    });

    // search whenever values change
    $("#searchInput").on('input change keyup paste', function () {

        var inputValue = $("#searchInput").val().toLowerCase();
        inputValue = inputValue.replace(/ +/g, ""); // take out spaces

        if (layout == "table") {
            var rows = $(".mediaRow");
            // empty so display all
            if (inputValue.length == 0) {
                rows.css("display", "table-row");
            } else {
                // otherwise filter

                // check all rows
                for (var i = 0; i < rows.length; i++) {

                    // get name type and notes
                    var textContent = rows[i].querySelector(".contentName").innerText + rows[i].querySelector(".contentType").innerText + rows[i].querySelector(".contentNotes").innerText;
                    textContent = textContent.replace(/ +/g, "");
                    textContent = textContent.toLowerCase();

                    // match, so display it
                    if (textContent.includes(inputValue)) {
                        rows[i].style.display = "table-row";
                    } else {
                        // no match, so hide
                        rows[i].style.display = "none";
                    }
                }
            }
        } else if (layout == "grid") {
            var gridItems = $(".gridItemWrapper");
            // empty so display all
            if (inputValue.length == 0) {
                gridItems.css("display", "block");
            } else {
                // otherwise filter

                // check all items
                for (var _i = 0; _i < gridItems.length; _i++) {

                    // get name type and notes
                    var _textContent = gridItems[_i].querySelector(".gridItemName").innerText + gridItems[_i].querySelector(".gridItemType").innerText + gridItems[_i].querySelector(".gridItemNotes").innerText;
                    _textContent = _textContent.replace(/ +/g, "");
                    _textContent = _textContent.toLowerCase();

                    // match, so display it
                    if (_textContent.includes(inputValue)) {
                        gridItems[_i].style.display = "block";
                    } else {
                        // no match, so hide
                        gridItems[_i].style.display = "none";
                    }
                }
            }
        }
    });
}

// only call when using table
function setupTableListeners() {
    // enable clicking on headers to sort
    $("#statusHeader").click(function () {
        sortContent(0);
    });
    $("#nameHeader").click(function () {
        sortContent(1);
    });
    $("#typeHeader").click(function () {
        sortContent(2);
    });
    $("#notesHeader").click(function () {
        sortContent(3);
    });
    $("#imageHeader").click(function () {
        sortContent(4);
    });

    // delete all button
    $("#deleteAllButton").click(function () {
        // select all
        var buttons = document.querySelectorAll(".deleteButton");

        // hasn't changed any icons yet
        var madeSelection = false;
        for (var i = 0; i < buttons.length; i++) {
            // mark all as selected
            if (!buttons[i].className.includes("marked")) {
                buttons[i].className += " marked";

                // made a selection
                madeSelection = true;
            }
        }

        // didn't change any icons, so deselect all
        if (!madeSelection) {
            for (var _i2 = 0; _i2 < buttons.length; _i2++) {
                if (buttons[_i2].className.includes("marked")) {
                    buttons[_i2].classList.remove("marked");
                }
            }
        }
    });
}

// filter the displayed content based on type and status
var filterContent = function filterContent(type, status) {

    type = type.toLowerCase();
    status = status.toLowerCase();
    if (layout == "table") {
        var tableBody = document.querySelector("#target");
        for (var i = 0; i < tableBody.rows.length; i++) {
            var rowType = tableBody.rows[i].querySelector(".contentType").getAttribute("data-serverData").trim().toLowerCase();
            var rowStatus = tableBody.rows[i].querySelector(".statusColumn").getAttribute("data-serverData").trim().toLowerCase();
            // all visible
            if (type == "all" && status == "all") {
                tableBody.rows[i].style.display = "table-row";
            } // enable content of type with corresponding status
            else if (rowType === type && (rowStatus === status || status == "all")) {
                    tableBody.rows[i].style.display = "table-row";
                } // enable content of status with corresponding type
                else if (rowStatus === status && (rowType === type || type == "all")) {
                        tableBody.rows[i].style.display = "table-row";
                    } // don't show
                    else {
                            tableBody.rows[i].style.display = "none";
                        }
        }
    } else if (layout == "grid") {
        var gridItems = $(".gridItemWrapper");
        for (var _i3 = 0; _i3 < gridItems.length; _i3++) {
            var gridType = gridItems[_i3].querySelector(".gridItemType").getAttribute("data-serverData").trim().toLowerCase();
            var gridStatus = gridItems[_i3].querySelector(".gridStatus").getAttribute("data-serverData").trim().toLowerCase();
            // all visible
            if (type == "all" && status == "all") {
                gridItems[_i3].style.display = "block";
            } // enable content of type with corresponding status
            else if (gridType === type && (gridStatus === status || status == "all")) {
                    gridItems[_i3].style.display = "block";
                } // enable contentf of status with corresponding type
                else if (gridStatus === status && (gridType === type || type == "all")) {
                        gridItems[_i3].style.display = "block";
                    } // don't show
                    else {
                            gridItems[_i3].style.display = "none";
                        }
        }
    }
};

// adds an item on backend
var addMedia = function addMedia(e) {
    e.preventDefault();

    // don't allow adding if editing
    if (!document.querySelector("#addSubmitButton").className.includes("btn-secondary")) {
        sendAjax('POST', $("#addForm").attr("action"), $("#addForm").serialize(), function () {
            loadContentFromServer(layout, theme);
        });
    } else {
        alert("Please save your changes before adding more media");
    }

    return false;
};

// helper variables for deleting media
var csrfToken = void 0;
var deleteMedia = function deleteMedia(item) {
    // get the id of the media to be deleted
    var selectedMedia = "uniqueid=" + item.getAttribute("data-id") + "&_csrf=" + csrfToken;
    $(item).remove();
    item = "";
    sendAjax('DELETE', "/main", selectedMedia, function () {});
};

// enable editing on all elements in table
var editMedia = function editMedia(e) {
    // update edit button
    var editButton = $("#editButton");
    editButton.toggleClass('editing');
    editButton.off('click');
    editButton.click(saveMedia);

    // update add button
    $("#addSubmitButton").toggleClass("btn-secondary");
    $("#addSubmitButton").toggleClass("btn-outline-primary");

    // show delete button
    $(".deleteButtonContainer, #deleteAllButton").css("visibility", "visible");
    $(".deleteButtonContainer, #deleteAllButton").css("opacity", "1");

    // enable editing
    if (layout == "table") {
        $(".mediaRow").attr("contenteditable", true);
    } else if (layout == "grid") {
        $(".gridItemWrapper").attr("contenteditable", true);
    }
};
// save changes made to table
var saveMedia = function saveMedia(e) {
    // update edit button
    var editButton = $("#editButton");
    editButton.toggleClass('editing');
    editButton.off('click');
    editButton.click(editMedia);

    // update add button
    $("#addSubmitButton").toggleClass("btn-secondary");
    $("#addSubmitButton").toggleClass("btn-outline-primary");

    var items = [];
    if (layout == "table") {
        // disable editing
        var rowItems = $(".mediaRow");
        rowItems.attr("contenteditable", false);

        // delete rows
        for (var i = 0; i < rowItems.length; i++) {
            if (rowItems[i].querySelector(".deleteButton").className.includes("marked")) {
                deleteMedia(rowItems[i]);
            }
        }

        // build array full of new items
        for (var _i4 = 0; _i4 < rowItems.length; _i4++) {
            var dataObj = {};
            dataObj.name = rowItems.find(".contentName")[_i4].innerText;
            dataObj.type = rowItems.find(".contentType")[_i4].innerText;
            dataObj.status = rowItems.find(".dropdown-menu")[_i4].getAttribute("value");
            dataObj.notes = rowItems.find(".contentNotes")[_i4].innerText;
            dataObj.image = rowItems.find("img")[_i4].getAttribute("src");
            dataObj.id = rowItems[_i4].getAttribute("data-id");
            items.push(dataObj);
        }
    } else if (layout == "grid") {

        // disable editing
        var gridItems = $(".gridItemWrapper");
        gridItems.attr("contenteditable", false);

        // delete rows
        for (var _i5 = 0; _i5 < gridItems.length; _i5++) {
            if (gridItems[_i5].querySelector(".deleteButton").className.includes("marked")) {
                deleteMedia(gridItems[_i5]);
            }
        }

        // build array full of new items
        for (var _i6 = 0; _i6 < gridItems.length; _i6++) {
            var _dataObj = {};
            _dataObj.name = gridItems.find(".gridItemName")[_i6].innerText;
            _dataObj.type = gridItems.find(".gridItemType")[_i6].innerText;
            _dataObj.status = gridItems.find(".dropdown-menu")[_i6].getAttribute("value");
            _dataObj.notes = gridItems.find(".gridItemNotes")[_i6].innerText;
            _dataObj.image = gridItems.find(".gridContentImage")[_i6].getAttribute("src");
            _dataObj.id = gridItems[_i6].getAttribute("data-id");
            items.push(_dataObj);
        }
    }

    // send ajax for all items to update them

    var _loop = function _loop(_i7) {
        var data = "name=" + items[_i7].name + ("&type=" + items[_i7].type) + ("&notes=" + items[_i7].notes) + ("&image=" + items[_i7].image) + ("&status=" + items[_i7].status) + ("&uniqueid=" + items[_i7].id) + ("&_csrf=" + csrfToken);
        sendAjax('PUT', '/main', data, function () {
            // only load on last one
            if (_i7 == items.length - 1) {
                loadContentFromServer(layout, theme);
            }
        }); // update on server
    };

    for (var _i7 = 0; _i7 < items.length; _i7++) {
        _loop(_i7);
    }

    // hide delete buttons
    $(".deleteButtonContainer, #deleteAllButton").css("visibility", "hidden");
    $(".deleteButtonContainer, #deleteAllButton").css("opacity", "0");
};

// used W3 for reference algo https://www.w3schools.com/howto/howto_js_sort_table.asp
// column is number
function sortContent(column) {
    var table = document.querySelector("#contentTable");
    // sort only if multiple rows (not including header row)
    if (table.rows.length > 2) {
        var rows = void 0,
            i = void 0,
            switchRows = void 0;

        var switchCount = 0;
        var sorting = true;
        var direction = "ascending";

        // loop until no more sorting
        while (sorting) {
            sorting = false;
            rows = table.rows;

            // check each row (0 is undefined for prev and 1 is header for prev)
            for (i = 2; i < rows.length; i++) {

                switchRows = false;
                var previousRow = rows[i - 1].querySelectorAll("td")[column];
                var currentRow = rows[i].querySelectorAll("td")[column];

                // sort by number
                if (column == 3) {
                    // ascending order
                    if (direction === "ascending" && Number(previousRow.innerHTML) > Number(currentRow.innerHTML)) {
                        switchRows = true;
                        break;
                        //descending order
                    } else if (direction === "descending" && Number(previousRow.innerHTML) < Number(currentRow.innerHTML)) {
                        switchRows = true;
                        break;
                    }
                }
                // sort by status
                else if (column == 0) {
                        // ascending order
                        if (direction === "ascending" && previousRow.getAttribute("data-serverData") > currentRow.getAttribute("data-serverData")) {
                            switchRows = true;
                            break;
                            //descending order
                        } else if (direction === "descending" && previousRow.getAttribute("data-serverData") < currentRow.getAttribute("data-serverData")) {
                            switchRows = true;
                            break;
                        }
                    }
                    // sort by string
                    else {
                            // ascending order
                            if (direction === "ascending" && previousRow.innerHTML.toLowerCase() > currentRow.innerHTML.toLowerCase()) {
                                switchRows = true;
                                break;
                                //descending order
                            } else if (direction === "descending" && previousRow.innerHTML.toLowerCase() < currentRow.innerHTML.toLowerCase()) {
                                switchRows = true;
                                break;
                            }
                        }
            }

            // prev is bigger, so move curr to before prev (swap spots)
            if (switchRows) {
                rows[i - 1].parentNode.insertBefore(rows[i], rows[i - 1]);
                // haven't finished sorting, so keep looping
                sorting = true;
                switchCount++;
            } else if (switchCount === 0 && direction == "ascending") {
                // nothing to sort in ascending order, so try descending order
                direction = "descending";
                sorting = true;
            }
        }
    }
}

// The form for adding new content
var Controls = function Controls(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            { id: "addContentContainer" },
            React.createElement(
                "h5",
                { className: "controlsTitle" },
                "Add Media"
            ),
            React.createElement(
                "form",
                { id: "addForm",
                    onSubmit: addMedia,
                    name: "addForm",
                    action: "/main",
                    method: "POST",
                    className: "addForm"
                },
                React.createElement(
                    "div",
                    { className: "form-group row inputField" },
                    React.createElement(
                        "label",
                        { "for": "name", className: "col-2 col-form-label" },
                        "Name*: "
                    ),
                    React.createElement(
                        "div",
                        { className: "col-6" },
                        React.createElement("input", { className: "form-control", id: "nameField", type: "text", name: "name", placeholder: "Name", required: true })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group row inputField" },
                    React.createElement(
                        "label",
                        { className: "col-2 col-form-label", "for": "type" },
                        "Type*: "
                    ),
                    React.createElement(
                        "div",
                        { className: "col-6" },
                        React.createElement(
                            "select",
                            { className: "custom-select", id: "typeField", name: "type", required: "" },
                            React.createElement(
                                "option",
                                { value: "film" },
                                "Film"
                            ),
                            React.createElement(
                                "option",
                                { value: "tv" },
                                "TV"
                            ),
                            React.createElement(
                                "option",
                                { value: "game" },
                                "Game"
                            ),
                            React.createElement(
                                "option",
                                { value: "literature" },
                                "Literature"
                            ),
                            React.createElement(
                                "option",
                                { value: "music" },
                                "Music"
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group row inputField" },
                    React.createElement(
                        "label",
                        { className: "col-2 col-form-label", "for": "status" },
                        "Status*: "
                    ),
                    React.createElement(
                        "div",
                        { className: "col-6" },
                        React.createElement(
                            "select",
                            { className: "custom-select", id: "statusField", name: "status", required: true },
                            React.createElement(
                                "option",
                                { className: "wishList", value: "wishList", selected: "" },
                                "Wishlist"
                            ),
                            React.createElement(
                                "option",
                                { className: "inProgress", value: "inProgress" },
                                "In Progress"
                            ),
                            React.createElement(
                                "option",
                                { className: "complete", value: "complete" },
                                "Complete"
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group row inputField" },
                    React.createElement(
                        "label",
                        { className: "col-2 col-form-label", "for": "notes" },
                        "Notes: "
                    ),
                    React.createElement(
                        "div",
                        { className: "col-6" },
                        React.createElement("input", { className: "form-control", id: "notesField", type: "text", name: "notes", placeholder: "Notes" })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group row inputField" },
                    React.createElement(
                        "label",
                        { className: "col-2 col-form-label", "for": "image" },
                        "Image: "
                    ),
                    React.createElement(
                        "div",
                        { className: "col-6" },
                        React.createElement("input", { className: "form-control", id: "imageField", type: "text", name: "image", placeholder: "URL" })
                    )
                ),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { id: "addSubmitButton", className: "btn btn-outline-primary", type: "submit", value: "Add Media" })
            )
        )
    );
};

// build table framework
var TableFrame = function TableFrame(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "button",
            { className: "btn btn-outline-primary", id: "deleteAllButton", type: "button" },
            "Select All"
        ),
        React.createElement(
            "table",
            { className: "table table-striped", id: "contentTable" },
            React.createElement(
                "colgroup",
                null,
                React.createElement("col", { width: "5.5%" }),
                React.createElement("col", { width: "23.75%" }),
                React.createElement("col", { width: "23.75%" }),
                React.createElement("col", { width: "23.75%" }),
                React.createElement("col", { width: "23.75%" })
            ),
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement("th", { className: "tableHeader", id: "statusHeader" }),
                    React.createElement(
                        "th",
                        { className: "tableHeader", id: "nameHeader" },
                        "Name"
                    ),
                    React.createElement(
                        "th",
                        { className: "tableHeader", id: "typeHeader" },
                        "Type"
                    ),
                    React.createElement(
                        "th",
                        { className: "tableHeader", id: "notesHeader" },
                        "Notes"
                    ),
                    React.createElement(
                        "th",
                        { className: "tableHeader", id: "imageHeader" },
                        "Image"
                    )
                )
            ),
            React.createElement("tbody", { id: "target" })
        )
    );
};

// build  grid

// build table contents
var ContentTable = function ContentTable(props) {

    // build rows filled with cells
    var contentNodes = props.contentTable.map(function (content) {
        return (
            // Row
            React.createElement(
                "tr",
                { "data-id": content._id, className: "mediaRow" },
                React.createElement(
                    "td",
                    { className: "statusColumn " + content.status, "data-serverdata": "" + content.status },
                    React.createElement(
                        "div",
                        { className: "rowDropDownWrapper dropdown" },
                        React.createElement("button", { className: "rowDropDown btn btn-secondary dropdown-toggle " + content.status,
                            type: "button", "data-toggle": "dropdown" }),
                        React.createElement(
                            "ul",
                            { value: "" + content.status, className: "dropdown-menu" },
                            React.createElement(
                                "li",
                                { className: "wishList dropdown-item", value: "wishList" },
                                "Wish List"
                            ),
                            React.createElement(
                                "li",
                                { className: "inProgress dropdown-item", value: "inProgress" },
                                "In Progress"
                            ),
                            React.createElement(
                                "li",
                                { className: "complete dropdown-item", value: "complete" },
                                "Complete"
                            )
                        )
                    )
                ),
                React.createElement(
                    "td",
                    { "data-serverdata": "" + content.name, className: "dataCell contentName" },
                    content.name
                ),
                React.createElement(
                    "td",
                    { "data-serverdata": "" + content.type, className: "dataCell contentType" },
                    content.type
                ),
                React.createElement(
                    "td",
                    { "data-serverdata": "" + content.notes, className: "dataCell contentNotes" },
                    content.notes
                ),
                React.createElement(
                    "td",
                    { "data-serverdata": "" + content.image, className: "dataCell contentImage" },
                    React.createElement("img", { src: content.image, alt: content.name, className: "contentImg" })
                ),
                React.createElement(
                    "div",
                    { className: "deleteButtonContainer" },
                    React.createElement("i", { className: "fas fa-trash deleteButton" })
                )
            )
        );
    });

    return (
        // need to wrap in div to submit, so submit with tbody then swap with table tbody
        React.createElement(
            "tbody",
            { id: "target" },
            contentNodes
        )
    );
};

// build grid contents
var ContentGrid = function ContentGrid(props) {
    var contentNodes = props.contentGrid.map(function (content) {
        return React.createElement(
            "div",
            { className: "gridItemWrapper", "data-id": content._id },
            React.createElement(
                "div",
                { "data-serverdata": "" + content.status, className: "gridStatus " + content.status },
                React.createElement(
                    "div",
                    { className: "rowDropDownWrapper gridDropDownWrapper dropdown" },
                    React.createElement("button", { className: "rowDropDown btn btn-secondary dropdown-toggle " + content.status,
                        type: "button", "data-toggle": "dropdown" }),
                    React.createElement(
                        "ul",
                        { value: "" + content.status, className: "dropdown-menu" },
                        React.createElement(
                            "li",
                            { className: "wishList dropdown-item", value: "wishList" },
                            "Wish List"
                        ),
                        React.createElement(
                            "li",
                            { className: "inProgress dropdown-item", value: "inProgress" },
                            "In Progress"
                        ),
                        React.createElement(
                            "li",
                            { className: "complete dropdown-item", value: "complete" },
                            "Complete"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "deleteButtonContainer gridItemDeleteButton" },
                    React.createElement("i", { className: "fas fa-trash deleteButton" })
                )
            ),
            React.createElement(
                "div",
                { "data-serverdata": "" + content.image, className: "gridItemImage" },
                React.createElement("img", { src: content.image, alt: content.name, className: "gridContentImage" })
            ),
            React.createElement(
                "p",
                { "data-serverdata": "" + content.name, className: "gridItemName" },
                content.name
            ),
            React.createElement(
                "p",
                { "data-serverdata": "" + content.type, className: "gridItemType" },
                content.type
            ),
            React.createElement(
                "p",
                { "data-serverdata": "" + content.notes, className: "gridItemNotes" },
                content.notes
            )
        );
    });

    return React.createElement(
        "div",
        { id: "contentContainer", className: "gridContainer" },
        contentNodes
    );
};

// first get token
$(document).ready(function () {
    getToken();
});

// then setup the page
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        csrfToken = result.csrfToken;
        setup(result.csrfToken);
    });
};

// then build the controls and load from server
var setup = function setup(csrf) {
    // first load preferences
    sendAjax('GET', '/getPreferences', null, function (result) {

        // update css rule
        var sheet = window.document.styleSheets[0];
        sheet.addRule('.wishList', 'background-color: ' + result.wishListColor + " !important;");
        sheet.addRule('.inProgress', 'background-color: ' + result.inProgressColor + " !important;");
        sheet.addRule('.complete', 'background-color: ' + result.completeColor + " !important;");

        // build controls, add and edit
        ReactDOM.render(React.createElement(Controls, { csrf: csrf }), document.querySelector("#controls"));
        $("#editButton").click(editMedia);

        // change color of selects to selected status
        var select = $("#statusField");
        select.attr("class", "custom-select " + select.find(":selected").attr("class"));
        $("#statusField").change(function () {
            var select = $("#statusField");
            select.attr("class", "custom-select " + select.find(":selected").attr("class"));
        });

        layout = result.layout;
        theme = result.theme;
        loadContentFromServer(layout, theme);
    });
};

// lastly build table from server data
var loadContentFromServer = function loadContentFromServer(layout, theme) {
    sendAjax('GET', '/getMedia', null, function (data) {

        // already has data, so render it
        if (data.media.length > 0) {
            // table
            if (layout == "table") {

                // table frame
                ReactDOM.render(React.createElement(TableFrame, null), document.querySelector("#contentContainer"));
                setupTableListeners();

                // table contents
                var temp = $("<div></div>");
                ReactDOM.render(React.createElement(ContentTable, { contentTable: data.media }), temp[0]);

                $("#target").replaceWith(temp.children()[0]); // swap out tbody

                // update table when changing status
                $("li").click(function (e) {
                    // update button parent visuals
                    var ul = $(e.target).closest('ul');
                    var button = $(e.target.parentElement.parentElement.querySelector("button"));
                    var value = e.target.getAttribute("value");
                    ul.attr("value", value);
                    button.attr("class", "rowDropDown btn btn-secondary dropdown-toggle " + value);
                    // don't fire if editing table
                    if (!document.querySelector("#addSubmitButton").className.includes("btn-secondary")) {
                        var row = $(e.target).closest('tr');

                        // update status
                        row.find(".statusColumn").attr("class", "statusColumn " + value);

                        // send to DB
                        var _data = "name=" + row.find(".contentName").attr("data-serverdata") + ("&type=" + row.find(".contentType").attr("data-serverdata")) + ("&notes=" + row.find(".contentNotes").attr("data-serverdata")) + ("&image=" + row.find(".contentImage").attr("data-serverdata")) + ("&status=" + value) + ("&uniqueid=" + row.attr("data-id")) + ("&_csrf=" + csrfToken);
                        sendAjax('PUT', '/main', _data, function () {
                            loadContentFromServer(layout, theme);
                        }); // update on server
                    }
                });
            } else if (layout == "grid") {
                // grid

                var _temp = $("<div></div>"); // temporarily render the react component into temp
                ReactDOM.render(React.createElement(ContentGrid, { contentGrid: data.media }), _temp[0]);

                // replace content container with one created by react (child of temp)
                $("#contentContainer").replaceWith(_temp.children()[0]);

                // update table when changing status
                $("li").click(function (e) {
                    // update button parent visuals
                    var ul = $(e.target).closest('ul');
                    var button = $(e.target.parentElement.parentElement.querySelector("button"));
                    var value = e.target.getAttribute("value");
                    ul.attr("value", value);
                    button.attr("class", "rowDropDown btn btn-secondary dropdown-toggle " + value);
                    // don't fire if editing table
                    if (!document.querySelector("#addSubmitButton").className.includes("btn-secondary")) {
                        var gridItem = $(e.target).closest('.gridItemWrapper');
                        // update status display
                        gridItem.find(".gridStatus").attr("class", "gridStatus " + value);

                        // send to DB
                        var _data2 = "name=" + gridItem.find(".gridItemname").attr("data-serverdata") + ("&type=" + gridItem.find(".gridItemType").attr("data-serverdata")) + ("&notes=" + gridItem.find(".gridItemNotes").attr("data-serverdata")) + ("&image=" + gridItem.find(".gridItemImage").attr("data-serverdata")) + ("&status=" + value) + ("&uniqueid=" + gridItem.attr("data-id")) + ("&_csrf=" + csrfToken);
                        sendAjax('PUT', '/main', _data2, function () {
                            loadContentFromServer(layout, theme);
                        }); // update on server
                    }
                });
            }
        }

        // regardless if the content was rendered, setup controls
        setupControlListeners();

        // apply dark theme if enabled
        if (theme == "dark") {
            $('head').append('<link rel="stylesheet" title="darkTheme" type="text/css" href="/assets/darkStyle.css">');
        } else {
            $('link[title="darkTheme"]').remove();
        }
    });
};
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
