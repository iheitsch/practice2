/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var x = 0;
var nSbxs = 24;
function check() {
    var indcatr = Number(document.getElementById("indcatr").value);
    alert("check indcatr: " + indcatr);
    if( indcatr < 1 ) {
            checkRed();
    } else if( indcatr < 2 ) {
            checkOrd();
    } else if( indcatr < 3 ) {
            checkMix();
    } else if( indcatr < 4 ) {
            checkFrc();
    }
}

function checkRed() { // assumes only prime factors are 2's, 3's and 5's fixit
    var doc = document;
    var num = Number;
    
    var nums = doc.getElementsByClassName("n0");
    var cols = nums.length;
    var lastcol = cols - 1
    for( var i = 0; i < cols; ++i ) {
        if( nums[i].value !== "" ) {
           lastcol = i; 
        }
    }   
    var nBx = nums[lastcol];
    var lastn = num(nBx.value);
    var ntwos = 0;
    var nthrees = 0;
    var nfives = 0;
    var tmp = lastn;
    while( tmp%2 === 0 ) {
        ntwos = ntwos + 1;
        alert("checkRed tmp: " + tmp + " ntwos: " + ntwos);
        tmp = tmp / 2; 
    }
    while( tmp%3 === 0 ) {
        tmp = tmp / 3;
        nthrees = nthrees + 1; 
    }
    while( tmp%5 === 0 ) {
        tmp = tmp / 5;
        nfives = nfives + 1; 
    }
    var dBx = doc.getElementById("d0_" + lastcol);
    var lastd = num(dBx.value);
    alert("checkRed lastN: " + lastn + " lastD: " + lastd);
    var dtwos = 0;
    var dthrees = 0;
    var dfives = 0;
    tmp = lastd;
    while( tmp%2 === 0 ) {      
        dtwos = dtwos + 1;
        alert("checkRed tmp: " + tmp + " dtwos: " + dtwos);
        tmp = tmp / 2;
    }
    while( tmp%3 === 0 ) {
        tmp = tmp / 3;
        dthrees = dthrees + 1; 
    }
    while( tmp%5 === 0 ) {
        tmp = tmp / 5;
        dfives = dfives + 1; 
    }
    // if both numerator and denominator have > 1 of any factor, not reduced
    if( ntwos > 1 && dtwos > 1 ||
            nthrees > 1 && dthrees > 1 ||
            nfives > 1 && dfives > 1 ) {
        nBx.style.color = "red";
        dBx.style.color = "red";
    } else {
        for( var i = 0; i < cols; ++i ) {
            nums[i].style.color = "black";
            doc.getElementById("d0_" + i).style.color = "black";
        }
    }
}
function checkOrd() {
    alert("checkOrd");
}
function checkMix() {
    alert("checkMix");
}
function checkFrc() {
    alert("checkFrc");
}
function raise( ev ) {
    ev = ev || window.event;
    var num = Number;
    var doc = document;
    
    var ansBtn = ev.target;
    var rowid = ansBtn.id; //.toString();
    var len = rowid.length;
    //var tag = ansBtn.tagName;
    //alert("raise " + rowid + " tag: " + tag);
    var row = num(rowid.substring(1,len));
    var nxtRow = row - 1;
    var nums = doc.getElementsByClassName("n" + row);
    var cols = nums.length;
    var othrnums = doc.getElementsByClassName("n" + nxtRow);
    var othrcols = othrnums.length;
    if( othrcols > cols ) {
        cols = othrcols
    }
    for( var c = 0; c < cols; ++c ) {
        var thsNum = doc.getElementById("n" + row + "_" + c);
        var nxtNum = doc.getElementById("n" + nxtRow + "_" + c);
        var tmp = thsNum.value;
        thsNum.value = nxtNum.value;
        nxtNum.value = tmp;
        var thsDen = doc.getElementById("d" + row + "_" + c);
        var nxtDen = doc.getElementById("d" + nxtRow + "_" + c);
        tmp = thsDen.value;
        thsDen.value = nxtDen.value;
        nxtDen.value = tmp;
    }
}
function lower( ev ) {
    ev = ev || window.event;
    var num = Number;
    var doc = document;
    
    var ansBtn = ev.target;
    var rowid = ansBtn.id; //.toString();
    //var tag = ansBtn.tagName;
    //alert("lower " + rowid + " tag: " + tag);
    var len = rowid.length;
    var row = num(rowid.substring(1,len));
    var nxtRow = row + 1;
    var nums = doc.getElementsByClassName("n" + row);
    var cols = nums.length;
    var othrnums = doc.getElementsByClassName("n" + nxtRow);
    var othrcols = othrnums.length;
    if( othrcols > cols ) {
        cols = othrcols
    }
    for( var c = 0; c < cols; ++c ) {
        var thsNum = doc.getElementById("n" + row + "_" + c);
        var nxtNum = doc.getElementById("n" + nxtRow + "_" + c);
        var tmp = thsNum.value;
        thsNum.value = nxtNum.value;
        nxtNum.value = tmp;
        var thsDen = doc.getElementById("d" + row + "_" + c);
        var nxtDen = doc.getElementById("d" + nxtRow + "_" + c);
        tmp = thsDen.value;
        thsDen.value = nxtDen.value;
        nxtDen.value = tmp;
    }
}
function checkD( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;

        var ansBx = ev.target;
        var ans = ansBx.value;
        var id = ansBx.id;
        var tag = ansBx.tagName;
        
        var len = id.length;
        var pos = id.indexOf("_");
        var col = num(id.substr(pos+1, len));
        var row = num(id.substr(1,pos-1));

        var prevcol = col - 1;
        doc.getElementById("statusBox" + x).innerHTML = "checkD " + id + " tag: " + tag + " col: " + col + " prevcol: " + prevcol + " row: " + row;
        x = (x + 1)%nSbxs;
        var prevD = doc.getElementById("d" + row + "_" + prevcol);
        var prevN = doc.getElementById("n" + row + "_" + prevcol);
        var currN = doc.getElementById("n" + row + "_" + col);
        // for simplification, need to check that numerator and denominator
        // are the same number and previous numerator and denominator
        // are divisible by it
        var prevDV = prevD.value;
        var prevNV = prevN.value;
        if( !prevDV || !prevNV ) {
            alert("you need to enter something in previous boxes first");
            ansBx.style.color = "red";
        } else {
            var nPrevD = num(prevDV); 
            var nPrevN = num(prevNV);
            var nAns = num(ans);
            var test = doc.getElementById("indcatr").value === "0";
            //alert("checkD test: " + test);
            if( test ) {
                if( nPrevD%nAns === 0 && nPrevN%nAns === 0 ) {
                    if( !currN || currN.value === "" || num(currN.value) === nAns ) {
                        ansBx.style.color = "black";
                        if( currN ) {
                            if( currN.value ) {
                                //alert("current numerator value: " + currN.value);
                                var nextcol = col + 1;
                                var nextBx = doc.getElementById("d"+ row + "_" + nextcol);
                                nextBx.focus();
                            } else {
                                //alert("no value in current numerator");
                                currN.focus();
                            }
                        } else {
                            alert("currN doesn't exist");
                        }
                    } else {
                        alert("denominator: " + ans + " needs to be the same value as numerator: " + currN.value + " or you are changing the value of the fraction, not converting it.");
                        ansBx.style.color = "red";
                    }
                } else {
                    alert("denominator needs to evenly divide previous numerator and denominator");
                    ansBx.style.color = "red";
                }
            } else if( currN ) {
                if( currN.value ) {
                    //alert("current numerator value: " + currN.value);
                    var nextcol = col + 1;
                    var nextBx = doc.getElementById("d"+ row + "_" + nextcol);
                    nextBx.focus();
                } else {
                    //alert("no value in current numerator");
                    currN.focus();
                }
            }
        }
    }
}
function checkN( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;

        var ansBx = ev.target;
        var ans = ansBx.value;
        var id = ansBx.id;
        var tag = ansBx.tagName;
        
        var len = id.length;
        var pos = id.indexOf("_");
        var col = num(id.substr(pos+1, len));
        var row = num(id.substr(1,pos-1));

        var prevcol = col - 1;
        doc.getElementById("statusBox" + x).innerHTML = "checkN " + id + " tag: " + tag + " col: " + col + " prevcol: " + prevcol + " row: " + row;
        x = (x + 1)%nSbxs;
        var prevD = doc.getElementById("d" + row + "_" + prevcol);
        var prevN = doc.getElementById("n" + row + "_" + prevcol);
        var currD = doc.getElementById("d" + row + "_" + col);
        // for simplification, need to check that numerator and denominator
        // are the same number and previous numerator and denominator
        // are divisible by it
        var prevDV = prevD.value;
        var prevNV = prevN.value;
        if( !prevDV || !prevNV ) {
            alert("you need to enter something in previous boxes first");
            ansBx.style.color = "red";
        } else {
            var nPrevD = num(prevDV); 
            var nPrevN = num(prevNV);
            var nAns = num(ans);
            var test = doc.getElementById("indcatr").value === "0";
            //alert("checkN test: " + test);
            if( test ) {
                if ( nPrevD%nAns === 0 && nPrevN%nAns === 0 ) {
                    if( !currD || currD.value === "" || num(currD.value) === nAns ) {
                        ansBx.style.color = "black";
                        if( currD ) {
                            if( currD.value ) {
                                //alert("current denominator value: " + currD.value);
                                var nextcol = col + 1;
                                var nextBx = doc.getElementById("n" + row + "_" + nextcol);
                                nextBx.focus();
                            } else {
                                //alert("no value in current denominator");
                                currD.focus();
                            }
                        } else {
                            alert("currD doesn't exist");
                        }    
                    } else {
                        alert("numerator: " + ans + " needs to be the same value as  denominator: " + currD.value + " or you are changing the value of the fraction, not converting it.");
                        ansBx.style.color = "red";
                    }
                } else {
                    alert("numerator needs to evenly divide previous numerator and denominator");
                    ansBx.style.color = "red";
                }
            } else if( currD ) {
                if( currD.value ) {
                    //alert("current numerator value: " + currD.value);
                    var nextcol = col + 1;
                    var nextBx = doc.getElementById("d"+ row + "_" + nextcol);
                    nextBx.focus();
                } else {
                    //alert("no value in current numerator");
                    currD.focus();
                }
            }
        }
    }
}
function checkM( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;

        var ansBx = ev.target;
        var ans = ansBx.value;
        var id = ansBx.id;
        var tag = ansBx.tagName;
        
        var len = id.length;
        var pos = id.indexOf("_");
        var typ = id.substr(0,1);
        var col = num(id.substr(pos+1, len));
        var row = num(id.substr(1,pos-1));

        var prevcol = col - 1;
        var prev2col = prevcol - 1;
        doc.getElementById("statusBox" + x).innerHTML = "checkM " + id + " tag: " + tag + " col: " + col + " prevcol: " + prevcol + " row: " + row;
        x = (x + 1)%nSbxs;
        var prevD = doc.getElementById(typ + row + "_" + prevcol);
        var prev2D = doc.getElementById(typ + row + "_" + prev2col);
        // for simplification, need to check that numerator and denominator
        // are the same number and previous numerator and denominator
        // are divisible by it
        var prevDV = prevD.value;
        var prev2DV = prev2D.value;
        if( !prevDV || !prev2DV ) {
            alert("you need to enter something in previous boxes first");
            ansBx.style.color = "red";
        } else {
            var nPrevD = num(prevDV); 
            var nPrev2D = num(prev2DV);
            var nAns = num(ans);
            var indcatr = doc.getElementById("indcatr");
            var testD = indcatr.value === "0";
            var testM = indcatr.value === "1";
            //alert("checkM testD: " + testD + " testM: " + testM);
            if( testD && nPrev2D / nPrevD === nAns ||
                testM && nPrev2D * nPrevD === nAns ) {
                ansBx.style.color = "black";
                var othr = "d";
                if( typ === "d" ) {
                    othr = "n";
                }
                var nextBx = doc.getElementById(othr + row + "_" + col);
                if( nextBx.value ) {
                    var nextcol = col + 1;
                    nextBx = doc.getElementById("d" + row + "_" + nextcol);
                    var othrBx = doc.getElementById("n" + row + "_" + nextcol);
                    othrBx.type = "text";
                    nextcol = nextcol + 1;
                    othrBx = doc.getElementById("n" + row + "_" + nextcol);
                    othrBx.type = "text";
                    othrBx = doc.getElementById("d" + row + "_" + nextcol);
                    othrBx.type = "text";
                }
                nextBx.type = "text";
                nextBx.focus();
            } else {
                var whatOp = doc.getElementById("o0_1").innerHTML;
                alert(prev2DV + " " + whatOp + " " + prevDV + " is not " + ans);
                ansBx.style.color = "red";
            }
        }
    }
}
window.onload = function(){
    var doc = document;
    doc.getElementById("d0_1").focus();
};