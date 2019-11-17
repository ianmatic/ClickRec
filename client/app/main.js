// enable clicking on headers to sort
$("#statusHeader").click(() => {
    sortContent(0);
});
$("#nameHeader").click(() => {
    sortContent(1);
});
$("#typeHeader").click(() => {
    sortContent(2);
});
$("#notesHeader").click(() => {
    sortContent(3);
});
$("#imageHeader").click(() => {
    sortContent(4);
});

$('.dropdown-menu option, .dropdown-menu select').click(function (e) {
    e.stopPropagation();
});


$("#statusFilter, #typeFilter").change(() => {
    const select = $("#statusFilter");
    select.css("background-color", select.find(":selected").css("background-color"));

    filterRows($("#typeFilter").val(), $("#statusFilter").val());
});


$("#deleteAllButton").click(() => {
    // select all
    let buttons = document.querySelectorAll(".deleteButton");

    // hasn't changed any icons yet
    let madeSelection = false;
    for (let i = 0; i < buttons.length; i++) {
        // mark all as selected
        if (!buttons[i].className.includes("marked")) {
            buttons[i].className += " marked";

            // made a selection
            madeSelection = true;
        }
    }

    // didn't change any icons, so deselect all
    if (!madeSelection) {
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].className.includes("marked")) {
                buttons[i].classList.remove("marked");
            }
        }
    }
});


// search whenever values change
$("#searchInput").on('input change keyup paste', () => {

    let inputValue = $("#searchInput").val().toLowerCase();
    inputValue = inputValue.replace(/ +/g, "");

    const rows = $(".mediaRow");
    // empty so display all
    if (inputValue.length == 0) {
        rows.css("display", "table-row");
    }
    else { // otherwise filter

        // check all rows
        for (let i = 0; i < rows.length; i++) {

            // get name type and notes
            let textContent = rows[i].querySelector(".contentName").innerText +
                rows[i].querySelector(".contentType").innerText +
                rows[i].querySelector(".contentNotes").innerText;
            textContent = textContent.replace(/ +/g, "");
            textContent = textContent.toLowerCase();

            // match, so display it
            if (textContent.includes(inputValue)) {
                rows[i].style.display = "table-row";
            }
            else { // no match, so hide
                rows[i].style.display = "none";
            }
        }
    }
});

