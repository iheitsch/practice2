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
var isParabola = false;
var isHyperbola = false;
var whichcurve = 0;

var form;
var errBx;
var errCtBx;
var xygraph;
var whatrow = new Array;
var pdx = 0;
var maxbx = 10; // should be the same as loop test for statusBox on jsp page fixit
var nmins = 0;
var nmaxes = 0;
var plen;
var yIsDepVar = true;
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
var bee = 1;
var kay = 0; 
var ache = 0;
var aye = 1;
var oh = 0;

var nsign = 1;
var op = "";
var n0;
var t0;
var x0val;
var col0;
//var colnum = 0;
var tblFilld = false;
var ystops = new Array();
var taken = new Array(5);
var done = false;
var adj = 0;

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
		//document.getElementById("statusBox9").innerHTML = "x: " + mousePos.x + " y: " + mousePos.y;
		for( var i = 0; i < plen; ++i ) {
			if( !captured[i] &&  mousePos.x - xpts[i] < closenuff && xpts[i] - mousePos.x < closenuff ) { 
				if( mousePos.y - ypts[i] < closenuff && ypts[i] - mousePos.y < closenuff ) {
					var doc = document;
					pointsfound += 1;
					captured[i] = true;
					//doc.getElementById("statusBox" + i).innerHTML = "captured";
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
    if( ansBx.classList.contains("err") ) {
    	ansBx.classList.remove("err");
	    ansBx.value = "";
	    ansBx.style.color =  "inherit";
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
function checkA( ev ) {
	ev = ev || window.event;
	// have to make sure it was entered, not just any keyup
	if (ev.which === 13 || ev.keyCode === 13) {
		var ansBx = ev.target;
		var doc = document;
		var num = Number;
		var aid = ansBx.id;
		var rowno = aid.substr(3,aid.length);
		var colnum = num(aid.substr(1,1));
		var xval = num(doc.getElementById("x" + rowno).innerHTML);		
		var sn = 1;
		var yval = num(doc.getElementById("h" + rowno).value);
		if( yval < kay ) {
			sn = -1;
		}
		var yNext;
		var sgn = " ";
		var nextro = num(rowno) + 1;
		var nextpre;
		var nextsuf;
		var prevcol = colnum - 1;
		var precol = colnum;
		var stillThisCol = nextro < lastPt;
		if( stillThisCol ) {
			xNext = num(doc.getElementById("x" + nextro).innerHTML)
			yNext = num(doc.getElementById("h" + nextro).value);
			if( yNext < kay ) {
				sgn = " -";
			}
			nextpre = doc.getElementById("c" + nextro + "_" + prevcol);
			nextsuf = doc.getElementById("c" + nextro + "_" + colnum);
		} else {
			nextro = 0;
		}
		var expAns;
		var preinst;
		var sufinst;		
		var currpre = doc.getElementById("c" + rowno + "_" + prevcol);
		var currsuf = doc.getElementById("c" + rowno + "_" + colnum);
		var newBxs;
		var oldBxs;
		var step = aid.substr(0,1);
		if( isLine ) {
			switch( step ) {
				case "t":
					expAns = nsign*xval/div;
					if( stillThisCol ) {
						preinst = nsign < 0 ? "-" : "";
						currsuf = doc.getElementById("c" + rowno + "_" + colnum);
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						if( n0 ) {
							preinst = null;
							sufinst = " &#xd7 " + mult + " = ";
							fcsBx = n0;
						} else {
							preinst = null;
							sufinst = bee !== 0 ? op + " " + bee + " = " :" &#xd7 " + mult + " = "; // times;
							fcsBx = doc.getElementById("y" + colnum + "_0");
						}
					}
			    	break;
			    case "n":
			    	expAns = nsign*mult*xval/div;
			    	if( stillThisCol ) {
				    	preinst = null;
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						preinst = null;
						// will bee ever be 0 when there is an n0? fixit
						sufinst = bee !== 0 ? op + " " + bee + " = " :" &#xd7 " + mult + " = "; // times;
						fcsBx = doc.getElementById("y" + colnum + "_0");
					}
			    	break;
			    default: // y
			    	expAns = num(doc.getElementById("h" + rowno).value);
			    	if( stillThisCol ) {
				    	preinst = currpre.innerHTML; // sometimes there are no intermediate steps
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						fcsBx = null;
					}
			    	break;
			}
		} else if( isCircle ) {
			switch( step ) {
				case "m":
					expAns = xval - ache;
					if( stillThisCol ) {
						preinst = null;
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_"  + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						newBxs = doc.getElementsByClassName("sBx");
						//var xma = x0val - ache;
						sufinst = " <sup>2</sup> = "; // squared
						fcsBx = doc.getElementById("s" + colnum + "_0");	
					}
			    	break;
			    case "s":
			    	expAns = (xval - ache)*(xval - ache);
			    	if( stillThisCol ) {
				    	preinst = null;
				    	//var xma = xNext - ache;
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_"  + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						preinst = " " + aye + "<sup>2</sup> - ";
						sufinst = " = ";
						if( ache !== 0 ) {
							oldBxs = 1;
						}
						newBxs = doc.getElementsByClassName("dBx");					
						fcsBx = doc.getElementById("d" + colnum + "_0");
					}
			    	break;
			    case "d":
					expAns = bee*bee - (xval - ache)*(xval - ache);
					if( stillThisCol ) {
						preinst = currpre.innerHTML;
						sufinst = " = ";
						fcsBx = doc.getElementById(step + colnum + "_"  + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						preinst = sgn + "&#x221A"; // sqrt
						sufinst = " = ";
						oldBxs = 1;
						if( kay !== 0 ) {
							newBxs = doc.getElementsByClassName("rBx");
							fcsBx = doc.getElementById("r" + colnum + "_0");
						} else {
							fcsBx = doc.getElementById("y" + colnum + "_0"); // do you need to look it up or is it global? fixit
						}	
					}
			    	break;
			    case "r":
			    	expAns = sn*Math.sqrt(bee*bee - (xval - ache)*(xval - ache));
			    	if( stillThisCol ) {
				    	preinst = sgn + "&#x221A"; // sqrt
						sufinst = " = ";
						fcsBx = doc.getElementById(step + colnum + "_"  + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						var sin = " + ";
						var absk = kay;
						if( kay < 1 ) {
							sin = " - ";
							absk = -kay;
						}
						sufinst = sin + absk + " = ";
						oldBxs = 1;
						fcsBx = doc.getElementById("y" + colnum + "_0");					
					}
			    	break;
			    default:
			    	expAns = num(doc.getElementById("h" + rowno).value);
			    	if( stillThisCol ) {
			    		if( kay === 0 ) {
				    		preinst = sgn + "&#x221A"; // sqrt
				    	}
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_"  + nextro);
					} else {
						oldBxs = 1;
						fcsBx = null;
					}
			    	break;
			}
		} else if( isEllipse ) {
			switch( step ) {
				case "m":
					expAns = xval - ache;
					if( stillThisCol ) {
						preinst = null;
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						if( aye !== 1 ) {
							newBxs = doc.getElementsByClassName("tBx");
							sufinst = " / " + aye + " = "; // divide
							fcsBx = doc.getElementById("t" + colnum + "_0");
						} else {
							newBxs = doc.getElementsByClassName("sBx");
							sufinst = " <sup>2</sup> = "; // squared
							fcsBx = doc.getElementById("s" + colnum + "_0")
						}
					}
			    	break;
			    case "t":
			    	expAns = (xval - ache)/aye;
			    	if( stillThisCol ) {
				    	preinst = null;
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						sufinst = " <sup>2</sup> = "; // squared
						newBxs = doc.getElementsByClassName("sBx");
						if( ache !== 0 ) {
							oldBxs = 1;
						}
						fcsBx = doc.getElementById("s" + colnum + "_0");
					}
			    	break;
			    case "s":
			    	expAns = (xval - ache)*(xval - ache)/(aye*aye);
			    	if( stillThisCol ) {
				    	preinst = null;
				    	//var xma = (xNext - ache)/aye;
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						preinst = " 1 - ";
						sufinst = " = ";
						oldBxs = 1;
						newBxs = doc.getElementsByClassName("dBx");
						fcsBx = doc.getElementById("d" + colnum + "_0");
					}
			    	break;
			    case "d":
			    	expAns = 1 - (xval - ache)*(xval - ache)/(aye*aye);
			    	if( stillThisCol ) {
				    	preinst = currpre.innerHTML;;
						sufinst = " = ";
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						sgn = " ";
						yval = num(doc.getElementById("h0").value);
						if( yval < kay ) {
							sgn = " -";
						}
						preinst = sgn + "&#x221A"; // sqrt
						sufinst = " = ";
						oldBxs = 1;
						if( bee == 1 && kay == 0 ) {	
							fcsBx = doc.getElementById("y" + colnum + "_0");
						} else { 							
							newBxs = doc.getElementsByClassName("rBx");
							fcsBx = doc.getElementById("r" + colnum + "_0");
						}	
					}
			    	break;
			     case "r":
			    	expAns = sn*Math.sqrt(1 - (xval - ache)*(xval - ache)/(aye*aye));
			    	if( stillThisCol ) {
				    	preinst = sgn + "&#x221A"; // sqrt
						sufinst = " = ";
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						preinst = null;
						sufinst = " &#xd7 " + bee + " = "; // times
						oldBxs = 1;
						if( kay == 0 || bee == 1 ) {
							if( bee == 1 ) {
								if( kay < 0 ) {
									sufinst = " + (" + kay + ") = ";
								} else {
									sufinst = " + " + kay + " = ";
								}
							}
							fcsBx = doc.getElementById("y" + colnum + "_0");
						} else {							
							newBxs = doc.getElementsByClassName("nBx");
							fcsBx = doc.getElementById("n" + colnum + "_0"); // may have a problem with assumptions that n0 is line
							// definition of n0 fixit
						}	
					}
			    	break;
			    case "n":
					expAns = sn*bee*Math.sqrt(1 - (xval - ache)*(xval - ache)/(aye*aye));
					if( stillThisCol ) {
						preinst = null;
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						if( kay < 0 ) {
							sufinst = " + (" + kay + ") = ";
						} else {		
							sufinst = " + " + kay + " = ";
						}
						oldBxs = 1;
						fcsBx = doc.getElementById("y" + colnum + "_0");
					}
			    	break;
			    default:
			    	expAns = num(doc.getElementById("h" + rowno).value);
			    	if( stillThisCol ) {
			    		if( kay === 0 && bee === 1 ) {
				    		preinst = sgn + "&#x221A"; // sqrt
				    	}
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						fcsBx = null;
					}
			    	break;
			}
		} else if( isParabola ) {
			switch( step ) {
				case "m":
					expAns = xval - ache;
					if( stillThisCol ) {
						preinst = null;
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);						
						sufinst = " <sup>2</sup> = "; // squared
						if( kay === 0 && aye === 8 ) {
							//newBxs = doc.getElementsByClassName("yBx");
							fcsBx = doc.getElementById("y" + colnum + "_0");
							//alert("newBx: yBx");
						} else {
							newBxs = doc.getElementsByClassName("sBx");
							fcsBx = doc.getElementById("s" + colnum + "_0");
						}
					}
			    	break;
			    case "s":
			    	expAns = (xval - ache)*(xval - ache);
			    	if( stillThisCol ) {
				    	preinst = null;
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						sufinst = " = ";
						oldBxs = 1;
						if( kay === 0 || aye === 8 ) {						
							if( kay < 0 ) {
								if( bee%2 === 1 ) {
									preinst = " -";
								}
								sufinst = " + (" + kay + ") = ";
							} else if( kay > 0 ) {
								if( bee%2 === 1 ) {
									preinst = " -";
								}	
								sufinst = " + " + kay + " = ";
							} else {
								var dnm = aye/8;
								if( bee%2 === 1 ) {
									sufinst = " / (-" + dnm + ") = "; // divide
								} else {
									sufinst = " / " + dnm + " = "; // divide
								}
							}
							fcsBx = doc.getElementById("y" + colnum + "_0");
						} else {
							newBxs = doc.getElementsByClassName("tBx");
							var dnm = aye/8;
							if( bee%2 === 1 ) {
								sufinst = " / (-" + dnm + ") = "; // divide
							} else {
								sufinst = " / " + dnm + " = "; // divide
							}
							fcsBx = doc.getElementById("t" + colnum + "_0");
						}
					}
			    	break;
			    case "t":
			    	sn = bee%2 === 1? -1: 1;
			    	expAns = sn*8*(xval - ache)*(xval - ache)/aye;
			    	if( stillThisCol ) {
				    	preinst = currpre.innerHTML;
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						oldBxs = 1;
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						if( kay < 0 ) {
							sufinst = " + (" + kay + ") = ";
						} else {		
							sufinst = " + " + kay + " = ";
						}
						//newBxs = doc.getElementsByClassName("yBx");
						if( ache !== 0 ) {
							oldBxs = 1;
						}
						//doc.getElementById("statusBox0").innerHTML = "nextBx: y" + colnum + "_0";
						fcsBx = doc.getElementById("y" + colnum + "_0");
					}
			    	break;
			    default:
			    	expAns = num(doc.getElementById("h" + rowno).value);
			    	if( stillThisCol ) {
			    		preinst = currpre.innerHTML;
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						fcsBx = null;
					}
			    	break;
			}
		} else if( isHyperbola ) {
			switch( step ) {
				case "m":
					expAns = xval - ache;
					if( stillThisCol ) {
						preinst = null;
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						newBxs = doc.getElementsByClassName("sBx");
						sufinst = " <sup>2</sup> = "; // squared
						fcsBx = doc.getElementById("s" + colnum + "_0")
					}
			    	break;
			    case "s":
			    	expAns = (xval - ache)*(xval - ache);
			    	if( stillThisCol ) {
				    	preinst = null;
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						oldBxs = 1;
						if( aye !== 1 ) {
							newBxs = doc.getElementsByClassName("tBx");
							fcsBx = doc.getElementById("t" + colnum + "_0");
							sufinst = " / " + aye + " = ";
						} else {
							newBxs = doc.getElementsByClassName("dBx");
							fcsBx = doc.getElementById("d" + colnum + "_0");
							if( oh === 0 ) {
								sufinst = " - 1 = ";
							} else {
								sufinst = " + 1 = ";
							}
						}
					}
			    	break;
			    case "t":
			    	expAns = (xval - ache)*(xval - ache)/aye;
			    	if( stillThisCol ) {
				    	preinst = null;
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						colnum = precol + 1;
						nextsuf = doc.getElementById("c0_" + colnum);
						nextpre = doc.getElementById("c0_" + precol); // needed? fixit
						oldBxs = 1;
						newBxs = doc.getElementsByClassName("dBx");
						fcsBx = doc.getElementById("d" + colnum + "_0");
						if( oh === 0 ) {
							sufinst = " - 1 = ";
						} else {
							sufinst = " + 1 = ";
						}
					}
			    	break;
			    case "d":
			    	expAns = (xval - ache)*(xval - ache)/aye;
			    	if( oh === 0 ) {
			    		expAns -= 1;
			    	} else {
			    		expAns += 1;
			    	}
			    	if( stillThisCol ) {
				    	//preinst = currpre.innerHTML;
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						sgn = " ";
						yval = num(doc.getElementById("h0").value);
						if( yval < kay ) {
							sgn = " -";
						}
						preinst = sgn + "&#x221A <span class='oline'>" + bee + "</span>&#xd7 &#x221A"; // sqrt x sqrt
						sufinst = " = ";
						oldBxs = 1;
						if( kay == 0 ) {	
							fcsBx = doc.getElementById("y" + colnum + "_0");
						} else { 							
							newBxs = doc.getElementsByClassName("nBx");
							fcsBx = doc.getElementById("n" + colnum + "_0");
						}	
					}
			    	break;
			    case "n":
			    	if( oh === 0 ) {
						expAns = sn*Math.sqrt(bee*((xval - ache)*(xval - ache)/aye - 1));
					} else {
						expAns = sn*Math.sqrt(bee*((xval - ache)*(xval - ache)/aye + 1));
					}
					if( stillThisCol ) {
						preinst = sgn + "&#x221A <span class='oline'>" + bee + "</span>&#xd7 &#x221A"; // sqrt x sqrt
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						colnum = precol + 1;
						nextpre = doc.getElementById("c0_" + precol);
						nextsuf = doc.getElementById("c0_" + colnum);
						if( kay < 0 ) {
							sufinst = " + (" + kay + ") = ";
						} else {		
							sufinst = " + " + kay + " = ";
						}
						oldBxs = 1;
						fcsBx = doc.getElementById("y" + colnum + "_0");
					}
			    	break;
			    default:
			    	expAns = num(doc.getElementById("h" + rowno).value);
			    	if( stillThisCol ) {
			    		if( kay === 0 ) {
				    		preinst = sgn + "&#x221A <span class='oline'>" + bee + "</span>&#xd7  &#x221A"; // sqrt x sqrt
				    	}
						sufinst = currsuf.innerHTML;
						fcsBx = doc.getElementById(step + colnum + "_" + nextro);
					} else {
						fcsBx = null;
					}
			    	break;
			}
		}
		
		if( num(ansBx.value) === expAns ) {		
			errBx.innerHTML = "";
			currpre.innerHTML = "";
			if( preinst ) {			
				nextpre.innerHTML = preinst;
			}
			currsuf.innerHTML = "";
			if( sufinst ) {	
				nextsuf.innerHTML = sufinst;
			}
			if( oldBxs ) {
				adj += 1;
				//doc.getElementById("statusBox1").innerHTML = "oldBxs: " + oldBxs + " adj: " + adj;
				var oldcols = doc.getElementsByClassName("l" + prevcol);
				var len = oldcols.length;
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
			}
			if( newBxs ) {
				var len = newBxs.length;
				for( var i = 0; i < len; ++i ) {
					newBxs[i].type = "text";
				}
				var hdr = doc.getElementById("q" + colnum);
				hdr.classList.add("wide");
				hdr.innerHTML = doc.getElementById("i" + colnum).value;
				var colBxs = doc.getElementsByClassName("i" + colnum);
				var nClrs = 4; // copied from jsp
				len = colBxs.length-1;			
				for( var i = 0; i < len; ++i ) {
					var clr = "c" + i%nClrs;
					colBxs[i+1].classList.add(clr);
				}
			}
			len = whatrow.length;
			for( var i = 0; i < len; ++i ) {
				whatrow[i].classList.remove("hilite");
			}
			whatrow = doc.getElementsByClassName("r" + nextro);
			len = whatrow.length;
			var strthi = colnum-1-adj;
			var stphi = colnum + 1 - adj;
			//doc.getElementById("statusBox0").innerHTML = "whatrowlen: " + len + " strthi: " + strthi + " stphi: " + stphi;
			for( var i = strthi; i < stphi; ++i ) {
				whatrow[i].classList.add("hilite");
			}
			if( fcsBx ) {
				fcsBx.focus();
			} else {
				ansBx.blur();
				// no focus Box, you're at Y delete intermediate columns
				// and prompt to click
				var ypts = doc.getElementsByClassName("ypts");
				var len = ypts.length;
				tblFilld = true;
				for( var i = 0; i < len; ++i ) {
					if( ypts[i].value === "") {
						tblFilld = false;
					}
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
				whatrow = doc.getElementsByClassName("r0");
				len = whatrow.length;
				for( var i = 0; i < len; ++i ) {
					whatrow[i].classList.add("hilite");
				}
			}
		} else {
			errBx.innerHTML = "Should be " + expAns;
			ansBx.classList.add("err");
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
		var expXBx = doc.getElementById("x" + nextI);
		var expYBx = doc.getElementById("h" + nextI);
		var nomX;
		var nomY;
		if( yIsDepVar ) {
			nomX = expXBx.innerHTML;
			nomY = expYBx.value;
			//doc.getElementById("statusBox0").innerHTML = "yisdepvar nomX: " + nomX + " nomY: " + nomY;
		} else {
			nomX = expYBx.value;
			nomY = expXBx.innerHTML;
			//doc.getElementById("statusBox0").innerHTML = "xisdepvar nomX: " + nomX + " nomY: " + nomY;
		}
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
	id = "whichparam5_" + cls;
	par5 = doc.getElementById(id).value;
	var gridspace = 20;
	var xstart = -10;
	var xstop = 10;
	var lw = 150;
	var ymax;
	var ymin;
	var hitsrightedge = true;
	// remove remnants of showclick
	var hbar = doc.getElementsByClassName("hbar");
	var len = hbar.length;
	for( var i = len - 1; i >= 0; --i  ) {
		var parent = hbar[i].parentNode;
		parent.removeChild(hbar[i]);
	}
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
	var inc = 0.05;
	if( isLine ) {
		var intercept = num(par3);
		var rise = num(par1);
		var run = num(par2);
		var slope;
		if( run !== 0 ) {
			slope = rise/run;		
			var ystart = slope*xstart + intercept;
			var ystop = slope*xstop + intercept;
	
			// re-create equation
			var intermed = "";
			var rest = "";
			var absrise = mat.abs(rise);
			if( absrise !== 0 ) {
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
				intermed += "X";
				if( intercept > 0 ) {
					rest = " + ";	
				}
			}
		   	
			if( intercept != 0 ) {
				if( intercept < 0 ) {
				    rest = " - ";
				}
			    rest += Math.abs(intercept);
			} else {
				if( intermed === "" ) {
					rest = 0;
				}
			}
			cap.innerHTML = "Y = " + intermed + rest;
		} else {
			// vertical line x = b
			ystart = -10;
			ystop = 10;
			xstart = intercept;
			xstop = intercept;
			var absB = mat.abs(intercept);
			var rest = intercept < 0? " - " + absB : " + " + absB;
			cap.innerHTML = "X =" + rest; 
			hitsrightedge = false;
			ymax = ystop;
			nmaxes += 1;
		}
		
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
		drawLine( xstart, ystart, xstop, ystop, 3, colors[cls], null );
		
	} else if( isCircle || isEllipse || isParabola || isHyperbola ) {
		var htmseg = '<polyline points=" ';
		var h = num(par2);
		var k = num(par3);
		var a = num(par1);
		var b = num(par4);
		var lowx = h - a;
		var uprx = a + h;
		if( isParabola || isHyperbola ) {
			lowx = -10;
			uprx = 10;
		}
		if( isParabola ) {
			var sign = b%2 === 1? -1 : 1;
			if( b < 2 ) {
				for( var xp = lowx; xp <= uprx; xp += inc ) {
					var yp = k + sign*8*(xp - h)*(xp - h)/a;
					var px = halfwidth + mat.round(xp*gridspace);
					var py = halfwidth - mat.round(yp*gridspace);
					htmseg += px + ', ' + py + ' ';
				}
			} else {
				for( var yp = lowx; yp <= uprx; yp -= inc ) {
					var xp = k + sign*8*(yp - h)*(yp - h)/a;
					var px = halfwidth + mat.round(xp*gridspace);
					var py = halfwidth - mat.round(yp*gridspace);
					htmseg += px + ', ' + py + ' ';
				}
			}
		} else { // Circle, Ellipse or Hyperbola
			var breakNoted = false;
			for( var xp = lowx; xp <= uprx; xp += inc ) {
				var yp;
				if( isHyperbola ) {
					if( (xp - h)*(xp - h)/a >= 1 || par5 === "1") {
						yp = par5 === "0"? 
							k + mat.sqrt(b*( (xp - h)*(xp - h)/a - 1 )):
							k + mat.sqrt(b*( (xp - h)*(xp - h)/a + 1 ));
						var t1 = (xp - h)*(xp - h)/a;
						var t2 = ( (xp - h)*(xp - h)/a - 1 );
						var t3 = b*( (xp - h)*(xp - h)/a - 1);
						var t4 = mat.sqrt(b*( (xp - h)*(xp - h)/a - 1 ));
						var t5 = k + mat.sqrt(b*( (xp - h)*(xp - h)/a - 1 ));
						//alert("(x/a)^2: " + t1);
						//alert("(x/a)^2-1: " + t2);
						//alert("b^2((x/a)^2-1): " + t3);
						//alert("sqrt(b^2((x/a)^2-1): " + t4);
						//alert("k: " + k);
						//alert("k + sqrt(b^2((x/a)^2-1): " + t5);
						//alert("xp: " + xp + " yp: " + yp);
						var px = halfwidth + mat.round(xp*gridspace);
						var py = halfwidth - mat.round(yp*gridspace);
						htmseg += px + ', ' + py + ' ';
					} else if( !breakNoted ) {
						breakNoted = true;
						htmseg += '" style="stroke:' + colors[cls];
						htmseg += ';stroke-width:2; fill:none';
						htmseg += ';" />';
						xygraph.innerHTML += htmseg;
						htmseg = '<polyline points=" ';
					}
				} else {
					yp = k + b*mat.sqrt( 1 - (xp - h)*(xp - h)/(a*a));
					var px = halfwidth + mat.round(xp*gridspace);
					var py = halfwidth - mat.round(yp*gridspace);
					htmseg += px + ', ' + py + ' ';
				}
			}
			breakNoted = false;
			for( var xp = uprx; xp >= lowx; xp -= inc) {
				var yp = k - b*mat.sqrt( 1 - (xp - h)*(xp - h)/(a*a));
				if( isHyperbola ) {
					if( (xp - h)*(xp - h)/a >= 1 || par5 === "1" ) {
						yp = par5 === "0"? 
							k - mat.sqrt(b*( (xp - h)*(xp - h)/a - 1 )):
							k - mat.sqrt(b*( (xp - h)*(xp - h)/a + 1 ));
						//alert("xp: " + xp + " yp: " + yp);
						var px = halfwidth + mat.round(xp*gridspace);
						var py = halfwidth - mat.round(yp*gridspace);
						var newseg = px + ', ' + py + ' '; 
						htmseg += newseg;
					} else if( !breakNoted ) {
						breakNoted = true;
						htmseg += '" style="stroke:' + colors[cls];
						htmseg += ';stroke-width:2; fill:none';
						htmseg += ';" />';
						xygraph.innerHTML += htmseg;
						htmseg = '<polyline points=" ';
					}
				} else {	
					var px = halfwidth + mat.round(xp*gridspace);
					var py = halfwidth - mat.round(yp*gridspace);
					var newseg = px + ', ' + py + ' '; 
					htmseg += newseg;
				}
				//doc.getElementById("statusBox" + pdx).innerHTML = "xp: " + xp + " yp: " + yp + " newseg: " + newseg;
				//pdx = (pdx + 1)%(maxbx-1);
			}
		}
		htmseg += '" style="stroke:' + colors[cls];
		htmseg += ';stroke-width:2; fill:none';
		htmseg += ';" />';
		xygraph.innerHTML += htmseg;
		var xcent = "X";
		var ycent = "Y";
		if( isCircle || isEllipse || isHyperbola || b < 2 ) {
			if( h < 0 ) {
				xcent = "( X" + "+" + mat.abs(h) + " )";
			} else if ( h > 0 ) {
				xcent = "( X" + "-" + mat.abs(h) + " )";
			}		
			if( k < 0 ) {
				ycent = "( Y" + "+" + mat.abs(k) + " )";
			} else if ( k > 0 ) {
				ycent = "( Y" + "-" + mat.abs(k) + " )";
			}
		} else if( (isParabola )  && (b > 1) ) { // x is dependent variable
			if( h < 0 ) {
				xcent = "( Y" + "+" + mat.abs(h) + " )";
			} else if ( h > 0 ) {
				xcent = "( Y" + "-" + mat.abs(h) + " )";
			} else {
				xcent = "Y";
			}
			if( k < 0 ) {
				ycent = "( X" + "+" + mat.abs(k) + " )";
			} else if ( k > 0 ) {
				ycent = "( X" + "-" + mat.abs(k) + " )";
			} else {
				ycent = "X";
			}
		}
		var rst = "";
		if( isCircle ) {
			rst = xcent + "<sup>2</sup> + " + ycent + "<sup>2</sup> = " + a + "<sup>2</sup>";
		} else if( isEllipse ) {
			rst = "( " + xcent + "/" + a + " )" +  "<sup>2</sup> + ";
			rst += "( " + ycent + "/" + b + " )" +  "<sup>2</sup> = 1";
		} else if( isParabola ) {
			var indvar = xcent;
			var depvar = ycent;

			rst = indvar +  "<sup>2</sup> = ";
			if( b%2 === 1 ) {
				rst += "-";
			}
			var nm = "";
			var dnm = 32;
			var n = num(par1);
			while( dnm%2 == 0 && n%2 == 0 ) {
				n /= 2;
				dnm /= 2;
			}		
			nm = n;
			if( dnm != 1 ) {
				nm += "/" + dnm;
			}
			rst += "4" + "(" + nm + ")" + depvar;
		} else if( isHyperbola ) {
			if( par5 == "0" ) {
				rst = "( " + xcent + "/" + a + " )" +  "<sup>2</sup> - ";
				rst += "( " + ycent + "/" + b + " )" +  "<sup>2</sup> = 1";
			} else {
				rst = "( " + ycent + "/" + b + " )" +  "<sup>2</sup> -";
				rst += "( " + xcent + "/" + a + " )" +  "<sup>2</sup> = 1";
			}		
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
	var par1 = num(doc.getElementById(id).value);
	id = "whichparam2_" + which;
	var par2 = num(doc.getElementById(id).value);
	id = "whichparam3_" + which;
	var par3 = num(doc.getElementById(id).value);
	id = "whichparam4_" + which;
	var par4 = num(doc.getElementById(id).value);
	id = "whichparam5_" + which;
	var test = doc.getElementById(id).value;
	if( test ) {
		oh = num(test);
	}
	var xBxs = doc.getElementsByClassName("xpts");
	plen = xBxs.length;
	var xp;
	var sign = "";
		
	for( var i = 0; i < plen; ++i ) {
		//read 
		if( yIsDepVar ) {
			xp = num(xBxs[i].innerHTML);
			yvals[i] = num(doc.getElementById("h" + i).value);
		} else {
			xp = num(doc.getElementById("h" + i).value);
			yvals[i] = num(xBxs[i].innerHTML);
		}
		// and convert into position on page
		xpts[i] = xygraphleft + halfwidth + xp*pxlsprsq;
		ypts[i] = xygraphtop + halfwidth - yvals[i]*pxlsprsq;
		captured[i] = false;
	}
	
	// set global variables for intermediate instructions 
	if( isLine ) {
		var intercept = par3;
		if( yIsDepVar ) {
			var rise = par1;
			var run = par2;
			
			if( intercept > 0 ) {
				op = "+";
			}
		
			if( rise*run < 0 ) {
			  	sign = "-";
				nsign = -1;
			 }
			mult = mat.abs(rise);
			div = mat.abs(run);
		}
		if( intercept < 0 ) {
			op = "-";
		}
		bee = mat.abs(intercept);
	
		if( rise*run < 0 ) {
			sign = "-";
			nsign = -1;
		}
		mult = mat.abs(rise);
		div = mat.abs(run);
	} else if( isCircle || isEllipse || isParabola || isHyperbola ) {
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
	isParabola = curvetype === "Parabola";
	isHyperbola = curvetype === "Hyperbola";
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
		yIsDepVar = doc.getElementById("indvar").innerHTML === "X";
		//doc.getElementById("statusBox1").innerHTML = "yIsDepVar: " + yIsDepVar;	
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
				whatrow = doc.getElementsByClassName("r" + i);
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
		  	n0 = doc.getElementById("n1_0");
		  	t0 = doc.getElementById("t1_0");		  	
			var col1 = doc.getElementById("c0_1");
		  			
		  	if( !n0 && !t0 ) {
		  		if( yIsDepVar ) {
			  		col0.innerHTML = sign;
					if( bee !== 0 && mult !== 0 ) {
						col1.innerHTML = op + " " + bee + " = ";
					} else if( mult != 1 && mult !== 0 ) {
						col1.innerHTML = " &#xd7 " + mult + " = "; // times
					} else if( div != 1) {
						col1.innerHTML = " / " + div + " = "; // divided by
					} else if( mult === div ) {
						col1.innerHTML = " = ";
					} else if( mult === 0 ) { // y = intercept
						tblFilld = true;
						doc.getElementById("c-1_0").innerHTML = "Click this";
						col0.innerHTML = "point &#x2192;"; // right arrow
						doc.getElementById("instrs").innerHTML = "";
					}
				} else { // x = intercept
					tblFilld = true;
					doc.getElementById("c-1_0").innerHTML = "Click this";
					col0.innerHTML = "point &#x2192;"; // right arrow
					doc.getElementById("instrs").innerHTML = "";
					
					//col1.innerHTML = "   " + op + bee + " = ";
				}
				var y0 = doc.getElementById("y1_0");
				if( y0 ) {
		  			y0.focus();
		  		}
		  	} else {	  		
				x0val = num(doc.getElementById("x0").innerHTML);  		  	
			  	if( t0 ) {
			  		n0 = doc.getElementById("n2_0");
				  	if( x0val !== 0 ) {
				  		col0.innerHTML = sign;
				  	}
				  	col1.innerHTML = " / " + div + " = "; // divided by
			  		t0.focus();  		
			  	} else {
			  		col1.innerHTML = " &#xd7 " + sign + mult + " = "; // times
			  		n0.focus();
			  	}
		  	}
		} else if( isCircle || isEllipse || isParabola || isHyperbola ) {
			tblFilld = true;
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
				whatrow = doc.getElementsByClassName("r" + i);
				len = whatrow.length - 1;
				whatrow[0].classList.add(clr);
				whatrow[1].classList.add(clr);
				whatrow[len].classList.add(clr);
			}
			// copy hidden input to 2nd heading column
			doc.getElementById("q1").innerHTML = doc.getElementById("i1").value;
			var col1 = doc.getElementById("c0_1");
			var x0st = doc.getElementById("x0").innerHTML;
			x0val = num(x0st);
			var nputBxs = doc.getElementsByClassName("ypts");
			len = nputBxs.length;
		  	for( var i = 0; i < len; ++i ) {
			  	nputBxs[i].type = "text";
			}
			var frstBxs;
			var fcsBx;
			if( ache !== 0 ) {	// minus the offset first	
				var sin = " - ";
				var xOffs = ache;
				if( ache < 0 ) {
					xOffs = -ache;
					sin = " + ";
				}
				col1.innerHTML = sin + xOffs + " = ";
				fcsBx = doc.getElementById("m1_0");
				frstBxs = doc.getElementsByClassName("mBx");
			} else {
				if( isCircle || isHyperbola || aye === 1 ) { // no offset and either circle or ellipse with xradius 1, so 	
					col1.innerHTML = " <sup>2</sup> = "; // go ahead and square	
					fcsBx = doc.getElementById("s1_0");
					frstBxs = doc.getElementsByClassName("sBx");
				} else if( isEllipse ) { // ellipse divide by xradius first
					col1.innerHTML = " / " + aye + " = "; // divide
					fcsBx = doc.getElementById("t1_0")
					frstBxs = doc.getElementsByClassName("tBx");
				} else if( isParabola ) {
					col1.innerHTML = " <sup>2</sup> = ";
					fcsBx = doc.getElementById("s1_0")
					frstBxs = doc.getElementsByClassName("sBx");
				}
			}
			len = frstBxs.length;
			for( var i = 0; i < len; ++i ) {
				frstBxs[i].type = "text";
			}
			if( fcsBx ) {
				fcsBx.focus();
			}
		}

		
		// draw all the curves generated to date in this set
		nmins = 0;
		nmaxes = 0;
		for( var i = 0; i < whichcurve; i += 1 ) {
			drawCurve( i );
		}
		whatrow = doc.getElementsByClassName("r0");
		for( var i = 0; i < 2; ++i ) {
			whatrow[i].classList.add("hilite");
		}
	}
}