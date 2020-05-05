// display error message
const handleError = (message) => {
    if (document.querySelector("#errorMessage").innerHTML !== "") {
        $("#errorMessage").removeClass("flash");
        $("#errorMessage")[0].offsetWidth;
        $("#errorMessage").addClass("flash");
    }
    $("#errorMessage").text(message);
    $("#successMessage").empty();
};

// display success message in settings
const handleSuccess = () => {
    if (document.querySelector("#successMessage").innerHTML !== "") {
        $("#successMessage").removeClass("flash");
        $("#successMessage")[0].offsetWidth;
        $("#successMessage").addClass("flash");
    }

    document.querySelector("#successMessage").innerHTML = `Success!`;

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