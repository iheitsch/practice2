/**
 * 
 */
// on clicking on any table input, disable all hints fixit
// you can skip column if either radius of an ellipse is one fixit

var halfwidth = 222;
var xygraphleft = 365; // copied from css
var xygraphtop = 90;
var orgX = xygraphleft + halfwidth; 
var orgY = xygraphtop + halfwidth;
var graphstart = 22;
var graphstop = 422;
var pxlsprsq = 20;
var nextI = 0;
var prevX;
var prevY;
var allgood = true;
var lastPt;
// store curve type and parameters for redrawing
var isNotSelect = true;
var isLine = false;
var isCircle = false;
var isEllipse = false;
var whichcurve = 0;

var form;
var errBx;
var errCtBx;
var xygraph;
var whatrow = new Array;
var pdx = 0;
var maxbx = 12; // should be the same as loop test for statusBox on jsp page fixit
var nmins = 0;
var nmaxes = 0;
var plen;
var xpts = new Array(21);
var ypts = new Array(21);
var yvals = new Array(21);
var captured = new Array(21);
var pointsfound = 0;
var mouseIsDown = false;
var Coords = function( xp, yp ) {
    this.x = xp;
    this.y = yp;
};
var mouseDownX;
var mouseDownY;
var dragged = false;
var enoughPoints = 2; // needs to be more for anything but straight lines fixit
var par1;
var par2;
var par3;
var mult = 1;
var div = 1;
var bee;
var kay; 
var ache;
var aye;

var nsign = 1;
var op = "";
var n0;
var t0;
var x0val;
var col0;
var colnum = 0;
var tblFilld = false;
var ystops = new Array();
var taken = new Array(5);
var done = false;

function setMouseDown( ev ) { 
	ev = ev || window.event;
	if( !done ) {
		var mouseDownPos = mouseCoords( ev );
		mouseDownX = mouseDownPos.x;
		mouseDownY = mouseDownPos.y;
		mouseIsDown = true;
		xygraph.addEventListener('mousemove', checkCurve );
	}	
}
function clearMouseDown( ev ) { 
	ev = ev || window.event;
	if( !done ) {
		var mousePos = mouseCoords( ev );
		var mouseUpX = mousePos.x;
		var mouseUpY = mousePos.y;
		var mat = Math;
		var closenuff = 20;
		if( tblFilld &&
			mat.abs(mouseUpX - mouseDownX) < closenuff && 
			mat.abs(mouseUpY - mouseDownY) < closenuff ) {
			checkPt( mouseUpX, mouseUpY );	
		} else if( dragged && pointsfound < enoughPoints ) {
			var doc = document;
			var errct = Number(errCtBx.value);
			errCtBx.value = errct + 1;
		}
		xygraph.removeEventListener('mouseMove', checkCurve );
	}
	mouseIsDown = false;
	dragged = false;
}
function checkCurve( ev ) {
	ev = ev || window.event;
	if( mouseIsDown && !done) {
		var mat = Math;
		dragged = true;
		var mousePos;
		var mousePos = mouseCoords( ev );
		var closenuff = 10; // pixels
		for( var i = 0; i < plen; ++i ) {
			if( !captured[i] && mat.abs( mousePos.x - xpts[i] ) < closenuff ) { 
				if( mat.abs( mousePos.y - ypts[i] ) < closenuff ) {
					var doc = document;
					pointsfound += 1;
					captured[i] = true;
					if( pointsfound >= enoughPoints ) {
						done = true;
						nextI = lastPt; // don't need to track it any more						
						if( whichcurve === Number(doc.getElementById("allcurves").value) - 1 ) {
							drawCurve( whichcurve );
							var endinst = doc.getElementById("skpBx").innerHTML;
							doc.getElementById("instrs").innerHTML = 'Choose another curve or click "' + endinst + '"';
							xygraph.removeEventListener('mouseMove', checkCurve );
							clearpage();
				  		} else {
							startAgain();
						}
					}
				}
			}
		}
	}
}

function clearpage() {
	var doc = document;
	doc.getElementById("whichcurves").value = "0";
	doc.getElementById("instr2").innerHTML = "";
	if( form.contains(errBx) ) {
  		form.removeChild( errBx );
  	}
  	var whatpts = doc.getElementById("whatpts");
  	if( form.contains(whatpts) ) {
  		form.removeChild( whatpts );
  	}
  	// remove marked dots of last curve
  	var mrx = doc.getElementsByClassName("mrx");
  	var len = mrx.length;
  	for( var i = len-1; i >= 0; --i ) {
  		var parent = mrx[i].parentNode;
		parent.removeChild(mrx[i]);
  	}
}
function erase( ev ) {
    ev = ev || window.event;
    var ansBx = ev.target;
    if( ansBx.style.color === "red" ) {
	    var ndx = Number(ansBx.id.substr(1));
	    ansBx.value = "";
	    var correct;
	    if( ndx%4 < 2 ) {
	    	correct = "#4e4c32"; // black
	    } else {
	    	correct = "#f9f2ec"; // white
	    }
	    ansBx.style.color = correct;
	    ansBx.style.backgroundColor = "inherit";
	}
 }
