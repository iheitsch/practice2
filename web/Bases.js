/**
 * 
 */
var x = 0;
var nSbxs = 24;

var accounted4 = [ false, false, false, false ];

function check() {
	var indcatr = Number(document.getElementById("indcatr").value);
    if( indcatr < 2 ) {
        checkFilled();
    } else if( indcatr < 3 ) {
        checkD2H();
    } else if( indcatr < 4 ) {
        checkH2D();
    } /* else if( indcatr < 5 ) {
        checkD2F();
    } else if( indcatr < 6 ) {
        checkF2D();
    } */
    return false;
}
function checkH2D() {
	var doc = document;
	
	allgood = true;
	// need to check if user skipped something fixit
	if( allgood ) {
		startAgain();
	}
}
function checkD2H() {
	var doc = document;
	
	allgood = true;
	// need to check if user skipped something fixit
	if( allgood ) {
		startAgain();
	}
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
function eraseAll( ev ) {
    ev = ev || window.event;
    var ansBx = ev.target;
    if( ansBx.style.color === "red" ) {
		id = ansBx.id;
		var stp = id.lastIndexOf("_") + 1;
		var partStr = id.substr(0, stp);
		//var strt = stp + 1;
		var bxNum = Number(id.substr( stp, 1 ));
		var doc = document;
		var bxid = partStr + bxNum;
		//doc.getElementById("statusBox" + x).innerHTML = "eraseAll bxid: " + bxid;
		//x = (x+1)%nSbxs;
		var bx = doc.getElementById(bxid);
		while( bx ) {
        	bx.style.color = "black";
        	bx.value = "";
			bxNum = bxNum + 1;
			bx = doc.getElementById(partStr + bxNum);
		}
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
function checkTot( ev ) {
	ev = ev || window.event;
	var ansBx = ev.target;
	var num = Number;
    var doc = document;
    if( ev.which === 13 || ev.keyCode === 13 ) {
		ans = ansBx.value;
		var id = ansBx.id;		
		var strtpt = id.indexOf("_") + 1;
		var stppt = id.lastIndexOf("_");
		var nchars = stppt - strtpt;
		var bxNum = num(id.substr( strtpt, nchars ));
		var nans = num(ans);			
		var st = stppt + 1;
		var partStr = id.substr( 0, st);
		var msdnum = num(id.substr(st, 1));
		var dgtnum = msdnum;
		var bxId = partStr + dgtnum;
		//doc.getElementById("statusBox" + x).innerHTML = "checkAdd adding boxes bxId: " + bxId + " nans: " + nans;
		//x = (x + 1)%nSbxs;
		var prevBx = doc.getElementById(bxId);
		while( prevBx ) {
			nans = 10*nans + num(prevBx.value);
			//doc.getElementById("statusBox" + x).innerHTML = "checkTot while loop nans: " + nans + " bxId: " + bxId;
			//x = (x + 1)%nSbxs;
			dgtnum = dgtnum - 1;
			bxId = partStr + dgtnum;
			prevBx = doc.getElementById(bxId);
		}
		var hexStr = "";
		for( var i = 3; i >= 0; --i ) {
			var whatBx = doc.getElementById("d" + i);
			if( whatBx ) {
				hexStr = hexStr + whatBx.innerHTML;
			}
		}
		var expAns = hex2dec( hexStr );
		if( nans === expAns ) {
			markGood( ansBx, 'Click "Done"', null, null );
		} else {
			var instr4 = "Should be " + expAns;
			dgtnum = msdnum;
			bxId = partStr + dgtnum;
			prevBx = doc.getElementById(bxId);
			var lastPrev = prevBx;
			while( prevBx ) {
				prevBx.style.color = "red";
				dgtnum = dgtnum - 1;
				lastPrev = prevBx;
				bxId = partStr + dgtnum;
				prevBx = doc.getElementById(bxId);
			}
			var errBx = doc.getElementById("instr4");
			errBx.style.color = "red";
			errBx.innerHTML = instr4;
			var errs = Number(doc.getElementById("errs").value);
		    doc.getElementById("errs").value = errs + 1;
			lastPrev.focus();
		}
	} else {
		ans = ansBx.value;
		if( !isNaN(ans) ) {
			var id = ansBx.id;
			var stpos = id.lastIndexOf("_");
			var nchars = id.length - stpos;
			stpos = stpos + 1;
			var bxNum = num(id.substr( stpos,  nchars )) + 1;
			var partStr = id.substr( 0, stpos);
			var bxId = partStr + bxNum;
			//alert("nextBx: " + bxId);
			var nextBx = doc.getElementById(bxId);
			var instr2;
			var instr3;
			if( !nextBx ) {
				nextBx = ansBx;
			}
			markGood( ansBx, instr2, instr3, nextBx );
		} else {
			markErr("Not a number", ansBx);
		}
	}
}
// if adding in col 2 and put column 1 first it never lets you add coloum 3 0x1308  and it askes for column 2 fixit
// 0xEDA won't let you put all the columns at all fixit
// 0xFF1E won't let you put all the columns at all fixit can't get to repeat
function checkCp( ev ) {
	ev = ev || window.event;
	var ansBx = ev.target;
	var num = Number;
    var doc = document;
    if( ev.which === 13 || ev.keyCode === 13 ) {
		ans = ansBx.value;
		var id = ansBx.id;		
		var strtpt = id.indexOf("_") + 1;
		var stppt = id.lastIndexOf("_");
		var nchars = stppt - strtpt;
		var bxNum = num(id.substr( strtpt, nchars ));
		var nans = num(ans);			
		var st = stppt + 1;
		var partStr = id.substr( 0, st);
		var aStr = partStr;
		var msdnum = num(id.substr(st, 1));
		var dgtnum = msdnum;
		var bxId = partStr + dgtnum;
		//doc.getElementById("statusBox" + x).innerHTML = "checkAdd adding boxes bxId: " + bxId + " nans: " + nans;
		//x = (x + 1)%nSbxs;
		var prevBx = doc.getElementById(bxId);
		while( prevBx ) {
			nans = 10*nans + num(prevBx.value);
			//doc.getElementById("statusBox" + x).innerHTML = "checkCp while loop nans: " + nans + " bxId: " + bxId;
			//x = (x + 1)%nSbxs;
			dgtnum = dgtnum - 1;
			bxId = partStr + dgtnum;
			prevBx = doc.getElementById(bxId);
		}
		//doc.getElementById("statusBox" + x).innerHTML = "checkCp after loop nans: " + nans + " bxId: " + bxId;
		//x = (x + 1)%nSbxs;
		var row = num(id.substr(1,1)) + 1;
		for( var i = 0; i < 4; ++i ) {
			//doc.getElementById("statusBox" + x).innerHTML = "checkCp accounted4[" + i + "]: " + accounted4[i];
			//x = (x + 1)%nSbxs;
			if( !accounted4[i] ) {
				partStr = "a2_" + i + "_";
				dgtnum = 0;
				var tstId = partStr + dgtnum;
				var tstBx = doc.getElementById(tstId);
				//doc.getElementById("statusBox" + x).innerHTML = "checkCp does this box exist? tstId: " + tstId;
				//x = (x + 1)%nSbxs;
				if( tstBx ) {
					tstVal = num(tstBx.value);
					var ten2pow = 10;
					while( tstBx ) {
						dgtnum = dgtnum + 1;
						tstId = partStr + dgtnum;
						tstBx = doc.getElementById(tstId);
						if( tstBx ) {
							var newval = tstBx.value;
							if( newval ) {
								tstVal = ten2pow*num(newval) + tstVal;
								ten2pow *= 10;
							} else {
								break;
							}
						}
						//doc.getElementById("statusBox" + x).innerHTML = "checkCp while loop tstVal: " + tstVal + " tstId: " + tstId;
						//x = (x + 1)%nSbxs;
					}
					//doc.getElementById("statusBox" + x).innerHTML = "checkCp after loop tstVal: " + tstVal + " nans: " + nans;
					//x = (x + 1)%nSbxs;
					if( nans === tstVal ) {
						accounted4[i] = true;
						nextBx = doc.getElementById("a" + row + "_0_0");
						var instr2;
						var instr3;
						var allAccounted4 = true;
						for( j = 3; j >= 0; --j ) {
							var ndx = j; // dbfxt (i + j + 3)%4;
							//doc.getElementById("statusBox" + x).innerHTML = "j: " + j + " ndx: "+ ndx + " accounted4: " + accounted4[ndx];
							//x = (x + 1)%nSbxs;
							//alert("ok?");
							if( !accounted4[ndx] ) {
								allAccounted4 = false;
								instr2 = "Copy product under the 16^" + ndx + " column";
								break;
							}
						}
						if( allAccounted4 ) {
							instr2 = "Add the products";
						}
						markGood( ansBx, instr2, instr3, nextBx );
						return;
					}
				} else {
					partStr = "a0_" + i + "_";
					dgtnum = 0;
					var tstId = partStr + dgtnum;
					tstBx = doc.getElementById(tstId);
					if( tstBx ) {
						tstVal = num(tstBx.value);
						var ten2pow = 10;
						//doc.getElementById("statusBox" + x).innerHTML = "checkCp does this box exist? tstId: " + tstId;
						//x = (x + 1)%nSbxs;
						while( tstBx ) {
							dgtnum = dgtnum + 1;
							tstId = partStr + dgtnum;
							tstBx = doc.getElementById(tstId);
							if( tstBx ) {
								var newval = tstBx.value;
								if( newval ) {
									tstVal = ten2pow*num(newval) + tstVal;
									ten2pow *= 10;
								} else {
									break;
								}
							}
							//doc.getElementById("statusBox" + x).innerHTML = "checkCp while loop tstVal: " + tstVal + " tstId: " + tstId;
							//x = (x + 1)%nSbxs;
						}
					} else {
						tstVal = 0;
					}
					//doc.getElementById("statusBox" + x).innerHTML = "checkCp after loop tstVal: " + tstVal + " nans: " + nans;
					//x = (x + 1)%nSbxs;
					if( nans === tstVal ) {
						accounted4[i] = true;
						
						nextBx = doc.getElementById("a" + row + "_0_0");
						var instr2;
						var instr3;
						var allAccounted4 = true;
						for( j = 3; j >= 0; --j ) {
							var ndx = j; // dbfxt (i + j + 3)%4;
							//doc.getElementById("statusBox" + x).innerHTML = "accounted4[" + ndx + "]: " + accounted4[ndx];
							//x = (x + 1)%nSbxs;
							if( !accounted4[ndx] ) {
								allAccounted4 = false;
								instr2 = "Copy product under the 16^" + ndx + " column";
								break;
							}
						}
						if( allAccounted4 ) {
							instr2 = "Add the products";
						}
						markGood( ansBx, instr2, instr3, nextBx );
						return;
					}
				}
			}
		}
		var instr4 = nans + " is not one of the products you need to add";
		dgtnum = msdnum;
		bxId = aStr + dgtnum;
		prevBx = doc.getElementById(bxId);
		var lastPrev = prevBx;
		while( prevBx ) {
			prevBx.style.color = "red";
			dgtnum = dgtnum - 1;
			lastPrev = prevBx;
			bxId = aStr + dgtnum;
			prevBx = doc.getElementById(bxId);
		}
		var errBx = doc.getElementById("instr4");
		errBx.style.color = "red";
		errBx.innerHTML = instr4;
		var errs = Number(doc.getElementById("errs").value);
	    doc.getElementById("errs").value = errs + 1;
		lastPrev.focus();
	} else {
		// aid = "a0_" + hexdignum + "_" + thisansdig;
		ans = ansBx.value;
		if( !isNaN(ans) ) {
			var id = ansBx.id;
			var stpos = id.lastIndexOf("_");
			var nchars = id.length - stpos;
			stpos = stpos + 1;
			var bxNum = num(id.substr( stpos,  nchars )) + 1;
			var partStr = id.substr( 0, stpos);
			var bxId = partStr + bxNum;
			//alert("nextBx: " + bxId);
			var nextBx = doc.getElementById(bxId);
			var instr2;
			var instr3;
			if( !nextBx ) {
				nextBx = ansBx;
			}
			markGood( ansBx, instr2, instr3, nextBx );
		} else {
			markErr("Not a number", ansBx);
		}
	}
}
// iif you fill all the boxes, it deselects all the boxes and hangs fixit
function checkAdd( ev ) {
	ev = ev || window.event;
	var ansBx = ev.target;
	var num = Number;
    var doc = document;
    if( ev.which === 13 || ev.keyCode === 13 ) {
		var mat = Math;
		ans = ansBx.value;
		var id = ansBx.id;		
		var strtpt = id.indexOf("_") + 1;
		var stppt = id.lastIndexOf("_");
		var nchars = stppt - strtpt;
		var bxNum = num(id.substr( strtpt, nchars ));
		var powOf16 = mat.pow(16,bxNum);
		var factr = num(doc.getElementById("b0_" + bxNum).value);
		var expAns = powOf16*factr;
		//doc.getElementById("statusBox" + x).innerHTML = "powOf16: " + powOf16 + " factr: " + factr + " expAns: " + expAns;
		//x = (x + 1)%nSbxs;
		var nans = num(ans);			
		var st = stppt + 1;
		var partStr = id.substr( 0, st);
		var msdnum = num(id.substr(st, 1));
		var dgtnum = msdnum;
		var bxId = partStr + dgtnum;
		//doc.getElementById("statusBox" + x).innerHTML = "checkAdd adding boxes bxId: " + bxId + " nans: " + nans;
		//x = (x + 1)%nSbxs;
		var prevBx = doc.getElementById(bxId);
		while( prevBx ) {
			nans = 10*nans + num(prevBx.value);
			//doc.getElementById("statusBox" + x).innerHTML = "checkAdd while loop nans: " + nans;
			//x = (x + 1)%nSbxs;
			dgtnum = dgtnum - 1;
			prevBx = doc.getElementById(partStr + dgtnum);
		}
		if( nans === expAns ) {
			var nxNum = bxNum + 1;
			bxId = "b1_" + nxNum;
			var nextBx = doc.getElementById(bxId);
			var instr2;
			var instr3;			
			powOf16 = 16*powOf16;		
			if( nextBx ) {
				//doc.getElementById("statusBox" + x).innerHTML = "CheckAdd nextBX: " + bxId;
				//x = (x + 1)%nSbxs;
				var factr = doc.getElementById("b0_" + nxNum).value;
				instr2 = "What is " + powOf16 + " times " + factr + "? (Type backwards and Enter)";
			} else {
				bxId = "a0_" + nxNum + "_0";
				nextBx = doc.getElementById(bxId);				
				if( nextBx ) {
					//doc.getElementById("statusBox" + x).innerHTML = "CheckAdd nextBX: " + bxId;
					//x = (x + 1)%nSbxs;
					var factr = (num(doc.getElementById("b0_" + nxNum).value))%10;
					instr2 = "What is " + powOf16 + " times " + factr + "? (Type backwards and Enter)";
				} else {
					nextBx = doc.getElementById("a3_0_0");
					whatcol = bxNum - 1;
					instr2 = "Copy product under the 16^" + whatcol + " column";
					accounted4[nxNum-1] = true;
				}
			}
			markGood( ansBx, instr2, instr3, nextBx );
		} else {
			dgtnum = msdnum;
			bxId = partStr + dgtnum;
			prevBx = doc.getElementById(bxId);
			//doc.getElementById("statusBox" + x).innerHTML = "CheckD ans != expAns bxId: " + bxId;
			//x = (x + 1)%nSbxs;
			var lastPrev = prevBx;
			while( prevBx ) {
				prevBx.style.color = "red";
				dgtnum = dgtnum - 1;
				lastPrev = prevBx;
				bxId = partStr + dgtnum;
				//doc.getElementById("statusBox" + x).innerHTML = "in while loop bxId: " + bxId;
			 	//x = (x + 1)%nSbxs;
				prevBx = doc.getElementById(bxId);
			}
			var errBx = doc.getElementById("instr4");
			errBx.style.color = "red";
			errBx.innerHTML = "Should be " + expAns;
			var errs = Number(doc.getElementById("errs").value);
		    doc.getElementById("errs").value = errs + 1;
			lastPrev.focus();
		}
	} else {
		// aid = "a0_" + hexdignum + "_" + thisansdig;
		ans = ansBx.value;
		if( !isNaN(ans) ) {
			var id = ansBx.id;
			var stpos = id.lastIndexOf("_");
			var nchars = id.length - stpos;
			stpos = stpos + 1;
			var bxNum = num(id.substr( stpos,  nchars )) + 1;
			var partStr = id.substr( 0, stpos);
			var bxId = partStr + bxNum;
			var nextBx = doc.getElementById(bxId);
			var instr2;
			var instr3;
			markGood( ansBx, instr2, instr3, nextBx );
		} else {
			markErr("Not a number", ansBx);
		}
	}
}
function checkDmult( ev ) {
	ev = ev || window.event;
	var ansBx = ev.target;
	var num = Number;
    var doc = document;
    if( ev.which === 13 || ev.keyCode === 13 ) {
		var mat = Math;
		ans = ansBx.value;
		var id = ansBx.id;		
		var strtpt = id.indexOf("_") + 1;
		var stppt = id.lastIndexOf("_");
		var nchars = stppt - strtpt;
		var bxNum = num(id.substr( strtpt, nchars ));
		var powOf16 = mat.pow(16,bxNum);
		var factr = num(doc.getElementById("b0_" + bxNum).value);
		// first digit or second?
		var row = num(id.substr( 1, 1));
		var nextrow = row + 1;
		var moremults = doc.getElementById("a" + nextrow + "_" + bxNum + "_0");
		if( moremults && row === 0 ) {
			factr = factr%10;
		} else if( row === 1 ){
			factr = mat.floor(factr/10); 
		}
		var expAns = factr*powOf16;
		var nans = num(ans);			
		var st = stppt + 1;
		var partStr = id.substr( 0, st);
		var msdnum = num(id.substr(st, 1));
		var dgtnum = msdnum;
		var bxId = partStr + dgtnum;
		var prevBx = doc.getElementById(bxId);
		//doc.getElementById("statusBox" + x).innerHTML = "bxId: " + bxId + " nans: " + nans;
		//x = (x + 1)%nSbxs;
		while( prevBx ) {
			nans = 10*nans + num(prevBx.value);
			//doc.getElementById("statusBox" + x).innerHTML = "bxId: " + bxId + " nans: " + nans;
			//x = (x + 1)%nSbxs;
			dgtnum = dgtnum - 1;
			bxId = partStr + dgtnum;
			prevBx = doc.getElementById(bxId);
		}
		if( nans === expAns ) {			
			var factr;
			var instr2;
			var instr3;
			if( row === 0 ) {
				bxId = "a1_" + bxNum + "_0";
				nextBx = doc.getElementById(bxId);
				if( nextBx ) {
					factr = num(doc.getElementById("b0_" + bxNum).value);
					factr = mat.floor(factr/10);
					instr2 = "What is " + powOf16 + " times " + factr + "? (Type backwards and Enter)";
				} else {
					nxNum = bxNum + 1;
					powOf16 = 16*powOf16;
					bxId = "b1_" + nxNum;
					nextBx = doc.getElementById(bxId);					
					if( nextBx ) {
						//doc.getElementById("statusBox" + x).innerHTML = "checkDm nextBx: " + bxId;
						//x = (x + 1)%nSbxs;
						factr = num(doc.getElementById("b0_" + nxNum).value);
						instr2 = "What is " + powOf16 + " times " + factr + "? (Type backwards and Enter)";
					} else {
						bxId = "a0_" + nxNum + "_0";
						nextBx = doc.getElementById(bxId);						
						if( nextBx ) {
							//doc.getElementById("statusBox" + x).innerHTML = "checkDm nextBx: " + bxId;
							//x = (x + 1)%nSbxs;
							factr = num(doc.getElementById("b0_" + nxNum).value);
							factr = factr%10;
							instr2 = "What is " + powOf16 + " times " + factr + "? (Type backwards and Enter)";
						} else {
							nextBx = doc.getElementById("a3_0_0");
							var highestlongmult = bxNum;
							for( var i = bxNum; i >= 0; --i ) {
								var tstBx = doc.getElementById("a1_" + i + "_0");
								if( tstBx ) {
									highestlongmult = i;									
									break;
								}
							}
							accounted4[highestlongmult] = true;
							var	whatcol = highestlongmult === bxNum? bxNum - 1 : bxNum;
							/* if( whatcol < 0 ) {
								whatcol = bxNum;
							} */
							instr2 = "Copy product under the 16^" + whatcol + " column";
						}
					}
				}
			} else {
				bxId = "a2_" + bxNum + "_0";
				//alert("row: " + row + " bxId: " + bxId);
				nextBx = doc.getElementById(bxId);
				if( nextBx ) {
					partStr = "a0_" + bxNum + "_";
					dgtnum = 4;
					bxId = partStr + dgtnum;
					prevBx = doc.getElementById(bxId);
					prevRowAns = 0;
					//doc.getElementById("statusBox" + x).innerHTML = "prevRowAns: " + prevRowAns + " bxId: " + bxId;
					//x = (x + 1)%nSbxs;
					while( prevBx ) {
						prevRowAns = 10*prevRowAns + num(prevBx.value);				
						dgtnum = dgtnum - 1;
						prevBx = doc.getElementById(partStr + dgtnum);
						//doc.getElementById("statusBox" + x).innerHTML = "prevRowAns: " + prevRowAns + " dgtnum: " + dgtnum;
						//x = (x + 1)%nSbxs;
					}
					expAns = 10*expAns;
					instr2 = "What is " + prevRowAns + " plus " + expAns + "?";
				} else {
					alert("stuck on line 197");
				}
			}
			markGood( ansBx, instr2, instr3, nextBx );
		} else {
			dgtnum = msdnum;
			var bxId = partStr + dgtnum;
			prevBx = doc.getElementById(bxId);
			//doc.getElementById("statusBox" + x).innerHTML = "CheckD ans != expAns bxId: " + bxId;
			//x = (x + 1)%nSbxs;
			var lastPrev = prevBx;
			while( prevBx ) {
				prevBx.style.color = "red";
				dgtnum = dgtnum - 1;
				lastPrev = prevBx;
				bxId = partStr + dgtnum;
				//doc.getElementById("statusBox" + x).innerHTML = "in while loop bxId: " + bxId;
			 	//x = (x + 1)%nSbxs;
				prevBx = doc.getElementById(bxId);
			}
			var errBx = doc.getElementById("instr4");
			errBx.style.color = "red";
			errBx.innerHTML = "Should be " + expAns;
			var errs = Number(doc.getElementById("errs").value);
		    doc.getElementById("errs").value = errs + 1;
			lastPrev.focus();
		}
	} else {
		// aid = "a0_" + hexdignum + "_" + thisansdig;
		ans = ansBx.value;
		if( !isNaN(ans) ) {
			var id = ansBx.id;
			var stpos = id.lastIndexOf("_");
			var nchars = id.length - stpos;
			stpos = stpos + 1;
			var bxNum = num(id.substr( stpos,  nchars )) + 1;
			var partStr = id.substr( 0, stpos);
			var bxId = partStr + bxNum;
			//alert("nextBx: " + bxId);
			var nextBx = doc.getElementById(bxId);
			var instr2;
			var instr3;
			if( !nextBx ) {
				nextBx = ansBx;
			}
			markGood( ansBx, instr2, instr3, nextBx );
		} else {
			markErr("Not a number", ansBx);
		}
	}
}
function checkSmult( ev ){
	ev = ev || window.event;
    if( ev.which === 13 || ev.keyCode === 13 ) { 
        var num = Number;
        var doc = document;
		var mat = Math;

        var ansBx = ev.target;
        var ans = ansBx.value;        
		if( !isNaN(ans) ) {
			var id = ansBx.id;		
			var strtpt = id.indexOf("_") + 1;
			var nchars = id.length - strtpt;
			var bxNum = num(id.substr( strtpt, nchars ));
			var powOf16 = mat.pow(16,bxNum);
			var factr = num(doc.getElementById("b0_" + bxNum).value);
			var expAns = factr*powOf16;
			if( num(ans) === expAns ) {
				powOf16 = 16*powOf16;
				bxNum = bxNum + 1;
				var nextF;
				var instr2;
				var instr3;
				var nextBx = doc.getElementById("b1_" + bxNum);
				if( nextBx ) {
					nextF = doc.getElementById("b0_" + bxNum).value;
					instr2 = "What is " + powOf16 + " times " + nextF  + "? (Type backwards and Enter)";
				} else {
					nextBx = doc.getElementById("a0_" + bxNum + "_0");
					if( nextBx ) {
						nextF = num(doc.getElementById("b0_" + bxNum).value)%10;
						instr2 = "What is " + powOf16 + " times " + nextF + "? (Type backwards and Enter)";
					} else {					
						alert("what now?");
					}
				}
				markGood( ansBx, instr2, instr3, nextBx );
			} else {
				markErr("Should be " + expAns, ansBx);
			}
		} else {
			markErr("Not a number", ansBx);
		}
	}
}
function checkHDig( ev ) {
    ev = ev || window.event;
    if( ev.which === 13 || ev.keyCode === 13 ) { 
        var num = Number;
        var doc = document;

        var ansBx = ev.target;
        var ans = ansBx.value;        
		if( !isNaN(ans) ) {
			var id = ansBx.id;		
			var strtpt = id.indexOf("_") + 1;
			var nchars = id.length - strtpt;
			var bxNum = num(id.substr( strtpt, nchars ));
			//var hexNum = doc.getElementById("hexNum").value;
			//var hexPos = hexNum.length - 1;
			var hexDig = doc.getElementById("d" + bxNum).innerHTML; //hexNum.substr(hexPos - bxNum, 1);
			var nans = num( ans );
			//var decDig = hex2dec( hexDig );
			//var hexans = nans.toString(16);
			//doc.getElementById("statusBox" + x).innerHTML = "nans: " + nans + " decDig: " + decDig;
			//x = (x + 1)%nSbxs;
			if( nans === hex2dec( hexDig ) ) {
				bxNum = bxNum + 1;
				var bxid = "b0_" + bxNum;
				var nextBx = doc.getElementById(bxid);
				var instr2;
				var instr3;
				if( nextBx ) {
					var place = Math.pow(16,bxNum);
					var newHexDig = doc.getElementById("d" + bxNum).innerHTML; //hexNum.substr(hexPos - bxNum, 1);
					instr2 = "What is the decimal equivalent of the " + place + "'s hex digit " + newHexDig + "? (Enter)";
				} else {
					nextBx = doc.getElementById("b1_" + 0);
					var frstDig = doc.getElementById("b0_0").value;
					instr2 = "What is 1 times " + frstDig + "? (Type backwards and Enter)";
					if( !nextBx ) {
						nextBx = doc.getElementById("a0_0_0");
					}				
				}
				markGood( ansBx, instr2, instr3, nextBx );
			} else {
				var decStr = hex2dec( hexDig );
				markErr( "Should be " + decStr, ansBx );
			}
		} else {
			markErr( "Not a number", ansBx );
		}
	}
}
function checkPow( ev ) {
	ev = ev || window.event;
    if( ev.which === 13 || ev.keyCode === 13 ) {       
        var ansBx = ev.target;
        var ans = ansBx.value;        
		if( !isNaN(ans) ) {
			var num = Number;
        	var doc = document;
			var mat = Math;
			var id = ansBx.id;
			var len = id.length;
			var nchars = len - 1;
			var whatdgt = num(id.substr(1,nchars));
			var expAns= mat.pow(16,whatdgt);
			var nans = num(ans);
			if( nans === expAns ) {
				whatdgt = whatdgt + 1;
				var nextBx = doc.getElementById("s" + whatdgt);
				var instr2;
				var instr3;
				if( nextBx ) {
					instr2 = "What is 16 to the " + whatdgt + " power? (Enter)";
				} else {
					nextBx = doc.getElementById("b0_0");
					var digit0 = doc.getElementById("d0").innerHTML;
					instr2 = "What is the decimal equivalent of least significant hex digit " + digit0 + "? (Enter)";
				}
				markGood( ansBx, instr2, instr3, nextBx );
			} else {
				markErr( "Should be " + expAns, ansBx );
			}

		} else {
			markErr( "Not a number", ansBx );
		}
	}		
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
function dec2hex( decStr ) {
	var mat = Math;
	var decNum = Number( decStr );
	if( decNum === 0 ) {
		return decStr;
	}
	var expnt = 5; // log2(MAX_COUNT)
	var hexStr = "";
	while( expnt  >= 0 ) {
		var sixtntopow = mat.pow( 16, expnt );
		if( decNum >=  sixtntopow ) {
			var digit = Math.floor(decNum/sixtntopow);
			var chrctr = digit.toString();
			if( digit > 9 ) {
				chrctr = String.fromCharCode(87 + digit);
			}
			hexStr = hexStr + chrctr;
			decNum = decNum - digit*sixtntopow;
		} else if( hexStr !== "" ){
			hexStr = hexStr + "0";
		}
		expnt = expnt - 1;
	}
	return hexStr;
}
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
			//var nans = hex2dec( ans );
			var expAns = prevNum + 1;
			//var expHex = expAns.toString(16); //dec2hex( expAns );
			var decAns = hex2dec( ans );
			//doc.getElementById("statusBox" + x).innerHTML = "decAns: " + decAns + " expAns: " + expAns;
			//x = (x + 1)%nSbxs;		
			if( decAns === expAns ) {
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
	/* for( var i = 2809; i < 2833; ++i ) {
		var st = i.toString();
		var to16 = i.toString(16);
		var dec2H = dec2hex( st );
		doc.getElementById("statusBox" + x).innerHTML = "dec " + i + " to16: " + to16 + " dec2H " + dec2H;
		x = (x + 1)%nSbxs;
	} */
	if( strtBx ) {
        strtBx.focus();
    }
};