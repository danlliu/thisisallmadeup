
let code_input = $('textarea#code');
let line_nums = $('#line-numbers');

let compile_button = document.querySelector('#compile-btn');
let step_button = document.querySelector('#step-btn');
let next_figment_button = document.querySelector('#next-fig-btn');
let run_button = document.querySelector('#run-btn');
let rewind_button = document.querySelector('#rewind-btn');

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
let portal_location = [0,0];

function loadFigment() {
    for (let i of Array(8).keys()) {
        for (let j of Array(8).keys()) {
            let text = current_figment[i][j];
            if (text.match(/^ugh+/)) {
                text = `ugh(${text.length - 2})`;
            } else if (text.match(/^uGH+/)) {
                text = `uGH(${text.length - 2})`;
            } else if (text === "someone send help") {
                text = `someone<br/>send help`;
            }
            document.querySelector(`#tb${i}${j}`).innerHTML = text;
            document.querySelector(`#tb${i}${j}`).style.fontWeight = "normal";
            document.querySelector(`#tb${i}${j}`).style.color = "black";
        }
    }
    document.querySelector(`#tb${portal_location[0]}${portal_location[1]}`).style.fontWeight = "bold";
    document.querySelector(`#tb${portal_location[0]}${portal_location[1]}`).style.color = "blue";
}

loadFigment();

function codechange() {
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

let code = [];
let correspond = Array(0);
let registers = [0,0,0,0,0,0,0,0];
let doubleregisters = [[0,0], [0,0]];
let reality = 0;
let memory = Array(2001);

function loadRegisters() {
    for (let i of registers.keys()) {
        document.querySelector(`#x${i}_val`).innerHTML = `${registers[i]}`;
    }
    document.querySelector('#joe-who_val1').innerHTML = `${doubleregisters[0][0]}`;
    document.querySelector('#joe-who_val2').innerHTML = `${doubleregisters[0][1]}`;
    document.querySelector('#yc_val1').innerHTML = `${doubleregisters[1][0]}`;
    document.querySelector('#yc_val2').innerHTML = `${doubleregisters[1][1]}`;
    document.querySelector('#reality_val').innerHTML = `${reality}`;
}

const NUMS_REGEX = /[0-9]+/g;
let text_size = 0;

function compile_code() {
    text_size = 0;
    code = code_input.val().split('\n');
    code.forEach((v, i, a) => (a[i] = v.trim()));
    let line_num = 1;

    correspond = Array(code.length);
    for (let i = 0; i < code.length; ++i) { correspond[i] = -1; }
    let conditionals = Array(0);

    let branching = false;

    for (let line of code) {
        line = line.trim();
        if (line_num === 1) {
            if (line !== "i'm Coding!") {
                throw SyntaxError(`first line must be "i'm Coding!"`);
            }
            ++line_num;
            ++text_size;
            continue;
        } else if (line === "i'm Coding!") {
            throw SyntaxError(`"i'm Coding!" cannot be used past the first line`);
        }

        if (branching) {
            // has to be branch
            if (line.match(/^how did we jump from [0-9]+ to [0-9]+/)) {
                let jump_lines = [...line.matchAll(NUMS_REGEX)];
                correspond[parseInt(jump_lines[0][0]) - 1] = parseInt(jump_lines[1][0]) - 1;
            } else {
                if (line.match(/^lol/)) {
                    continue;
                }
                throw SyntaxError(`branches must come after all other instructions`);
            }
            ++line_num;
            continue;
        }

        if (line.match(/^how did we jump from [0-9]+ to [0-9]+/)) {
            let jump_lines = [...line.matchAll(NUMS_REGEX)];
            correspond[parseInt(jump_lines[0][0]) - 1] = parseInt(jump_lines[1][0]) - 1;
            ++line_num;
            branching = true;
            continue;
        }

        ++text_size;

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
            else if (instr.command === "seems fake but ok?" && line === instr.command) {
                conditionals.push({"line_num": line_num - 1, "elsewise": false, "progress": false});
                correspond[line_num - 1] = {};
                break;
            }
            else if (instr.command === "elsewise" && line === instr.command) {
                if (conditionals.length === 0) {
                    throw SyntaxError("can't have elsewise without seems fake but ok?");
                }
                if (conditionals[conditionals.length - 1]["elsewise"]) {
                    throw SyntaxError("seems fake but ok? cannot have two elsewises");
                }
                conditionals[conditionals.length - 1]["elsewise"] = true;
                correspond[conditionals[conditionals.length - 1]["line_num"]]["elsewise"] = line_num - 1;
                correspond[line_num - 1] = {};
                break;
            } else if (instr.command === "progress!!" && line === instr.command) {
                if (conditionals.length === 0) {
                    throw SyntaxError("can't have progress!! without seems fake but ok?");
                }
                if (conditionals[conditionals.length - 1]["progress!!"]) {
                    throw SyntaxError("seems fake but ok? cannot have two progress!!");
                }
                correspond[correspond[conditionals[conditionals.length - 1]["line_num"]]["elsewise"]]["progress!!"] = line_num - 1;
                correspond[conditionals[conditionals.length - 1]["line_num"]]["progress!!"] = line_num - 1;
                conditionals.pop();
                break;
            } else {
                if (line === instr.command) {
                    break;
                }
            }
        }
        ++line_num;
    }
}

