/**
 * 
 */
var x = 0;
var nSbxs = 30;
var paleDirt = "#dcd6d6";
var goodstyles = "color: paleDirt";
var errstyles = "color: red; text-shadow: -1px 0 #ff6d5d, 0 1px black; font-family: Verdana"; //", 1px 0 black, 0 -1px white";
//text-shadow: -1px 0 white, 0 1px black, 1px 0 black, 0 -1px white";
//"; text-shadow: 0 0 7px white";
//"; text-shadow: -2px 0 white, 0 2px white, 2px 0 white, 0 -2px white";
//text-shadow: 0 0 12px white;"
var allgood = true;
// make error messages red as well as the box fixit

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
    /*var local = partner;
    if( local ) {
        local.style.color = "#0033cc";
        local.value = "";
        partner = null;
    } */
    //ev.preventDefault(); // this locks everything up so no input box anywhere works
    return false;
}
function checkAll() {
	var num = Number;
    var doc = document;

	var fDid = "d0_4";
	var fNid = "n0_4";
	var fDenS = doc.getElementById(fDid).value;
	var fNumS = doc.getElementById(fNid).value;
	var pDenS = "";
	var pNumS = "";
	var fDen = 97;
	var fNum = 97;
	var i = 8;
	allgood = true;
	
	// is a realistic loop end? fixit
	// make it scroll past edge of page fixit
	for( i = 8; i < 100; i += 4 ) {
		pDenS = fDenS;
		pNumS = fNumS;
		fDenS = doc.getElementById(fDid).value;
		fNumS = doc.getElementById(fNid).value;
		if( fDenS !== "" && fNumS !== "" && !isNaN(fDenS) && !isNaN(fNumS) ) {
			fDid = "d0_" + i;
			fNid = "n0_" + i;
		} else {
			fDen = num(pDenS);
			fNum = num(pNumS);
			break;
		}
		
	}
	var rdfrac = reduce(fNum, fDen);
	if( fNum !== rdfrac.n || fDen !== rdfrac.d ) {
		allgood = false;
		var errs = Number(doc.getElementById("errs").value);
		doc.getElementById("errs").value = errs + 1;
		var instrBx = doc.getElementById("instr2");
		instrBx.setAttribute("style", errstyles);
		instrBx.innerHTML.innerHTML = pNumS + " / " + pDenS + " is not reduced. Enter a factor that evenly divides both " + pNumS + " and " + pDenS;
		var col = i - 6;
		var bxId = "d0_" + col; // not necessarily where you want to go if user hits done prematurely fixit
		//alert("bxId: " + bxId);
		doc.getElementById(bxId).focus();
	}
	if( allgood ) {
		startAgain();
	}
}
function checkFact( ev ) {
	ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;

        var ansBx = ev.target;
		var id = ansBx.id;
        var len = id.length;
        var pos = id.indexOf("_");
        var col = num(id.substr(pos+1, len));
		var prevCol = col - 2;
		var ans = ansBx.value;
		var nans = 97;
		if( !isNaN(ans) ) {
			nans = num(ans);
		}
		var prevNum = num(doc.getElementById("n0_" + prevCol).value);
		var prevDen = num(doc.getElementById("d0_" + prevCol).value);
		var instrBx = doc.getElementById("instr2");
		if( prevNum%nans === 0 && prevDen%nans === 0 ) {
			instrBx.setAttribute("style", goodstyles);
			instrBx.innerHTML = "Copy denominator: " + ans + " to numerator";
			nextBx = doc.getElementById("n0_" + col);
			nextBx.focus();
		} else {
			ansBx.style.color = "red";
		    var errs = Number(doc.getElementById("errs").value);
			doc.getElementById("errs").value = errs + 1;
			
			instrBx.setAttribute("style", errstyles);
			instrBx.innerHTML = "Factor needs to evenly divide both " + prevNum + " and " + prevDen;
		}
	}
}
function checkA( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;

        var ansBx = ev.target;
		var id = ansBx.id;
        var len = id.length;
        var pos = id.indexOf("_");
        var col = num(id.substr(pos+1, len));
		
		var offs = 4*(Math.floor(col/4) - 1);
		var col0 = offs + col%2;
		var col1 = offs + col%2 + 1;
		var col2 = offs + col%2 + 2;
		var col3 = offs + col%2 + 3;
		var den1 = 1;
		//var den3 = 1;
		var val = doc.getElementById("d0_" + col1).value;
		var isBlank1 = val == "";
		if( !isBlank1 && !isNaN(val) ) {
			den1 = num(val);
		}
		val = doc.getElementById("d0_" + col3).value;
		var isBlank3 = val == "";
		//if( !isBlank3 && !isNaN(val) ) {
		//	den3 = num(val);
		//}
		//alert("col0123: " + col0 + ", " + col1 + ", " + col2 + ", " + col3);
		var den0 = num(doc.getElementById("d0_" + col0).value);
		var den2 = num(doc.getElementById("d0_" + col2).value);
		prev2 = den0*den1;
		//alert("den0123, prev2: " + den0 + ", " + den1 + ", " + den2 + ", " + den3 + ", " + prev2);

		// are previous two denominators equal and multipliers blank or 1?
		if( prev2 === den0 && prev2 === den2 ) {
			
	        var ans = ansBx.value;
			var nans = 97; // large prime that will never equal denominator
			if( !isNaN(ans) ) {
				nans = num(ans);
			}
			var nord = id.substr(0,1);
			var num0 = num(doc.getElementById("n0_" + col0).value);
			var num2 = num(doc.getElementById("n0_" + col2).value);
			var instrBx = doc.getElementById("instr2");
			// is this a denominator? if so check equal to previous 2
			if( nord.localeCompare("d") === 0 ) {
				if( nans === prev2 ) {
					
					var instr2 = "Add the two numerators: " + num0 + " + " + num2;
					if( !isBlank1 || !isBlank3 ) { // should be doing checkM fixit
						instr2 = "What is " + num0 + " + " + num2; // fixit
					}
					instrBx.setAttribute("style", goodstyles);
					instrBx.innerHTML = instr2;
					var nextBx = doc.getElementById("n0_" + col);
					nextBx.focus();
				} else {
					//alert("painting denominator red");
					//id = ansBx.id;
					//alert("in checkA d nord, red Box: " + nord + ", " + id);
					ansBx.style.color = "red";
	            	var errs = Number(doc.getElementById("errs").value);
		            doc.getElementById("errs").value = errs + 1;
					instrBx.setAttribute("style", errstyles);
					instrBx.innerHTML = "Denominator needs to equal the previous 2 denominators: " + prev2;
				}
			// is this a numerator? if so, check addition
			} else if( nord.localeCompare("n") === 0 ) {
				if( nans === num0 + num2 ) {
					var nextCol = col + 1;
					var nextOp = doc.getElementById("o0_" + nextCol);
					nextOp.innerHTML = "&divide"; 
					nextOp.setAttribute("name", "divide");
					nextCol = col + 2;
					nextBx = doc.getElementById("n0_" + nextCol);
					nextBx.setAttribute("type", "text");
					nextBx.onkeyup = checkN;
					nextBx = doc.getElementById("d0_" + nextCol);
					nextBx.setAttribute("type", "text");
					nextBx.onkeyup = checkFact;
					nextBx.focus();
					instrBx.setAttribute("style", goodstyles);
					instrBx.innerHTML = 'If reduced, click "Done", else enter a common factor of numerator and denominator';
					//alert("is numerator red?"); 
				} else {
					//id = ansBx.id;
					//alert("in checkA n nord, red Box: " + nord + ", " + id);
					ansBx.style.color = "red";
		            var errs = Number(doc.getElementById("errs").value);
			        doc.getElementById("errs").value = errs + 1;
					instrBx.setAttribute("style", errstyles);
					instrBx.innerHTML = "Numerator should be " + num0 + " + " + num2;
				}
			} else {
				alert("what kind of numerator or denominator is: " + nord);
			}
        } else {
			checkM( ev );			
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
		var nans = 97;
		if( !isNaN(ans) ) {
			nans = num(ans);
		}
		var id = ansBx.id;
        var len = id.length;
        var pos = id.indexOf("_");
        var col = num(id.substr(pos+1, len));
		var nord = id.substr(0,1);
		var col0 = col - 4;
		var col1 = col - 3;
		var num0 = num(doc.getElementById(nord + "0_"+ col0).value);
		var num1 = num(doc.getElementById(nord + "0_"+ col1).value);
		var instrBx = doc.getElementById("instr2");
		if( nans === num0*num1 ) {
			var notnord = "n";
			if( nord.localeCompare("n") === 0 ) {
				col = col + 2;
				notnord = "d";
			}
			col0 = col - 4;
			col1 = col - 3;
			//alert("notnord, col0, col1: " + notnord + ", " + col0 + ", " + col1);
			var nextop0 = num(doc.getElementById(notnord + "0_" + col0).value);
			var nextop1 = num(doc.getElementById(notnord + "0_" + col1).value);
			var instr2 = "What is " + nextop0 + " times " + nextop1;
			
			var nextBx = doc.getElementById(notnord + "0_" + col);
			instrBx.setAttribute("style", goodstyles);
			if( nord.localeCompare("n") === 0 && col%4 === 0 ) {
				ansBx.blur();
				instr2 = "Are both denominators the same?";
				instrBx.innerHTML = instr2;
				var truBtn = createRadioElement("Yes", "TorF", false, "T", "copynum()", "tBtn" );
				var flsBtn = createRadioElement("No","TorF", false, "F", "multfacts()", "fBtn" );
				instrBx.appendChild(truBtn);
				instrBx.appendChild(flsBtn);
				doc.getElementById("startHere").value = nextBx.id;
				return;
			}
			instrBx.innerHTML = instr2;	
			nextBx.focus();
		} else {
			ansBx.style.color = "red";
			//id = ansBx.id;
			//alert("in checkM red Box: " + id);
		    var errs = Number(doc.getElementById("errs").value);
			doc.getElementById("errs").value = errs + 1;
			instrBx.setAttribute("style", errstyles);
			instrBx.innerHTML = "Numerator needs to be " + num0 + " times " + num1;
		}
	}
}
function checkDiv( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;

        var ansBx = ev.target;
        var ans = ansBx.value;
		var nans = 97;
		if( !isNaN(ans) ) {
			nans = num(ans);
		}
        var id = ansBx.id;
        
        var len = id.length;
        var pos = id.indexOf("_");
        var col = num(id.substr(pos+1, len));
		var nord = id.substr(0,1);
		var prev2col = col - 4;
		var prevCol = col - 2;
		var prev2var = num(doc.getElementById(nord + "0_" + prev2col).value);
		var prevVar = num(doc.getElementById(nord + "0_" + prevCol).value);
		var instrBx = doc.getElementById("instr2");
		if( prev2var/prevVar === nans ) {
			var notnord = "n";
			prev2var = num(doc.getElementById(notnord + "0_" + prev2col).value);
			prevVar = num(doc.getElementById(notnord + "0_" + prevCol).value);
			var instr2 =  "What is " + prev2var + " divided by " + prevVar + "?";
			if( nord.localeCompare("n") === 0) {
				notnord = "d";
				col = col + 1;
				// show new boxes
				var opBx = doc.getElementById("o0_" + col);
				opBx.innerHTML = "&divide";
				opBx.setAttribute("name", "divide");
				col = col + 1;
				var nBx = doc.getElementById("d0_" + col);
				nBx.type = "text;"
				nBx.onkeyup = checkFact;
				nBx = doc.getElementById("n0_" + col);
				nBx.type = "text;"
				nBx.onkeyup = checkN;
				
				instr2 = 'If reduced, click "Done", else enter a common factor of numerator and denominator'; 
			}
			instrBx.setAttribute("style", goodstyles);
			instrBx.innerHTML = instr2;
			doc.getElementById(notnord + "0_" + col).focus();
		} else {
			ansBx.style.color = "red";
			var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
			instrBx.setAttribute("style", errstyles);
			instrBx.innerHTML = "Needs to be " + prev2var + " &divide " + prevVar;
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
		var nans = 97; // large prime that will never equal denominator
		if( !isNaN(ans) ) {
			nans = num(ans);
		}
        var id = ansBx.id;
        
        var len = id.length;
        var pos = id.indexOf("_");
        var col = num(id.substr(pos+1, len));
		var whatDen = "d0_" + col;
		var den = num(doc.getElementById(whatDen).value);
		var instrBx = doc.getElementById("instr2");
		if( nans !== den ) {
			ansBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
			instrBx.setAttribute("style", errstyles);
			instrBx.innerHTML = "Numerator needs to be the same as denominator: " + den;
		} else {
			var nextCol = col + 1;
			whatDen = "d0_" + nextCol;
			var nextDen = num(doc.getElementById(whatDen).value);
			var instr2 = "What is a factor you can multiply " + nextDen + " by so that both denomitors are equal?";
			nextCol = col + 2;
			prevCol = col - 1;
			var op = doc.getElementById("o0_" + prevCol).getAttribute("name");
			if( col%4 === 3 ) {	
				nextCol = col + 1;
				var	prev2col = col - 3;
				prevcol = col - 2;
				var prev2den = doc.getElementById("d0_" + prev2col).value;
				var prevden = doc.getElementById("d0_" + prevcol).value;
				instr2 = "What is " + prev2den + " times " + prevden;
			} else if( op.localeCompare("divide") === 0 ) {
				prevCol = col - 2;
				var prevDen = num(doc.getElementById("d0_" + prevCol).value);
				instr2 = "What is " + prevDen + " divided by " + den;
				var next1 = col + 1;
				doc.getElementById("e0_" + next1).innerHTML = "=";
				var nBx = doc.getElementById("d0_" + nextCol);
				nBx.type = "text";
				nBx.onkeyup = checkDiv;
				nBx = doc.getElementById("n0_" + nextCol);
				nBx.type = "text";
				nBx.onkeyup = checkDiv;
				var styles = "border-bottom: 2px solid " + paleDirt;
				var td = nBx.parentNode;
				td.setAttribute("style", styles);
			} else {
				//var cmp = op.localeCompare("divide");
				//alert("col, op, cmp: " + col + ", " + op + ", " + cmp);
			}
			instrBx.setAttribute("style", goodstyles);
			instrBx.innerHTML = instr2;
			var nextBx = doc.getElementById("d0_" + nextCol);
			nextBx.focus();
		}
	}
}
function checkD( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;
		var mat = Math;

        var ansBx = ev.target;
        var ans = ansBx.value;
		var nans = 97;
		if( !isNaN(ans) ) {
			nans = num(ans);
		}
        var id = ansBx.id;
        
        var len = id.length;
        var pos = id.indexOf("_");
        var col = num(id.substr(pos+1, len));
		var otherCol = (col + 1) % 4;
		var	otherDen = "d0_" + otherCol;
		var target = num(doc.getElementById(otherDen).value);
		var offs = 4*mat.floor(col/4);
		otherCol = offs + ((col + 1) % 4);
		otherDen = "d0_" + otherCol;
		var otherOrig = num(doc.getElementById(otherDen).value);
		var otherFactCol = otherCol + 1;
		var otherFact = doc.getElementById("d0_" + otherFactCol);
		var otherFactVal = otherFact.value;
		var otherFactIsEmpty = otherFactVal === "";
		var otherFactIsThisDen = false;
		var origcol = col - 1;
		var orig = num(doc.getElementById("d0_" + origcol).value);
		var otherFactN = 1;
		if( !otherFactIsEmpty ) {
			otherFactN = num(otherFactVal);
			if( otherFactN === orig ) {
				otherFactIsThisDen = true;
			}
		}
		// this lets invalid factors pass fixit
		// it's the other beginning denominator
		// it's a factor of the other denominator that is not
		// included in the orig denominator
		// problem was when you multiply by other denominator late in the game and need
		// to multiply current denominator by 1 to not make it any bigger
		// so let 1 be a valid entry no matter what?
		// 1 is ok provided orig denominator is bigger than other product or bigger than beginning orig denominator times other denominator
		// need to allow whatever factor it takes to make them equal after blowing it up
		// won't let you skip problem you can't solve fixit
		var otherProd = otherOrig*otherFactN;
		var biggrThanOtherProd = orig >= otherProd &&  orig%otherProd === 0;
		var ok1 = nans === 1 && biggrThanOtherProd;
		var isFactOfOtherProd = (otherProd)%(orig*nans) === 0;
		//var dividend = mat.floor(otherProd/orig);
		//var modresult = dividend%nans;
		//var	isFactOfOtherProd = modresult === 0;
		var lcm = num(doc.getElementById("lcm").value);
		var instrBx = doc.getElementById("instr2");
		var isOtherDen = nans === target;
		var isFactOfLCM = (lcm)%(orig*nans) === 0;
		//alert("x: " + x);
		/*
		doc.getElementById("statusBox" + x).innerHTML = "origcol: " + origcol + " col: " + col;
		x = (x + 1)%nSbxs;
		doc.getElementById("statusBox" + x).innerHTML = "otherCol: " + otherCol + " otherFactCol: " + otherFactCol;
        x = (x + 1)%nSbxs;
		doc.getElementById("statusBox" + x).innerHTML = "orig: " + orig + " ans: " + ans;
		x = (x + 1)%nSbxs;
		doc.getElementById("statusBox" + x).innerHTML = "otherOrig: " + otherOrig + " otherFact: " + otherFactN;
		x = (x + 1)%nSbxs;
		doc.getElementById("statusBox" + x).innerHTML = "isOtherDen: " + isOtherDen + " isFactOfLCM: " + isFactOfLCM;
		x = (x + 1)%nSbxs;
		
		//doc.getElementById("statusBox" + x).innerHTML = "biggrThanOtherProd: " + biggrThanOtherProd + " ok1: " + ok1;
		//x = (x + 1)%nSbxs;
		doc.getElementById("statusBox" + x).innerHTML = "isFactOfOtherProd: " + isFactOfOtherProd + " ok1: " + ok1;
		x = (x + 1)%nSbxs;
		*/
		if( isFactOfLCM || isOtherDen || isFactOfOtherProd || ok1 ) { //}|| isFactOfOtherProd ) { // finding lcm or cross multiplying
			instrBx.setAttribute("style", goodstyles);
			instrBx.innerHTML = "Copy Denominator: " + ans + " to numerator, so you're multiplying by 1";
			var nextBx = doc.getElementById("n0_" + col);
			nextBx.focus();
		} else {
			ansBx.style.color = "red";
            var errs = Number(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
			instrBx.setAttribute("style", errstyles);
			instrBx.innerHTML = ans + " is not the other denominator ( " + target + " ) and is not a factor of lcm ( " + lcm + " ) that is not already included in denominator " + orig;
		}
	}
}
function copynum() {
	var doc = document;
	var num = Number;
	var startWhere = doc.getElementById("startHere").value;
	var unPos = startWhere.indexOf("_");
	var len = startWhere.length;
	var col = num(startWhere.substr(unPos+1, len-1));
	var col0 = col - 4;
	var col2 = col - 2;
	var den0 = num(doc.getElementById("d0_" + col0).value);
	var den2 = num(doc.getElementById("d0_" + col2).value);
	//alert("startWhere, col02, den02: " + startWhere + ", " + col0 + ", " + col2 + ", " + den0 + ", " + den2);
	if( den0 !== den2 ) {
		var errs = Number(doc.getElementById("errs").value);
        doc.getElementById("errs").value = errs + 1;
		doc.getElementById("T").style.color = "red";
		return;
	}
	
	doc.getElementById("F").style.color = paleDirt;
    var strtBx = doc.getElementById(startWhere);
	strtBx.onkeyup = checkA;
	var unPos = startWhere.indexOf("_");
	var len = startWhere.length;
	var col = num(startWhere.substr(unPos+1, len-1));
	var bxId = "n0_" + col;
	var nmr = doc.getElementById(bxId);
	nmr.onkeyup = checkA;
	//alert("set nmr: " + bxId + " onkeyup to checkA");
	strtBx.focus();
	var instrBx = doc.getElementById("instr2");
	instrBx.setAttribute("style", goodstyles);
	instrBx.innerHTML = "Copy " + den0 + " to new denominator";
}
function multfacts() {
	var doc = document;
	var num = Number;
	var startWhere = doc.getElementById("startHere").value;
	var unPos = startWhere.indexOf("_");
	var len = startWhere.length;
	var col = num(startWhere.substr(unPos+1, len-1)) - 2;
	var bxId = "d0_" + col;
	//alert("StartWhere, unPos, len, col, bxId: " + startWhere + ", " + unPos + ", " + len + ", " + col + ", " + bxId);
	var den2 = doc.getElementById(bxId).value;
	col = col - 2;
	bxId = "d0_" + col;
	var den0 = doc.getElementById(bxId).value;
	
	if( den0 === den2 ) {
		var errs = num(doc.getElementById("errs").value);
        doc.getElementById("errs").value = errs + 1;
		doc.getElementById("F").style.color = "red";
		return;
	}
	doc.getElementById("T").style.color = paleDirt;
	var styles = "border-bottom: 2px solid " + paleDirt;
	bxId = "o0_" + col;
	var whatBx = doc.getElementById(bxId);
	whatBx.innerHTML = "&times";
	whatBx.setAttribute("name", "times");
	col = col + 1; // col1
	bxId = "d0_" + col;
	var newDen = doc.getElementById(bxId);
	newDen.setAttribute("type", "text");
	bxId = "n0_" + col;
	var nmr = doc.getElementById(bxId);
	nmr.setAttribute("type", "text");
	var td = nmr.parentNode;
    td.setAttribute("style", styles);
	col = col + 1; // col2
	bxId = "o0_" + col;
	whatBx = doc.getElementById(bxId);
	whatBx.innerHTML = "&times";
	whatBx.setAttribute("name", "times");
	col = col + 1; // col3
	bxId = "d0_" + col;
	var dnm = doc.getElementById(bxId);
	dnm.setAttribute("type", "text");
	bxId = "n0_" + col;
	nmr = doc.getElementById(bxId);
	nmr.setAttribute("type", "text");
	td = nmr.parentNode;
	td.setAttribute("style", styles);
	col = col + 1; // col4
	bxId = "d0_" + col;
	dnm = doc.getElementById(bxId);
	dnm.onkeyup = checkA;
	bxId = "n0_" + col;
	nmr = doc.getElementById(bxId);
	nmr.onkeyup = checkA;
	col = col + 1; // col5	
	bxId = "o0_" + col;
	whatBx = doc.getElementById(bxId);
	whatBx.innerHTML = "+";
	whatBx.setAttribute("name", "plus");
	col = col + 1; // col6
	bxId = "d0_" + col;
	dnm = doc.getElementById(bxId);
	dnm.setAttribute("type", "text");
	dnm.onkeyup = checkA;
	//alert("bxId: " + bxId + " should  have onkeyup function checkA");
	bxId = "n0_" + col;
	nmr = doc.getElementById(bxId);
	nmr.setAttribute("type", "text");
	nmr.onkeyup = checkA;
	//alert("bxId: " + bxId + " should  have onkeyup function checkA");
	td = nmr.parentNode;
	td.setAttribute("style", styles);
	col = col + 1; // col7
	bxId = "e0_" + col;
	doc.getElementById(bxId).innerHTML = "=";
	col = col + 1; // col8
	bxId = "d0_" + col;
	doc.getElementById(bxId).setAttribute("type", "text");
	dnm.onkeyup = checkA;
	bxId = "n0_" + col;
	nmr = doc.getElementById(bxId);
	nmr.setAttribute("type", "text");
	nmr.onkeyup = checkA;
	td = nmr.parentNode;
	td.setAttribute("style", styles);
	newDen.focus();
	var instrBx = doc.getElementById("instr2");
	instrBx.setAttribute("style", goodstyles);
	instrBx.innerHTML = "What is a factor you can multiply " + den0 + " by so that both denominators are equal?";
}

window.onload = function() {
	var doc = document;

	var indcatr = Number(doc.getElementById("indcatr").value);
	var isPlusOrMinus = indcatr < 2;
	if( isPlusOrMinus ) {
		// what happens to these objects when instr2 is overwritten? Do they float around somewhere taking up space? fixit
		var truBtn = createRadioElement("Yes", "TorF", false, "T", "copynum()", "tBtn" );
		var flsBtn = createRadioElement("No","TorF", false, "F", "multfacts()", "fBtn" );
		var instr2div = doc.getElementById("instr2");
		instr2div.appendChild(truBtn);
		instr2div.appendChild(flsBtn);
	}
}