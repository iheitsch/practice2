/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*  
 * 
 * don't expect num & den to be equal if they're red; you're replacing them fixit
 * 
 * mx > improper too many errors, separate them and have error message specific to each fixit
 * 
 * probably double and triple counting some errors fixit
 * 
 * add decimal to fraction and back, percent exercises fixit
 * 
 * arrows only work for 1st two types of problems. is it possible or usefule to 
 * make them work for other types of problems? fixit
 * 
 * MIxed Number to Fraction doesn't check everything when you click 'Done' fixit
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

    var nums; // = doc.getElementsByClassName("n0");
    var cols; // = nums.length;
    var lastn;
    var lastdBx;
    var lastd;

    // what order should they be in?
    // mark it red if it's not in that spot
    var quot = new Array(4); // MAXROWS = 4
    var lastcol = new Array(4);
    var blkCount = 0;
    for( var j = 0; j <= lastrow; ++j ) {
        nums = doc.getElementsByClassName("n" + j);
        cols = nums.length;
        lastcol[j] = cols - 1;
        for( var i = 0; i < cols; ++i ) {
            if( nums[i].value !== "" ) {
               lastcol[j] = i;
            } else {
                lastn = num(nums[lastcol[j]].value);
                lastdBx = doc.getElementById("d" + j + "_" + lastcol[j]);
                lastd = num(lastdBx.value);
                quot[j] = lastn/lastd;
            }
        }
    }
    for( j = 0; j < lastrow; ++j ) {
        for( var k = j+1; k <= lastrow; ++k ) { // inefficient but small array
            if( quot[j] > quot[k] ) {
                var tmp = quot[j];
                quot[j] = quot[k];
                quot[k] = tmp;
            }
        }
    }
    for( var j = 0; j <= lastrow; ++j ) {
        nums = doc.getElementsByClassName("n" + j);
        lastn = num(nums[lastcol[j]].value);
        lastdBx = doc.getElementById("d" + j + "_" + lastcol[j]);
        lastd = num(lastdBx.value);
        var qt = lastn/lastd;
        var frstn = num(doc.getElementById("n" + j + "_0").value );
        var frstd = num(doc.getElementById("d" + j + "_0").value );
        //alert("row: " + j + " lastcol: " + lastcol[j] + " lastn: " + lastn + " lastd: " + lastd + " qt: " + qt + " quot: " + quot[j]);
        if( qt !== quot[j] || frstn/frstd !== quot[j] ) {
            nums[lastcol[j]].style.color = "red";
            lastdBx.style.color = "red";
            allgood = false;
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
        } else {
            nums[lastcol[j]].style.color = "#0033cc";
            lastdBx.style.color = "#0033cc";
            blkCount = blkCount + 1;
        }
    }
    //alert("blkCount: " + blkCount);
    if( blkCount === 4 ) { // MAXROWS = 4
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
    if( !lastd ) {
        lastd = 1;
    }
    var frstn = num(doc.getElementById("n0_0").value);
    var frstd = num(doc.getElementById("d0_0").value);
    var rdfrac = reduce( lastn, lastd );
    if( lastn !== rdfrac.n &&  lastd !== rdfrac.d ) {
        var errm = lastn + " over " + lastd + " is not reduced";
        alert(errm);
        nBx.style.color = "red";
        dBx.style.color = "red";
        allgood = false;
        var errs = Number(doc.getElementById("errs").value);
        doc.getElementById("errs").value = errs + 1;
    } else if( lastn/lastd !== frstn/frstd ) {
        var errm = lastn + " / " + lastd + " does not equal " + frstn + " / " + frstd;
        alert(errm);
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
    var num = Number;
    var doc = document;
        
    var onum = num(doc.getElementById("onum").value);
    var oden = num(doc.getElementById("oden").value);
    var whlBx = doc.getElementById("n0_1");
    var numBx = doc.getElementById("n0_2");
    var denBx = doc.getElementById("d0_2");
    var rdnBx = doc.getElementById("n0_4");
    var rddBx = doc.getElementById("d0_4");
    var rem = onum%oden;
    var rdfrac = reduce(rem, oden);
    var whol = Math.floor(onum/oden);
    var frcn = rem/oden;
    allgood = true;
    var whlVal = whlBx.value;

    if( whlVal ) { // initial whole value
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
    whlBx = doc.getElementById("n0_3");
    var whlVal = whlBx.value;
    var numnum = numBx.value;
    var dennum = denBx.value;
    var numVal = 0;
    var denVal = 1;
    var rednum = rdnBx.value;
    var redden = rddBx.value;
    var rdnVal = 0;
    var rddVal = 1;
    
    if( whlVal ) { // last whole value that goes with reduced fraction
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
    if( dennum ) { // initial, posibly unreduced denominator, string variable
        if( !isNaN(numnum) && !isNaN(dennum) ) {
            numVal = num(numnum);
            denVal = num(dennum);
            
            if( numVal/denVal === frcn &&
                    ( (numVal === rdfrac.n && denVal === rdfrac.d) || rednum ) ) {
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
        // no numerator either and numerator should be 0
        if( (!numnum || (!isNaN(numnum) && num(numnum) === 0)) && rem === 0 ) { 
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

    if( numnum ) { // initial numerator
        if( !isNaN(numnum) ) {
            numVal = num(numnum);
            if( dennum && !isNaN(dennum) ) {
                 denVal = num(dennum);
            }
             
            // ratio is correct, ratio is reduced or there is an entry for reduced value
            //var rdfrac = reduce(numVal, denVal);
            if( numVal/denVal === frcn &&
                    ((numVal === rdfrac.n && denVal === rdfrac.d) || rednum ) ) {  
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

    if( redden ) { // final reduced denominator
        if( !isNaN(rednum) && !isNaN(redden) ) {
            var rdnVal = num(rednum);
            var rddVal = num(redden);
            //var rdfrac = reduce(rdnVal, rddVal);
            if( rednum && rdnVal/rddVal === frcn &&
                    rdnVal === rdfrac.n && rddVal === rdfrac.d ) {
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
        //var rdfrac = reduce(numVal, denVal);
        // this had isNan and never was caught. does it ever execute? fixit
        if( ((!rednum || (!isNaN(rednum && num(rednum) === 0 ))) && rem === 0 ) || 
                (numVal === rdfrac.n && denVal === rdfrac.d) ) { // no numerator either and numerator should be 0
            rddBx.style.color = "#0033cc";                    // or original fraction was reduced
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

    if( rednum && !isNaN(rednum) ) {
            rdnVal = num(rednum);
            if( redden && !isNaN(redden) ) {
                rddVal = num(redden);
            }
        // ratio is correct and reduced
        //var rdfrac = reduce(rdnVal, rddVal);
        if( rdnVal/rddVal === frcn && rdnVal === rdfrac.n && rddVal === rdfrac.d ) { 
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
    } else {
        //var rdfrac = reduce(numVal, denVal);
        if( rem === 0 || (numVal === rdfrac.n && denVal === rdfrac.d ) ) {
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
    //alert("2nd numerator done");
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
        var id = "n0_" + col;
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
            prevnum = doc.getElementById("n0_" + prevcol).value;
            prevden = doc.getElementById("d0_" + prevcol).value;
            prevnIsnum = !isNaN(prevnum);
            nPrevn = prevnIsnum? num(prevnum) : 0;
            prevdIsnum = !isNaN(prevden);
            if( prevden && prevden !== "" && prevden !== "0" && !isNaN(prevden) ) {
                nPrevd = num(prevden);
            }
            //m && prevden !== "0"? num(prevden) : 1;
            var nextBx = doc.getElementById("n0_" + nextcol);
            var nextnum = !nextBx? null : nextBx.value;
            //alert("col: " + col + " ans: " + ans + " notans: " + notans + " prevcol: " + prevcol + " prevcolIsOdd: " + prevcolIsOdd + " nPrevn: " + nPrevn + " nPrevd: " + nPrevd + " prevden: " + prevden + " prevdIsnum: " + prevdIsnum + " done: " + done + " allgood: " + allgood);
            var rdfrac = reduce(nPrevn,nPrevd);
            done = prevcolIsOdd && prevnIsnum && prevdIsnum && nPrevn === rdfrac.n && nPrevd === rdfrac.d;
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
            var prev2Bx = doc.getElementById("n0_" + prev2col);
            var prev2num = prev2Bx? prev2Bx.value : 0;
            //doc.getElementById("statusBox" + x).innerHTML = "col: " + col + " ans: " + ans + " prevnum: " + prevnum + " prevden: " + prevden;
            //x = (x + 1)%nSbxs;
            //alert("ok?");
            // what if it's already reduced in col 3? fixitElementById("n0_" + prev2col);
            //var prev2den = doc.getElementById("d0_" + prev2col);
            var currden;
            if( col > 2 ) {
                currden = doc.getElementById("d0_" + col).value;
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
                var ncurrden = num(currden);
                var rdfrac = reduce(nAns, ncurrden);
                if( prev2num && prevnum && prev2nIsnum && prevnIsnum &&
                        nPrev2n/nPrevn !== nAns ) {
                    alert("division wrong");
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    allgood = false;
                    alert(prev2num + " divided by " + prevnum + " is not " + ans);
                } else if( currden && !isNaN(currden) && ( nAns !== rdfrac.n || ncurrden !== rdfrac.d ) &&
                        !nextnum ) {
                    alert("not reduced");
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    allgood = false;
                    alert(ans + " over " + currden + " is not reduced");
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
        ansBx = doc.getElementById("d0_3");
    }
    //alert("after checking 1st 2 denominators len: " + len);
    for( var i = 4; i < len; ++i ) {
        var id = "d0_" + i;
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
        var nextBx = doc.getElementById("n0_" + nextcol);
        var nextnum = !nextBx? 0 : nextBx.value;
        var prevcol = i - 1;
        var prevcolIsOdd = prevcol%2 === 1;
        var prev2col = i - 2;
        var prevnum = doc.getElementById("n0_" + prevcol).value;
        var prevden = doc.getElementById("d0_" + prevcol).value;
        var currnum = doc.getElementById("n0_" + i).value;
        var prevnIsnum = !isNaN(prevnum);
        var nPrevn = prevnIsnum? num(prevnum) : 0;
        var prevdIsnum = !isNaN(prevden);
        var nPrevd = 1;
        if(  prevden && prevdIsnum && prevden !== "" && prevden !== "0" ) {
            nPrevd = num(prevden);
        }
        var rdfrac = reduce(nPrevn,nPrevd);
        var done = prevcolIsOdd && nPrevn === rdfrac.n && nPrevd === rdfrac.d;
        if( i > 4 ) {
            prev2den = doc.getElementById("d0_" + prev2col).value;
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
            var ncurrnum = num(currnum);
            var rdfrac = reduce( ncurrnum, nAns);
            if( prev2num && prevden && prev2dIsnum && prevdIsnum &&
                nPrev2d/nPrevd !== nAns && nPrev2d/nPrevd !== 1 ) {
                ansBx.style.color = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                alert("Denominator: " + ans + " is not " + prev2den + " / " + prevden);
            } else if( currnum && !isNaN(currnum) && ( ncurrnum !== rdfrac.n || nAns !== rdfrac.d) && 
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

            var len = id.length;
            var col = num(id.substring(len-1, len));
            var nextCol = col + 1;
            var nextBx = doc.getElementById("d0_" + col); // for now
            var whlprt = doc.getElementById("whlprt").value;
            var oden = doc.getElementById("oden").value;
            var onum = doc.getElementById("onum").value;
            var prevCol = col - 1;
            var prevNum;
            var prevDen;
            var thisDen;
            var instr2;
            var instr3;
            var nAns = num(ans);
            //alert("checkMprN id: " + id + " col: " + col);
            if( col === 0 && ans === whlprt ||
                col === 1 && ans === oden ||
                col === 2 && ans === onum ||
                col === 3 && num(ans) === num(whlprt)*num(oden) + num(onum) ) { 
                ansBx.style.color = "#0033cc";
                ansBx.style.borderColor = "#e9d398";
                instr2 = "Copy denominator: " + oden + " to second box";
                if( nextCol === 2 ) {
                    instr2 = "Copy numerator of mixed number: " + onum + " to third box";
                } else if( nextCol === 3 ) {
                    instr2 = "What is " + whlprt + " &times " + oden + " + " + onum;
                }
                nextBx = doc.getElementById("n0_" + nextCol);
                if( col === 3 ) {
                    instr2 = "Copy denominator: " + oden + " to third denominator";
                    nextBx = doc.getElementById("d0_" + col);
                }
                doc.getElementById("instr2").innerHTML = instr2;
                doc.getElementById("instr3").innerHTML = "";
                nextBx.focus();
            } else if( col > 3 && col%2 === 0 ) {
                /* col === 4 && (!frcden4 || (!isNaN(frcden4) && ans === frcden4)) &&
                !isNaN(frcnum3) && !isNaN(frcden3) &&
                num(frcnum3)%nAns === 0 && num(frcden3)%nAns === 0 */
                prevNum = doc.getElementById("n0_" + prevCol).value;
                prevDen = doc.getElementById("d0_" + prevCol).value;
                thisDen = doc.getElementById("d0_" + col).value;
                if( (thisDen && isNaN(thisDen)) || isNaN(prevNum) || isNaN(prevDen) ) {
                    alert("Fix one or all of the following previous bad entries first: " + prevNum + ", " + prevDen + ", " + thisDen);
                } else if( thisDen && ans !== thisDen ) {
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert("Numerator: " + ans + " needs to be the same value as denominator: " + thisDen + " or you are changing the value of the fraction, not converting it.");
                    allgood = false;
                } else if( num(prevNum)%nAns !== 0 || num(prevDen)%nAns !== 0 ) { // not catching. fixit
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert(ans + " needs to evenly divide " + prevNum + " and " + prevDen);
                    allgood = false;
                } else {
                    ansBx.style.color = "#0033cc";
                    ansBx.style.borderColor = "#e9d398";
                    nextBx = doc.getElementById("d0_" + col);
                    instr2 = "Copy numerator to denominator so the number you are dividing by is 1";
                    if( nextBx.value ) {
                        instr2 = "What is " + prevDen + " &divide " + ans;
                        nextBx = doc.getElementById("n0_" + nextCol);
                    }
                    doc.getElementById("instr2").innerHTML = instr2;
                    doc.getElementById("instr3").innerHTML = "";
                    nextBx.focus();
                }
            } else if( col > 3 && col%2 === 1 ) {
                /* col === 5 && frcnum3 && frcnum4 && !isNaN(frcnum3) && !isNaN(frcnum4) &&
                num(frcnum3)/num(frcnum4) === nAns ) { */
                var prevNum = doc.getElementById("n0_" + prevCol).value;
                var prev2col = col - 2;
                var prev2Num = doc.getElementById("n0_" + prev2col).value;
                prevDen = doc.getElementById("d0_" + prevCol).value;
                if( !prevNum || !prev2Num || isNaN(prevNum) || isNaN(prev2Num) ) {
                    alert("Fix one or all of the following previous bad entries first: " + prevNum + ", " + prev2Num);
                } else if( num(prev2Num)/num(prevNum) !== nAns ) {
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert(prev2Num + " divided by " + prevNum + " is not " + ans);
                    allgood = false;
                } else {
                    ansBx.style.color = "#0033cc";
                    ansBx.style.borderColor = "#e9d398"; 
                    var p = "d0_" + col;
                    nextBx = doc.getElementById(p);
                    //doc.getElementById("statusBox" + x).innerHTML ="nextBx: " + p + " value: " + nextBx.value;
                    //x = (x + 1)%nSbxs;
                    var thisDen = nextBx.value;
                    var prev2Den = doc.getElementById("d0_" + prev2col).value;
                    instr2 = "What is " + prev2Den + " &divide " + prevDen;
                    instr3 = "";
                    if( thisDen ) {
                        var nextcol = col + 1;
                        nextBx = doc.getElementById("d0_" + nextcol);
                        nextBx.type = "text";
                        instr2 = "Is there a factor that divides both " + thisDen + " and " + ans + "?";
                        instr3 = " If so enter it, otherwise click 'Done'";
                        var othrBx = doc.getElementById("n0_" + nextcol);
                        othrBx.type = "text";
                        var par = othrBx.parentNode;
                        par.style.borderBottom = "2px solid #005511";
                        //doc.getElementById("statusBox" + x).innerHTML = "checkMpr: e/o" + nextcol;
                        //x = (x + 1)%nSbxs;
                        doc.getElementById("e" + nextcol).innerHTML = "=";
                        doc.getElementById("o" + nextcol).innerHTML ="&divide";
                        nextcol = nextcol + 1;
                        othrBx = doc.getElementById("n0_" + nextcol);
                        othrBx.type = "text"; 
                        var par = othrBx.parentNode;
                        par.style.borderBottom = "2px solid #005511";
                        othrBx = doc.getElementById("d0_" + nextcol);
                        othrBx.type = "text";  
                    }
                    doc.getElementById("instr2").innerHTML = instr2;
                    doc.getElementById("instr3").innerHTML = instr3;
                    nextBx.focus();
                }
            } else { // one of 1st 4 numerators was wrong
                ansBx.style.color = "red";
                ansBx.style.borderColor = "red";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
            }
            
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
                    var whl = doc.getElementById("whlprt").value;
                    doc.getElementById("instr2").innerHTML = "Copy whole part of mixed number: " + whl + " to first box";
                    doc.getElementById("instr3").innerHTML = "";
                    nextBx = doc.getElementById("n0_0");
                } else {
                    var thisNum = doc.getElementById("n0_3").value;
                    doc.getElementById("instr2").innerHTML = "Is there a factor that divides both " + thisNum + " and " + ans + "?";
                    doc.getElementById("instr3").innerHTML = " If so, enter it. If not click 'Done'";
                    nextBx = doc.getElementById("n0_4");
                }
            } else if( col%2 === 0 && col > 3 ) { // used to be col === 4
                //doc.getElementById("statusBox" + x).innerHTML = "checkMprD col = 5 block";
                //x = (x + 1)%nSbxs;
                var lastcol = col - 1;
                var prevN = doc.getElementById("n0_" + lastcol).value;
                var prevD = doc.getElementById("d0_" + lastcol).value;
                if( prevN && prevD && !isNaN(prevN) && !isNaN(prevD)) {
                    var nVal = num(prevN);
                    var dVal = num(prevD);
                    var aVal = num(ans);
                    var thisN = doc.getElementById("n0_" + col).value;
                    if( nVal%aVal === 0 && dVal%aVal === 0 && 
                                (!thisN || !isNaN(thisN) && ans === thisN ) ) {
                        ansBx.style.color = "#0033cc";
                        ansBx.style.borderColor = "#e9d398"; 
                        nextBx = doc.getElementById("n0_" + col);
                        var instr2 = "Copy denominator to numerator so the number you are dividing by is 1"; 
                        if( thisN ) {
                            nextBx = doc.getElementById("n0_" + nextcol);
                            instr2 = "What is " + prevN+ " &divide " + thisN;
                        }
                        doc.getElementById("instr2").innerHTML = instr2;
                        doc.getElementById("instr3").innerHTML = "";
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
                
                var prev2D = doc.getElementById("d0_" + prev2col).value;
                var prevD = doc.getElementById("d0_" + prevcol).value;
                var thisNid = "n0_" + col;
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
                        var othrBx = doc.getElementById("n0_" + nextcol);
                        othrBx.type = "text"; 
                        var par = othrBx.parentNode;
                        par.style.borderBottom = "2px solid #005511";
                        othrBx = doc.getElementById("d0_" + nextcol);
                        othrBx.type = "text";  
                    } else {
                        var nextId = "n0_" + nextcol;
                        nextBx = doc.getElementById(nextId);
                        nextBx.type = "text";
                        doc.getElementById("instr2").innerHTML = "Is there a factor that divides both " + currN + " and " + ans + "?";
                        doc.getElementById("instr3").innerHTML = " If so enter it, otherwise click 'Done'";
                        var par = nextBx.parentNode;
                        //doc.getElementById("statusBox" + x).innerHTML = "checkMprD col = " + col + " nextBx id: " + nextBx.id + " =? " + nextId;
                        //x = (x + 1)%nSbxs;
                        par.style.borderBottom = "2px solid #005511";
                        var othrBx = doc.getElementById("d0_" + nextcol);
                        othrBx.type = "text"; 
                        doc.getElementById("e" + nextcol).innerHTML = "=";
                        doc.getElementById("o" + nextcol).innerHTML ="&divide";
                        nextcol = nextcol + 1;
                        //doc.getElementById("statusBox" + x).innerHTML = "checkMprD col = " + col + " after e/o, nextcol: " + nextcol;
                        //x = (x + 1)%nSbxs;
                        othrBx = doc.getElementById("n0_" + nextcol);
                        othrBx.type = "text"; 
                        var par = othrBx.parentNode;
                        par.style.borderBottom = "2px solid #005511";
                        othrBx = doc.getElementById("d0_" + nextcol);
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
                alert(ans + " should be the same as the first denominator: " + oden);
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
                                doc.getElementById("instr2").innerHTML = "What is " + prevDV + " &divide " + ans;
                                doc.getElementById("instr3").innerHTML = "";
                                nextBx.focus();
                            } else {
                                //alert("no value in current numerator");
                                doc.getElementById("instr2").innerHTML = "Copy denominator value into numerator so the number you are dividing by is 1";
                                doc.getElementById("instr3").innerHTML = "";
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
                if( isNaN(ans) ) {
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                } else if( currnVal ) {
                    if( ans !== currnVal ) {
                        ansBx.style.color = "red";
                        var errs = Number(doc.getElementById("errs").value);
                        doc.getElementById("errs").value = errs + 1;
                    } else {
                        ansBx.style.color = "#0033cc";
                        doc.getElementById("instr2").innerHTML = "What is " + prevDV + " &times " + ans;
                        doc.getElementById("instr3").innerHTML = "";
                        var nextcol = col + 1;
                        var nextBx = doc.getElementById("d"+ row + "_" + nextcol);
                        nextBx.focus();
                    }
                } else {
                    ansBx.style.color = "#0033cc";
                    //alert("no value in current numerator");
                    var op = "multiply";
                    if( test) {
                        op = "divid";
                    }
                    doc.getElementById("instr2").innerHTML = "Copy denominator value into numerator so the number you are " + op + "ing by is 1";
                    doc.getElementById("instr3").innerHTML = "";
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
        var numBx = id === "d0_2"? doc.getElementById("n0_2"):
                doc.getElementById("n0_4");
        var frcnum = numBx.value;
        var rem = onum%oden;
        var rdfrac = reduce(rem, oden);
        if( isNaN(ans) ) {
            ansBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
        } else {
            var nans = num(ans);
            if( frcnum &&  !isNaN(frcnum) ) {
                var nfrcnum = num(frcnum);
                if( nfrcnum/nans !== rem/oden ) {
                    ansBx.style.color = "red";
                    numBx.style.color = "red";
                    partner = ansBx;
                    numBx.focus();
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert(frcnum + "/" + nans + " needs to equal " + rem + "/" + oden);
                } else if ( id !== "d0_2" && ( nfrcnum !== rdfrac.n || nans !== rdfrac.d ) ) {
                    ansBx.style.color = "red";
                    numBx.style.color = "red";
                    partner = ansBx;
                    numBx.focus();
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert(frcnum + "/" + nans + " is not reduced");
                } else {
                    ansBx.style.color = "#0033cc";
                    if( id === "d0_2" ) {
                        doc.getElementById("instr2").innerHTML = "If fraction is reduced, click 'Done'.";
                        doc.getElementById("instr3").innerHTML = "Otherwise copy the whole part of the mixed number.";
                        doc.getElementById("n0_3").focus();
                    } else {
                        doc.getElementById("instr2").innerHTML = "Click 'Done'";
                        doc.getElementById("instr3").innerHTML = "";
                        doc.activeElement.blur();
                    }
                }
            } else if( id === "d0_2" ) {
                if( nans === oden || nans === rdfrac.n) { // check id, if redNum, must be reduced
                    ansBx.style.color = "#0033cc";
                    doc.getElementById("n0_3").focus();
                } else {
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert(nans + " needs to be " + oden + " or " + rdfrac.n);
                }
            } else {
               numBx.focus();
            }
        }
        return false;
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
        var denBx = id === "n0_2"? doc.getElementById("d0_2") :
                doc.getElementById("d0_4");
        var frcden = denBx.value;
        var rem = onum%oden;
        var rdfrac = reduce(rem, oden);
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
                if( nans/num(frcden) !== rem/oden ) {
                    ansBx.style.color = "red";
                    denBx.style.color = "red";
                    partner = denBx;
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert(nans + "/" + frcden + " needs to equal " + rem + "/" + oden);
                } else if ( id !== "n0_2" && ( nans !== rdfrac.n || frcden !== rdfrac.d ) ) {
                    ansBx.style.color = "red";
                    denBx.style.color = "red";
                    partner = denBx;
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert(nans + "/" + frcden + " is not reduced");
                } else {
                    ansBx.style.color = "#0033cc";
                    if( id === "n0_2" ) {
                        doc.getElementById("n0_3").focus();
                    } else {
                        doc.activeElement.blur();
                    }
                }
            } else if( id === "n0_2" ) {
                if( nans === rem || nans === rdfrac.n ) {
                    ansBx.style.color = "#0033cc";
                    doc.getElementById("instr2").innerHTML = "Copy original denominator: '" + oden + "' to mixed number denominator";
                    doc.getElementById("instr3").innerHTML = "";
                    denBx.focus();
                } else {
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    alert(nans + " needs to be " + rem + " or " + rdfrac.n);
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
            var prod = num(doc.getElementById("n1_1").value);
            if( ansVal === dvdnd - prod ) {
                ansBx.style.color = "#0033cc";
                doc.getElementById("instr2").innerHTML = "Copy remainder: '" + ans + "' to numerator of mixed number";
                doc.getElementById("instr3").innerHTML = "";
                doc.getElementById("n0_2").focus();
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
            var dvsr = num(doc.getElementById("d0_0").value);
            var whlprt = num(doc.getElementById("n0_1").value);
            if( ansVal === dvsr*whlprt ) {
                ansBx.style.color = "#0033cc";
                var onum = doc.getElementById("onum").value;
                doc.getElementById("instr2").innerHTML = "What is " + onum + " - " + ans;
                doc.getElementById("instr3").innerHTML = "";
                doc.getElementById("d1_1").focus();
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
            var nextBx = doc.getElementById("n0_4");
            var instr2 = "Divide both numerator and denominator by some number to reduce fraction";
            if( ansBx.id === "n0_1" ) {
                nextBx = doc.getElementById("n1_1");
                instr2 = "What is " + ans + " &times " + oden;
            }
            doc.getElementById("instr2").innerHTML = instr2;
            doc.getElementById("instr3").innerHTML = "";
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
            var num = doc.getElementById("d0_1").value;
            doc.getElementById("instr2").innerHTML = "What is " + num + " &divide " + ans;
            doc.getElementById("instr3").innerHTML = "";
            doc.getElementById("n0_1").focus();
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
        var doc = document;
        
        var ansBx = ev.target;
        var ans = ansBx.value;
        
        if( ans === doc.getElementById("onum").value ) {
            ansBx.style.color = "#0033cc";
            var oden = doc.getElementById("oden").value;
            doc.getElementById("instr2").innerHTML = "Copy the denominator: '" + oden + "' to the box to the left of the 'divide by' sign";
            doc.getElementById("instr3").innerHTML = "";
            doc.getElementById("d0_0").focus();
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
                                doc.getElementById("instr2").innerHTML = "What is " + prevNV + " &divide " + ans;
                                doc.getElementById("instr3").innerHTML = "";
                                var nextcol = col + 1;
                                var nextBx = doc.getElementById("n" + row + "_" + nextcol);
                                nextBx.focus();
                            } else {
                                doc.getElementById("instr2").innerHTML = "Copy numerator value into denominator so the number you are dividing by is 1";
                                doc.getElementById("instr3").innerHTML = "";
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
                if( isNaN(ans) ) {
                    ansBx.style.color = "red";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                } else if( currdVal ) {
                    if( ans !== currdVal ) {
                        ansBx.style.color = "red";
                        var errs = Number(doc.getElementById("errs").value);
                        doc.getElementById("errs").value = errs + 1;
                    } else {
                        ansBx.style.color = "#0033cc";
                        doc.getElementById("instr2").innerHTML = "What is " + prevDV + " &times " + currdVal;
                        doc.getElementById("instr3").innerHTML = "";
                        var nextcol = col + 1;
                        var nextBx = doc.getElementById("d"+ row + "_" + nextcol);
                        nextBx.focus();
                    }
                } else {
                    ansBx.style.color = "#0033cc";
                    //alert("no value in current numerator");
                    doc.getElementById("instr2").innerHTML = "Copy numerator value into denominator so the number you are multiplying by is 1";
                    doc.getElementById("instr3").innerHTML = "";
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
                prevD = doc.getElementById(othr + row + "_" + prevcol);
                prev2D = doc.getElementById(othr + row + "_" + prev2col);
                prevDV = prevD.value;
                prev2DV = prev2D.value;
                var op = testD? "&divide" : "&times";
                var instr2 = "What is " + prev2DV + " " + op + " " + prevDV;
                var instr3 = "";
                if( nextBx.value ) {
                    instr2 = "Is there a number (besides 1) that evenly divides both " + ans + " and " + nextBx.value + "?";
                    instr3 = " If so, enter it. Otherwise, click 'Done'";
                    if( testM ) {
                        instr2 = "Is there a factor one denominator has, but another does not? If so, enter the factor by the denominator";
                        instr3 = "that does not have it. Once fractions are in order, click 'Done'";
                    }
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
                doc.getElementById("instr2").innerHTML = instr2;
                doc.getElementById("instr3").innerHTML = instr3;
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

function zeroCounts() {
    var doc = document;

    //alert("zerocounts");
    doc.getElementById("numAttmptd").value = 0;
    doc.getElementById("errs").value = 0;
    doc.getElementById("numWoErr").value = 0;
    doc.getElementById("consWoErr").value = 0;
    doc.getElementById("strtTime").value = Number(Date.now());
    doc.getElementById("corrPerHr").value = 0;
    doc.getElementById('th-id2').submit();
    return false;
}
function pusharo( ev ) {
    ev = ev || window.event;
    var x = ev.keyCode;
    var doc = document;
    var num = Number;
    
    var indcatr = doc.getElementById("indcatr").value;
    //alert("key pressed. indcatr: " + indcatr);
    if( num(indcatr) < 4 ) {
        var id = doc.activeElement.id;
        var len = id.length;
        var typ = id.substring(0,1);

        var row = num(id.substring(1,2));
        var col = num(id.substring(3,len));
        if( x === 37 ) {
            var prevCol = col - 1;
            var whereTo = typ + row + "_" + prevCol;
            //alert("we are here: " + id + ", going left to " + whereTo);
            var nextBx = doc.getElementById(whereTo);
            if( nextBx ) {
                nextBx.focus();
            }        
        } else if ( x === 38 ) {
            var id = doc.activeElement.id;
            
            var othr = 'n';
            if( typ === 'n' ) {
                othr = 'd';
                row = row - 1;
             }
            var whereTo = othr + row + "_" + col;
            //alert("we are here: " + id + ", going up  to " + whereTo);
            var nextBx = doc.getElementById(whereTo);
            if( nextBx && nextBx.type !== "hidden" ) {
                nextBx.focus();
            } else {
                if( col%2 === 0 ) {
                    col = col - 1;
                } else {
                    col = col - 2;
                }
                while( col > 0 ) {
                    whereTo = othr + row + "_" + col;
                    //alert("we are here: " + id + ", going up  to " + whereTo);
                    nextBx = doc.getElementById(whereTo);
                    if( nextBx && nextBx.type !== "hidden" ) {
                        nextBx.focus();
                        break;
                    }
                    col = col - 2;
                }
            }
        } else if( x === 39 ) {
            var id = doc.activeElement.id;
            
            var nextCol = col + 1;
            var whereTo = typ + row + "_" + nextCol;
            //alert("we are here: " + id + ", going right to " + whereTo);
            var nextBx = doc.getElementById(whereTo);
            if( nextBx ) {
                nextBx.focus();
            } 
        } else if( x === 40 ) {
            var id = doc.activeElement.id;
            
            var othr = 'd';
            if( typ === 'd' ) {
                othr = 'n';
                row = row + 1;
             }
            var whereTo = othr + row + "_" + col;
            //alert("we are here: " + id + ", going down to " + whereTo);
            var nextBx = doc.getElementById(whereTo);
            if( nextBx && nextBx.type !== "hidden" ) {
                nextBx.focus();
            } else {
                if( col%2 === 0 ) {
                    col = col - 1;
                } else {
                    col = col - 2;
                }
                while( col > 0 ) {
                    whereTo = othr + row + "_" + col;
                    //alert("we are here: " + id + ", going down to " + whereTo);
                    nextBx = doc.getElementById(whereTo);
                    if( nextBx && nextBx.type !== "hidden" ) {
                        nextBx.focus();
                        break;
                    }
                    col = col - 2;
                }
            } 
        } else {
            //alert("not going anywhere");
        }
    }
}
window.onload = function(){
    var doc = document;
    var startWhere = doc.getElementById("startHere").value;
    //alert("startWhere: " + startWhere + ":");
    var strtBx = doc.getElementById(startWhere);
    //alert("strtBx: " + strtBx + ":");
    doc.addEventListener('keydown', pusharo);
    if( strtBx ) {
        strtBx.focus();
    }
};