let edit_mode = true;
let running_line = 0;

function updateCode() {
    if (running_line >= text_size || running_line === -1) {
        console.log("end of updateCode");
        running_line = -1;
        errors.innerHTML += `<p style="color: black; font-weight: bold">the code has Finished!</p><hr/>`;
        step_button.toggleAttribute("disabled", true);
        next_figment_button.toggleAttribute("disabled", true);
        run_button.toggleAttribute("disabled", true);
    }
    line_nums.empty();
    let sz = code.length;
    for (let i = 1; i <= sz; ++i) {
        if (i !== running_line + 1) {
            line_nums.append(`${i}<br/>`);
        } else {
            line_nums.append(`<span style="color: green; font-weight: bold">&gt;</span><br/>`);
        }
    }
    line_nums.append(`<br>`);
}

function compile() {
    if (edit_mode) {
        try {
            compile_code();
            errors.innerHTML = `<p style="color: green; font-weight: bold">the code Compiles!</p><hr/>`;
            document.querySelector('#code').toggleAttribute("readonly", true);
            step_button.removeAttribute("disabled");
            next_figment_button.removeAttribute("disabled");
            run_button.removeAttribute("disabled");
            rewind_button.removeAttribute("disabled");
            edit_mode = false;
            compile_button.innerHTML = "edit code";
            updateCode();
        } catch (e) {
            errors.innerHTML = `<p style="color: red">error: ${e.message}</p>`;
        }
    } else {
        running_line = 0;
        portal_location = [0,0];
        current_figment = newFigment();
        registers = [0,0,0,0,0,0,0,0];
        doubleregisters = [[0,0], [0,0]];
        memory = Array(2001);
        for (let i = 0; i < 2001; ++i) {
            memory[i] = 0;
        }
        reality = 0;
        figment_result = 0;
        new_reality = false;
        loadFigment();
        loadRegisters();
        edit_mode = true;
        compile_button.innerHTML = "compile";
        errors.innerHTML = "";
        document.querySelector('#code').removeAttribute("readonly");
        step_button.disabled = true;
        next_figment_button.disabled = true;
        run_button.disabled = true;
        rewind_button.disabled = true;
        codechange();
    }
}

let new_reality = false;
let figment_result = 0;

