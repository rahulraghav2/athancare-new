
const search_diagnosis = async () => {
    console.log("On change event");

    var data = {};

    data.search_string = "test";
    data.test_type = 1;

    const response = await fetch('http://localhost:9090/get_lab_diagnosisTests', {
        method: 'POST',
        body: JSON.stringify(data), // string or object
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const myJson = await response.json(); //extract JSON from the http response
    var test_search_display = document.getElementsByClassName("test_search_display");
    var TestDiv = document.getElementsByClassName('tests_form');

    // tests_search_results = [{ "diagnosis_name": "No results found" }]
    test_search_display[1].style.display = "block";
    TestDiv[1].style.height = "400px";

    console.log("Json is", myJson);
}

var n_tests = -1;

function add_input_tests() {
    var TestDiv = document.getElementsByClassName('tests_form');
    var list = document.getElementsByClassName("tests_inputs");
    var input_test = document.getElementsByClassName('not_visible');
    input_test[++n_tests].style.display = "block";
    // if (TestDiv[0].style.height == '') {
    //     console.log("n is", n_tests, Number(TestDiv[0].style.height.replace('px', '')))
    //     TestDiv[0].style.height = Number(TestDiv[0].style.height.replace('px', '')) + 330 + "px";
    // } else if (Number(TestDiv[0].style.height.replace('px', '')) == 100) {
    //     TestDiv[0].style.height = Number(TestDiv[0].style.height.replace('px', '')) + 330 + "px";
    // } else {
    //     console.log("Number(prescription.style.width.replace('px', '')", Number(TestDiv[0]
    //         .style.height.replace('px', '')));

    //     var newHeight = Number(TestDiv[0].style.height.replace('px', '')) + 100 + 'px';
    //     TestDiv[0].style.height = newHeight;
    // }
}

function remove_input_tests(pos) {

    var list = document.getElementsByClassName("tests_inputs");
    var TestDiv = document.getElementsByClassName('tests_form');

    console.log("Number(TestDiv[0].style.height.replace('px', ''))", Number(TestDiv[0].style.height.replace('px', '')));
    list[pos].style.display = "none";
    --n_tests;
    if (Number(TestDiv[0].style.height.replace('px', '')) == 430 || Number(TestDiv[0].style.height.replace('px', '')) == 330) {
        n_tests = -1;
    }

    // var newHeight = Number(TestDiv[0].style.height.replace('px', '')) - 100 + 'px';
    // TestDiv[0].style.height = newHeight;

}

var n_procedures = -1;

function add_input_procedures() {
    debugger;
    var TestDiv = document.getElementsByClassName('procedures_form');
    var input_test = document.getElementsByClassName('not_visible_procedures');
    input_test[++n_procedures].style.display = "block";

    // console.log("Number(prescription.style.width.replace('px', '')", Number(TestDiv[0].style.height.replace('px', '')));

    // if (TestDiv[0].style.height == '') {
    //     console.log("n is", n_tests, Number(TestDiv[0].style.height.replace('px', '')))

    //     TestDiv[0].style.height = Number(TestDiv[0].style.height.replace('px', '')) + 330 + "px";
    // } else if (Number(TestDiv[0].style.height.replace('px', '')) == 100) {
    //     TestDiv[0].style.height = Number(TestDiv[0].style.height.replace('px', '')) + 230 + "px";
    // } else {
    //     console.log("Number(prescription.style.width.replace('px', '')", Number(TestDiv[0]
    //         .style.height.replace('px', '')));

    //     var newHeight = Number(TestDiv[0].style.height.replace('px', '')) + 100 + 'px';

    //     TestDiv[0].style.height = newHeight;
    // }
}

function remove_input_procedures(pos) {

    var list = document.getElementsByClassName("procedures_input");
    var TestDiv = document.getElementsByClassName('procedures_form');

    list[pos].style.display = "none";
    --n_procedures;

    // if (Number(TestDiv[0].style.height.replace('px', '')) == 430 || Number(TestDiv[0].style.height.replace('px', '')) == 330) {
    //     n_procedures = 1;
    // }

    // var newHeight = Number(TestDiv[0].style.height.replace('px', '')) - 100 + 'px';
    // TestDiv[0].style.height = newHeight;

}

var n_consumables = -1;

function add_input_remove_input_consumables() {
    var TestDiv = document.getElementsByClassName('consumables_form');
    var input_test = document.getElementsByClassName('not_visible_consumables');
    input_test[++n_consumables].style.display = "block";

    if (TestDiv[0].style.height == '') {
        console.log("n is", n_tests, Number(TestDiv[0].style.height.replace('px', '')))

        TestDiv[0].style.height = Number(TestDiv[0].style.height.replace('px', '')) + 330 + "px";
    } else if (Number(TestDiv[0].style.height.replace('px', '')) == 100) {
        TestDiv[0].style.height = Number(TestDiv[0].style.height.replace('px', '')) + 230 + "px";
    } else {
        console.log("Number(prescription.style.width.replace('px', '')", Number(TestDiv[0]
            .style.height.replace('px', '')));

        var newHeight = Number(TestDiv[0].style.height.replace('px', '')) + 100 + 'px';

        TestDiv[0].style.height = newHeight;
    }


}

function remove_input_consumables(pos) {

    var list = document.getElementsByClassName("consumables_input");

    var TestDiv = document.getElementsByClassName('consumables_form');

    list[pos].style.display = "none";
    --n_consumables;

    if (Number(TestDiv[0].style.height.replace('px', '')) == 430 || Number(TestDiv[0].style.height.replace('px', '')) == 330) {
        n_consumables = -1;
    }

    var newHeight = Number(TestDiv[0].style.height.replace('px', '')) - 100 + 'px';
    TestDiv[0].style.height = newHeight;
}



