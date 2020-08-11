/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* in lcd & order exercise, doesn't check that numerator is equal to denominator
 * before moving on to product box fixit 
 * 
 * checkMix doesn't check for existence of whole part in reduced fraction fixit
 */
var x = 0;
var nSbxs = 24;
function erase( ev ) {
    ev = ev || window.event;
    var ansBx = ev.target;
    if( ansBx.style.color === "red") {
        ansBx.style.color = "#0033cc";
        //var answer = ansBx.value;
        //var len = answer.length;
        ansBx.value = "";//answer.substring(len, len);
    }
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
}
function checkOrd() {
    var doc = document;
    var num = Number;
    
    var lastrow = 0;
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
    if( blkCount == 3 ) { // MAXROWS = 4
        nums = doc.getElementsByClassName("n0");
        var cols = nums.length;
        for( var i = 0; i < cols; ++i ) {
            if( nums[i].value !== "" ) {
                nums[i].style.color = "#0033cc";
                doc.getElementById("d0_" + i).style.color = "#0033cc";
            }
        }
        
    }
}
function checkRed() { // assumes only prime factors are 2's, 3's and 5's fixit
    var doc = document;
    var num = Number;
    
    var nums = doc.getElementsByClassName("n0");
    var cols = nums.length;
    var lastcol = cols - 1;
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
    } else {
        for( var i = 0; i < cols; ++i ) {
            nums[i].style.color = "#0033cc";
            doc.getElementById("d0_" + i).style.color = "#0033cc";
        }
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
    var allgood = true;
    var whlVal = whlBx.value;

    
    if( whlVal ) {
        if( isNaN( whlVal ) ) {
            whlBx.style.color = "red";
            allgood = false;
            doc.getElementById("statusBox" + x).innerHTML = "checkMix whole value: " + whlBx.value + " not a number";
            x = (x + 1)%nSbxs;
        } else {
            if( num(whlVal) === whol ) {
                whlBx.style.color = "#0033cc";
                whlBx.style.borderColor = "#e9d398";
            } else {
                whlBx.style.color = "red";
                allgood = false;
                doc.getElementById("statusBox" + x).innerHTML = "checkMix whole value: " + whlBx.value + " not: " + whol;
                x = (x + 1)%nSbxs;
            }
        }
    } else if( whol !== 0 ) {
        whlBx.style.borderColor = "red";
        allgood = false;
        doc.getElementById("statusBox" + x).innerHTML = "checkMix nothing in whole value";
        x = (x + 1)%nSbxs;
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
            allgood = false;
            doc.getElementById("statusBox" + x).innerHTML = "checkMix whole value redprt: " + whlBx.value + " not a number";
            x = (x + 1)%nSbxs;
        } else {
            if( num(whlVal) === whol ) {
                whlBx.style.color = "#0033cc";
                whlBx.style.borderColor = "#e9d398";
            } else {
                whlBx.style.color = "red";
                allgood = false;
                doc.getElementById("statusBox" + x).innerHTML = "checkMix whole value redprt: " + whlBx.value + " not: " + whol;
                x = (x + 1)%nSbxs;
            }
        }
    } else if( whol !== 0  && rednum ) {
        whlBx.style.borderColor = "red";
        allgood = false;
        doc.getElementById("statusBox" + x).innerHTML = "checkMix nothing in whole value";
        x = (x + 1)%nSbxs;
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
                allgood = false;
                doc.getElementById("statusBox" + x).innerHTML = "checkMix den value: ";
                x = (x + 1)%nSbxs;
            }
        } else {
            denBx.style.color = "red";
            allgood = false;
        }
    } else {
        if( !numnum && rem === 0 ) { // no numerator either and numerator should be 0
            denBx.style.color = "#0033cc";
            denBx.style.borderColor = "#e9d398";
        } else {
            denBx.style.borderColor = "red";
            allgood = false;
            doc.getElementById("statusBox" + x).innerHTML = "checkMix no denominator";
            x = (x + 1)%nSbxs;
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
                allgood = false;
                doc.getElementById("statusBox" + x).innerHTML = "checkMix numBx value: " + numBx.value + " not: " + rem + " and ratio not right";
                x = (x + 1)%nSbxs;
            }
        } else {
            numBx.style.color = "red";
            allgood = false;
        }
    } else {
        if( rem === 0 ) {
            numBx.style.color = "#0033cc";
            numBx.style.borderColor = "#e9d398";
        } else {
            numBx.style.borderColor = "red";
            allgood = false;
            doc.getElementById("statusBox" + x).innerHTML = "checkMix num value: not there but should be";
            x = (x + 1)%nSbxs;
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
                allgood = false;
                doc.getElementById("statusBox" + x).innerHTML = "checkMix den value: ";
                x = (x + 1)%nSbxs;
            }
        } else {
            rddBx.style.color = "red";
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
            allgood = false;
            doc.getElementById("statusBox" + x).innerHTML = "checkMix no denominator";
            x = (x + 1)%nSbxs;
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
                allgood = false;
                doc.getElementById("statusBox" + x).innerHTML = "checkMix num value: " + rdnBx.value + " not: " + rem + " and ratio not right";
                x = (x + 1)%nSbxs;
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
            allgood = false;
            doc.getElementById("statusBox" + x).innerHTML = "checkMix num value: not there but should be";
            x = (x + 1)%nSbxs;
        }
    }

    // if dvsr or d0_1 are entered, are they correct?
    if( !allgood ) {
        //alert("not all good");
        doc.getElementById("chkBx").style.borderColor = "red";
    } else {
        doc.getElementById("chkBx").style.borderColor = "#e9d398";
    }
}
function checkFrc() {
    alert("checkFrc");
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
        } else {
            var nans = num(ans);
            
            if( nans === oden && id === "frcden" ) { // check id, if redNum, must be reduced
                ansBx.style.color = "#0033cc";
                doc.getElementById("redprt").focus();
            } else if( frcnum &&  !isNaN(frcnum) && 
                    num(frcnum)/nans === rem/oden &&    
                    (id === "frcden" || isRed(frcnum, nans) ) ) {
                ansBx.style.color = "#0033cc";
            } else {
                ansBx.style.color = "red";
            }
        }
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
            //doc.getElementById("statusBox" + x).innerHTML = "checkFrcN ans: " + ans + " is NaN";
        } else {
            var nans = num(ans);
            var id = ansBx.id;
            if( (nans === rem && id === "frcnum") ||
                    (frcden &&  !isNaN(frcden) && 
                    nans/num(frcden) === rem/num(oden) &&
                    (id === "frcnum" || isRed(nans, frcden) ) ) ||
                    !frcden ) {
                ansBx.style.color = "#0033cc";
                denBx.focus();
            } else {
                ansBx.style.color = "red";
                doc.getElementById("statusBox" + x).innerHTML = "checkFrcN id: " + id + " oden: " + oden + " frcden: " + frcden + " rem: " + rem;
                x = (x + 1)%nSbxs;
            }
        }
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
            }
        } else {
            ansBx.style.color = "red";
        }
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
        }
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
        if( ans && Math.floor(onum/oden) == ans ) {
            ansBx.style.color = "#0033cc";
            var nextBx = ansBx.id === "whlprt" ? doc.getElementById("prod") : doc.getElementById("rednum");
            nextBx.focus();
        } else {
            ansBx.style.color = "red";
        }
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
        }
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
                ansBx.style.color = "#0033cc";
                var othr = "d";
                if( typ === "d" ) {
                    othr = "n";
                }
                var nextBx = doc.getElementById(othr + row + "_" + col);
                if( nextBx.value ) {
                    var nextcol = col + 1;
                    //var nxt2col = nextcol + 1;
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
                    //border-bottom: 2px solid #005511;
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