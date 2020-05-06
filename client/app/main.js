let layout;
let theme;
let sizing;

// used in all layouts
function setupControlListeners() {
    // stop propagation to allow multi-level select
    $('.dropdown-menu option, .dropdown-menu select').click(function (e) {
        e.stopPropagation();
    });


    // match filter color with selection
    $("#statusFilter, #typeFilter").change(() => {
        const select = $("#statusFilter");
        select.css("background-color", select.find(":selected").css("background-color"));

        filterContent($("#typeFilter").val(), $("#statusFilter").val());
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

    // search whenever values change
    $("#searchInput").on('input change keyup paste', () => {

        let inputValue = $("#searchInput").val().toLowerCase();
        inputValue = inputValue.replace(/ +/g, ""); // take out spaces

        if (layout == "table") {
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
        } else if (layout == "grid") {
            const gridItems = $(".gridItemWrapper");
            // empty so display all
            if (inputValue.length == 0) {
                gridItems.css("display", "block");
            }
            else { // otherwise filter

                // check all items
                for (let i = 0; i < gridItems.length; i++) {

                    // get name type and notes
                    let textContent = gridItems[i].querySelector(".gridItemName").innerText +
                        gridItems[i].querySelector(".gridItemType").innerText +
                        gridItems[i].querySelector(".gridItemNotes").innerText;
                    textContent = textContent.replace(/ +/g, "");
                    textContent = textContent.toLowerCase();

                    // match, so display it
                    if (textContent.includes(inputValue)) {
                        gridItems[i].style.display = "block";
                    }
                    else { // no match, so hide
                        gridItems[i].style.display = "none";
                    }
                }
            }
        }
    });
}

// only call when using table
function setupTableListeners() {
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


    // delete all button
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
}

// filter the displayed content based on type and status
const filterContent = (type, status) => {

    type = type.toLowerCase();
    status = status.toLowerCase();
    if (layout == "table") {
        const tableBody = document.querySelector("#target");
        for (let i = 0; i < tableBody.rows.length; i++) {
            const rowType = tableBody.rows[i].querySelector(".contentType").getAttribute("data-serverData").trim().toLowerCase();
            const rowStatus = tableBody.rows[i].querySelector(".statusColumn").getAttribute("data-serverData").trim().toLowerCase();
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
        const gridItems = $(".gridItemWrapper");
        for (let i = 0; i < gridItems.length; i++) {
            const gridType = gridItems[i].querySelector(".gridItemType").getAttribute("data-serverData").trim().toLowerCase();
            const gridStatus = gridItems[i].querySelector(".gridStatus").getAttribute("data-serverData").trim().toLowerCase();
            // all visible
            if (type == "all" && status == "all") {
                gridItems[i].style.display = "block";
            } // enable content of type with corresponding status
            else if (gridType === type && (gridStatus === status || status == "all")) {
                gridItems[i].style.display = "block";
            } // enable contentf of status with corresponding type
            else if (gridStatus === status && (gridType === type || type == "all")) {
                gridItems[i].style.display = "block";
            } // don't show
            else {
                gridItems[i].style.display = "none";
            }
        }
    }

}


// adds an item on backend
const addMedia = (e) => {
    e.preventDefault();

    // don't allow adding if editing
    if (!document.querySelector("#addSubmitButton").className.includes("btn-secondary")) {
        sendAjax('POST', $("#addForm").attr("action"), $("#addForm").serialize(), function () {
            document.querySelector("#addForm").reset();
            $("#statusField").trigger('change');
            loadContentFromServer(layout, theme, sizing);
        });
    }
    else {
        alert("Please save your changes before adding more media");
    }


    return false;
};

// helper variables for deleting media
let csrfToken;
const deleteMedia = (item) => {
    // get the id of the media to be deleted
    var selectedMedia = `uniqueid=${item.getAttribute("data-id")}&_csrf=${csrfToken}`;
    $(item).remove();
    item = "";
    sendAjax('DELETE', "/main", selectedMedia, () => {
    });
}

// enable editing on all elements in table
const editMedia = (e) => {
    // update edit button
    const editButton = $("#editButton");
    editButton[0].innerHTML = `<i class="fas fa-save"></i>`;
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
    }
    else if (layout == "grid") {
        $(".gridItemWrapper").attr("contenteditable", true);
    }

}
// save changes made to table
const saveMedia = (e) => {
    // update edit button
    const editButton = $("#editButton");
    editButton[0].innerHTML = `<i class="fas fa-edit"></i>`;
    editButton.off('click');
    editButton.click(editMedia);

    // update add button
    $("#addSubmitButton").toggleClass("btn-secondary");
    $("#addSubmitButton").toggleClass("btn-outline-primary");

    let items = [];
    if (layout == "table") {
        // disable editing
        const rowItems = $(".mediaRow");
        rowItems.attr("contenteditable", false);

        // delete rows
        for (let i = 0; i < rowItems.length; i++) {
            if (rowItems[i].querySelector(".deleteButton").className.includes("marked")) {
                deleteMedia(rowItems[i]);
            }
        }

        // build array full of new items
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
    }
    else if (layout == "grid") {

        // disable editing
        const gridItems = $(".gridItemWrapper");
        gridItems.attr("contenteditable", false);

        // delete rows
        for (let i = 0; i < gridItems.length; i++) {
            if (gridItems[i].querySelector(".deleteButton").className.includes("marked")) {
                deleteMedia(gridItems[i]);
            }
        }

        // build array full of new items
        for (let i = 0; i < gridItems.length; i++) {
            let dataObj = {};
            dataObj.name = gridItems.find(".gridItemName")[i].innerText;
            dataObj.type = gridItems.find(".gridItemType")[i].innerText;
            dataObj.status = gridItems.find(".dropdown-menu")[i].getAttribute("value");
            dataObj.notes = gridItems.find(".gridItemNotes")[i].innerText;
            dataObj.image = gridItems.find(".gridContentImage")[i].getAttribute("src");
            dataObj.id = gridItems[i].getAttribute("data-id");
            items.push(dataObj);
        }
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
            // only load on last one
            if (i == items.length - 1) {
                loadContentFromServer(layout, theme, sizing);
            }
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
const ControlsFrame = (props) => {
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
                        <div className="col-6" id="typesTarget">
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

const TypesOptions = function (props) {
    const typeNodes = props.types.map(function (content, index) {
        return (
            <option key={index} value={`${content}`}>{`${content}`}</option>
        )
    });
    if (props.filter) {
        return (
            <select data-toggle="dropdown" className="form-control filterSelect" id="typeFilter">
                <option value="all">All Types</option>
                {typeNodes}
            </select>
        )
    }
    else {
        return (
            <select className="custom-select" id="typeField" name="type" required="">
                {typeNodes}
            </select>
        )
    }

};

// build table framework
const TableFrame = function (props) {
    return (
        <div>
            <button className="btn btn-outline-primary" id="deleteAllButton" type="button">Select All</button>
            <table className="table table-striped" id="contentTable" cellPadding="0" cellSpacing="0">
                {/*Set width for each column*/}
                <colgroup>
                    <col width="5.5%" />
                    <col width="23.75%" />
                    <col width="23.75%" />
                    <col width="23.75%" />
                    <col width="23.75%" />
                </colgroup>
                <thead>
                    <tr>
                        <th className="tableHeader" id="statusHeader"></th>
                        <th className="tableHeader" id="nameHeader">Name</th>
                        <th className="tableHeader" id="typeHeader">Type</th>
                        <th className="tableHeader" id="notesHeader">Notes</th>
                        <th className="tableHeader" id="imageHeader">Image</th>
                    </tr>
                </thead>
                <tbody id="target">
                    {/*Filled by React and node*/}
                </tbody>
            </table>
        </div>
    )
};

// build  grid

// build table contents
const ContentTable = function (props) {

    // build rows filled with cells
    const contentNodes = props.contentTable.map(function (content) {
        return (
            // Row
            <tr data-id={content._id} className="mediaRow">
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
                <td data-serverdata={`${content.type}`} className="dataCell contentType">{content.type}</td>
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

// build grid contents
const ContentGrid = function (props) {
    const contentNodes = props.contentGrid.map(function (content) {
        return (
            <div className="gridItemWrapper" data-id={content._id}>
                {/*Status, image, and name*/}
                <div data-serverdata={`${content.status}`} className={`gridStatus ${content.status}`}>
                    {/*Status with dropdown*/}
                    <div className="rowDropDownWrapper gridDropDownWrapper dropdown">
                        <button className={`rowDropDown btn btn-secondary dropdown-toggle ${content.status}`}
                            type="button" data-toggle="dropdown">
                        </button>
                        <ul value={`${content.status}`} className="dropdown-menu">
                            <li className="wishList dropdown-item" value="wishList">Wish List</li>
                            <li className="inProgress dropdown-item" value="inProgress">In Progress</li>
                            <li className="complete dropdown-item" value="complete">Complete</li>
                        </ul>
                    </div>
                    {/*Invisible delete button*/}
                    <div className="deleteButtonContainer gridItemDeleteButton">
                        <i className="fas fa-trash deleteButton"></i>
                    </div>
                </div>
                {/*image*/}
                <div data-serverdata={`${content.image}`} className="gridItemImage"><img src={content.image} alt={content.name} className="gridContentImage" /></div>
                {/*name*/}
                <p data-serverdata={`${content.name}`} className="gridItemName">{content.name}</p>
                {/*Type*/}
                <p data-serverdata={`${content.type}`} className="gridItemType">{content.type}</p>
                {/*Notes*/}
                <p data-serverdata={`${content.notes}`} className="gridItemNotes">{content.notes}</p>
            </div>
        )
    });

    return (
        <div id="contentContainer" className="gridContainer">
            {contentNodes}
        </div>
    );
}



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
    // first load preferences
    sendAjax('GET', '/getPreferences', null, (result) => {

        // update css rule
        let sheet = window.document.styleSheets[0];
        sheet.addRule('.wishList', 'background-color: ' + result.wishListColor + " !important;");
        sheet.addRule('.inProgress', 'background-color: ' + result.inProgressColor + " !important;");
        sheet.addRule('.complete', 'background-color: ' + result.completeColor + " !important;");

        // build controls, add and edit
        ReactDOM.render(
            <ControlsFrame csrf={csrf} />, document.querySelector("#controls")
        );
        ReactDOM.render(
            <TypesOptions types={result.types} filter={false} />, document.querySelector("#typesTarget")
        );
        ReactDOM.render(
            <TypesOptions types={result.types} filter={true} />, document.querySelector("#typesFilterTarget")
        );
        $("#editButton").click(editMedia);



        // change color of selects to selected status
        const select = $("#statusField");
        select.attr("class", "custom-select " + select.find(":selected").attr("class"));
        $("#statusField").change(() => {
            const select = $("#statusField");
            select.attr("class", "custom-select " + select.find(":selected").attr("class"));
        });

        layout = result.layout;
        theme = result.theme
        sizing = result.sizingValue;
        loadContentFromServer(layout, theme, sizing);
    });
};

// lastly build table from server data
const loadContentFromServer = (layout, theme, sizing) => {
    // apply dark theme if enabled
    if (theme == "dark") {
        $('link[data-name="darkStyle"]').prop('disabled', false);
        $('link[data-name="lightStyle"]').prop('disabled', true);
    } else {
        $('link[data-name="darkStyle"]').prop('disabled', true);
        $('link[data-name="lightStyle"]').prop('disabled', false);
    }
    sendAjax('GET', '/getMedia', null, (data) => {

        // already has data, so render it
        if (data.media.length > 0) {
            // table
            if (layout == "table") {

                // table frame
                ReactDOM.render(
                    <TableFrame />, document.querySelector("#contentContainer")
                );
                setupTableListeners();

                // table contents
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
                    if (!document.querySelector("#addSubmitButton").className.includes("btn-secondary")) {
                        const row = $(e.target).closest('tr');

                        // update status
                        row.find(".statusColumn").attr("class", `statusColumn ${value}`);

                        // send to DB
                        const data = `name=${row.find(".contentName").attr("data-serverdata")}` +
                            `&type=${row.find(".contentType").attr("data-serverdata")}` +
                            `&notes=${row.find(".contentNotes").attr("data-serverdata")}` +
                            `&image=${row.find(".contentImage").attr("data-serverdata")}` +
                            `&status=${value}` +
                            `&uniqueid=${row.attr("data-id")}` +
                            `&_csrf=${csrfToken}`;
                        sendAjax('PUT', '/main', data, () => {
                            loadContentFromServer(layout, theme, sizing);
                        }); // update on server
                    }
                });
            }
            else if (layout == "grid") { // grid

                const temp = $("<div></div>"); // temporarily render the react component into temp
                ReactDOM.render(
                    <ContentGrid contentGrid={data.media} />, temp[0]
                );

                // replace content container with one created by react (child of temp)
                $("#contentContainer").replaceWith(temp.children()[0]);


                // update table when changing status
                $("li").click((e) => {
                    // update button parent visuals
                    const ul = $(e.target).closest('ul');
                    const button = $(e.target.parentElement.parentElement.querySelector("button"));
                    const value = e.target.getAttribute("value");
                    ul.attr("value", value);
                    button.attr("class", `rowDropDown btn btn-secondary dropdown-toggle ${value}`);
                    // don't fire if editing table
                    if (!document.querySelector("#addSubmitButton").className.includes("btn-secondary")) {
                        const gridItem = $(e.target).closest('.gridItemWrapper');
                        // update status display
                        gridItem.find(".gridStatus").attr("class", `gridStatus ${value}`);

                        // send to DB
                        const data = `name=${gridItem.find(".gridItemname").attr("data-serverdata")}` +
                            `&type=${gridItem.find(".gridItemType").attr("data-serverdata")}` +
                            `&notes=${gridItem.find(".gridItemNotes").attr("data-serverdata")}` +
                            `&image=${gridItem.find(".gridItemImage").attr("data-serverdata")}` +
                            `&status=${value}` +
                            `&uniqueid=${gridItem.attr("data-id")}` +
                            `&_csrf=${csrfToken}`;
                        sendAjax('PUT', '/main', data, () => {
                            loadContentFromServer(layout, theme, sizing);
                        }); // update on server
                    }
                });

                $(".gridItemWrapper").css("height", sizing);
                $(".gridItemWrapper").css("width", (parseInt(sizing, 10) * 0.67) + "px");
            }
        }

        // regardless if the content was rendered, setup controls
        setupControlListeners();
    });

};





