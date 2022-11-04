function zoom_image(direct) {

    var prescription = document.getElementById("myCarousel");

    if (direct == 'in') {
        if (prescription.style.width != '' && Number(prescription.style.width.replace('%', '')) <= 180) {
            var width = prescription.style.width.replace('%', '');
            prescription.style.width = Number(width) + Number(20) + '%';
        } else if (prescription.style.width == '')
            prescription.style.width = '120%';
    } else if (Number(prescription.style.width.replace('%', '')) > 100) {
        var width = prescription.style.width.replace('%', '');
        prescription.style.width = Number(width) - Number(20) + '%';
    }
}

function logout_card() {
    var logout = document.getElementById("logout");

    if (logout.style.display == '' || logout.style.display == null || logout.style.display == 'none') {
        logout.style.display = "block";
    } else {
        logout.style.display = "none";
    }

}

function ClearFields() {
    $('input').val('');
}