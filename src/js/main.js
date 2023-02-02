document.addEventListener('DOMContentLoaded', function () {

});

let player1, player2, player3, player4;
let players;
let playable = false;
const skip = true;
let idiotenModus = true;
let undo = true;
let count = 1;
let color = 0;
let round = 0;
let p1 = [1,1], p2 = [1,2], p3 = [1,3], p4 = [1,4];
let save;
let undid;
let replaying = false;


function colorOk(selectObject){
    let name = selectObject.name;
    let value = selectObject.value;
    switch (name) {
        case "player1color":
            if (document.getElementsByName("player2color")[0].value === value)
                document.getElementsByName("player2color")[0].value = 4;
            if (document.getElementsByName("player3color")[0].value === value)
                document.getElementsByName("player3color")[0].value = 4;
            if (document.getElementsByName("player4color")[0].value === value)
                document.getElementsByName("player4color")[0].value = 4;
            break;
        case "player2color":
            if (document.getElementsByName("player1color")[0].value === value)
                document.getElementsByName("player1color")[0].value = 0;
            if (document.getElementsByName("player3color")[0].value === value)
                document.getElementsByName("player3color")[0].value = 0;
            if (document.getElementsByName("player4color")[0].value === value)
                document.getElementsByName("player4color")[0].value = 0;
            break;
        case "player3color":
            if (document.getElementsByName("player2color")[0].value === value)
                document.getElementsByName("player2color")[0].value = 0;
            if (document.getElementsByName("player1color")[0].value === value)
                document.getElementsByName("player1color")[0].value = 0;
            if (document.getElementsByName("player4color")[0].value === value)
                document.getElementsByName("player4color")[0].value = 0;
            if (value !== "5") {
                Array.prototype.forEach.call(document.getElementsByClassName("player3hidden"), function (item) {
                    item.style.display = "block";
                });
                Array.prototype.forEach.call(document.getElementsByClassName("player4hidden1"), function (item) {
                    item.style.display = "block";
                });
                if(document.getElementsByName("player4color")[0].value !== "5")
                    Array.prototype.forEach.call(document.getElementsByClassName("player4hidden2"), function (item) {
                        item.style.display = "block";
                    });
                else
                    Array.prototype.forEach.call(document.getElementsByClassName("player4hidden2"), function (item) {
                        item.style.display = "none";
                    });
            }
            else {
                Array.prototype.forEach.call(document.getElementsByClassName("player3hidden"), function (item) {
                    item.style.display = "none";
                });
                Array.prototype.forEach.call(document.getElementsByClassName("player4hidden1"), function(item) {
                    item.style.display = "none";
                });
                Array.prototype.forEach.call(document.getElementsByClassName("player4hidden2"), function(item) {
                    item.style.display = "none";
                });
            }
            break;
        case "player4color":
            if(document.getElementsByName("player2color")[0].value === value)
                document.getElementsByName("player2color")[0].value = 0;
            if(document.getElementsByName("player3color")[0].value === value)
                document.getElementsByName("player3color")[0].value = 0;
            if(document.getElementsByName("player1color")[0].value === value)
                document.getElementsByName("player1color")[0].value = 0;
            if (value !== "5")
                Array.prototype.forEach.call(document.getElementsByClassName("player4hidden2"), function (item) {
                    item.style.display = "block";
                });
            else
                Array.prototype.forEach.call(document.getElementsByClassName("player4hidden2"), function (item) {
                    item.style.display = "none";
                });
            break;
    }
}

