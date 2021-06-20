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
//var x = 0;
//var nSbxs = 24;
var allgood = true;
var partner = null;

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
    }
    return false;
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
    //var lastn = num(doc.getElementById("n0_2").value);
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
		//var test = doc.getElementById("n0_" + i).value;
		//alert("i: " + i + " nums[i].value: " + nums[i].value + " test: " + test + " id: " + nums[i].id + " class: " + nums[i].className + " tagname: " + nums[i].tagName);    
    	if( i%2 === 0 ) { // i starts with n0_1, which is i = 0, whole number
    		if( nums[i].value !== "" && (isNaN(nums[i].value) || num(nums[i].value) !== whl) ) {
    			allgood = false;
    			alert("i: " + i + " nums[i]: " + nums[i].value + " whl: " + whl + " allgood: " + allgood);
    			nums[i].style.color = "#ff1ac6";
    		}
    		//alert("i: " + i + " nums[i]: " + nums[i].value);
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
			//doc.getElementById("statusBox" + x).innerHTML = "no e0_ exists for fakestrtcol: " + fakestrtcol;
            //x = (x + 1)%nSbxs;
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
        /* for( var i = 0; i < cols; ++i ) {
            nums[i].style.color = "#0033cc";
            doc.getElementById("d0_" + i).style.color = "#0033cc";
        }*/ // nobody is going to see it
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
        var errBx = doc.getElementById("instr4");
        if( !isNaN( ans ) ) {
            //var id = ansBx.id;
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
        	//doc.getElementById("statusBox" + x).innerHTML = "ans: " + ans + " col: " + col;
	        //x = (x + 1)%nSbxs;
	        //doc.getElementById("statusBox" + x).innerHTML = "fakecol: " + fakecol + " frstdcol: " + frstdcol;
	        //x = (x + 1)%nSbxs;
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
                ansBx.style.color = "#0033cc";
                ansBx.style.borderColor = "#e9d398";
                errBx.style.color = "#fff9ea";
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
                doc.getElementById("instr2").innerHTML = instr2;
                doc.getElementById("instr3").style.color = "#fff9ea";
                nextBx.focus();
            } else if( fakecol > thrddcol && col%2 === 0 ) {
                /* col === 4 && (!frcden4 || (!isNaN(frcden4) && ans === frcden4)) &&
                !isNaN(frcnum3) && !isNaN(frcden3) &&
                num(frcnum3)%nAns === 0 && num(frcden3)%nAns === 0 */
                prevNum = doc.getElementById("n0_" + prevCol).value;
                prevDen = doc.getElementById("d0_" + prevCol).value;
                thisDen = doc.getElementById("d0_" + col).value;
                if( (thisDen && isNaN(thisDen)) || isNaN(prevNum) || isNaN(prevDen) ) {
                    var errm = "Fix one or all of the following previous bad entries first: " + prevNum + ", " + prevDen + ", " + thisDen;
					errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                } else if( thisDen && ans !== thisDen ) {
                    ansBx.style.color = "#ff1ac6";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    var errm = "Numerator: " + ans + " needs to be the same value as denominator: " + thisDen + " or you are changing the value of the fraction, not converting it.";
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                    allgood = false;
                } else if( num(prevNum)%nAns !== 0 || num(prevDen)%nAns !== 0 ) { // not catching. fixit
                    ansBx.style.color = "#ff1ac6";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    var errm = ans + " needs to evenly divide " + prevNum + " and " + prevDen;
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                    allgood = false;
                } else {
                    ansBx.style.color = "#0033cc";
                    ansBx.style.borderColor = "#e9d398";
                    errBx.style.color = "#fff9ea";
                    nextBx = doc.getElementById("d0_" + col);
                    instr2 = "Copy numerator to denominator so the number you are dividing by is 1";
                    if( nextBx.value ) {
                        instr2 = "What is " + prevNum + " &divide " + ans;
                        nextBx = doc.getElementById("n0_" + nextCol);
                    }
                    doc.getElementById("instr2").innerHTML = instr2;
                    doc.getElementById("instr3").style.color = "#fff9ea";
                    nextBx.focus();
                }
            } else if( fakecol > thrddcol && col%2 === 1 ) {
                /* col === 5 && frcnum3 && frcnum4 && !isNaN(frcnum3) && !isNaN(frcnum4) &&
                num(frcnum3)/num(frcnum4) === nAns ) { */
                var prevNum = doc.getElementById("n0_" + prevCol).value;
                var prev2col = col - 2;
                var prev2Num = doc.getElementById("n0_" + prev2col).value;
                prevDen = doc.getElementById("d0_" + prevCol).value;
                if( !prevNum || !prev2Num || isNaN(prevNum) || isNaN(prev2Num) ) {
                    var errm = "Fix one or all of the following previous bad entries first: " + prevNum + ", " + prev2Num;
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                } else if( num(prev2Num)/num(prevNum) !== nAns ) {
                    ansBx.style.color = "#ff1ac6";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    var errm = prev2Num + " divided by " + prevNum + " is not " + ans;
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                    allgood = false;
                } else {
                    ansBx.style.color = "#0033cc";
                    ansBx.style.borderColor = "#e9d398"; 
                    errBx.style.color = "#fff9ea";
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
                        instr2 = "Is there an integer that divides both " + thisDen + " and " + ans + "?";
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
                    if( instr3 === "") {
                    	doc.getElementById("instr3").style.color = "fff9ea";
                    } else {
                    	var instrBx = doc.getElementById("instr3");
                    	instrBx.style.color = "#b38f00"
                    	instrBx.innerHTML = instr3;
                    }
                    nextBx.focus();
                }
            } else { // one of 1st 4 numerators was wrong
            	var errm = ans + " needs to be " + expAns;
            	errBx.style.color = "#ff1ac6";
            	errBx.innerHTML = errm;
                ansBx.style.color = "#ff1ac6";
                ansBx.style.borderColor = "#ff1ac6";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
            }
            
        } else {
            ansBx.style.color = "#ff1ac6";
            ansBx.style.borderColor = "#ff1ac6";
            //var errs = Number(doc.getElementById("errs").value);
            //doc.getElementById("errs").value = errs + 1; // why penalize for an obvious typo?
            var errm = ans + " is not a number";
            errBx.style.color = "#ff1ac6";
        	errBx.innerHTML = errm;
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
        //var id = ansBx.id;
        var par = extract( ansBx.id );
        var col = par.c;
        var nextcol = col + 1;
        var nextBx = ansBx;
        var frstdcol = extract( doc.getElementById("startHere").value ).c;
        var scnddcol = frstdcol + 1;
        var thrddcol = frstdcol + 2;
        var fakecol = col < 12? col : col - 13 + frstdcol;
        //doc.getElementById("statusBox" + x).innerHTML = "ans: " + ans + " col: " + col;
        //x = (x + 1)%nSbxs;
        //doc.getElementById("statusBox" + x).innerHTML = "fakecol: " + fakecol + " frstdcol: " + frstdcol;
        //x = (x + 1)%nSbxs;
        
        var errBx = doc.getElementById("instr4");
        if( !isNaN(ans) ) {
        	var ocol = frstdcol - 2;
        	var odenBx = doc.getElementById("d0_" + ocol);
            var oden = odenBx.value;
            if( ans && fakecol <= thrddcol && ans === oden ) {
                //doc.getElementById("statusBox" + x).innerHTML = "checkMprD col < 5 and ans = oden block";
                //x = (x + 1)%nSbxs;
                ansBx.style.color = "#0033cc";
                ansBx.style.borderColor = "#e9d398";
                errBx.style.color = "#fff9ea"; 
 				var wcol = frstdcol - 3;
                var whlBx = doc.getElementById("n0_" + wcol);
                var whl = whlBx.value;
                if( fakecol === frstdcol ) {
                    doc.getElementById("instr2").innerHTML = "Copy whole part of mixed number: " + whl + " to first box";
                    doc.getElementById("instr3").style.color = "#fff9ea";
                    nextcol = col - 1;
                    nextBx = doc.getElementById("n0_" + nextcol);	
                } else if( fakecol === scnddcol ) {
                	onum = doc.getElementById("n0_" + ocol).value;
                	doc.getElementById("instr2").innerHTML = "What is " + whl + " &times " + oden + " + " + onum;
                	nextBx = doc.getElementById("n0_" + nextcol);
                } else {
                    var thisNum = doc.getElementById("n0_" + col).value;
                    doc.getElementById("instr2").innerHTML = "Is there an integer that divides both " + thisNum + " and " + ans + "?";
                    var instrBx = doc.getElementById("instr3");
                    instrBx.style.color = "#b38f00"
                    instrBx.innerHTML = " If so, enter it. If not click 'Done'";
                    ansBx.blur();
                    nextcol = col + 1;
                    nextBx = doc.getElementById("n0_" + nextcol);
                    //alert("checkMprD col: " + col + " nextBx: " + nextBx.id);
                }
            } else if( fakecol%2 === 0 && fakecol > thrddcol ) { // used to be col === 4
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
                    var evenlyDivides = nVal%aVal === 0 && dVal%aVal === 0;
                    var nExists = thisN && !isNaN(thisN);
                    var isEqualNum = nExists && aVal === num(thisN);
                    if( evenlyDivides && (!nExists || isEqualNum) ) {
                        ansBx.style.color = "#0033cc";
                        ansBx.style.borderColor = "#e9d398";
                        errBx.style.color = "#fff9ea";
                        nextBx = doc.getElementById("n0_" + col);
                        var instr2 = "Copy denominator to numerator so the number you are dividing by is 1"; 
                        if( thisN ) {
                            nextBx = doc.getElementById("n0_" + nextcol);
                            instr2 = "What is " + prevN+ " &divide " + thisN;
                        }
                        doc.getElementById("instr2").innerHTML = instr2;
                        doc.getElementById("instr3").style.color = "#fff9ea";
                    } else {
                        ansBx.style.color = "#ff1ac6";
                        ansBx.style.borderColor = "#ff1ac6"; 
                        var errs = Number(doc.getElementById("errs").value);
                        doc.getElementById("errs").value = errs + 1;
                        var errm = !evenlyDivides? ans + " does not evenly divide " + prevN + " and " + prevD : 
                        							ans + " is not equal to " + thisN;
                        if( nExists && !evenlyDivides ) {
                        	errm = ans + " does not evenly divide " + prevN + " and " + prevD + " and ";
                        	errm +=  ans + " is not equal to " + thisN;
                        }
                    	errBx.style.color = "#ff1ac6";
        				errBx.innerHTML = errm;
                    }
                } else {
                    ansBx.style.color = "#ff1ac6";
                    ansBx.style.borderColor = "#ff1ac6";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    var errm = "fill in previous numerator and denominator first";
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                }
            } else if( fakecol%2 === 1 && fakecol > thrddcol ) { // used to be 5
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
                    errBx.style.color = "#fff9ea";
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
                        doc.getElementById("instr2").innerHTML = "Is there an integer that divides both " + currN + " and " + ans + "?";
                        ansBx.blur();
                        var instrBx = doc.getElementById("instr3");
                    	instrBx.style.color = "#b38f00"
                    	instrBx.innerHTML = " If so enter it, otherwise click 'Done'";
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
                    ansBx.style.color = "#ff1ac6";
                    ansBx.style.borderColor = "#ff1ac6";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    var errm = prev2D + " divided by " + prevD + " is not " + ans;
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                }
            } else { //one of 1st 2 denominators was wrong
                //doc.getElementById("statusBox" + x).innerHTML = "1st 2 denominators wrong block";
                //x = (x + 1)%nSbxs;
                ansBx.style.color = "#ff1ac6";
                ansBx.style.borderColor = "#ff1ac6";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                var errm = ans + " should be the same as the first denominator: " + oden;
                errBx.style.color = "#ff1ac6";
        		errBx.innerHTML = errm;
            }
            if( nextBx ) {
            	nextBx.focus();
            }
        } else {
            ansBx.style.color = "#ff1ac6";
            ansBx.style.borderColor = "#ff1ac6";
            //var errs = Number(doc.getElementById("errs").value);
            //doc.getElementById("errs").value = errs + 1;
            var errm = ans + " is not a number";
            errBx.style.color = "#ff1ac6";
        	errBx.innerHTML = errm;
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
            var errm = "you need to enter something in previous boxes first";
            errBx.style.color = "#ff1ac6";
        	errBx.innerHTML = errm;
            ansBx.style.color = "#ff1ac6";
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
                        errBx.style.color = "#fff9ea";
                        if( currN ) {
                            if( currN.value ) {
                                //alert("current numerator value: " + currN.value);
                                var nextcol = col + 1;
                                var nextBx = doc.getElementById("d"+ row + "_" + nextcol);
                                doc.getElementById("instr2").innerHTML = "What is " + prevDV + " &divide " + ans;
                                nextBx.focus();
                            } else {
                                //alert("no value in current numerator");
                                doc.getElementById("instr2").innerHTML = "Copy denominator value into numerator so the number you are dividing by is 1";
                                currN.focus();
                            }
                            doc.getElementById("instr3").style.color = "#fff9ea";
                        } else {
                            alert("numerator input doesn't exist");
                        }
                    } else {
                        var errm = "denominator: " + ans + " needs to be the same value as numerator: " + currN.value + " or you are changing the value of the fraction, not converting it.";
                        errBx.style.color = "#ff1ac6";
        				errBx.innerHTML = errm;
                        ansBx.style.color = "#ff1ac6";
                        var errs = Number(doc.getElementById("errs").value);
                        doc.getElementById("errs").value = errs + 1;
                    }
                } else {
                    var errm = "denominator needs to evenly divide previous numerator and denominator";
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                    ansBx.style.color = "#ff1ac6";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                }
            } else if( currN ) { // finding LCM and putting in order
                var currnVal = currN.value;
                if( isNaN(ans) ) {
                    ansBx.style.color = "#ff1ac6";
                    var errm = ans + " is not a number";
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                    //var errs = Number(doc.getElementById("errs").value);
                    //doc.getElementById("errs").value = errs + 1;
                } else if( currnVal ) {
                    if( ans !== currnVal ) {
                        ansBx.style.color = "#ff1ac6";
                        var errs = Number(doc.getElementById("errs").value);
                        doc.getElementById("errs").value = errs + 1;
                        var errm = ans + " needs to be the same as numerator";
                        errBx.style.color = "#ff1ac6";
        				errBx.innerHTML = errm;
                    } else {
                        ansBx.style.color = "#0033cc";
                        errBx.style.color = "#fff9ea";
                        doc.getElementById("instr2").innerHTML = "What is " + prevDV + " &times " + ans;
                        doc.getElementById("instr3").style.color = "#fff9ea";
                        var nextcol = col + 1;
                        var nextBx = doc.getElementById("d"+ row + "_" + nextcol);
                        nextBx.focus();
                    }
                } else {
                    ansBx.style.color = "#0033cc";
                    errBx.style.color = "#fff9ea";
                    //alert("no value in current numerator");
                    var op = "multiply";
                    if( test) {
                        op = "divid";
                    }
                    doc.getElementById("instr2").innerHTML = "Copy denominator value into numerator so the number you are " + op + "ing by is 1";
                    doc.getElementById("instr3").style.color = "#fff9ea";
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
        var errBx = doc.getElementById("instr4");
        if( isNaN(ans) ) {
            ansBx.style.color = "#ff1ac6";
            var errm = ans + " is not a number";
            errBx.style.color = "#ff1ac6";
        	errBx.innerHTML = errm;
            //var errs = Number(doc.getElementById("errs").value);
            //doc.getElementById("errs").value = errs + 1;
        } else {
            var nans = num(ans);
            if( frcnum &&  !isNaN(frcnum) ) {
                var nfrcnum = num(frcnum);
                if( nfrcnum/nans !== rem/oden ) {
                    ansBx.style.color = "#ff1ac6";
                    numBx.style.color = "#ff1ac6";
                    partner = ansBx;
                    numBx.focus();
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    var errm = frcnum + "/" + nans + " needs to equal " + rem + "/" + oden;
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                } else if ( id !== "d0_2" && ( nfrcnum !== rdfrac.n || nans !== rdfrac.d ) ) {
                    ansBx.style.color = "#ff1ac6";
                    numBx.style.color = "#ff1ac6";
                    partner = ansBx;
                    numBx.focus();
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    errm = frcnum + "/" + nans + " is not reduced";
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                } else {
                	errBx.style.color = "#fff9ea";
                    ansBx.style.color = "#0033cc";
                    numBx.style.color = "#0033cc";
                    if( id === "d0_2" ) {
                        doc.getElementById("instr2").innerHTML = "If fraction is reduced, click 'Done'.";
                        var instrBx = doc.getElementById("instr3");
                    	instrBx.style.color = "#b38f00"
                    	instrBx.innerHTML = "Otherwise copy the whole part of the mixed number.";
                        doc.getElementById("n0_3").focus();
                    } else {
                        doc.getElementById("instr2").innerHTML = "Click 'Done'";
                        doc.getElementById("instr3").style.color = "#fff9ea";
                        doc.activeElement.blur();
                    }
                }
            } else if( id === "d0_2" ) {
                if( nans === oden || nans === rdfrac.n) { // check id, if redNum, must be reduced
                    ansBx.style.color = "#0033cc";
                    errBx.style.color = "#fff9ea";
                    doc.getElementById("n0_3").focus();
                } else {
                    ansBx.style.color = "#ff1ac6";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    var errm = nans + " needs to be " + oden + " or " + rdfrac.n;
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
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
        var errBx = doc.getElementById("instr4");
        //doc.getElementById("statusBox" + x).innerHTML = "checkFrcN ans: " + ans + " onum: " + onum + " oden: " + oden + " frcden: " + frcden + " rem: " + rem;
        //x = (x + 1)%nSbxs;
        if( isNaN(ans) ) {
            ansBx.style.color = "#ff1ac6";
            //var errs = Number(doc.getElementById("errs").value);
            //doc.getElementById("errs").value = errs + 1;
            var errm = "checkFrcN ans: " + ans + " is not a number";
            errBx.style.color = "#ff1ac6";
        	errBx.innerHTML = errm;
        } else {
            var nans = num(ans);
            var id = ansBx.id;
            
            if( frcden && !isNaN(frcden) ) {
                if( nans/num(frcden) !== rem/oden ) {
                    ansBx.style.color = "#ff1ac6";
                    denBx.style.color = "#ff1ac6";
                    partner = denBx;
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    var errm = nans + "/" + frcden + " needs to equal " + rem + "/" + oden;
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                } else if ( id !== "n0_2" && ( nans !== rdfrac.n || frcden !== rdfrac.d ) ) {
                    ansBx.style.color = "#ff1ac6";
                    denBx.style.color = "#ff1ac6";
                    partner = denBx;
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    var errm = nans + "/" + frcden + " is not reduced";
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                } else {
                    ansBx.style.color = "#0033cc";
                    errBx.style.color = "#fff9ea";
                    if( id === "n0_2" ) {
                        doc.getElementById("n0_3").focus();
                    } else {
                        doc.activeElement.blur();
                    }
                }
            } else if( id === "n0_2" ) {
                if( nans === rem || nans === rdfrac.n ) {
                    ansBx.style.color = "#0033cc";
                    errBx.style.color = "#fff9ea";
                    doc.getElementById("instr2").innerHTML = "Copy original denominator: '" + oden + "' to mixed number denominator";
                    doc.getElementById("instr3").style.color = "#fff9ea";
                    denBx.focus();
                } else {
                    ansBx.style.color = "#ff1ac6";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                    var errm = nans + " needs to be " + rem + " or " + rdfrac.n;
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
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
        var errBx = doc.getElementById("instr4");
        if( !isNaN( ans )) {
            var ansVal = num(ans);
            var dvdnd = num(doc.getElementById("d0_1").value);
            var prod = num(doc.getElementById("n1_1").value);
            if( ansVal === dvdnd - prod ) {
                ansBx.style.color = "#0033cc";
                errBx.style.color = "#fff9ea";
                doc.getElementById("instr2").innerHTML = "Copy remainder: '" + ans + "' to numerator of mixed number";
                doc.getElementById("instr3").style.color = "#fff9ea";
                doc.getElementById("n0_2").focus();
            } else {
                ansBx.style.color = "#ff1ac6";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                var errm = dvdnd + " - " + prod + " is not " + ans;
                errBx.style.color = "#ff1ac6";
        		errBx.innerHTML = errm;
            }
        } else {
            ansBx.style.color = "#ff1ac6";
            //var errs = Number(doc.getElementById("errs").value);
            //doc.getElementById("errs").value = errs + 1;
            var errm = ans + " is not a number";
            errBx.style.color = "#ff1ac6";
        	errBx.innerHTML = errm;
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
        var errBx = doc.getElementById("instr4");
        if( !isNaN( ans )) {
            var ansVal = num(ans);
            var dvsr = num(doc.getElementById("d0_0").value);
            var whlprt = num(doc.getElementById("n0_1").value);
            if( ansVal === dvsr*whlprt ) {
                ansBx.style.color = "#0033cc";
                errBx.style.color = "#fff9ea";
                var onum = doc.getElementById("onum").value;
                doc.getElementById("instr2").innerHTML = "What is " + onum + " - " + ans;
                doc.getElementById("instr3").style.color = "#fff9ea";
                doc.getElementById("d1_1").focus();
            } else {
                ansBx.style.color = "#ff1ac6";
                var errs = Number(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
                var errm = dvsr + " times " + whlprt + " is not " + ans;
                errBx.style.color = "#ff1ac6";
        		errBx.innerHTML = errm;
            }
        } else {
            ansBx.style.color = "#ff1ac6";
            var errm = ans + " is not a number";
            errBx.style.color = "#ff1ac6";
        	errBx.innerHTML = errm;
            //var errs = Number(doc.getElementById("errs").value);
            //doc.getElementById("errs").value = errs + 1;
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
        var errBx = doc.getElementById("instr4");
        if( isNaN(ans) ) {
        	ansBx.style.color = "#ff1ac6";
	        var errm = ans + " is not a number";
	        errBx.style.color = "#ff1ac6";
	        errBx.innerHTML = errm;
        } else {
	        if( Math.floor(onum/oden) === num(ans) ) {
	            ansBx.style.color = "#0033cc";
	            errBx.style.color = "#fff9ea";
	            var nextBx = doc.getElementById("n0_4");
	            var instr2 = "Divide both numerator and denominator by some number to reduce fraction";
	            if( ansBx.id === "n0_1" ) {
	                nextBx = doc.getElementById("n1_1");
	                instr2 = "What is " + ans + " &times " + oden;
	            }
	            doc.getElementById("instr2").innerHTML = instr2;
	            doc.getElementById("instr3").style.color = "#fff9ea";
	            nextBx.focus();
	        } else {
	            ansBx.style.color = "#ff1ac6";
	            var errm = onum + " divided by " + oden + " is not " + ans;
	            errBx.style.color = "#ff1ac6";
	        	errBx.innerHTML = errm;
	            var errs = Number(doc.getElementById("errs").value);
	            doc.getElementById("errs").value = errs + 1;
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
        var errBx = doc.getElementById("instr4");
        var oden = doc.getElementById("oden").value; 
        if( ans.localeCompare(oden) === 0  ) {
            ansBx.style.color = "#0033cc";
            errBx.style.color = "#fff9ea";
            var num = doc.getElementById("d0_1").value;
            doc.getElementById("instr2").innerHTML = "What is " + num + " &divide " + ans;
            doc.getElementById("instr3").style.color = "#fff9ea";
            doc.getElementById("n0_1").focus();
        } else {
            ansBx.style.color = "#ff1ac6";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            var errm = ans + " is not " + oden;
            errBx.style.color = "#ff1ac6";
        	errBx.innerHTML = errm;
        }
        return false;
    }
}
function checkNum( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var doc = document;
        var num = Number;
        
        var ansBx = ev.target;
        var ans = ansBx.value;
        var errBx = doc.getElementById("instr4");
        var onum = doc.getElementById("onum").value;
        if( ans.localeCompare(onum) === 0 ) {
            ansBx.style.color = "#0033cc";
            errBx.style.color = "#fff9ea";
            var oden = doc.getElementById("oden").value;
            doc.getElementById("instr2").innerHTML = "Copy the denominator: '" + oden + "' to the box to the left of the 'divide by' sign";
            doc.getElementById("instr3").style.color = "#fff9ea";
            doc.getElementById("d0_0").focus();
        } else {
            ansBx.style.color = "#ff1ac6";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
            var errm = ans + " is not " + onum;
            errBx.style.color = "#ff1ac6";
        	errBx.innerHTML = errm;
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
            var errm = "you need to enter something in previous boxes first";
            errBx.style.color = "#ff1ac6";
        	errBx.innerHTML = errm;
            ansBx.style.color = "#ff1ac6";
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
                        errBx.style.color = "#fff9ea";
                        if( currD ) {
                            if( currD.value ) {
                                //alert("current denominator value: " + currD.value);
                                doc.getElementById("instr2").innerHTML = "What is " + prevNV + " &divide " + ans;
                                doc.getElementById("instr3").style.color = "#fff9ea";
                                var nextcol = col + 1;
                                var nextBx = doc.getElementById("n" + row + "_" + nextcol);
                                nextBx.focus();
                            } else {
                                doc.getElementById("instr2").innerHTML = "Copy numerator value into denominator so the number you are dividing by is 1";
                                doc.getElementById("instr3").style.color = "#fff9ea";
                                currD.focus();
                            }
                        } else {
                            alert("denominator input doesn't exist");
                        }    
                    } else {
                        var errm = "numerator: " + ans + " needs to be the same value as  denominator: " + currD.value + " or you are changing the value of the fraction, not converting it.";
                        errBx.style.color = "#ff1ac6";
        				errBx.innerHTML = errm;
                        ansBx.style.color = "#ff1ac6";
                        var errs = Number(doc.getElementById("errs").value);
                        doc.getElementById("errs").value = errs + 1;
                    }
                } else {
                    var errm = "numerator needs to evenly divide previous numerator and denominator";
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                    ansBx.style.color = "#ff1ac6";
                    var errs = Number(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                }
            } else if( currD ) { // finding LCD and putting in order
                var currdVal = currD.value;
                if( isNaN(ans) ) {
                    ansBx.style.color = "#ff1ac6";
                    //var errs = Number(doc.getElementById("errs").value);
                    //doc.getElementById("errs").value = errs + 1;
                    var errm = ans + " is not a number";
                    errBx.style.color = "#ff1ac6";
        			errBx.innerHTML = errm;
                } else if( currdVal ) {
                    if( ans !== currdVal ) {
                        ansBx.style.color = "#ff1ac6";
                        var errs = Number(doc.getElementById("errs").value);
                        doc.getElementById("errs").value = errs + 1;
                        var errm = ans + " needs to be the same as " + currdVal;
                        errBx.style.color = "#ff1ac6";
        				errBx.innerHTML = errm;
                    } else {
                        ansBx.style.color = "#0033cc";
                        errBx.style.color = "#fff9ea";
                        doc.getElementById("instr2").innerHTML = "What is " + prevDV + " &times " + currdVal;
                        doc.getElementById("instr3").style.color = "#fff9ea";
                        var nextcol = col + 1;
                        var nextBx = doc.getElementById("d"+ row + "_" + nextcol);
                        nextBx.focus();
                    }
                } else {
                    ansBx.style.color = "#0033cc";
                    errBx.style.color = "#fff9ea";
                    //alert("no value in current numerator");
                    doc.getElementById("instr2").innerHTML = "Copy numerator value into denominator so the number you are multiplying by is 1";
                    doc.getElementById("instr3").style.color = "#fff9ea";
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
        var errBx = doc.getElementById("instr4");
        
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
            var errm = "you need to enter something in previous boxes first";
            errBx.style.color = "#ff1ac6";
        	errBx.innerHTML = errm;
            ansBx.style.color = "#ff1ac6";
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
                errBx.style.color = "#fff9ea";
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
                var instrBx = doc.getElementById("instr3");
                instrBx.style.color = "#b38f00"
                instrBx.innerHTML = instr3;
                nextBx.type = "text";
                nextBx.focus();
            } else {
                var whatOp = doc.getElementById("o0_1").innerHTML;
                var errm = prev2DV + " " + whatOp + " " + prevDV + " is not " + ans;
                errBx.style.color = "#ff1ac6";
        		errBx.innerHTML = errm;
                ansBx.style.color = "#ff1ac6";
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
       	
       	var errBx = doc.getElementById("instr4");
       	if( !isNaN(ans) ) {
       		var whl = Math.floor(num(doc.getElementById("onum").value));
       		//alert("checkDWhl ans: " + ans + " whl: " + whl);
	       	if( num(ans) === whl ) {
		        var nextCol = par.c + 1;
		        var nextBx = "n0_" + nextCol;
		        var instr2 = "Copy the part to the right of the decimal point to numerator,";
		        instr2 += " ignoring leading and trailing zeros";
		        if( nextCol > 1 ) {
		        	instr2 = "Divide previous numerator by some number that evenly divides previous numerator and denominator";
		        }
		        doc.getElementById("instr2").innerHTML = instr2;
		        doc.getElementById("instr3").style.color = "#fff9ea";;
		        errBx.style.color = "#fff9ea";
		        ansBx.style.color = "#0033cc";
                ansBx.style.borderColor = "#e9d398";
		        doc.getElementById(nextBx).focus();
		    } else {
		    	ansBx.style.color = "#ff1ac6";
		    	errBx.style.color = "#ff1ac6";
		    	errBx.innerHTML = "Whole part needs to equal " + whl;
		    }
		} else {
			ansBx.style.color = "#ff1ac6";
		    errBx.style.color = "#ff1ac6";
		   	errBx.innerHTML = ans + " is not a number";
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
       	var errBx = doc.getElementById("instr4");
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
	        		doc.getElementById("instr2").innerHTML = "Put a '1' followed by as many 0's as there are digits to the right of the decimal point, ignoring trailing 0s";
	        		doc.getElementById("instr3").style.color = "#fff9ea";
	        		var nextBx = doc.getElementById("d0_" + col );
	        		nextBx.focus();
	        	} else {
		        	ansBx.style.color = "#ff1ac6";
				    errBx.style.color = "#ff1ac6";
				   	errBx.innerHTML = ans + " needs to be " + fracPt;
	        	}
	        } else { // col > 1
	        	//check if it's properly reduced
	        	var prevCol = col - 2;
	        	var prevNum = num(doc.getElementById("n0_" + prevCol).value);
	        	var numBx = doc.getElementById("d0_" + col);
	        	var denExists = numBx.value;
	        	if( prevNum % nans !== 0 ) {
	        		ansBx.style.color = "#ff1ac6";
				    errBx.style.color = "#ff1ac6";
				   	errBx.innerHTML = ans + " needs to divide " + prevNum + " evenly";
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
	        				var instr3Bx = doc.getElementById("instr3");
	        				instr3Bx.style.color = "#b38f00";
	        				doc.getElementById("instr2").innerHTML = instr2;
	        				instr3Bx.innerHTML = instr3;
	        				errBx.style.color = "#fff9ea";
					        ansBx.style.color = "#0033cc";
			                ansBx.style.borderColor = "#e9d398";
	        				nextBx.focus();
	        			} else {
	        				ansBx.style.color = "#ff1ac6";
						    errBx.style.color = "#ff1ac6";
						   	errBx.innerHTML = prevDen + " needs to be divided by " + ratio + " the same as you divided the numerator";
	        			}
	        		} else {
	        			numBx.style.color = "#ff1ac6";
					    errBx.style.color = "#ff1ac6";
					   	errBx.innerHTML = "Numerator: " + numExists + " is not a number";
	        		}
	        	} else {
	        		doc.getElementById("instr2").innerHTML = "Divide denominator by the same number you divided the numerator by";
	        		doc.getElementById("instr3").style.color = "#fff9ea";
	        		doc.getElementById("d0_" + col).focus();
	        	}
	        }
		} else {
			ansBx.style.color = "#ff1ac6";
		    errBx.style.color = "#ff1ac6";
		   	errBx.innerHTML = ans + " is not a number";
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
       	var errBx = doc.getElementById("instr4");
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
	        		errBx.style.color = "#fff9ea";
			        ansBx.style.color = "#0033cc";
	                ansBx.style.borderColor = "#e9d398";
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
	        		//alert("checkDFrcD nextBx: " + nextBx.id);
	        		doc.getElementById("instr2").innerHTML = instr2;
	        		var instr3Bx = doc.getElementById("instr3");
	        		instr3Bx.style.color = "#b38f00";
	        		instr3Bx.innerHTML = instr3;
	        		nextBx.focus();
	        	} else {
	        		ansBx.style.color = "#ff1ac6";
				    errBx.style.color = "#ff1ac6";
				   	errBx.innerHTML = ans + " should be a 1 followed by " + minDigits + " zeroes";
	        	}
	        } else { // col > 1
	        	var origd = num(doc.getElementById("d0_1").value);
	        	if( origd%num(ans) !== 0 ) {
	        		ansBx.style.color = "#ff1ac6";
				    errBx.style.color = "#ff1ac6";
				   	errBx.innerHTML = ans + " needs to be a factor of " + origd;
	        	} else {
		        	// check if there is a numerator
		        	// if there is, compare this fraction with previous fractions and see if it's reduced
		        	var nmr = doc.getElementById("n0_" + col).value;
		        	var orign = num(doc.getElementById("n0_1").value);
		        	if( nmr && nmr/num(ans) !== orign/origd ) {
			        	ansBx.style.color = "#ff1ac6";
					    errBx.style.color = "#ff1ac6";
					   	errBx.innerHTML = origd + " needs to be divided by the same number you divided " + orign + " by";
		        	} else {
			        	errBx.style.color = "#fff9ea";
				        ansBx.style.color = "#0033cc";
		                ansBx.style.borderColor = "#e9d398";
						
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
		        			//alert("CheckDFrcD whlPt: " + whlPt);		
		        			if( whlPt !== 0 ) {
		        				instr3 = "If so, copy whole part, otherwise click 'Done'";
		        				nextBx = doc.getElementById("n0_" + nextWCol);	 
		        				nextBx.setAttribute("type", "text");
		        			}
		        			doc.getElementById("instr2").innerHTML = instr2;
		        			var instr3Bx = doc.getElementById("instr3");
		        			instr3Bx.style.color = "#b38f00";
		        			instr3Bx.innerHTML = instr3;
		        			if( nextBx ) {
		        				nextBx.focus();
		        			}
	        			} else {
	        				alert("You ran out of boxes. Click 'Done' to see if fractiion is reduced");
	        				//startAgain();
	        			}
	        			
		        	}
		        }
	        }
	     } else {
			ansBx.style.color = "#ff1ac6";
		    errBx.style.color = "#ff1ac6";
		   	errBx.innerHTML = ans + " is not a number";	     
	     }
	}
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
window.onload = function(){
    var doc = document;
    var startWhere = doc.getElementById("startHere").value;
    //alert("startWhere: " + startWhere + ":");
    var strtBx = doc.getElementById(startWhere);
    //alert("strtBx: " + strtBx + ":");
	var indcatr = Number(doc.getElementById("indcatr").value);
	var isDecToFrac = indcatr === 4;
	if( isDecToFrac ) {
		// what happens to these objects when instr2 is overwritten? Do they float around somewhere taking up space? fixit
		var truBtn = createRadioElement("Yes", "TorF", false, "T", "putWhlBox()" );
		var flsBtn = createRadioElement("No","TorF", false, "F", "promptForNum()" );
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