const handleDomo = (e) => {
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

let csrfToken;
let contentToDelete;

const deleteContent = (e) => {
    e.preventDefault();

    // get the id of the content to be deleted
    var selectedContent = `uniqueid=${e.target.parentElement.getAttribute("data-id")}&_csrf=${csrfToken}`;
    contentToDelete = e.target.parentElement;
    sendAjax('DELETE', "/maker", selectedContent, () => {
        contentToDelete.remove();
        contentToDelete = "";
    });
}

// The form for adding new content
const ContentForm = (props) => {
    return (
        <form id="contentForm"
            onSubmit={handleDomo}
            name="contentForm"
            action="/maker"
            method="POST"
            className="contentForm"
        >   {/*Name*/}
            <label htmlFor="name">Name*: </label>
            <input id="contentName" type="text" name="name" placeholder="Name" required />
            {/*Type*/}
            <label htmlFor="type">Type*: </label>
            <select id="contentType" name="type" required>
                <option value="film">Film</option>
                <option value="tv">TV</option>
                <option value="game">Game</option>
                <option value="literature">Literature</option>
                <option value="music">Music</option>
                <option value="other">Other</option>
            </select>
            <input id="otherField" type="text" name="other" placeholder="Other" disabled />
            {/*Status*/}
            <label htmlFor="status">Status*: </label>
            <select id="contentStatus" name="status" required>
                <option value="wishlist">Wishlist</option>
                <option value="inProgress">In Progress</option>
                <option value="Complete">Complete</option>
            </select>
            <br />
            {/*Year*/}
            <label htmlFor="year">Year: </label>
            <input id="contentYear" type="text" name="year" placeholder="Number" />
            {/*Image*/}
            <label htmlFor="image">Image: </label>
            <input id="contentImage" type="text" name="image" placeholder="URL" />
            {/*CSRF*/}
            <input type="hidden" name="_csrf" value={props.csrf} />
            {/*Submit*/}
            <input className="addContentSubmit" type="submit" value="Add Content" />
        </form>
    );
};

const ContentTable = function (props) {
    if (props.contentTable.length === 0) {
        return (
            <div className="contentList">
                <h3 className="emptyContent">No Content yet</h3>
            </div>
        );
    }

    const contentNodes = props.contentTable.map(function (content) {
        return (
            <div key={content._id} data-id={content._id} className="content">
                <img src={content.image} alt={content.name} className="contentImg" />
                <h3 className="contentName"> Name: {content.name} </h3>
                <h3 className="contentType"> Type: {content.type} </h3>
                <h3 className="contentStatus">Status: {content.status}</h3>
                <h3 className="contentYear"> Year: {content.year} </h3>
                <button className="deleteButton" onClick={deleteContent}>Delete</button>
            </div>
        );
    });

    return (
        <div className="contentTable">
            {contentNodes}
        </div>
    );
};

const loadContentFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <ContentTable contentTable={data.domos} />, document.querySelector("#contentTable")
        );
    });
};

const setup = function (csrf) {
    ReactDOM.render(
        <ContentForm csrf={csrf} />, document.querySelector("#addContent")
    );
    ReactDOM.render(
        <ContentForm contentTable={[]} />, document.querySelector("#contentTable")
    );
    loadContentFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        csrfToken = result.csrfToken;
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
})