function fertig(){
    player1 = [document.getElementsByName("player1color")[0].value,document.getElementsByName("player1name")[0].value];
    player2 = [document.getElementsByName("player2color")[0].value,document.getElementsByName("player2name")[0].value];
    if(document.getElementsByName("player3color")[0].value !== "5")
        player3 = [document.getElementsByName("player3color")[0].value,document.getElementsByName("player3name")[0].value];
    else player3 = false;
    if(document.getElementsByName("player4color")[0].value !== "5")
        player4 = [document.getElementsByName("player4color")[0].value,document.getElementsByName("player4name")[0].value];
    else player4 = false;
    //console.log(player1);
    //console.log(player2);
    //console.log(player3);
    //console.log(player4);
    if(player1[0]==="0" || player2[0]==="0" || player3[0]==="0" || player4[0]==="0" ) {
        document.getElementById("error1").innerText =  "Bitte alle eine Farbe auswählen!\nOder auf \"kein Spieler\" setzen";
        return;
    }
    if(player1[0]===player2[0] || player1[0]===player3[0] || player1[0]===player3[0] || player1[0]===player4[0] || player2[0]===player3[0] || player2[0]===player4[0] || (player3[0]===player4[0]) && (player3!==false)) {
        document.getElementById("error1").innerText =  "Wie auch immer ihr das geschafft habt, aber keine Farbe doppelt auswählen!";
        return;
    }
    if(player1[1]==='' || player2[1]==='' || player3[1]==='' || player4[1]==='' ) {
        document.getElementById("error1").innerText =  "Bitte alle eine Namen eingeben!";
        return;
    }
    if(player1[1]===player2[1] || player1[1]===player3[1] || player1[1]===player3[1] || player1[1]===player4[1] || player2[1]===player3[1] || player2[1]===player4[1] || (player3[1]===player4[1]) && (player3!==false)) {
        document.getElementById("error1").innerText =  "Bitte keine Namen doppelt hernehmen!";
        return;
    }
    document.getElementById("error1").innerText = "";
    idiotenModus = document.getElementById("help").checked;
    undo = document.getElementById("undo").checked;
    document.getElementById("layer1").style.display = "none";
    document.getElementById("layer2").style.display = "block";
    initialize();
}

window.onload=function (){
    //fertig();
    if(skip) {
        player1 = ['1', 'Player1'];
        player2 = ['3', 'Player2'];
        player3 = ['2', 'Player3'];
        player4 = false;
        playable = true;
        document.getElementById("layer1").style.display = "none";
        document.getElementById("layer2").style.display = "block";
        initialize();
    }
}

function initialize(){
    document.getElementById("redo").style.display= undo? "flex" : "none";
    document.getElementById("un").disabled = true;
    document.getElementById("re").disabled = true;
    save = new Array(60);
    undid = false;

    players = [player1, player2, player3, player4];
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            let x = document.getElementById("t" + i + j);
            x.innerText = "";
            x.classList.replace(x.classList.item(0), "empty");
        }
    }
    const x1 = document.getElementById("t44");
    const x2 = document.getElementById("t45");
    const x3 = document.getElementById("t54");
    const x4 = document.getElementById("t55")
    x1.innerHTML="O";
    x2.innerHTML="O";
    x3.innerHTML="O";
    x4.innerHTML="O";
    if(!player3){
        if(Math.floor(Math.random()*2 + 1) === 1){
            x1.classList.replace(x1.classList.item(0), "c" + player1[0]);
            x4.classList.replace(x4.classList.item(0), "c" + player1[0]);
            x2.classList.replace(x2.classList.item(0), "c" + player2[0]);
            x3.classList.replace(x3.classList.item(0), "c" + player2[0]);
        }
        else {
            x2.classList.replace(x2.classList.item(0), "c" + player1[0]);
            x3.classList.replace(x3.classList.item(0), "c" + player1[0]);
            x1.classList.replace(x1.classList.item(0), "c" + player2[0]);
            x4.classList.replace(x4.classList.item(0), "c" + player2[0]);
        }
    }
    else {
        let rng4, rng3, rng2, rng1;
        do {
            rng1 = Math.floor(Math.random()*4 + 1);
            rng2 = Math.floor(Math.random()*4 + 1);
            rng3 = Math.floor(Math.random()*4 + 1);
            rng4 = Math.floor(Math.random()*4 + 1);
        }
        while ([rng1, rng2, rng3].indexOf(rng4) !== -1 || [rng1, rng2, rng4].indexOf(rng3) !== -1 || [rng1, rng4, rng3].indexOf(rng2) !== -1 || [rng4, rng2, rng3].indexOf(rng1) !== -1)
        x1.classList.replace(x1.classList.item(0), "c" + rng1);
        x2.classList.replace(x2.classList.item(0), "c" + rng2);
        x3.classList.replace(x3.classList.item(0), "c" + rng3);
        x4.classList.replace(x4.classList.item(0), "c" + rng4);
    }
    //color = player1[0];
    //document.getElementById("infos").innerHTML = "<span class=\"c" + player1[0] + " \">" + player1[1] + "</span> ist dran.";
    do{
        count = Math.floor(Math.random()*4 + 1);
    }
    while (count > 4 || (count > 2 && !player3) || (count > 3 && !player4));
    updatePlayerTurn();
    round = 0;
    playable = true;
}

