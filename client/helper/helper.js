// display error message
const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#successMessage").empty();
};

const handleSuccess = (keyword) => {
    const successDiv = `<p id="successMessage">Successfully updated your ${keyword}. <a href="" id="successLink">Click here</a> to go back to settings.</p>`
    $(successDiv).insertAfter($("form"));
    $("#errorMessage").empty();
}

// redirect to different page
const redirect = (response) => {
    window.location = response.redirect;
};

// ajax helper function
const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};