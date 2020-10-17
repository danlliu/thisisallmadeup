
let code_input = $('#code');
let line_nums = $('#line-numbers');

let compile_button = $('#compile-btn');
let step_button = $('#step-btn');
let next_figment_button = $('#next-fig-btn');
let run_button = $('#run-btn');

function newFigment() {
    let figment = new Array(8);
    for (let i of Array(8).keys()) {
        figment[i] = new Array(8);
        for (let j of Array(8).keys()) {
            figment[i][j] = ">:(";
        }
    }
    return figment;
}

let current_figment = newFigment();

function loadFigment() {
    for (let i of Array(8).keys()) {
        for (let j of Array(8).keys()) {
            document.querySelector(`#tb${i}${j}`).innerHTML = current_figment[i][j];
        }
    }
}

loadFigment();

function codechange() {
    console.log('change');
    line_nums.empty();
    let sz = code_input.val().split('\n').length;
    for (let i = 1; i <= sz; ++i) {
        line_nums.append(`${i}<br/>`);
    }
    line_nums.append(`<br>`);
}

code_input.on('scroll', function () {
    line_nums.scrollTop($(this).scrollTop());
});
line_nums.on('scroll', function () {
    code_input.scrollTop($(this).scrollTop());
});

// -----------
//  COMPILING
// -----------

function compile() {
    let madeupcode = code_input.val();
    let linesofcode = madeupcode.split('\n');

}