function move(feld){
    if(!playable || feld.innerText === "O")
        return;
    let f0 = false;
    //let fn = false;
    const x = parseInt(feld.id.slice(1,2));
    const y = parseInt(feld.id.slice(2,3));
    if((p1[0] === 0 && p1[1] == color) || (p2[0] === 0 && p2[1] == color) || (p3[0] === 0 && p3[1] == color) || (p4[0] === 0 && p4[1] == color)) {//check for no color left
        //console.log(color + " kann nicht legen");
        if(idiotenModus){
            for (let i = 1; i <= 8; i++) {
                for (let j = 1; j <= 8; j++) {
                    if(document.getElementById("t" + i + j).innerText === "" &&  checkAcesent(i,j)){
                        document.getElementById("t" + i + j).innerText = "+1";
                        document.getElementById("t" + i + j).style.backgroundColor = color == 1 ? "red" : color == 2 ? "green" : color == 3 ? "blue" : color == 4 ? "yellow" : "";
                    }
                }
            }
        }
        f0 = checkAcesent(x, y);
    }
    let f1 = checkLine(x,y,1,0, color);
    let f2 = checkLine(x,y,1,1, color);
    let f3 = checkLine(x,y,0,1, color);
    let f4 = checkLine(x,y,-1,1, color);
    let f5 = checkLine(x,y,-1,0, color);
    let f6 = checkLine(x,y,-1,-1, color);
    let f7 = checkLine(x,y,0,-1, color);
    let f8 = checkLine(x,y,1,-1, color);
    //console.log(f1 + " " + f2 + " " + f3 + " " + f4 + " " + f5 + " " + f6 + " " + f7 + " " + f8 + " " + f0);
    if(idiotenModus && !(f1 || f2 || f3 || f4 || f5 || f6 || f7 || f8 || f0)){//check for bad layout
        let idiotenletiable;
        for (let i = 1; i <= 8; i++) {
            for (let j = 1; j <= 8; j++) {
                if((document.getElementById("t" + i + j).classList.item(0) === 'empty')){
                    let ff1 = checkLine(i, j, 1, 0, color);
                    let ff2 = checkLine(i, j, 1, 1, color);
                    let ff3 = checkLine(i, j, 0, 1, color);
                    let ff4 = checkLine(i, j, -1, 1, color);
                    let ff5 = checkLine(i, j, -1, 0, color);
                    let ff6 = checkLine(i, j, -1, -1, color);
                    let ff7 = checkLine(i, j, 0, -1, color);
                    let ff8 = checkLine(i, j, 1, -1, color);
                    if (ff1 || ff2 || ff3 || ff4 || ff5 || ff6 || ff7 || ff8) {
                        let ff = [];
                        ff = ff.concat(ff1, ff2, ff3, ff4, ff5, ff6, ff7, ff8);
                        let iTmp = 1;
                        for (const ffElement of ff)
                            if (ffElement !== false) {
                                iTmp++;
                            }
                        document.getElementById("t" + i + j).innerText = "+" + iTmp;
                        document.getElementById("t" + i + j).style.backgroundColor = color == 1 ? "red" : color == 2 ? "green" : color == 3 ? "blue" : color == 4 ? "yellow" : "";
                        idiotenletiable = true;
                    }
                }

            }
        }
        if(!idiotenletiable) {
            f0 = checkAcesent(x,y);
            //console.log("bad layout" + f0);
        }
    }
    if (f1 || f2 || f3 || f4 || f5 || f6 || f7 || f8 || f0) {
        let tmpSave = new Array(8);
        for (let i = 0; i < tmpSave.length; i++) {
            tmpSave[i] = new Array(8);
        }
        let ff = [];
        ff = ff.concat(f1, f2, f3, f4, f5, f6, f7, f8);
        //console.log(ff);
        feld.innerText = "O";
        tmpSave[x-1][y-1] = 5;
        feld.classList.replace(feld.classList.item(0), "c" + color);
        for (const ffElement of ff)
            if (ffElement !== false) {
                tmpSave[parseInt(ffElement.slice(1, 2))-1][parseInt(ffElement.slice(2, 3))-1] = parseInt(document.getElementById(ffElement).classList.item(0).slice(1, 2));
                //console.log(parseInt(ffElement.slice(1, 2)) + "" + parseInt(ffElement.slice(2, 3)))
                document.getElementById(ffElement).classList.replace(document.getElementById(ffElement).classList.item(0), "c" + color);
            }
        count++;
        if (count > 4 || (count > 2 && !player3) || (count > 3 && !player4))
            count = 1;
        reun();
        clearIdiot();
        if (undo){
            const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);
            document.getElementById("un").disabled = false;
            if(save[round+1]===undefined)
                document.getElementById("re").disabled = true;
            if(!equals(save[round],(tmpSave)) && undid){
                for (let i = round + 1; i < 60; i++) {
                    save[i] = undefined;
                }
                document.getElementById("re").disabled = true;
                undid = false;
            }
        }
        save[round] = tmpSave;
        round++;
        if (round === 60) {
            playable = false;
            //console.log("end");
            let winColorArray = [p1,p2,p3,p4];
            winColorArray.sort((a, b) => b[0] - a[0]);
            //console.log(winColorArray);
            if(winColorArray[0][0] === winColorArray[1][0] && winColorArray[1][0] === winColorArray[2][0] && winColorArray[2][0] === winColorArray[3][0] && player3 && player4) {
                document.getElementById("infos").innerHTML = "Spiel beendet:<br>Gewonnen haben alle also:<span class=\"c" + winColorArray[0][1] + " \">" + whatPlayer(winColorArray[0][1])[1] + "</span>, <span class=\"c" + winColorArray[1][1] + " \">" + whatPlayer(winColorArray[1][1])[1] + "</span> und <span class=\"c" + winColorArray[2][1] + " \">" + whatPlayer(winColorArray[2][1])[1] + "</span> und <span class=\"c" + winColorArray[3][1] + " \">" + whatPlayer(winColorArray[3][1])[1] + "</span> mit jeweils <span class=\"c" + winColorArray[0][1] + " \">" + winColorArray[0][0] + " Punkten</span>.";
                return;
            }
            else if(winColorArray[0][0] === winColorArray[1][0] && winColorArray[1][0] === winColorArray[2][0] && player3)
                document.getElementById("infos").innerHTML = "Spiel beendet:<br>Gewonnen haben <span class=\"c" + winColorArray[0][1] + " \">" + whatPlayer(winColorArray[0][1])[1] + "</span>, <span class=\"c" + winColorArray[1][1] + " \">" + whatPlayer(winColorArray[1][1])[1] + "</span> und <span class=\"c" + winColorArray[2][1] + " \">" + whatPlayer(winColorArray[2][1])[1] + "</span> mit jeweils <span class=\"c" + winColorArray[0][1] + " \">" + winColorArray[0][0] + " Punkten</span>.";
            else if(winColorArray[0][0] === winColorArray[1][0])
                document.getElementById("infos").innerHTML = "Spiel beendet:<br>Gewonnen haben <span class=\"c" + winColorArray[0][1] + " \">" + whatPlayer(winColorArray[0][1])[1] + "</span> und <span class=\"c" + winColorArray[1][1] + " \">" + whatPlayer(winColorArray[1][1])[1] + "</span> mit jeweils <span class=\"c" + winColorArray[0][1] + " \">" + winColorArray[0][0] + " Punkten</span>.";

            else
                document.getElementById("infos").innerHTML = "Spiel beendet:<br>Gewonnen hat <span class=\"c" + winColorArray[0][1] + " \">" + whatPlayer(winColorArray[0][1])[1] + "</span> mit <span class=\"c" + winColorArray[0][1] + " \">" + winColorArray[0][0] + " Punkten</span>.";

            if(winColorArray[0][0] !== winColorArray[1][0]) {
                if (winColorArray[1][0] === winColorArray[2][0] && winColorArray[2][0] === winColorArray[3][0] && player3 && player4) {
                    document.getElementById("infos").innerHTML += "<br>Zweiter mit <span class=\"c" + winColorArray[1][1] + " \">" + winColorArray[1][0] + " Punkten</span> sind <span class=\"c" + winColorArray[1][1] + " \">" + whatPlayer(winColorArray[1][1])[1] + "</span>, <span class=\"c" + winColorArray[2][1] + " \">" + whatPlayer(winColorArray[2][1])[1] + "</span> und <span class=\"c" + winColorArray[3][1] + " \">" + whatPlayer(winColorArray[3][1])[1] + "</span> geworden.";
                    return;
                }
                else if (winColorArray[1][0] === winColorArray[2][0] && player3)
                    document.getElementById("infos").innerHTML += "<br>Zweiter mit <span class=\"c" + winColorArray[1][1] + " \">" + winColorArray[1][0] + " Punkten</span> sind <span class=\"c" + winColorArray[1][1] + " \">" + whatPlayer(winColorArray[1][1])[1] + "</span> und <span class=\"c" + winColorArray[2][1] + " \">" + whatPlayer(winColorArray[2][1])[1] + "</span> geworden.";
                else
                    document.getElementById("infos").innerHTML += "<br>Zweiter mit <span class=\"c" + winColorArray[1][1] + " \">" + winColorArray[1][0] + " Punkten</span> ist <span class=\"c" + winColorArray[1][1] + " \">" + whatPlayer(winColorArray[1][1])[1] + "</span> geworden.";
            }

            if(player3 &&  winColorArray[1][0] !== winColorArray[2][0]) {
                if (winColorArray[2][0] === winColorArray[3][0]) {
                    document.getElementById("infos").innerHTML += "<br><span class=\"c" + winColorArray[2][1] + " \">" + whatPlayer(winColorArray[2][1])[1] + "</span> und <span class=\"c" + winColorArray[3][1] + " \">" + whatPlayer(winColorArray[3][1])[1] + "</span> sind dritter geworden mit <span class=\"c" + winColorArray[2][1] + " \">" + winColorArray[2][0] + "</span> Punkten.";
                    return;
                } else if (player3)
                    document.getElementById("infos").innerHTML += "<br><span class=\"c" + winColorArray[2][1] + " \">" + whatPlayer(winColorArray[2][1])[1] + "</span> ist dritter geworden mit <span class=\"c" + winColorArray[2][1] + " \">" + winColorArray[2][0] + "</span> Punkten.";
            }
            if(player4 &&  winColorArray[2][0] !== winColorArray[3][0])
                document.getElementById("infos").innerHTML += "Mit <span class=\"c" + winColorArray[3][1] + " \">" + winColorArray[3][0] + " Punkten </span> ist <span class=\"c" + winColorArray[3][1] + " \">" + whatPlayer(winColorArray[3][1])[1] + "</span> letzter geworden.";

            document.getElementById("infos").innerHTML += "<biv id='buttonDiv'><button onclick='initialize()'>Neue Runde</button><button onclick='replay()'>Wiederholung ansehen</button></div";
            document.getElementById("redo").style.display = "none";

        }
    }
}
/**@return 2 ist empty, 1 ist color übereinstimmung, true ist out of bounds, false ist keine farbübereinstimmung
 * */