function runFigment() {

    // stage 0: figment compilation

    // load waypoints
    let running_instructions = [];
    let waypoints = {
        h: [],
        hh: [],
        hhh: [],
        hhhh: [],
        hhhhh: []
    };
    let h_correspond = Array(64);
    for (let i = 0; i < 64; ++i) {
        h_correspond[i] = i;
    }

    for (let r = 0; r < 8; ++r) {
        for (let c = 0; c < 8; ++c) {
            if (current_figment[r][c].match(/^h+$/)) {
                waypoints[current_figment[r][c]].push({r, c, corresponding: r * 8 + c});
            }
        }
    }

    for (let tag of ["h", "hh", "hhh", "hhhh", "hhhhh"]) {
        for (let i = 0; i < waypoints[tag].length; ++i) {
            let closest_idx = i;
            let closest_dist = Number.POSITIVE_INFINITY;
            for (let pt = i + 1; pt < waypoints[tag].length; ++pt) {
                if (waypoints[tag][pt] == null) break;
                let dist = Math.sqrt(Math.pow((waypoints[tag][i].r - waypoints[tag][pt].r), 2) + Math.pow((waypoints[tag][i].c - waypoints[tag][pt].c), 2));
                if (dist < closest_dist) {
                    closest_idx = pt;
                    closest_dist = dist;
                }
            }
            waypoints[tag][i]["corresponding"] = waypoints[tag][closest_idx].r * 8 + waypoints[tag][closest_idx].c;
            h_correspond[waypoints[tag][i].r * 8 + waypoints[tag][i].c] = waypoints[tag][closest_idx].r * 8 + waypoints[tag][closest_idx].c;
        }
    }

    let compile_idx = 0;
    while (compile_idx < 64) {
        if (current_figment[Math.floor(compile_idx / 8)][compile_idx % 8].match(/^h+$/) &&
        registers[Math.floor(compile_idx / 8)] === registers[compile_idx % 8]) {
            compile_idx = h_correspond[compile_idx];
        } else {
            running_instructions.push({instruction: current_figment[Math.floor(compile_idx / 8)][compile_idx % 8], idx: compile_idx});
            if (running_instructions[running_instructions.length - 1].instruction === "i'm DONE" ||
                running_instructions[running_instructions.length - 1].instruction === "someone send help") {
                break;
            }
        }
        ++compile_idx;
    }

    // stage 1: register fetch

    let r_values = Array(0);
    for (let instruction of running_instructions) {
        r_values.push({r1: Math.floor(instruction.idx / 8), r2: instruction.idx % 8});
    }

    for (let regValues of r_values) {
        regValues["r1_val"] = registers[regValues["r1"]];
        regValues["r2_val"] = registers[regValues["r2"]];
    }

    // stage 2: execute
    // stage 3: writeback

    let r_idx = 0;

    for (let instruction of running_instructions) {
        console.log(registers);
        console.log(`about to run`);
        console.log(instruction);
        let regValues = r_values[r_idx++];
        console.log(regValues);
        switch (instruction["instruction"]) {
            case "i'm DONE":
                figment_result = 0; // fake
                break;
            case "someone send help":
                figment_result = 1; // real
                break;
            case "i'm Learning":
                registers[regValues["r1"]] = regValues["r1_val"] + 1;
                registers[regValues["r2"]] = regValues["r2_val"] + 1;
                break;
            case "i'm Struggling":
                registers[regValues["r1"]] = regValues["r1_val"] + 1;
                registers[regValues["r2"]] = regValues["r2_val"] - 1;
                console.log(`after i'm Strugging`);
                console.log(registers);
                break;
            case "nO":
                registers[regValues["r1"]] = 0;
                registers[regValues["r2"]] = -regValues["r2_val"];
                break;
            case "joe who":
                doubleregisters[0][0] = regValues["r1_val"];
                doubleregisters[0][1] = regValues["r2_val"];
                break;
            case "your conscience":
                doubleregisters[1][0] = regValues["r1_val"];
                doubleregisters[1][1] = regValues["r2_val"];
                break;
            case "whos joe":
                registers[regValues["r1"]] = doubleregisters[0][0];
                registers[regValues["r2"]] = doubleregisters[0][1];
                break;
            case "whos conscience?":
                registers[regValues["r1"]] = doubleregisters[1][0];
                registers[regValues["r2"]] = doubleregisters[1][1];
                break;
            case "wait i need to remember this":
                if (regValues["r2_val"] < 0 || regValues["r2_val"] >= 2001) {
                    break;
                }
                memory[regValues["r2_val"]] = regValues["r1_val"];
                break;
            case "what have i said that's so usable":
                if (regValues["r2_val"] < 0 || regValues["r2_val"] >= 2001) {
                    registers[regValues["r1"]] = Math.floor(Math.random() * 1047);
                }
                registers[regValues["r1"]] = memory[regValues["r2_val"]];
                break;
            case ">:(":
                break;
            default:
                if (instruction["instruction"].match(/^ugh+$/)) {
                    registers[regValues["r1"]] = instruction["instruction"].length - 2;
                } else if (instruction["instruction"].match(/^uGH+$/)) {
                    registers[regValues["r1"]] = -(instruction["instruction"].length - 2);
                }
                break;
        }
    }
}

