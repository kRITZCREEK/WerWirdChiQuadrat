/**
 * Created by SHK on 27.04.2015.
 */
(function () {
    'use strict';
    var querySelector = document.querySelector.bind(document);
    var submit = querySelector('#solve-submit');
    var answer_A = querySelector('#answer-a');
    var answer_B = querySelector('#answer-b');
    var answer_C = querySelector('#answer-c');
    var answer_D = querySelector('#answer-d');
    var resultField = querySelector('#result');
    function setResult(os) {
        if (isSignificant(os)) {
            resultField.innerHTML = '<p class="signifikant">Signifikant!</p>';
        }
        else {
            resultField.innerHTML = '' + '<p class="unsignifikant">' + 'Unsignifikant!' + '</p>';
        }
    }
    function submitBtn(event) {
        event.preventDefault();
        console.log('clicked', chisqr(4, 20));
        console.log('A:', parseFloat(answer_A.value));
        console.log('B:', parseFloat(answer_B.value));
        console.log('C:', parseFloat(answer_C.value));
        console.log('D:', parseFloat(answer_D.value));
        setResult([
            parseFloat(answer_A.value),
            parseFloat(answer_B.value),
            parseFloat(answer_C.value),
            parseFloat(answer_D.value)
        ]);
    }
    submit.addEventListener('click', submitBtn);
})();