function check(x, y, c){
    if(x<1 || x>8 || y<1 || y>8)
        return true;
    //console.log(x + " , " + y + " , " + c )
    let a = document.getElementById("t" + x + y).classList.item(0);
    if(a === undefined)
        return true;
    if(a === 'empty')
        return 2;
    let b = a.slice(1, 2) === c;
    if(b)
        return 1;
    return b;
    //return a.slice(1,2);
}

function checkLine(x, y, sx, sy, c){
    //console.log("Starting for: "+ x + ", " + + y + ", " + + sx + ", " + sy)
    let end;
    let counter = 0;
    let stat = [];
    do{
        x += sx;
        y += sy;
        end = check(x, y ,c);
        //console.log(x + " , " + y + " , " + c + " mir Ergebens: " + end);
        if(!end)
            stat[counter] = "t"+x+y;
        counter++;
    }
    while(!end)
    //console.log("end");
    if(check(x, y ,c) === 1 && typeof stat[0] !== 'undefined')
        return stat;
    return false;
}

function whatPlayer(color){
    for (const element of players) {
        if(element[0] == color)
            return element;
    }
}

function updatePlayerTurn(){
    if(replaying)
        switch (count){
            case 1:
                color = player1[0];
                break;
            case 2:
                color = player2[0];
                break;
            case 3:
                color = player3[0];
                break;
            case 4:
                color = player4[0];
                break;
        }
    else
        switch (count) {
            case 1:
                color = player1[0];
                document.getElementById("infos").innerHTML = "<span class=\"c" + player1[0] + " \">" + player1[1] + "</span> ist dran.";
                break;
            case 2:
                color = player2[0];
                document.getElementById("infos").innerHTML = "<span class=\"c" + player2[0] + " \">" + player2[1] + "</span> ist dran.";
                break;
            case 3:
                color = player3[0];
                document.getElementById("infos").innerHTML = "<span class=\"c" + player3[0] + " \">" + player3[1] + "</span> ist dran.";
                break;
            case 4:
                color = player4[0];
                document.getElementById("infos").innerHTML = "<span class=\"c" + player4[0] + " \">" + player4[1] + "</span> ist dran.";
                break;
        }
}

