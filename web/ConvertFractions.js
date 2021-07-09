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
 * need to disallow multiplying or dividing by 1/1 fixit
 *
 * substr should be substr( startpoint, nchars ) fixit
 *
 * only answer it accepts for 0.0 is 1/10 fixit
 *
 * 7.0 also fixit
 *
 * the whole point of converting decimal to fraction is so that you can cancel numerators or denominators
 * which means you want an improper fraction, not a mixed number fixit
 *
 * Mixed Number to fraction: need to be able to put final answer without filling in all the boxes fixit
 * 
 */
var x = 0;
var nSbxs = 24;
var allgood = true;
var partner = null;
var partdvd;
var nxtD;

var rowNo = 0;
var quotdigs = 0;
var whatbox = -1;
var gProd = 0;
var gBringDownDigs = [ 0, 0, 0, 0, 0,
                       0, 0, 0, 0, 0, 
                       0, 0, 0, 0, 0 ];
var nextQuotBox = document.getElementById("qt0");

function erase( ev ) {
    ev = ev || window.event;
    var ansBx = ev.target;
    var num = Number;
    
    var testcolor = getComputedStyle(ansBx).getPropertyValue("color");
    var len = testcolor.length;
    var firstcom = testcolor.indexOf(",");
    var redchars = firstcom - 4;
    var redval = num(testcolor.substr(4, redchars));
    var strtpos = firstcom + 1;
    var restchars = len - 1 - firstcom;
    var rest = testcolor.substr(strtpos, restchars);
    var secondcom = rest.indexOf(",");     
    var greenchars = secondcom - 1;
    var greenval = num(rest.substr(1,greenchars));
    var firstblue = secondcom + 2;
    var bluechars = restchars - 3 - secondcom;
    var blueval = num(rest.substr(firstblue, bluechars));
            
    if( redval === 255 && greenval === 26 && blueval === 198 ) {
    
    	//alert("erasing");
        ansBx.style.color = "#0033cc";
        var errBx = document.getElementById("instr4");
        errBx.style.color = "#fff9ea";
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
// should allgood be consistently checked in these functions rather than in startagain? fixit
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
    } else if( indcatr < 5 ) {
        checkD2F();
    } else if( indcatr < 6 ) {
        checkF2D();
    }
    return false;
}
function checkF2D() {
	allgood = true;
	var num = Number;
	var doc = document;
	alert("checkF2D");
}
function checkD2F() {
	//very similar to checkMx. Can I combine?
	allgood = true;
	var num = Number;
	var doc = document;
	var nums = doc.getElementsByClassName("qput");
    var cols = nums.length;
    var lastcol = 0;
    // need to check if it is a number fixit
    var lastDBx = doc.getElementById("d0_1");
    var lastdstr = lastDBx.value;
    //var lastd = num(lastdstr);
    var onumStr = doc.getElementById("onum").value
    var onum = num(onumStr);
   	var whl = Math.floor(onum);    
    var strtPt = onumStr.indexOf(".") + 1;
    var len = onumStr.length;     		
	var nchars = len - strtPt;
	var quot = num("0." + onumStr.substr(strtPt, nchars));
    
	for( var i = 0; i < cols; ++i ) {
    	if( i%2 === 0 ) { // i starts with n0_1, which is i = 0, whole number
    		if( nums[i].value !== "" && (isNaN(nums[i].value) || num(nums[i].value) !== whl) ) {
    			allgood = false;
    			alert("i: " + i + " nums[i]: " + nums[i].value + " whl: " + whl + " allgood: " + allgood);
    			nums[i].style.color = "#ff1ac6";
    		}
    	} else {
	    	if( nums[i].value !== "" ) {
	    		lastcol = i;
	    		//doc.getElementById("statusBox" + x).innerHTML = "checkD2F nums[" + i + "]: " + nums[i].value;
            	//x = (x + 1)%nSbxs;
	    		lastDBx = doc.getElementById("d0_" + i)
	    		lastdstr = lastDBx.value;
	    		if( isNaN(nums[i].value) ) {
	    			allgood = false;
	    			alert("i: " + i + " NaN nums[i]: " + nums[i].value + " allgood: " + allgood);
	    			nums[i].style.color = "#ff1ac6";
	    		} else if( isNaN(lastdstr) ) {
	    		    allgood = false;
	    		    alert("i: " + i + " NaN lastdstr: " + lastdstr + " allgood: " + allgood);
    				lastDBx.style.color = "#ff1ac6";
    			}
    			//alert("i: " + i + " nums[i]: " + nums[i].value + " lastd: " + lastdstr);
	    	} else {
		        break;
	        }
	    }
    }
    var lastn = num(nums[lastcol].value);  
	var lastd = num(lastdstr);
	if( quot === 0 ) {
		if( lastn !== whl ) { 
			allgood = false;
			nums[lastcol].style.color = "#ff1ac6";	    		    
	    	lastDBx.style.color = "#ff1ac6";
			alert("decimal: " + onum + " not equal " + lastn);
		}
	} else {
		if( quot !== lastn/lastd ) {
			allgood = false;
			nums[lastcol].style.color = "#ff1ac6";	    		    
	    	lastDBx.style.color = "#ff1ac6";
			alert("decimal: " + quot + " not equal to " + lastn + "/" + lastd + " allgood: " + allgood);
		}
	    var rdfrc = reduce(lastn, lastd);
	    var testn = lastn - rdfrc.n;
	    var testd = lastd - rdfrc.d;
		if( lastn - rdfrc.n > 0 ) {
		    allgood = false;
			nums[lastcol].style.color = "#ff1ac6";
			    alert("CheckD2F cols: " + cols + " lastcol: " + lastcol + " lastn: " + lastn + " rdfrc: " + rdfrc.n + "/" + rdfrc.d + " testn: " + testn + " testd: " + testd); 
				    		    
		}
		if( lastd - rdfrc.d > 0 ) {
		   	allgood = false;	    		    
	    	lastDBx.style.color = "#ff1ac6";
	    	    alert("CheckD2F cols: " + cols + " lastcol: " + lastcol + " lastd: " + lastd + " rdfrc: " + rdfrc.n + "/" + rdfrc.d + " testn: " + testn + " testd: " + testd); 
	    	
		}
	}
	if( allgood ) {
		if( whl !== 0 && quot !== 0 ) {
			doc.getElementById("instrs").innerHTML = "Now Convert the Mixed Number to a Fraction";
			var prevD = doc.getElementById("d0_" + lastcol).value;
			doc.getElementById("instr2").innerHTML = "Copy previous denominator: " + prevD;
			doc.getElementById("instr3").style.color ="#fff9ea";
			// make blank mixed number boxes hidden, make conversion boxes visible and focus on denominator
			var fakestrtcol = lastcol + 2;
			var startHere = "d0_" + fakestrtcol;
			doc.getElementById("startHere").value = startHere;
			doc.getElementById(startHere).type = "hidden";
			var thsNum = doc.getElementById("n0_" + fakestrtcol)
			thsNum.type = "hidden";
			par = thsNum.parentNode;
            par.style.borderBottom = "";
			fakestrtcol = fakestrtcol - 1;
			doc.getElementById("n0_" + fakestrtcol).type = "hidden";
			doc.getElementById("e0_" + fakestrtcol).innerHTML = "";
			doc.getElementById("indcatr").value = 3; // Mixed Number to Fraction exercise
			//alert("startHere: " + startHere);

			var newstrtcol = cols + 1;
			startHere = "d0_" + newstrtcol;
			doc.getElementById("startWhere").value = startHere;
			var newStrtBx = doc.getElementById(startHere);
			newStrtBx.type = "text";
			var numcol = newstrtcol - 1;
			doc.getElementById("e0_" + numcol).innerHTML = "=";
			thsNum = doc.getElementById("n0_" + numcol);
			thsNum.type = "text";
			var par = thsNum.parentNode;
             par.style.borderBottom = "2px solid #005511";
			var opid = "o0_" + numcol;
			//alert("opid: " + opid);
			var thsOp = doc.getElementById("o0_" + numcol);
			thsOp.innerHTML = "&times";
			thsOp.style.borderBottom = "2px solid #005511";
			numcol = numcol + 1;
			thsNum = doc.getElementById("n0_" + numcol);
			thsNum.type = "text";
			par = thsNum.parentNode;
            par.style.borderBottom = "2px solid #005511";
			doc.getElementById("o0_" + numcol).innerHTML = "+";
			numcol = numcol + 1;
			thsNum = doc.getElementById("n0_" + numcol);
			thsNum.type = "text";
			par = thsNum.parentNode;
            par.style.borderBottom = "2px solid #005511";
			doc.getElementById("d0_" + numcol).type = "text";
			doc.getElementById("e0_" + numcol).innerHTML = "=";
			numcol = numcol + 1;
			thsNum = doc.getElementById("n0_" + numcol)
			thsNum.type = "text";
			par = thsNum.parentNode;
            par.style.borderBottom = "2px solid #005511";
			doc.getElementById("d0_" + numcol).type = "text";
			newStrtBx.focus();
		} else {
			startAgain();
		}
	}
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
        	//alert("row: " + j + " cols: " + cols + " i: " + i + " nums[i].value: " + nums[i].value);
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
            nums[lastcol[j]].style.color = "#ff1ac6";
            lastdBx.style.color = "#ff1ac6";
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
    var errBx = doc.getElementById("instr4");
    if( lastn !== rdfrac.n &&  lastd !== rdfrac.d ) {
        var errm = lastn + " over " + lastd + " is not reduced"; 
        errBx.style.color = "#ff1ac6";
        errBx.innerHTML = errm;
        //alert(errm);
        nBx.style.color = "#ff1ac6";
        dBx.style.color = "#ff1ac6";
        allgood = false;
        var errs = Number(doc.getElementById("errs").value);
        doc.getElementById("errs").value = errs + 1;
    } else if( lastn/lastd !== frstn/frstd ) {
        var errm = lastn + " / " + lastd + " does not equal " + frstn + " / " + frstd;
        errBx.style.color = "#ff1ac6";
        errBx.innerHTML = errm;
        nBx.style.color = "#ff1ac6";
        dBx.style.color = "#ff1ac6";
        allgood = false;
        var errs = Number(doc.getElementById("errs").value);
        doc.getElementById("errs").value = errs + 1;
    } else {
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
    var errBx = doc.getElementById("instr4");

    if( whlVal ) { // initial whole value
        if( isNaN( whlVal ) ) {
            whlBx.style.color = "#ff1ac6";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
            //doc.getElementById("statusBox" + x).innerHTML = "checkMix whole value: " + whlBx.value + " not a number";
            //x = (x + 1)%nSbxs;
        } else {
            if( num(whlVal) === whol ) {
                whlBx.style.color = "#0033cc";
                whlBx.style.borderColor = "#e9d398";
                errBx.style.color = "#fff9ea";
            } else {
                whlBx.style.color = "#ff1ac6";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                //doc.getElementById("statusBox" + x).innerHTML = "checkMix whole value: " + whlBx.value + " not: " + whol;
                //x = (x + 1)%nSbxs;
            }
        }
    } else if( whol !== 0 ) {
        whlBx.style.borderColor = "#ff1ac6";
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
            whlBx.style.color = "#ff1ac6";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
            //doc.getElementById("statusBox" + x).innerHTML = "checkMix whole value redprt: " + whlBx.value + " not a number";
            //x = (x + 1)%nSbxs;
        } else {
            if( num(whlVal) === whol ) {
                whlBx.style.color = "#0033cc";
                whlBx.style.borderColor = "#e9d398";
                errBx.style.color = "#fff9ea";
            } else {
                whlBx.style.color = "#ff1ac6";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                //doc.getElementById("statusBox" + x).innerHTML = "checkMix whole value redprt: " + whlBx.value + " not: " + whol;
                //x = (x + 1)%nSbxs;
            }
        }
    } else if( whol !== 0  && rednum ) {
        whlBx.style.borderColor = "#ff1ac6";
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
                errBx.style.color = "#fff9ea";
            } else {
                denBx.style.color = "#ff1ac6";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                //doc.getElementById("statusBox" + x).innerHTML = "checkMix den value: ";
                //x = (x + 1)%nSbxs;
            }
        } else {
            denBx.style.color = "#ff1ac6";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
        }
    } else {
        // no numerator either and numerator should be 0
        if( (!numnum || (!isNaN(numnum) && num(numnum) === 0)) && rem === 0 ) { 
            denBx.style.color = "#0033cc";
            denBx.style.borderColor = "#e9d398";
            errBx.style.color = "#fff9ea";
        } else {
            denBx.style.borderColor = "#ff1ac6";
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
                errBx.style.color = "#fff9ea";
            } else {
                numBx.style.color = "#ff1ac6";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                //doc.getElementById("statusBox" + x).innerHTML = "checkMix numBx value: " + numBx.value + " not: " + rem + " and ratio not right";
                //x = (x + 1)%nSbxs;
            }
        } else {
            numBx.style.color = "#ff1ac6";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
        }
    } else {
        if( rem === 0 ) {
            numBx.style.color = "#0033cc";
            numBx.style.borderColor = "#e9d398";
            errBx.style.color = "#fff9ea";
        } else {
            numBx.style.borderColor = "#ff1ac6";
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
                errBx.style.color = "#fff9ea";
            } else {
                rddBx.style.color = "#ff1ac6";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                //doc.getElementById("statusBox" + x).innerHTML = "checkMix den value: ";
                //x = (x + 1)%nSbxs;
            }
        } else {
            rddBx.style.color = "#ff1ac6";
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
            errBx.style.color = "#fff9ea";
        } else {
            rddBx.style.borderColor = "#ff1ac6";
            whlBx.style.borderColor = "#ff1ac6";
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
            errBx.style.color = "#fff9ea";
        } else {
            rdnBx.style.color = "#ff1ac6";
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
            errBx.style.color = "#fff9ea";
        } else {
            rdnBx.style.borderColor = "#ff1ac6";
            whlBx.style.borderColor = "#ff1ac6";
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
        doc.getElementById("chkBx").style.borderColor = "#ff1ac6";
        var errs = Number(doc.getElementById("errs").value);
        doc.getElementById("errs").value = errs + 1;
    } else {
        doc.getElementById("chkBx").style.borderColor = "#e9d398";
        startAgain();
    }
    return false;
}
function checkFrc() {
	// it's not turning every bad box red fixit
	// make it so you can skip boxes if you know the answer fixit
    var num = Number;
    var doc = document;
    
    allgood = true;
    var frstdcol = extract( doc.getElementById("startWhere").value ).c;
    var scnddcol = frstdcol + 1;
    var thrddcol = frstdcol + 2;
    var frstncol = frstdcol - 1;
    var ocol = extract( doc.getElementById("startHere").value ).c - 2;
    var odenBx = doc.getElementById("d0_" + ocol);
    var oden = odenBx.value;
    var allNums = doc.getElementsByClassName("nput");
    var len = allNums.length;
    var errBx = doc.getElementById("instr4");

    //doc.getElementById("statusBox" + x).innerHTML = "checkFrc oden: " + oden + " allnums len: " + len;
    //x = (x + 1)%nSbxs;
    //alert("ok?");
    for( var col = frstncol; col < len; ++col ) {
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
        if( prevcol > scnddcol ) {
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
			var wcol = ocol - 1;
            var whlprt = doc.getElementById("n0_" + wcol).value;
            var onum = doc.getElementById("n0_" + ocol).value;

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
            if( col > scnddcol ) {
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
            

            if( col === frstncol && ans === whlprt ||
                col === frstdcol && ans === oden ||
                col === scnddcol && ans === onum ||
                col === thrddcol && nAns === num(whlprt)*num(oden) + num(onum) ) {
                
                ansBx.style.color = "#0033cc";
                ansBx.style.borderColor = "#e9d398";
                errBx.style.color = "#fff9ea";
            } else if( col%2 === 0 ) {
                if( currden && !isNaN(currden) && ans !== currden) {
                    ansBx.style.color = "#ff1ac6";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    allgood = false;
                    var errm = "numerator: " + ans + " must be the same as denominator: " + currden;
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                } else if( prevnum && prevden && prevnIsnum && prevdIsnum && 
                        (nPrevn%nAns !== 0 || nPrevd%nAns !== 0) ) {
                    ansBx.style.color = "#ff1ac6";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    allgood = false;
                    var errm = ans + " must evenly divide " + prevnum + " and " + prevden;
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                } else {
                    ansBx.style.color = "#0033cc";
                    ansBx.style.borderColor = "#e9d398";
                    errBx.style.color = "#fff9ea";
                }
            } else if( col%2 === 1 ) {
                //alert("odd col");
                var ncurrden = num(currden);
                var rdfrac = reduce(nAns, ncurrden);
                if( prev2num && prevnum && prev2nIsnum && prevnIsnum &&
                        nPrev2n/nPrevn !== nAns ) {
                    var errm = "division wrong";
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                    ansBx.style.color = "#ff1ac6";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    allgood = false;
                    var errm = prev2num + " divided by " + prevnum + " is not " + ans;
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                } else if( currden && !isNaN(currden) && ( nAns !== rdfrac.n || ncurrden !== rdfrac.d ) &&
                        !nextnum ) {
                    var errm = "not reduced";
                    errBx.innerHTML = errm;
                    ansBx.style.color = "#ff1ac6";
                    ansBx.style.color = "#ff1ac6";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    allgood = false;
                    var errm = ans + " over " + currden + " is not reduced";
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                } else {
                    //alert("correct");
                    ansBx.style.color = "#0033cc";
                    ansBx.style.borderColor = "#e9d398";
                    errBx.style.color = "#fff9ea";
                }
            } else {
                ansBx.style.color = "#ff1ac6";
                //ansBx.style.borderColor = "#ff1ac6";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                var errm = ans + " is not correct numerator input " + col;
                errBx.style.color = "#ff1ac6";
        		errBx.innerHTML = errm;
                allgood = false;
            }
        } else {
            ansBx.style.color = "#ff1ac6";
            ansBx.style.borderColor = "#ff1ac6";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            var errm = ans + " is not a number";
            errBx.style.color = "#ff1ac6";
        	errBx.innerHTML = errm;
            allgood = false;
        }
    }
    //doc.getElementById("statusBox" + x).innerHTML = "checkFrc done with numerators ";
    //x = (x + 1)%nSbxs;
    //alert("ok?");
    var ansBx = doc.getElementById("d0_" + frstdcol);
    for( var i = scnddcol; i <= thrddcol; ++i ) {
        if( ansBx.value === oden ) {
            ansBx.style.color = "#0033cc";
            ansBx.style.borderColor = "#e9d398";
            errBx.style.color = "#fff9ea"; 
        } else {
            ansBx.style.color = "#ff1ac6";
            ansBx.style.borderColor = "#ff1ac6";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
        }
        
            //doc.getElementById("statusBox" + x).innerHTML = "frcden3: " + frcden3 + " frcnum4: " + frcnum4 + " frcden4: " + frcden4;
            //x = (x + 1)%nSbxs;
        ansBx = doc.getElementById("d0_" + i);
    }
    //alert("after checking 1st 2 denominators len: " + len);
    for( var i = thrddcol + 1; i < len; ++i ) {
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
            ansBx.style.borderColor = "#ff1ac6";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            var errm = "not reduced"; //done, no answer and not an implied 1";
            errBx.style.color = "#ff1ac6";
        	errBx.innerHTML = errm;
            allgood = false;
        } else if( ans && !ansisnum ) {
            ansBx.style.color = "#ff1ac6";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            allgood = false;
            var errm = ans + " is not a number";
            errBx.style.color = "#ff1ac6";
        	errBx.innerHTML = errm;
        } else if( i%2 === 0 ) {
            if( prevnIsnum && prevdIsnum && 
                (nPrevn%nAns !== 0 || nPrevd%nAns !== 0) ) {
                ansBx.style.color = "#ff1ac6";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                var errm = ans + " needs to evenly divide " + prevnum + " and " + prevden;
                errBx.style.color = "#ff1ac6";
        		errBx.innerHTML = errm;
            } else if( currnum && !isNaN(currnum) && ans !== currnum ) {
                ansBx.style.color = "#ff1ac6";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                var errm = "Denominator: " + ans + " needs to equal numerator " + currnum;
                errBx.style.color = "#ff1ac6";
        		errBx.innerHTML = errm;
            } else {
                ansBx.style.color = "#0033cc";
                ansBx.style.borderColor = "#e9d398";
                errBx.style.color = "#fff9ea";
            }
        } else if( i%2 === 1 ) {
            var ncurrnum = num(currnum);
            var rdfrac = reduce( ncurrnum, nAns);
            if( prev2num && prevden && prev2dIsnum && prevdIsnum &&
                nPrev2d/nPrevd !== nAns && nPrev2d/nPrevd !== 1 ) {
                ansBx.style.color = "#ff1ac6";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                var errm = "Denominator: " + ans + " is not " + prev2den + " / " + prevden;
                errBx.style.color = "#ff1ac6";
        		errBx.innerHTML = errm;
            } else if( currnum && !isNaN(currnum) && ( ncurrnum !== rdfrac.n || nAns !== rdfrac.d) && 
                    !nextnum ) {
                ansBx.style.color = "#ff1ac6";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                allgood = false;
                var errm = currnum + " / " + ans + " is not reduced";
                errBx.style.color = "#ff1ac6";
        		errBx.innerHTML = errm;
            } else {
                ansBx.style.color = "#0033cc";
                ansBx.style.borderColor = "#e9d398";
                errBx.style.color = "#fff9ea";
            }
        } else {
            ansBx.style.color = "#ff1ac6";
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
        doc.getElementById("chkBx").style.borderColor = "#ff1ac6";
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
            var par = extract( ansBx.id );
        	var col = par.c;
            var nextCol = col + 1;
            var nextBx = doc.getElementById("d0_" + col); // for now
            var frstdcol = extract( doc.getElementById("startHere").value ).c;
            var frstncol = frstdcol - 1;
        	var scnddcol = frstdcol + 1;
        	var thrddcol = frstdcol + 2;
        	var frthdcol = frstdcol + 3;
        	var fakecol = col < 12? col : col - 13 + frstdcol;
        	var wcol = frstdcol - 3;
        	var ocol = frstdcol - 2;
            var whlprt = num(doc.getElementById("n0_" + wcol).value);
            var oden = num(doc.getElementById("d0_" + ocol).value);
            var onum = num(doc.getElementById("n0_" + ocol).value);
            var prevCol = col - 1;
            var prevNum;
            var prevDen;
            var thisDen;
            var instr2;
            var instr3;
            var nAns = num(ans);
            var expAns = fakecol === frstncol? whlprt : 
            			fakecol === frstdcol? oden :
            			fakecol === scnddcol? onum :
            			fakecol === thrddcol? whlprt*oden + onum :
            			97; // large prime, never to be expected
            if( fakecol < frthdcol && nAns === expAns ) { 
                instr2 = "Copy denominator: " + oden + " to second numerator box";
                if( fakecol === frstdcol ) {
                    instr2 = "Copy numerator of mixed number: " + onum + " to third box";
                } else if( fakecol === scnddcol ) {
                    instr2 = "What is " + whlprt + " &times " + oden + " + " + onum;
                }
                nextBx = doc.getElementById("n0_" + nextCol);
                if( fakecol > frstdcol ) {
                    instr2 = "Copy first denominator: " + oden + " to denominator";
                    nextBx = doc.getElementById("d0_" + col);
                }
                markGood( ansBx, instr2, "", nextBx );
            } else if( fakecol > thrddcol && col%2 === 0 ) {
                prevNum = doc.getElementById("n0_" + prevCol).value;
                prevDen = doc.getElementById("d0_" + prevCol).value;
                thisDen = doc.getElementById("d0_" + col).value;
                if( (thisDen && isNaN(thisDen)) || isNaN(prevNum) || isNaN(prevDen) ) {
                    var errm = "Fix one or all of the following previous bad entries first: " + prevNum + ", " + prevDen + ", " + thisDen;
        			markErr( errm, ansBx );
                } else if( thisDen && ans !== thisDen ) {
                    var errm = "Numerator: " + ans + " needs to be the same value as denominator: " + thisDen + " or you are changing the value of the fraction, not converting it.";
                    markErr( errm, ansBx );
                } else if( num(prevNum)%nAns !== 0 || num(prevDen)%nAns !== 0 ) { // not catching. fixit
                    var errm = ans + " needs to evenly divide " + prevNum + " and " + prevDen;
                    markErr( errm, ansBx );
                } else {
                    nextBx = doc.getElementById("d0_" + col);
                    instr2 = "Copy numerator to denominator so the number you are dividing by is 1";
                    if( nextBx.value ) {
                        instr2 = "What is " + prevNum + " &divide " + ans;
                        nextBx = doc.getElementById("n0_" + nextCol);
                    }
                    markGood( ansBx, instr2, instr3, nextBx );
                }
            } else if( fakecol > thrddcol && col%2 === 1 ) {
                var prevNum = doc.getElementById("n0_" + prevCol).value;
                var prev2col = col - 2;
                var prev2Num = doc.getElementById("n0_" + prev2col).value;
                prevDen = doc.getElementById("d0_" + prevCol).value;
                if( !prevNum || !prev2Num || isNaN(prevNum) || isNaN(prev2Num) ) {
                    var errm = "Fix one or all of the following previous bad entries first: " + prevNum + ", " + prev2Num;
        			markErr( errm, ansBx );
                } else if( num(prev2Num)/num(prevNum) !== nAns ) {
                    var errm = prev2Num + " divided by " + prevNum + " is not " + ans;
                    markErr( errm, ansBx );
                } else {
                    var p = "d0_" + col;
                    nextBx = doc.getElementById(p);
                    var thisDen = nextBx.value;
                    var prev2Den = doc.getElementById("d0_" + prev2col).value;
                    instr2 = "What is " + prev2Den + " &divide " + prevDen;
                    instr3 = "";
                    if( thisDen ) {
                        var nextcol = col + 1;
                        nextBx = doc.getElementById("d0_" + nextcol);
                        nextBx.type = "text";
                        instr2 = "Is there an integer that divides both " + thisDen + " and " + ans + "?";
                        instr3 = " If so enter it, otherwise click 'Done'";
                        var othrBx = doc.getElementById("n0_" + nextcol);
                        othrBx.type = "text";
                        var par = othrBx.parentNode;
                        par.style.borderBottom = "2px solid #005511";
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
                    markGood( ansBx, instr2, instr3, nextBx );
                }
            } else { // one of 1st 4 numerators was wrong
            	var errm = ans + " needs to be " + expAns;;
                markErr( errm, ansBx );
            }
            
        } else {
            var errm = ans + " is not a number";
        	markErr( errm, ansBx );
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
        var par = extract( ansBx.id );
        var col = par.c;
        var nextcol = col + 1;
        var frstdcol = extract( doc.getElementById("startHere").value ).c;
        var scnddcol = frstdcol + 1;
        var thrddcol = frstdcol + 2;
        var fakecol = col < 12? col : col - 13 + frstdcol;

        if( !isNaN(ans) ) {
        	var ocol = frstdcol - 2;
        	var odenBx = doc.getElementById("d0_" + ocol);
            var oden = odenBx.value;
            if( ans && fakecol <= thrddcol && ans === oden ) {
 				var wcol = frstdcol - 3;
                var whlBx = doc.getElementById("n0_" + wcol);
                var whl = whlBx.value;
                if( fakecol === frstdcol ) {
                	var instr2 = "Copy whole part of mixed number: " + whl + " to first box";
                    nextcol = col - 1;
                    var nextBx = doc.getElementById("n0_" + nextcol);
                    markGood( ansBx, instr2, "", nextBx );	
                } else if( fakecol === scnddcol ) {
                	onum = doc.getElementById("n0_" + ocol).value;
                	var instr2 = "What is " + whl + " &times " + oden + " + " + onum;
                	var nextBx = doc.getElementById("n0_" + nextcol);
                	markGood( ansBx, instr2, "", nextBx );
                } else {
                    var thisNum = doc.getElementById("n0_" + col).value;
                    var instr2 = "Is there an integer that divides both " + thisNum + " and " + ans + "?";
                    var instr3 = 'If so, enter it. If not click "Done"';
                    nextcol = col + 1;
                    var nextBx = doc.getElementById("n0_" + nextcol);
                    markGood( ansBx, instr2, instr3, nextBx );
                }
            } else if( fakecol%2 === 0 && fakecol > thrddcol ) { // used to be col === 4
                var lastcol = col - 1;
                var prevN = doc.getElementById("n0_" + lastcol).value;
                var prevD = doc.getElementById("d0_" + lastcol).value;
                if( prevN && prevD && !isNaN(prevN) && !isNaN(prevD)) {
                    var nVal = num(prevN);
                    var dVal = num(prevD);
                    var aVal = num(ans);
                    var thisN = doc.getElementById("n0_" + col).value;
                    var evenlyDivides = nVal%aVal === 0 && dVal%aVal === 0;
                    var nExists = thisN && !isNaN(thisN);
                    var isEqualNum = nExists && aVal === num(thisN);
                    if( evenlyDivides && (!nExists || isEqualNum) ) {
                        nextBx = doc.getElementById("n0_" + col);
                        var instr2 = "Copy denominator to numerator so the number you are dividing by is 1"; 
                        if( thisN ) {
                            nextBx = doc.getElementById("n0_" + nextcol);
                            instr2 = "What is " + prevN+ " &divide " + thisN;
                        }
                        markGood( ansBx, instr2, "", nextBx );
                    } else {
                        var errm = !evenlyDivides? ans + " does not evenly divide " + prevN + " and " + prevD : 
                        							ans + " is not equal to " + thisN;
                        if( nExists && !evenlyDivides ) {
                        	errm = ans + " does not evenly divide " + prevN + " and " + prevD + " and ";
                        	errm +=  ans + " is not equal to " + thisN;
                        }
        				markErr( errm, ansBx );
                    }
                } else {
                    var errm = "fill in previous numerator and denominator first";
        			markErr( errm, ansBx );
                }
            } else if( fakecol%2 === 1 && fakecol > thrddcol ) { // used to be 5
                var prev2col = col - 2;
                var prevcol = col - 1;
                
                var prev2D = doc.getElementById("d0_" + prev2col).value;
                var prevD = doc.getElementById("d0_" + prevcol).value;
                var thisNid = "n0_" + col;
                var thisNum = doc.getElementById(thisNid);
                var currN = thisNum.value;
                var nAns = num(ans);
                if( prev2D && prevD &&
                    !isNaN(prev2D)&& !isNaN(prevD) &&
                    num(prev2D)/num(prevD) === nAns ) {
                    if( !currN ) {
                        nextBx = thisNum;
                        nextBx.type = "text";
                        var par = thisNum.parentNode;
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
                        var instr2 = "Copy denominator to numerator";
                        markGood( ansBx, instr2, "", nextBx );
                    } else {
                        var nextId = "n0_" + nextcol;
                        nextBx = doc.getElementById(nextId);
                        if( nextBx ) {
                        	nextBx.type = "text";
                        	var par = nextBx.parentNode;
	                        par.style.borderBottom = "2px solid #005511";
	                        var othrBx = doc.getElementById("d0_" + nextcol);
	                        othrBx.type = "text"; 
	                        doc.getElementById("e" + nextcol).innerHTML = "=";
	                        doc.getElementById("o" + nextcol).innerHTML ="&divide";
	                        nextcol = nextcol + 1;
	                        othrBx = doc.getElementById("n0_" + nextcol);
	                        othrBx.type = "text"; 
	                        var par = othrBx.parentNode;
	                        par.style.borderBottom = "2px solid #005511";
	                        othrBx = doc.getElementById("d0_" + nextcol);
	                        othrBx.type = "text";
	                        var instr2 = "Is there an integer that divides both " + currN + " and " + ans + "?";
	                        var instr3 = 'If so enter it, otherwise click "Done"';
	                        markGood( ansBx, instr2, instr3, nextBx );
						} else {
							var instr2 = 'You are out of boxes. Click "Done" to check if fraction is reduced';
							markGood( ansBx, instr2, "", null );
						}	           
                    }
                } else {
                    var errm = prev2D + " divided by " + prevD + " is not " + ans;
        			markErr( errm, ansBx );
                }
            } else { //one of 1st 2 denominators was wrong
                var errm = ans + " should be the same as the first denominator: " + oden;
        		markErr( errm, ansBx );
            }
        } else {
            var errm = ans + " is not a number";
        	markErr( errm, ansBx );
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
        var strtpos = id.indexOf("_") + 1;
        var numchars = len - strtpos;
        var col = num(id.substr(strtpos, numchars));
        var row = num(id.substr(1,strtpos - 2));

        var prevcol = col - 1;

        var prevD = doc.getElementById("d" + row + "_" + prevcol);
        var prevN = doc.getElementById("n" + row + "_" + prevcol);
        var currN = doc.getElementById("n" + row + "_" + col);
        // for simplification, need to check that numerator and denominator
        // are the same number and previous numerator and denominator
        // are divisible by it
        var errBx = doc.getElementById("instr4");
        var prevDV = prevD.value;
        var prevNV = prevN.value;
        if( !prevDV || !prevNV ) {
            markErr( "you need to enter something in previous boxes first", ansBx );
        } else {
            var nPrevD = num(prevDV); 
            var nPrevN = num(prevNV);
            var nAns = num(ans);
            var test = doc.getElementById("indcatr").value === "0";
            if( test ) { // simplifying
                if( nPrevD%nAns === 0 && nPrevN%nAns === 0 ) {
                    if( !currN || currN.value === "" || num(currN.value) === nAns ) {
                        ansBx.style.color = "#0033cc";
                        errBx.style.color = "#fff9ea";
                        if( currN ) {
                            if( currN.value ) {
                                var nextcol = col + 1;
                                var nextBx = doc.getElementById("d"+ row + "_" + nextcol);
                                markGood( ansBx, "What is " + prevDV + " &divide " + ans, "", nextBx );
                            } else {
                                var instr2 = "Copy denominator value into numerator so the number you are dividing by is 1";
                                markGood( ansBx, instr2, "", currN );
                            }
                        } else {
                            alert("numerator input doesn't exist");
                        }
                    } else {
                        var errm = "denominator: " + ans + " needs to be the same value as numerator: " + currN.value + " or you are changing the value of the fraction, not converting it.";
                        markErr( errm, ansBx );
                    }
                } else {
                    markErr( "denominator needs to evenly divide previous numerator and denominator", ansBx );
                }
            } else if( currN ) { // finding LCM and putting in order
                var currnVal = currN.value;
                if( isNaN(ans) ) {
                    markErr( ans + " is not a number", ansBx );
                } else if( currnVal ) {
                    if( ans !== currnVal ) {
        				markErr( ans + " needs to be the same as numerator", ansBx );
                    } else {
                        var nextcol = col + 1;
                        var nextBx = doc.getElementById("d"+ row + "_" + nextcol);
                        markGood( ansBx, "What is " + prevDV + " &times " + ans, "", nextBx );
                    }
                } else {
                    var op = "multiply";
                    if( test) {
                        op = "divid";
                    }
                    var instr2 = "Copy denominator value into numerator so the number you are " + op + "ing by is 1";
                    markGood( ansBx, instr2, "", currN );
                }
            }
        }
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
            markErr( ans + " is not a number", ansBx );
        } else {
            var nans = num(ans);
            if( frcnum &&  !isNaN(frcnum) ) {
                var nfrcnum = num(frcnum);
                if( nfrcnum/nans !== rem/oden ) {
                    numBx.style.color = "#ff1ac6";
                    partner = ansBx;
                    numBx.focus();
        			markErr ( frcnum + "/" + nans + " needs to equal " + rem + "/" + oden, ansBx );
                } else if ( id !== "d0_2" && ( nfrcnum !== rdfrac.n || nans !== rdfrac.d ) ) {
                    numBx.style.color = "#ff1ac6";
                    partner = ansBx;
                    numBx.focus();
        			markErr( frcnum + "/" + nans + " is not reduced", ansBx );
                } else {
                    numBx.style.color = "#0033cc";
                    if( id === "d0_2" ) {
                        var instr2 = 'If fraction is reduced, click "Done".';
                        var instr3 = "Otherwise copy the whole part of the mixed number.";
                        markGood( ansBx, instr2, instr3, doc.getElementById("n0_3") );
                    } else {
                        var instr2 = 'Click "Done"';
                        markGood( ansBx, instr2, "", null );
                    }
                }
            } else if( id === "d0_2" ) {
                if( nans === oden || nans === rdfrac.n) { // check id, if redNum, must be reduced
                    var whl = doc.getElementById("n0_1");
                    var instr2 = "Copy the whole part: " + whl;
                    markGood( ansBx, instr2, "", doc.getElementById("n0_3") );
                } else {
        			markErr( nans + " needs to be " + oden + " or " + rdfrac.d, ansBx );
                }
            } else {
               markGood( ansBx, "WHat goes here?", "", numBx );
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
        if( isNaN(ans) ) {
        	markErr( ans + " is not a number", ansBx );
        } else {
            var nans = num(ans);
            var id = ansBx.id;
            
            if( frcden && !isNaN(frcden) ) {
                if( nans/num(frcden) !== rem/oden ) {
        			denBx.style.color = "#ff1ac6";
                    partner = denBx;
                    var errm = nans + "/" + frcden + " needs to equal " + rem + "/" + oden;
        			markErr( errm, ansBx );
                } else if ( id !== "n0_2" && ( nans !== rdfrac.n || frcden !== rdfrac.d ) ) {                    
                    partner = denBx;
                    var errm = nans + "/" + frcden + " is not reduced";
        			markErr( errm, ansBx );
                } else {
                    if( id === "n0_2" ) {
                        var instr2 = "what now?";
                        markGood( ansBx, instr2, "", doc.getElementById("n0_3") );
                    } else {
                        var instr2 = 'Click "Done"';
                        markGood( ansBx, instr2, "", null );
                    }
                }
            } else if( id === "n0_2" ) {
                if( nans === rem || nans === rdfrac.n ) {
                    var instr2 = "Copy original denominator: '" + oden + "' to mixed number denominator";
                    markGood( ansBx, instr2, "", denBx );
                } else {                   
                    var errm = nans + " needs to be " + rem;
                    if( rem !== rdfrac.n ) {
                    	errm += " or " + rdfrac.n;
                    }
        			markErr( errm, ansBx );
        			ansBx.style.color = "#ff1ac6";
                }
            } else {
                if( nans === rdfrac.n ) {
	                var instr2 = "Divide denominator by the same number you divided the numerator by";
	                markGood( ansBx, instr2, "", denBx );
	            } else {
	            	var prevNum = doc.getElementById("n0_2").value;
	            	var prevDen = doc.getElementById("d0_2").value;
	            	markErr( "Need to divide previous numerator by GCD of " + prevNum + " and " +  prevDen, ansBx );
	            }
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
                markGood( ansBx, "Copy remainder: '" + ans + "' to numerator of mixed number", "", doc.getElementById("n0_2") );
            } else {
				markErr( dvdnd + " - " + prod + " is not " + ans, ansBx );
			}
        } else {
        	markErr( ans + " is not a number", ansBx );
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
        //var errBx = doc.getElementById("instr4");
        if( !isNaN( ans )) {
            var ansVal = num(ans);
            var dvsr = num(doc.getElementById("d0_0").value);
            var whlprt = num(doc.getElementById("n0_1").value);
            if( ansVal === dvsr*whlprt ) {
                var onum = doc.getElementById("onum").value;
                markGood( ansBx, "What is " + onum + " - " + ans, "", doc.getElementById("d1_1") );
            } else {
                var errm = dvsr + " times " + whlprt + " is not " + ans;
        		markErr( errm, ansBx );
            }
        } else {
            var errm = ans + " is not a number";
        	markErr( errm, ansBx );
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
        if( isNaN(ans) ) {
	        var errm = ans + " is not a number";
	        markErr( errm, ansBx );
        } else {
	        if( Math.floor(onum/oden) === num(ans) ) {
	            var nextBx = doc.getElementById("n0_4");
	            var instr2 = "Divide both numerator and denominator by some number to reduce fraction";
	            if( ansBx.id === "n0_1" ) {
	                nextBx = doc.getElementById("n1_1");
	                instr2 = "What is " + ans + " &times " + oden;
	            }
	            nextBx.focus();
	            markGood( ansBx, instr2, "", nextBx );
	        } else {            
	            var errm = onum + " divided by " + oden + " is not " + ans;
	            markErr( errm, ansBx );
	        }
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
        var oden = doc.getElementById("oden").value; 
        if( ans.localeCompare(oden) === 0  ) {
        	var num = doc.getElementById("d0_1").value;
            var instr2 = "What is " + num + " &divide " + ans;
            markGood( ansBx, instr2, "", doc.getElementById("n0_1") );
        } else {
        	markErr( ans + " is not " + oden, ansBx );
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
        var onum = doc.getElementById("onum").value;
        if( ans.localeCompare(onum) === 0 ) {
            var oden = doc.getElementById("oden").value;
            var instr2 = "Copy the denominator: '" + oden + "' to the box to the left of the 'divide by' sign";
            markGood( ansBx, instr2, "", doc.getElementById("d0_0") );
        } else {
        	markErr(ans + " is not " + onum, ansBx );
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
        var errBx = doc.getElementById("instr4");
        var len = id.length;
        var pos = id.indexOf("_");
        var col = num(id.substr(pos+1, len-pos-1));
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
            markErr( "you need to enter something in previous boxes first", ansBx );
        } else {
            var nPrevD = num(prevDV); 
            var nPrevN = num(prevNV);
            var nAns = num(ans);
            var test = doc.getElementById("indcatr").value === "0";
            if( test ) { // simplifying
                if ( nPrevD%nAns === 0 && nPrevN%nAns === 0 ) {
                    if( !currD || currD.value === "" || num(currD.value) === nAns ) {
                        ansBx.style.color = "#0033cc";
                        errBx.style.color = "#fff9ea";
                        if( currD ) {
                            if( currD.value ) {
                                var nextcol = col + 1;
                                var nextBx = doc.getElementById("n" + row + "_" + nextcol);
                                markGood( ansBx, "What is " + prevNV + " &divide " + ans, "", nextBx );
                            } else {
                                var instr2 = "Copy numerator value into denominator so the number you are dividing by is 1";
                                markGood( ansBx, instr2, "", currD );
                            }
                        } else {
                            alert("denominator input doesn't exist");
                        }    
                    } else {
                        var errm = "numerator: " + ans + " needs to be the same value as  denominator: " + currD.value + " or you are changing the value of the fraction, not converting it.";
                        markErr( errm, ansBx );
                    }
                } else {
                    markErr( "numerator needs to evenly divide previous numerator and denominator", ansBx );
                }
            } else if( currD ) { // finding LCD and putting in order
                var currdVal = currD.value;
                if( isNaN(ans) ) {
        			markErr( ans + " is not a number", ansBx );
                } else if( currdVal ) {
                    if( ans !== currdVal ) {
        				markErr( ans + " needs to be the same as " + currdVal, ansBx );
                    } else {
                        var nextcol = col + 1;
                        var nextBx = doc.getElementById("d"+ row + "_" + nextcol);
                        markGood( ansBx, "What is " + prevDV + " &times " + currdVal, "", nextBx );
                    }
                } else {
                    var instr2 = "Copy numerator value into denominator so the number you are multiplying by is 1";
                    markGood( ansBx, instr2, "", currD );
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
        
        var len = id.length;
        var pos = id.indexOf("_");
        var typ = id.substr(0,1);
        var col = num(id.substr(pos+1, len-pos-1));
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
            markErr( "you need to enter something in previous boxes first", ansBx );
        } else {
            var nPrevD = num(prevDV); 
            var nPrev2D = num(prev2DV);
            var nAns = num(ans);
            var indcatr = doc.getElementById("indcatr");
            var testD = indcatr.value === "0";
            var testM = indcatr.value === "1";
            if( testD && nPrev2D / nPrevD === nAns ||
                testM && nPrev2D * nPrevD === nAns ) {
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
                    instr3 = "If so, enter it. Otherwise, click 'Done'";
                    if( testM ) {
                        instr2 = "Is there a factor one denominator has, but another does not? If so, enter the factor by the denominator";
                        instr3 = 'that does not have it. Once fractions are in order, click "Done"';
                    }
                    var nextcol = col + 1;
                    nextBx = doc.getElementById("d" + row + "_" + nextcol);
                    var othrBx = doc.getElementById("n" + row + "_" + nextcol);
                    othrBx.type = "text";
                    var par = othrBx.parentNode;
                    par.style.borderBottom = "2px solid #005511";
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
                markGood( ansBx, instr2, instr3, nextBx );
            } else {
                var whatOp = doc.getElementById("o0_1").innerHTML;
                markErr( prev2DV + " " + whatOp + " " + prevDV + " is not " + ans, ansBx );           
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
function extract( id ) {
	var num = Number;
	var len = id.length;
	//alert("extract id: " + id);
	var pos = id.indexOf("_");
	var typ = id.substr(0,1);
    var col = num(id.substr(pos+1, len-pos-1));
	var row = num(id.substr(1,pos-1));
	return {t:typ, c:col, r:row};
}
function checkDWhl( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) {  
		var ansBx = ev.target;
        var ans = ansBx.value;
        var par = extract( ansBx.id );
        var doc = document;
        var num = Number;
       	
       	if( !isNaN(ans) ) {
       		var whl = Math.floor(num(doc.getElementById("onum").value));
	       	if( num(ans) === whl ) {
		        var nextCol = par.c + 1;
		        var nextBx = "n0_" + nextCol;
		        var instr2 = "Copy the part to the right of the decimal point to numerator,";
		        instr2 += " ignoring leading and trailing zeros";
		        if( nextCol > 1 ) {
		        	instr2 = "Divide previous numerator by some number that evenly divides previous numerator and denominator";
		        }
		        markGood( ansBx, instr2, "", doc.getElementById(nextBx) );
		    } else {
		    	markErr( "Whole part needs to equal " + whl, ansBx );
		    }
		} else {
		   	markErr( ans + " is not a number", ansBx );
		}
	}
}
// needs to forgive putting in trailing zeros fixit
function checkDFrcN( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
    	var ansBx = ev.target;
        var num = Number;
        var doc = document;
		
        var ans = ansBx.value;
        var par = extract( ansBx.id );	
       	if( !isNaN(ans) ) {	
       		var nans = num(ans);
       		var col = par.c;
       		if( col === 1 ) {
	        	var onum = doc.getElementById("onum").value;
	        	var len = onum.length;
	        	var strtPt = onum.indexOf(".") + 1;
	        	var nchars = len - strtPt;
	        	var fracStr = onum.substr(strtPt, nchars);
	        	var trailZero = fracStr.substr(nchars-1, 1);
	        	while( trailZero === "0" ) {
	        		nchars = nchars - 1;
	        		fracStr = fracStr.substr(0,nchars);
	        		trailZero = fracStr.substr(nchars-1, 1);
	        	}
	        	var fracPt = num(fracStr);
	        	if( nans === fracPt ) {
	        		var nextBx = doc.getElementById("d0_" + col );
	        		var instr2 = "Put a '1' followed by as many 0's as there are digits to the right of the decimal point,";
	        		var instr3 = "ignoring trailing 0s";
	        		markGood( ansBx, instr2, instr3, nextBx );
	        	} else {
				   	markErr( ans + " needs to be " + fracPt, ansBx );
	        	}
	        } else { // col > 1
	        	//check if it's properly reduced
	        	var prevCol = col - 2;
	        	var prevNum = num(doc.getElementById("n0_" + prevCol).value);
	        	var numBx = doc.getElementById("d0_" + col);
	        	var denExists = numBx.value;
	        	if( prevNum % nans !== 0 ) {
				   	markErr( ans + " needs to divide " + prevNum + " evenly", ansBx );				   	
	        	} else if( denExists ) {
	        		if( !isNaN(denExists ) ) {
	        			nden = num(denExists);
	        			var prevDen = num(doc.getElementById("d0_" + prevCol).value);
	        			var ratio = prevDen/nden;
	        			if( prevDen/nden === prevNum/nans ) {
	        				// go to next whol part or numerator
	        				var whlPt = num(onum.substr(0, strtPt));
	        				var nextWCol = col + 1;
	        				var nextFCol = col + 2;
	        				var nextBx = doc.getElementById("n0_" + nextFCol);
	        				var nextDBx = doc.getElementById("d0_" + nextFCol);
	        				var eBx = doc.getElementById("e0_" + nextWCol);
	        				eBx.innerHTML = "=";
	        				nextBx.setAttribute("type", "text");
	        				nextDBx.setAttribute("type", "text");
	        				var instr2 = "Is there a number that evenly divides numerator and denominator?";
	        				var instr3 = " If so, divide by it, otherwise click 'Done'";
	        				       				
	        				if( whlPt !== 0 ) {
	        					instr3 = "If so, copy whole part, otherwise click 'Done'";
	        					nextBx = doc.getElementById("n0_" + nextWCol);	 
	        					nextBx.setAttribute("type", "text");
	        				}
	        				markGood( ansBx, instr2, instr3, nextBx );
	        			} else {
						   	var errm = prevDen + " needs to be divided by " + ratio + " the same as you divided the numerator";
						   	markErr( errm, ansBx );
	        			}
	        		} else {
					   	markErr( "Numerator: " + numExists + " is not a number", ansBx );					   	
	        		}
	        	} else {
	        		var nextBx = doc.getElementById("d0_" + col);
	        		markGood( ansBx, "Divide denominator by the same number you divided the numerator by", "", nextBx );
	        	}
	        }
		} else {
		   	markErr( ans + " is not a number", ansBx );		   	
		}      		
	}
}
function checkDFrcD( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
		var ansBx = ev.target;
		var num = Number;
        var doc = document;
        var ans = ansBx.value;
        var par = extract( ansBx.id );	
       	if( !isNaN(ans) ) {
       		var onum = doc.getElementById("onum").value;
       		var strtPt = onum.indexOf(".") + 1;      		
       		var col = par.c;
	       	if( col === 1 ) {	        	
	        	var len = onum.length;
	        	var strtPt = onum.indexOf(".") + 1;
	        	var nchars = len - strtPt;
	        	var fracStr = onum.substr(strtPt, nchars);
	        	var trailZero = fracStr.substr(nchars-1, 1);
	        	while( trailZero === "0" ) {
	        		nchars = nchars - 1;
	        		fracStr = fracStr.substr(0,nchars);
	        		trailZero = fracStr.substr(nchars-1, 1);
	        	}
	        	var minDigits = fracStr.length;
	        	var numZeros = Math.log10(num(ans));
	        	if( numZeros === minDigits ) {	
	                var instr2 = "If fraction is reduced, click 'Done', otherwise";
	                var instr3 = "copy whole part";
	        		// if there is a whole part, nextBx will be a whole number box
	        		var whl = Math.floor(num(onum));
	        		var nextCol = col + 1;
	        		var nextBx = doc.getElementById("n0_" + nextCol);
	        		if( whl === 0 ) {
	        			nextCol = nextCol + 1;
	        			nextBx = doc.getElementById("n0_" + nextCol);
	        			nextBx.setAttribute("type", "text");
	        			var styles = "border-bottom: 2px solid #005511";
						var td = nextBx.parentNode;
						td.setAttribute("style", styles);
	        			instr3 = "divide previous numerator by some number that evenly divides previous numerator and denominator";
	        		} else {
	        			var dBx = doc.getElementById("n0_3");
	        			dBx.type = "text";
						nextBx.setAttribute("type", "text");
						var styles = "border-bottom: 2px solid #005511";
						var td = dBx.parentNode;
						td.setAttribute("style", styles);
					}
					doc.getElementById("d0_3").type = "text";
					doc.getElementById("e0_2").innerHTML = "=";
	        		markGood( ansBx, instr2, instr3, nextBx );
	        	} else {
				   	markErr( ans + " should be a 1 followed by " + minDigits + " zeroes", ansBx );
	        	}
	        } else { // col > 1
	        	var origd = num(doc.getElementById("d0_1").value);
	        	if( origd%num(ans) !== 0 ) {
					markErr( ans + " needs to be a factor of " + origd, ansBx );
	        	} else {
		        	// check if there is a numerator
		        	// if there is, compare this fraction with previous fractions and see if it's reduced
		        	var nmr = doc.getElementById("n0_" + col).value;
		        	var orign = num(doc.getElementById("n0_1").value);
		        	if( nmr && nmr/num(ans) !== orign/origd ) {
					   	var errm = origd + " needs to be divided by the same number you divided " + orign + " by";
					   	markErr( errm, ansBx );
		        	} else {
						// go to next whol part or numerator
	        			var whlPt = num(onum.substr(0, strtPt));
	        			var nextWCol = col + 1;
	        			var nextFCol = col + 2;
	        			var eBx = doc.getElementById("e0_" + nextWCol);
	        			if( eBx ) {
	        				eBx.innerHTML = "=";
	        				var nextBx = doc.getElementById("n0_" + nextFCol);
		        			var nextDBx = doc.getElementById("d0_" + nextFCol);
		        			nextBx.setAttribute("type", "text");
		        			var styles = "border-bottom: 2px solid #005511";
							var td = nextBx.parentNode;
							td.setAttribute("style", styles);
		        			nextDBx.setAttribute("type", "text");
		        			var instr2 = "Is there a number that evenly divides numerator and denominator?";
		        			var instr3 = " If so, divide by it, otherwise click 'Done'";		
		        			if( whlPt !== 0 ) {
		        				instr3 = "If so, copy whole part, otherwise click 'Done'";
		        				nextBx = doc.getElementById("n0_" + nextWCol);	 
		        				nextBx.setAttribute("type", "text");
		        			}
	        			} else {
	        				alert("You ran out of boxes. Click 'Done' to see if fractiion is reduced");
	        				//startAgain();
	        			}
	        			markGood( ansBx, instr2, instr3, nextBx );
		        	}
		        }
	        }
	     } else {	
		   	markErr( ans + " is not a number", ansBx );
	     }
	}
}
function markGood( aBx, ins2, ins3, nBx ) {
	var doc = document;
	var errBx = doc.getElementById("instr4");
	errBx.style.color = "#fff9ea";
	if( aBx ) {
		aBx.style.color = "#0033cc";
		aBx.style.borderColor = "#e9d398";
	}
	if( partner ) {
		partner.style.borderColor = "#e9d398";
	}
	doc.getElementById("instr2").innerHTML = ins2;
	var instr3Bx = doc.getElementById("instr3");
	if( ins3 === "" ) {
		instr3Bx.style.color = "#fff9ea";
	} else {
	    instr3Bx.style.color = "#b38f00";
	    instr3Bx.innerHTML = ins3;
	}
	if( nBx ) {
		nBx.focus();
	} else {
		aBx.blur();
	}
}
function markErr( msg, aBx ) {
	var doc = document;
	aBx.style.color = "#ff1ac6";
	aBx.style.borderColor = "#ff1ac6";
	var errBx = doc.getElementById("instr4");
	errBx.style.color = "#ff1ac6";
	errBx.innerHTML = msg;
	var errs = Number(doc.getElementById("errs").value);
    doc.getElementById("errs").value = errs + 1;
}
function promptForNum() {
	var doc = document;
	var onum = Number(doc.getElementById("onum").value);
	if( onum >= 1 || onum === 0 ) {
		var errs = Number(doc.getElementById("errs").value);
        doc.getElementById("errs").value = errs + 1;
		doc.getElementById("F").style.color = "red";
		return;
	}
	var dBx = doc.getElementById("n0_1");
	dBx.type = "text";
	var styles = "border-bottom: 2px solid #005511";
	var td = dBx.parentNode;
	td.setAttribute("style", styles);
	dBx.focus();
	doc.getElementById("d0_1").type = "text";
	doc.getElementById("e0_0").innerHTML = "=";
	doc.getElementById("instr2").innerHTML = "Copy the part to the right of the decimal point to numerator,";
	var instr3Bx = doc.getElementById("instr3");
	instr3Bx.removeChild(instr3Bx.firstChild);
	instr3Bx.removeChild(instr3Bx.firstChild);
	instr3Bx.innerHTML = "ignoring leading and trailing zeros";	
	instr3Bx.style.color = "#b38f00";
}

function putWhlBox() {
	var doc = document;
	var onum = Number(doc.getElementById("onum").value);
	if( onum < 1 && onum !== 0) {
		var errs = Number(doc.getElementById("errs").value);
        doc.getElementById("errs").value = errs + 1;
		doc.getElementById("T").style.color = "red";
		return;
	}
	var whlBx = doc.getElementById("n0_0");
	whlBx.type = "text";
	whlBx.focus();
	var dBx = doc.getElementById("n0_1");
	dBx.type = "text";
	var styles = "border-bottom: 2px solid #005511";
	var td = dBx.parentNode;
	td.setAttribute("style", styles);
	doc.getElementById("d0_1").type = "text";
	doc.getElementById("e0_0").innerHTML = "=";
	doc.getElementById("instr2").innerHTML = "Copy the part to the left of decimal point";
	var instr3Bx = doc.getElementById("instr3");
	instr3Bx.removeChild(instr3Bx.firstChild);
	instr3Bx.removeChild(instr3Bx.firstChild);	
}
function divide(immFeedBkCk, col, qtDig) {
    var doc = document;

    var Num = Number;
    var whatRow = rowNo;
    var prevRow = whatRow - 1;
    var divisor = Num(doc.getElementById("oden").value);
    var ansBx = doc.getElementById("qt" + col);
    var ansTxt = "";
    ansTxt = ansBx.value;
    var nxtcol = col - 1;
    nextQuotBox = doc.getElementById("qt" + nxtcol);
    
    if( isNaN( ansTxt ) ) {
        markErr(ansTxt + " is not a number", ansBx);
        return;
    }
    var ans = Num(ansTxt);
    // calculate and store the product  and of this quotient digit and divisor
    // as well as the max digit of that product
    var prod = 0;
    var dvsrdigs = doc.getElementsByName("dvsrdigs");
    var dvsrdigslength = dvsrdigs.length;
    for (var i = 0; i < dvsrdigslength; ++i) {
        dvsrdigs[i].style.color = "black";
    }

    var qLength = doc.getElementsByName("quotdigs").length;
    var quotDigs = qLength;
    //nextQuotBox = doc.getElementsByClassName("c2").length + qLength - col;
    
    var rmdrDigs = doc.getElementsByName("rmdr").length;
    var mcarry = 0;
    var i = 0;
    var carryRow = quotDigs - 1 - col;
    var Mat = Math;
    for (; i < dvsrdigslength; i++) {
        var dbx = dvsrdigslength - 1 - i;
        var addProd = Num(dvsrdigs[dbx].value) * ans + mcarry;
        mcarry = Mat.floor(addProd / 10);
        var mDig = addProd % 10;
        if( dbx > 0 && i < dvsrdigslength - 1 ) {
            //var whatMcarry = doc.getElementById("hcm" + i + "_" + carryRow);
            var whatMcarry = doc.getElementById("cm" + i + "_" + carryRow);
            if( whatMcarry ) {
                gMcarries[i][carryRow] = mcarry;
            }
        }
        prod += Mat.pow(10, i) * mDig;
        doc.getElementById("statusBox" + x).innerHTML = "ans : " + ans + " dbx: " + dbx + " mcarry: " + mcarry + " addProd: " + addProd + " mDig: " + mDig;
        x = (x+1)%nSbxs;
    }
    prod += Mat.pow(10, i) * mcarry;
    var prodMxIdx = prod > 0 ? Mat.floor(Mat.log10(prod)) : 1;
    calcDig = prodMxIdx;
    gProd = prod;

    var dvdnd = 0;
    var dvdBxs = doc.getElementsByName("dvddigs");
    var dvdDigs = dvdBxs.length;
    for (var i = 0; i < dvdDigs; ++i) {
        if (dvdBxs[i].style.color === "red") {
            dvdBxs[i].style.color = "black";
        }
    }
    var restQAreZero = true;
    // this may not work in some cases where user has entered wrong qdigit fixit
    var quotient = Num(doc.getElementById("quotient").value);
    for (var i = 0; i < col; i++) {
        var ten2i = Mat.pow(10, i);
        var discard = quotient % ten2i;
        var qdigI = (quotient % Mat.pow(10, i + 1) - discard) / ten2i;
        if (qdigI !== 0) {
            restQAreZero = false;
        }
    }

    var pow = 0;
    var dvdDigVal = 0;
    var prodDigVal = 0;
    var discard = 0;
    var mainpart = 0;
    var caCol = 0;
    var whatCarry = "";
    var caBx = null;
    var borCol = 0;
    var whatBorBx = "";
    var borBx = null;
    var dividnd = Num(doc.getElementById("onum").value);

    //var carries = new Array();
    //var borrows = new Array();
    if (whatRow === 0) {
        //var i = dvdBxs.length;
        var leadzeros = 0;
        // add leading zeros
        var i = 0;
        var partDigs = dvdDigs - 1;
        var throwway = dividnd%Mat.pow(10,partDigs);
       	var dvdpart =( dividnd - throwway)/Mat.pow(10,partDigs);
        while( divisor > dvdpart ) {
            i += 1;
            leadzeros += 1;
            partDigs = partDigs - 1;
            throwway = dividnd%Mat.pow(10,partDigs);
            dvdpart =( dividnd - throwway)/Mat.pow(10,partDigs);
            doc.getElementById("statusBox" + x).innerHTML = "line 461 dividnd: " + dividnd + " throwway: " + throwway + " dvdpart: " + dvdpart + " offset: " + i;
            x = (x + 1)%nSbxs;
        }
            
        doc.getElementById("statusBox" + x).innerHTML = "dvdBxs.length = " + dvdBxs.length + " quotDigs = " + quotDigs + " i = " + i;
        x = (x + 1)%nSbxs;
        while (i >= 0) {
            dvdDigVal = Num(dvdBxs[i].value);
            var ten2pow = Mat.pow(10, pow);
            dvdnd += ten2pow * dvdDigVal;
            doc.getElementById("statusBox" + x).innerHTML = "whatRow = " + whatRow + ", pow = " + pow + ", i = " + i + ", dvdnd = " + dvdnd;
            x = (x + 1)%nSbxs;
            // if there was a borrow, decrement dvdDigVal
            if (pow > 0) {
                caCol = pow + quotDigs - 2 - leadzeros;
                //whatCarry = "hca" + caCol + "_" + whatRow;
                whatCarry = "ca" + caCol + "_" + whatRow;
                //doc.getElementById("statusBox" + x).innerHTML = "whatRow = " + whatRow + ", pow = " + pow + ", checking whatCarry = " + whatCarry;
                //x = x + 1;
                caBx = doc.getElementById(whatCarry);
                borCol = caCol + 1;
                //whatBorBx = "hbo" + borCol + "_" + whatRow;
                whatBorBx = "bo" + borCol + "_" + whatRow;
                borBx = doc.getElementById(whatBorBx);
                if (borBx && caBx) {
                    //if (Num(caBx.value) === 1) {
                    if( gCarries[caCol][whatRow] === 1 ) {
                        --dvdDigVal;
                        // store the new borrowed value
                        //borBx.value = dvdDigVal;
                        gBorrows[borCol][whatRow] = dvdDigVal;
                        //doc.getElementById("statusBox" + x).innerHTML = "storing new value: " + dvdDigVal + " at " + whatBorBx;
                        //x = x + 1;
                    } else {
                        //borBx.value = "-2";
                        gBorrows[borCol][whatRow] = -2;
                    }
                }
            }
            discard = prod % ten2pow;
            mainpart = prod % Mat.pow(10, pow + 1);
            prodDigVal = (mainpart - discard) / ten2pow;
            doc.getElementById("statusBox" + x).innerHTML = "whatRow = " + whatRow + " pow = " + pow + " dvdDigVal = " + dvdDigVal + " prodDigVal = " + prodDigVal;
            x = (x + 1)%nSbxs;
            caCol = pow + quotDigs - 1 - leadzeros;
            //whatCarry = "hca" + caCol + "_" + whatRow;
            whatCarry = "ca" + caCol + "_" + whatRow;
            caBx = doc.getElementById(whatCarry);
            if (caBx) {
                if (dvdDigVal < prodDigVal) { // this digit has a carry
                    //caBx.value = 1;
                    gCarries[caCol][whatRow] = 1;
                    //doc.getElementById("statusBox" + x).innerHTML = "storing carry at " + whatCarry;
                    //x = x + 1;
                } else {
                    //caBx.value = 0;
                    gCarries[caCol][whatRow] = 0;
                }
            }
            --i;
            ++pow;
        }
    } else {
        var whatDvdBxs = "op" + prevRow + "_1";
        dvdBxs = doc.getElementsByName(whatDvdBxs);
        for (var i = 0; i < dvdBxs.length; ++i) {
            dvdBxs[i].style.color = "black";
        }
        var bdBxs = doc.getElementsByName("bd" + prevRow);
        for (var i = 0; i < bdBxs.length; ++i) {
            bdBxs[i].style.color = "black";
        }
        var bringdown = gBringDownDigs[prevRow];

        var maxp = dvdBxs.length + bringdown;
        doc.getElementById("statusBox" + x).innerHTML = "whatDvdBxs = " + whatDvdBxs + " dvdBxs.length = " + dvdBxs.length + " whatRow = " + whatRow + ", pow = " + pow + " maxp = "  + maxp + " bringdown = " + bringdown + " prevRow = " + prevRow;
        x = (x + 1)%nSbxs;
        while (pow < maxp) {
            if (pow < bringdown) {
                dvdDigVal = Num(bdBxs[bringdown - 1 - pow].value);
                doc.getElementById("statusBox" + x).innerHTML = "pow = " + pow + "bringdown = " + bringdown + " dvdDigVal = " + dvdDigVal;
                x = (x + 1)%nSbxs;
            } else {
                var dvdidx = maxp - 1 - pow;
                var whatDvdBx = dvdBxs[dvdidx];
                doc.getElementById("statusBox" + x).innerHTML = "pow = " + pow + " dvdidx = " + dvdidx + " whatDvdBx = " + whatDvdBx;
                x = (x + 1)%nSbxs;
                if (whatDvdBx !== null) {
                    dvdDigVal = Num(whatDvdBx.value);
                }
            }

            var ten2pow = Mat.pow(10, pow);
            dvdnd += ten2pow * dvdDigVal;
            doc.getElementById("statusBox" + x).innerHTML = "pow = " + pow + " dvdDigVal = " + dvdDigVal + " dividend = " + dvdnd;
            x = (x + 1)%nSbxs;
            // if there was a borrow, decrement dvdDigVal
            if (pow > 0) {
                caCol = pow + doc.getElementsByName('boca' + whatRow).length / 2 - dvdBxs.length - bringdown;
                //whatCarry = "hca" + caCol + "_" + whatRow;
                whatCarry = "ca" + caCol + "_" + whatRow;
                caBx = doc.getElementById(whatCarry);
                //doc.getElementById("statusBox" + x).innerHTML = "whatRow = " + whatRow + " pow = " + pow + ", checking whatCarry = " + whatCarry;
                //x = x + 1
                borCol = caCol + 1;
                //whatBorBx = "hbo" + borCol + "_" + whatRow;
                whatBorBx = "bo" + borCol + "_" + whatRow;
                borBx = doc.getElementById(whatBorBx);
                if (borBx && caBx) {
                    if( gCarries[caCol][whatRow] === 1 ) {
                        --dvdDigVal;
                        // store the new borrowed value
                        //borBx.value = dvdDigVal;
                        gBorrows[borCol][whatRow] = dvdDigVal;
                        //doc.getElementById("statusBox" + x).innerHTML = " pow = " + pow + " storing new value: " + dvdDigVal + " at " + whatBorBx;
                        //x = x + 1;
                    } else {
                        //borBx.value = "-2";
                        gBorrows[borCol][whatRow] = -2;
                    }
                }
            }
            discard = prod % ten2pow;
            mainpart = prod % Mat.pow(10, pow + 1);
            prodDigVal = (mainpart - discard) / ten2pow;
            //doc.getElementById("statusBox" + x).innerHTML = "mainpart = " + mainpart + " discard = " + discard + " prodDigVal = " + prodDigVal;
            //x = x + 1;
            caCol = pow + 1;
            //doc.getElementById("statusBox" + x).innerHTML = " pow = " + pow + " caCol = " + caCol;
            //x = x + 1;
            caCol += doc.getElementsByName("boca" + whatRow).length / 2;
            //doc.getElementById("statusBox" + x).innerHTML = "plus boca length/2 caCol = " + caCol;
            //x = x + 1;
            caCol -= dvdBxs.length;
            //doc.getElementById("statusBox" + x).innerHTML = "minus DvdBxs.length caCol = " + caCol;
            //x = x + 1;
            caCol -= bringdown;
            //doc.getElementById("statusBox" + x).innerHTML = "minus bringdown caCol = " + caCol;
            //x = x + 1;
            //whatCarry = "hca" + caCol + "_" + whatRow;
            whatCarry = "ca" + caCol + "_" + whatRow;
            caBx = doc.getElementById(whatCarry);
            //doc.getElementById("statusBox" + x).innerHTML = "whatCarry " + whatCarry + " caBx = " + caBx;
            //x = x + 1;
            if (caBx) {
                if (dvdDigVal < prodDigVal) {// this digit has a carry
                    gCarries[caCol][whatRow] = 1;
                    //doc.getElementById("statusBox" + x).innerHTML = "pow = " + pow + " storing carry at " + whatCarry;
                    //x = x + 1;
                } else {
                    gCarries[caCol][whatRow] = 0;
                }
            }
            ++pow;
        }
    }
    if (dvdnd < divisor && ans !== 0) {
        markErr(divisor + " does not go into " + dvdnd, ansBx);
        return;
    } else if (dvdnd >= divisor && ans === 0) { // this message is coming up when user types 1 (is not one, turns red and user hits enter - is there a way to disable enter? fixit
        markErr(divisor + " goes into " + dvdnd + " at least once", ansBx);
        return;
    }

    gDividend = dvdnd;
    gDiff = dvdnd - prod;

    var origDvdDigs = doc.getElementsByName("dvddigs");
    var bddigs = null;
    var bddigsLength = 0;
    var dvddigs;
    if (whatRow === 0) {
        dvddigs = origDvdDigs;
    } else {
        prevRow = whatRow - 1;
        dvddigs = doc.getElementsByName("op" + prevRow + '_1');
        bddigs = doc.getElementsByName("bd" + prevRow);
        bddigsLength = bddigs.length;
    }
    var stop = dvddigs.length;
    if (whatRow === 0) {
        stop = stop + 1 - quotDigs;
    }
    var time2increment = true;
    if (immFeedBkCk) {
        var dvddigs;
        var prevRow = null;
        if (whatRow > 0) {
            var prevRow = whatRow - 1;
        }
        if (ans === qtDig) {
            ansBx.style.color = "black";
            // turn divisor and either dividend or most recent difference black
            for (var i = 0; i < dvddigs.length; i++) {
                dvddigs[i].style.color = "black";
            }
            if (bddigs) {
                for (var i = 0; i < bddigsLength; i++) {
                    bddigs[i].style.color = "black";;
                    if (bddigs[i].type === "hidden") {
                        break;
                    }
                }
            }
            for (var i = 0; i < dvsrdigs.length; i++) {
                dvsrdigs[i].style.color = "black";
            }
        } else {
            // make divisor and either dividend or most recent difference red
            for (var i = 0; i < stop; i++) {
                dvddigs[i].style.color = "red";
            }
            if (bddigs) {
                for (var i = 0; i < bddigsLength; i++) {
                    bddigs[i].style.color = "red";
                }
            }
            for (var i = 0; i < dvsrdigs.length; i++) {
                dvsrdigs[i].style.color = "red";
            }
            //doc.getElementById("msg").innerHTML = "not " + ans;
            time2increment = false;
        }

    }
    var nextBx;
    if (time2increment) {
        var nextbox = whatbox;
        if (ans === 0) {
            ansBx.style.color = "black"; // it's already been checked
            if (doc.getElementById("Round Off").checked) {
                ansBx.onclick = roundOff;
                ansBx.onkeyup = checkRoundOff;
            }
            var isRemainder = doc.getElementById("r0");
            // find the last opX_1 in the page
            var nextrow = doc.getElementsByName("op" + 0 + "_1");
            var lastrow = null;
            var lastRowNum = 0;
            for (var j = 1; ; ++j) {
                var lastrow = nextrow;
                nextrow = doc.getElementsByName("op" + j + "_1");
                lastRowNum = j;
                if (nextrow.length === 0) {
                    break;
                }
            }
            var lastRowLength = lastrow.length;
            var lastRowValue = lastrow[lastRowLength - 1].value;
            //doc.getElementById("statusBox" + x).innerHTML =  "lastRowNum = " + lastRowNum + " lastRowLength = " + lastRowLength + " last row least sig dig = " + lastRowValue;
            //x = x + 1;
            var remainder = Num.MAX_SAFE_INTEGER;
            if( lastRowValue ) {
                remainder = 0;
                var bdNum = lastRowNum - 1;
                var bringDownDigits = doc.getElementsByName("bd" + bdNum);
                var bdLength = bringDownDigits.length;
                //doc.getElementById("statusBox" + x).innerHTML =  "bringDownDigits = " + bringDownDigits + " bdLength = " + bdLength;
                //x = x + 1;
                var j = 0;
                for( var i = 0; i < bdLength; ++i ) {
                    var bdValue = bringDownDigits[bdLength-1-i].value;
                    if( bdValue ) { // don't count it unless it's filled in 
                        remainder += Num(bdValue)*Mat.pow(10,j);
                        ++j;
                    }
                    //doc.getElementById("statusBox" + x).innerHTML =  " bringdown i = " + i + " remainder = " + remainder;
                    //x = x + 1;
                }
                //doc.getElementById("statusBox" + x).innerHTML =  "between loops lastRowNum = " + lastRowNum + " lastRowLength = " + lastRowLength + " last row least sig dig = " + lastRowValue;
                //x = x + 1;
                for( var i = 0; i < lastRowLength; ++i ) {
                    remainder += Num(lastrow[lastRowLength-1-i].value)*Mat.pow(10,j);
                    ++j;
                    //doc.getElementById("statusBox" + x).innerHTML =  "diff i = " + i + " remainder = " + remainder;
                    //x = x + 1;
                }
            }
            if (col === 0 && isRemainder) { 
                doc.getElementById("dispR").style.color = "black";
                nextbox = nextbox + 1;
            // whatRow === 0 => 0.x
            } else if ((restQAreZero && remainder === 0) || whatRow === 0) { 
                ansBx.style.color = "black";
                if (col > 0) {
                    // skip multiplicative carries
                    nextbox = doc.getElementsByClassName("c2").length;
                    //doc.getElementById("statusBox" + x).innerHTML = "multiplicative carries nextbox = " + nextbox;
                    //x = x + 1;
                    var i = qLength - col;
                    nextbox += i;
                    //doc.getElementById("statusBox" + x).innerHTML = "quotient digit nextbox = " + nextbox;
                    //x = x + 1;

                } else {
                    var bdlength = doc.getElementsByName("bd" + whatRow).length;
                    var offTheTable = bdlength > 0 ? bdlength : 1;
                    //offTheTable = 0;
                    //nextbox = lastBoxOfCurrRow + offTheTable;
                }
            } else {
                //nextbox = lastBoxOfCurrRow;
                //doc.getElementById("statusBox" + x).innerHTML = "last Box Of Current row nextbox = " + nextbox;
                //x = x + 1;
                if (nextbox === 0) {
                    // skip multiplicative carries
                    nextbox = doc.getElementsByClassName("c2").length - 1;
                    // skip quotient boxes
                    nextbox += qLength;
                    //doc.getElementById("statusBox" + x).innerHTML = "skip quotdigs and mcarries nextbox = " + nextbox;
                    //x = x + 1;
                    // skip remainder boxes
                    nextbox += rmdrDigs;
                    //doc.getElementById("statusBox" + x).innerHTML =  "remainder boxes nextbox = " + nextbox;
                    //x = x + 1; 
                    // skip borrow and carry boxes for original dividend
                    nextbox += doc.getElementsByName("boca0").length;
                    //doc.getElementById("statusBox" + x).innerHTML =  "skip borrows and carries nextbox = " + nextbox;
                    //x = x + 1;                
                }
                nextbox += 1;
                //doc.getElementById("statusBox" + x).innerHTML = "ans = 0, restQAreZero = false or col = 0, nextbox = " + nextbox;
                //x = x + 1;
            }
        } else { // start multiplying
            ansBx.style.color = "#b53f25";
            // clear out any previous guesses
            var name = 'op' + whatRow + '_0';
            var visibleMrow = doc.getElementsByName(name);
            for (var i = 0; i < visibleMrow.length; i++) {
                visibleMrow[i].value = "";
            }
            name = 'op' + whatRow + '_1';
            var Drow = doc.getElementsByName(name);
            for (var i = 0; i < Drow.length; i++) {
                Drow[i].value = "";
            }
            name = 'boca' + whatRow;
            var BoCaRow = doc.getElementsByName(name);
            for (var i = 0; i < BoCaRow.length; i++) {
                BoCaRow[i].value = "";
                BoCaRow[i].style.removeProperty("text-decoration");
            }
            if (whatRow === 0) {
                var prevDrow = doc.getElementsByName("dvddigs");
                var leadzeros = true;
                for (var i = 0; i < prevDrow.length; i++) {
                    if( !(leadzeros && Num(prevDrow[i].value) === 0) ) {
                        prevDrow[i].style.removeProperty("text-decoration");
                        leadzeros = false;
                    }
                }
            } else {
                name = 'op' + prevRow + '_1';
                var prevDrow = doc.getElementsByName(name);
                for (var i = 0; i < prevDrow.length; i++) {
                    prevDrow[i].style.removeProperty("text-decoration");
                }
                name = 'bd' + prevRow + '_1';
                var prevDrow = doc.getElementsByName(name);
                for (var i = 0; i < prevDrow.length; i++) {
                    prevDrow[i].style.removeProperty("text-decoration");
                }
            }
            var allcarries = doc.getElementsByClassName("c2");
            var allcarriesLength = allcarries.length;
            for (var i = 0; i < allcarriesLength; ++i) {
                var id = allcarries[i].getAttribute("id");
                //doc.getElementById("statusBox" + x).innerHTML = "carryRow = " + carryRow + " allcarries[" + i + "].id = " + id;
                //x = x + 1;
                if (Num(id.substring(4, 5)) === carryRow &&
                        id.substring(0, 2) === "cm") {
                    allcarries[i].value = "";
                }
            }
			var prodops = doc.getElementsByName("op" + whatRow + "_0");
			var lastprodop = prodops.length-1;
			nextBx = prodops[lastprodop];
        }

        //doc.getElementById("statusBox" + x).innerHTML = "final nextbox = " + nextbox;
        //whatbox = nextbox;
    }
    //alert("done with divide");
    markGood(ansBx, "What is " + ansTxt + " times " + divisor, "", nextBx);
}
function multiply( col, whatRow ) {
    var doc = document;
    //for (var j = 0; j < 30; j++) {
        //doc.getElementById("statusBox" + j).innerHTML = "";
    //}
    //var x = 0;
    var Num = Number;
    var ansBxs = doc.getElementsByName("op" + whatRow + "_0");
    var ansLength = ansBxs.length;
    var bxNo = ansLength - 1 - col;
    doc.getElementById("statusBox" + x).innerHTML = "in multiply, ansLength: " + ansLength + " whatRow: " + whatRow + " col: " + col + " bxNo: " + bxNo;
    x = (x + 1)%nSbxs;
    var ans = Num(ansBxs[bxNo].value);
    //var doc.getElementById("msg") = doc.getElementById("msg");
    // how many quotient digitsName("quotdigs").length);
    var dec = whatRow;

    var nextRow = whatRow + 1;
    //doc.getElementById("statusBox" + x).innerHTML = "in multiply whatRow = " + whatRow;
    //x = x + 1;
    for (var prevrow = whatRow - 1; prevrow >= 0; prevrow--) {
        var bringDowns = gBringDownDigs[prevrow];
        //doc.getElementById("statusBox" + x).innerHTML = "prevrow = " + prevrow + " whatBringDowns = " + whatBringDowns + " bringDowns = " + bringDowns;
        //x = x + 1;
        if (bringDowns > 0) {
            dec += bringDowns - 1;
            //doc.getElementById("statusBox" + x).innerHTML = "prevrow = " + prevrow + " bringDowns = " + bringDowns + " dec = " + dec;
            //x = x + 1;
        }
    }
    // actual quotient digits do we need both quotDigs and quotdigs? fixit
    // if number has trailing 0s q index needs to be offset by more
    var quotdigs = doc.getElementsByName("quotdigs");
    var qx = 0;
    if( quotdigs[qx].getAttribute("id").substr(0,2) === "xt" ) {
        ++qx;
    }
    var qLength = quotdigs.length;
    while( Num(quotdigs[qx].value) === 0 && qx < qLength ) {
        dec += 1;
        qx += 1;
    }
    var quotDigs = quotdigs.length;
    var qdx = quotDigs - 1 - dec; // not neccessarily whatRow if there was more than 1 bringdowns
    var qBx = doc.getElementById("qt" + qdx);
    if( !qBx ) {
    	qdx--;
    	qBx = doc.getElementById("qt" + qdx);
    }
    doc.getElementById("statusBox" + x).innerHTML = "in multiply qdx: " + qdx;
    x = (x + 1)%nSbxs;
    //var qtDig = Num(qBx.value);
    var dvsrdigs = doc.getElementsByName("dvsrdigs");
    var dvsrLength = dvsrdigs.length;
    var whatDvsrDg = dvsrLength - 1 - col;
    if (whatDvsrDg < 0) { // most significant 2 digits of product may both
        whatDvsrDg = 0;   // depend on the most significant digit of divisor
    }

    var prod = gProd; // Num(doc.getElementById("operand" + whatRow + "_0").value);
    var Mat = Math;
    var ten2col = Mat.pow(10, col);
    var discard = prod % ten2col;
    var mainpart = prod % Mat.pow(10, col + 1);

    //doc.getElementById("statusBox2").innerHTML = "prod = " + prod + " mainpart = " + mainpart + " discard = " + discard;
    var expAns = (mainpart - discard) / ten2col;
    doc.getElementById("statusBox" + x).innerHTML = "prod = " + prod + " mainpart = " + mainpart + " discard = " + discard + " ans: " + ans + " expAns: " + expAns;

    var prevcaBx = null;
    var cmx = 0;
    var startquot = quotDigs - 1;

    for (var i = startquot; i > qdx; i--) {
        cmx = cmx + 1;
    }

    //var showMcarriesChkd = doc.getElementsByName("showmcarries")[0].checked;
    var isLastMult = ( col === calcDig );

    if (isLastMult && col > 1) {
        var prevCol = dvsrLength - 2;
        //var whatBx = "hcm" + prevCol + "_" + cmx;
        var whatBx = "cm" + prevCol + "_" + cmx;
        //if (showMcarriesChkd) {
        //    whatBx = "cm" + prevCol + "_" + cmx;
        //}
        prevcaBx = doc.getElementById(whatBx);

        //doc.getElementById("statusBox" + x).innerHTML = "prevCaBx = " + whatBx;
        //x = x + 1;
    } else if (col > 0) {
        var prevCol = col - 1;
        //var whatBx = "hcm" + prevCol + "_" + cmx;
        var whatBx = "cm" + prevCol + "_" + cmx;
        //if (showMcarriesChkd) {
        //    whatBx = "cm" + prevCol + "_" + cmx;
        //}
        prevcaBx = doc.getElementById(whatBx);

        //doc.getElementById("statusBox" + x).innerHTML = "showMcarriesChkd = " + showMcarriesChkd + " whatBx = " + whatBx + " prevCaBx = " + prevcaBx;
        //x = x + 1;
    }
    if (ans === expAns) {
    	var prodops = doc.getElementsByName("op" + whatRow + "_0");
		var lastprodop = prodops.length-1;
		var nxtBxNo = bxNo - 1;
        qBx.style.color = "#b53f25";

        dvsrdigs[whatDvsrDg].style.color = "black";
        //ansBxs[bxNo].style.color = "black";
        //doc.getElementById("msg").innerHTML = "";
        if (isLastMult) {
            // check if user guessed too big
            if( prod > gDividend ) {
                var lastqtval = prod / Num(doc.getElementById("oden").value);
                doc.getElementById("msg").innerHTML = prod + " is too big, try a quotient digit value smaller than " + lastqtval;
                //nextbox = nextQuotBox - 1;
                //whatbox = nextbox;
                markErr( prod + " is too big, try a quotient digit value smaller than " + lastqtval, ansBxs[bxNo]);
                /* if (whatRow === 0) {
                    //lastBoxOfCurrRow = 0;
                } else { // back up to just after last subtraction box
                    var lastBox = lastBoxOfCurrRow;
                    lastBox -= ansLength;
                    while (doc.getElementById("th-id2").elements[lastBox].name.substring(0, 2) === 'bd') {
                        lastBox -= 1;
                    }
                    lastBoxOfCurrRow = lastBox + 1;
                } */
                qBx.style.color = "red";
                for (var i = 0; i < ansLength; ++i) {
                    ansBxs[i].style.color = "red";
                }
                for (var i = 0; i < dvsrLength; ++i) {
                    dvsrdigs[i].style.color = "red";
                }
                setDivFocus();
                return;
            }

            var visibleDrows = doc.getElementsByName("op" + whatRow + '_1');
            var visibleDrowsLength = visibleDrows.length;
            var name = "cspan" + whatRow;
            var visibleBar = doc.getElementById(name);
            if (visibleBar) {
                visibleBar.className = "th-id3";
            }
            var visibleMinus = doc.getElementById("minus" + whatRow);
            if (visibleMinus) {
                visibleMinus.className = "t1";
            }


            prodops = doc.getElementsByName("op" + whatRow + "_1");
			lastprodop = prodops.length-1;
			nxtBxNo = lastprodop;

        }   
        
		nextBx = prodops[nxtBxNo];
        markGood( ansBxs[bxNo], "what now?", "", nextBx );
    } else {
        //doc.getElementById("msg").innerHTML = expAns + " not " + ans;
        //doc.getElementById("msg").innerHTML = "not " + ans;
        qBx.style.color = "red";
        dvsrdigs[whatDvsrDg].style.color = "red";
        if( prevcaBx ) {
            prevcaBx.value = gMcarries[prevCol][cmx];
            prevcaBx.type = "text";
            prevcaBx.style.color = "red";
        }
        markErr("mult digit " + ans + " not expected answer " + expAns, ansBxs[bxNo]);
    }
    
    //setDivFocus();
}
function subtract(col, sbx) {
    var doc = document;
    var Num = Number;
    var ansBxs = doc.getElementsByName("op" + sbx + "_1");
    var bxNo = ansBxs.length - 1 - col;
    doc.getElementById("statusBox" + x ).innerHTML = "col = " + col + " ansBxs = " + ansBxs + " length = " + ansBxs.length + " bxNo = " + bxNo;
    x = (x + 1)%nSbxs;
    var ans = Num(ansBxs[bxNo].value);
    var whatprodboxes = "op" + sbx + "_0";
    var prodBxs = doc.getElementsByName(whatprodboxes);
    var subBxs;
    var dvdidx = 0;
    var prodidx = prodBxs.length - 1 - col;
    var prodBx = prodBxs[prodidx];
    var dvdBx;
    var borCol = col;
    //doc.getElementById("statusBox" + x).innerHTML = "col = borCol = " + borCol;
    //x = x + 1;
    var prevRow = 0;
    var subBxsLength = 0;

    if (sbx === 0) {
        
        subBxs = doc.getElementsByName("dvddigs");
        subBxsLength = subBxs.length;
        //var quotDigs = doc.getElementById("quotDigs").value;
        
        
        var quotdigs = doc.getElementsByName("quotdigs"); // actual digits
        var quotdigsLength = quotdigs.length;
        dvdidx = subBxsLength - quotdigsLength - col;
        var qdx = 0;
        doc.getElementById("statusBox" + x).innerHTML = "quotdigs[" + qdx + "] = " + quotdigs[qdx].value + " dvdidx = " + dvdidx + " length = " + quotdigsLength;
        x = (x + 1)%nSbxs;
        while( Num(quotdigs[qdx].value) === 0 && qdx < quotdigsLength ) {
            dvdidx += 1;
            qdx += 1;
            doc.getElementById("statusBox" + x).innerHTML = "quotdigs[" + qdx + "] = " + quotdigs[qdx].value + " dvdidx = " + dvdidx;
            x = (x + 1)%nSbxs;
        }
        doc.getElementById("statusBox" + x).innerHTML = "subBxsLength = " + subBxsLength + " quotdigsLength = " + quotdigsLength + " col = " + col + " dididx = " + dvdidx;
        x = (x + 1)%nSbxs;
        dvdBx = subBxs[dvdidx];

        borCol = borCol + quotdigsLength - 1;
        var qx = 0;
        while( Num(quotdigs[qx].value) === 0 && qx < quotdigsLength ) {
            borCol -= 1;
            qx += 1;
        }
    } else {
        prevRow = sbx - 1;
        var whatboca = 'boca' + sbx;
        var bocaLength = doc.getElementsByName(whatboca).length;
        subBxs = doc.getElementsByName("op" + prevRow + "_1");
        subBxsLength = subBxs.length;
        var bdBxs = doc.getElementsByName("bd" + prevRow);
        //doc.getElementById("statusBox" + x).innerHTML = "col = " + col +   " borCol = " + borCol;
        //x = x + 1;
        borCol = borCol + bocaLength / 2;
        //doc.getElementById("statusBox" + x).innerHTML = "whatboca = " + whatboca + " bocaLength/2 =  " + (bocaLength/2)  + " borCol = " + borCol;
        //x = x + 1;
        borCol = borCol - subBxsLength;
        //doc.getElementById("statusBox" + x).innerHTML = "subBxsLength = " + subBxsLength + " borCol = " + borCol;
        //x = x + 1;
        //borCol = borCol - Num(doc.getElementById("bringdown" + prevRow).value);
        var prevBringDownDigs = gBringDownDigs[prevRow];
        borCol = borCol - prevBringDownDigs;
        //doc.getElementById("statusBox" + x).innerHTML = "bdBxs.length = " + prevBringDownDigs + " borCol = " + borCol;
        //x = x + 1;
        borCol = borCol + 1;
        //doc.getElementById("statusBox" + x).innerHTML = "plus 1 borCol = " + borCol;
        //x = x + 1;

        var inc = prevBringDownDigs - 1;
        dvdidx = inc - col;
        //doc.getElementById("statusBox" + x).innerHTML = " inc = " + inc + " col = " + col + " dididx = " + dvdidx;
        //x = x + 1;
        if (col > inc) {
            //var calcDig = Num(doc.getElementById("calcDig" + prevRow + "_1").value) + 1;
            dvdidx = dvdidx + subBxsLength;
            //doc.getElementById("statusBox" + x).innerHTML = "inc = " + inc + " col = " + col + " calcDig = " + calcDig + " dvdidx = " + dvdidx;
            //x = x + 1;
            dvdBx = subBxs[dvdidx];
        } else {
            dvdBx = bdBxs[dvdidx];
        }
        //doc.getElementById("statusBox" + x).innerHTML = "dvdidx = " + dvdidx;
        //x = x + 1;
    }
    var diff = gDiff; // Num(doc.getElementById("operand" + sbx + "_1").value);
    var whatBorBx = "bo" + borCol + "_" + sbx;
    //doc.getElementById("statusBox" + x).innerHTML = "993 whatBorBx = " + whatBorBx;
    //x = x + 1;
    var borBx = null;
    borBx = doc.getElementById(whatBorBx);
    //var hiddenBorBx = null;
    //hiddenBorBx = doc.getElementById("hbo" + borCol + "_" + sbx);
    var whatCarry = "ca" + borCol + "_" + sbx;
    var caBx = null;
    caBx = doc.getElementById(whatCarry);
    //var hiddenCaBx = null;
    //hiddenCaBx = doc.getElementById("hca" + borCol + "_" + sbx);
    //doc.getElementById("statusBox" + x).innerHTML = "sbx = " + sbx + " col = " + col + " whatBorBx = " + whatBorBx + " whatCarry = " + whatCarry;
    //x = x + 1;
    var Mat = Math;
    var ten2col = Mat.pow(10, col);
    var discard = diff % ten2col;
    var mainpart = diff % Mat.pow(10, col + 1);

    var expAns = (mainpart - discard) / ten2col;
    var lastDig = diff > 0 ? Mat.floor(Mat.log10(diff)) : 0;
    var isLastSub = (col === lastDig);
    //doc.getElementById("statusBox" + x).innerHTML = "diff " + diff + " lastDig = " + lastDig + " col = " + col + " isLastSub = " + isLastSub;
    //x = x + 1;
    if (ans === expAns) {
        var nextbox = 0;
        ansBxs[bxNo].style.color = "black";
        //var whatHelp = doc.getElementsByName("showborrows");
        var showBrowsChkd = false;
        //showBrowsChkd = whatHelp[0].checked;
        if (borBx) {
            borBx.style.color = "black";
            if (!showBrowsChkd) {
                borBx.type = "hidden";
                dvdBx.style.removeProperty("text-decoration");
            }
        }

        if (caBx) {
            caBx.style.color = "black";
            if (!showBrowsChkd) {
                caBx.type = "hidden";
                dvdBx.style.removeProperty("text-decoration");
            }
        }
        //dvdBx.style.color = "black";
        prodBx.style.color = "black";
        //doc.getElementById("msg").innerHTML = "";
		var nextBx;
        if (isLastSub) {
            // hide the "Click on a digit to borrow from it" message
            var displayBorrow = doc.getElementById("dispBo");
            if( displayBorrow ) {
                displayBorrow.style.color = getComputedStyle(displayBorrow).backgroundColor;
            }
            var divisor = Num(doc.getElementById("oden").value);
            var quotDigs = doc.getElementsByName("quotdigs").length;
            var lastqcol = quotDigs - 1;
            if (diff >= divisor) { // quotient digit was guessed too small, back up
                //var prod = Num(doc.getElementById("operand" + sbx + "_0").value);
                //doc.getElementById("statusBox" + x).innerHTML = "prod = " + prod + " divisor = " + divisor;
                //x = x + 1;
                //nextbox = nextQuotBox - 1;
                //whatbox = nextbox;
                --rowNo;
                //var all = doc.getElementById("th-id2");
                //var qtDigVal = all.elements[nextbox].value;
                var qid = nextQuotBox.id
                var qidx = qid.indexOf("t") + 1;
                var qlen = qid.length;
                var nchars = qlen - qidx;
                lastqcol = qid.substr(qidx, nchars) + 1;
                var qtDigVal = doc.getElementById("qt" + lastqcol).value;
                //doc.getElementById("msg").innerHTML = diff + " is too big, " + divisor + " goes into " + currDividend + " more than " + qtDigVal + " times";
                //doc.getElementById("msg").innerHTML = diff + " is too big, " + divisor + " goes into " + gDividend + " more than " + qtDigVal + " times";
				markErr(diff + " is too big, " + divisor + " goes into " + gDividend + " more than " + qtDigVal + " times", ansBxs[bxNo]);
                var diffdigs = doc.getElementsByName("op" + sbx + "_1");
                var diffdigsLength = diffdigs.length;
                if (sbx === 0) {
                    lastBoxOfCurrRow = 0;
                } else { // back up to just after last subtraction box
                    var lastBox = lastBoxOfCurrRow;
                    //doc.getElementById("statusBox" + x).innerHTML = "in subtract, sbx > 0, lastBox = " + lastBox;
                    //x = x + 1;
                    lastBox -= diffdigsLength;
                    //doc.getElementById("statusBox" + x).innerHTML = "back off subtract boxes, lastBox = " + lastBox;
                    //x = x + 1;
                    var nextRow = sbx + 1;
                    lastBox -= doc.getElementsByName("boca" + nextRow).length;
                    //doc.getElementById("statusBox" + x).innerHTML = "back off borrow and carry boxes, lastBox = " + lastBox;
                    //x = x + 1;
                    lastBox -= doc.getElementsByName("op" + sbx + "_0").length;
                    //doc.getElementById("statusBox" + x).innerHTML = "back off product boxes, lastBox = " + lastBox;
                    //x = x + 1;
                    while (all.elements[lastBox].name.substring(0, 2) === 'bd') {
                        lastBox -= 1;
                    }
                    //doc.getElementById("statusBox" + x).innerHTML = "back off bring down boxes, lastBox = " + lastBox;
                    //x = x + 1;
                    //lastBoxOfCurrRow = lastBox + 1;
                }
                var dvsrdigs = doc.getElementsByName("dvsrdigs");
                var dvsrdigsLength = dvsrdigs.length;
                for (var i = 0; i < dvsrdigsLength; ++i) {
                    dvsrdigs[i].style.color = "red";
                }
                for (var i = 0; i < diffdigsLength; ++i) {
                    diffdigs[i].style.color = "red";
                }
                var dvddigs = doc.getElementsByName("op" + prevRow + "_1");
                var dvdlen = dvddigs.length;
                if (sbx === 0) {
                    dvddigs = doc.getElementsByName("dvddigs");
                    dvdlen = dvddigs.length - quotDigs + 1;
                    var quotmx = quotdigsLength - 1;
                    var qx = 0;
                    while( qx < quotmx && Num(quotdigs[qx].value) === 0 ) {
                        dvdlen++;
                        qx++;
                    }
                }
                for (var i = 0; i < dvdlen; ++i) {
                    dvddigs[i].style.color = "red";
                }

                var bddigs = doc.getElementsByName("bd" + prevRow);
                var bddigsLength = bddigs.length;
                for (var i = 0; i < bddigsLength; ++i) {
                    bddigs[i].style.color = "red";
                }
                //setDivFocus();
                return;
            }
            
            var restAreZero = true;
            var origdividend = Num(doc.getElementById("onum").value);
            // start with the most significant digit of quotient, find where
            // the user left off typing in numbers, calculate what the rest of 
            // the quotient digits will be. If they are not all zero, then
            // restAreZero is false
            var lastFilledBx = null;
            for (var i = lastqcol; i >= 0; i--) {
                var quotBx = doc.getElementById("qt" + i);
                if ( lastFilledBx && quotBx && quotBx.value === "") { // need to make sure you have found at least one filled box
                    var ten2i = Mat.pow(10, i);
                    var discard = origdividend % ten2i;
                    var qdigI = (origdividend % Mat.pow(10, i + 1) - discard) / ten2i;
                    if (qdigI !== 0) {
                        restAreZero = false;
                        break;
                    }
                } else {
                    lastFilledBx = quotBx;
                    lastqcol = i; // at the end of the loop, this will have the
                    // last quotient column that has a value typed
                    // in it
                }
            }
            lastFilledBx.style.color = "black";
            doc.getElementById("statusBox" + x).innerHTML = "isLastSub restAreZero = " + restAreZero + " lastqcol = " + lastqcol + " whatbox = " + whatbox;
            //doc.getElementById("statusBox" + x).innerHTML = "isLastSub lastqcol = " + lastqcol + " whatbox = " + whatbox;
            x = (x + 1)%nSbxs;

            if( lastqcol === 0 ) { // done calculating this quotient
                // if there is a remainder
                var dispR = doc.getElementById("dispR");
                // if (Num(doc.getElementById("operand" + sbx + "_1").value) !== 0 && dispR ) {
                if( diff !== 0 && dispR ) {
                    dispR.style.color = "black";
                    nextbox = doc.getElementsByClassName("c2").length + quotDigs - lastqcol;
                } else { // nextbox is ID=nextbox 
                    //nextbox = lastBoxOfCurrRow + 1;
                    //doc.getElementById("statusBox" + x).innerHTML = "isLastSub restAreZero = " + restAreZero + " lastqcol = " + lastqcol + " nextbox = " + nextbox;
                    //doc.getElementById("statusBox" + x).innerHTML = "isLastSub lastqcol = " + lastqcol + " nextbox = " + nextbox;
                    //x = x + 1;
                }
            } else if (ans === 0 && restAreZero) {// nextbox is quotient box
                //nextbox = doc.getElementsByClassName("c2").length + quotDigs - lastqcol;
                nextBx = nextQuotBx;
                rowNo++;
                doc.getElementById("statusBox" + x).innerHTML = "nextBx: " + nextBx.id + " rowNo: " + rowNo;
                x = (x + 1)%nSbxs;
            } else { // nextbox is bringdown box

                // make bringdown box visible
                var visibleBrows = doc.getElementsByName("bd" + sbx);
                if (visibleBrows.length > 0) {
                    visibleBrows[0].type = "text";
                }
                //nextbox = lastBoxOfCurrRow + 1;
                nextBx = doc.getElementsByName("bd" + rowNo)[0];
                doc.getElementById("statusBox" + x).innerHTML = "bd rowNo: " + rowNo;
            	x = (x + 1)%nSbxs;
            }
            //if (doc.getElementById("Round Off").checked) {
                var prevQtDg = doc.getElementById("qt" + lastqcol);
                prevQtDg.onclick = roundOff;
                prevQtDg.onkeyup = checkRoundOff;
            //}
        } else { // not last subtraction, nextbox is another subtraction box
            //nextbox = whatbox - 1;
            var nxtBxNo = bxNo - 1;
            nextBx = ansBxs[nxtBxNo];
            doc.getElementById("statusBox" + x).innerHTML = "ansBxs nxtBxNo: " + nxtBxNo;
            x = (x + 1)%nSbxs;
        }
        //doc.getElementById("statusBox" + x).innerHTML = "final nextbox = " + nextbox;
        //whatbox = nextbox;
        var instr2 = nextBx? "nextBx: " + nextBx.id + " what now?" : "what now?";
        markGood(ansBxs[bxNo], instr2, "", nextBx);
        
    } else {
        // show borrows  or carries in case of error
        var caValue = 0;
        //doc.getElementById("statusBox" + x).innerHTML = "caBx = " + caBx;
        //x = x + 1;
        if (caBx !== null) {
            caValue = gCarries[borCol][sbx];
            //doc.getElementById("statusBox" + x).innerHTML = "caValue[" + borCol + "][" + sbx + "] = " + caValue;
            //x = x + 1;
            if (caValue === 1) {
                caBx.style.height = "1em";
                caBx.type = "text";
                caBx.style.color = "red";
                caBx.value = caValue;
            }
        }
        //if (hiddenBorBx !== null && Num(hiddenBorBx.value) >= -1) {
        if( borBx !== null && gBorrows[borCol][sbx] >= -1 ) {
            borBx.style.height = "1em";
            borBx.type = "text";
            borBx.style.color = "red";
            //var borVal = Num(hiddenBorBx.value);
            var borVal = gBorrows[borCol][sbx];
            //doc.getElementById("statusBox" + x).innerHTML = "hiddenBorBx.value = " + hiddenBorBx.value; 
            //x = x + 1;
            if (borVal < 0) {
                borVal += 10;
                caBx.style.setProperty("text-decoration", "line-through");
                caBx.style.color = "black";
            }
            borBx.value = borVal;
            //dvdBx.style.setProperty("text-decoration", "line-through");
        } else {
            dvdBx.style.color = "red";
        }
        prodBx.style.color = "red";
        //doc.getElementById("msg").innerHTML = expAns + " not " + ans;
        //doc.getElementById("msg").innerHTML = "not " + ans;
        //upDateErrCount();
        markErr("not " + ans, ansBxs[bxNo]);
    }
    //alert("done with subtract");
    //setDivFocus();
}
function roundOff( ev ) {
    ev = ev || window.event;
    var evTarg = ev.target;
    var doc = document;
    //for (var j = 0; j < 30; j++) {
        //doc.getElementById("statusBox" + j).innerHTML = "";
    //}
    //var x = 0;
    var Num = Number;
    var quotdigs = doc.getElementsByName("quotdigs");
    var quotLength = quotdigs.length;
    var startnow = false;
    var crossrest = false;
    var nSigDig = 4; // Num(doc.getElementById("nSigDig").value);
    //var quotDp = Number(doc.getElementById("quotDp").value);
    //var willBzeros = nSigDig >= quotDp - 1;
    //var doc.getElementById("msg") = doc.getElementById("msg");
    for( var i = 0; i < quotLength; ++i ) {
        var whatCol = quotLength - 1 - i;
        var whatQuotBx = quotdigs[i];

        if( !crossrest ) {
            if( whatQuotBx.isEqualNode(evTarg ) ) {
                var dispRnd = doc.getElementById("dispRnd");
                var clickedPlace = whatCol;
                if( clickedPlace === nSigDig ) {
                    startnow = true;
                    //doc.getElementById("msg").innerHTML = "";
                    //dispRnd.style.color = "red";
                    //dispRnd.innerHTML = "Enter rounded value";
                    //markErr(); // can't use this it upps the error count fixit
                    // insignificant digits start after the decimal point, 
                    // even if this is a significant digits problem, not a 
                    // decimal places problem, this digit will never be changed 
                    // to zero
                    if( nSigDig < quotDp - 1 ) {
                        
                        crossrest = true;
                        //doc.getElementById("statusBox" + x).innerHTML = "nSigDig = " + nSigDig +" quotDp = " + quotDp;
                        //x = x + 1;
                    }
                    var all = doc.getElementById("th-id2");
                    var length = all.length;
                    for( var j = 0; j < length; ++j ) { 
                        if( all.elements[j].isEqualNode(evTarg) ) {  
                            var nextbox = j - 1;
                            if( Num(evTarg.value) >= 5 ) {
                                while( all.elements[nextbox].value === "9") {
                                    --nextbox;                                       
                                }
                                // if rounding goes into new digit, either 0 or blank
                                if( Number(all.elements[nextbox].value) === 0 ) {
                                    // find out if it is new most dignificant digit of quotient
                                    if( all.elements[nextbox].getAttribute("id").substring(0,2) === "xt" ) {
                                        var newPlace = nSigDig + 1;
                                        if( newPlace < quotDp - 1 ) {
                                            quotdigs[quotLength - 1 - newPlace].style.setProperty("text-decoration", "line-through");
                                        }
                                        //doc.getElementById("statusBox" + x).innerHTML = "newPlace = " + newPlace +" quotDp = " + quotDp;
                                        //x = x + 1;
                                        doc.getElementById("nSigDig").value = newPlace;
                                    }
                                }
                            }
                            //doc.getElementById("statusBox" + x).innerHTML = "evTarg = " + evTarg.getAttribute("id") + " j = " + j + " nextbox = " + nextbox;
                            //x = x + 1;
                            whatbox = nextbox;
                        }
                    }
                } else {
                    var rndMsg = dispRnd.innerHTML;
                    var length = rndMsg.length;
                    rndMsg = rndMsg.substring(19, length); // strip out the first part
                    rndMsg = rndMsg.match(/[^,]*/); // keep everything up to the first comma
                    var instr4 = rndMsg + " is not there, finish the calculations if needed and click somewhere else";
                    //upDateErrCount();
                    markErr( instr4, evTarg );
                    break;
                }
            // reached the decimal point    
            } else if( willBzeros && whatCol < quotDp  - 1 ) {
                crossrest = true;
            }
        }
        if( startnow ) {
            whatQuotBx.onkeyup = checkRoundOff;
            var hasContent = whatQuotBx.value;
            if( hasContent && crossrest ) {
                whatQuotBx.style.setProperty("text-decoration", "line-through");
            }
        }
    }
    //doc.getElementById("statusBox" + x).innerHTML = "in roundOff about to setfocus nextbox = " + doc.getElementById("whatbox").value;
    //setDivFocus();
}
function checkRoundOff( ev ) {
    ev = ev || window.event;
    var ansBx = ev.target;
    var doc = document;
    //for (var j = 0; j < 30; j++) {
        //doc.getElementById("statusBox" + j).innerHTML = "";
    //}
    //var x = 0;
    //doc.getElementById("statusBox" + x).innerHTML = "in checkRoundOff";
    //x = x + 1;
    var Num = Number;
    //var doc.getElementById("msg") = doc.getElementById("msg")
    var id = ansBx.getAttribute("id");
    var idlen = id.length;
    var col = Num((id.substring(2,idlen)));
    var quotient = Num(doc.getElementById("quotient").value);
    var Mat = Math;
    var roundedQuot = Mat.floor((quotient + 5*Mat.pow(10,col-1))/Mat.pow(10,col));

    var header = doc.getElementById("F1");                   
    var significant = header.innerHTML;
    significant = significant.match(/significant/);
    var nSigDig = Num(doc.getElementById("nSigDig").value) + 1;
    var quotDigs = doc.getElementsByName("quotdigs");
    var qLength = quotDigs.length;
    if( significant && nSigDig > col ) {
        roundedQuot = Mat.floor((quotient + 5*Mat.pow(10,nSigDig-1))/Mat.pow(10,nSigDig));
        //document.getElementById("statusBox" + x).innerHTML = "roundedQuot = " + roundedQuot;
        //x = x + 1;
        var j = nSigDig - 1;
        while( j >= col ) {
            roundedQuot = 10*roundedQuot;
            //document.getElementById("statusBox" + x).innerHTML = "j = " + j + " roundedQuot = " + roundedQuot;
            //x = x + 1;
            j = j - 1;
        }
    }
    var enteredQuot = 0;
    //doc.getElementById("statusBox" + x).innerHTML = "quotDigs.length = " + qLength + " quotDigs[0] = " + quotDigs[0].value;
    //x = x + 1;
    var powOf10 = 1;
    for( var i = col; i < qLength; ++i ) {
        var idx = qLength - 1 - i;
        enteredQuot = powOf10*Num(quotDigs[idx].value) + enteredQuot;
        powOf10 *= 10;
        //doc.getElementById("statusBox" + x).innerHTML = "in checkROundOff idx = " + idx + " quotDig = " +  quotDigs[idx].value + " enteredQuot = " + enteredQuot;
        //x = x + 1;
    }
    if( roundedQuot === enteredQuot ) {
        doc.getElementById("msg").innerHTML = "";
        ansBx.style.color = "black";
        var dispRnd = doc.getElementById("dispRnd");
        
        var nextbox = whatbox;
        
        var quotDp = Num(doc.getElementById("quotDp").value);
        if( col > nSigDig ||  col >= quotDp ) {         
            nextbox = nextbox + 1;
        } else { // only one place to round
            if( dispRnd ) {
                dispRnd.innerHTML = "";
            }
            // push whatbox outside the table
            var all = doc.getElementById("th-id2");
            var length = all.length;
            for( var i = 0; i < length; ++i ) {
                if( all.elements[i].isEqualNode(doc.getElementById("whatbox")) ) {
                    nextbox = i;
                }
            }
        }
        whatbox = nextbox;
    } else {
        var entireNum = Mat.floor(quotient/Mat.pow(10,col-1));
        doc.getElementById("msg").innerHTML = entireNum + " does not round to " + enteredQuot + "0, should be " + roundedQuot;
        upDateErrCount();
        //doc.getElementById("statusBox" + x).innerHTML = "in checkROundOff enteredQuot = " + enteredQuot + " != roundedQuot = " + roundedQuot;
        //x = x + 1;
    }
    setDivFocus();
}
function bringdown(sbx) {
    var doc = document;
    var Num = Number;
    var ansBxs = doc.getElementsByName("bd" + sbx);
    var thisRowsBdDigs = gBringDownDigs[sbx];
    var thisRowsBdDigsVal = (thisRowsBdDigs) ? Num(thisRowsBdDigs) : 0;
    var bxNo = thisRowsBdDigsVal;
    var ans = Num(ansBxs[bxNo].value);
    //var doc.getElementById("msg") = doc.getElementById("msg");
    var dvddigs = doc.getElementsByName("dvddigs");
    var quotdigs = doc.getElementsByName("quotdigs");
    var qx = 0;
    var dec = rowNo;
    if( quotdigs[qx].getAttribute("id").substr(0,2) === "xt" ) {
        ++qx;
    }
    var qLength = quotdigs.length;
    while( Num(quotdigs[qx].value) === 0 && qx < qLength ) {
        dec += 1;
        qx += 1;
    }
    var quotDigs = quotdigs.length;
    var qdx = quotDigs - 1 - dec; // not neccessarily whatRow if there was more than 1 bringdowns
    var qBx = doc.getElementById("qt" + qdx);
    if( !qBx ) {
    	qdx--;
    	qBx = doc.getElementById("qt" + qdx);
    }
    var dvdcol = qdx - 1;
    // find the most significant non-zero column of quotient
    // which is the column of the least significant digit of first 
    // dividend
    for (; dvdcol > 0; --dvdcol) {
        if (Num(doc.getElementById("qt" + dvdcol).value) !== 0) {
            break;
        }
    }
    dvdcol = dvdcol - 1;
    for (var idx = 0; idx < sbx; idx++) {
        dvdcol -= gBringDownDigs[idx];
    }
    dvdcol -= thisRowsBdDigsVal;
    var whatDig = dvddigs.length - 1 - dvdcol;
    var dividend = Num(doc.getElementById("onum").value);
    var Mat = Math;
    var ten2pow = Mat.pow(10, dvdcol);
    var discard = dividend % ten2pow;
    var expAns = dvdcol < 0? 0 : (dividend % Mat.pow(10, dvdcol + 1) - discard) / ten2pow;
    doc.getElementById("statusBox" + x).innerHTML = "dvdcol: " + dvdcol + " ten2pow: " + ten2pow + " discard: " + discard + " expAns: " + expAns;
    x = (x + 1)%nSbxs; 
    if (ans === expAns) {
        ansBxs[bxNo].style.color = "black";
        if (dvddigs[whatDig] && dvddigs[whatDig].style.color === "red") {
            dvddigs[whatDig].style.color = "black";
        }
        //doc.getElementById("msg").innerHTML = "";
        var newval = thisRowsBdDigsVal + 1;;
        gBringDownDigs[sbx] = newval;
        //++lastBoxOfCurrRow;
        var nextBx = nextQuotBox;
        rowNo++;
        markGood( ansBxs[bxNo], "end of bringdown, now what?", "", nextBx);
        //whatbox = nextbox;
    } else {
        if( dvddigs[whatDig] ) {
        	dvddigs[whatDig].style.color = "red";
        }
        //doc.getElementById("msg").innerHTML = "not " + ans;
        markErr("Should be " + expAns + " not " + ans, ansBxs[bxNo]);
    }
    //setDivFocus();
}
function promptForQuot() {
 	var doc = document
 	var num = Number;
 	// check first
 	if( partdvd < num(doc.getElementById("oden").value) ) {
 	 	doc.getElementById("T").style.color = "#ff1ac6";
 	} else {
 		// then set nextBx and instr2
 		var instr3Bx = doc.getElementById("instr3");
		instr3Bx.removeChild(instr3Bx.firstChild);
		instr3Bx.removeChild(instr3Bx.firstChild);
 		var divisor = num(doc.getElementById("oden").value);
 		instr2 = "How many times does " + divisor + " go into " + partdvd + "?";
 		var bxId = doc.getElementsByName("quotdigs")[0].id;
 		//var bxId = "qt" + msd;
 		doc.getElementById("statusBox" + x).innerHTML = "nextBx id: " + bxId;
        x = (x + 1)%nSbxs;
 		var nextBx = doc.getElementById(bxId);
       	markGood( null, instr2, "", nextBx );
 	}
 }
function getMorDgts() {
	var num = Number;
    var doc = document;
 	// check first
 	if( partdvd >= num( doc.getElementById("oden").value) ) {
 		doc.getElementById("F").style.color = "#ff1ac6";
 	} else {
 		// then get more digits
 		//alert("partdvd: " + partdvd + " nxtD: " + nxtD);
 		partdvd = partdvd*10 + num(doc.getElementById("dd" + nxtD + "_0").value);
 		nxtD = nxtD - 1;
 		//alert("new partdvd: " + partdvd + " nxtD: " + nxtD);
 		doc.getElementById("fBtn").checked = false;
 		var divisor = num(doc.getElementById("oden").value);
 		instr2 = "Does " + divisor + " go into " + partdvd + "?";
 		doc.getElementById("instr2").innerHTML = instr2;
 		// don't want to erase the TorF buttons
       	//markGood( ansBx, instr2, "", null );
       	var errBx = doc.getElementById("instr4");
		errBx.style.color = "#fff9ea";
 	}
}
function checkdd( ev ) {
    ev = ev || window.event;

    var num = Number;
    var doc = document;
    var mat = Math;

    var ansBx = ev.target;
    var ans = ansBx.value;
    if( !isNaN( ans ) ) {
        // dd2_0, dd1_0, dd0_0
        var id = ansBx.id;
        var len = id.length;
        var uscorepos = id.indexOf("_");
        wutDgt = num(id.substr(uscorepos-1, 1));
        var dividnd = num(doc.getElementById("onum").value);
        var frstdig = dividnd%10;
        var ten2pow = mat.pow(10,wutDgt);
        var throway = dividnd%ten2pow;
        var mostdgt = dividnd%mat.pow(10,wutDgt+1);
        //var expAns = (mostdgt - throway)/ten2pow;
        //alert("wutDgt: " + wutDgt + " frstdig: " + frstdig + " mostdgt: " + mostdgt + " throway: " + throway + " expAns: " + expAns);
        if( wutDgt === 0 && num(ans) === frstdig ||
        	wutDgt > 0 && num(ans) === (mostdgt - throway)/ten2pow ) {
        	var nextcol = wutDgt - 1;
        	row = id.substr(len-1, 1);
        	var	nextBx = doc.getElementById("dd" + nextcol + "_" + row);
        	var	instr2 = "Enter next most significant digit of dividend";
        	var instr3 = "";
        	if( nextcol < 0 ) {
        		var dslen = doc.getElementsByName("dvsrdigs").length;
        		nextcol = dslen - 1;
        		nextBx = doc.getElementById("ds_" + nextcol);
        		instr2 = "Enter denominator value to the left of division sign";
        	}
        	markGood( ansBx, instr2, instr3, nextBx );
        } else {
        	markErr( "Digit " + wutDgt + " of " + dividnd + " is not " + ans, ansBx );
        }
    } else {
		markErr( ans + " is not a number", ansBx );
    }
}
function checkds( ev ) {
    ev = ev || window.event;
 
    var num = Number;
    var doc = document;
    var mat = Math;

    var ansBx = ev.target;
    var ans = ansBx.value;
    if( !isNaN( ans ) ) {
        // ds_2 ds_1 ds_0
        var id = ansBx.id;
        var len = id.length;
        wutDgt = num(id.substr(len-1, 1));
        var divisor = num(doc.getElementById("oden").value);
        var frstdig = divisor%10;
        var ten2pow = mat.pow(10,wutDgt);
        var throway = divisor%ten2pow
        var mostdgt = divisor%mat.pow(10,wutDgt+1);
        //alert("wutDgt: " + wutDgt + " frstdig: " + frstdig + " mostdgt: " + mostdgt + " throway: " + throway);
        if( wutDgt === 0 && num(ans) === frstdig ||
        	wutDgt > 0 && num(ans) === (mostdgt - throway)/ten2pow ) {
        	var nextcol = wutDgt - 1;
        	var	nextBx = doc.getElementById("ds_" + nextcol);
        	var	instr2 = "Enter next most significant digit of divisor";
        	var instr3 = "";
        	if( nextcol < 0 ) {
        		var qtlen = doc.getElementsByName("quotdigs").length;
        		nextcol = qtlen - 1;
        		nextBx = "qt" + nextcol;
        		var dvdlen = doc.getElementsByName("dvddigs").length;
        		var msd = dvdlen - 1;
        		partdvd = num(doc.getElementById("dd" + msd + "_0").value);
        		nxtD = msd - 1;
        		instr2 = "Does " + divisor + " go into " + partdvd + "?";
        		markGood( ansBx, instr2, "", null );
        		var truBtn = createRadioElement("Yes", "TorF", false, "T", "promptForQuot()", "tBtn" );
				var flsBtn = createRadioElement("No","TorF", false, "F", "getMorDgts()", "fBtn" );
				var instr3div = doc.getElementById("instr3");		
				instr3div.prepend(flsBtn);
				instr3div.prepend(truBtn);
				quotdigs = qtlen;
				return;
        	}
        	markGood( ansBx, instr2, instr3, nextBx );
        } else {
        	markErr( "Digit " + wutDgt + " of " + divisor + " is not " + ans, ansBx );
        }
    } else {
		markErr( ans + " is not a number", ansBx );
    }
}
window.onload = function(){
    var doc = document;
    var startWhere = doc.getElementById("startHere").value;
    var strtBx = doc.getElementById(startWhere);
	var indcatr = Number(doc.getElementById("indcatr").value);
	var isDecToFrac = indcatr === 4;
	if( isDecToFrac ) {
		// what happens to these objects when instr2 is overwritten? Do they float around somewhere taking up space? fixit
		var truBtn = createRadioElement("Yes", "TorF", false, "T", "putWhlBox()", "tBtn" );
		var flsBtn = createRadioElement("No","TorF", false, "F", "promptForNum()", "fBtn" );
		var instr3div = doc.getElementById("instr3");		
		instr3div.prepend(flsBtn);
		instr3div.prepend(truBtn);
	}
    doc.addEventListener('keydown', pusharo);
    doc.getElementById("instr2").style.color = "#b38f00";
    if( strtBx ) {
        strtBx.focus();
    }
};