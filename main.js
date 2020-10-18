
let code_input = $('textarea#code');
let line_nums = $('#line-numbers');

let compile_button = document.querySelector('#compile-btn');
let step_button = document.querySelector('#step-btn');
let next_figment_button = document.querySelector('#next-fig-btn');
let run_button = document.querySelector('#run-btn');

let errors = document.querySelector('#errors');

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

let instructions;

$.getJSON("./commands.json", (json) => {instructions = json["commands"];});

let code = null;
let correspond = Array(0);
let registers = [0,0,0,0,0,0,0,0];
let doubleregisters = [[0,0], [0,0]];
let reality = 0;

function loadRegisters() {
    for (let i of registers.keys()) {
        document.querySelector(`x${i}_val`).innerHTML = `${registers[i]}`;
    }
    document.querySelector('joe-who_val1').innerHTML = `${doubleregisters[0][0]}`;
    document.querySelector('joe-who_val2').innerHTML = `${doubleregisters[0][1]}`;
    document.querySelector('yc_val1').innerHTML = `${doubleregisters[1][0]}`;
    document.querySelector('yc_val2').innerHTML = `${doubleregisters[1][1]}`;
    document.querySelector('reality_val').innerHTML = `${reality}`;
}

function compile_code() {
    code = code_input.val().split('\n');
    code.forEach((v, i, a) => (a[i] = v.trim()));
    let line_num = 1;

    correspond = Array(code.length);
    let conditionals = Array(0);

    for (let line of code) {
        console.log(line);
        console.log(line_num);
        line = line.trim();
        if (line_num === 1) {
            if (line !== "i'm Coding!") {
                throw SyntaxError(`first line must be "i'm Coding!"`);
            }
            ++line_num;
            continue;
        }
        if (line.match(/^lol/)) {
            ++line_num;
            continue;
        }
        for (let instr of instructions) {
            if (instr.error === "ERROR") {
                throw SyntaxError(`syntax error at line ${line_num}: ${line}`);
            }
            if (instr.command === "ugh") {
                if (line.match(/ugh+/)) {
                    break;
                }
            }
            else if (instr.command === "uGH") {
                if (line.match(/uGH+/)) {
                    break;
                }
            }
            else if (instr.command === "seems fake but ok?") {
                conditionals.push({"line_num": line_num - 1, "elsewise": false, "progress": false});
                correspond[line_num - 1] = {};
            }
            else if (instr.command === "elsewise") {
                if (conditionals.length === 0) {
                    throw SyntaxError("can't have elsewise without seems fake but ok?");
                }
                if (conditionals[conditionals.length - 1]["elsewise"]) {
                    throw SyntaxError("seems fake but ok? cannot have two elsewises");
                }
                conditionals[conditionals.length - 1]["elsewise"] = true;
                correspond[conditionals[conditionals.length - 1]["line_num"]]["elsewise"] = line_num - 1;
                correspond[line_num - 1] = {};
            } else if (instr.command === "progress") {
                if (conditionals.length === 0) {
                    throw SyntaxError("can't have progress!! without seems fake but ok?");
                }
                if (conditionals[conditionals.length - 1]["progress"]) {
                    throw SyntaxError("seems fake but ok? cannot have two progress!!");
                }
                correspond[correspond[conditionals[conditionals.length - 1]["line_num"]]["elsewise"]]["progress"] = line_num - 1;
                correspond[conditionals[conditionals.length - 1]["line_num"]]["progress"] = line_num - 1;
                conditionals.pop();
            }
        }
        ++line_num;
    }
}

let edit_mode = true;

function compile() {
    if (edit_mode) {
        try {
            compile_code();
            errors.innerHTML = `<p style="color: green; font-weight: bold">the code Compiles!</p><hr/>`;
            document.querySelector('#code').toggleAttribute("readonly", true);
            step_button.removeAttribute("disabled");
            next_figment_button.removeAttribute("disabled");
            run_button.removeAttribute("disabled");
            edit_mode = false;
            compile_button.innerHTML = "edit code";
        } catch (e) {
            errors.innerHTML = `<p style="color: red">error: ${e.message}</p>`;
        }
    } else {
        running_line = 0;
        edit_mode = true;
        compile_button.innerHTML = "compile";
        errors.innerHTML = "";
        document.querySelector('#code').removeAttribute("readonly");
        step_button.toggleAttribute("disabled", true);
        next_figment_button.toggleAttribute("disabled", true);
        run_button.toggleAttribute("disabled", true);
    }
}

let running_line = 0;
let portal_location = [0,0];

function step() {

    let current_line = code[running_line];

    switch (current_line) {
        case "bruh":
        case "b r u h":
        case "i.e.":
        case "e.g.":
        case "seems fake but ok?":
        case "elsewise":
        case "progress!!":
        default:
            if (current_line.match(/^lol/)) {
                break;
            }
            current_figment[portal_location[0]][portal_location[1]] = current_line;
    }

    ++running_line;
    loadFigment();
    loadRegisters();
}