function reset(){
    document.getElementById("layer1").style.display = "block";
    document.getElementById("layer2").style.display = "none";
}

function checkAcesent(x, y) {
    let ff1 = check(x + 1, y, color);
    if (ff1 === 1) ff1 = false;
    let ff2 = check(x + 1, y + 1, color);
    if (ff2 === 1) ff2 = false;
    let ff3 = check(x, y + 1, 0, 1, color);
    if (ff3 === 1) ff3 = false;
    let ff4 = check(x - 1, y + 1, color);
    if (ff4 === 1) ff4 = false;
    let ff5 = check(x - 1, y, color);
    if (ff5 === 1) ff5 = false;
    let ff6 = check(x - 1, y - 1, color);
    if (ff6 === 1) ff6 = false;
    let ff7 = check(x, y - 1, color);
    if (ff7 === 1) ff7 = false;
    let ff8 = check(x + 1, y - 1, color);
    if (ff8 === 1) ff8 = false;
    //console.log(ff1 + " " + ff2 + " " + ff3 + " " + ff4 + " " + ff5 + " " + ff6 + " " + ff7 + " " + ff8);
    return !(ff1 && ff2 && ff3 && ff4 && ff5 && ff6 && ff7 && ff8);
}

function reun(){
    updatePlayerTurn();
    p1 = [0, 1];
    p2 = [0, 2];
    p3 = [0, 3];
    p4 = [0, 4];
    for (let i = 1; i <= 8; i++) { //count player points
        for (let j = 1; j <= 8; j++) {
            let x = parseInt(document.getElementById("t" + i + j).classList.item(0).slice(1, 2));
            switch (x) {
                case 1:
                    p1[0]++;
                    break;
                case 2:
                    p2[0]++;
                    break;
                case 3:
                    p3[0]++;
                    break;
                case 4:
                    p4[0]++;
                    break;
            }
        }
    }
}

