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
 * easier to multiply by a power of 10 than 125. simplify after converting decimal to fraction
 * to improper fraction fixit
 *
 * Mixed Number to fraction: need to be able to put final answer without filling in all the boxes fixit
 * 
 */
var x = 0;
var nSbxs = 24;
var allgood = true;
var partner = null;
var gpartdvd;
var nxtD;

var rowNo = 0;
var quotdigs = 0;
var whatbox = -1;
var gProd = 0;
var gBringDownDigs = [ 0, 0, 0, 0, 0,
                       0, 0, 0, 0, 0, 
                       0, 0, 0, 0, 0 ];
var calcDig;
var gNextBx;
                       
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
function checkF2D() { // if numbers get erased somehow, even if they're 0, this function hangs fixit. if you 
// write the number back in, it gives an error fixit. if you miss the decimal point, it's hard to see what's wrong fixit
	// if user clicks 'done' before all quot digits are in place, it shows counts an error, but no explanation what's wrong fixit
	allgood = true;
	var num = Number;
	var Mat = Math;
	var doc = document;
	var dvsrStr = doc.getElementById("oden").value;
	var dvsrBxs = doc.getElementsByName("dvsrdigs");
	var dvsrlen = dvsrBxs.length;
	var red = "#ff1ac6";
	for( var i = 0; i < dvsrlen; ++i ) {
		if( dvsrBxs[i].value !== dvsrStr.substr(i, 1) ) {
			allgood = false;
			//doc.getElementById("statusBox" + x).innerHTML = "dvsrBxs[" + i + "]: " +  dvsrBxs[i].value + " oden substr: " + dvsrStr.substr(i, 1);
			//x = (x + 1)%nSbxs;
			dvsrBxs[i].style.color = red;
			var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
			break;
		}
	}
	var dvdndStr = doc.getElementById("onum").value;	
	var dvdndBxs = doc.getElementsByName("dvddigs");
	var dvdlen = dvdndBxs.length;
	var dvdndEntrd = "";	
	var dividend = 0;
	var bigEnough = false;
	var divisor = num(dvsrStr);
	var whatDvdDig = 0;
	for( var i = 0; i < dvdlen; ++i ) {
		if( dvdndBxs[i].value !== dvdndStr.substr(i, 1) ) {
			allgood = false;
			//doc.getElementById("statusBox" + x).innerHTML = "dvdndBxs[" + i + "]: " +  dvdndBxs[i].value + " onum substr: " + dvdndStr.substr(i, 1);
			//x = (x + 1)%nSbxs;
			dvdndBxs[i].style.color = red;
			var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
			break;
		}
		dvdndEntrd += dvdndBxs[i].value;
		if( !bigEnough ) {
			dividend = num( dvdndEntrd );
			if( dividend >= divisor ) {
				bigEnough = true;
				whatDvdDig = i + 1;
			}
		}
	}
	if( !bigEnough ) {
		whatDvdDig = dvdlen;
	}
	var quotBxs = doc.getElementsByName("quotdigs");
	var quotlen = quotBxs.length;
	var nDvdEntrd = num( dvdndEntrd );
	var whole = nDvdEntrd%divisor === 0;
	var isDp = doc.getElementById("isDp");
	if( !whole && isDp.innerHTML !== "." ) {
		isDp.style.color = red;
		var errs = Number(doc.getElementById("errs").value);
        doc.getElementById("errs").value = errs + 1;
		isDp.innerHTML = ".";
		allgood = false;
		//doc.getElementById("statusBox" + x).innerHTML = "no Dp";
		//x = (x + 1)%nSbxs;
	}
	
	var expnt = 4; // always round to 4 decimal places

	var roundquot = Mat.floor(0.5 + nDvdEntrd*Mat.pow(10,expnt)/divisor);
	//doc.getElementById("statusBox" + x).innerHTML = "expnt: " + expnt + " roundquot: " + roundquot;
	//x = (x + 1)%nSbxs;
	var m = 0;
	var expnt2 = Mat.floor(Mat.log10(roundquot));
	for( var i = 0; i < quotlen && i <= expnt2; ++i ) {		
		var quotDig = num(quotBxs[i].value);
		var ten2pow = Mat.pow(10,expnt2 - i);
		var calcquotDig = Mat.floor(roundquot/ten2pow);
		roundquot = roundquot - ten2pow*calcquotDig;
		//doc.getElementById("statusBox" + x).innerHTML = "i: " + i + " quotlen: " + quotlen + " quotDig: " + quotDig + " calcquotDig: " + calcquotDig;
		//x = (x + 1)%nSbxs;
		if( quotDig !== calcquotDig) {
			allgood = false;
			//doc.getElementById("statusBox" + x).innerHTML = "quotDig[" + i + "]: " +  quotDig + " quotdig calc: " + calcquotDig;
			//x = (x + 1)%nSbxs;
			quotBxs[i].style.color = red;
			var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
			break;
		}
	}
	var newprod = 0;
	var diffEntrd = "";
	var l = 0;
	for( var i = 0; i < quotlen; ++i ) {			
		var quotDig = Math.floor(dividend/divisor);
		if( dividend >= divisor ) {
			var newprod = quotDig*divisor;
			var prodStr = newprod.toString();
			var prodBxs = doc.getElementsByName("op" + m + "_0");
			var prodlen = prodBxs.length;
			var k = 0;
			for( var j = 0; j < prodlen; ++j, ++k ) {
				if( prodBxs[j].value ) {
					if( prodBxs[j].value != prodStr.substr(k,1) ) {
						allgood = false;
						//doc.getElementById("statusBox" + x).innerHTML = " row " + i + " prodBxs[" + j + "]: " +  prodBxs[j].value + " prodStr.substr(" + k + "): " + prodStr.substr(k,1);
						//x = (x + 1)%nSbxs;
						prodBxs[j].style.color = red;
						var errs = Number(doc.getElementById("errs").value);
            			doc.getElementById("errs").value = errs + 1;
						break;
					}
				} else {
					k -= 1;
				}
			}
			var diff = dividend - newprod;
			var diffStr = diff.toString();
			var diffBxs = doc.getElementsByName("op" + m + "_1");
			var difflen = diffBxs.length;
			var k = 0;
			for( var j = 0; j < difflen; ++j, ++k ) {
				if( diffBxs[j].value ) {
					if( diffBxs[j].value != diffStr.substr(k,1) ) {
						allgood = false;
						//doc.getElementById("statusBox" + x).innerHTML = " row " + i + " diffBxs[" + j + "]: " +  diffBxs[j].value + " diffStr.substr(" + k + "): " + diffStr.substr(k,1);
						//x = (x + 1)%nSbxs;
						diffBxs[j].style.color = red;
						var errs = Number(doc.getElementById("errs").value);
           				doc.getElementById("errs").value = errs + 1;
						break;
					} else {
						diffEntrd += diffBxs[j].value;
					}
				} else {
					k -= 1;
				}
			}
			//doc.getElementById("statusBox" + x).innerHTML = "m: " + m + " j: " + j + " difflen: " + difflen + " diffEntrd: " + diffEntrd;
			//x = (x + 1)%nSbxs;
		}
		
		var bdBxs = doc.getElementsByName("bd" + m);
		if( bdBxs[l] ) {
			if( dvdndEntrd[whatDvdDig] ) {
				if( bdBxs[l].value !== dvdndEntrd[whatDvdDig]  ) {
					allgood = false;
					//doc.getElementById("statusBox" + x).innerHTML = " row " + i + " bdBxs[" + l + "]: " +  bdBxs[l].value + " dvdndEntrd[" + whatDvdDig + "]: " + dvdndEntrd[whatDvdDig];
					//x = (x + 1)%nSbxs;
					bdBxs[l].style.color = red;
					var errs = Number(doc.getElementById("errs").value);
            		doc.getElementById("errs").value = errs + 1;
					break;
				}
			} else if( bdBxs[l].value && bdBxs[l].value !== "0"  ) {
				allgood = false;
				//doc.getElementById("statusBox" + x).innerHTML = " row " + i + " bdBxs[" + l + "]: " +  bdBxs[l].value + " not 0";
				//x = (x + 1)%nSbxs;
				bdBxs[l].style.color = red;
				var errs = Number(doc.getElementById("errs").value);
            	doc.getElementById("errs").value = errs + 1;
				break;
			}
			if( bdBxs[l].value ) {
				diffEntrd += bdBxs[l].value;
			} else {
				diffEntrd += "0";
			}			
			whatDvdDig += 1;
			l += 1;
			//doc.getElementById("statusBox" + x).innerHTML = "i: " + i + " diffEntrd: " + diffEntrd + " divisor: " + divisor;
			//x = (x + 1)%nSbxs;
		} else {
			break;
		}
		dividend = num( diffEntrd );
		if( dividend >= divisor ) {
			l = 0;
			diffEntrd = "";
			m += 1;
		}
	}

	if( allgood ) {
		startAgain();
	}
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
    //var strtPt = onumStr.indexOf(".") + 1;
    //var len = onumStr.length;     		
	//var nchars = len - strtPt;
	//var quot = num("0." + onumStr.substr(strtPt, nchars));
	//var whlpart = onumStr.substr( 0, strtPt-1 );
	//if( num( whlpart > 0 ) ) {
	//	quot = num( onumStr );
	//}
	var red = "#ff1ac6";
    
	for( var i = 0; i < cols; ++i ) {
	    if( nums[i].value !== "" ) {
	   		lastcol = i;
	   		//doc.getElementById("statusBox" + x).innerHTML = "checkD2F nums[" + i + "]: " + nums[i].value;
           	//x = (x + 1)%nSbxs;
           	var j = 2*i + 1;
	   		lastDBx = doc.getElementById("d0_" + j)
    		lastdstr = lastDBx.value;
	    	if( isNaN(nums[i].value) ) {
	    		allgood = false;
	   			alert("i: " + i + " NaN nums[i]: " + nums[i].value + " allgood: " + allgood);
	   			nums[i].style.color = red;
	   		} else if( isNaN(lastdstr) ) {
	   		    allgood = false;
    		    alert("i: " + i + " NaN lastdstr: " + lastdstr + " allgood: " + allgood);
    			lastDBx.style.color = red;
    		}
    		//alert("i: " + i + " nums[i]: " + nums[i].value + " lastd: " + lastdstr);
    	} else {
           break;
        }
    }
    var lastn = num(nums[lastcol].value);  
	var lastd = lastdstr? num(lastdstr) : 1; // assume 1 if blank
	if( onum === 0 ) {
		if( lastn !== whl ) { 
			allgood = false;
			nums[lastcol].style.color = red;	    		    
	    	lastDBx.style.color = red;
			alert("decimal: " + onum + " not equal " + lastn);
		}
	} else {
		if( onum !== lastn/lastd ) {
			allgood = false;
			nums[lastcol].style.color = red;	    		    
	    	lastDBx.style.color = red;
			alert("decimal: " + onum + " not equal to " + lastn + "/" + lastd + " allgood: " + allgood);
		}
	    var rdfrc = reduce(lastn, lastd);
	    var testn = lastn - rdfrc.n;
	    var testd = lastd - rdfrc.d;
		if( lastn - rdfrc.n > 0 ) {
		    allgood = false;
			nums[lastcol].style.color = red;
			    alert("CheckD2F cols: " + cols + " lastcol: " + lastcol + " lastn: " + lastn + " rdfrc: " + rdfrc.n + "/" + rdfrc.d + " testn: " + testn + " testd: " + testd); 
				    		    
		}
		if( lastd - rdfrc.d > 0 ) {
		   	allgood = false;	    		    
	    	lastDBx.style.color = red;
	    	    alert("CheckD2F cols: " + cols + " lastcol: " + lastcol + " lastd: " + lastd + " rdfrc: " + rdfrc.n + "/" + rdfrc.d + " testn: " + testn + " testd: " + testd); 
	    	
		}
	}
	if( allgood ) {
		/* if( whl !== 0 && quot !== 0 ) {
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
		} else { */
			startAgain();
		//}
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
            nums[lastcol[j]].style.color = red;
            lastdBx.style.color = red;
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
        	var col = col < 12? col : col - 13 + frstdcol;
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
            var expAns = col === frstncol? whlprt :
                         col === frstdcol? oden :
                         col === scnddcol? onum :
                         col === thrddcol? whlprt*oden + onum :
                  					       97; // large prime, never to be expected
            if( col < frthdcol && nAns === expAns ) { 
                instr2 = "Copy denominator: " + oden + " to second numerator box";
                if( col === frstdcol ) {
                    instr2 = "Copy numerator of mixed number: " + onum + " to third box";
                } else if( col === scnddcol ) {
                    instr2 = "What is whlprt &times " + oden + " + " + onum;
                }
                nextBx = doc.getElementById("n0_" + nextCol);
                if( col > frstdcol ) {
                    instr2 = "Copy first denominator: " + oden + " to denominator";
                    nextBx = doc.getElementById("d0_" + col);
                }
                markGood( ansBx, instr2, "", nextBx );
            } else if( col > thrddcol && col%2 === 0 ) {
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
            } else if( col > thrddcol && col%2 === 1 ) {
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
        //var fakecol = col < 12? col : col - 13 + frstdcol;
        var reducing = col > 4 &&
        		num(doc.getElementById("indcatr").value) === 4 &&
        	 	Math.floor(num(doc.getElementById("onum").value)) > 0;
		//alert("reducing: " + reducing + " col: " + col + " indcatr: " + doc.getElementById("indcatr").value + " onum: " + doc.getElementById("onum").value);
        if( !isNaN(ans) ) {
        	var ocol = frstdcol - 2;
        	var odenBx = doc.getElementById("d0_" + ocol);
            var oden = odenBx.value;
            if( ans && col <= thrddcol && ans === oden ) {
 				var wcol = frstdcol - 3;
                var whlBx = doc.getElementById("n0_" + wcol);
                var whl = whlBx.value;
                if( reducing ) {
	        		var eBx = doc.getElementById("e0_" + nextcol);
	        		if( eBx ) {
	        			//alert("eBx exists, why doesn't it show? col: " + col + " nextcol: " + nextcol);
	        			eBx.innerHTML = "=";
	        			nextcol = nextcol + 1;
	        			var nextBx = doc.getElementById("n0_" + nextcol);
		        		var nextDBx = doc.getElementById("d0_" + nextcol);
		        		nextBx.setAttribute("type", "text");
		        		var styles = "border-bottom: 2px solid #005511";
						var td = nextBx.parentNode;
						td.setAttribute("style", styles);
		        		nextDBx.setAttribute("type", "text");
		        		var instr2 = "Is there a number that evenly divides numerator and denominator?";
	        			var instr3 = " If so, divide by it, otherwise click 'Done'";
						markGood( ansBx, instr2, instr3, nextBx );
	        		} else {
	        			alert("You ran out of boxes. Click 'Done' to see if fractiion is reduced");
	        			//startAgain();
	        		}                   
                } else if( col === frstdcol ) {
                	var instr2 = "Copy whole part of mixed number: " + whl + " to first box (Enter)";
                    nextcol = col - 1;
                    var nextBx = doc.getElementById("n0_" + nextcol);
                    markGood( ansBx, instr2, "", nextBx );	
                } else if( col === scnddcol ) {
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
            } else if( col%2 === 0 && col > thrddcol ) { // used to be col === 4
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
            } else if( col%2 === 1 && col > thrddcol ) { // used to be 5
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
            var instr2 = "Copy the denominator: '" + oden + "' to the box to the left of the 'divide by' sign (Enter)";
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


function pusharo( ev ) {
    ev = ev || window.event;
    var y = ev.keyCode;
    var doc = document;
    var num = Number;
    
    var indcatr = num(doc.getElementById("indcatr").value);
    //alert("key pressed. indcatr: " + indcatr);
    if( indcatr < 4 ) {
        var id = doc.activeElement.id;
        var len = id.length;
        var typ = id.substring(0,1);

        var row = num(id.substring(1,2));
        var col = num(id.substring(3,len));
        if( y === 37 ) {
            var prevCol = col - 1;
            var whereTo = typ + row + "_" + prevCol;
            //alert("we are here: " + id + ", going left to " + whereTo);
            var nextBx = doc.getElementById(whereTo);
            if( nextBx ) {
                nextBx.focus();
            }        
        } else if ( y === 38 ) {
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
        } else if( y === 39 ) {
            var nextCol = col + 1;
            var whereTo = typ + row + "_" + nextCol;
            var nextBx = doc.getElementById(whereTo);
            //alert("we are here: " + id + ", going right to " + whereTo);
            if( nextBx ) {
                nextBx.focus();
            } 
        } else if( y === 40 ) {
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
    } else if( indcatr === 5 ) {
    	if( y === 39 ) {
            var currBx = doc.activeElement;
            var potinpts = doc.getElementsByClassName("potinpt");
            var len = potinpts.length;
            var nextBx;
            for( var i = 0; i < len; ++i ) {
            	if( potinpts[i].isEqualNode( currBx ) ) {
            		nextBx = potinpts[i+1];
            		break;
            	}
            }
            if( nextBx ) {
                nextBx.focus();
                nextBx.type = "text";
                currBx.type = "hidden";
            }
            var divisor = num(doc.getElementById("oden").value);
            var lpartdvd;
            if( gpartdvd ) {
            	lpartdvd = gpartdvd*10;
            }
            var nxDbx = doc.getElementById("dd" + nxtD + "_0");
            if( nxDbx ) {
            	lpartdvd += num(nxDbx.value);
            }
	 		nxtD = nxtD - 1;
	 		var divisor = num(doc.getElementById("oden").value);
	 		instr2 = "How many times does " + divisor + " go into " + lpartdvd + "?";
        	instr3 = "If " + divisor + " is greater than " + lpartdvd + ", use arrow keys to move input box right";       	
        	markGood( null, instr2, instr3, nextBx ); 
        	var quotDigs = doc.getElementsByName("quotdigs");
        	
        	if( lpartdvd >= divisor ) {	
				var qlen = quotDigs.length;
				for( var i = 0; i < qlen; ++i ) {
					quotDigs[i].onkeyup = divide;
					doc.removeEventListener('keydown', pusharo);
				}
				var xtraDig = doc.getElementById("xt" + quotDigs);
				if( xtraDig ) {
					xtraDig.onkeyup=checkRoundOff;
				}
			}
			var id = currBx.id;
	       	var strtpt = id.indexOf("t") + 1;
	     	var nchars = id.length - strtpt;
	       	var col = num(id.substr(strtpt, nchars));
	       	var dpBx = doc.getElementById("isDp");
	       	if( dpBx ) { // whole quotients will not have a decimal point
		      	var dpcol = num(dpBx.getAttribute("name"));
		       	var diff = dpcol + 1 - col;
		   		//doc.getElementById("statusBox" + x).innerHTML = "pusharo dpcol: " + dpcol + " col: " + col + " diff: " + diff;
	    		//x = (x + 1)%nSbxs;
		       	if( diff >= 0  ) {
		        	// put leading zero
		        	//doc.getElementById("statusBox" + x).innerHTML = "pusharo xt" + j;
		       		//x = (x + 1)%nSbxs;
		       		var notq = doc.getElementById("xt" + col);
		       		notq.type = "text";
					notq.value = 0;
		       	}
		    }
			gpartdvd = lpartdvd;   
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
	        	var frstpart = onum.substr( 0, strtPt-1 );
	        	if( num(frstpart) > 0 ) {
	        		fracStr = frstpart + fracStr;
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
	        				//var whlPt = num(onum.substr(0, strtPt));
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
	        				       				
	        				/* if( whlPt !== 0 ) {
	        					instr3 = "If so, copy whole part, otherwise click 'Done'";
	        					nextBx = doc.getElementById("n0_" + nextWCol);	 
	        					nextBx.setAttribute("type", "text");
	        				} */
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
	        		var nextCol = col + 2;
	        		var nextBx = doc.getElementById("n0_" + nextCol);
	        		nextBx.setAttribute("type", "text");
	        		var styles = "border-bottom: 2px solid #005511";
					var td = nextBx.parentNode;
					td.setAttribute("style", styles);
					doc.getElementById("d0_3").type = "text";						
	        		instr3 = "divide previous numerator by some number that evenly divides previous numerator and denominator";
					doc.getElementById("e0_2").innerHTML = "=";					
	        		markGood( ansBx, instr2, instr3, nextBx );
	        	} else {
				   	markErr( ans + " should be a 1 followed by " + minDigits + " zeroes", ansBx );
	        	}
	        } else { // col > 1
	        	var prevCol = col - 2;
	        	var origd = num(doc.getElementById("d0_" + prevCol).value);
	        	if( origd%num(ans) !== 0 ) {
					markErr( ans + " needs to be a factor of " + origd, ansBx );
	        	} else {
		        	// check if there is a numerator
		        	// if there is, compare this fraction with previous fractions and see if it's reduced
		        	var nmr = doc.getElementById("n0_" + col).value;
		        	var orign = num(doc.getElementById("n0_" + prevCol).value);
		        	if( nmr && nmr/num(ans) !== orign/origd ) {
					   	var errm = origd + " needs to be divided by the same number you divided " + orign + " by";
					   	markErr( errm, ansBx );
		        	} else {
						// go to next whol part or numerator
	        			//var whlPt = num(onum.substr(0, strtPt));
	        			var nextECol = col + 1;
	        			var nextFCol = col + 2;
	        			var eBx = doc.getElementById("e0_" + nextECol);
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
	if( ins2 ) {
		doc.getElementById("instr2").innerHTML = ins2;
	}
	var instr3Bx = doc.getElementById("instr3");
	if( ins3 ) {
		instr3Bx.style.color = "#b38f00";
	    instr3Bx.innerHTML = ins3;		
	} else {
	    instr3Bx.style.color = "#fff9ea";
	}
	if( nBx ) {
		//nBx.type = "text"; // does this belong here? fixit
		nBx.focus();
		gNextBx = nBx;
	} else if( aBx ) {
		aBx.blur();
	}
}
function markErr( msg, aBx ) {
	var doc = document;
	if( aBx ) {
		aBx.style.color = "#ff1ac6";
		aBx.style.borderColor = "#ff1ac6";
	}
	var errBx = doc.getElementById("instr4");
	errBx.style.color = "#ff1ac6";
	errBx.innerHTML = msg;
	var errs = Number(doc.getElementById("errs").value);
    doc.getElementById("errs").value = errs + 1;
}
function checkYesNo( ev ) {
	ev = ev || window.event;
    if( ev.which === 89 || ev.which === 121 ||
    	ev.keyCode === 121 || ev.keyCode === 89) {
	    // yes, so put a box for whole part
	    //alert("answered yes");
	    var doc = document;
		var num = Number;
		var onum = num(doc.getElementById("onum").value);
		if( onum < 1 && onum !== 0) {
			var errs = num(doc.getElementById("errs").value);
			errs += 1;
	        doc.getElementById("errs").value = errs;
	        var red = "#ff1ac6";
			doc.getElementById("yesNoBx").style.color = red;
			//alert("in putWhlBox, error");
			return;
		}
		/* var whlBx = doc.getElementById("n0_0");
		whlBx.type = "text";
		whlBx.focus(); */
		var dBx = doc.getElementById("n0_1");
		dBx.type = "text";
		dBx.focus();
		var styles = "border-bottom: 2px solid #005511";
		var td = dBx.parentNode;
		td.setAttribute("style", styles);
		doc.getElementById("d0_1").type = "text";
		doc.getElementById("e0_0").innerHTML = "=";
		doc.getElementById("instr2").innerHTML = "Copy the entire number, leaving out the decimal point and trailing zeroes";
		var instr3Bx = doc.getElementById("instr3");
		instr3Bx.removeChild(instr3Bx.lastChild);
		instr3Bx.style.color ="#fff9ea";
	 } else if( ev.which === 78 || ev.which === 110 ||
    			ev.keyCode === 110 || ev.keyCode === 78 ) {	
	    // no, so prompt for numerator
	    //alert("answered no");
	    var doc = document;
		var num = Number;
		var onum = num(doc.getElementById("onum").value);
		if( onum >= 1 || onum === 0 ) {
			var errs = num(doc.getElementById("errs").value);
			errs += 1;
	        doc.getElementById("errs").value = errs;
	        var red = "#ff1ac6";
			doc.getElementById("yesNoBx").style.color = red;
			//alert("in promptForNum, error");
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
		instr3Bx.removeChild(instr3Bx.lastChild);
		instr3Bx.innerHTML = "ignoring leading and trailing zeros";	
		instr3Bx.style.color = "#b38f00";
	} else {
		var red = "#ff1ac6";
		document.getElementById("yesNoBx").style.color = red;
	}	
}
function divide( ev ) {
 	ev = ev || window.event;
	var ansBx = ev.target;
	var y = ev.keyCode;
	if( 36 < y && y < 41 ) {
		return; // it's an arrow key
	}
    var doc = document;
    var Num = Number;
    var id = ansBx.id;
    var strtpt = id.indexOf("t") + 1;
    var nchars = id.length - strtpt;
    var col = Num(id.substr(strtpt, nchars));
  
    var whatRow = rowNo;
    var prevRow = whatRow - 1;
    var divisor = Num(doc.getElementById("oden").value);
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
    var black = "#0033cc";
    var dvsrdigs = doc.getElementsByName("dvsrdigs");
    var dvsrdigslength = dvsrdigs.length;
    for (var i = 0; i < dvsrdigslength; ++i) {
        dvsrdigs[i].style.color = black;
    }

    var qLength = doc.getElementsByName("quotdigs").length;
    var quotDigs = qLength;
    
    var mcarry = 0;
    var i = 0;
    var Mat = Math;
    for (; i < dvsrdigslength; i++) {
        var dbx = dvsrdigslength - 1 - i;
        var addProd = Num(dvsrdigs[dbx].value) * ans + mcarry;
        mcarry = Mat.floor(addProd / 10);
        var mDig = addProd % 10;
        prod += Mat.pow(10, i) * mDig;
    }
    prod += Mat.pow(10, i) * mcarry;
    var prodMxIdx = prod > 0 ? Mat.floor(Mat.log10(prod)) : 1;
    calcDig = prodMxIdx;
    //doc.getElementById("statusBox" + x).innerHTML = "prod: " + prod + " calcDig: " + calcDig;
    //x = (x + 1)%nSbxs;
    gProd = prod;

    var dvdnd = 0;
    var dvdBxs = doc.getElementsByName("dvddigs");
    var dvdDigs = dvdBxs.length;
    
    for (var i = 0; i < dvdDigs; ++i) {
        dvdBxs[i].style.color = black;
    }
    var quotBxs = doc.getElementsByName("quotdigs");
    var quotDigs = quotBxs.length;
        for (var i = 0; i < quotDigs; ++i) {
	        quotBxs[i].style.color = black;
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
    var discard = 0;
    //var dividnd = Num(doc.getElementById("onum").value);

    if (whatRow === 0) {
        var i = 0;
        //var partDigs = dvdDigs - 1;
        //var throwway = dividnd%Mat.pow(10,partDigs);
       	var dvdnd = gpartdvd; // global variable saved from pusharo //( dividnd - throwway)/Mat.pow(10,partDigs);
        /* while( divisor > dvdpart && partDigs > 0 ) {
            i += 1;
            partDigs = partDigs - 1;
            throwway = dividnd%Mat.pow(10,partDigs);
            dvdpart =( dividnd - throwway)/Mat.pow(10,partDigs);
        }
        while (i >= 0) {
        	var dvdStr;
        	if( dvdBxs[i] ) {
        		dvdStr = dvdBxs[i].value;
        	}
        	if( dvdStr ) {
        		if( !isNaN( dvdStr ) ) {
            		dvdDigVal = Num(dvdBxs[i].value);
            	} else {
            		alert("how did a NaN: " + dvdStr + " get into the Dividend Box?");
            	}
            } else {
            	dvdDigVal = 0;
            }
            var ten2pow = Mat.pow(10, pow);
            dvdnd += ten2pow * dvdDigVal;
            --i;
            ++pow;
        } */
    } else { // whatRow !== 0
        var whatDvdBxs = "op" + prevRow + "_1";
        dvdBxs = doc.getElementsByName(whatDvdBxs);
        for (var i = 0; i < dvdBxs.length; ++i) {
            dvdBxs[i].style.color = black;
        }
        var bdBxs = doc.getElementsByName("bd" + prevRow);
        for (var i = 0; i < bdBxs.length; ++i) {
            bdBxs[i].style.color = black;
        }
        var bringdown = gBringDownDigs[prevRow];

        var maxp = dvdBxs.length + bringdown;
        while (pow < maxp) {
            if (pow < bringdown) {
                dvdDigVal = Num(bdBxs[bringdown - 1 - pow].value);
            } else {
                var dvdidx = maxp - 1 - pow;
                var whatDvdBx = dvdBxs[dvdidx];
                if (whatDvdBx !== null) {
                    dvdDigVal = Num(whatDvdBx.value);
                }
            }

            var ten2pow = Mat.pow(10, pow);
            dvdnd += ten2pow * dvdDigVal;

            ++pow;
        }
    } // is all this necessary? fixit
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
    var dvddigs;
    if (whatRow === 0) {
        dvddigs = origDvdDigs;
    } else {
        prevRow = whatRow - 1;
        dvddigs = doc.getElementsByName("op" + prevRow + '_1');
        bddigs = doc.getElementsByName("bd" + prevRow);
        bddigsLength = bddigs.length;
    }

    var instr2;
    var instr3;
    var nextBx;
    if (ans === 0) {
        ansBx.style.color = black; // it's already been checked
        //doc.getElementById("statusBox" + x).innerHTML = "in divide, putting onclick = roundOff on " + id;
        //x = (x + 1)%nSbxs;
        ansBx.onclick = roundOff;
        ansBx.onkeyup = checkRoundOff;
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
        var remainder = Num.MAX_SAFE_INTEGER;
        var bdNum = lastRowNum - 1;
        var bringDownDigits = doc.getElementsByName("bd" + bdNum);
        if( lastRowValue ) {
            remainder = 0;               
            var bdLength = bringDownDigits.length;
            var j = 0;
            for( var i = 0; i < bdLength; ++i ) {
                nextBx = bringDownDigits[bdLength-1-i];
                var bdValue = nextBx.value;
                if( bdValue ) { // don't count it unless it's filled in 
                    remainder += Num(bdValue)*Mat.pow(10,j);
                    ++j;
                } else {
                    break;
                }
            }
            for( var i = 0; i < lastRowLength; ++i ) {
                remainder += Num(lastrow[lastRowLength-1-i].value)*Mat.pow(10,j);
                ++j;
            }
        }
		if ((restQAreZero && remainder === 0) || whatRow === 0) { 
            ansBx.style.color = black;
        } else {
            var j = 0;
            nextBx = bddigs[j];
            rowNo = whatRow - 1;
            if( nextBx ) {
	            while( nextBx.value ) {
	            	++j;
	            	nextBx = bddigs[j];
	            	if( !nextBx ) {
	            		break;
	            	}
	            }
	        }
        }
        var dpCol = Num(doc.getElementById("isDp").getAttribute("name"));
        //doc.getElementById("statusBox" + x).innerHTML = "in divide col: " + col + " dpCol: " + dpCol + " string: " + doc.getElementById("isDp").name;
        //x = (x + 1)%nSbxs;
        if( nextBx ) {
            instr2 = 'Copy the next dividend digit or type "0" if there are no more digits';
        } else if( ( dpCol === 0 || dpCol > 3 ) && col === 0 ) {
        	instr2 = 'If quotient is a whole number, click "Done",'
            instr3 =  'otherwise click on the last quotient digit to cross it off';
        } else {
            alert("no nextBx; should be a bringdown, lastRowNum: " + lastRowNum + ", lastRowLength: " + lastRowLength);
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
		var lastprodop = visibleMrow.length-1;
		nextBx = visibleMrow[lastprodop];
		instr2 = "What is " + ansTxt + " times " + divisor;
    }
    if( nextBx ) {
        nextBx.type = "text";
    }
    markGood(ansBx, instr2, instr3, nextBx);
}
function multiply( col, whatRow ) {
    var doc = document;
    var Num = Number;
    var ansBxs = doc.getElementsByName("op" + whatRow + "_0");
    var ansLength = ansBxs.length;
    var bxNo = ansLength - 1 - col;
    var ans = Num(ansBxs[bxNo].value);
    var dec = whatRow;

    for (var prevrow = whatRow - 1; prevrow >= 0; prevrow--) {
        var bringDowns = gBringDownDigs[prevrow];
        if (bringDowns > 0) {
            dec += bringDowns - 1;
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
    var dvsrdigs = doc.getElementsByName("dvsrdigs");
    var dvsrLength = dvsrdigs.length;
    var whatDvsrDg = dvsrLength - 1 - col;
    if( whatDvsrDg < 0 ) { // most significant 2 digits of product may both
        whatDvsrDg = 0;    // depend on the most significant digit of divisor
    }

    var prod = gProd; // Num(doc.getElementById("operand" + whatRow + "_0").value);
    var Mat = Math;
    var ten2col = Mat.pow(10, col);
    var discard = prod % ten2col;
    var mainpart = prod % Mat.pow(10, col + 1);
    var expAns = (mainpart - discard) / ten2col;    
	var isLastMult = ( col === calcDig );
	//doc.getElementById("statusBox" + x).innerHTML = "col: " + col + " calcDig: " + calcDig + " isLastMult: " + isLastMult;
    //x = (x + 1)%nSbxs;
    var red = "#ff1ac6";
    var black = "#0033cc";
    if( ans === expAns ) {
    	var prodops = doc.getElementsByName("op" + whatRow + "_0");
		var lastprodop = prodops.length-1;
		var nxtBxNo = bxNo - 1;
        qBx.style.color = "#b53f25";

        var instr2 = "";
        if (isLastMult) {
            // check if user guessed too big
            if( prod > gDividend ) {
                var lastqtval = prod / Num(doc.getElementById("oden").value);
                var instr4 = prod + " is too big, try a quotient digit value smaller than " + lastqtval;
                var errBx = doc.getElementById("instr4");
                errBx.style.color = red;
                errBx.innerHTML = instr4;
                
                qBx.style.color = red; // no quotes use string variable called red
                qBx.focus();
                for (var i = 0; i < ansLength; ++i) {
                    ansBxs[i].style.color = red;
                }
                for (var i = 0; i < dvsrLength; ++i) {
                    dvsrdigs[i].style.color = red;
                }
                var prevRow = whatRow - 1;
                var dvddigs = doc.getElementsByName("op" + prevRow + "_1");
                var dvdlen = dvddigs.length;
                if( Num(whatRow) === 0 ) {              	
                    dvddigs = doc.getElementsByName("dvddigs");
                    dvdlen = dvddigs.length;
                }
                var dvdused;
                var dvdStr = "";
                var divisor = Num(doc.getElementById("oden").value);
                for( dvdused = 0; dvdused < dvdlen; ++dvdused ) {
					dvdStr += dvddigs[dvdused].value;
					if( Num(dvdStr) >= divisor ) {
						break;
					}
                }
                var bddigs = doc.getElementsByName("bd" + prevRow);
                var bdused;
                var bdlen = bddigs.length;
                if( Num(dvdStr) < divisor ) {
                	dvdused -= 1;
                	for( var bdused = 0; bdused < bdlen; ++bdused ) {
	                	dvdStr += bddigs[bdused].value;
						if( Num(dvdStr) >= divisor ) {
							break;
						}
					}
                }
                for( var i = 0; i <= dvdused; ++i ) {
                    dvddigs[i].style.color = red;
                }
                for( var i = 0; i <= bdused; ++i ) {
                    bddigs[i].style.color = red;
                }
                return;
            }

            var name = "cspan" + whatRow;
            var visibleBar = doc.getElementById(name);
            if (visibleBar) {
            	var styles = "border: none; backGround: #005511;";
				visibleBar.setAttribute("style", styles);
            }
            var visibleMinus = doc.getElementById("minus" + whatRow);
            if (visibleMinus) {
                visibleMinus.innerHTML = " - ";
            }
            prodops = doc.getElementsByName("op" + whatRow + "_1"); // no longer product but subtraction ops
            instr2 = "What is " + gDividend + " minus " + prod;
			lastprodop = prodops.length-1;
			nxtBxNo = lastprodop;
        }  
        qBx.style.color = black;
        dvsrdigs[whatDvsrDg].style.color = black;        
		nextBx = prodops[nxtBxNo];
		nextBx.type = "text";
        markGood( ansBxs[bxNo], instr2, "", nextBx );
    } else {
        qBx.style.color = red;
        dvsrdigs[whatDvsrDg].style.color = red;
        var instr3 = "Should be " + expAns + ", not " + ans;
        markErr(instr3, ansBxs[bxNo] );
    }
} // end multiply
function subtract(col, sbx) { // describe error in errBx, don't show column red fixit
    var doc = document;
    var Num = Number;
    var mat = Math;
    var ansBxs = doc.getElementsByName("op" + sbx + "_1");
    var bxNo = ansBxs.length - 1 - col;
    var ans = Num(ansBxs[bxNo].value);
    var whatprodboxes = "op" + sbx + "_0";
    var prodBxs = doc.getElementsByName(whatprodboxes);
    var prodlen = prodBxs.length;
    var prodidx = prodlen - 1 - col;
    var prodBx = prodBxs[prodidx];
    var currRow = rowNo;
    
	var divisor = Num(doc.getElementById("oden").value);
    var dvdStr = "";
    var dvdNum = 0;
                    	
    var dvddigs = doc.getElementsByName("dvddigs");
    var dvdlen = dvddigs.length;
    var dvdused = 0;
    var dvdidx = 0;
    var	dvdBx = dvddigs[dvdidx];
    if( Num(sbx) === 0 ) {
    	for( dvdused = 0; dvdused < dvdlen; ++dvdused ) {
			dvdStr += dvddigs[dvdused].value;
			dvdNum = Num(dvdStr);
			if( dvdNum >= divisor ) {
				break;
			}
    	}
    	dvdidx = dvdused - col;
    	dvdBx = dvddigs[dvdidx];
    } else {
    	var prevRow = currRow - 1;
    	dvddigs = doc.getElementsByName("op" + prevRow + "_1");
    	dvdlen = dvddigs.length;
    	for( dvdused = 0; dvdused < dvdlen; ++dvdused ) {
    		var nxtDig = dvddigs[dvdused].value;
    		if( !nxtDig ) {
    			nxtDig = "0";
    		}
			dvdStr += nxtDig;
			dvdNum = Num(dvdStr);
			if( dvdNum >= divisor ) {
				break;
			}
    	}
	    var bddigs = doc.getElementsByName("bd" + prevRow);
	    var bdused = 0;
	    var bdlen = bddigs.length;
	    if( dvdNum < divisor ) {
	        dvdused -= 1;
	        for( bdused = 0; bdused < bdlen; ++bdused ) {
	        	var nxtDig = bddigs[bdused].value;
	    		if( !nxtDig ) {
	    			nxtDig = "0";
	    		}
		        dvdStr += nxtDig;
		        dvdNum = Num(dvdStr);
				if( dvdNum >= divisor ) {
					break;
				}
			}
	    }
	
	    var dvdlen = dvdlen + bdused;
	    var dvdidx = dvdlen - col;
	    var	dvdBx;
	    if( dvddigs[dvdidx] ) {
	    	dvdBx = dvddigs[dvdidx];
	    }
	    var bdidx;
	    if( col <= bdused ) {
	    	bdidx = bdused - col;
	    	dvdBx = bddigs[bdidx];
	    	//dvdBx.value = "B"; 	
	    }
	}

    var diff = gDiff; // Num(doc.getElementById("operand" + sbx + "_1").value);
    var Mat = Math;
    var ten2col = Mat.pow(10, col);
    var discard = diff % ten2col;
    var mainpart = diff % Mat.pow(10, col + 1);

    var expAns = (mainpart - discard) / ten2col;
    var lastDig = diff > 0 ? Mat.floor(Mat.log10(diff)) : 0;
    var isLastSub = (col === lastDig);
    var black = "#0033cc";
    if (ans === expAns) {
        ansBxs[bxNo].style.color = black;
        var styles = "color: " + black;
        var styles = "color: #0033cc;";
        prodBx.setAttribute("style", styles);
        if( dvdBx ) {
        	dvdBx.setAttribute("style", styles);
        }
		var nextBx;
		
        if (isLastSub) {
            var divisor = Num(doc.getElementById("oden").value);
            var quotdigs = doc.getElementsByName("quotdigs");
            var quotDigs = quotdigs.length;
            var lastqcol = quotDigs - 1;
            if (diff >= divisor) { // quotient digit was guessed too small, back up
                if( nextQuotBox ) {
	                var qid = nextQuotBox.id
	                var qidx = qid.indexOf("t") + 1;
	                var qlen = qid.length;
	                var nchars = qlen - qidx;
	                lastqcol = Num(qid.substr(qidx, nchars)) + 1;
                } else {
                	lastqcol = 0;
                }
                var qtBx = doc.getElementById("qt" + lastqcol);
                if( !qtBx ) {
                	alert("qt " + lastqcol + " does not exist");
                }
                var red = "#ff1ac6";
                var qtDigVal = qtBx.value;
				var instr4 = diff + " is too big, " + divisor + " goes into " + gDividend + " more than " + qtDigVal + " times";
				//markErr(instr4, null); don't count it as an error if user guessed wrong
				var errBx = doc.getElementById("instr4");
				errBx.innerHTML = instr4;
				errBx.style.color = red;
                qtBx.focus();         
                qtBx.style.color = red;
                var diffdigs = doc.getElementsByName("op" + sbx + "_1");
                var diffdigsLength = diffdigs.length;
                
                var dvsrdigs = doc.getElementsByName("dvsrdigs");
                var dvsrdigsLength = dvsrdigs.length;
                for (var i = 0; i < dvsrdigsLength; ++i) {
                    dvsrdigs[i].style.color = red; // no quotes, use the string with variable name red
                }
                for (var i = 0; i < diffdigsLength; ++i) {
                    diffdigs[i].style.color = red;
                }
                for( var i = 0; i <= dvdused; ++i ) {
                    dvddigs[i].style.color = red;
                }
                for( var i = 0; i <= bdused; ++i ) {
                    bddigs[i].style.color = red;
                }
                for( var i = 0; i < prodlen; ++i ) {
                	prodBxs[i].style.color = red;
                }
                return;
			} // end diff >= divisor
			var whole = gDividend%divisor === 0;
            var restAreZero = true;
            var origdividend = Num(doc.getElementById("onum").value);
            // start with the most significant digit of quotient, find where
            // the user left off typing in numbers, calculate what the rest of 
            // the quotient digits will be. If they are not all zero, then
            // restAreZero is false
            var lastFilledBx = null;
            for (var i = lastqcol; i >= 0; i--) {
                var quotBx = doc.getElementById("qt" + i);
                if( !quotBx ) {
                	alert("lastqcol: " + lastqcol + " qt " + i + " does not exist"); 
                }
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
            lastFilledBx.style.color = black;
			var instr2;
			var instr3;
			
            if( lastqcol === 0 ) { // done calculating this quotient
				 // nextbox is null
                 var whole = origdividend%divisor === 0;
                 var dp = doc.getElementById("isDp");
                 if( dp.innerHTML !== "." && !whole && ans === 0 && Num(dp.name) < 4 ) {
	    			instr2 = "Click where decimal point should go, just above and to the right of last dividend digit";
                 } else {
                 	instr2 = 'If there are 4 or less decimal places, ';
                 	if( dp.innerHTML !== "." ) {
                 		instr2 += "click where decimal point should go";
                 	} else {
                 		instr2 += 'click "Done",';
                 	}
                 	instr3 =  'otherwise click on the last quotient digit to cross it off';
                 }
                 nextBx = null
            } else if (ans === 0 && restAreZero) { // nextbox is quotient box
            	instr2 = "How many times does " + divisor + " go into 0?";
                nextBx = nextQuotBox;
            } else { // nextbox is bringdown box
                nextBx = doc.getElementsByName("bd" + currRow)[0];
            	instr2 = 'Copy the next dividend digit or type "0" if there are no more digits';
            }
            //doc.getElementById("statusBox" + x).innerHTML = "in subtract putting onclick = roundOff on qt" + lastqcol;
            //x = (x + 1)%nSbxs;
            var prevQtDg = doc.getElementById("qt" + lastqcol);
            prevQtDg.onclick = roundOff;
            prevQtDg.onkeyup = checkRoundOff;
        } else { // not last subtraction, nextbox is another subtraction box
            var nxtBxNo = bxNo - 1;
            nextBx = ansBxs[nxtBxNo];
        }
        if( nextBx ) {
        	nextBx.type = "text";
        }
        markGood(ansBxs[bxNo], instr2, instr3, nextBx);    
    } else {
    	//doc.getElementById("statusBox" + x).innerHTML = "ansBx: " + bxNo + " prodidx: " + prodidx;
        //x = (x + 1)%nSbxs;
        var styles = "color: #ff1ac6;";
        prodBx.setAttribute("style", styles);
        if( dvdBx ) {
        	dvdBx.setAttribute("style", styles);
        }
        var instr3 = "Should be " + expAns + ", not " + ans;
        markErr(instr3, ansBxs[bxNo]);
    }
} // end subtract
function roundOff( ev ) {
    ev = ev || window.event;
    var evTarg = ev.target;
    var doc = document;
    var Num = Number;
    var quotdigs = doc.getElementsByName("quotdigs");
    var quotLength = quotdigs.length;
    var startnow = false;
    var quotDp = 5; //Number(doc.getElementById("quotDp").value);
    //doc.getElementById("statusBox" + x).innerHTML = "in roundOff quotLength: " + quotLength + " evTarg: " + evTarg.id;
    //x = (x + 1)%nSbxs;
    for( var i = 0; i < quotLength; ++i ) {
        var whatCol = quotLength - 1 - i;
        var whatQuotBx = quotdigs[i];
		//doc.getElementById("statusBox" + x).innerHTML = "i: " + i + " whatCol: " + whatCol + " whatQuotBx: " + whatQuotBx.id + " crossrest: " + crossrest;
    	//x = (x + 1)%nSbxs;
        if( whatQuotBx.isEqualNode(evTarg ) ) {
            if( whatCol === 0 ) {
                startnow = true;
                var instr2 = "Enter rounded value";
                var nextBx;
                j = 2;
                var roundingup = Num(evTarg.value >=5 );
                if( roundingup ) {
                	var red = "#ff1ac6"; 
                    nextBx = doc.getElementById("qt1");      
                    while( Num(nextBx.value) === 9 ) {
                    	nextBx.style.color = red;
                        nextBx = doc.getElementById("qt" + j);
                        // if no more qt boxes, find out if there is a new most dignificant digit of quotient
                        if( !nextBx ) {
                            nextBx = doc.getElementById("xt" + j);
                            if( nextBx ) {
                            	nextBx.type = "text";
                                nextBx.onkeyup = checkRoundOff;                          		
                            } else { //  there is no nextBx with xt instead of qt
                           		alert("in roundOff j = " + j + "; there is no nextBx");
                           	}  	
                        }
                        j = j + 1;
                    }
                    nextBx.style.color = "#ff1ac6";                      
                } else {
                    instr2 = "Click where decimal point should go, just above and to the right of last dividend digit";
                    if( doc.getElementById("isDp").innerHTML === "." ) {
                    	instr2 = 'Click "Done"';
                    }
                }
                markGood(evTarg, instr2, "", nextBx);
            } else {
                var rndMsg = quotDp + " decimal places";
                var instr4 = rndMsg + " is not there, finish the calculations if needed and click somewhere else";
                markErr( instr4, evTarg );
                break;
            }
        }
        if( startnow ) {
            whatQuotBx.onkeyup = checkRoundOff;
            var hasContent = whatQuotBx.value;
            if( hasContent ) {
                whatQuotBx.style.setProperty("text-decoration", "line-through");
                whatQuotBx.style.setProperty("text-decoration-color", "red");
                whatQuotBx.style.setProperty("text-decoration-style", "double");
            }
        }
    }
}
function checkRoundOff( ev ) {
    ev = ev || window.event;
    var ansBx = ev.target;
    var doc = document;
    var Num = Number;
    var id = ansBx.getAttribute("id");
    var strtpos = id.indexOf("t") + 1;
    var idlen = id.length;
    var nchars = idlen - strtpos;
    var col = Num((id.substr(strtpos, nchars)));
    var quotient = Num(doc.getElementById("quotient").value);
    var Mat = Math; 
    var roundedQuot = Mat.floor((quotient + 5*Mat.pow(10,col-1))/Mat.pow(10,col));
	//doc.getElementById("statusBox" + x).innerHTML = "checkRoundOff quotient: " + quotient + " roundedQuot: " + roundedQuot + " col: " + col;
	//x = (x + 1)%nSbxs;
	
    //var header = doc.getElementById("instr2");                   
    //var significant = header.innerHTML;
    significant = true; //significant.match(/significant/);
    var nSigDig = 0; // Num(doc.getElementById("nSigDig").value) + 1;
    
    var quotDigs = doc.getElementsByName("quotdigs");
    var qLength = quotDigs.length;
    if( significant && nSigDig > col ) {
        roundedQuot = Mat.floor((quotient + 5*Mat.pow(10,nSigDig-1))/Mat.pow(10,nSigDig));
        //document.getElementById("statusBox" + x).innerHTML = "roundedQuot = " + roundedQuot;
        //x = (x + 1)%nSbxs;
        var j = nSigDig - 1;
        while( j >= col ) {
            roundedQuot = 10*roundedQuot;
            //document.getElementById("statusBox" + x).innerHTML = "j = " + j + " roundedQuot = " + roundedQuot;
            //x = (x + 1)%nSbxs;
            j = j - 1;
        }
    }
    var enteredQuot = 0;
    
    var powOf10 = 1;
    // what has been entered so far, MSD to col
    for( var i = col; i < qLength; ++i ) {
        var idx = qLength - 1 - i;
        enteredQuot = powOf10*Num(quotDigs[idx].value) + enteredQuot;
        powOf10 *= 10;
    }
    var xtraDig = doc.getElementById("xt" + qLength);
    if( xtraDig ) {
    	enteredQuot = powOf10*Num(xtraDig.value) + enteredQuot;
    } 
    //doc.getElementById("statusBox" + x).innerHTML = "quotDigs.length: " + qLength + " enteredQuot: " + enteredQuot;
    //x = (x + 1)%nSbxs;
    if( roundedQuot === enteredQuot ) {
        var instr2 = 'Click "Done"';
        if( doc.getElementById("isDp").innerHTML !== "." ) {
    		instr2 = "Click where decimal point should go, just above and to the right of last dividend digit";
    	}
    	nextCol = col - 1;
    	var nextBx = doc.getElementById("qt" + nextCol);	
    	if( nextBx ) { 
    		var hasLineThrough = getComputedStyle(nextBx).getPropertyValue("text-decoration").indexOf("line-through") >= 0;
	    	//doc.getElementById("statusBox" + x).innerHTML = "hastextDec: " + hasLineThrough;
	    	//x = (x + 1)%nSbxs;
    		if( !hasLineThrough ) {
    			instr2 = "Enter rounded value";
    		} else {
    			nextBx = null;
    		}
    	}
        markGood(ansBx, instr2, "", nextBx );
    } else {
        var entireNum = Mat.floor(quotient/Mat.pow(10,col-1));
        var instr4 = entireNum + " does not round to " + enteredQuot + ", should be " + roundedQuot;
        markErr( instr4, ansBx );
    }
}
function showDp( ev ) {
	ev = ev || window.event;
    var where = ev.target;
    var doc = document;
    var isDp = doc.getElementById("isDp");
    
    if( where.isEqualNode(isDp) ) {
    	var potdps = doc.getElementsByClassName("quotDp");
		var dplen = potdps.length;
		for( var i = 0; i < dplen; ++i ) {
			potdps[i].style.color = "#f5f8ff";
		}
		isDp.style.color = "#0033cc";
		// how do I tell if it didn't leave offf somewhere else? fixit
		var prevInstr = doc.getElementById("instr2").innerHTML;
		if( prevInstr === "Click where decimal point should go, just above and to the right of last dividend digit" ) {  
        	var divisor = doc.getElementById("oden").value;
        	var lpartdvd = gpartdvd;
        	instr2 = "How many times does " + divisor + " go into " + lpartdvd + "?";
        	instr3 = "If " + divisor + " is greater than " + lpartdvd + ", use arrow keys to move input box right";
        	markGood(null, instr2, instr3, gNextBx );
		}
	}
}
function bringdown(sbx) {
    var doc = document;
    var Num = Number;
    var ansBxs = doc.getElementsByName("bd" + sbx);
    var thisRowsBdDigs = gBringDownDigs[sbx];
    var thisRowsBdDigsVal = (thisRowsBdDigs) ? Num(thisRowsBdDigs) : 0;
    var bxNo = thisRowsBdDigsVal;
    var ans = Num(ansBxs[bxNo].value);
    var dvddigs = doc.getElementsByName("dvddigs");
    var divisor = Num(doc.getElementById("oden").value);

    var dvdcol = dvddigs.length - 1;
    var partdvd = Num(doc.getElementById("dd" + dvdcol + "_0").value);
    //doc.getElementById("statusBox" + x).innerHTML = "bringdown before while dvdcol: " + dvdcol + " partdvd: " + partdvd;
    //x = (x + 1)%nSbxs;
    //alert("ok?");
    while( partdvd < divisor ) {
    	dvdcol -= 1;
    	partdvd *= 10;
    	dvdBx =  doc.getElementById("dd" + dvdcol + "_0");
    	if( dvdBx ) {
    		partdvd += Num(dvdBx.value);
    	}
    	//doc.getElementById("statusBox" + x).innerHTML = "dvdcol: " + dvdcol + " partdvd: " + partdvd;
    	//x = (x + 1)%nSbxs;
    	//alert("ok?");
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
    var outOfDvdDigs = dvdcol < 0;
    var expAns = outOfDvdDigs? 0 : (dividend % Mat.pow(10, dvdcol + 1) - discard) / ten2pow;
    var red = "#ff1ac6";
    var black = "#0033cc";
    if (ans === expAns) {
        ansBxs[bxNo].style.color = black;
        if (dvddigs[whatDig] && dvddigs[whatDig].style.color === red) {
            dvddigs[whatDig].style.color = black;
        }
        var newval = thisRowsBdDigsVal + 1;
        gBringDownDigs[sbx] = newval;
        var nextBx = nextQuotBox;
        nextBx.type = "text";

        // combine bd(rowNo) and op(rowNo)_1
        // don't actually need to calculate, just concatinate fixit
        var newdvd = 0;
        var frstBdBx = ansBxs.length - 1;
        var ten2pow = 1;
        var digFound = false;
        for( var i = frstBdBx; i >= 0; --i ) {
        	bxVal = ansBxs[i].value;
        	if( !digFound && bxVal && !isNaN(bxVal) ) {
        		digFound = true;
        	}
        	if( digFound ) {
        		newdvd += ten2pow*bxVal;
        		ten2pow *= 10;
        	}
        }
        var subBxs = doc.getElementsByName("op" + rowNo + "_1");
        var frstSubBx = subBxs.length - 1;
        for( var i = frstSubBx; i >= 0; --i ) {
        	bxVal = subBxs[i].value;
        	if( !digFound && bxVal && !isNaN(bxVal) ) {
        		digFound = true;
        	}
        	if( digFound ) {
        		newdvd += ten2pow*bxVal;
        		ten2pow *= 10;
        	}
        }
		rowNo++;
        markGood( ansBxs[bxNo], "What is " + newdvd + " divided by " + divisor + "?", "", nextBx);
    } else {
        if( dvddigs[whatDig] ) {
        	dvddigs[whatDig].style.color = "red";
        }
        markErr("Should be " + expAns + " not " + ans, ansBxs[bxNo]);
    }
}
function nix( ev ) {
	ev = ev || window.event;
    var ansBx = ev.target;
    var ans = ansBx.value;
	
    var doc = document;
    if( ans && ans !== "0" ) {
	    var divisor = doc.getElementById("oden").value;
	    var instr3 = divisor + " does not go into " + gpartdvd;
	    markErr( instr3, ansBx );
    }
}
function checkdd( ev ) {
    ev = ev || window.event;
    var ansBx = ev.target;

    var num = Number;
    var doc = document;
    var mat = Math;
  
    var ans = ansBx.value;
    if( !isNaN( ans ) ) {
        // dd2_0, dd1_0, dd0_0
        var id = ansBx.id;
        var len = id.length;
        var uscorepos = id.indexOf("_");
        var dvdlen = doc.getElementsByName("dvddigs").length;
        wutDgt = num(id.substr(uscorepos-1, 1));
        var dividnd = num(doc.getElementById("onum").value);
        var sigdigs = mat.floor(mat.log10(dividnd)) + 1;
        var trailzeros = dvdlen - sigdigs;
        var frstdig = dividnd%10;
        var modDgt = wutDgt - trailzeros;
        var ten2pow = mat.pow(10,modDgt);
        var throway = dividnd%ten2pow;
        var mostdgt = dividnd%mat.pow(10,modDgt+1);
        var expAns = (mostdgt - throway)/ten2pow;
        if( modDgt === 0 && num(ans) === frstdig ||
        	modDgt > 0 && num(ans) === expAns ) {
        	var nextcol = wutDgt - 1;
        	row = id.substr(len-1, 1);
        	var	nextBx = doc.getElementById("dd" + nextcol + "_" + row);
        	var	instr2 = "Enter next most significant digit of dividend";
        	var instr3 = "";
        	if( modDgt === 0 ) {
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
        if( wutDgt === 0 && num(ans) === frstdig ||
        	wutDgt > 0 && num(ans) === (mostdgt - throway)/ten2pow ) {
        	var nextcol = wutDgt - 1;
        	var	nextBx = doc.getElementById("ds_" + nextcol);
        	var	instr2 = "Enter next most significant digit of divisor";
        	var instr3 = "";
        	if( nextcol < 0 ) {
        		var nextBx = doc.getElementsByClassName("potinpt")[0];
        		nextBx.type = "text";
        		var dvdlen = doc.getElementsByName("dvddigs").length;
        		var msd = dvdlen - 1;
        		gpartdvd = num(doc.getElementById("dd" + msd + "_0").value);
        		var lpartdvd = gpartdvd;
        		nxtD = msd - 1;
        		if( lpartdvd >= divisor ) {
	        		var quotDigs = doc.getElementsByName("quotdigs");
					var qlen = quotDigs.length;
					for( var i = 0; i < qlen; ++i ) {
						quotDigs[i].onkeyup = divide;
						doc.removeEventListener('keydown', pusharo);
					}
				}
				if( doc.getElementById("isDp") ) {
					var potdps = doc.getElementsByClassName("quotDp");
					var dplen = potdps.length;
					for( var i = 0; i < dplen; ++i ) {
						potdps[i].style.color = "grey";
					}
	        		instr2 ="Click where decimal point should go, just above and to the right of last dividend digit";
        		} else {
        			var divisor = doc.getElementById("oden").value;
		        	var lpartdvd = gpartdvd;
		        	instr2 = "How many times does " + divisor + " go into " + lpartdvd + "?";
		        	instr3 = "If " + divisor + " is greater than " + lpartdvd + ", use arrow keys to move input box right"; 
        		}
        		markGood( ansBx, instr2, instr3, nextBx );
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
    //alert("startWhere: " + startWhere);
    var strtBx = doc.getElementById(startWhere);
	var indcatr = Number(doc.getElementById("indcatr").value);
	var isDecToFrac = indcatr === 4;
	if( isDecToFrac ) {
		// what happens to these objects when instr2 is overwritten? Do they float around somewhere taking up space? fixit
		//var truBtn = createRadioElement("Yes", "TorF", false, "T", "putWhlBox()", "tBtn" );
		//var flsBtn = createRadioElement("No","TorF", false, "F", "promptForNum()", "fBtn" );
		var instr2div = doc.getElementById("instr2");		
		//instr3div.prepend(flsBtn);
		//instr3div.prepend(truBtn);
		var yesNoBx = document.createElement("input");
		yesNoBx.type = "text";
		yesNoBx.setAttribute("id", "yesNoBx");
		//yesNoBx.onkeydown = erase;
		yesNoBx.onkeyup = checkYesNo;
		instr2div.append( yesNoBx );
		yesNoBx.focus();
	} else if( strtBx ) {
        strtBx.focus();
    }
    doc.addEventListener('keydown', pusharo);
    doc.getElementById("instr2").style.color = "#b38f00";
    
};