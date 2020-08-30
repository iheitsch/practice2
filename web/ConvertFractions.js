/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*  
 * 
 * allow users to move around using up, down, left right arrows, particularly 
 * in the LCD and order exercise
 * 
 * don't expect num & den to be equal if they're red; you're replacing them fixit
 * 
 * mx > improper too many errors, separate them and have error message specific to each fixit
 * 
 * probably double and triple counting some errors fixit
 * 
 * add decimal to fraction and back exercises
 * 
 */
var x = 0;
var nSbxs = 24;
var allgood = true;
var partner = null;

function erase( ev ) {
    ev = ev || window.event;
    var ansBx = ev.target;
    if( ansBx.style.color === "red") {
        //alert("erasing");
        ansBx.style.color = "#0033cc";
        //var answer = ansBx.value;
        //var len = answer.length;
        ansBx.value = "";//answer.substring(len, len);
    }
    var local = partner;
    if( local ) {
        local.style.color = "#0033cc";
        local.value = "";
        partner = null;
    }
    //ev.preventDefault(); // this locks everything up so no input box anywhere works
    return false;
}
function check() {
    var indcatr = Number(document.getElementById("indcatr").value);
    if( indcatr < 1 ) {
        checkRed();
    } else if( indcatr < 2 ) {
        checkOrd();
    } else if( indcatr < 3 ) {
        checkMix();
    } else if( indcatr < 4 ) {
        checkFrc();
    }
    return false;
}
function checkOrd() {
    var doc = document;
    var num = Number;
    
    var lastrow = 0;
    allgood = true;
    for( var j = 0; j < 4; ++j ) { // MAXROWS = 4
        var dBx = doc.getElementById("d" + j + "_0");
        if( dBx ) {
            var dVal = num(dBx.value);
            if( dVal !== "") {
                lastrow = j;
            }
        }
    }
   //alert("checkOrd lastrow: " + lastrow);
    //var lastcol = new Array(4); // MAXROWS = 4

    var nums = doc.getElementsByClassName("n0");
    var cols = nums.length;
    var lastcol = cols - 1;
    for( var i = 0; i < cols; ++i ) {
        if( nums[i].value !== "" ) {
            lastcol = i;
        } else {
            break;
        }
    }
    var lastn = num(nums[lastcol].value);
    var lastdBx = doc.getElementById("d0_" + lastcol);
    var lastd = num(lastdBx.value);
    // what order should they be in?
    // mark it red if it's not in that spot
    var quot = new Array(4); // MAXROWS = 4
    quot[0] = lastn/lastd;
    var blkCount = 0;
    for( var j = 1; j <= lastrow; ++j ) {
        nums = doc.getElementsByClassName("n" + j);
        cols = nums.length;
        lastcol = cols - 1;
        for( var i = 0; i < cols; ++i ) {
            if( nums[i].value !== "" ) {
               lastcol = i;
            } else {
                lastn = num(nums[lastcol].value);
                lastdBx = doc.getElementById("d" + j + "_" + lastcol);
                lastd = num(lastdBx.value);
                quot[j] = lastn/lastd;
               //alert("row: " + j + " lastcol: " + lastcol + " lastn: " + lastn + " lastd: " + lastd + " quot: " + quot);
                var whatColor = "#0033cc";
                for( var k = 0; k < j; ++k ) { // inefficient but small array
                    if( quot[j] < quot[k] ) {
                        whatColor = "red";
                        allgood = false;
                        var errs = Number(doc.getElementById("errs").value);
                        doc.getElementById("errs").value = errs + 1;
                    }
                }
                nums[lastcol].style.color = whatColor;
                lastdBx.style.color = whatColor;
                if( whatColor === "#0033cc") {
                    blkCount = blkCount + 1;
                    for( var k = 0; k < lastcol; ++k ) {
                        nums[k].style.color = "#0033cc";
                        doc.getElementById("d" + j + "_" + k).style.color = "#0033cc";
                    }
                }
                break;
            }
        }
    }
    //alert("checkOrd blkCount: " + blkCount);
    // if all the others are ok, the first one must be ok also
    if( blkCount === 3 ) { // MAXROWS = 4
        nums = doc.getElementsByClassName("n0");
        var cols = nums.length;
        for( var i = 0; i < cols; ++i ) {
            if( nums[i].value !== "" ) {
                nums[i].style.color = "#0033cc";
                doc.getElementById("d0_" + i).style.color = "#0033cc";
            }
        }
        startAgain(); 
    }
   //alert("checkOrd returning false");
    return false;
}
function checkRed() { // assumes only prime factors are 2's, 3's and 5's fixit
    var doc = document;
    var num = Number;
    
    var nums = doc.getElementsByClassName("n0");
    var cols = nums.length;
    var lastcol = cols - 1;
    allgood = true;
    for( var i = 0; i < cols; ++i ) {
        if( nums[i].value !== "" ) {
           lastcol = i; 
        }
    }   
    var nBx = nums[lastcol];
    var lastn = num(nBx.value);
    
    var dBx = doc.getElementById("d0_" + lastcol);
    var lastd = num(dBx.value);
 
    if( !isRed( lastn, lastd ) ) {
        nBx.style.color = "red";
        dBx.style.color = "red";
        allgood = false;
        var errs = Number(doc.getElementById("errs").value);
        doc.getElementById("errs").value = errs + 1;
    } else {
        for( var i = 0; i < cols; ++i ) {
            nums[i].style.color = "#0033cc";
            doc.getElementById("d0_" + i).style.color = "#0033cc";
        }
        startAgain();
    }
}
function checkMix() {
    //alert("checkMix");
    var num = Number;
    var doc = document;
        
    var onum = num(doc.getElementById("onum").value);
    var oden = num(doc.getElementById("oden").value);
    var whlBx = doc.getElementById("whlprt");
    var numBx = doc.getElementById("frcnum");
    var denBx = doc.getElementById("frcden");
    var rdnBx = doc.getElementById("rednum");
    var rddBx = doc.getElementById("redden");
    var rem = onum%oden;
    var whol = Math.floor(onum/oden);
    var red = rem/oden;
    allgood = true;
    var whlVal = whlBx.value;

    if( whlVal ) {
        if( isNaN( whlVal ) ) {
            whlBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
            //doc.getElementById("statusBox" + x).innerHTML = "checkMix whole value: " + whlBx.value + " not a number";
            //x = (x + 1)%nSbxs;
        } else {
            if( num(whlVal) === whol ) {
                whlBx.style.color = "#0033cc";
                whlBx.style.borderColor = "#e9d398";
            } else {
                whlBx.style.color = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                //doc.getElementById("statusBox" + x).innerHTML = "checkMix whole value: " + whlBx.value + " not: " + whol;
                //x = (x + 1)%nSbxs;
            }
        }
    } else if( whol !== 0 ) {
        whlBx.style.borderColor = "red";
        var errs = Number(doc.getElementById("errs").value);
        doc.getElementById("errs").value = errs + 1;
        allgood = false;
        //doc.getElementById("statusBox" + x).innerHTML = "checkMix nothing in whole value";
        //x = (x + 1)%nSbxs;
    }
    whlBx = doc.getElementById("redprt");
    var whlVal = whlBx.value;
    var numnum = numBx.value;
    var dennum = denBx.value;
    var numVal = 0;
    var denVal = 0;
    var rednum = rdnBx.value;
    var redden = rddBx.value;
    
    if( whlVal ) {
        if( isNaN( whlVal ) ) {
            whlBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
            //doc.getElementById("statusBox" + x).innerHTML = "checkMix whole value redprt: " + whlBx.value + " not a number";
            //x = (x + 1)%nSbxs;
        } else {
            if( num(whlVal) === whol ) {
                whlBx.style.color = "#0033cc";
                whlBx.style.borderColor = "#e9d398";
            } else {
                whlBx.style.color = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                //doc.getElementById("statusBox" + x).innerHTML = "checkMix whole value redprt: " + whlBx.value + " not: " + whol;
                //x = (x + 1)%nSbxs;
            }
        }
    } else if( whol !== 0  && rednum ) {
        whlBx.style.borderColor = "red";
        var errs = Number(doc.getElementById("errs").value);
        doc.getElementById("errs").value = errs + 1;
        allgood = false;
        //doc.getElementById("statusBox" + x).innerHTML = "checkMix nothing in whole value";
        //x = (x + 1)%nSbxs;
    }
    // some boxes can be blank if user figured it out in her head, or it
    // equals zero, but need to make sure anything entered is correct

    if( dennum ) {
        if( !isNaN(numnum) && !isNaN(dennum) ) {
            numVal = num(numnum);
            denVal = num(dennum);
            if( numVal/denVal === rem/oden &&
                    (isRed(numVal, denVal) || (rednum && redden)) ) {
                denBx.style.color = "#0033cc";
                denBx.style.borderColor = "#e9d398";
            } else {
                denBx.style.color = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                //doc.getElementById("statusBox" + x).innerHTML = "checkMix den value: ";
                //x = (x + 1)%nSbxs;
            }
        } else {
            denBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
        }
    } else {
        if( !numnum && rem === 0 ) { // no numerator either and numerator should be 0
            denBx.style.color = "#0033cc";
            denBx.style.borderColor = "#e9d398";
        } else {
            denBx.style.borderColor = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
            //doc.getElementById("statusBox" + x).innerHTML = "checkMix no denominator";
            //x = (x + 1)%nSbxs;
        }
    }  
    if( numnum ) {
        if( !isNaN(numnum) && !isNaN(dennum) ) {
            var numVal = num(numnum);
            var denVal = num(dennum);
            // ratio is correct
            if( (dennum || rem === 0) && numVal/denVal === rem/oden &&
                    (isRed(numVal, denVal) || (rednum && redden)) ) {  
                numBx.style.color = "#0033cc";
                numBx.style.borderColor = "#e9d398";
            } else {
                numBx.style.color = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                //doc.getElementById("statusBox" + x).innerHTML = "checkMix numBx value: " + numBx.value + " not: " + rem + " and ratio not right";
                //x = (x + 1)%nSbxs;
            }
        } else {
            numBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
        }
    } else {
        if( rem === 0 ) {
            numBx.style.color = "#0033cc";
            numBx.style.borderColor = "#e9d398";
        } else {
            numBx.style.borderColor = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
            //doc.getElementById("statusBox" + x).innerHTML = "checkMix num value: not there but should be";
            //x = (x + 1)%nSbxs;
        }
    }

    if( redden ) {
        if( !isNaN(rednum) && !isNaN(redden) ) {
            var rdnVal = num(rednum);
            var rddVal = num(redden);
            if( rednum && rdnVal/rddVal === rem/oden &&
                    isRed(rdnVal, rddVal)  ) {
                rddBx.style.color = "#0033cc";
                rddBx.style.borderColor = "#e9d398";
            } else {
                rddBx.style.color = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                //doc.getElementById("statusBox" + x).innerHTML = "checkMix den value: ";
                //x = (x + 1)%nSbxs;
            }
        } else {
            rddBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
        }
    } else {
        if( !rednum && rem === 0 || isRed(numVal, denVal) ) { // no numerator either and numerator should be 0
            rddBx.style.color = "#0033cc";
            rddBx.style.borderColor = "#e9d398";
            whlBx.style.borderColor = "#e9d398";
        } else {
            rddBx.style.borderColor = "red";
            whlBx.style.borderColor = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
            //doc.getElementById("statusBox" + x).innerHTML = "checkMix no denominator";
            //x = (x + 1)%nSbxs;
        }
    }
    if( rednum ) {
        if( num(rednum) === rem ) {
            rdnBx.style.color = "#0033cc";
        } else {
            // ratio is correct 
            if( redden && num(rednum)/num(redden) === rem/oden &&
                    isRed(rdnVal, rddVal) ) { 
                rdnBx.style.color = "#0033cc";
                rdnBx.style.borderColor = "#e9d398";
                whlBx.style.borderColor = "#e9d398";
            } else {
                rdnBx.style.color = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                //doc.getElementById("statusBox" + x).innerHTML = "checkMix num value: " + rdnBx.value + " not: " + rem + " and ratio not right";
                //x = (x + 1)%nSbxs;
            }
        }
    } else {
        if( rem === 0 || isRed(numVal, denVal) ) {
            rdnBx.style.color = "#0033cc";
            rdnBx.style.borderColor = "#e9d398";
            whlBx.style.borderColor = "#e9d398";
        } else {
            rdnBx.style.borderColor = "red";
            whlBx.style.borderColor = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
            //doc.getElementById("statusBox" + x).innerHTML = "checkMix num value: not there but should be";
            //x = (x + 1)%nSbxs;
        }
    }

    // if dvsr or d0_1 are entered, are they correct?
    if( !allgood ) {
        //alert("not all good");
        doc.getElementById("chkBx").style.borderColor = "red";
        var errs = Number(doc.getElementById("errs").value);
        doc.getElementById("errs").value = errs + 1;
    } else {
        doc.getElementById("chkBx").style.borderColor = "#e9d398";
        startAgain();
    }
    return false;
}
function checkFrc() {
    var num = Number;
    var doc = document;
    
    allgood = true;
    var oden = doc.getElementById("oden").value;
    var allNums = doc.getElementsByClassName("nput");
    var len = allNums.length;

    //doc.getElementById("statusBox" + x).innerHTML = "checkFrc oden: " + oden + " allnums len: " + len;
    //x = (x + 1)%nSbxs;
    //alert("ok?");
    for( var col = 0; col < len; ++col ) {
        var id = "frcnum" + col;
        var ansBx = doc.getElementById(id);
        var ans;
        if( ansBx ) {
            ans = ansBx.value;
        } else {
            alert("input with id: " + id + " does not exist");
        }
        var prevcol = col - 1;
        var prevcolIsOdd = prevcol%2 === 1;
        var nextcol = col + 1;
        
        var prevnum;
        var prevden = "1";
        var nextnum;
        var prevnIsnum = false;
        var nPrevn = 0;
        var prevdIsnum = false;
        var nPrevd = 1;
        var done = false;
        var notans = !ans;
        if( prevcol > 2 ) {
            prevnum = doc.getElementById("frcnum" + prevcol).value;
            prevden = doc.getElementById("frcden" + prevcol).value;
            prevnIsnum = !isNaN(prevnum);
            nPrevn = prevnIsnum? num(prevnum) : 0;
            prevdIsnum = !isNaN(prevden);
            if( prevden && prevden !== "" && prevden !== "0" && !isNaN(prevden) ) {
                nPrevd = num(prevden);
            }
            //m && prevden !== "0"? num(prevden) : 1;
            var nextBx = doc.getElementById("frcnum" + nextcol);
            var nextnum = !nextBx? null : nextBx.value;
            //alert("col: " + col + " ans: " + ans + " notans: " + notans + " prevcol: " + prevcol + " prevcolIsOdd: " + prevcolIsOdd + " nPrevn: " + nPrevn + " nPrevd: " + nPrevd + " prevden: " + prevden + " prevdIsnum: " + prevdIsnum + " done: " + done + " allgood: " + allgood);
            done = prevcolIsOdd && prevnIsnum && prevdIsnum && isRed(nPrevn,nPrevd);
        }
        
        if( notans && done) {
            //alert("breaktime!");
            break;
        } else if( !isNaN(ans) ) {
            var nAns = num(ans);
            var id = ansBx.id;        

            var whlprt = doc.getElementById("whlprt").value;
            var onum = doc.getElementById("onum").value;

            // what if it's already reduced in col 3? fixit
            var prev2col = col - 2;
            var prev2Bx = doc.getElementById("frcnum" + prev2col);
            var prev2num = prev2Bx? prev2Bx.value : 0;
            //doc.getElementById("statusBox" + x).innerHTML = "col: " + col + " ans: " + ans + " prevnum: " + prevnum + " prevden: " + prevden;
            //x = (x + 1)%nSbxs;
            //alert("ok?");
            // what if it's already reduced in col 3? fixitElementById("frcnum" + prev2col);
            //var prev2den = doc.getElementById("frcden" + prev2col);
            var currden;
            if( col > 2 ) {
                currden = doc.getElementById("frcden" + col).value;
                if( !currden ) {
                    currden = 1;
                }
            }
            
            var prev2nIsnum = !isNaN(prev2num);
            var nPrev2n = prev2nIsnum? num(prev2num) : 0;
            //doc.getElementById("statusBox" + x).innerHTML = "currden: " + currden + " nPrev2n: " + nPrev2n + " nextnum: " + nextnum;
            //x = (x + 1)%nSbxs;
            //alert("ok?");
            
            if( col === 0 && ans === whlprt ||
                col === 1 && ans === oden ||
                col === 2 && ans === onum ||
                col === 3 && nAns === num(whlprt)*num(oden) + num(onum) ) {
                
                ansBx.style.color = "#0033cc";
                ansBx.style.borderColor = "#e9d398"; 
            } else if( col%2 === 0 ) {
                if( currden && !isNaN(currden) && ans !== currden) {
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    allgood = false;
                    alert("numerator: " + ans + " must be the same as denominator: " + currden);
                } else if( prevnum && prevden && prevnIsnum && prevdIsnum && 
                        (nPrevn%nAns !== 0 || nPrevd%nAns !== 0) ) {
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    allgood = false;
                    alert(ans + " must evenly divide " + prevnum + " and " + prevden);
                } else {
                    ansBx.style.color = "#0033cc";
                    ansBx.style.borderColor = "#e9d398";
                }
            } else if( col%2 === 1 ) {
                //alert("odd col");
                if( prev2num && prevnum && prev2nIsnum && prevnIsnum &&
                        nPrev2n/nPrevn !== nAns ) {
                    alert("division wrong");
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    allgood = false;
                    alert(prev2num + " divided by " + prevnum + " is not " + ans);
                } else if( currden && !isNaN(currden) && !isRed(nAns, num(currden)) &&
                        !nextnum ) {
                    alert("not reduced");
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    allgood = false;
                    alert(ans + " divided by " + currden + " is not reduced");
                } else {
                    //alert("correct");
                    ansBx.style.color = "#0033cc";
                    ansBx.style.borderColor = "#e9d398";
                }
            } else {
                ansBx.style.color = "red";
                //ansBx.style.borderColor = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                alert(ans + " is not correct numerator input " + col);
                allgood = false;
            }
        } else {
            ansBx.style.color = "red";
            ansBx.style.borderColor = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            alert(ans + " is not a number");
            allgood = false;
        }
    }
    //doc.getElementById("statusBox" + x).innerHTML = "checkFrc done with numerators ";
    //x = (x + 1)%nSbxs;
    //alert("ok?");
    var ansBx = doc.getElementById("d0_1");
    for( var i = 0; i < 2; ++i ) {
        if( ansBx.value === oden ) {
            ansBx.style.color = "#0033cc";
            ansBx.style.borderColor = "#e9d398"; 
        } else {
            ansBx.style.color = "red";
            ansBx.style.borderColor = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
        }
        
            //doc.getElementById("statusBox" + x).innerHTML = "frcden3: " + frcden3 + " frcnum4: " + frcnum4 + " frcden4: " + frcden4;
            //x = (x + 1)%nSbxs;
        ansBx = doc.getElementById("frcden3");
    }
    //alert("after checking 1st 2 denominators len: " + len);
    for( var i = 4; i < len; ++i ) {
        var id = "frcden" + i;
        ansBx = doc.getElementById(id);
        if( ansBx ) {
            ans = ansBx.value;
        } else {
            alert("input with id: " + id + " does not exist");
        }
        var ansisnum = !isNaN(ans);
        var nAns = ans && ansisnum && ans !== "0"? num(ans) : 1;
        var prev2den;
        var prev2dIsnum = false;
        var nPrev2d = 0;
        var nextcol = i + 1;
        var nextBx = doc.getElementById("frcnum" + nextcol);
        var nextnum = !nextBx? 0 : nextBx.value;
        var prevcol = i - 1;
        var prevcolIsOdd = prevcol%2 === 1;
        var prev2col = i - 2;
        var prevnum = doc.getElementById("frcnum" + prevcol).value;
        var prevden = doc.getElementById("frcden" + prevcol).value;
        var currnum = doc.getElementById("frcnum" + i).value;
        var prevnIsnum = !isNaN(prevnum);
        var nPrevn = prevnIsnum? num(prevnum) : 0;
        var prevdIsnum = !isNaN(prevden);
        var nPrevd = 1;
        if(  prevden && prevdIsnum && prevden !== "" && prevden !== "0" ) {
            nPrevd = num(prevden);
        }
        
        var    done = prevcolIsOdd && isRed(nPrevn,nPrevd);
        if( i > 4 ) {
            prev2den = doc.getElementById("frcden" + prev2col).value;
            prev2dIsnum = !isNaN(prev2den);
            nPrev2d = prev2dIsnum? num(prev2den) : 0;
        }
        //doc.getElementById("statusBox" + x).innerHTML = "i: " + i + " ans: " + ans + " prevcol: " + prevcol + " prevcolIsOdd: " + prevcolIsOdd + " nPrevn: " + nPrevn + " nPrev2d: " + prev2den + " nPrevd: " + nPrevd + " prevden: " + prevden + "prevdIsnum: " + prevdIsnum + " done: " + done + " allgood: " + allgood;
        //x = (x + 1)%nSbxs;
        //alert("ok?");
        
        if( done && !ans ) {
            //doc.getElementById("statusBox" + x).innerHTML = "i: " + i + " done and no ans";
            //x = (x + 1)%nSbxs;
            break;
        } else if( !done && !ans && 
                prev2den && prev2dIsnum && prevden && prevdIsnum && 
                nPrev2d/nPrevd !== 1 ) {
            ansBx.style.borderColor = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            alert("not done, no answer and not an implied 1");
            allgood = false;
        } else if( ans && !ansisnum ) {
            ansBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
            alert(ans + " is not a number");
        } else if( i%2 === 0 ) {
            if( prevnIsnum && prevdIsnum && 
                (nPrevn%nAns !== 0 || nPrevd%nAns !== 0) ) {
                ansBx.style.color = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                alert(ans + " needs to evenly divide " + prevnum + " and " + prevden);
            } else if( currnum && !isNaN(currnum) && ans !== currnum ) {
                ansBx.style.color = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                alert("Denominator: " + ans + " needs to equal numerator " + currnum);
            } else {
                ansBx.style.color = "#0033cc";
                ansBx.style.borderColor = "#e9d398";
            }
        } else if( i%2 === 1 ) {
            if( prev2num && prevden && prev2dIsnum && prevdIsnum &&
                nPrev2d/nPrevd !== nAns && nPrev2d/nPrevd !== 1 ) {
                ansBx.style.color = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                alert("Denominator: " + ans + " is not " + prev2den + " / " + prevden);
            } else if( currnum && !isNaN(currnum) && !isRed( num(currnum), nAns) && 
                    !nextnum ) {
                ansBx.style.color = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                alert(currnum + " / " + ans + " is not reduced");
            } else {
                ansBx.style.color = "#0033cc";
                ansBx.style.borderColor = "#e9d398";
            }
        } else {
            ansBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
        }
        //alert("i: " + i + " ans: " + ans + " done: " + done + " allgood: " + allgood);
        //x = (x + 1)%nSbxs;
    }
    //alert("after checking the rest of the denominators allgood: " + allgood);
    if( !allgood ) {
        //alert("not all good");
        doc.getElementById("chkBx").style.borderColor = "red";
        var errs = Number(doc.getElementById("errs").value);
        doc.getElementById("errs").value = errs + 1;
    } else {
        doc.getElementById("chkBx").style.borderColor = "#e9d398";
        startAgain();
    }
}
function move( ev ) {
    ev = ev || window.event;
    var num = Number;
    var doc = document;
    var getStyle = getComputedStyle;
    
    var ansBtn = ev.target;
    var rowid = ansBtn.id; //.toString();
    var len = rowid.length;
    //var tag = ansBtn.tagName;
    //alert("raise " + rowid + " tag: " + tag);
    var row = num(rowid.substring(1,len));
    var dir = rowid.substring(0,1);
    var nxtRow = dir === "u"? row - 1 : row + 1;
    var nums = doc.getElementsByClassName("n" + row);
    var cols = nums.length;
    
    for( var c = 0; c < cols; ++c ) {
        var thsNum = doc.getElementById("n" + row + "_" + c);
        var nxtNum = doc.getElementById("n" + nxtRow + "_" + c);
        var tmpn = thsNum.value;
        var nxtVal = nxtNum.value;
        if( tmpn || nxtVal ) {
            var thsDen = doc.getElementById("d" + row + "_" + c);

            var nxtClr = getStyle(nxtNum).getPropertyValue("color");
            var nxtDen = doc.getElementById("d" + nxtRow + "_" + c);
        
            var tmpClr = getStyle(thsNum).getPropertyValue("color");;
            var tmpd = thsDen.value;
            
            //doc.getElementById("statusBox" + x).innerHTML = "raise thsNum: " + thsNum.value + " thsClr: " + thsClr + " thsDen: " + thsDen.value;
            //x = (x + 1)%nSbxs;
            //doc.getElementById("statusBox" + x).innerHTML = "raise nxtNum: " + nxtNum.value + " nxtClr: " + nxtClr + " nxtDen: " + nxtDen.value;
            //x = (x + 1)%nSbxs;

            thsNum.value = nxtVal;
            thsNum.style.color = nxtClr;
            thsNum.type = "text";
            var rthere = doc.getElementById("o" + row + "_" + c);
            if( rthere ) {
                rthere.innerHTML = "&times";
                doc.getElementById("e" + row + "_" + c).innerHTML = "=";
                var par = thsNum.parentNode;
                par.style.borderBottom = "2px solid #005511";
                var par = nxtNum.parentNode;
                par.style.borderBottom = "2px solid #005511";
            }

            thsDen.value = nxtDen.value;
            thsDen.style.color = nxtClr;
            thsDen.type = "text";

            nxtNum.value = tmpn;
            nxtNum.style.color = tmpClr;
            nxtNum.type = "text";

            nxtDen.value = tmpd;
            nxtDen.style.color = tmpClr;
            nxtDen.type = "text";
        }
    }
}
function checkMprN( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;

        var ansBx = ev.target;
        var ans = ansBx.value;
        if( !isNaN( ans ) ) {
            var id = ansBx.id;

            var col = num(id.substring(6,7));
            var nextCol = col + 1;
            var nextBx = ansBx; // for now
            var whlprt = doc.getElementById("whlprt").value;
            var oden = doc.getElementById("oden").value;
            var onum = doc.getElementById("onum").value;

            var nAns = num(ans);
            if( col === 0 && ans === whlprt ||
                col === 1 && ans === oden ||
                col === 2 && ans === onum ||
                col === 3 && num(ans) === num(whlprt)*num(oden) + num(onum) ) { 
                ansBx.style.color = "#0033cc";
                ansBx.style.borderColor = "#e9d398";
                nextBx = doc.getElementById("frcnum" + nextCol);
                if( col === 3 ) {
                    nextBx = doc.getElementById("frcden" + col);
                }
            } else if( col > 3 && col%2 === 0 ) {
                /* col === 4 && (!frcden4 || (!isNaN(frcden4) && ans === frcden4)) &&
                !isNaN(frcnum3) && !isNaN(frcden3) &&
                num(frcnum3)%nAns === 0 && num(frcden3)%nAns === 0 */
                
                var prevCol = col - 1;
                var prevNum = doc.getElementById("frcnum" + prevCol).value;
                var prevDen = doc.getElementById("frcden" + prevCol).value;
                var thisDen = doc.getElementById("frcden" + col).value;
                if( (thisDen && isNaN(thisDen)) || isNaN(prevNum) || isNaN(prevDen) ) {
                    alert("Fix one or all of the following previous bad entries first: " + prevNum + ", " + prevDen + ", " + thisDen);
                } else if( thisDen && ans !== thisDen ) {
                    ansBx.style.color = "red";
                    alert("Numerator: " + ans + " needs to be the same value as denominator: " + thisDen + " or you are changing the value of the fraction, not converting it.");
                    allgood = false;
                } else if( num(prevNum)%nAns !== 0 || num(prevDen)%nAns !== 0 ) { // not catching. fixit
                    ansBx.style.color = "red";
                    alert(ans + " needs to evenly divide " + prevNum + " and " + prevDen);
                    allgood = false;
                } else {
                    ansBx.style.color = "#0033cc";
                    ansBx.style.borderColor = "#e9d398";
                    nextBx = doc.getElementById("frcden" + col);
                    if( nextBx.value ) {
                        nextBx = doc.getElementById("frcnum" + nextCol);
                    }
                }
            } else if( col > 3 && col%2 === 1 ) {
                /* col === 5 && frcnum3 && frcnum4 && !isNaN(frcnum3) && !isNaN(frcnum4) &&
                num(frcnum3)/num(frcnum4) === nAns ) { */
                var prevCol = col - 1;
                var prevNum = doc.getElementById("frcnum" + prevCol).value;
                var prev2col = col - 2;
                var prev2Num = doc.getElementById("frcnum" + prev2col).value;
                if( !prevNum || !prev2Num || isNaN(prevNum) || isNaN(prev2Num) ) {
                    alert("Fix one or all of the following previous bad entries first: " + prevNum + ", " + prev2Num);
                } else if( num(prev2Num)/num(prevNum) !== nAns ) {
                    ansBx.style.color = "red";
                    alert(prev2Num + " divided by " + prevNum + " is not " + ans);
                    allgood = false;
                } else {
                    ansBx.style.color = "#0033cc";
                    ansBx.style.borderColor = "#e9d398"; 
                    var p = "frcden" + col;
                    nextBx = doc.getElementById(p);
                    //doc.getElementById("statusBox" + x).innerHTML ="nextBx: " + p + " value: " + nextBx.value;
                    //x = (x + 1)%nSbxs;
                    if( nextBx.value ) {
                        var nextcol = col + 1;
                        nextBx = doc.getElementById("frcden" + nextcol);
                        nextBx.type = "text";
                        var othrBx = doc.getElementById("frcnum" + nextcol);
                        othrBx.type = "text";
                        var par = othrBx.parentNode;
                        par.style.borderBottom = "2px solid #005511";
                        //doc.getElementById("statusBox" + x).innerHTML = "checkMpr: e/o" + nextcol;
                        //x = (x + 1)%nSbxs;
                        doc.getElementById("e" + nextcol).innerHTML = "=";
                        doc.getElementById("o" + nextcol).innerHTML ="&divide";
                        nextcol = nextcol + 1;
                        othrBx = doc.getElementById("frcnum" + nextcol);
                        othrBx.type = "text"; 
                        var par = othrBx.parentNode;
                        par.style.borderBottom = "2px solid #005511";
                        othrBx = doc.getElementById("frcden" + nextcol);
                        othrBx.type = "text";  
                    } 
                }
            } else { // one of 1st 4 numerators was wrong
                ansBx.style.color = "red";
                ansBx.style.borderColor = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
            }
            nextBx.focus();
        } else {
            ansBx.style.color = "red";
            ansBx.style.borderColor = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            alert(ans + " is not a number");
        }
        return false;
    }    
}
function checkMprD( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var doc = document;
        var num = Number;

        var ansBx = ev.target;
        var ans = ansBx.value;
        var id = ansBx.id;
        var len = id.length;
        var col = num(id.substring(len-1, len));
        var nextcol = col + 1;
        var nextBx = ansBx;
        //doc.getElementById("statusBox" + x).innerHTML = "checkMprD ans: " + ans + " id: " + id + " col: " + col;
        //x = (x + 1)%nSbxs;
        if( !isNaN(ans) ) {
            var oden = doc.getElementById("oden").value;
            if( ans && col < 4 && ans === oden ) {
                //doc.getElementById("statusBox" + x).innerHTML = "checkMprD col < 5 and ans = oden block";
                //x = (x + 1)%nSbxs;
                ansBx.style.color = "#0033cc";
                ansBx.style.borderColor = "#e9d398"; 
                if( id === "d0_1") {
                    nextBx = doc.getElementById("frcnum0");
                } else {
                    nextBx = doc.getElementById("frcnum4");
                }
            } else if( col%2 === 0 && col > 3 ) { // used to be col === 4
                //doc.getElementById("statusBox" + x).innerHTML = "checkMprD col = 5 block";
                //x = (x + 1)%nSbxs;
                var lastcol = col - 1;
                var prevN = doc.getElementById("frcnum" + lastcol).value;
                var prevD = doc.getElementById("frcden" + lastcol).value;
                if( prevN && prevD && !isNaN(prevN) && !isNaN(prevD)) {
                    var nVal = num(prevN);
                    var dVal = num(prevD);
                    var aVal = num(ans);
                    var thisN = doc.getElementById("frcnum" + col).value;
                    if( nVal%aVal === 0 && dVal%aVal === 0 && 
                                (!thisN || !isNaN(thisN) && ans === thisN ) ) {
                        ansBx.style.color = "#0033cc";
                        ansBx.style.borderColor = "#e9d398"; 
                        nextBx = !thisN? doc.getElementById("frcnum" + col) : doc.getElementById("frcnum" + nextcol);
                    } else {
                        ansBx.style.color = "red";
                        ansBx.style.borderColor = "red"; 
                        var errs = Number(doc.getElementById("errs").value);
                        doc.getElementById("errs").value = errs + 1;
                        alert(ans + " does not evenly divide " + prevN + " and " + prevD + " or " + ans + " is not equal to " + thisN);
                    }
                } else {
                    ansBx.style.color = "red";
                    ansBx.style.borderColor = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert("fill in previous numerator and denominator first");
                }
            } else if( col%2 === 1 && col > 3) { // used to be 5
                //doc.getElementById("statusBox" + x).innerHTML = "checkMprD col = " + col + " block";
                //x = (x + 1)%nSbxs;
                var prev2col = col - 2;
                var prevcol = col - 1;
                
                var prev2D = doc.getElementById("frcden" + prev2col).value;
                var prevD = doc.getElementById("frcden" + prevcol).value;
                var thisNid = "frcnum" + col;
                var thisNum = doc.getElementById(thisNid);
                var currN = thisNum.value;
                var currNisnum = !isNaN(currN);
                var nCurrN = currNisnum? num(currN) : 0;
                var nAns = num(ans);
                if( prev2D && prevD &&
                    !isNaN(prev2D)&& !isNaN(prevD) &&
                    num(prev2D)/num(prevD) === nAns ) {
                        //&&
                    //(!currN || (currNisnum && isRed(nCurrN,nAns)))) { at what point do you want to check for reduced?
                    // here? check if frcnum4 = frnden4 is gcd? or leave it to final check? fixit
                    // what if user skips intermediate and just puts reduced value?
                    ansBx.style.color = "#0033cc";
                    ansBx.style.borderColor = "#e9d398";
                    if( !currN ) {
                        nextBx = thisNum;
                        nextBx.type = "text";
                        var par = thisNum.parentNode;
                        //doc.getElementById("statusBox" + x).innerHTML = "checkMprD col = " + col + " thisNum id: " + thisNum.id + " ?= " + thisNid;
                        //x = (x + 1)%nSbxs;
                        par.style.borderBottom = "2px solid #005511";
                        
                        doc.getElementById("e" + nextcol).innerHTML = "=";
                        doc.getElementById("o" + nextcol).innerHTML ="&divide";
                        nextcol = nextcol + 1;
                        var othrBx = doc.getElementById("frcnum" + nextcol);
                        othrBx.type = "text"; 
                        var par = othrBx.parentNode;
                        par.style.borderBottom = "2px solid #005511";
                        othrBx = doc.getElementById("frcden" + nextcol);
                        othrBx.type = "text";  
                    } else {
                        var nextId = "frcnum" + nextcol;
                        nextBx = doc.getElementById(nextId);
                        nextBx.type = "text";
                        var par = nextBx.parentNode;
                        //doc.getElementById("statusBox" + x).innerHTML = "checkMprD col = " + col + " nextBx id: " + nextBx.id + " =? " + nextId;
                        //x = (x + 1)%nSbxs;
                        par.style.borderBottom = "2px solid #005511";
                        var othrBx = doc.getElementById("frcden" + nextcol);
                        othrBx.type = "text"; 
                        doc.getElementById("e" + nextcol).innerHTML = "=";
                        doc.getElementById("o" + nextcol).innerHTML ="&divide";
                        nextcol = nextcol + 1;
                        //doc.getElementById("statusBox" + x).innerHTML = "checkMprD col = " + col + " after e/o, nextcol: " + nextcol;
                        //x = (x + 1)%nSbxs;
                        othrBx = doc.getElementById("frcnum" + nextcol);
                        othrBx.type = "text"; 
                        var par = othrBx.parentNode;
                        par.style.borderBottom = "2px solid #005511";
                        othrBx = doc.getElementById("frcden" + nextcol);
                        othrBx.type = "text"; 
                    }
                } else {
                    ansBx.style.color = "red";
                    ansBx.style.borderColor = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    //alert(ans + " is not " + prev2D + " divided by " + prevD);
                }
            } else { //one of 1st 2 denominators was wrong
                //doc.getElementById("statusBox" + x).innerHTML = "1st 2 denominators wrong block";
                //x = (x + 1)%nSbxs;
                ansBx.style.color = "red";
                ansBx.style.borderColor = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                alert("col: " + col + " ans: " + ans + " should be the same as the first denominator: " + oden);
            }
            nextBx.focus();
        } else {
            ansBx.style.color = "red";
            ansBx.style.borderColor = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            alert(ans + " is not a number");
        }
       return false;
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
        
        var len = id.length;
        var pos = id.indexOf("_");
        var col = num(id.substr(pos+1, len));
        var row = num(id.substr(1,pos-1));

        var prevcol = col - 1;

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
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
        } else {
            var nPrevD = num(prevDV); 
            var nPrevN = num(prevNV);
            var nAns = num(ans);
            var test = doc.getElementById("indcatr").value === "0";
            //alert("checkD test: " + test + " ans: " + ans + " prevDV: " + prevDV + " prevNV: " + prevNV + " id: " + id);
            if( test ) { // simplifying
                if( nPrevD%nAns === 0 && nPrevN%nAns === 0 ) {
                    if( !currN || currN.value === "" || num(currN.value) === nAns ) {
                        ansBx.style.color = "#0033cc";
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
                            alert("numerator input doesn't exist");
                        }
                    } else {
                        alert("denominator: " + ans + " needs to be the same value as numerator: " + currN.value + " or you are changing the value of the fraction, not converting it.");
                        ansBx.style.color = "red";
                        var errs = Number(doc.getElementById("errs").value);
                        doc.getElementById("errs").value = errs + 1;
                    }
                } else {
                    alert("denominator needs to evenly divide previous numerator and denominator");
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                }
            } else if( currN ) { // finding LCM and putting in order
                var currnVal = currN.value;
                if( currnVal ) {
                    if( ans !== currnVal ) {
                        ansBx.style.color = "red";
                        var errs = Number(doc.getElementById("errs").value);
                        doc.getElementById("errs").value = errs + 1;
                    } else {
                        ansBx.style.color = "#0033cc";
                        var nextcol = col + 1;
                        var nextBx = doc.getElementById("d"+ row + "_" + nextcol);
                        nextBx.focus();
                    }
                } else {
                    //alert("no value in current numerator");
                    currN.focus();
                }
            }
        }
        //alert("checkD about to//return false");
         return false;
    }
}
function checkFrcD( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;
        
        var ansBx = ev.target;
        var ans = ansBx.value;
        var onum = num(doc.getElementById("onum").value);
        var oden = num(doc.getElementById("oden").value);
        var id = ansBx.id;
        var numBx = id === "frcden"? doc.getElementById("frcnum"):
                doc.getElementById("rednum");
        var frcnum = numBx.value;
        var rem = onum%oden;
        if( isNaN(ans) ) {
            ansBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
        } else {
            var nans = num(ans);
            if( frcnum &&  !isNaN(frcnum) ) {
                if( num(frcnum)/nans !== rem/oden ) {
                    ansBx.style.color = "red";
                    numBx.style.color = "red";
                    partner = ansBx;
                    numBx.focus();
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert(frcnum + "/" + nans + " needs to equal " + rem + "/" + oden);
                } else if ( id !== "frcden" && !isRed(frcnum, nans) ) {
                    ansBx.style.color = "red";
                    numBx.style.color = "red";
                    partner = ansBx;
                    numBx.focus();
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert(frcnum + "/" + nans + " is not reduced");
                } else {
                    ansBx.style.color = "#0033cc";
                    if( id === "frcden" ) {
                        doc.getElementById("redprt").focus();
                    } else {
                        doc.activeElement.blur();
                    }
                }
            } else if( id === "frcden" ) {
                if( nans === oden ) { // check id, if redNum, must be reduced
                    ansBx.style.color = "#0033cc";
                    doc.getElementById("redprt").focus();
                } else {
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert(nans + " needs to be " + oden);
                }
            } else {
               numBx.focus();
            }
        }
        return false;
    }
}
function isRed( n, d ) {
    var ntwos = 0;
    var nthrees = 0;
    var nfives = 0;
    while( n%2 === 0 ) {
        ntwos = ntwos + 1;
        n = n / 2; 
    }
    while( n%3 === 0 ) {
        nthrees = nthrees + 1;
        n = n / 3; 
    }
    while( n%5 === 0 ) {
        nfives = nfives + 1; 
        n = n / 5;
    }
    var dtwos = 0;
    var dthrees = 0;
    var dfives = 0;
    while( d%2 === 0 ) {      
        dtwos = dtwos + 1;
        d = d / 2;
    }
    while( d%3 === 0 ) {
        dthrees = dthrees + 1; 
        d = d / 3;
    }
    while( d%5 === 0 ) {
        dfives = dfives + 1;
        d = d / 5;
    }
    // if both numerator and denominator have > 1 of any factor, not reduced
    if( ntwos > 0 && dtwos > 0 ||
            nthrees > 0 && dthrees > 0 ||
            nfives > 0 && dfives > 0 ) {
        return false;
    } else {
        return true;
    }
}
// doesnt check first numerator fixit
function checkFrcN( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;
        
        var ansBx = ev.target;
        var ans = ansBx.value;
        var onum = num(doc.getElementById("onum").value);
        var oden = num(doc.getElementById("oden").value);
        var id = ansBx.id;
        var denBx = id === "frcnum"? doc.getElementById("frcden") :
                doc.getElementById("redden");
        var frcden = denBx.value;
        var rem = num(onum)%num(oden);
        //doc.getElementById("statusBox" + x).innerHTML = "checkFrcN ans: " + ans + " onum: " + onum + " oden: " + oden + " frcden: " + frcden + " rem: " + rem;
        //x = (x + 1)%nSbxs;
        if( isNaN(ans) ) {
            ansBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            //doc.getElementById("statusBox" + x).innerHTML = "checkFrcN ans: " + ans + " is NaN";
        } else {
            var nans = num(ans);
            var id = ansBx.id;
            if( frcden && !isNaN(frcden) ) {
                if( nans/num(frcden) !== rem/num(oden) ) {
                    ansBx.style.color = "red";
                    denBx.style.color = "red";
                    partner = denBx;
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert(nans + "/" + frcden + " needs to equal " + rem + "/" + oden);
                } else if ( id !== "frcnum" && !isRed(nans, frcden) ) {
                    ansBx.style.color = "red";
                    denBx.style.color = "red";
                    partner = denBx;
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert(nans + "/" + frcden + " is not reduced");
                } else {
                    ansBx.style.color = "#0033cc";
                    if( id === "frcnum" ) {
                        doc.getElementById("redprt").focus();
                    } else {
                        doc.activeElement.blur();
                    }
                }
            } else if( id === "frcnum" ) {
                if( nans === rem ) {
                    ansBx.style.color = "#0033cc";
                    denBx.focus();
                } else {
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert(nans + " needs to be " + rem);
                    //doc.getElementById("statusBox" + x).innerHTML = "checkFrcN id: " + id + " oden: " + oden + " frcden: " + frcden + " rem: " + rem;
                    //x = (x + 1)%nSbxs;
                }
            } else {
                denBx.focus();
            }
        }
       return false;
    }
}
function checkDiff( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;
                
        var ansBx = ev.target;
        var ans = ansBx.value;
        if( !isNaN( ans )) {
            var ansVal = num(ans);
            var dvdnd = num(doc.getElementById("d0_1").value);
            var prod = num(doc.getElementById("prod").value);
            if( ansVal === dvdnd - prod ) {
                ansBx.style.color = "#0033cc";
                doc.getElementById("frcnum").focus();
            } else {
                ansBx.style.color = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
            }
        } else {
            ansBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
        }
       return false;
    }
}
function checkProd( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;
                
        var ansBx = ev.target;
        var ans = ansBx.value;
        if( !isNaN( ans )) {
            var ansVal = num(ans);
            var dvsr = num(doc.getElementById("dvsr").value);
            var whlprt = num(doc.getElementById("whlprt").value);
            if( ansVal === dvsr*whlprt ) {
                ansBx.style.color = "#0033cc";
                doc.getElementById("diff").focus();
            } else {
                ansBx.style.color = "red";
            }
        } else {
            ansBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
        }
       return false;
    }
}
function checkWhl( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;
        
        var ansBx = ev.target;
        var ans = ansBx.value;
        var oden = num(doc.getElementById("oden").value);
        var onum = num(doc.getElementById("onum").value);
        if( ans && !isNaN(ans) && Math.floor(onum/oden) === num(ans) ) {
            ansBx.style.color = "#0033cc";
            var nextBx = ansBx.id === "whlprt" ? doc.getElementById("prod") : doc.getElementById("rednum");
            nextBx.focus();
        } else {
            ansBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
        }
        return false;
    }
}
function checkDen( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;
        
        var ansBx = ev.target;
        var ans = ansBx.value;
        
        if( ans === doc.getElementById("oden").value ) {
            ansBx.style.color = "#0033cc";
            doc.getElementById("whlprt").focus();
        } else {
            ansBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
        }
        return false;
    }
}
function checkNum( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;
        
        var ansBx = ev.target;
        var ans = ansBx.value;
        
        if( ans === doc.getElementById("onum").value ) {
            ansBx.style.color = "#0033cc";
            doc.getElementById("dvsr").focus();
        } else {
            ansBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
        }
        //ev.preventDefault();
        return false;
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
        
        var len = id.length;
        var pos = id.indexOf("_");
        var col = num(id.substr(pos+1, len));
        var row = num(id.substr(1,pos-1));

        var prevcol = col - 1;

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
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
        } else {
            var nPrevD = num(prevDV); 
            var nPrevN = num(prevNV);
            var nAns = num(ans);
            var test = doc.getElementById("indcatr").value === "0";
            //alert("checkN test: " + test);
            if( test ) { // simplifying
                if ( nPrevD%nAns === 0 && nPrevN%nAns === 0 ) {
                    if( !currD || currD.value === "" || num(currD.value) === nAns ) {
                        ansBx.style.color = "#0033cc";
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
                            alert("denominator input doesn't exist");
                        }    
                    } else {
                        alert("numerator: " + ans + " needs to be the same value as  denominator: " + currD.value + " or you are changing the value of the fraction, not converting it.");
                        ansBx.style.color = "red";
                        var errs = Number(doc.getElementById("errs").value);
                        doc.getElementById("errs").value = errs + 1;
                    }
                } else {
                    alert("numerator needs to evenly divide previous numerator and denominator");
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                }
            } else if( currD ) { // finding LCD and putting in order
                var currdVal = currD.value;
                if( currdVal ) {
                    if( ans !== currdVal ) {
                        ansBx.style.color = "red";
                        var errs = Number(doc.getElementById("errs").value);
                        doc.getElementById("errs").value = errs + 1;
                    } else {
                        ansBx.style.color = "#0033cc";
                        var nextcol = col + 1;
                        var nextBx = doc.getElementById("d"+ row + "_" + nextcol);
                        nextBx.focus();
                    }
                } else {
                    //alert("no value in current numerator");
                    currD.focus();
                }
            }
        }
        return false;
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
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
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
                ansBx.style.color = "#0033cc";
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
                    var par = othrBx.parentNode;
                    par.style.borderBottom = "2px solid #005511";
                    //doc.getElementById("statusBox" + x).innerHTML = "checkM: e/o" + row + "_" + nextcol;
                    //x = (x + 1)%nSbxs;
                    doc.getElementById("e" + row + "_" + nextcol).innerHTML = "=";
                    doc.getElementById("o" + row + "_" + nextcol).innerHTML = testD? "&divide" : "&times";
                    nextcol = nextcol + 1;
                    othrBx = doc.getElementById("n" + row + "_" + nextcol);
                    othrBx.type = "text"; 
                    var par = othrBx.parentNode;
                    par.style.borderBottom = "2px solid #005511";
                    othrBx = doc.getElementById("d" + row + "_" + nextcol);
                    othrBx.type = "text";  
                }
                nextBx.type = "text";
                nextBx.focus();
            } else {
                var whatOp = doc.getElementById("o0_1").innerHTML;
                alert(prev2DV + " " + whatOp + " " + prevDV + " is not " + ans);
                ansBx.style.color = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
            }
        }
        return false;
    }
}
function startAgain() {
    var doc = document;
    var Num = Number;
    
    var errCt = Num(doc.getElementById("errs").value);
    var numAttmptd = Num(doc.getElementById("numAttmptd").value);
    var numWoErr = Num(doc.getElementById("numWoErr").value);
    var consWoErr = Num(doc.getElementById("consWoErr").value);

    // update problem counts
    doc.getElementById("numAttmptd").value = numAttmptd + 1;
    if( errCt === 0 ) {
            doc.getElementById("numWoErr").value = numWoErr + 1;    
            doc.getElementById("consWoErr").value = consWoErr + 1;
    } else {
        doc.getElementById("consWoErr").value = '0';
    }
    
    var jstime = Num(Date.now());
    var jatime = Num(doc.getElementById("strtTime").value);
    var timediff = jstime - jatime;
    if( timediff === 0 ) {
        doc.getElementById("corrPerHr").value = 0;
    } else {
        doc.getElementById("corrPerHr").value = 
        Math.floor(3600000*Num(doc.getElementById("numWoErr").value)/timediff);
    }

    if( allgood ) {
        alert("all good");
        doc.getElementById('th-id2').submit();
        return false;
    }
}
window.onload = function(){
    var doc = document;
    var strtBx = doc.getElementById("d0_1");
    if( strtBx ) {
        strtBx.focus();
    }
};