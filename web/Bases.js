/**
 * 
 */
var x = 0;
var nSbxs = 24;

function check() {
	var indcatr = Number(document.getElementById("indcatr").value);
    if( indcatr < 1 ) {
        checkFilled();
    } /* else if( indcatr < 2 ) {
        checkOrd();
    } else if( indcatr < 3 ) {
        checkMix();
    } else if( indcatr < 4 ) {
        checkFrc();
    } else if( indcatr < 5 ) {
        checkD2F();
    } else if( indcatr < 6 ) {
        checkF2D();
    } */
    return false;
}
function checkFilled() {
	var doc = document;
	
	allgood = true;
	var bxNum = 0;
	var bx = doc.getElementById("b" + bxNum);
	while( bx ) {
		if( !bx.value ) {
			allgood = false;
			bx.style.borderColor = "red";
			bx.focus();
			var errs = Number(doc.getElementById("errs").value);
    		doc.getElementById("errs").value = errs + 1;
			break;
		}
		bxNum = bxNum + 1;
		bx = doc.getElementById("b" + bxNum);
	}
	if( allgood ) {
		startAgain();
	}
}
function erase( ev ) {
    ev = ev || window.event;
    var ansBx = ev.target;
    if( ansBx.style.color === "red" ) { 
    	//alert("erasing");
        ansBx.style.color = "black";
        var errBx = document.getElementById("instr4");
        errBx.style.color = "black";
        ansBx.value = "";
    }
    return false;
}
function markGood( aBx, ins2, ins3, nBx ) {
	var doc = document;
	var errBx = doc.getElementById("instr4");
	errBx.style.color = "#fff9ea";
	if( aBx ) {
		aBx.style.color = "black";
		aBx.style.borderColor = "#e9d398";
	}
	if( ins2 ) {
		doc.getElementById("instr2").innerHTML = ins2;
	}
	var instr3Bx = doc.getElementById("instr3");
	if( ins3 ) {
		instr3Bx.style.color = "black";
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
		aBx.style.color = "red";
		aBx.style.borderColor = "red";
	}
	var errBx = doc.getElementById("instr4");
	errBx.style.color = "red";
	errBx.innerHTML = msg;
	var errs = Number(doc.getElementById("errs").value);
    doc.getElementById("errs").value = errs + 1;
}
function bin2dec( bStr ) {
	var num = Number;
	
	var bLen = bStr.length;
	var decNum = 0;
	while( bLen > 0 ) {
		decNum = 2*decNum + num( bStr.substr( 0, 1 ) );
		bLen = bLen - 1;
		bStr = bStr.substr( 1, bLen );				
	}
	return decNum;
}
function dec2bin( decNum ) {
	var mat = Math;
	
	var expnt = 5; // log2(MAX_COUNT)
	var binStr = "";
	while( expnt  >= 0 ) {
		var twotopow = mat.pow( 2, expnt );
		if( decNum >=  twotopow ) {
			binStr = binStr + "1";
			decNum = decNum - twotopow;
		} else if( binStr !== "" ){
			binStr = binStr + "0";
		}
		expnt = expnt - 1;
	}
	return binStr;
}
function checkCount( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;

        var ansBx = ev.target;
        var ans = ansBx.value;
        var id = ansBx.id;
		var nchars = id.length - 1;		
		if( !isNaN(ans) ) {
			var bxNum = num(id.substr(1,nchars));
			var prevBxNum = bxNum - 1;
			var prevStr = doc.getElementById("b" + prevBxNum).value;
			var prevNum = bin2dec( prevStr );
			var nans = bin2dec( ans );
			var expAns = prevNum + 1;
			var expBin = dec2bin( expAns );			
			if( nans === expAns ) {
				bxNum = bxNum + 1;
				nextBx = doc.getElementById("b" + bxNum);
				while( nextBx && nextBx.value ) {
					bxNum = bxNum + 1;
					nextBx = doc.getElementById("b" + bxNum);
				}
				var instr2 = "What's next?";
				var instr3;
				markGood( ansBx, instr2, instr3, nextBx );
			} else {
				markErr( "Should be " + expBin, ansBx);
			}
		} else {
			markErr( "Not a number", ansBx );
		}
	}
}
function skip() {
     document.getElementById("errs").value = 1;
     allgood = true;
     startAgain(); 
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
        //alert("all good");
        var whatForm = doc.getElementById('bases');
        //whatForm.method = "get";
        whatForm.submit();
        return false;
    }
}
window.onload = function(){
    var doc = document;
    var startWhere = doc.getElementById("startHere").value;
    //alert("startWhere: " + startWhere);
    var strtBx = doc.getElementById(startWhere);
	var indcatr = Number(doc.getElementById("indcatr").value);
	if( strtBx ) {
        strtBx.focus();
    }

};