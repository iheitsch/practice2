/**
 * 
 */
var x = 0;
var nSbxs = 24;

function check() {
	var indcatr = Number(document.getElementById("indcatr").value);
    if( indcatr < 2 ) {
        checkFilled();
    } /* else if( indcatr < 3 ) {
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
function zeroCounts() {
    var doc = document;

    //alert("zerocounts");
    doc.getElementById("numAttmptd").value = 0;
    doc.getElementById("errs").value = 0;
    doc.getElementById("numWoErr").value = 0;
    doc.getElementById("consWoErr").value = 0;
    doc.getElementById("strtTime").value = Number(Date.now());
    doc.getElementById("corrPerHr").value = 0;
    doc.getElementById("bases").submit();
    return false;
}
function erase( ev ) {
    ev = ev || window.event;
    var ansBx = ev.target;
    if( ansBx.style.color === "red" ) { 
    	//alert("erasing");
        ansBx.style.color = "black";
        //var errBx = document.getElementById("instr4");
        //errBx.style.color = "black";
        ansBx.value = "";
    }
    return false;
}
function markGood( aBx, ins2, ins3, nBx ) {
	var doc = document;
	var errBx = doc.getElementById("instr4");
	var invisible = "#efffd2";
	errBx.style.color = invisible;
	if( aBx ) {
		aBx.style.color = "black";
		aBx.style.borderColor = "WhiteSmoke";
	}
	if( ins2 ) {
		doc.getElementById("instr2").innerHTML = ins2;
	}
	var instr3Bx = doc.getElementById("instr3");
	if( ins3 ) {
		instr3Bx.style.color = "black";
	    instr3Bx.innerHTML = ins3;		
	} else {
	    instr3Bx.style.color = invisible;
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
function isNaH( aStr ) {
	var len = aStr.length;
	var isHex = true;
	for( var i = 0; i < len; ++i ) {
		var acode = aStr.charCodeAt(i);
		var isHex = 65 <= acode && acode <= 70 ||
					97 <= acode && acode <= 102 ||
					48 <= acode && acode <= 57;
		if( !isHex ) {
			break;
		}
	}
	return !isHex;
}
function hex2dec( hStr ) {
	var num = Number;
	
	var hLen = hStr.length;
	var decNum = 0;
	//document.getElementById("statusBox" + x).innerHTML = "hStr: " + hStr + " hLen: " + hLen;
	//x = (x + 1)%nSbxs;
	while( hLen > 0 ) {
		var chrctr = hStr.substr( 0, 1 );
		var digit = 0;
		if( isNaN( chrctr ) ) {
			acode = chrctr.charCodeAt(0);
			for( var i = 10; i < 16; ++i ) {
				if( acode === 55 + i || acode === 87 + i ) {
					digit = i;
					break;
				}
			}
		} else {
			digit = num( chrctr );
		}
		decNum = 16*decNum + digit;
		//document.getElementById("statusBox" + x).innerHTML = "hStr: " + hStr + " digit: " + digit + " decNum: " + decNum;
		//x = (x + 1)%nSbxs;
		hLen = hLen - 1;
		hStr = hStr.substr( 1, hLen );				
	}
	return decNum;
}
/*
function dec2hex( decNum ) {
	var mat = Math;
	
	var expnt = 5; // log2(MAX_COUNT)
	var hexStr = "";
	while( expnt  >= 0 ) {
		var sixtntopow = mat.pow( 16, expnt );
		if( decNum >=  sixtntopow ) {
			var digit = Math.floor(decNum/sixtntopow)
			var chrctr = digit.toString;
			if( digit > 9 )
			hexStr = hexStr + "1";
			decNum = decNum - sixtntopow;
		} else if( hexStr !== "" ){
			hexStr = hexStr + "0";
		}
		document.getElementById("statusBox" + x).innerHTML = "expnt: " + expnt + " hexStr: " + hexStr;
		x = (x + 1)%nSbxs;
		expnt = expnt - 1;
	}
	return hexStr;
} */
function checkHCount( ev ) {
    ev = ev || window.event;
    if (ev.which === 13 || ev.keyCode === 13) { 
        var num = Number;
        var doc = document;

        var ansBx = ev.target;
        var ans = ansBx.value;
        var id = ansBx.id;
		var nchars = id.length - 1;		
		if( !isNaH(ans) ) {
			var bxNum = num(id.substr(1,nchars));
			var prevBxNum = bxNum - 1;
			var prevStr = doc.getElementById("b" + prevBxNum).value;
			var prevNum = hex2dec( prevStr );
			var nans = hex2dec( ans );
			var expAns = prevNum + 1;
			var expHex = expAns.toString(16); //dec2hex( expAns );			
			if( nans === expAns ) {
				bxNum = bxNum + 1;
				nextBx = doc.getElementById("b" + bxNum);
				var prevBx = ansBx;
				while( nextBx && nextBx.value ) {
					bxNum = bxNum + 1;
					prevBx = nextBx;
					nextBx = doc.getElementById("b" + bxNum);
				}
				var prevVal = prevBx.value;
				var pos = prevVal.length - 1;
				var prevLSD = prevVal.substr(pos, 1);
				var instr2 = "Least significant bit of previous number is " + prevLSD + ", so increment it";
				var instr3;
				if( !nextBx ) {
					instr2 = 'Click "Done"';
				} else {
					if( prevLSD === "f" || prevLSD === "F" ) {
						instr2 = "Least significant digit of previous number is f; set to 0, carry 1.";
						var nextDig = prevVal.substr( pos-1, 1 );
						instr3 = "Next bit is " + nextDig + ", increment it.";
						howManyFs = countConsec( prevBx.value, "f" );
						//alert("howManyONes: " + howManyOnes);
						if( howManyFs > 0 ) {
							instr3 = "Next digit is f, set to 0 and increment the digit after that";
							if( howManyFs > 1 ) {
								instr3 = "Next " + howManyFs + " digits are f; set them to 0 and increment the next digit";
							}
						}
					}
				}	
				markGood( ansBx, instr2, instr3, nextBx );
			} else {
				markErr( "Should be " + expHex, ansBx);
			}
		} else {
			markErr( "Not a Hexadecimal number", ansBx );
		}
	}
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
/*
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
} */
function isLsbOne( val ) {
	var bitpos = val.length - 1;
	var bit0 = val.substr(bitpos, 1);
	return bit0 === "1";
}
function countConsec( val, what ) {
	var count = 0;
	var bitpos = val.length - 2;
	var bit0 = val.substr(bitpos, 1);
	var acode = what.charCodeAt(0);
	var isLowerCase = 97 <= acode && acode <= 102;
	var isHexDig = isLowerCase || ( 65 <= acode && acode <= 70 );
	if( isHexDig ) {
		var otherWhat = isLowerCase? String.fromCharCode( acode - 32 ) :
			String.fromCharCode( acode + 32 );
		//document.getElementById("statusBox" + x).innerHTML = "what: " + what + " otherWhat: " + otherWhat + " bitpos: " + bitpos + " bit0: " + bit0;
		//x = (x + 1)%nSbxs;
		while( ( bit0 === what || bit0 === otherWhat ) 
			&& bitpos >= 0 ) {
			count = count + 1;
			//document.getElementById("statusBox" + x).innerHTML =  "val: " + val + " bitpos: " + bitpos + " bit0: " + bit0 + " count: " + count;
			//x = (x + 1)%nSbxs;
			val = val.substr(0, bitpos);
			bitpos = bitpos - 1;
			if( bitpos >= 0 ) {
				bit0 = val.substr(bitpos, 1);
			}
		}	
	} else {
		while( ( bit0 === what ) 
				&& bitpos >= 0 ) {
			count = count + 1;
			val = val.substr(0, bitpos);
			bitpos = bitpos - 1;
			if( bitpos >= 0 ) {
				bit0 = val.substr(bitpos, 1);
			}		
		}
	}
	//document.getElementById("statusBox" + x).innerHTML = " after bitpos: " + bitpos + " bit: " + bit0 + " count: " + count;
	//x = (x + 1)%nSbxs;
	return count;
}
function checkBCount( ev ) {
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
			var expBin = expAns.toString(2); //dec2bin( expAns );			
			if( nans === expAns ) {
				bxNum = bxNum + 1;
				nextBx = doc.getElementById("b" + bxNum);
				var prevBx = ansBx;
				while( nextBx && nextBx.value ) {
					bxNum = bxNum + 1;
					prevBx = nextBx;
					nextBx = doc.getElementById("b" + bxNum);
				}
				var instr2 = "Least significant bit of previous number is 0, so togggle to 1";
				var instr3;
				if( !nextBx ) {
					instr2 = 'Click "Done"';
				} else {
					var lsbIsOne = isLsbOne( prevBx.value );
					if( lsbIsOne ) {
						instr2 = "Least significant bit of previous number is 1, so toggle to 0, carry 1.";
						instr3 = "Next bit is 0, toggle it to 1.";
						howManyOnes = countConsec( prevBx.value, "1" );
						//alert("howManyONes: " + howManyOnes);
						if( howManyOnes > 0 ) {
							instr3 = "Next bit is 1, toggle it to 0 and toggle the bit after that to 1";
							if( howManyOnes > 1 ) {
								instr3 = "Next " + howManyOnes + " bits are 1, toggle them to 0 and toggle the bit after that to 1";
							}
						}
					}
				}	
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