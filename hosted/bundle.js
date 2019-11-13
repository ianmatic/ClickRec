"use strict";

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);
    if ($("#contentName").val() == '' || $("#contentType").val() == '' || $("#contentStatus").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#contentForm").attr("action"), $("#contentForm").serialize(), function () {
        loadContentFromServer();
    });

    return false;
};

var csrfToken = void 0;
var contentToDelete = void 0;

var deleteContent = function deleteContent(e) {
    e.preventDefault();

    // get the id of the content to be deleted
    var selectedContent = "uniqueid=" + e.target.parentElement.getAttribute("data-id") + "&_csrf=" + csrfToken;
    contentToDelete = e.target.parentElement;
    sendAjax('DELETE', "/maker", selectedContent, function () {
        contentToDelete.remove();
        contentToDelete = "";
    });
};

// enable editing on all elements in table
var editContent = function editContent(e) {
    // update edit button
    var editButton = $("#editButton");
    editButton.html('Save');
    editButton.off('click');
    editButton.click(saveContent);

    // enable editing
    $(".content").attr("contenteditable", true);
};
// save changes made to table
var saveContent = function saveContent(e) {
    // update edit button
    var editButton = $("#editButton");
    editButton.html('Edit Table');
    editButton.off('click');
    editButton.click(editContent);

    // disable editing
    var contentItems = $(".content");
    contentItems.attr("contenteditable", false);

    // build array full of new items
    var items = [];
    for (var i = 0; i < contentItems.length; i++) {
        var dataObj = {};
        dataObj.name = contentItems.find(".contentName")[i].innerText.split(':')[1].trim();
        dataObj.type = contentItems.find(".contentType")[i].innerText.split(':')[1].trim();
        dataObj.status = contentItems.find(".contentStatus")[i].innerText.split(':')[1].trim();
        dataObj.year = contentItems.find(".contentYear")[i].innerText.split(':')[1].trim();
        dataObj.image = contentItems.find("img")[i].getAttribute("src");
        dataObj.id = contentItems[i].getAttribute("data-id");
        items.push(dataObj);
    }

    // send ajax for all items to update them
    for (var _i = 0; _i < items.length; _i++) {
        var data = "name=" + items[_i].name + ("&type=" + items[_i].type) + ("&year=" + items[_i].year) + ("&image=" + items[_i].image) + ("&status=" + items[_i].status) + ("&uniqueid=" + items[_i].id) + ("&_csrf=" + csrfToken);
        sendAjax('PUT', '/maker', data); // update on server
    }
};
$("#editButton").click(editContent);

// The form for adding new content
var ContentForm = function ContentForm(props) {
    return React.createElement(
        "form",
        { id: "contentForm",
            onSubmit: handleDomo,
            name: "contentForm",
            action: "/maker",
            method: "POST",
            className: "contentForm"
        },
        "   ",
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name*: "
        ),
        React.createElement("input", { id: "contentName", type: "text", name: "name", placeholder: "Name", required: true }),
        React.createElement(
            "label",
            { htmlFor: "type" },
            "Type*: "
        ),
        React.createElement(
            "select",
            { id: "contentType", name: "type", required: true },
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
            ),
            React.createElement(
                "option",
                { value: "other" },
                "Other"
            )
        ),
        React.createElement("input", { id: "otherField", type: "text", name: "other", placeholder: "Other", disabled: true }),
        React.createElement(
            "label",
            { htmlFor: "status" },
            "Status*: "
        ),
        React.createElement(
            "select",
            { id: "contentStatus", name: "status", required: true },
            React.createElement(
                "option",
                { value: "wishlist" },
                "Wishlist"
            ),
            React.createElement(
                "option",
                { value: "inProgress" },
                "In Progress"
            ),
            React.createElement(
                "option",
                { value: "Complete" },
                "Complete"
            )
        ),
        React.createElement("br", null),
        React.createElement(
            "label",
            { htmlFor: "year" },
            "Year: "
        ),
        React.createElement("input", { id: "contentYear", type: "text", name: "year", placeholder: "Number" }),
        React.createElement(
            "label",
            { htmlFor: "image" },
            "Image: "
        ),
        React.createElement("input", { id: "contentImage", type: "text", name: "image", placeholder: "URL" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "addContentSubmit", type: "submit", value: "Add Content" })
    );
};

var ContentTable = function ContentTable(props) {
    if (props.contentTable.length === 0) {
        return React.createElement(
            "div",
            { className: "contentList" },
            React.createElement(
                "h3",
                { className: "emptyContent" },
                "No Content yet"
            )
        );
    }

    var contentNodes = props.contentTable.map(function (content) {
        return React.createElement(
            "div",
            { key: content._id, "data-id": content._id, className: "content" },
            React.createElement("img", { src: content.image, alt: content.name, className: "contentImg" }),
            React.createElement(
                "h3",
                { className: "contentName" },
                " Name: ",
                content.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "contentType" },
                " Type: ",
                content.type,
                " "
            ),
            React.createElement(
                "h3",
                { className: "contentStatus" },
                "Status: ",
                content.status
            ),
            React.createElement(
                "h3",
                { className: "contentYear" },
                " Year: ",
                content.year,
                " "
            ),
            React.createElement(
                "button",
                { className: "deleteButton", onClick: deleteContent },
                "Delete"
            )
        );
    });

    return React.createElement(
        "div",
        { className: "contentTable" },
        contentNodes
    );
};

var loadContentFromServer = function loadContentFromServer() {
    sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(ContentTable, { contentTable: data.domos }), document.querySelector("#contentTable"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(ContentForm, { csrf: csrf }), document.querySelector("#addContent"));
    ReactDOM.render(React.createElement(ContentForm, { contentTable: [] }), document.querySelector("#contentTable"));
    loadContentFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        csrfToken = result.csrfToken;
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

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