function drawLine( x1, y1, x2, y2, width, color, clas ) {
	var htmseg = '<line ';
	if( clas ) {
		htmseg += 'class="' + clas + '"';
	}
	htmseg += ' x1="' + x1;
	htmseg += '" y1="' + y1;
	htmseg += '" x2="' + x2;
	htmseg += '" y2="' + y2;
	htmseg += '" style="stroke:' + color;
	htmseg += ';stroke-width:' + width;
	htmseg += ';" />';
	xygraph.innerHTML += htmseg;
}
function checkR( ev ) {
	ev = ev || window.event;
	// have to make sure it was entered, not just any keyup
	if (ev.which === 13 || ev.keyCode === 13) {
		var ansBx = ev.target;
		var doc = document;
		var num = Number;
		var rid = ansBx.id;
		rowno = rid.substr(1,rid.length);
		var nextN = num(rowno) + 1;
		var prevval;
		prevval = num(doc.getElementById("x" + rowno).innerHTML);
		var expAns;
		var sn = 1;
		var yval = num(doc.getElementById("h" + rowno).value);
		if( yval < kay ) {
			sn = -1;
		}
		if( isCircle ){
			expAns = sn*Math.sqrt(bee*bee - (prevval - ache)*(prevval - ache));
		} else if( isEllipse ){
			expAns = sn*Math.sqrt(1 - (prevval - ache)*(prevval - ache)/(aye*aye));
		}
		if( num(ansBx.value) === expAns ) {
			errBx.innerHTML = "";
			var prevcol = colnum - 1;
			if( nextN < lastPt ) {
				rid = "r" + nextN;
				doc.getElementById(rid).focus();
				var curr = doc.getElementById("c" + rowno + "_" + colnum);
				doc.getElementById("c" + nextN + "_" + colnum).innerHTML = " = ";
				curr.innerHTML = "";				
				var sgn = " ";
				var yval = num(doc.getElementById("h" + nextN).value);
				if( yval < kay ) {
					sgn = " -";
				}
				doc.getElementById("c" + nextN + "_" + prevcol).innerHTML = sgn + "&#x221A"; // sqrt
				doc.getElementById("c" + rowno + "_" + prevcol).innerHTML = "";
			} else {
				doc.getElementById("c" + rowno + "_" + prevcol).innerHTML = "";
				doc.getElementById("c" + rowno + "_" + colnum).innerHTML = "";
				colnum += 1;
				var focusBx = doc.getElementById("y0");
				if( isCircle ){
					var sin = " + ";
					var absk = kay;
					if( kay < 1 ) {
						sin = " - ";
						absk = -kay;
					}		
					doc.getElementById("c0_" + colnum).innerHTML =  sin + absk + " = ";
				} else if( isEllipse ){
					doc.getElementById("c0_" + colnum).innerHTML = " &#xd7 " + bee + " = "; // times
					if( kay !== 0 ) {
						focusBx = doc.getElementById("n0");
						var hdr = doc.getElementById("q" + colnum);
						hdr.classList.add("wide");
						hdr.innerHTML = doc.getElementById("i" + colnum).value;
						var colBxs = doc.getElementsByClassName("i" + colnum);
						var len = colBxs.length - 1;
						var nClrs = 4; // copied from jsp
						for( var i = 0; i < len; ++i ) {
							var clr = "c" + i%nClrs;
							colBxs[i+1].classList.add(clr);
						}
						var scndBxs = doc.getElementsByClassName("nBx");
						len = scndBxs.length;
						for( var i = 0; i < len; ++i ) {
							scndBxs[i].type = "text";
						}		
						doc.getElementById("n0").focus(); // may have a problem with assumptions that n0 is line
						// definition of n0 fixit
					}
				}
				var oldcols = doc.getElementsByClassName("l" + prevcol);
				len = oldcols.length;
				for( var i = len - 1; i >= 0; --i ) {
					var parent = oldcols[i].parentNode;
					parent.removeChild(oldcols[i]);
				}
				oldcols = doc.getElementsByClassName("i" + prevcol);
				len = oldcols.length;
				for( var i = len - 1; i >= 0; --i ) {
					var parent = oldcols[i].parentNode;
					parent.removeChild(oldcols[i]);
				}
				focusBx.focus();
			}
		} else {
			errBx.innerHTML = "Should be " + expAns;
			ansBx.style.color = "red";
			if( num(rowno)%4 > 1 ) {
				ansBx.style.backgroundColor = "white";
			}
			var errct = Number(errCtBx.value);
		   	errCtBx.value = errct + 1;
		}
	}
}
function checkD( ev ) {
	ev = ev || window.event;
	// have to make sure it was entered, not just any keyup
	if (ev.which === 13 || ev.keyCode === 13) {
		var ansBx = ev.target;
		var doc = document;
		var num = Number;
		var did = ansBx.id;
		rowno = did.substr(1,did.length);
		var nextN = num(rowno) + 1;
		var prevval;
		prevval = num(doc.getElementById("x" + rowno).innerHTML);
		var expAns;
		if( isCircle ){
			expAns = bee*bee - (prevval - ache)*(prevval - ache);
		} else if( isEllipse ){
			expAns = 1 - (prevval - ache)*(prevval - ache)/(aye*aye);
		}
		var prevcol = colnum - 1;
		if( num(ansBx.value) === expAns ) {
			errBx.innerHTML = "";
			if( nextN < lastPt ) {
				did = "d" + nextN;	
				var curr = doc.getElementById("c" + rowno + "_" + colnum);
				doc.getElementById("c" + nextN + "_" + colnum).innerHTML = " = ";
				curr.innerHTML = "";			
				doc.getElementById("c" + nextN + "_" + prevcol).innerHTML = 
					doc.getElementById("c" + rowno + "_" + prevcol).innerHTML;
				doc.getElementById("c" + rowno + "_" + prevcol).innerHTML = "";
				doc.getElementById(did).focus();
			} else {
				var oldcols = doc.getElementsByClassName("l" + prevcol);
				len = oldcols.length;
				for( var i = len - 1; i >= 0; --i ) {
					var parent = oldcols[i].parentNode;
					parent.removeChild(oldcols[i]);
				}
				oldcols = doc.getElementsByClassName("i" + prevcol);
				len = oldcols.length;
				for( var i = len - 1; i >= 0; --i ) {
					var parent = oldcols[i].parentNode;
					parent.removeChild(oldcols[i]);
				}
				doc.getElementById("c" + rowno + "_" + colnum).innerHTML = "";
				var sgn = " ";
				var yval = num(doc.getElementById("h0").value);
				if( yval < kay ) {
					sgn = " -";
				}
				doc.getElementById("c0_" + colnum).innerHTML = sgn + "&#x221A"; // sqrt
				colnum += 1;
				doc.getElementById("c0_" + colnum).innerHTML =  " = ";	
				if( kay !== 0 || isEllipse) {
					var hdr = doc.getElementById("q" + colnum);
					hdr.classList.add("wide");
					hdr.innerHTML = doc.getElementById("i" + colnum).value;
					var colBxs = doc.getElementsByClassName("i" + colnum);
					var len = colBxs.length - 1;
					var nClrs = 4; // copied from jsp
					for( var i = 0; i < len; ++i ) {
						var clr = "c" + i%nClrs;
						colBxs[i+1].classList.add(clr);
					}
					var scndBxs = doc.getElementsByClassName("rBx");
					len = scndBxs.length;
					for( var i = 0; i < len; ++i ) {
						scndBxs[i].type = "text";
					}		
					doc.getElementById("r0").focus();		
				} else { // y not offset
					doc.getElementById("y0").focus();
				}
			}
		} else {
			errBx.innerHTML = "Should be " + expAns;
			ansBx.style.color = "red";
			if( num(rowno)%4 > 1 ) {
				ansBx.style.backgroundColor = "white";
			}
			var errct = Number(errCtBx.value);
		   	errCtBx.value = errct + 1;
		}
	}
}
function checkS( ev ) {
	ev = ev || window.event;
	// have to make sure it was entered, not just any keyup
	if (ev.which === 13 || ev.keyCode === 13) {
		var ansBx = ev.target;
		var doc = document;
		var num = Number;
		var sid = ansBx.id;
		rowno = sid.substr(1,sid.length);
		var nextN = num(rowno) + 1;
		var prevval;
		prevval = num(doc.getElementById("x" + rowno).innerHTML);
		var expAns;
		if( isCircle ) {
			expAns = (prevval - ache)*(prevval - ache);
		} else if( isEllipse ) {
			expAns = (prevval - ache)*(prevval - ache)/(aye*aye);
		}
		if( num(ansBx.value) === expAns ) {
			errBx.innerHTML = "";
			if( nextN < lastPt ) {
				sid = "s" + nextN;		
				var curr = doc.getElementById("c" + rowno + "_" + colnum);
				var xma = num(doc.getElementById("x" + nextN).innerHTML) - ache;
				if( isEllipse ) {
					xma = xma/aye;
				}
				doc.getElementById("c" + nextN + "_" + colnum).innerHTML = " &#xd7 " + xma + " = ";
				curr.innerHTML = "";
				doc.getElementById(sid).focus();
			} else { // start next column
				if( ache !== 0 ) {
					var oldcols = doc.getElementsByClassName("l1");
					len = oldcols.length;
					for( var i = len - 1; i >= 0; --i ) {
						var parent = oldcols[i].parentNode;
						parent.removeChild(oldcols[i]);
					}
					var oldcols = doc.getElementsByClassName("i1");
					len = oldcols.length;
					for( var i = len - 1; i >= 0; --i ) {
						var parent = oldcols[i].parentNode;
						parent.removeChild(oldcols[i]);
					}
				}
				var inst = " " + aye + "<sup>2</sup> - ";
				if( isEllipse ) {
					var prevcol = colnum - 1;
					var oldcols = doc.getElementsByClassName("l" + prevcol);
					len = oldcols.length;
					for( var i = len - 1; i >= 0; --i ) {
						var parent = oldcols[i].parentNode;
						parent.removeChild(oldcols[i]);
					}
					var oldcols = doc.getElementsByClassName("i" + prevcol);
					len = oldcols.length;
					for( var i = len - 1; i >= 0; --i ) {
						var parent = oldcols[i].parentNode;
						parent.removeChild(oldcols[i]);
					}
					inst = " 1 - ";
				}			
				doc.getElementById("c" + rowno + "_" + colnum).innerHTML = "";
				doc.getElementById("c0_" + colnum).innerHTML = inst;
				colnum += 1;
				var hdr = doc.getElementById("q" + colnum);
				hdr.classList.add("wide");
				hdr.innerHTML = doc.getElementById("i" + colnum).value;
				var colBxs = doc.getElementsByClassName("i" + colnum);
				var len = colBxs.length - 1;
				var nClrs = 4; // copied from jsp
				for( var i = 0; i < len; ++i ) {
					var clr = "c" + i%nClrs;
					colBxs[i+1].classList.add(clr);
				}
				var scndBxs = doc.getElementsByClassName("dBx");
				len = scndBxs.length;
				for( var i = 0; i < len; ++i ) {
					scndBxs[i].type = "text";
				}			
				doc.getElementById("c0_" + colnum).innerHTML =  " = ";
				doc.getElementById("d0").focus();	
			}
		} else {
			errBx.innerHTML = "Should be " + expAns;
			ansBx.style.color = "red";
			if( num(rowno)%4 > 1 ) {
				ansBx.style.backgroundColor = "white";
			}
			var errct = Number(errCtBx.value);
		   	errCtBx.value = errct + 1;
		}
	}
}
function checkM( ev ) {
	ev = ev || window.event;
	// have to make sure it was entered, not just any keyup
	if (ev.which === 13 || ev.keyCode === 13) {
		var ansBx = ev.target;
		var doc = document;
		var num = Number;
		var mid = ansBx.id;
		rowno = mid.substr(1,mid.length);
		var nextN = num(rowno) + 1;
		var prevval;

		prevval = num(doc.getElementById("x" + rowno).innerHTML);
		var expAns;
		expAns = prevval - ache;
		if( num(ansBx.value) === expAns ) {
			errBx.innerHTML = "";
			if( nextN < lastPt ) {
				mid = "m" + nextN;
				doc.getElementById(mid).focus();
				var curr = doc.getElementById("c" + rowno + "_" + colnum);
				doc.getElementById("c" + nextN + "_" + colnum).innerHTML = curr.innerHTML;
				curr.innerHTML = "";
			} else {
				var hdr = doc.getElementById("q2");
				hdr.classList.add("wide");
				hdr.innerHTML = doc.getElementById("i2").value;
				var colBxs = doc.getElementsByClassName("i2");
				var len = colBxs.length-1;
				var nClrs = 4; // copied from jsp
				for( var i = 0; i < len; ++i ) {
					var clr = "c" + i%nClrs;
					colBxs[i+1].classList.add(clr);
				}
				var scndBxs = doc.getElementsByClassName("sBx");
				var focusBx = doc.getElementById("s0");
				var xma = x0val - ache;
				var inst = " &#xd7 " + xma + " = "; // times;
				if( isEllipse ) {
					scndBxs = doc.getElementsByClassName("tBx");
					focusBx = doc.getElementById("t0");
					inst = " &#xf7 " + aye + " = "; // divide
				}
				len = scndBxs.length;
				for( var i = 0; i < len; ++i ) {
					scndBxs[i].type = "text";
				}
				
				doc.getElementById("c" + rowno + "_" + colnum).innerHTML = "";
				colnum += 1;				
				doc.getElementById("c0_" + colnum).innerHTML = inst;
				focusBx.focus();			
			}
		} else {
			errBx.innerHTML = "Should be " + expAns;
			ansBx.style.color = "red";
			if( num(rowno)%4 > 1 ) {
				ansBx.style.backgroundColor = "white";
			}
			var errct = Number(errCtBx.value);
		   	errCtBx.value = errct + 1;
		}
	}
}
function checkN( ev ) {
	ev = ev || window.event;
	// have to make sure it was entered, not just any keyup
	if (ev.which === 13 || ev.keyCode === 13) {
		var ansBx = ev.target;
		var doc = document;
		var num = Number;
		var nid = ansBx.id; // use global nextI
		rowno = nid.substr(1,nid.length);
		var nextN = num(rowno) + 1;
		var prevval;
		prevval = num(doc.getElementById("x" + rowno).innerHTML);
		var expAns;
		if( isLine ) {
			expAns = nsign*mult*prevval/div;
		} else if( isEllipse ) {
			var sn = 1;
			var yval = num(doc.getElementById("h" + rowno).value);
			if( yval < kay ) {
				sn = -1;
			}
			expAns = sn*bee*Math.sqrt(1 - (prevval - ache)*(prevval - ache)/(aye*aye));
		}
		if( num(ansBx.value) === expAns ) {
			errBx.innerHTML = "";
			if( nextN < lastPt ) {
				nid = "n" + nextN;
				doc.getElementById(nid).focus();
				var curr = doc.getElementById("c" + rowno + "_" + colnum);
				doc.getElementById("c" + nextN + "_" + colnum).innerHTML = curr.innerHTML;
				curr.innerHTML = "";
			} else {								
				if( isLine ) {
					doc.getElementById("c" + rowno + "_" + colnum).innerHTML = "";
					colnum += 1;		
					if( bee !== 0 ) {
						doc.getElementById("c0_" + colnum).innerHTML = op + " " + bee + " = ";
					} else {
						doc.getElementById("c0_" + colnum).innerHTML = " &#xd7 " + mult + " = "; // times;
					}
				} else if( isEllipse ) {
					doc.getElementById("c" + rowno + "_" + colnum).innerHTML = "";
					var prevcol = colnum - 1;
					var oldcols = doc.getElementsByClassName("l" + prevcol);
					len = oldcols.length;
					for( var i = len - 1; i >= 0; --i ) {
						var parent = oldcols[i].parentNode;
						parent.removeChild(oldcols[i]);
					}
					oldcols = doc.getElementsByClassName("i" + prevcol);
					len = oldcols.length;
					for( var i = len - 1; i >= 0; --i ) {
						var parent = oldcols[i].parentNode;
						parent.removeChild(oldcols[i]);
					}
					colnum += 1;
					doc.getElementById("c0_" + colnum).innerHTML = " + " + kay + " = ";
				}
				doc.getElementById("y0").focus();		
			}
		} else {
			errBx.innerHTML = "Should be " + expAns;
			ansBx.style.color = "red";
			if( num(rowno)%4 > 1 ) {
				ansBx.style.backgroundColor = "white";
			}
			var errct = Number(errCtBx.value);
		   	errCtBx.value = errct + 1;
		}
	}
}
function checkT( ev ) {
	ev = ev || window.event;
	// have to make sure it was entered, not just any keyup
	if (ev.which === 13 || ev.keyCode === 13) {
		var ansBx = ev.target;
		var doc = document;
		var num = Number;
		var tid = ansBx.id;
		rowno = tid.substr(1,tid.length);
		var xval = num(doc.getElementById("x" + rowno).innerHTML);
		var expAns;
		if( isLine ) {
			expAns = nsign*xval/div;
		} else if( isEllipse ) {
			expAns = (xval - ache)/aye;
		}
		if( num(ansBx.value) === expAns ) {
			errBx.innerHTML = "";
			var nextN = num(rowno) + 1;
			if( nextN < lastPt ) {	
				var curr = doc.getElementById("c" + rowno + "_0");
				var nextVal = doc.getElementById("x" + nextN).innerHTML;
				if( nsign < 0 && nextVal !== "0" ) {
					doc.getElementById("c" + nextN + "_0").innerHTML = "-";
				}
				curr.innerHTML = "";
				//var nextcol = colnum + 1;
				//alert("checkT colnum: " + colnum + " rowno: " + rowno + " nextN: " + nextN);
				curr = doc.getElementById("c" + rowno + "_" + colnum);
				doc.getElementById("c" + nextN + "_" + colnum).innerHTML = curr.innerHTML;
				curr.innerHTML = "";
				tid = "t" + nextN;
				doc.getElementById(tid).focus();
			} else {
				var nextBx;		
				doc.getElementById("c" + rowno + "_0").innerHTML = "";
				doc.getElementById("c" + rowno + "_" + colnum).innerHTML = ""; // ellipse
				var xma = (x0val - ache)/aye;			
				if( n0 ) {	
					nextBx = n0;
					colnum += 1;
					doc.getElementById("c" + rowno + "_" + colnum).innerHTML = ""; // line
					doc.getElementById("c0_" + colnum).innerHTML = " &#xd7 " + mult + " = ";
				} else if( isEllipse ) {
					colnum += 1;
					var hdr = doc.getElementById("q" + colnum);
					hdr.classList.add("wide");
					hdr.innerHTML = doc.getElementById("i" + colnum).value;
					var colBxs = doc.getElementsByClassName("i" + colnum);
					var len = colBxs.length-1;
					var nClrs = 4; // copied from jsp
					for( var i = 0; i < len; ++i ) {
						var clr = "c" + i%nClrs;
						colBxs[i+1].classList.add(clr);
					}
					var sBxs = doc.getElementsByClassName("sBx");
					len = sBxs.length;
					for( var i = 0; i < len; ++i ) {
						sBxs[i].type = "text";
					}
					if( ache !== 0 ) {
						var oldcols = doc.getElementsByClassName("l1");
						len = oldcols.length;
						for( var i = len - 1; i >= 0; --i ) {
							var parent = oldcols[i].parentNode;
							parent.removeChild(oldcols[i]);
						}
						var oldcols = doc.getElementsByClassName("i1");
						len = oldcols.length;
						for( var i = len - 1; i >= 0; --i ) {
							var parent = oldcols[i].parentNode;
							parent.removeChild(oldcols[i]);
						}
					}
					nextBx = doc.getElementById("s0");
					doc.getElementById("c0_" + colnum).innerHTML = " &#xd7 " + xma + " = "; // times;
				} else {
					nextBx = doc.getElementById("y0");
					colnum += 1;
					doc.getElementById("c" + rowno + "_" + colnum).innerHTML = ""; // line
					if( bee !== 0 ) {
						doc.getElementById("c0_" + colnum).innerHTML = op + " " + bee + " = ";
					} else {
						doc.getElementById("c0_" + colnum).innerHTML = " &#xd7 " + mult + " = "; // times;
					}
				}
				nextBx.focus();
			}
		} else {
			errBx.innerHTML = "Should be " + expAns;
			ansBx.style.color = "red";
			if( num(rowno)%4 > 1 ) {
				ansBx.style.backgroundColor = "white";
			}
			var errct = Number(errCtBx.value);
		   	errCtBx.value = errct + 1;
		}
	}
}
function checkY( ev ) {
	ev = ev || window.event;
	// have to make sure it was entered, not just any keyup
	if (ev.which === 13 || ev.keyCode === 13) {
		var ansBx = ev.target;
		var doc = document;
		var num = Number;
		
		var ansVal = num(ansBx.value);
		var yid = ansBx.id;
		var rowno = yid.substr(1);
		var expY = num(doc.getElementById("h" + rowno).value);
		
		if( ansVal === expY ) { // || ansVal === expY2 ) {
			errBx.innerHTML = "";
			var nextN = num(rowno) + 1;
			var prevcol = colnum - 1;
			if( nextN < lastPt ) {
				yid = "y" + nextN;
				doc.getElementById(yid).focus();
				if( nsign < 0 && !n0 && !t0 ) {
					var nextVal = doc.getElementById("x" + nextN).innerHTML;
					if( nextVal !== "0" ) {
						doc.getElementById("c" + nextN + "_0").innerHTML = "-";
					}
				}
				doc.getElementById("c" + rowno + "_0").innerHTML = "";
				var curr = doc.getElementById("c" + rowno + "_" + colnum);
				doc.getElementById("c" + nextN + "_" + colnum).innerHTML = curr.innerHTML;
				curr.innerHTML = "";
				if( kay === 0 && isCircle ) {
					var sgn = " ";
					var yval = num(doc.getElementById("h" + nextN).value);
					if( yval < kay ) {
						sgn = " -";
					}
					doc.getElementById("c" + nextN + "_" + prevcol).innerHTML = sgn + "&#x221A"; // sqrt
					doc.getElementById("c" + rowno + "_" + prevcol).innerHTML = "";
				}
			} else {
				ansBx.blur();
				var ypts = doc.getElementsByClassName("ypts");
				var len = ypts.length;
				tblFilld = true;
				for( var i = 0; i < len; ++i ) {
					if( ypts[i].value === "") {
						tblFilld = false;
					}
				}
				whatrow = doc.getElementsByClassName("r0");
				len = whatrow.length;
				for( var i = 0; i < len; ++i ) {
					whatrow[i].classList.add("hilite");
				}
				if( t0 ) {
					var el = doc.getElementById("on");
					var parent = el.parentNode;
					parent.removeChild(el);
					var tBxs = doc.getElementsByClassName("tBx");
					len = tBxs.length;					
					for( var i = len - 1; i >= 0; --i ) {
						var parent = tBxs[i].parentNode;
						var grandparent = parent.parentNode;
						grandparent.removeChild(parent);
					}
					if( n0 ) {
						var el = doc.getElementById("om");
						var parent = el.parentNode;
						parent.removeChild(el);
						var nBxs = doc.getElementsByClassName("nBx");
						len = nBxs.length;
						for( var i = len - 1; i >= 0; --i ) {
							parent = nBxs[i].parentNode;
							var grandparent = parent.parentNode;
							grandparent.removeChild(parent);
						}
					}
				} else if( n0 ) {
					var el = doc.getElementById("hn");
					var parent = el.parentNode;
					parent.removeChild(el);
					var nBxs = doc.getElementsByClassName("nBx");
					len = nBxs.length;
					for( var i = len - 1; i >= 0; --i ) {
						parent = nBxs[i].parentNode;
						var grandparent = parent.parentNode;
						grandparent.removeChild(parent);
					}
				}
				var oldcols = doc.getElementsByClassName("l" + prevcol);
				len = oldcols.length;
				for( var i = len - 1; i >= 0; --i ) {
					var parent = oldcols[i].parentNode;
					parent.removeChild(oldcols[i]);
				}
				oldcols = doc.getElementsByClassName("i" + prevcol); // shouldn't these be covered by tmps? fixit
				len = oldcols.length;
				for( var i = len - 1; i >= 0; --i ) {
					var parent = oldcols[i].parentNode;
					parent.removeChild(oldcols[i]);
				}
				var tmps = doc.getElementsByClassName("tmp");
				len = tmps.length;
				for( var i = len - 1; i >= 0; --i ) {
					var parent = tmps[i].parentNode;
					parent.removeChild(tmps[i]);
				}
				doc.getElementById("c-1_0").innerHTML = "Click this";
				col0.innerHTML = "point &#x2192;"; // right arrow
				doc.getElementById("instrs").innerHTML = "";
			}
		} else {
			errBx.innerHTML = "Should be " + expY;
			ansBx.style.color = "red";
			if( num(rowno)%4 > 1 ) {
				ansBx.style.backgroundColor = "white";
			}
			var errct = Number(errCtBx.value);
		   	errCtBx.value = errct + 1;
		}
	}
}
function checkPt( mousePosx, mousePosy ){
	if( !dragged ) {
		var doc = document;
		var num = Number;	
		var pct = 0.05;
		var cellheight = 28;
		var expXBx = whatrow[0];
		var expYBx = doc.getElementById("h" + nextI);
		var nomX = expXBx.innerHTML;
		var nomY = expYBx.value;
		var expX = orgX + num(nomX)*pxlsprsq;
		var expY = orgY - num(nomY)*pxlsprsq;	
		var dotX = expX - xygraphleft; // halfwidth + num(nomX)*pxlsprsq;
		var dotY = expY - xygraphtop;
	
		var lowX = expX - pct*expX;
		var highX = expX + pct*expX;
		var lowY = expY - pct*expY;
		var highY = expY + pct*expY;
		if( lowX < mousePosx && mousePosx < highX && 
			lowY < mousePosy && mousePosy < highY ) {
			errBx.innerHTML = "";
			putDot( dotX, dotY );
			if( isLine && prevX && prevY ) { // don't connect dots for circles & ellipses, points not in order
				drawLine( prevX, prevY, dotX, dotY, 2, "black", "mrx" );
			}
			prevX = dotX;
			prevY = dotY;
			var currI = nextI;
			++nextI;
			// remove remnants of showclick
			var hbar = doc.getElementsByClassName("hbar");
			var len = hbar.length;
			for( var i = len - 1; i >= 0; --i  ) {
				var parent = hbar[i].parentNode;
				parent.removeChild(hbar[i]);
			}
			var len = whatrow.length;
			for( var i = 0; i < len; ++i ) {
				whatrow[i].classList.remove("hilite");
			}
			if( nextI < lastPt ) {
				whatrow = doc.getElementsByClassName("r" + nextI);
				var len = whatrow.length;
				for( var i = 0; i < len; ++i ) {
					whatrow[i].classList.add("hilite");
				}
				var prevI = currI - 1;
				var prev = doc.getElementById("c" + prevI + "_0");
				var curr = doc.getElementById("c" + currI + "_0");
				doc.getElementById("c" + nextI + "_0").innerHTML = curr.innerHTML;
				curr.innerHTML = prev.innerHTML; 
				prev.innerHTML = "";			
			} else if( whichcurve === Number(doc.getElementById("allcurves").value) - 1 ) {
				var endinst = doc.getElementById("skpBx").innerHTML;
				doc.getElementById("instrs").innerHTML = 'Choose another curve or click "' + endinst + '"';
				clearpage();

				nmins = 0;
				nmaxes = 0;
				drawCurve( whichcurve ); // draw last curve of the set
			} else { // plotted one curve, start another similar one
				startAgain();
			}
		} else {
			var errct = Number(errCtBx.value);
		   	errCtBx.value = errct + 1;
			var hbarExists = doc.getElementsByClassName("hbar");
			if( !hbarExists[0] ) {
				showClick( dotX, dotY, nomX, nomY );
			}
		}
	}
}
function showClick( x, y, nomX, nomY ) {
	drawLine( graphstart, y, graphstop, y, 2, "red", "hbar" );
	drawLine( x, graphstart, x, graphstop, 2, "red", "hbar" );
	var htmseg = '<circle cx="' + x;
	htmseg += '" cy="' + y;
	htmseg += '" r="2" stroke="red" />';
	xygraph.innerHTML += htmseg;
	var yp = nomX === "-10"? 55: x + 15;
	var xp = nomY > 0? 200 : 400;
	htmseg = '<text class="hbar" x="' + xp + '" y="' + yp + '" fill="red" transform="rotate(270 260,280)">x = ' + nomX + '</text>';
	xygraph.innerHTML += htmseg;
	xp = nomX > 0? 100 : 300;
	yp = nomY === "10"? 35 : y;
	htmseg = '<text class="hbar" x="' + xp + '" y="' + yp + '" fill="red" >y = ' + nomY + '</text>';
	xygraph.innerHTML += htmseg;
}
function putDot( xX, xY) {
	var htmseg = '<circle class="mrx" cx="' + xX;
	htmseg += '" cy="' + xY;
	htmseg += '" r="2" stroke="black" />';
	xygraph.innerHTML += htmseg;
}
function mouseCoords(ev){ 
   ev = ev || window.event;
	if( ev.pageX || ev.pageY ){ 
		return {x:ev.pageX, y:ev.pageY}; 
    } 
	var doc = document;
    return { 
		x:ev.clientX + doc.body.scrollLeft - doc.body.clientLeft, 
		y:ev.clientY + doc.body.scrollTop  - doc.body.clientTop
    }; 
}
// last section of ellipse doesn't graph if it's too steep fixit
// draw smoothed, extended and labelled curve
function drawCurve( cls ) {
    var num = Number; 
	var mat = Math;
	var doc = document;
	var id = "whichparam1_" + cls;
	par1 = doc.getElementById(id).value;
	id = "whichparam2_" + cls;
	par2 = doc.getElementById(id).value;
	id = "whichparam3_" + cls;
	par3 = doc.getElementById(id).value;
	id = "whichparam4_" + cls;
	par4 = doc.getElementById(id).value;
	var gridspace = 20;
	var xstart = -10;
	var xstop = 10;
	var lw = 150;
	var ymax;
	var ymin;
	var hitsrightedge = true;
	///////////////green	gold		orange		burgundy	chocolate
	var colors = ["#33cc33", "#ffbf80", "#ff6600", "#cc0000", "#ac7339", "red"];
	var ltcols = [ "#68e514", "#ffe680", "#ffbb99", "#ff3dd4", "#d2a679", "white" ];
	cls = cls%colors.length;
	var cap = doc.createElement("label");
	var styles = "position: absolute;"
		+ " color: " + ltcols[cls] + ";"
		+ " text-shadow: 0 0 1px #FFFFFF;"
		+ " font-family: Monaco;"
		+ " font-size: 0.8em;";
		
	if( isLine ) {
		var rise = num(par1);
		var run = num(par2);
		var slope = rise/run;
		var intercept = num(par3);
		var ystart = slope*xstart + intercept;
		var ystop = slope*xstop + intercept;

		// make sure endpoints are on the graph
		if( ystart < -10 ) {
			ystart = -10;
			xstart = (ystart - intercept)/slope;
		}
		if( ystart > 10 ) {
			ystart = 10;
			xstart = (ystart - intercept)/slope;
		}
		if( ystop < -10 ) {
			ymin = ystop;
			ystop = -10;
			xstop = (ystop - intercept)/slope;
			hitsrightedge = false;
			nmins += 1;
		}
		if( ystop > 10 ) {
			ymax = ystop;
			ystop = 10;
			xstop = (ystop - intercept)/slope;
			hitsrightedge = false;
			nmaxes += 1;
		}
	
		// convert to location on window
		xstart = halfwidth + mat.round(xstart*gridspace);
		xstop = halfwidth + mat.round(xstop*gridspace);
		ystart = halfwidth - mat.round(ystart*gridspace);
		ystop = halfwidth - mat.round(ystop*gridspace);
		drawLine( xstart, ystart, xstop, ystop, 2, colors[cls], null );
	
		// re-create equation
		var intermed = "";
		var absrise = mat.abs(rise);
		var absrun = mat.abs(run);
	   	if( !(absrise == 1 && absrun == 1) ) { 
	   		intermed += absrise;
	   	}
		if( absrun != 1 ) {
		   	intermed = "(" + intermed;
		}
		if( rise*run < 0 ) {
			intermed = "-" + intermed;
		} 		
		if( absrun != 1 ) {
			intermed += "/" + absrun + ")";
		}
	   	var rest = "";
		if( intercept != 0 ) {
			if( intercept < 0 ) {
				rest = " - ";
			} else {
			    rest = " + ";
			}
		    rest += Math.abs(intercept);
		}
		cap.innerHTML = "Y = " + intermed + "X" + rest;
	} else if( isCircle || isEllipse ) {
		var htmseg = '<polyline points=" ';
		var h = num(par2);
		var k = num(par3);
		var a = num(par1);
		var b = num(par4);
		for( var xp = h - a; xp <= a + h; xp += 0.1 ) {
			var yp = k + b*mat.sqrt( 1 - (xp - h)*(xp - h)/(a*a));
			var px = halfwidth + mat.round(xp*gridspace);
			var py = halfwidth - mat.round(yp*gridspace);
			htmseg += px + ', ' + py + ' '; 
		}
		for( var xp = a + h; xp >= h - a; xp -= 0.1) {
			var yp = k - b*mat.sqrt( 1 - (xp - h)*(xp - h)/(a*a));		
			var px = halfwidth + mat.round(xp*gridspace);
			var py = halfwidth - mat.round(yp*gridspace);
			var newseg = px + ', ' + py + ' '; 
			htmseg += newseg; 
			//doc.getElementById("statusBox" + pdx).innerHTML = "xp: " + xp + " yp: " + yp + " newseg: " + newseg;
			//pdx = (pdx + 1)%(maxbx-1);
		}
		htmseg += '" style="stroke:' + colors[cls];
		htmseg += ';stroke-width:2; fill:none';
		htmseg += ';" />';
		xygraph.innerHTML += htmseg;
		var xcent = "X";
		if( h < 0 ) {
			xcent = "( X" + "+" + mat.abs(h) + " )";
		} else if ( h > 0 ) {
			xcent = "( X" + "-" + mat.abs(h) + " )";
		}
		var ycent = "Y";
		if( k < 0 ) {
			ycent = "( Y" + "+" + mat.abs(k) + " )";
		} else if ( k > 0 ) {
			ycent = "( Y" + "-" + mat.abs(k) + " )";
		}
		var rst = "";
		if( isCircle ) {
			rst = xcent + "<sup>2</sup> + " + ycent + "<sup>2</sup> = " + a + "<sup>2</sup>";
		} else {
			rst = "( " + xcent + "/" + a + " )" +  "<sup>2</sup> + ";
			rst += "( " + ycent + "/" + b + " )" +  "<sup>2</sup> = 1";
		}
		cap.innerHTML = rst;
		lw = halfwidth + 5*gridspace;
		var spot = 5;
		if( k > 0 ) {
			if( h > 0 ) {
				spot = 1;
			} else {
				spot = 0;
			}
		} else {
			if( h > 0 ) {
				spot = 2;
			} else {
				spot = 3;
			}
		}
		var len = taken.length;
		if( taken[spot] ) { // try the one counter clockwise
			spot = (spot + len - 2)%(len - 1); // spot -> spot - 1 except 0-> 3
			if( taken[spot] ) { // try the one clockwise
				spot = spot + 2;
			}
			if( taken[spot] ) { // use the default
				spot = len - 1;
			}
		}
		taken[spot] = true;		
			
		switch( spot ) {
			case 0:
				xstop = halfwidth;
				ystop = -gridspace;
				hitsrightedge = false;
		    	break;
			case 1:
				xstop = graphstop;
				ystop = halfwidth;
				hitsrightedge = true;
				break;
			case 2:
				xstop = halfwidth;
				ystop = graphstop + 2*gridspace;
				hitsrightedge = false;
				break;
			case 3:				
				xstop = 0;
				ystop = graphstop + 3*gridspace;
				hitsrightedge = false;
				break;
			default:
				xstop = graphstop;
				ystop = halfwidth + 4*gridspace;
				hitsrightedge = true;
		}

	}
	var xp = xygraphleft + xstop; // xyframe left + xstop
	var yp = xygraphtop;
	var yspace = gridspace - 4;
	var aboveframe = 6;
	var belowframe = 4;
	var centerline = yspace/2;
	if( hitsrightedge ) {
		xp += gridspace + 3;

		// find the smallest upper and lower difference, if both combined doesn't have room for another
		// push it right. if there is room move it up or down
		var lowerdiff = 2*yspace;
		var higherdiff = 2*yspace;
		for( var i = 0; i < ystops.length; ++i ) {
			if( ystop >= ystops[i] ) {
				var diff = ystop - ystops[i];
				if( diff < higherdiff ) {
					higherdiff = diff;
				}
			} else {
				var diff = ystops[i] - ystop;
				if( diff < lowerdiff ) {
					lowerdiff = diff;
				}
			}
		}

		if( higherdiff + lowerdiff < 1.7*yspace ) { // in very rare cases with 3 consecutive close lines, a previous
			xp += 140;								// line label may be pushed to the point where the last is out of
			styles += " background: white;";			// order not worth it to fixit ?
		} else {
			if( lowerdiff < yspace ) {
				ystop -= yspace - lowerdiff;
			} else if( higherdiff < yspace ) {
				ystop += yspace - higherdiff;
			}
		}
		ystops.push(ystop);
	}
	if( ymax ) {
		yp += ystop - aboveframe - (1 + nmaxes)*yspace;
	} else if( ymin ) {
		yp += ystop + belowframe + nmins*yspace;
	} else {
		yp += ystop - centerline;
	}
	styles += " left: " + xp + "px;"
			+ " top: " + yp + "px;"
			+ " width: " + lw + "px;";

	cap.setAttribute("style", styles);
	form.appendChild( cap ); 
}
function startAgain() {
    var doc = document;
    var Num = Number;
    var nitBx = doc.getElementById("initlzd");
	if( nitBx.value === "true" ) {
	    var errCt = Num(errCtBx.value);
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
	} else {
		nitBx.value = "true";
	}	
    if( allgood ) {
        var whatForm = doc.getElementById('plots');
        whatForm.submit();
        return false;
    }
}
function genpoints ( which ) {
	var doc = document;
	var num = Number;
	var mat = Math;
	var id = "whichparam1_" + which;
	par1 = num(doc.getElementById(id).value);
	id = "whichparam2_" + which;
	par2 = num(doc.getElementById(id).value);
	id = "whichparam3_" + which;
	par3 = num(doc.getElementById(id).value);
	id = "whichparam4_" + which;
	par4 = num(doc.getElementById(id).value);
	var xBxs = doc.getElementsByClassName("xpts");
	plen = xBxs.length;
	var xp;
	var sign = "";
		
	for( var i = 0; i < plen; ++i ) {
		//read 
		xp = num(xBxs[i].innerHTML);
		yvals[i] = num(doc.getElementById("h" + i).value);
		// and convert into position on page
		xpts[i] = xygraphleft + halfwidth + xp*pxlsprsq;
		ypts[i] = xygraphtop + halfwidth - yvals[i]*pxlsprsq;
		captured[i] = false;
	}
		
	// set global variables for intermediate instructions 
	if( isLine ) {
		var rise = par1;
		var run = par2;
		var intercept = par3;
		if( intercept < 0 ) {
			op = "-";
		} else {
			op = "+";
		}
		bee = mat.abs(intercept);
	
		if( rise*run < 0 ) {
		  	sign = "-";
			nsign = -1;
		 }
		mult = mat.abs(rise);
		div = mat.abs(run);
	} else if( isCircle || isEllipse ) {
		aye = par1;
		ache = par2;
		kay = par3;
		bee = par4;
		enoughPoints = 3;
		var len = taken.length;
		for( var i = 0; i < len; ++i ) {
			taken[i] = false;
		}
	}
	return sign;
}
function skip() {
	clearpage();
	if( nextI < lastPt ) {
		document.getElementById("errct").value = 1;
	}
	allgood = true;
	startAgain(); 
}
window.onload = function() {
	var doc = document;
	var num = Number;
	var mat = Math;
	dragged = false;
	const selectDropdown = document.getElementById("chs");
	selectDropdown.addEventListener('change', skip );
	var curvetype = selectDropdown.options[selectDropdown.selectedIndex].text;
	isNotSelect = curvetype !== "Select";
	isLine = curvetype === "Line";
	isCircle = curvetype === "Circle";
	isEllipse = curvetype === "Ellipse";
	form = doc.getElementById("plots");
	
	if( isNotSelect ) {	
		xygraph = document.getElementById("xygraph");
		xygraph.innerHTML += '<rect width="444" height="444" style="fill:rgb(78, 76, 50);" />';
		xygraph.innerHTML += '<rect x="2" y="2" width="440" height="440" style="fill:rgb(191, 128, 64);" />';
		xygraph.innerHTML += '<rect x="18" y="18" width="408" height="408" style="fill:rgb(78, 76, 50);" />';
		xygraph.innerHTML += '<rect x="20" y="20" width="404" height="404" style="fill:rgb(255,255,255);" />';
		
		// draw horizontal and vertical stripes to make a grid
		for( var y = graphstart; y <= graphstop; y += 20 ) {
			drawLine( graphstart, y, graphstop, y, 1, "rgb(0,0,255)", null );
		}
		for( var x = graphstart; x <= graphstop; x += 20 ) {
			drawLine( x, graphstart, x, graphstop, 1, "rgb(0,0,255)", null );
		}
		
		// draw vertical and horizontal axes
		drawLine( halfwidth, graphstart, halfwidth, graphstop, 2, "rgb(255,200,200)", null );
		drawLine( graphstart, halfwidth, graphstop, halfwidth, 2, "rgb(255,200,200)", null );
		
		// draw arrows
		htmseg = '<polygon points="424,' + halfwidth + ' 422,212 444,' + halfwidth + ' 422,232" ';
		htmseg += 'style="fill:rgb(230, 176, 138);stroke:rgb(78, 76, 50);stroke-width:1" />';
		xygraph.innerHTML += htmseg;
		htmseg = '<polygon points="' + halfwidth + ',18 232,22 ' + halfwidth + ',0 212,22" ';
		htmseg += 'style="fill:rgb(230, 176, 138);stroke:rgb(78, 76, 50);stroke-width:1" />';
		xygraph.innerHTML += htmseg;
		// label axes
		htmseg = '<text x="428" y="214" fill="rgb(249, 242, 236)" >X</text>';
		xygraph.innerHTML += htmseg;
		htmseg = '<text x="228" y="16" fill="rgb(249, 242, 236)" >Y</text>';
		xygraph.innerHTML += htmseg;
		var offs = 62;
		offs = 67;
		for( var i = 8; i > -10; i -= 2 ) {
			htmseg = '<text x="' + halfwidth + '" y="' + offs + '" fill="rgb(230, 0, 0)" >' + i + '</text>';
			xygraph.innerHTML += htmseg;
			offs += 40;
		}
		offs = 45;
		offs = 50;
		for( var i = -8; i < 10; i += 2 ) {
			if( i=== 0 ) {
				offs += 7;
			}
			htmseg = '<text x="' + offs + '" y="234" fill="rgb(230, 0, 0)" >' + i + '</text>';
			xygraph.innerHTML += htmseg;
			offs += 40;
		}

		errCtBx = doc.getElementById("errct");
		errBx = doc.createElement("label");
		var styles = "position: absolute;"
	    	+ "top: 123px;"
			+ "left: 340px;"
		    + "writing-mode: vertical-lr;"
	  		+ "display: inline-block;"
	 		+ "height: 350px;"
	 		+ "width: 20px;"
	 		+ "color: white;"
	 		+ "text-shadow: 0 0 1px #000000, 0 0 5px #FF0000;"
			+ "text-orientation: mixed;";
		errBx.setAttribute("style", styles);			
		form.appendChild( errBx );
		  			
		whichcurve = num(doc.getElementById("whichcurve").value);
		whatrow = doc.getElementsByClassName("r0");
		sign = genpoints( whichcurve );
		lastPt = Number(doc.getElementById("lastPt").value);
		col0 = doc.getElementById("c0_0");
	
		if( isLine ) {
			// add title borders and background colors for entire whatpts table
			var hdr = doc.getElementsByClassName("hdr");
			var len = hdr.length;
			for( var i = 0; i < len; ++i ) {
				hdr[i].classList.add("wide");
			}
			var tblhgt = doc.getElementsByClassName("xpts").length;
			var nClrs = 4; // copied from jsp
			for( var i = 0; i < tblhgt; ++i ) {
				var clr = "c" + i%nClrs;
				var whatrow = doc.getElementsByClassName("r" + i);
				len = whatrow.length;
				for( var j = 0; j < len; ++j ) {
					whatrow[j].classList.add(clr);
				}
			}
			var nputBxs = doc.getElementsByClassName("nput");
			len = nputBxs.length;
		  	for( var i = 0; i < len; ++i ) {
			  	nputBxs[i].type = "text";
			}
		  	n0 = doc.getElementById("n0");
		  	t0 = doc.getElementById("t0");		  	
			var col1 = doc.getElementById("c0_1");
		  			
		  	if( !n0 && !t0 ) {
		  		col0.innerHTML = sign;
				if( bee !== 0 ) {
					col1.innerHTML = op + " " + bee + " = ";
				} else if( mult != 1 ) {
					col1.innerHTML = " &#xd7 " + mult + " = "; // times
				} else if( div != 1) {
					col1.innerHTML = " &#xf7 " + div + " = "; // divided by
				} else {
					col1.innerHTML = " = ";
				}
				colnum = 1;
		  		doc.getElementById("y0").focus();
		  	} else {	  		
				x0val = num(doc.getElementById("x0").innerHTML);  		  	
			  	if( t0 ) {
				  	if( x0val !== 0 ) {
				  		col0.innerHTML = sign;
				  	}
				  	col1.innerHTML = " &#xf7 " + div + " = "; // divided by
			  		t0.focus();  		
			  	} else {
			  		colnum = 1;
			  		col1.innerHTML = " &#xd7 " + sign + mult + " = "; // times
			  		n0.focus();
			  	}
		  	}
		} else if( isCircle || isEllipse ) {
			// add title borders and background colors for 1st 2nd & last whatpts table
			var hdr = doc.getElementsByClassName("hdr");
			var len = hdr.length - 1;
			hdr[0].classList.add("wide");
			hdr[1].classList.add("wide");
			hdr[len].classList.add("wide");
			var tblhgt = doc.getElementsByClassName("xpts").length;
			var nClrs = 4; // copied from jsp
			for( var i = 0; i < tblhgt; ++i ) {
				var clr = "c" + i%nClrs;
				var whatrow = doc.getElementsByClassName("r" + i);
				len = whatrow.length - 1;
				whatrow[0].classList.add(clr);
				whatrow[1].classList.add(clr);
				whatrow[len].classList.add(clr);
			}
			var nputBxs = doc.getElementsByClassName("ypts");
			len = nputBxs.length;
		  	for( var i = 0; i < len; ++i ) {
			  	nputBxs[i].type = "text";
			}
			if( ache !== 0 ) {
				var frstBxs = doc.getElementsByClassName("mBx");
				len = frstBxs.length;
				for( var i = 0; i < len; ++i ) {
					frstBxs[i].type = "text";
				}
			} else {
				var frstBxs = doc.getElementsByClassName("sBx");
				if( isEllipse ) {
					frstBxs = doc.getElementsByClassName("tBx");
				}
				len = frstBxs.length;
				for( var i = 0; i < len; ++i ) {
					frstBxs[i].type = "text";
				}
			}
			// copy hidden input to 2nd heading column
			doc.getElementById("q1").innerHTML = doc.getElementById("i1").value;
			var col1 = doc.getElementById("c0_1");
			var x0st = doc.getElementById("x0").innerHTML;
			x0val = num(x0st);	
			if( ache !== 0 ) {
				var sin = " - ";
				var xOffs = ache;
				if( ache < 0 ) {
					xOffs = -ache;
					sin = " + ";
				}
				col1.innerHTML = sin + xOffs + " = ";
				doc.getElementById("m0").focus();
			} else {
				if( isCircle ) {
					if( x0val < 0 ) {
						x0st = "(" + x0st + ")";
					}
					col1.innerHTML = " &#xd7 " + x0st + " = ";  // times
					doc.getElementById("s0").focus();
				} else if( isEllipse ) {
					col1.innerHTML = " &#xf7 " + aye + " = "; // divide
					doc.getElementById("t0").focus();
				}
			}		
		}
		colnum = 1;
		
		// draw all the curves generated to date in this set
		nmins = 0;
		nmaxes = 0;
		for( var i = 0; i < whichcurve; i += 1 ) {
			drawCurve( i );
		}
	}
}