// filter the displayed rows based on type and status
const filterRows = (type, status) => {

    type = type.toLowerCase();
    status = status.toLowerCase();
    const tableBody = document.querySelector("#target");
    for (let i = 0; i < tableBody.rows.length; i++) {
        const rowType = tableBody.rows[i].querySelector(".contentType").getAttribute("data-serverData").trim().toLowerCase();
        const rowStatus = tableBody.rows[i].querySelector(".statusColumn").getAttribute("data-serverData").trim().toLowerCase();
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
}


// adds an item on backend
const addMedia = (e) => {
    e.preventDefault();

    // don't allow adding if editing
    if (!document.querySelector("#addSubmitButton").className.includes("btn-secondary")) {
        sendAjax('POST', $("#addForm").attr("action"), $("#addForm").serialize(), function () {
            loadContentFromServer();
        });
    }
    else {
        alert("Please save your changes before adding more media");
    }


    return false;
};

// helper variables for deleting media
let csrfToken;
const deleteMedia = (row) => {
    // get the id of the media to be deleted
    var selectedMedia = `uniqueid=${row.getAttribute("data-id")}&_csrf=${csrfToken}`;
    $(row).remove();
    row = "";
    sendAjax('DELETE', "/main", selectedMedia, () => {
    });
}

// enable editing on all elements in table
const editMedia = (e) => {
    // update edit button
    const editButton = $("#editButton");
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
}
// save changes made to table
const saveMedia = (e) => {
    // update edit button
    const editButton = $("#editButton");
    editButton.toggleClass('editing');
    editButton.off('click');
    editButton.click(editMedia);

    // update add button
    $("#addSubmitButton").toggleClass("btn-secondary");
    $("#addSubmitButton").toggleClass("btn-outline-primary");


    // disable editing
    const rowItems = $(".mediaRow");
    rowItems.attr("contenteditable", false);

    // delete rows
    for (let i = 0; i < rowItems.length; i++) {
        if (rowItems[i].querySelector(".deleteButton").className.includes("marked")) {
            deleteMedia(rowItems[i])
        }
    }

    // build array full of new items
    let items = [];
    for (let i = 0; i < rowItems.length; i++) {
        let dataObj = {};
        dataObj.name = rowItems.find(".contentName")[i].innerText;
        dataObj.type = rowItems.find(".contentType")[i].innerText;
        dataObj.status = rowItems.find(".dropdown-menu")[i].getAttribute("value");
        dataObj.notes = rowItems.find(".contentNotes")[i].innerText;
        dataObj.image = rowItems.find("img")[i].getAttribute("src");
        dataObj.id = rowItems[i].getAttribute("data-id");
        items.push(dataObj);
    }

    // send ajax for all items to update them
    for (let i = 0; i < items.length; i++) {
        const data = `name=${items[i].name}` +
            `&type=${items[i].type}` +
            `&notes=${items[i].notes}` +
            `&image=${items[i].image}` +
            `&status=${items[i].status}` +
            `&uniqueid=${items[i].id}` +
            `&_csrf=${csrfToken}`;
        sendAjax('PUT', '/main', data, () => {
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
    const table = document.querySelector("#contentTable");
    // sort only if multiple rows (not including header row)
    if (table.rows.length > 2) {
        let rows, i, switchRows;

        let switchCount = 0;
        let sorting = true;
        let direction = "ascending";

        // loop until no more sorting
        while (sorting) {
            sorting = false;
            rows = table.rows;

            // check each row (0 is undefined for prev and 1 is header for prev)
            for (i = 2; i < rows.length; i++) {

                switchRows = false;
                let previousRow = rows[i - 1].querySelectorAll("td")[column];
                let currentRow = rows[i].querySelectorAll("td")[column];

                // sort by number
                if (column == 3) {
                    // ascending order
                    if (direction === "ascending" && Number(previousRow.innerHTML) > Number(currentRow.innerHTML)) {
                        switchRows = true;
                        break;
                        //descending order
                    }
                    else if (direction === "descending" && Number(previousRow.innerHTML) < Number(currentRow.innerHTML)) {
                        switchRows = true;
                        break;
                    }
                }
                // sort by status
                else if (column == 0) {
                    // ascending order
                    if (direction === "ascending" && previousRow.getAttribute("data-serverData")
                        > currentRow.getAttribute("data-serverData")) {
                        switchRows = true;
                        break;
                        //descending order
                    }
                    else if (direction === "descending" && previousRow.getAttribute("data-serverData")
                        < currentRow.getAttribute("data-serverData")) {
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
                    }
                    else if (direction === "descending" && previousRow.innerHTML.toLowerCase() < currentRow.innerHTML.toLowerCase()) {
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
            } else if (switchCount === 0 && direction == "ascending") { // nothing to sort in ascending order, so try descending order
                direction = "descending";
                sorting = true;
            }
        }
    }
}

// The form for adding new content
const Controls = (props) => {
    return (
        <div>
            <div id="addContentContainer">
                {/*Title*/}
                <h5 className="controlsTitle">Add Media</h5>
                {/*Form*/}
                <form id="addForm"
                    onSubmit={addMedia}
                    name="addForm"
                    action="/main"
                    method="POST"
                    className="addForm"
                >
                    {/*Name*/}
                    <div className="form-group row inputField">
                        <label for="name" className="col-2 col-form-label">Name*: </label>
                        <div className="col-6">
                            <input className="form-control" id="nameField" type="text" name="name" placeholder="Name" required />
                        </div>
                    </div>
                    {/*Type*/}
                    <div className="form-group row inputField">
                        <label className="col-2 col-form-label" for="type">Type*: </label>
                        <div className="col-4">
                            <select className="custom-select" id="typeField" name="type" required="">
                                <option value="film">Film</option>
                                <option value="tv">TV</option>
                                <option value="game">Game</option>
                                <option value="literature">Literature</option>
                                <option value="music">Music</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="col-4" id="otherContainer">
                            <input className="form-control" id="otherField" type="text" name="other" placeholder="Other" disabled />
                        </div>
                    </div>
                    {/*Status*/}
                    <div className="form-group row inputField">
                        <label className="col-2 col-form-label" for="status">Status*: </label>
                        <div className="col-6">
                            <select className="custom-select" id="statusField" name="status" required>
                                <option className="wishList" value="wishList" selected="">Wishlist</option>
                                <option className="inProgress" value="inProgress">In Progress</option>
                                <option className="complete" value="complete">Complete</option>
                            </select>
                        </div>
                    </div>
                    {/*Notes*/}
                    <div className="form-group row inputField">
                        <label className="col-2 col-form-label" for="notes">Notes: </label>
                        <div className="col-6">
                            <input className="form-control" id="notesField" type="text" name="notes" placeholder="Notes" />
                        </div>
                    </div>
                    {/*Image*/}
                    <div className="form-group row inputField">
                        <label className="col-2 col-form-label" for="image">Image: </label>
                        <div className="col-6">
                            <input className="form-control" id="imageField" type="text" name="image" placeholder="URL" />
                        </div>
                    </div>
                    {/*CSRF*/}
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    {/*Submit*/}
                    <input id="addSubmitButton" className="btn btn-outline-primary" type="submit" value="Add Media" />
                </form>
            </div>
        </div>
    );
};

// build table
const ContentTable = function (props) {
    // empty table
    if (props.contentTable.length === 0) {
        $(".emptyContent").css("display", "block");
        return (
            <div id="target">
            </div>
        );
    }
    $(".emptyContent").css("display", "none");



    // build rows filled with cells
    const contentNodes = props.contentTable.map(function (content) {
        return (
            // Row
            <tr key={content._id} data-id={content._id} className="mediaRow">
                {/*Status with dropdown*/}
                <td className={`statusColumn ${content.status}`} data-serverdata={`${content.status}`}>
                    <div className="rowDropDownWrapper dropdown">
                        <button className={`rowDropDown btn btn-secondary dropdown-toggle ${content.status}`}
                            type="button" data-toggle="dropdown">
                        </button>
                        <ul value={`${content.status}`} className="dropdown-menu">
                            <li className="wishList dropdown-item" value="wishList">Wish List</li>
                            <li className="inProgress dropdown-item" value="inProgress">In Progress</li>
                            <li className="complete dropdown-item" value="complete">Complete</li>
                        </ul>
                    </div>
                </td>
                <td data-serverdata={`${content.name}`} className="dataCell contentName">{content.name}</td>
                <td data-serverdata={`${content.type}`} className="dataCell contentType"> {content.type}</td>
                <td data-serverdata={`${content.notes}`} className="dataCell contentNotes">{content.notes}</td>
                {/*Image*/}
                <td data-serverdata={`${content.image}`} className="dataCell contentImage"><img src={content.image} alt={content.name} className="contentImg" /></td>
                {/*Invisible delete button*/}
                <div className="deleteButtonContainer">
                    <i className="fas fa-trash deleteButton"></i>
                </div>

            </tr>
        );
    });

    return (
        // need to wrap in div to submit, so submit with tbody then swap with table tbody
        <tbody id="target">
            {contentNodes}
        </tbody>
    );
};



// first get token
$(document).ready(function () {
    getToken();
})

// then setup the page
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        csrfToken = result.csrfToken;
        setup(result.csrfToken);
    });
};

// then build the controls and load from server
const setup = function (csrf) {
    // build controls, add and edit
    ReactDOM.render(
        <Controls csrf={csrf} />, document.querySelector("#controls")
    );
    $("#editButton").click(editMedia);

    // change color of selects to selected status
    const select = $("#statusField");
    select.css("background-color", select.find(":selected").css("background-color"));
    $("#statusField").change(() => {
        const select = $("#statusField");
        select.css("background-color", select.find(":selected").css("background-color"));
    });
    loadContentFromServer();
};

// lastly build table from server data
const loadContentFromServer = () => {
    sendAjax('GET', '/getMedia', null, (data) => {
        const temp = $("<div></div>");
        ReactDOM.render(
            <ContentTable contentTable={data.media} />, temp[0]);

        $("#target").replaceWith(temp.children()[0]); // swap out tbody

        // update table when changing status
        $("li").click((e) => {
            // update button parent visuals
            const ul = $(e.target).closest('ul');
            const button = $(e.target.parentElement.parentElement.querySelector("button"));
            const value = e.target.getAttribute("value");
            ul.attr("value", value);
            button.attr("class", `rowDropDown btn btn-secondary dropdown-toggle ${value}`);
            // don't fire if editing table
            if (document.querySelector("#editButton").className.includes("editing")) {
                const row = $(e.target).closest('tr');
                row.find(".statusColumn").attr("class", `statusColumn ${value}`);
                const data = `name=${row.find(".contentName")[0].innerText}` +
                    `&type=${row.find(".contentType")[0].innerText}` +
                    `&notes=${row.find(".contentNotes")[0].innerText}` +
                    `&image=${row.find("img")[0].getAttribute("src")}` +
                    `&status=${value}` +
                    `&uniqueid=${row.attr("data-id")}` +
                    `&_csrf=${csrfToken}`;
                sendAjax('PUT', '/main', data, () => {
                    loadContentFromServer();
                }); // update on server
            }
        });

        $(".deleteButtonContainer").click((e) => {
            const button = e.target;
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