function undoboard(){
    clearIdiot();
    let old = save[round - 1];
    for (let i = 0; i <= 7; i++) {
        for (let j = 0; j <= 7; j++) {
            if(old[i][j] === 5) {
                document.getElementById("t" + (i + 1) + (j + 1)).innerText = "";
                document.getElementById("t" + (i + 1) + (j + 1)).classList.replace(document.getElementById("t" + (i + 1) + (j + 1)).classList.item(0), "empty");
            }
            else if(old[i][j] !== undefined){
                //console.log(i + "" + j);
                document.getElementById("t"+(i+1)+(j+1)).classList.replace(document.getElementById("t"+(i+1)+(j+1)).classList.item(0), "c" + old[i][j]);
            }
        }
    }
    round--;
    count--;
    if (count < 1){
        if(!player3)
            count = 2;
        else if(!player4)
            count = 3;
        else
            count = 4;
    }
    reun();
    if(round === 0)
        document.getElementById("un").disabled = true;
    document.getElementById("re").disabled = false;
    undid = true;
}

function redoboard(){
    let old = save[round];
    for (let i = 0; i <= 7; i++) {
        for (let j = 0; j <= 7; j++) {
            if(old[i][j] === 5)
                document.getElementById("t" + (i + 1) + (j + 1)).innerText = "O";
            if(old[i][j] !== undefined) {
                //console.log(i + "" + j);
                document.getElementById("t" + (i + 1) + (j + 1)).classList.replace(document.getElementById("t" + (i + 1) + (j + 1)).classList.item(0), "c" + color);
            }
        }
    }
    round++;
    count++;
    if (count > 4 || (count > 2 && !player3) || (count > 3 && !player4))
        count = 1;
    reun();
    if(save[round] === undefined)
        document.getElementById("re").disabled = true;
    document.getElementById("un").disabled = false;
}