function step() {

    if (running_line >= text_size) {
        loadFigment();
        loadRegisters();
        updateCode();
        return;
    }

    if (correspond[running_line] !== -1 && correspond[running_line]["elsewise"] == null) {
        running_line = correspond[running_line];
        loadFigment();
        loadRegisters();
        updateCode();
        return;
    }

    let current_line = code[running_line];

    if (current_line === "i'm Coding!") {
        ++running_line;
        loadFigment();
        loadRegisters();
        updateCode();
        return;
    }

    if (correspond[current_line] != null && correspond[current_line]["branch"] != null) {
        current_line = correspond[current_line]["branch"];
        loadFigment();
        loadRegisters();
        updateCode();
        return;
    }

    switch (current_line) {
        case "bruh":
            // run
            runFigment();
            new_reality = true;
            break;
        case "b r u h":
            // run & clear
            runFigment();
            current_figment = newFigment();
            new_reality = true;
            break;
        case "i.e.":
            // right
            ++(portal_location[1]);
            portal_location[1] %= 8;
            break;
        case "e.g.":
            // down
            ++(portal_location[0]);
            portal_location[0] %= 8;
            break;
        case "what wait why where when how":
            // get reality value
            if (new_reality) {
                reality = figment_result;
            }
            break;
        case "seems fake but ok?":
            // check and branch
            if (reality === 0) { // fake
                running_line = correspond[running_line]["elsewise"];
            }
            break;
        case "elsewise":
            // branch to corresponding progress!!, seems fake but ok? will branch to instruction after elsewise
            running_line = correspond[running_line]["progress!!"];
            break;
        case "progress!!":
            // end else just continue as normal
            break;
        default:
            if (current_line.match(/^lol/)) {
                break;
            }
            current_figment[portal_location[0]][portal_location[1]] = current_line;
    }

    if (new_reality && current_line !== "bruh" && current_line !== "b r u h") {
        new_reality = false;
    }

    ++running_line;
    loadFigment();
    loadRegisters();
    updateCode();
}

function nextFigment() {
    step_button.toggleAttribute("disabled", true);
    next_figment_button.toggleAttribute("disabled", true);
    run_button.toggleAttribute("disabled", true);
    let interval = setInterval(() => {
        if (running_line !== -1 && !(code[running_line] === "bruh" || code[running_line] === "b r u h")) {
            step();
        } else {
            clearInterval(interval);
            step_button.removeAttribute("disabled");
            next_figment_button.removeAttribute("disabled");
            run_button.removeAttribute("disabled");
        }
    }, 125);
}

let run_interval = null;

function run() {
    step_button.toggleAttribute("disabled", true);
    next_figment_button.toggleAttribute("disabled", true);
    rewind_button.toggleAttribute("disabled", true);
    run_interval = setInterval(() => {
        if (running_line !== -1) {
            step();
        } else {
            clearInterval(run_interval);
            run_interval = null;
            run_button.toggleAttribute("disabled", true);
            rewind_button.removeAttribute("disabled");
            run_button.innerHTML = "run";
            run_button.classList.remove("btn-danger");
            run_button.classList.add("btn-success");
        }
    }, 125);
}

function toggle_run() {
    if (run_interval == null) {
        run();
        run_button.innerHTML = "pause";
        run_button.classList.remove("btn-success");
        run_button.classList.add("btn-danger");
    } else {
        clearInterval(run_interval);
        step_button.removeAttribute("disabled");
        next_figment_button.removeAttribute("disabled");
        rewind_button.removeAttribute("disabled");
        run_interval = null;
        run_button.innerHTML = "run";
        run_button.classList.remove("btn-danger");
        run_button.classList.add("btn-success");
    }
}

function rewind() {
    compile();
    compile();
}
