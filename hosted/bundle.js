"use strict";

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

$('.dropdown-menu option, .dropdown-menu select').click(function (e) {
    e.stopPropagation();
});

$("#statusFilter, #typeFilter").change(function () {
    var select = $("#statusFilter");
    select.css("background-color", select.find(":selected").css("background-color"));

    filterRows($("#typeFilter").val(), $("#statusFilter").val());
});

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
        for (var _i = 0; _i < buttons.length; _i++) {
            if (buttons[_i].className.includes("marked")) {
                buttons[_i].classList.remove("marked");
            }
        }
    }
});

// search whenever values change
$("#searchInput").on('input change keyup paste', function () {

    var inputValue = $("#searchInput").val().toLowerCase();
    inputValue = inputValue.replace(/ +/g, "");

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
});

// filter the displayed rows based on type and status
var filterRows = function filterRows(type, status) {

    type = type.toLowerCase();
    status = status.toLowerCase();
    var tableBody = document.querySelector("#target");
    for (var i = 0; i < tableBody.rows.length; i++) {
        var rowType = tableBody.rows[i].querySelector(".contentType").getAttribute("data-serverData").trim().toLowerCase();
        var rowStatus = tableBody.rows[i].querySelector(".statusColumn").getAttribute("data-serverData").trim().toLowerCase();
        // all visible
        if (type == "all" && status == "all") {
            tableBody.rows[i].style.display = "table-row";
        } // enable rows of type with corresponding status
        else if (rowType === type && (rowStatus === status || status == "all")) {
                tableBody.rows[i].style.display = "table-row";
            } // enable rows of status with corresponding type
            else if (rowStatus === status && (rowType === type || type == "all")) {
                    tableBody.rows[i].style.display = "table-row";
                } // don't show
                else {
                        tableBody.rows[i].style.display = "none";
                    }
    }
};

// adds an item on backend
var addMedia = function addMedia(e) {
    e.preventDefault();

    // don't allow adding if editing
    if (!document.querySelector("#addSubmitButton").className.includes("btn-secondary")) {
        sendAjax('POST', $("#addForm").attr("action"), $("#addForm").serialize(), function () {
            loadContentFromServer();
        });
    } else {
        alert("Please save your changes before adding more media");
    }

    return false;
};

// helper variables for deleting media
var csrfToken = void 0;
var deleteMedia = function deleteMedia(row) {
    // get the id of the media to be deleted
    var selectedMedia = "uniqueid=" + row.getAttribute("data-id") + "&_csrf=" + csrfToken;
    $(row).remove();
    row = "";
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
    $(".mediaRow").attr("contenteditable", true);
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
    var items = [];
    for (var _i2 = 0; _i2 < rowItems.length; _i2++) {
        var dataObj = {};
        dataObj.name = rowItems.find(".contentName")[_i2].innerText;
        dataObj.type = rowItems.find(".contentType")[_i2].innerText;
        dataObj.status = rowItems.find(".dropdown-menu")[_i2].getAttribute("value");
        dataObj.notes = rowItems.find(".contentNotes")[_i2].innerText;
        dataObj.image = rowItems.find("img")[_i2].getAttribute("src");
        dataObj.id = rowItems[_i2].getAttribute("data-id");
        items.push(dataObj);
    }

    // send ajax for all items to update them
    for (var _i3 = 0; _i3 < items.length; _i3++) {
        var data = "name=" + items[_i3].name + ("&type=" + items[_i3].type) + ("&notes=" + items[_i3].notes) + ("&image=" + items[_i3].image) + ("&status=" + items[_i3].status) + ("&uniqueid=" + items[_i3].id) + ("&_csrf=" + csrfToken);
        sendAjax('PUT', '/main', data, function () {
            loadContentFromServer();
        }); // update on server
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

// build table
var ContentTable = function ContentTable(props) {
    // empty table
    if (props.contentTable.length === 0) {
        $(".emptyContent").css("display", "block");
        return React.createElement("div", { id: "target" });
    }
    $(".emptyContent").css("display", "none");

    // build rows filled with cells
    var contentNodes = props.contentTable.map(function (content) {
        return (
            // Row
            React.createElement(
                "tr",
                { key: content._id, "data-id": content._id, className: "mediaRow" },
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
                    " ",
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
    // build controls, add and edit
    ReactDOM.render(React.createElement(Controls, { csrf: csrf }), document.querySelector("#controls"));
    $("#editButton").click(editMedia);

    // change color of selects to selected status
    var select = $("#statusField");
    select.css("background-color", select.find(":selected").css("background-color"));
    $("#statusField").change(function () {
        var select = $("#statusField");
        select.css("background-color", select.find(":selected").css("background-color"));
    });
    loadContentFromServer();
};

// lastly build table from server data
var loadContentFromServer = function loadContentFromServer() {
    sendAjax('GET', '/getMedia', null, function (data) {
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
            if (document.querySelector("#editButton").className.includes("editing")) {
                var row = $(e.target).closest('tr');
                row.find(".statusColumn").attr("class", "statusColumn " + value);
                var _data = "name=" + row.find(".contentName")[0].innerText + ("&type=" + row.find(".contentType")[0].innerText) + ("&notes=" + row.find(".contentNotes")[0].innerText) + ("&image=" + row.find("img")[0].getAttribute("src")) + ("&status=" + value) + ("&uniqueid=" + row.attr("data-id")) + ("&_csrf=" + csrfToken);
                sendAjax('PUT', '/main', _data, function () {
                    loadContentFromServer();
                }); // update on server
            }
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
    });
};
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