function clearIdiot(){
    if (idiotenModus) {
        for (let i = 1; i <= 8; i++) {
            for (let j = 1; j <= 8; j++) {
                document.getElementById("t" + i + j).style.backgroundColor = "";
                if (document.getElementById("t" + i + j).innerText !== "O")
                    document.getElementById("t" + i + j).innerText = "";
            }
        }
    }
}

let autom = false;
let tmpinfo;

function replay(){
    replaying = true;
    tmpinfo = document.getElementById("infos").innerHTML;
    document.getElementById("infos").innerHTML = "<br><div style='display: flex'><button id='c1' class='player' onclick='cont1()'>|◀</button> <button id='c2' class='player' onclick='cont2()'><</button> <button id='c3' class='player' onclick='cont3()'>▶</button><button style='display: none' id='c4' class='player' onclick='cont4()'>❚❚</button> <button id='c5' class='player' onclick='cont5()'>></button> <button id='c6' class='player' onclick='cont6()'>▶|</button> <button id='c7' class='player' onclick='cont7()'>■</button></div>";
    document.getElementById("zruck").style.display = "none";
    cont1();
}

function cont1(){
    cont4();
    while(round>0){
        undoboard();
    }
    document.getElementById("c1").disabled = true;
    document.getElementById("c2").disabled = true;
    document.getElementById("c5").disabled = false;
    document.getElementById("c6").disabled = false;
}

function cont2(){
    cont4();
    undoboard();
    if(round === 0) {
        document.getElementById("c1").disabled = true;
        document.getElementById("c2").disabled = true;
    }
    document.getElementById("c5").disabled = false;
    document.getElementById("c6").disabled = false;
}

async function cont3() {
    //start animation
    autom = true;
    document.getElementById("c3").style.display = "none";
    document.getElementById("c4").style.display = "block";
    document.getElementById("c1").disabled = false;
    document.getElementById("c2").disabled = false;
    while (round < 60 && autom) {
        redoboard();
        await sleep(500);
    }
    if (round === 60) {
        document.getElementById("c5").disabled = true;
        document.getElementById("c6").disabled = true;
    }
    cont4();
}

function cont4(){
    //stop animation
    autom = false;
    document.getElementById("c3").style.display = "block";
    document.getElementById("c4").style.display = "none";
}

function cont5(){
    cont4();
    redoboard();
    if(round === 60) {
        document.getElementById("c5").disabled = true;
        document.getElementById("c6").disabled = true;
    }
    document.getElementById("c1").disabled = false;
    document.getElementById("c2").disabled = false;
}

function cont6(){
    cont4();
    while(round<60){
        redoboard();
    }
    document.getElementById("c1").disabled = false;
    document.getElementById("c2").disabled = false;
    document.getElementById("c5").disabled = true;
    document.getElementById("c6").disabled = true;
}

function cont7(){
    cont6();
    replaying = false;
    document.getElementById("infos").innerHTML = tmpinfo;
    document.getElementById("zruck").style.display = "block";
}

function autoplay(){
    while(round<60){
        console.log(round);
        for (let i = 1; i <= 8; i++) {
            for (let j = 1; j <= 8; j++) {
                move(document.getElementById("t"+i+j));
            }
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}