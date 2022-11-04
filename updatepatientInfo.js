var app = angular.module('testApp', [])
app.controller('myCtrl', function ($scope, $http, $interval, $timeout, $compile) {

    $scope.isPrev = true;
    $scope.isNext = true;

    /**
     *  Input field with dropdown Start
     */

    $scope.test_search = '';
    $scope.filteredArray = [];
    $scope.dropdownVisible = false;
    $scope.activeItemIndex = 0;
    $scope.pressedDropdown = false;

    /**
     * Method to set the dropdown visible 
     * it will decide whether the dropdown should be visible or not
     * @param {*} isVisible 
     */
    function setDropdownVisible(isVisible, type, pos) {
        if (pos === 0) {
            // $scope.dropdownVisible = false;
            $scope['dropdownVisible' + type] = isVisible;
        } else {
            $scope['dropdownVisible' + type + pos] = isVisible;
        }
    }

    /**
     * Method to hide the input dropdown
     */
    $scope.hideDropdown = function (type, pos) {
        setDropdownVisible(false, type, pos)
    }

    /**
     * Method to show the input dropdown
     */
    $scope.showDropdown = function (type, pos) {
        setDropdownVisible(true, type, pos);
    };

    /**
     * It will highlight the active search item
     */
    $scope.setActive = function (itemIndex) {
        $scope.activeItemIndex = itemIndex;
        console.log($scope.activeItemIndex);
    };

    $scope.dropdownPressed = function () {
        $scope.pressedDropdown = true;
    }

    /**
     * It will be called when input get focus
     */
    $scope.inputFocus = function (type, pos) {
        $scope.setActive(0);
        $scope.hideDropdown(type, pos);
    };

    /**
     * Method to decide whether the 'No Records Found' flag will be visible or not 
     * @param {*} isRecordFound 
     * @param {*} type 
     * @param {*} pos 
     */
    function setRecordFound(isRecordFound, type, pos) {
        if (pos === 0) {
            $scope['isRecordFound' + type] = isRecordFound;
        } else {
            $scope['isRecordFound' + type + pos] = isRecordFound;
        }
    }
    /**
     * It will be called when input get blurred
     */
    $scope.inputBlur = function (type, pos) {
        if ($scope.pressedDropdown) {
            // Blur event is triggered before click event, which means a click on a dropdown item wont be triggered if we hide the dropdown list here.
            $scope.pressedDropdown = false;
            return;
        }
        setRecordFound(false, type, pos)
        $scope.hideDropdown(type, pos);
    };

    /**
     * Method to select previous item
     */
    $scope.selectPreviousItem = function () {
        var prevIndex = $scope.activeItemIndex - 1;
        console.log(prevIndex);
        if (prevIndex >= 0) {
            $scope.setActive(prevIndex);
        }
    };

    /**
     * Method to select next item
     */
    $scope.selectNextItem = function () {
        var nextIndex = $scope.activeItemIndex + 1;
        console.log(nextIndex);
        console.log($scope.filteredArray.length);
        if (nextIndex < $scope.filteredArray.length) {
            $scope.setActive(nextIndex);
        }
    };

    /**
     * Method to push records 
     * @param {*} selectedItem 
     * @param {*} recordType 
     * @param {*} recordPosition 
     */
    function setSelectedRecord(selectedItem, recordType, recordPosition) {
        if (recordType === 0) {
            $scope.push_tests(selectedItem.diagnosis_name, selectedItem.id, recordType, recordPosition);
        } else if (recordType === 1) {
            $scope.push_procedures(selectedItem.diagnosis_name, selectedItem.id, recordType, recordPosition);
        } else {
            $scope.push_consumables(selectedItem.diagnosis_name, selectedItem.id, recordType, recordPosition);
        }
    }

    /**
     * Method to select active item
     */
    $scope.selectActiveItem = function (diagnosisArray, type, pos) {
        console.log('Select Active item')
        console.log(type);
        console.log(pos);
        if ($scope.activeItemIndex >= 0 && $scope.activeItemIndex < $scope.filteredArray.length) {
            console.log($scope.filteredArray[$scope.activeItemIndex]);
            var diagnosisItem = diagnosisArray[$scope.activeItemIndex];
            console.log(diagnosisItem);
            setSelectedRecord(diagnosisItem, type, pos)
        }
    };

    /**
     * Method to set selected items according to type of record
     */
    function setSelectActiveItems(selectedItem, selectedItemType, selectedItemPosition) {
        if (selectedItemPosition === 0) {
            if ($scope['dropdownVisible' + selectedItemType] && selectedItem && selectedItem.length > 0) {
                // only preventDefault when there is a list so that we can submit form with return key after a selection is made
                console.log(selectedItem);
                console.log(selectedItemPosition)
                event.preventDefault();
                $scope.selectActiveItem(selectedItem, selectedItemType, selectedItemPosition);
            }
        } else {
            if ($scope['dropdownVisible' + selectedItemType + selectedItemPosition] && selectedItem && selectedItem.length > 0) {
                // only preventDefault when there is a list so that we can submit form with return key after a selection is made
                console.log(selectedItem);
                console.log(selectedItemPosition)
                event.preventDefault();
                $scope.selectActiveItem(selectedItem, selectedItemType, selectedItemPosition);
            }
        }

    }

    /**
     * Method to handle selected input by key navigation
     * @param {*} type 
     * @param {*} pos 
     */
    function handleSelectInput(type, pos) {
        if (type === 0) {
            setSelectActiveItems($scope.filteredArray, type, pos);
        } else if (type === 1) {
            setSelectActiveItems($scope.filteredArray, type, pos);
        } else {
            setSelectActiveItems($scope.filteredArray, type, pos);
        }
    }

    /**
     * Method to handle key navigation on input
     */
    $scope.handleKeyNavigation = function (event, type, pos) {
        console.log(event.which);
        console.log(pos);
        switch (event.which) {
            case 38: //up
                $scope.selectPreviousItem();
                break;

            case 40: //down
                $scope.selectNextItem();
                break;

            case 13: //return
                handleSelectInput(type, pos);
                break;
        }
    }


    /**
     * Input field with dropdown End
     */
    $scope.isLoad = false;
    $scope.check_user = function () {
        // $scope.get_user_details()
        $scope.getPrescriptions("aaaa")
    }
    $scope.user = null;
    $scope.get_user_details = function () {
        var data = {};
        $http.get('http://192.168.1.150:9090/get_portal_user_data/' + 10)
            .then(function (response) {
                if (response.status == 200) {
                    console.log("response got", response)
                    window.localStorage.setItem('user_id', response.data.user_id);
                    data.user_id = window.localStorage.setItem('user_id', response.data.user_id);
                    $scope.user = response.data.user_fullnm;
                    $scope.getPrescriptions(response.data.appt_id);
                } else {
                    window.location.href = "http://192.168.1.150:60"
                }
            }).catch(function (error) {
                window.location.href = "http://192.168.1.150:60"
            })

    }

    var fix_time;
    var total_digitization_time = 0;

    function startTime(first_time) {
        var today = new Date();
        if (first_time == 0) {
            fix_time = today;
            first_time = 1;
        }
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        m = checkTime(m);
        s = checkTime(s);

        total_digitization_time = Math.floor((today.getTime() - fix_time.getTime()) / 1000);
        document.getElementById('txt').innerHTML =
            "Time Taken - " + total_digitization_time + "s";

        var t = setTimeout(startTime, 500);
    }

    function checkTime(i) {
        if (i < 10) {
            i = "0" + i
        }; // add zero in front of numbers < 10
        return i;
    }

    $scope.prescription_arr = [];
    var pres_arr_all = [];
    var n = 0;

    $scope.getPrescriptions = function (appt_id) {
        var data = {};
        data.appointment_id = appt_id;
        $http({
            method: 'POST',
            url: 'http://192.168.1.150:9090/get_Doctor_Prescriptions_iqvia',
            headers: {
                'Content-Type': 'application/json'
            },
            data: angular.toJson(data)
        }).then(function (response) {
            if (response.data.length > 0) {
                pres_arr_all = response.data;
                $scope.prescription_arr = pres_arr_all[n];
                openLightboxModal($scope.prescription_arr, 0);
                startTime(0);
            } else {
                console.log("No prescription to transcript")
                pres_arr_all = [];
                $scope.prescription_arr = [];
            }
        })
    }

    var openLightboxModal = function (presArray, pageno) {
        console.log(presArray, pageno);
        
            $scope.isNext = false;
            $scope.isPrev = false;

        switch (true) {
            case pageno < 0:
                pageno = 0
                break;

            case pageno >= presArray.url.length - 1:
                pageno = presArray.url.length - 1;
                $scope.isNext = false;
                break;

            case pageno == 0:
                $scope.isPrev = false;
                break;
        }

        $scope.prescPageNo = pageno;
        var images = presArray.url;
        console.log(images);
        var presImg = $('#lightgallery').empty();
        var img = images;
        // presImg.get(0).style.backgroundImage = 'url('+img+')';
        presImg.append('<img src="' + img + '" />')
        console.log(presImg);
        zoomInOut(presImg);
    }

    function zoomInOut(presImg) {
        let scale = 1;
        console.log(presImg);
        presImg.get(0).style.cursor = 'pointer';
        presImg.get(0).addEventListener('wheel', function (event) {
            console.log('Wheel');
            console.log(event.deltaY);
            var image = presImg.get(0).children[0];
            event.preventDefault();
            scale += event.deltaY * -0.01;
            console.log(scale);
            marginLeft = scale * 200
            marginTop = scale * 150;
            image.style.marginLeft = `${marginLeft}px`;
            image.style.marginTop = `${marginTop}px`;
            presImg.get(0).style.background = "#fff"
            console.log(scale);
            if (scale < 1) {
                scale = 1;
                image.style.marginLeft = "0px";
                image.style.marginTop = "0px"
            }
            // Restrict scale
            scale = Math.min(Math.max(.125, scale), 2);
            // Apply scale transform
            image.style.transform = `scale(${scale}, ${scale})`;
            presImg.get(0).style.overflow = 'auto';

        })
    }


    $scope.next_appt_pres = function (direct) {
        console.log("Inside next_appt_pres");
        if (direct == 'forward' && n < pres_arr_all.length - 1) {
            n = n + 1;
            $scope.prescription_arr = pres_arr_all[n];
            console.log($scope.prescription_arr);
        } else if (n > 0 && direct == 'back') {
            n--;
            $scope.prescription_arr = pres_arr_all[n];
        }
        openLightboxModal($scope.prescription_arr, 0);
    }

    $scope.nextPrescPage = function () {
        // $scope.prescription_arr++;
        console.log($scope.prescription_arr);
        openLightboxModal($scope.prescription_arr, ++$scope.prescPageNo);
    };
    $scope.prevPrescPage = function () {
        openLightboxModal($scope.prescription_arr, --$scope.prescPageNo);
    };

    $scope.skip_prescription = function () {
        console.log("Inside skip_prescription", $scope.prescription_arr.img_appt_id);

        var data = {};
        data.appointment_id = $scope.prescription_arr.img_appt_id;
        data.user_id = window.localStorage.getItem("user_id")
        $http({
            method: 'POST',
            url: 'http://192.168.1.150:9090/skip_prescription',
            headers: {
                'Content-Type': 'application/json'
            },
            data: angular.toJson(data)
        }).then(function (response) {
            console.log("Prescription saved in skipped");
            if (response.data.length > 0) {
                pres_arr_all = response.data;
                $scope.prescription_arr = pres_arr_all[n];
                openLightboxModal($scope.prescription_arr, 0);
                startTime(0);
            } else {
                pres_arr_all = [];
                $scope.prescription_arr = [];
                console.log("No prescription to transcript")
            }
        })
    }

    $scope.tests_search_results = [];
    $scope.procedure_search_results = [];
    $scope.consumables_search_results = [];

    var selected_input, selected_str = "";

    /**
     * Method to toggle loader
     */
    function setLoaderValue(isLoad, recordType, recordPosition) {
        if (recordPosition === 0) {
            $scope['isLoad' + recordType] = isLoad
        } else {
            $scope['isLoad' + recordType + recordPosition] = isLoad;
        }
    }

    function setSelectedStr(selectedRecordType, pos) {
        if (pos == 0)
            return selected_str = $scope[selectedRecordType];
        else
            return selected_str = $scope[selectedRecordType + pos];
    }
    /**
     * This method is defined to search the diagnosis
     */
    $scope.search_diagnosis = function (search_str, type, pos) {
        console.log(pos);
        //setting flags according to position of input field
        setDropdownVisible(true, type, pos);
        setRecordFound(false, type, pos);
        setLoaderValue(true, type, pos)
        console.log(search_str);
        console.log(search_str.trim().length);

        if (search_str.trim().length != 0) {
            var normalisedInput = search_str.toLowerCase();
            var data = {};
            selected_input = pos;
            console.log(selected_input)
            if (type === 0) {
                selected_str = setSelectedStr('test_search', pos);
            } else if (type === 1) {
                selected_str = setSelectedStr('procedure_search', pos);
            } else {
                selected_str = setSelectedStr('consumable_search', pos);
            }

            console.log("Search str is", selected_str, pos)
            data.search_string = search_str;
            data.test_type = type;
            $http({
                method: 'POST',
                url: 'http://192.168.1.150:9090/get_lab_diagnosisTests',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: angular.toJson(data)
            }).then(function (response) {
                console.log('response here');
                console.log(response);
                if (type == 0) {
                    $scope.tests_search_results = response.data.items;
                    console.log($scope.tests_search_results);
                    setLoaderValue(false, type, pos)


                    $scope.filteredArray = $scope.tests_search_results.filter(function (diagnosisObject) {
                        console.log(diagnosisObject);
                        var diagnosisName = diagnosisObject.diagnosis_name.toLowerCase().indexOf(normalisedInput) === 0;
                        return diagnosisName;
                    });
                    console.log($scope.filteredArray);
                    $scope.showDropdown(type, pos)
                    if ($scope.tests_search_results.length == 0) {
                        console.log('No records');
                        setRecordFound(true, type, pos)


                    }
                } else if (type == 1) {
                    console.log(response.data);
                    setLoaderValue(false, type, pos);
                    setDropdownVisible(true, type, pos)

                    $scope.procedure_search_results = response.data;
                    $scope.filteredArray = $scope.procedure_search_results.filter(function (diagnosisObject) {
                        console.log(diagnosisObject);
                        var diagnosisName = diagnosisObject.diagnosis_name.toLowerCase().indexOf(normalisedInput) === 0;
                        return diagnosisName;
                    });
                    console.log($scope.filteredArray);
                    $scope.showDropdown(type, pos)
                    if ($scope.procedure_search_results.length == 0) {
                        console.log('No records');
                        setRecordFound(true, type, pos);

                    }
                    console.log($scope.filteredArray);
                    if (response.data.length == 0) {

                        $scope.procedure_search_results = [];
                    }

                } else {
                    console.log(response.data);
                    setLoaderValue(false, type, pos);
                    setDropdownVisible(true, type, pos)

                    $scope.consumables_search_results = response.data;
                    $scope.filteredArray = $scope.consumables_search_results.filter(function (diagnosisObject) {
                        console.log(diagnosisObject);
                        var diagnosisName = diagnosisObject.diagnosis_name.toLowerCase().indexOf(normalisedInput) === 0;
                        return diagnosisName;
                    });
                    console.log($scope.filteredArray);
                    $scope.showDropdown(type, pos)
                    if ($scope.consumables_search_results.length == 0) {
                        $scope.consumables_search_results = [];
                        console.log('No records');
                        setLoaderValue(false, type, pos);
                        setDropdownVisible(true, type, pos)

                    }
                    console.log($scope.filteredArray);
                    console.log($scope.consumables_search_results);

                }
            })
        } else {
            if (type == 0) {
                $scope.filteredArray = [];
                setLoaderValue(false, type, pos);
                setRecordFound(false, type, pos)

                $scope.hideDropdown(type, pos);
                $scope.tests_search_results = [];
            } else if (type == 1) {
                $scope.filteredArray = [];
                setLoaderValue(false, type, pos);
                setRecordFound(false, type, pos)

                $scope.hideDropdown(type, pos);
                $scope.procedure_search_results = [];

            } else {
                $scope.consumables_search_results = [];
                $scope.filteredArray = [];
                setLoaderValue(false, type, pos);
                setRecordFound(false, type, pos)
                $scope.hideDropdown(type, pos);
            }
        }
    }

    $scope.f1 = false, $scope.f2 = false, $scope.f3 = false, $scope.f4 = false, $scope.f5 = false,
        $scope.f6 = false, $scope.f7 = false, $scope.f8 = false, $scope.f9 = false, $scope.f10 = false;

    $scope.flag_test = function (type, pos, is_flag) {

        if (pos == 0) {
            $scope.f1 = is_flag;
            tests_selected[0].flag = $scope.f1;
        }
        if (pos == 1) {
            $scope.f2 = is_flag;
            tests_selected[1].flag = $scope.f2;

        }
        if (pos == 2) {
            $scope.f3 = is_flag;
            tests_selected[2].flag = $scope.f3;

        }

        if (pos == 3) {
            $scope.f4 = is_flag;
            tests_selected[3].flag = $scope.f4;

        }

        if (pos == 4) {
            $scope.f5 = is_flag;
            tests_selected[4].flag = $scope.f5;

        }

        if (pos == 5) {
            $scope.f6 = is_flag;
            tests_selected[5].flag = $scope.f6;

        }

        if (pos == 6) {
            $scope.f7 = is_flag;
            tests_selected[6].flag = $scope.f7;

        }

        if (pos == 7) {
            $scope.f8 = is_flag;
            tests_selected[7].flag = $scope.f8;

        }

        if (pos == 8) {
            $scope.f9 = is_flag;
            tests_selected[8].flag = $scope.f9;

        }

        if (pos == 9) {
            $scope.f10 = is_flag;
            tests_selected[9].flag = $scope.f10;

        }
        if (pos == 10) {
            $scope.f11 = is_flag;
            tests_selected[10].flag = $scope.f11;

        }
        if (pos == 11) {
            $scope.f12 = is_flag;
            tests_selected[11].flag = $scope.f12;

        }
        if (pos == 12) {
            $scope.f13 = is_flag;
            tests_selected[12].flag = $scope.f13;

        }
        if (pos == 13) {
            $scope.f14 = is_flag;
            tests_selected[13].flag = $scope.f14;

        }
        if (pos == 14) {
            $scope.f15 = is_flag;
            tests_selected[14].flag = $scope.f15;

        }
    }
    var tests_selected = [];
    $scope.push_tests = function (test, id, type, pos) {
        var data = {};
        if (test.trim() != '' && test.trim().length != 0) {
            $scope.hideDropdown(type, pos);
            if (pos == 0) {
                $scope.test_search = test;
                data.flag = $scope.f1;
                if ($scope.dropdownVisible0 === true) {
                    $scope.hideDropdown(type, pos);
                }
            } else {
                $scope['test_search' + pos] = test;
                data.flag = $scope['f' + pos + 1]
                if ($scope['dropdownVisible'] + pos === true) {
                    console.log('Dd open')
                    $scope.hideDropdown(type, pos);
                }
            }
            if (id === undefined)
                data.diagnosis_id = 'null';
            else
                data.diagnosis_id = id;

            data.diagnosis_name = test;
            tests_selected[pos] = data;
        }
    }

    $scope.p1 = false, $scope.p2 = false, $scope.p3 = false, $scope.p4 = false, $scope.p5 = false,
        $scope.p6 = false, $scope.p7 = false, $scope.p8 = false, $scope.p9 = false, $scope.p10 = false;

    $scope.flag_procedures = function (type, pos, is_flag) {

        if (pos == 0) {
            $scope.p1 = is_flag;
            procedures_selected[0].flag = $scope.p1;
        }
        if (pos == 1) {
            $scope.p2 = is_flag;
            procedures_selected[1].flag = $scope.p2;

        }
        if (pos == 2) {
            $scope.p3 = is_flag;
            procedures_selected[2].flag = $scope.p3;

        }

        if (pos == 3) {
            $scope.p4 = is_flag;
            procedures_selected[3].flag = $scope.p4;

        }

        if (pos == 4) {
            $scope.p5 = is_flag;
            procedures_selected[4].flag = $scope.p5;

        }

        if (pos == 5) {
            $scope.p6 = is_flag;
            procedures_selected[5].flag = $scope.p6;

        }

        if (pos == 6) {
            $scope.p7 = is_flag;
            procedures_selected[6].flag = $scope.p7;

        }

        if (pos == 7) {
            $scope.p8 = is_flag;
            procedures_selected[7].flag = $scope.p8;

        }

        if (pos == 8) {
            $scope.p9 = is_flag;
            procedures_selected[8].flag = $scope.p9;

        }

        if (pos == 9) {
            $scope.p10 = is_flag;
            procedures_selected[9].flag = $scope.p10;

        }
    }
    var procedures_selected = [];

    $scope.push_procedures = function (procedure, id, type, pos) {
        document.getElementsByClassName("procedures_search_display")[pos].style.display = "none";

        document.getElementsByClassName("procedures_form")[0].style.height += Number(document
            .getElementsByClassName("procedures_form")[0].style.height.replace('px', '')) +
            100 + "px";

        var data = {};
        if (procedure.trim() != '' && procedure.trim().length != 0 && procedure !=
            'No results found') {
            $scope.hideDropdown(type, pos);
            if (pos == 0) {
                $scope.procedure_search = procedure;
                data.flag = $scope.p1;
                if ($scope.dropdownVisible1 === true) {
                    $scope.hideDropdown(type, pos);
                }
            } else {
                $scope['procedure_search' + pos] = procedure
                data.flag = $scope['p' + pos + 1];
                if ($scope['dropdownVisible' + type + pos] === true) {
                    console.log('Dd open')
                    $scope.hideDropdown(type, pos);
                }
            }

            if (id == undefined)
                data.diagnosis_id = 'null';
            else
                data.diagnosis_id = id;

            data.diagnosis_name = procedure;

            procedures_selected[pos] = data;
        }

    }

    $scope.c1 = false, $scope.c2 = false, $scope.c3 = false, $scope.c4 = false, $scope.c5 = false,
        $scope.c6 = false, $scope.c7 = false, $scope.c8 = false, $scope.c9 = false, $scope.c10 = false;

    $scope.flag_consumables = function (type, pos, is_flag) {

        if (pos == 0) {
            $scope.c1 = is_flag;
            consumables_selected[0].flag = $scope.c1;
        }
        if (pos == 1) {
            $scope.c2 = is_flag;
            consumables_selected[1].flag = $scope.c2;

        }
        if (pos == 2) {
            $scope.c3 = is_flag;
            consumables_selected[2].flag = $scope.c3;

        }

        if (pos == 3) {
            $scope.c4 = is_flag;
            consumables_selected[3].flag = $scope.c4;

        }

        if (pos == 4) {
            $scope.c5 = is_flag;
            consumables_selected[4].flag = $scope.c5;

        }

        if (pos == 5) {
            $scope.c6 = is_flag;
            consumables_selected[5].flag = $scope.c6;

        }

        if (pos == 6) {
            $scope.c7 = is_flag;
            consumables_selected[6].flag = $scope.c7;

        }

        if (pos == 7) {
            $scope.c8 = is_flag;
            consumables_selected[7].flag = $scope.c8;

        }

        if (pos == 8) {
            $scope.c9 = is_flag;
            consumables_selected[8].flag = $scope.c9;

        }

        if (pos == 9) {
            $scope.c10 = is_flag;
            consumables_selected[9].flag = $scope.c10;

        }
    }

    var consumables_selected = [];

    $scope.push_consumables = function (consumable, id, type, pos) {
        document.getElementsByClassName("consumables_search_display")[pos].style.display = "none";
        document.getElementsByClassName("consumables_form")[0].style.height += Number(document
            .getElementsByClassName("consumables_form")[0].style.height.replace('px', '')) +
            100 + "px";
        $scope.hideDropdown(type, pos);
        if (consumable.trim() != '' && consumable.trim().length != 0 && consumable !=
            'No results found') {
            var data = {};
            if (pos == 0) {
                data.flag = $scope.c1;
                $scope.consumable_search = consumable;
                if ($scope.dropdownVisible2 === true) {
                    $scope.hideDropdown(type, pos);
                }
            } else {
                data.flag = $scope['c' + pos + 1];
                $scope['consumable_search' + pos] = consumable
                if ($scope['dropdownVisible' + type + pos] === true) {
                    $scope.hideDropdown(type, pos);
                }
            }

            if (id == undefined)
                data.diagnosis_id = 'null';
            else
                data.diagnosis_id = id;

            data.diagnosis_name = consumable;

            consumables_selected[pos] = data;

            // consumables_selected.push(id)
        }

    }

    $scope.pop_out_test = function (pos) {

        if (pos == 0) {
            $scope.test_search = null;
        }
        if (pos == 1) {
            $scope.test_search1 = null;
        }
        if (pos == 2) {
            $scope.test_search2 = null;
        }

        if (pos == 3) {
            $scope.test_search3 = null;
        }

        if (pos == 4) {
            $scope.test_search4 = null;
        }

        if (pos == 5) {
            $scope.test_search5 = null;
        }

        if (pos == 6) {
            $scope.test_search6 = null;
        }

        if (pos == 7) {
            $scope.test_search7 = null;
        }

        if (pos == 8) {
            $scope.test_search8 = null;
        }

        if (pos == 9) {
            $scope.test_search9 = null;
        }
        if (pos == 10) {
            $scope.test_search10 = null;
        }
        if (pos == 11) {
            $scope.test_search11 = null;
        }
        if (pos == 12) {
            $scope.test_search12 = null;
        }
        if (pos == 13) {
            $scope.test_search13 = null;
        }
        if (pos == 14) {
            $scope.test_search14 = null;
        }

        tests_selected = tests_selected.filter(function (value, index, arr) {

            return index == pos - 1;

        });

        console.log("tests_selected", tests_selected);
    }

    $scope.pop_out_procedures = function (pos) {
        console.log("pos is", pos)
        if (pos == 0) {
            $scope.procedure_search5 = null;
        }
        if (pos == 1) {
            $scope.procedure_search1 = null;
        }
        if (pos == 2) {
            $scope.procedure_search2 = null;
        }

        if (pos == 3) {
            $scope.procedure_search3 = null;
        }

        if (pos == 4) {
            $scope.procedure_search4 = null;
        }

        if (pos == 5) {
            $scope.procedure_search5 = null;
        }

        if (pos == 6) {
            $scope.procedure_search6 = null;
        }

        if (pos == 7) {
            $scope.procedure_search7 = null;
        }

        if (pos == 8) {
            $scope.procedure_search8 = null;
        }

        if (pos == 9) {
            $scope.procedure_search9 = null;
        }

        procedures_selected = procedures_selected.filter(function (value, index, arr) {

            return index != pos - 1;

        });

        console.log("procedures", procedures_selected);
    }

    $scope.pop_out_consumables = function (pos) {
        console.log("pos is", pos)
        if (pos == 0) {
            $scope.consumable_search = null;
        }
        if (pos == 1) {
            $scope.consumable_search1 = null;
        }
        if (pos == 2) {
            $scope.consumable_search2 = null;
        }

        if (pos == 3) {
            $scope.consumable_search3 = null;
        }

        if (pos == 4) {
            $scope.consumable_search4 = null;
        }

        if (pos == 5) {
            $scope.consumable_search5 = null;
        }

        if (pos == 6) {
            $scope.consumable_search6 = null;
        }

        if (pos == 7) {
            $scope.consumable_search7 = null;
        }

        if (pos == 8) {
            $scope.consumable_search8 = null;
        }

        if (pos == 9) {
            $scope.consumable_search9 = null;
        }


        consumables_selected = consumables_selected.filter(function (value, index, arr) {

            return index != pos - 1;

        });

        console.log("procedures", consumables_selected);
    }

    $scope.save_converted_prescription = function () {
        console.log(pres_arr_all[n]);
        console.log(pres_arr_all[n].img_appt_id);
        console.log("precription converted", tests_selected, procedures_selected,
            consumables_selected, pres_arr_all[n].img_appt_id);
        console.log("value of n", n, $scope.test_search, $scope.test_search1);
        var data = {};

        data.appointment_id = pres_arr_all[n].img_appt_id;
        data.digitize_time = total_digitization_time;

        data.procedures = procedures_selected;
        data.consumables = consumables_selected;

        // for (var i = 0; i < tests_selected.length; i++) {


        //     if ($scope["suggestion" + (i + 1)] != undefined)
        //         tests_selected[i].test_suggestion = $scope["suggestion" + (i + 1)];
        // }
        // data.tests = tests_selected;

        if ($scope.test_search == undefined || $scope.test_search.length == 0) {

            var data1 = {};
            data1.diagnosis_name = '';
            data1.test_suggestion = $scope.suggestion1;
            data1.flag = $scope.f1;
            data.diagnosis_id = 'null';

            tests_selected[0] = data1;
        } else {

            var i = 1;

            while ($scope["test_search" + i] != undefined) {

                if ($scope["suggestion" + (i + 1)] != undefined)
                    tests_selected[i].test_suggestion = $scope["suggestion" + (i + 1)];
                i++;
            }
        }

        data.tests = tests_selected;
        data.user_id = window.localStorage.getItem('user_id');
        console.log("Request body made", data);

        n = n + 1;
        $scope.prescription_arr = pres_arr_all[n];
        // console.log("Inside next_appt_pres", pres_arr_all[n]);
        $http({
            method: 'POST',
            url: 'http://192.168.1.150:9090/post_converted_diagnosis',
            headers: {
                'Content-Type': 'application/json'
            },
            data: angular.toJson(data)
        }).then(function (response) {
            window.location.reload();
        }).catch(function (response) {
            alert('Error ', response.status)
        });
    }

    $scope.comment_test = function (pos) {

        var test_suggestion = document.getElementsByClassName("test_suggestion");
        var TestDiv = document.getElementsByClassName('tests_form');

        console.log("comment_test", TestDiv[0].style.height.replace('px', ''));

        if (test_suggestion[pos].style.display == '' || test_suggestion[pos].style.display ==
            'none') {
            test_suggestion[pos].style.display = "block";

            if (TestDiv[0].style.height.replace('px', '') == '')
                TestDiv[0].style.height = Number(TestDiv[0].style.height.replace('px', '')) + 330 +
                    "px";
            else if (TestDiv[0].style.height.replace('px', '') == 100)
                TestDiv[0].style.height = Number(TestDiv[0].style.height.replace('px', '')) + 230 +
                    "px";
            else
                TestDiv[0].style.height = Number(TestDiv[0].style.height.replace('px', '')) + 120 +
                    "px";
        } else {
            test_suggestion[pos].style.display = "none";
            TestDiv[0].style.height = Number(TestDiv[0].style.height.replace('px', '')) - 120 +
                "px";
        }
    }

});
