/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var whatHints = 'FactorsHints.html';
var allprimes = [    2,  3,  5,  7, 11, 
                    13, 17, 19, 23, 29, 
                    31, 37, 41, 43, 47, 
                    53, 59, 61, 67, 71, 
                    73, 79, 83, 89, 97 ];
var redXpos;
var redYpos;
var magentaXpos;
var magentaYpos;
var whiteXpos;
var whiteYpos;
var yellowXpos;
var yellowYPos;
var blueXpos;
var cyanXpos;
var cyanYpos;
var greenXpos;
var greenYpos;
var redCenterX;
var redCenterY;
var blueCenterX;
var blueCenterY;
var greenCenterX;
var greenCenterY;
var radius;
var prevTop = 0;
var prevLeft = 0;
// variables for multiplying out factors
var gfactors;
var gindexes = new Array();
var gprod = 1;
var gans = -1;
var gmdx = 0;
var fmdx = 0;
var cdx = 0;
var glen = 0;
var lastPos = 0;
var doingMults = true;
var gYdiff = 0;
var gImageWidth = 0;
var gImageHeight = 0;
var isTrue = true;
var indicator = 0;
var instr0txt;
var instr1txt;
var instr2txt;
var gPutHere = 0;
var gNfactors = 0;
var firstUp = false;
var gFansWid = 80;
var gLeftPos = 0;
var completedSet = false;

//  "oc delete all --all" from command line removes entire application
//  so you can upload a new one
//  delete build directory and distribution directory, rebuild practice.war
//  clear the browser cache if you want the openshift version to work
//  
// perhaps change onkeyup or onkeydown to eliminate typing 2 digits in one 
// product box.  fixit
// 
// started to drag 2 to blue but put it off until last, now it won't let me;
// wants me to multiply sections
// 
// it's possible to type in onewide boxes and get a false error message for a T/F question fixit
//
// dragging boxes to paper zeroes out onewides without actually clearing them fixit
// 
// box dragged for a TorF question disappeared for all time fixit
// 
// final multiplication answers should not be draggable, hide it with a draggable
// input and put another input over the rest of the sections as well. put ones in
// in the sections that don't have any other factors. it's confusing when you
// can't see the numbers in the sections any more. leave a ghost fixit
// 
// after entering a bad answer on intermediate mult0 on paper, keeps giving
// bizarre error messages, expected answers and suposed given answers that never existed
// 
// inputs can be edited or they cannot be dragged. need to create something that
// looks like an input but is not fixit
//   
// add a note somewhere: computer doesn't judge. It will tell you if you have an
// incorrect answer, but don't take it personally, it's a machine, it doesn't 
// look up to you or down on you, it's a tool (wrench) to help you learn. (Judge and
// machine illustration) Sometimes the 
// computer will be wrong or doesn't make it clear what needs to be done or how 
// to do it; that's the programmer's fault. Write her and hopefully she will fix 
// it so no one has to deal with that aggravation. The computer doesn't care if you count 
// on your fingers, guess, use your calculator or a piece of scrap paper. You 
// may get to the point it's faster not to. It doesn't care if you take your sweet
// time and think the problem through, although it is highly recommended you take
// your sweet time and think the problem through. It doesn't care if you skip problems.
// It doesn't care if you try a problem that looks too hard. Maybe it's not?
// Why not find out? It doesn't care if you take shortcuts. You are encouraged
// to look for them. You are also encouraged to understand why the work.
// It doesn't care if you're fast or 
// slow, it's a tool that hopefully will help you get faster  and more accurate.
// If you like, set a goal for accuracy or speed and print screen every 
// day when you are done with an exercise so you can track how you're doing. 
// Share your results with someone who loves you and wants you to get the most 
// out of life (fridge covered with screen prints, graph with upward trend
// happy parent, grandparent proud but dignified student)
//
// message to the manager button with screenshot (miffed client)
//
// directions: same order, start with lowest except for 7, divide by 3 and 11 rules
// multiply by 11 rule, drag highest numbers first, talk like olden times 'four and twenty'
// bored sheep reading long page of fine print

var NQUES = 17; // assumes all three operands are perfect squares
var alreadyasked = new Array(NQUES);

var x = 0;
var nSbxs = 24;
var noMoreStpdQstns = false;

function askSqrt( val, root ) {
    var doc = document;

    doc.getElementById("finstr0").innerHTML = "What is the square root of " + val + "?";
    doc.getElementById("finstr1").style.color = "white";
    gprod = root;
}
function blank() {
    var allBoxes = document.getElementById("fans").childNodes[0].childNodes;//document.getElementsByClassName("onewide");
    var l = allBoxes.length;
    var leasDig = l - 1;
    for( var i = 0; i < l; ++i ) {
        var whatBx = allBoxes[i].childNodes[0];
        whatBx.value = "";
        whatBx.disable = false;
        whatBx.style.color = "#0c2a5a";
        whatBx.style.backgroundColor = "#e2eeeb";
        if( i === leasDig ) {
            whatBx.focus();
        }
    }
}
function putBoxesBack() {
    var doc = document;
    var win = window;
    var num = Number;
    var mat = Math;
    //for( x = 0; x < nSbxs; ++x ) {
        //doc.getElementById("statusBox" + x).innerHTML = "";
    //}
    //x = 0;
    //alert("in putboxes back removing bars");
    var paperBars = doc.getElementsByName("paperBar");
    var l = paperBars.length;
    for( var i = 0; i < l; ++i ) {
        var parent = paperBars[0].parentNode;
        parent.removeChild( paperBars[0] );
    }

    var pboxes = doc.getElementsByClassName("ntrmed");
    var l = pboxes.length;
    var start = 0;
    if( pboxes[0].id === "fans" ) {
        start = 1;
    }
    for( var i = start; i < l; ++i ) {
        if( pboxes[start].id !== "fans" ) {
            var parent = pboxes[start].parentNode;
            parent.removeChild( pboxes[start] );
        }
    }
    //alert("in putboxes back removed ntermeds");
    var hgt = num(win.innerHeight);
    gPutHere = 0.95*num(hgt);
    gNfactors = 0;
    gPlaidIdx = 0;
    gNtermedIdx = 0;
    firstUp = true;
    noIntermeds = true;
    boxesDragged = false;
     
    var dBoxes = doc.getElementsByClassName("dragBox");
    l = dBoxes.length;
    for( var i = 0; i < l; ++i ) {
        var whatBx = dBoxes[i];  
        if( whatBx ) {
            var whatPos = whatBx.getAttribute("moved");
            var displaced = whatPos !== "pos1";
            if( displaced ) {
                var homeLeft = whatBx.getAttribute("backHomeX");
                var homeTop = whatBx.getAttribute("backHomeY");
                var styles = "top: " + homeTop + "px;"
                + "left: " + homeLeft + "px;";
                //var whatCol = Number(whatBx.id.substr(3,4));
                //if( (whatCol+2)%3 === 0 ) { // operands are in columns 1, 4 and 7
                //    styles = styles + "backgroundColor:  #b4c5e2";
                //} // this doesn't work, reverts to element background color
                whatBx.setAttribute("style", styles);
                whatBx.setAttribute("moved", "pos1");
                whatBx.disabled = false;
            }
        }
    }
    doc.getElementById("leasDig").focus();
    return false;
}
function whiteout() {
    var allBoxes = document.getElementById("fans").childNodes[0].childNodes;
    var l = allBoxes.length;
    for( var i = 0; i < l; ++i ) {
        var whatBx = allBoxes[i].childNodes[0];
        whatBx.value = "";
        whatBx.style.backgroundColor = "white";
        whatBx.disable = true;
    }
}
function checkTorF( ev ) {
    ev = ev || window.event;
    var ansBtn = ev.target;
    var doc = document;

    if( ansBtn.id === "True" ) {
	if( isTrue ) {
            alert("Correct. Press 'Enter' to Continue.");
	} else {
            alert("No. Press 'Enter' to Continue.");
            var errs = num(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
	}
    } else {
	if( !isTrue ) {
            alert("Correct. Press 'Enter' to Continue.");
	} else {
            alert("No. Press 'Enter' to Continue.");
            var errs = num(doc.getElementById("errs").value);
            doc.getElementById("errs").value = errs + 1;
	}
    }
    askQuestions();
}
function rmTorF() {
    var doc = document;
    
    var TorF = doc.getElementById("TorF");
    if( TorF ) {
        var parent = TorF.parentNode;
	var allKids = TorF.childNodes;
	var len = allKids.length;
	for( var i = 0; i < len; ++i ) {
	    var whichKid = allKids[0];
            var whichParent = whichKid.parentNode;
	    whichParent.removeChild( whichKid );
	}
        parent.removeChild(TorF);
    }
}
function askTorF( s1, s2 ) {
    var doc = document;
    var mat = Math;
    var num = Number;
    
    var op1 = num(s1);
    var op2 = num(s2);
    var imgWid = gImageWidth;
    var imgHgt = gImageHeight;
    var bWid = 0.125*imgWid;
    var bHgt = .05*imgHgt;
    var bTop = 6*bHgt;
    var bLeft = 0.1875*imgWid;

    doc.activeElement.blur();
    var instruction1 = " is a factor of ";

    var chooseM = 2*mat.random() < 1;
    if( chooseM ) {
        instruction1 = " is a multiple of ";
    }
    instruction1 = op1 + instruction1 + op2;
    isTrue = chooseM? op1%op2 === 0 : op2%op1 === 0;
    var stupidQuestion = (chooseM && (op1 < op2)) || (!chooseM && (op1 > op2));
    if( stupidQuestion ) {
        if( noMoreStpdQstns ) {
            doc.getElementById("leasDig").focus();
            askQuestions();
            return;
        }
        noMoreStpdQstns = true;
    }
    doc.getElementById("finstr0").innerHTML = "True or False:";
    doc.getElementById("finstr1").innerHTML = instruction1;
    
    var frame = doc.getElementById("paperFrame");
    var TorFdiv = doc.createElement("div");
    TorFdiv.id = "TorF";
    var styles = "width: " + imgWid + "px;"
	    + "height: " + bHgt + "px;"
	    + "padding: 0px;"
	    + "position: absolute;"
	    + "top: " + bTop + "px;"
	    + "left: " + 0 + "px;"
	    + "border: none;"
	    + "color: #0c2a5a;";
    TorFdiv.setAttribute("style", styles);

    bTop = 1;
    var tLbl = doc.createElement("label");
    tLbl.innerHTML = "True";
    styles = "color: #0c2a5a;"
	    + "margin: 0px;"
	    + "position: absolute;"
	    + "top: " + bTop + "px;"
	    + "left: " + bLeft + "px;";
    tLbl.setAttribute("style", styles);

    bLeft = bLeft + bWid;
    var tBtn = doc.createElement("input");
    tBtn.setAttribute("type", "radio");
    tBtn.name = "TorF";
    tBtn.value = "True";
    tBtn.id = "True";
    styles = "border: none;"
	    + "margin: 0px;"
	    + "position: absolute;"
	    + "top: " + bTop + "px;"
	    + "left: " + bLeft + "px;";
    tBtn.setAttribute("style", styles);
    tBtn.onclick = checkTorF;
	
    bLeft = bLeft + 2*bWid;
    var fLbl = doc.createElement("label");
    fLbl.innerHTML = "False";
    styles = "color: #0c2a5a;"
	    + "margin: 0px;"
	    + "position: absolute;"
	    + "top: " + bTop + "px;"
	    + "left: " + bLeft + "px;";
    fLbl.setAttribute("style", styles);

    bLeft = bLeft + bWid;
    var fBtn = doc.createElement("input");
    fBtn.setAttribute("type", "radio");
    fBtn.setAttribute("name", "TorF");
    fBtn.setAttribute("value", "False");
    fBtn.setAttribute("id", "False");
    styles = "border: none;"
	    + "margin: 0px;"
	    + "position: absolute;"
	    + "top: " + bTop + "px;"
	    + "left: " + bLeft + "px;";
    fBtn.setAttribute("style", styles);
    fBtn.onclick = checkTorF;

    TorFdiv.appendChild( tLbl );
    TorFdiv.appendChild( tBtn );
    TorFdiv.appendChild( fLbl );
    TorFdiv.appendChild( fBtn );
    frame.appendChild( TorFdiv );
}
function test() {
    alert("button works");
}
function askQuestions() {
    var whichQues;
    var validQues = false;
    var allDone = false;
    var udx = 0;
    var lques = NQUES;
    var doc = document;
    
    rmTorF();
    for( udx = 0; udx < lques; udx++ ) {
        if( !alreadyasked[udx] ) {
            break;
        }
    }
    doc.getElementById("finstr1").style.color = "#0c2a5a";
    if( udx === lques ) {
        //allDone = true;
        // Refresh your browser doesn't work for firefox, still has old values
        doc.getElementById("finstr0").innerHTML = "All Done.";
        doc.getElementById("finstr1").innerHTML = "Click 'Next Set' to go again.";
        doc.getElementById("instr0").style.color = "#3961a2";
        doc.getElementById("instr1").style.color = "#3961a2";
        doc.getElementById("instr2").style.color = "#3961a2";
	whiteout();
        putBoxesBack();
        doc.activeElement.blur();
        completedSet = true;
        // turn this into a restart button
        //<a href="Factors.jsp">Go to Factors page</a>
        // can't see it when I inspect, no errors show in colsole
        /* var restrtbtn = doc.createElement("button");
        //var frame = doc.getElementById("circles");
        //var img = frame.childNodes[0];
        //img.insertBefore(restrtbtn, img.childNodes[0]);
        var styles = "border: 1px solid black;"
            + "backgroundColor: orange;"
	    + "width: 58px;"
	    + "height: 20px;"
	    + "position: absolute;"
	    + "top: 20px;"
	    + "left: 70px;";
	restrtbtn.setAttribute("style", styles);
        restrtbtn.innerHTML = "Go Again";
        restrtbtn.onclick = "javascript:window.location.href='./Multiplier.jsp'";
        //restrtbtn.onclick = test;
        doc.body.appendChild(restrtbtn); */
	return;
    }
    var mat = Math;
    var num = Number;
    var whitefactor = num(doc.getElementById("whitefactor").value);
    var magentafactor = num(doc.getElementById("magentafactor").value);
    var yellowfactor = num(doc.getElementById("yellowfactor").value);
    var cyanfactor = num(doc.getElementById("cyanfactor").value);
    var bluefactor = num(doc.getElementById("bluefactor").value);
    var redfactor = num(doc.getElementById("redfactor").value);
    var greenfactor = num(doc.getElementById("greenfactor").value);
    var expAns = 0;
    
    

    var numAns = false;
    var showTorF = false;

    whichQues = mat.floor(mat.random()*lques);
    while( alreadyasked[whichQues] === true ) {
        whichQues = mat.floor(mat.random()*lques);
    }

    alreadyasked[whichQues] = true;

    validQues = true;

    if( whichQues < 1 ) {
	blank();
        putBoxesBack();
        var inStr0 = "What is the Greatest Common Divisor of ";
        doc.getElementById("finstr0").innerHTML = inStr0;
        var inStr1 = doc.getElementById("g0_1").value;
        inStr1 = inStr1 + " and " + doc.getElementById("g0_4").value;
        doc.getElementById("finstr1").innerHTML = inStr1;
        gprod = magentafactor*whitefactor;
    } else if( whichQues < 2 ) {
	blank();
        putBoxesBack();
        var inStr0 = "What is the Greatest Common Divisor of ";
        doc.getElementById("finstr0").innerHTML = inStr0;
        var inStr1 = doc.getElementById("g0_4").value;
        inStr1 = inStr1 + " and " + doc.getElementById("g0_7").value;
        doc.getElementById("finstr1").innerHTML = inStr1;
        gprod = yellowfactor*whitefactor;
     } else if( whichQues < 3 ) {
	blank();
        putBoxesBack();
        var inStr0 = "What is the Greatest Common Divisor of ";
        doc.getElementById("finstr0").innerHTML = inStr0;
        var inStr1 = doc.getElementById("g0_1").value;
        inStr1 = inStr1 + " and " + doc.getElementById("g0_7").value;
        doc.getElementById("finstr1").innerHTML = inStr1;
        gprod = cyanfactor*whitefactor;
     } else if( whichQues < 4 ) {
	blank();
        putBoxesBack();
        var inStr0 = "What is the Greatest Common Divisor of ";
        doc.getElementById("finstr0").innerHTML = inStr0;
        var inStr1 = doc.getElementById("g0_1").value;
        inStr1 = inStr1 + ", " + doc.getElementById("g0_4").value;
        inStr1 = inStr1 + " and " + doc.getElementById("g0_7").value;
        doc.getElementById("finstr1").innerHTML = inStr1;
        gprod = whitefactor;
     } else if( whichQues < 5 ) {
	blank();
        putBoxesBack();
        var inStr0 = "What is the Lowest Common Multiple of ";
        doc.getElementById("finstr0").innerHTML = inStr0;
        var inStr1 = doc.getElementById("g0_1").value;
        inStr1 = inStr1 + " and " + doc.getElementById("g0_4").value;
        doc.getElementById("finstr1").innerHTML = inStr1;
        expAns = whitefactor*yellowfactor*bluefactor*redfactor;
        gprod = expAns*cyanfactor*magentafactor;
     } else if( whichQues < 6 ) {
	blank();
        putBoxesBack();
        var inStr0 = "What is the Lowest Common Multiple of ";
        doc.getElementById("finstr0").innerHTML = inStr0;
        var inStr1 = doc.getElementById("g0_4").value;
        inStr1 = inStr1 + " and " + doc.getElementById("g0_7").value;
        doc.getElementById("finstr1").innerHTML = inStr1;
        expAns = whitefactor*yellowfactor*greenfactor*redfactor;
        gprod = expAns*cyanfactor*magentafactor;
     } else if( whichQues < 7 ) {
	blank();
        putBoxesBack();
        var inStr0 = "What is the Lowest Common Multiple of ";
        doc.getElementById("finstr0").innerHTML = inStr0;
        var inStr1 = doc.getElementById("g0_1").value;
        inStr1 = inStr1 + " and " + doc.getElementById("g0_7").value;
        doc.getElementById("finstr1").innerHTML = inStr1;
        expAns = whitefactor*cyanfactor*bluefactor*greenfactor;
        gprod = expAns*yellowfactor*magentafactor;
     } else if( whichQues < 8 ) {
	blank();
        putBoxesBack();
        var inStr0 = "What is the Lowest Common Multiple of ";
        doc.getElementById("finstr0").innerHTML = inStr0;
        var inStr1 = doc.getElementById("g0_1").value;
        inStr1 = inStr1 + ", " + doc.getElementById("g0_4").value;
        inStr1 = inStr1 + " and " + doc.getElementById("g0_7").value;
        doc.getElementById("finstr1").innerHTML = inStr1;
        expAns = whitefactor*yellowfactor*greenfactor*redfactor;
        gprod = expAns*cyanfactor*magentafactor*bluefactor;
     } else {
	 whiteout();
         putBoxesBack();
         if( whichQues < 9 ) {
            validQues = askTorF( doc.getElementById("g0_1").value, doc.getElementById("g0_4").value );
         } else if( whichQues < 10 ) {
            validQues = askTorF( doc.getElementById("g0_1").value, doc.getElementById("g0_7").value );
         } else if( whichQues < 11 ) {
            validQues = askTorF( doc.getElementById("g0_4").value, doc.getElementById("g0_1").value );
         } else if( whichQues < 12 ) {
            validQues = askTorF( doc.getElementById("g0_4").value, doc.getElementById("g0_7").value );
         } else if( whichQues < 13 ) {
            validQues = askTorF( doc.getElementById("g0_7").value, doc.getElementById("g0_1").value );
         } else if( whichQues < 14 ) {
            validQues = askTorF( doc.getElementById("g0_7").value, doc.getElementById("g0_4").value );
        } else {
            blank();
	    var sqCount = 0;
	    var col = 1;
	    var inc = 3;
	    var id = "";
	    var val = 0;
	    var root = -1;
            if( whichQues < 15 ) {
	        while( sqCount < 1 ) {
		    id = "g0_" + col;
		    val = num(doc.getElementById( id ).value);
		    root = mat.sqrt( val );
	            if( root === mat.floor( root ) ) {
		        sqCount += 1;
		    }
		    col += inc;
	        }
                validQues = askSqrt( val, root );
            } else if( whichQues < 16 ) {
	        while( sqCount < 2 ) {
		    id = "g0_" + col;
		    val = num(doc.getElementById( id ).value);
		    root = mat.sqrt( val );
	            if( root === mat.floor( root ) ) {
		        sqCount += 1;
		    }
		    col += inc;
	        }
                validQues = askSqrt( val, root );
            } else if( whichQues < 17 ) {
	        while( sqCount < 3 ) {
		    id = "g0_" + col;
		    val = num(doc.getElementById( id ).value);
		    root = mat.sqrt( val );
	            if( root === mat.floor( root ) ) {
		        sqCount += 1;
		    }
		    col += inc;
	        }
                validQues = askSqrt( val, root );
            }
        }
    }
}
function getMultiplying() {
var doc = document;
var num = Number;
var ndx = cdx;

var len = 0;
    var factors;
    while( len < 2 && ndx < 7 ) {
        // what color section are you multiplying out?
        // load factors array with all the dragboxes in that color section
        // faster to do with an Array? fixit
        chooseColor: switch( ndx ) {
            case 0:
                factors = doc.getElementsByName("white");
                //alert("starting white column ndx: " + ndx);
                break chooseColor;
            case 1:
                factors = doc.getElementsByName("magenta");
                //alert("starting magenta column ndx: " + ndx);
                break chooseColor;
            case 2:
                factors = doc.getElementsByName("yellow");
                //alert("starting yellow column ndx: " + ndx);
                break chooseColor;
            case 3:
                factors = doc.getElementsByName("cyan");
                //alert("starting cyan column ndx: " + ndx);
                break chooseColor;
            case 4:
                factors = doc.getElementsByName("blue");
                //alert("starting blue column ndx: " + ndx);
                break chooseColor;
            case 5:
                factors = doc.getElementsByName("red");
                //alert("starting red column ndx: " + ndx);
                break chooseColor;
            case 6:
                factors = doc.getElementsByName("green");
                //alert("starting green column ndx: " + ndx);;
                break chooseColor;
        }
        //alert("factors[0]: " + factors[0] + " color ndx: " + ndx);
        var pstns = new Array();
        len = factors.length;
        //alert("factors[" + ndx + "] length: " + len );
        if( len > 1 ) { // if there is more than 1 factor in the section
            var instr0 = doc.getElementById("instr0");
            instr0.style.color = "#e2eeeb";
            instr0.innerHTML = "Multiply the factors in each section";
            var indexes = new Array();
            var idx = 0;
            for( idx = 0; idx < len; ++idx ) {
                var value = factors[idx].value;
                pstns[idx] = num(factors[idx].getAttribute("position"));
                indexes[idx] = idx;
                factors[idx].setAttribute("moved", "pos0" );

                //var id = factors[idx].id;
                //doc.getElementById("statusBox" + x).innerHTML = " sort idx: " + idx + " value: " + value + " original position: " + pstns[idx] + " id:" + id;
                //x = (x + 1)%nSbxs;
            }
            // sort in order of distance from top of screen
            for( idx = 0; idx < len-1; ++idx ) {    
                var min = pstns[idx];
                for( var jdx = idx+1; jdx < len; ++jdx ) {
                    var possMin = (pstns[jdx]);
                    if( possMin < min ) { // switch the two of them
                        var tmp = pstns[idx];
                        pstns[idx] = pstns[jdx];
                        pstns[jdx] = tmp;
                        var tmp2 = indexes[idx]; // index of the larger y positioned box
                        indexes[idx] = indexes[jdx];
                        indexes[jdx] = tmp2;
                        min = possMin;
                    }
                }
            }
            cdx = ndx;
            fmdx = 0;
            gfactors = factors;
            glen = len;
            gmdx = 0;
            gprod = 1;
            gindexes = indexes; // indexes of factors array for this color section,
                                // sorted in order of position
            lastPos = 0;
            multiply();
        } else { // nothing to multiply, go on to next section
            if( len > 0 ) {
                factors[0].setAttribute("moved", "pos0" );
                factors[0].setAttribute("class", "dead");
                // put a draggable copy
                putDraggableCopy( factors[0] );
            } // else put a 1??
            ndx = ndx + 1;
        }
    }
    //alert("done with while ndx: " + ndx);
    if( ndx > 6 ) {
	setPaper();
        cdx = 7; // don't come back here
    }
}
function multiply() {
    var ndx = cdx;
    var doc = document;
   
    if( ndx > 6 ) {
        return;
    }

    var factors = gfactors;
    var inc = 1; //ginc;      
    var len = glen;
    var mdx = gmdx;
    var lprod = gprod; // whatever it was from last intermediate
    var num = Number;
    var kdx;
    var indexes = gindexes;


    var whatFactor;
    var whatColor = factors[0].name;
    //alert("whatColor:" + whatColor);
    //for( x = 0; x < nSbxs; ++x ) {
        //doc.getElementById("statusBox" + x).innerHTML = "";
    //}
    //x = 0;
    var allNames = doc.getElementsByName( whatColor ); // all dragBoxes
    var howManyNames = allNames.length;
    var factVal;
    var factPos;
    
    var last = num(lastPos);
    if( last > 0 ) {        
        //doc.getElementById("statusBox" + x).innerHTML = "howManyNames: " + howManyNames;
        //x = (x + 1)%nSbxs;
        // hide factors that went into any intermediate product
        for( var i = 0; i < howManyNames; ++i  ) {
            var ipos = allNames[i].getAttribute("position");
            //doc.getElementById("statusBox" + x).innerHTML = "ipos: " + ipos + " last: " + last;
            //x = (x + 1)%nSbxs;
            if( num(ipos) <= last ) {
                allNames[i].style.color = "#b4c5e2";
            }
	}
	// hide all but oneprevious intermediate products
	var ntermeds = doc.getElementsByName("ntrmed");
	var howManyNtermeds = ntermeds.length;
        //doc.getElementById("statusBox" + x).innerHTML = "howManyNtermeds: " + howManyNtermeds;
        //x = (x + 1)%nSbxs;
	for( var i = 0; i < howManyNtermeds; ++i ) {
            var ipos = ntermeds[i].getAttribute("position");
            //doc.getElementById("statusBox" + x).innerHTML = "ipos: " + ipos + " last: " + last;
            //x = (x + 1)%nSbxs;
            if( num(ipos) <= last ) {
                var children = ntermeds[i].childNodes;
        	var nChilds = children.length;
                //doc.getElementById("statusBox" + x).innerHTML = "type: " + ntermeds[i].type + " nodes of ntermediate box: " + nChilds;
                //x = (x + 1)%nSbxs;
	        for( var j = 0; j < nChilds; ++j ) {
                    var grandkids = children[j].childNodes;
                    var nGrandKids = grandkids.length;
                    //doc.getElementById("statusBox" + x).innerHTML = "type: " + children[j].type + " nGrandKids: " + nGrandKids;
                    //x = (x + 1)%nSbxs;
                    for( var k = 0; k < nGrandKids; ++k ) {
                        //doc.getElementById("statusBox" + x).innerHTML = "type: " + grandkids[k].type + " value: " + grandkids[k].value;
                        //x = (x + 1)%nSbxs;
		        grandkids[k].style.color = "#b4c5e2";
                    }
		}
            }
	}
    }
    // do .. while mdx is less than number of factors in this colored segment and
    // either this is the first factor multi-digit or not or
    // product is still less than 9 or
    // there has been a multiplication box befor this
    // not sure this is what's implemented in the following loop. try dragging low numbers first fixit
    do {
        kdx = indexes[mdx];
        whatFactor = factors[kdx];  
        var pos = getPos(whatFactor); // to be taken out
        var xcoord = pos.x;
        var ycoord = pos.y;
        var id = whatFactor.id;
        //doc.getElementById("statusBox" + x).innerHTML = "mult whatFactor: " + ycoord + " id: " + id;
        //x = x + 1; // to be taken out
        factVal = whatFactor.value;
        lprod = lprod*num(factVal);
        mdx = mdx + inc;   // inc is 1, 2 or 3 depending on how many copies of factor  
    } while( mdx  < len &&( mdx <= inc || lprod <= 9 ) );
    
    factPos = whatFactor.getAttribute("position"); // getPos may have roundoff
    // put a times symbol "X" in front of the last factor
    var valueLen = factVal.length;
    var spaces = 6 - valueLen;
    for( var i = 0; i < spaces; ++i ) {
        factVal = " " + factVal;
    }
    factVal = "X" + factVal;
    
    // put an "X" in all the copies as it is probably
    // a copy that lands on  top    no longer needed as there are no copies
    //for( var i = 0; i < howManyNames; ++i  ) {
    //    if( allNames[i].getAttribute("position") === factPos ) {
    //        allNames[i].value = factVal;
    //    }
    //}
        
    // if prod has 2+ digits, 
    // if it is indeed a product of two or more factors
    // but you still have more factors to go
    // make a box and multiply it out
    if( lprod > 9 && mdx > 0 && mdx < len ) {

                            
    	lastPos = factPos;      // save it for blanking first
                                // factors out and later restoring 
                                // factors, removing intermediate products and X's
                   
        var pos = getPos(whatFactor);
        var xcoord = pos.x;
        var ycoord = pos.y; //num(whatFactor.getAttribute("position")); //

        var ydiff = 0.03*num(window.innerHeight);
	gYdiff = ydiff; // never going to use this again??

        //doc.getElementById("statusBox" + x).innerHTML = "ydiff: " + ydiff;
        //x = x + 1;
        ycoord = ycoord + ydiff;
        //doc.getElementById("statusBox" + x).innerHTML = "bar: " + ycoord;
        //x = x + 1;
        var bar = doc.createElement("div");
        doc.body.appendChild( bar );
        var more2left = xcoord - 2;
        var styles = "border: 1px solid black;"
	    + "width: 58px;"
	    + "height: 0px;"
	    + "position: absolute;"
	    + "top: " + ycoord + "px;"
	    + "left: " + more2left + "px;";
        if( whatColor === "red" |
            whatColor === "magenta" |
            whatColor === "blue" ) {
            styles = styles +  "border: 1px solid white;";
        } else {
            styles = styles +  "border: 1px solid black;";
        }
	bar.setAttribute("style", styles);
        bar.setAttribute("name", "intermediateBar");
            
        // set up  answer box
        var dTbl = doc.createElement("table");
        var dBox = doc.createElement("tr");
	dTbl.setAttribute("name", "ntrmed");
        dTbl.setAttribute("class","ntrmed");
        cdx = ndx;
        if( fmdx === 0 ) {
            fmdx = mdx;
        }     
        gmdx = mdx;
        //doc.getElementById("statusBox" + x).innerHTML = "lprod: " + lprod;
        //x = (x + 1)%nSbxs;
        gprod = lprod;
        dBox.style.padding = 0;
        dBox.style.margin = 0;
        doc.body.appendChild(dTbl);
        dTbl.appendChild(dBox);
        var nBxs = 7;
        var leasDig = 6;
	for( var i = 0; i < nBxs; ++i ) {
            var td = doc.createElement("td");
            td.style.margin = 0;
            td.style.border = 0;
            td.style.padding = 0;
            var nput = doc.createElement("input");
            nput.style.color = "#3961a2";
            nput.style.margin = 0;
            nput.style.padding = 0;
            nput.style.width = "0.58em";
            nput.onkeyup=passFocus;
            td.appendChild(nput);
            dBox.appendChild(td);
            if( i === leasDig ) {
                doc.activeElement.blur();
                nput.focus();
                nput.onkeydown=eraseAll;
            }
	}
        ycoord = ycoord + 1;
        dTbl.style.top = ycoord + "px";
        dTbl.style.left = xcoord + "px";
        var relPos = factPos + 1; // position needs to be relative to original
                                  // positions of factors, not actual position
                                  // actual positions keep changing
        dTbl.setAttribute("position", relPos);
        dTbl.style.position = "absolute";
        //doc.getElementById("statusBox" + x).innerHTML = "dTbl: " + ycoord;
        //x = x + 1;

        // move the rest of the factors 
        for( var i = mdx; i < len; ++i ) {
            var m = indexes[i];
            var whatId = factors[m].id;
            var whatBx = doc.getElementById(whatId);
            if( i%inc === 0 ) {
                ycoord = ycoord + ydiff;
            }
            //doc.getElementById("statusBox" + x).innerHTML = "rest: " + ycoord;
            //x = x + 1;
            whatBx.style.top = ycoord + "px";          
        }
        
        //dBox.setAttribute("moved","false"); 
        //dBox.setAttribute("class","dragBox");
    } else if( inc < len && len <= mdx ) { // last multiplication
        cdx = ndx + 1;   
        gmdx = mdx;
        //doc.getElementById("statusBox" + x).innerHTML = "last multiplication lprod: " + lprod;
        //x = (x + 1)%nSbxs;
        gprod = lprod;
        // set up final answer box
        var dTbl = doc.createElement("table");
        var dBox = doc.createElement("tr");
	dTbl.setAttribute("name", "final");
        dBox.style.padding = 0;
        dBox.style.margin = 0;
        doc.body.appendChild(dTbl);
        dTbl.appendChild(dBox);
        var nBxs = 7;
        var leasDig = 6;
	for( var i = 0; i < nBxs; ++i ) {
            var td = doc.createElement("td");
            td.style.margin = 0;
            td.style.border = 0;
            td.style.padding = 0;
            var nput = doc.createElement("input");
            nput.style.color = "#3961a2";
            nput.style.margin = 0;
            nput.style.padding = 0;
            nput.style.width = "0.58em";
            nput.onkeyup=passFocus;
            td.appendChild(nput);
            dBox.appendChild(td);
            if( i === leasDig ) {
                doc.activeElement.blur();
                nput.focus();
                nput.onkeydown=eraseAll;
            }
	}
        var pos = getPos(whatFactor);
        var xcoord = pos.x;
        var ycoord = pos.y; //num(whatFactor.getAttribute("position")); //
        var ydiff = 0.03*num(window.innerHeight);
        
        ycoord = ycoord + ydiff;
                
        //doc.getElementById("statusBox" + x).innerHTML = "bar: " + ycoord;
        //x = x + 1;
        var bar = doc.createElement("div");
        doc.body.appendChild( bar );
        var more2left = xcoord - 2;
        var styles = "border: 1px solid black;"
	    + "width: 58px;"
	    + "height: 0px;"
	    + "position: absolute;"
	    + "top: " + ycoord + "px;"
	    + "left: " + more2left + "px;";
        var needWhite = ( whatColor === "red" |
                          whatColor === "magenta" |
                          whatColor === "blue" );
        if( needWhite ) {
            styles = styles +  "border: 1px solid white";
        } else {
            styles = styles +  "border: 1px solid black";
        }
	bar.setAttribute("style", styles);
        bar.id = whatColor + "Bar";
        
        ycoord = ycoord + 1;
        
        dTbl.style.top = ycoord + "px";
        dTbl.style.left = xcoord + "px";
        dTbl.style.position = "absolute";
        dTbl.setAttribute("moved","pos1"); 
        dTbl.setAttribute("backHomeX", xcoord );
        dTbl.setAttribute("backHomeY", ycoord );
        dBox.type="text";
        dTbl.setAttribute("class","dragBox");
        dTbl.setAttribute("id", whatColor);
        var bakhomY = dTbl.getAttribute("backHomeY");
        //doc.getElementById("statusBox" + x).innerHTML = "last: " + ycoord + " bakhomY: " + bakhomY;
        //x = (x + 1)%nSbxs;
    } else { 
        alert("why are you here? inc: " + inc + " len: " + len + " mdx: " + mdx + " lprod: " + lprod);
        gmdx = 0;
        gprod = 1;
        getMultiplying(); // start multiplying a new column
    }
}
function eraseAll( ev ) {
    ev = ev || window.event;
    var ansBx = ev.target;
    var doc = document;


    ansBx.style.color = "#0c2a5a";
    var answer = ansBx.value;
    var len = answer.length;
    //doc.getElementById("statusBox" + x).innerHTML = "IN eraseAll! noIntermeds: " + noIntermeds;
    //x = (x + 1)%nSbxs;
    //if( doingMults || !noIntermeds ) {
    var parent = ansBx.parentNode;
    var grandparent = parent.parentNode;
    var parents = grandparent.childNodes;
    var parentNode = parents[0];
    var len = parents.length;
    for( var i = 0; i < len; ++i ) {
        if( ( parentNode = parents[i]).tagName === "TD" ) {
            var allBoxes = parentNode.childNodes;
            allBoxes[0].value = "";
            allBoxes[0].style.color = "#0c2a5a";
        }
    }
    ansBx.value = answer.substring(len, len);
}
function erase( ev ) {
    ev = ev || window.event;
    var ansBx = ev.target;
    if( ansBx.style.color === "red") {
        ansBx.style.color = "#0c2a5a";
        var answer = ansBx.value;
        var len = answer.length;
        ansBx.value = answer.substring(len, len);
    }
}
function passFocus( ev ) {
    ev = ev || window.event;
    var ansBx = ev.target;
    var doc = document;
    
    if (ev.which === 8 || ev.keyCode === 8) { // backspace
        // find previous box
        // blank out previous box
        // focus on previous box
        var parent = ansBx.parentNode;
	var grandparent = parent.parentNode;
	var i = 0;
	var parents = grandparent.childNodes;
	var thisBox = null;
        var parentNode = parents[i];
        var foundCurrentBx = false;
	while( ( parentNode = parents[i]).NodeType !== 1 ) {
            if( parentNode.tagName === "TD" ) {
                var children = parentNode.childNodes;
                thisBox = children[0];
                if( foundCurrentBx ) {
                    thisBox.value = "";
                    thisBox.focus();
                    break;
                }
                if( thisBox === ansBx ) {
                    foundCurrentBx = true;
                }
            }
            ++i;
            if( !parents[i] ) {
                return;
            }
	}
    } else if (ev.which === 13 || ev.keyCode === 13) { // return
        checkBackM(ev);
    } else {
        var parent = ansBx.parentNode;
	var grandparent = parent.parentNode;
	var i = 0;
	var parents = grandparent.childNodes;
	var nextBox = null;
	var thisBox = null;
        var parentNode = parents[i];
        // not quite right probably won't work for larger numbers fixit
	while( ( parentNode = parents[i]).NodeType !== 1 ) {
		if( parentNode.tagName === "TD" ) {
            nextBox = thisBox;
            var children = parentNode.childNodes;
            //doc.getElementById("statusBox" + x).innerHTML = "parent tag: " + parent.tagName + " grandparent tag: " + grandparent.tagName + " parentNode tag: " + parentNode.tagName;
            //x = (x + 1)%nSbxs;
            thisBox = children[0];
            if( thisBox === ansBx ) {
		break;
            }
		}
            ++i;
	}
	nextBox.focus();
    }
}
function setPaper() {
    var doc = document;
    var num = Number;
    var win = window;
    var mat = Math;
    //var getStyle = getComputedStyle;
    var instr0 = doc.getElementById("instr0");
    var instr1 = doc.getElementById("instr1");
    var instr2 = doc.getElementById("instr2");
    instr0.style.color = "#e2eeeb";
    instr1.style.color = "#e2eeeb";
    instr2.style.color = "#e2eeeb";
    instr0txt = "Work the problems on the white graph paper";
    instr1txt = "Drag any numbers you need for your calculations";
    instr2txt = "Enter your answers least significant digits first";
    instr0.innerHTML = instr0txt;
    instr1.innerHTML = instr1txt;
    instr2.innerHTML = instr2txt;
    var frame = doc.getElementById("paperFrame");

    //doc.getElementById("fans");
    var graphP = doc.createElement("img");
    graphP.style.position = "absolute";
    
    var hgt = num(win.innerHeight);
    var wid = num(win.innerWidth);
    var imgHgt = mat.floor(0.37*hgt); //0.45*hgt);
    graphP.style.height = imgHgt + "px";
    frame.style.height = imgHgt + "px";
    var topPos = hgt - imgHgt - 10;
    var imgWid = mat.floor(1.1*imgHgt);
    if( imgWid%2 !== 0 ) {
        imgWid += 1;
    }
    graphP.style.width = imgWid + "px";
    var leftPos = mat.round(0.31*wid); //0.27*wid; // needs to clear both factor table
                                        // and circles image on all browsers
	//leftPos = mat.round(0.34*wid);
    frame.style.left = leftPos + "px";  
    frame.style.top = topPos + "px";
    
    var pfansleft = 0.35*imgWid;
    var fansWid = gFansWid; //num(getStyle(fans).width.match(/[0-9]+/));
    
    var fansleft = mat.round(leftPos + imgWid/2 - fansWid/2); // centered
    //alert("imgWid: " + imgWid + " fansWid: " + fansWid + " fansleft: " + fansleft + " pfansleft: " + pfansleft);
    //var fleftStr = fansleft + "px";
    var putHere = 0.95*num(hgt);
    //alert("imgWid: " + imgWid + " fansWid: " + fansWid + " fansleft: " + fansleft + " pfansleft: " + pfansleft + " puthere: " + putHere);
    var fans = createTable("", "fans", true, putHere, fansleft, 8 );
    //fans.style.left = fleftStr;
    var clr = doc.createElement("button");
    clr.innerHTML = "Erase";
    clr.onclick=putBoxesBack;
    var btnPosX = 0.75*imgWid;
    var btnPosY = 0.9*imgHgt;
    var styles = "position: absolute;"
	    + "top: " + btnPosY + "px;"
	    + "left: " + btnPosX + "px;";
    clr.setAttribute("style", styles);
    frame.insertBefore(clr, frame.childNodes[0]);
        //var frame = doc.getElementById("circles");
        //var img = frame.childNodes[0];
        //img.insertBefore(restrtbtn, img.childNodes[0]);
    //topPos = getPos(fans).y;
   //gPutHere = topPos;
    var finalIns0 = doc.getElementById("finstr0");
    var finalIns1 = doc.getElementById("finstr1");
    finalIns0.style.color = "#0c2a5a";
    finalIns1.style.color = "#0c2a5a";
    var linespace = 0.05*imgHgt;
    topPos = 1 + linespace;
    finalIns0.style.top = topPos + "px";
    finalIns0.style.width = imgWid + "px";
    topPos = topPos + 2*linespace;
    finalIns1.style.top = topPos + "px";
    finalIns1.style.width = imgWid + "px";
    frame.insertBefore(graphP, frame.childNodes[0]);
    graphP.src = 'Images/allwhite.png';
    graphP.id = "graphPaper";

    //var ansBx = doc.getElementsByClassName("onewide");
    //redBox
    var allBoxes = fans.childNodes[0].childNodes;
    var len = allBoxes.length;
    var leasDig = len - 1;
    for( var i = 0; i < len; ++i ) {
        if( allBoxes[i].tagName === "TD" ) {
            var nput = allBoxes[i].childNodes[0];
            nput.disabled = false;
            nput.style.backgroundColor = "#e2eeeb";
            if( i === leasDig ){ //|| allBoxes[i].childNodes[0].id === "leasDig") {
		nput.id = "leasDig";
            }
        }
    }

    gLeftPos = leftPos;
    gImageWidth = imgWid;
    gImageHeight = imgHgt;
    doingMults = false;
    gPutHere = putHere;
    var howManySquares = 0;
    var blueRoot = mat.sqrt(num(doc.getElementById("g0_1").value));
    var redRoot = mat.sqrt(num(doc.getElementById("g0_4").value));
    var greenRoot = mat.sqrt(num(doc.getElementById("g0_7").value));

    if( blueRoot === mat.floor( blueRoot ) ) {
	howManySquares += 1;
    }
    if( redRoot === mat.floor( redRoot ) ) {
	howManySquares += 1;
    }
    if( greenRoot === mat.floor( greenRoot ) ) {
	howManySquares += 1;
    }
    whatHints = 'FactorsHints3.html';
    var lques = NQUES - 3 + howManySquares;
    NQUES = lques;
    noMoreStpdQstns = false;
    
    //doc.getElementById("leasDig").focus();
    //alert("finishing setPaper about to ask questions");
    askQuestions();
}
function checkBackM( ev ) { // check multiplication entered in arrays
    ev = ev || window.event;
    var ansBx = ev.target;
    var doc = document;
    var num = Number;
    var parent = ansBx.parentNode;
    var grandparent = parent.parentNode;
    var greatgparent = grandparent.parentNode;
    var parents = grandparent.childNodes;

    var answer = evalTbl(greatgparent);
    var boxesdragged = boxesDragged;
    //
    //alert("answer:" + answer + " gprod: " + gprod + " boxesdragged: " + boxesdragged + " gans: " + gans);
    //var ancestor = greatgparent.parentNode;
    var srcid = greatgparent.id;
    if( (answer === gprod && !boxesdragged) || (answer === gans && boxesdragged) ) {

        //var srcnm = ancestor.name;
        //var srctg = ancestor.tagName;
        //alert( "answer: " + answer + " boxesDragged: " + boxesdragged + " grpod: " + gprod + " gans: " + gans + " srcid: " + srcid);
        //x = (x + 1)%nSbxs;
        if( srcid === "fans" ) {
            if( boxesdragged  ) {
                //alert("checking fans box after intrmeds");
                //x = (x + 1)%nSbxs;
                if( gprod !== gans ) {
                    alert("multiplication correct, but not the answer. Choose boxes to drag again");
                    //var allBoxes = doc.getElementsByClassName("onewide");
                    var kids = greatgparent.childNodes[0].childNodes;
                    var l = kids.length;
                    var allBoxes = new Array();
                    var r = 0;
                    for( var q = 0; q < l; ++q ) {
                        var t = kids[q].tagName;
                        if( t === "TD") {
                            allBoxes[r] = kids[q];
                            ++r;
                        }
                        //doc.getElementById("statusBox" + x).innerHTML = "kid[" + q + "]: " + t;
                        //x = (x + 1)%nSbxs;
                    }
                    redBoxes(allBoxes);
                    putBoxesBack();
                    noIntermeds = true;
                } else {
                    //alert("gprod = gans so we're good");
                    alert("Correct. Press 'Enter' to continue.");
                    //x = (x + 1)%nSbxs;
                    noIntermeds = true; 
                    //var leasDig = doc.getElementById("leasDig");
                    //leasDig.focus();
                    askQuestions();    
                }
            } else {
                alert("Correct. Press 'Enter' to continue."); 
                //var leasDig = doc.getElementById("leasDig");
                //leasDig.focus();
                askQuestions();
            }
        }
        var bxName = greatgparent.getAttribute("name");
        if( bxName === "final" ) {
            // remove previous intermediate boxes
            var intermediates = doc.getElementsByName("ntrmed");
            var iLen = intermediates.length;
            var factors = gfactors;
            if( iLen > 0 ) { 
                var pos = getPos(intermediates[0]);
                for( var i = 0; i < iLen; ++i ) {
                    var whichInt = intermediates[0]; // always delete index 0
                                                     // because it's the last
                                                     // one remaining
                    var whichParent = whichInt.parentNode;
                    whichParent.removeChild( whichInt );  
                }
                var ydiff = gYdiff; //0.03*num(window.innerHeight);
                var ycoord = pos.y;
                     
                
                //var inc = 1; //ginc;
                var indexes = gindexes;
		var len = indexes.length;
                // what was mdx when the first intermediate box was placed
                var mdx = fmdx;
                var lastFact = num(lastPos);
                    
                for( var i = 0; i < len; ++i ) {
                    var m = indexes[i];
                    var factor = factors[m];
                    // remove all but the last "X"
                    var factPos = factor.getAttribute( "position" );
                    if( num(factPos) <= lastFact ) {
                        var factVal = factor.value;
                        var factLen = factVal.length;
                        while( isNaN(factVal) ) {
                            factVal = factVal.substr(1, factLen);
                            factLen = factLen - 1;
                        }
                        factor.value = factVal;
                    }
                    // move the the factors after the first intermrediate
                    // product back
                    if( i >= mdx ) {
                        if( i > mdx ) { //&& i%inc === 0 ) {
                            ycoord = ycoord + ydiff;
                        }    
                        factor.style.top = ycoord + "px";
                    }
                    factor.setAttribute("class","deadBox"); // no longer needs to be dragBox
                    ////// put a draggable copy
                    putDraggableCopy( factor );
                }
                ycoord = ycoord + ydiff;
                var whatColor = greatgparent.getAttribute("id");
                var barName = whatColor + "Bar";
                    
                var whatBar = doc.getElementById(barName);
                whatBar.style.top = ycoord + "px";
                ycoord = ycoord + 2;
                greatgparent.style.top = ycoord + "px";
                greatgparent.setAttribute("backHomeY", ycoord);
            } else { // no intermediates but still need to make draggable copies
                var len = factors.length;
                for( var idx = 0; idx < len; ++idx ) {
                    factors[idx].setAttribute("class", "deadBox");
                    // put a draggable copy
                    putDraggableCopy( factors[idx] );
                }
            }
            //
                    //var bakhomY = greatgparent.getAttribute("backHomeY");
        //doc.getElementById("statusBox" + x).innerHTML = "greatgparent y: " + ycoord + " bakhomY: " + bakhomY;
        //x = (x + 1)%nSbxs;
            greatgparent.setAttribute("class", "deadBox");
            // put a draggable copy of final copy
            putDraggableCopy( greatgparent );
            var bars = doc.getElementsByName("intermediateBar");
            var bLen = bars.length;
            for( var i = 0; i < bLen; ++i ) {
                var whichBar = bars[0];
                var whichParent = whichBar.parentNode;
                whichParent.removeChild( whichBar ); 
            }
            // unhide all factors
            var allfactors = doc.getElementsByName(whatColor);
            var fLen = allfactors.length;
            for( var i = 0; i < fLen; ++i ) {
                allfactors[i].style.color = "#0c2a5a";
                //allfactors[i].setAttribute("class", "deadBox");
                // put a draggable copy
                //putDraggableCopy( allfactors[i] );
            }
        }
        if( cdx < 7 ) {
            if( gmdx >= glen ) { // finished one col. go on to next
                getMultiplying();
            } else {
                multiply();
            }
        } else if( doingMults ) {
            setPaper();
        } else if( !noIntermeds ) {
            // find the next lower indexed intermediate box. (id = plaid + index) 
            var thisId = 54;
            var nextId = 53;
            var idStr = greatgparent.getAttribute("id");

            if( idStr !== "fans" ) {
                thisId = num(idStr.match(/[0-9]+/));
                nextId = thisId - 1; // at what point do you set noIntermeds = true?
            }
            //doc.getElementById("statusBox" + x).innerHTML = "idstr of box just entered: " + idStr + " nextId: " + nextId;
            //x = (x + 1)%nSbxs;
            var whatOp = "dontKNowYet";
            var plaids = gPlaids;
            var plaidIdx = gPlaidIdx;
            // set focus
            if( nextId < 0 ) {
                var yourClue = plaids[0].getAttribute("id");
                //doc.getElementById("statusBox" + x).innerHTML = "yourclue: " + yourClue;
                //x = (x + 1)%nSbxs;
                if( yourClue.substr(0,4) === "nter") {
                    whatOp = "add";
                    plaidIdx = plaidIdx + 2;
                } else {
                    whatOp = "mult";
                    
                }
                nextBox = doc.getElementById("fans");
                //noIntermeds = true;  // not yet, need to compare multiplication with actual answer
                //var leasDig = doc.getElementById("leasDig");
                doc.getElementById("leasDig").focus();
            } else {
                //doc.getElementById("statusBox" + x).innerHTML = "focusing on ntermed" + nextId;
                //x = (x + 1)%nSbxs;
                var nextBox = doc.getElementById("ntermed" + nextId);
                //var nextTag = nextBox.tagName;

                // is it multiply or add (name)
                whatOp = nextBox.getAttribute("name");
                var grandparent = nextBox.childNodes[0];
                var parents = grandparent.childNodes;
                var len = parents.length;
                leasDig = len - 1;
                //var leasDigTag = parents[leasDig].tagName;
                //var child0tag = parents[leasDig].childNodes[0].tagName;
                //doc.getElementById("statusBox" + x).innerHTML = "nextBox tag: " + nextTag + " len: " + len + " parents leasDig: " + leasDigTag + " child0tag: " + child0tag;
                //x = (x + 1)%nSbxs;
                parents[leasDig].childNodes[0].focus();
            }
            // set gans
            if( whatOp === "add" ) {
                // find exp from previous mult box
                // add what? (id = plaid + exp higher indexes)
                plaidIdx = plaidIdx - 1;
                var exp = 0;
                var prevOp = greatgparent.getAttribute("name");
                //var prevOp = greatgparent.getAttribute("tagName");
                //var prevOp = greatgparent.getAttribute("name");
                //doc.getElementById("statusBox" + x).innerHTML = "prevOp: " + prevOp + " plaidIdx: " + plaidIdx;
                //x = (x + 1)%nSbxs;
                if( prevOp.substr(0,4) === "mult") {
                    var tmp = prevOp.substr(4,5);
                    if( tmp ) {
                        exp = num(tmp);
                    }
                } else {
                    var whatjunk = prevOp;
                    //doc.getElementById("statusBox" + x).innerHTML = "what junk is this: " + whatjunk + " not mult";
                    //x = (x + 1)%nSbxs;
                }
                var idx = thisId;
                var ans = 0;
                for( var i = 0; i <= exp; ++i ) {
                    var val = evalTbl(doc.getElementById("ntermed" + idx));
                    ans = ans + val;
                    //doc.getElementById("statusBox" + x).innerHTML = "idx: " + idx + " val: " + val + " ans: " + ans;
                    //x = (x + 1)%nSbxs;
                    idx = idx + 1;
                }
                gans = ans;
                gPlaidIdx = plaidIdx;
            } else if( whatOp.substr(0,4) === "mult" ) {
                    // multiply what? position? isn't that what you did in the color sections of Venn diagram?
                        // global ref? possibly best 
                        // class? class needs to be checked for or removed
                
                
                var box = greatgparent; //plaids[plaidIdx]; // current box
                var tag = box.tagName;
                var val0 = 0;

                var exp = 0;
                var tmp = whatOp.substr(4,5);
                if( tmp ) {
                    exp = num(tmp);
                }
                if( firstUp ) { // if plain mult with no exp or exp = 0
                    plaidIdx = plaidIdx - 3;
                    if( singDigMul ) {
                        plaidIdx = plaidIdx - 1;
                        //doc.getElementById("statusBox" + x).innerHTML = "single digit mult plaidIdx: " + plaidIdx;
                        //x = (x + 1)%nSbxs;
                    }
                    firstUp = false;
                } else if( !exp || exp === 0 ) { // if plain mult with no exp or exp = 0
                    plaidIdx = plaidIdx - 1;
                }
                var plaidIdxplus = plaidIdx + exp + 2;
                //doc.getElementById("statusBox" + x).innerHTML = "plaidIdx: " + plaidIdx + " plaidIdxplus: " + plaidIdxplus;
                //x = (x + 1)%nSbxs;
                var plaidIdxM1 = plaidIdxplus - 1;
                box = plaids[plaidIdxM1];
                tag = box.tagName;
                var valm1 = 0;
                if( tag === "TABLE") {
                    valm1 = evalTbl(box);
                    //doc.getElementById("statusBox" + x).innerHTML = "TABLE multiplier: " + multiplier;
                    //        x = (x + 1)%nSbxs;
                } else if ( tag === "INPUT") {
                    valm1 = num(box.value.match(/[0-9]+/));
                }

                box = plaids[plaidIdxplus];
                tag = box.tagName;
                var val0 = 0;
                if( tag === "TABLE") {
                    val0 = evalTbl(box);
                } else if ( tag === "INPUT") {
                    val0 = num(box.value.match(/[0-9]+/));
                }

                //doc.getElementById("statusBox" + x).innerHTML = "Finding digit " + exp + " of valm1: " + valm1;
                //x = (x + 1)%nSbxs;
                if( !isNaN(exp) ) {
                    var tmp = valm1;
                    var tmp2 = valm1;
                    var powof10 = 1;
                    while( exp >= 0 ) {
                        tmp2 = tmp%10;
                        valm1 = tmp2*powof10;
                        powof10 = 10*powof10;
                        tmp = (tmp - tmp2)/10;
                        exp = exp - 1;
                        //doc.getElementById("statusBox" + x).innerHTML = "valm1: " + valm1 + " tmp: " + tmp + " exp: " + exp;
                        //x = (x + 1)%nSbxs;
                    }
                }
                gans = val0*valm1;
                gPlaidIdx = plaidIdx - 1;
                //doc.getElementById("statusBox" + x).innerHTML = "val0: " + val0 + " valm1: " + valm1 + " plaidIdx: " + gPlaidIdx;
                //x = (x + 1)%nSbxs;
            } else {
                alert("intermediate problem");
            }            
	}
    } else {
        //alert("entered: " + answer + " should be: " + gprod + ". Press 'Enter' to continue.");
        var leasDig = -1;
        if( doingMults ) {
            var len = parents.length;
            leasDig = len - 1;
            //doc.getElementById("statusBox" + x).innerHTML = "len: " + len + " leasDig: " + leasDig;
            //x = (x + 1)%nSbxs;
            for( var i = 0; i < len; ++i ) {
                var parentNode = parents[i];
                var tag = parentNode.tagName;
                //doc.getElementById("statusBox" + x).innerHTML = "i: " + i + " tag: " + tag;
                //x = (x + 1)%nSbxs;
                if( parentNode.tagName === "TD" ) {
                    var allBoxes = parentNode.childNodes;
                    allBoxes[0].style.color = "red";
                    if( i === leasDig ) {
                        allBoxes[0].focus();
                    }
                }
            }
            //alert("Entered: " + answer + ", should be: " + gprod + " Press 'Enter' to continue.");
            alert("Entered: " + answer + ", should be: gprod" + gprod + " DoingMults: " + doingMults + ". Press 'Enter' to continue.");
        } else if( srcid === "fans" ) { 
             //var allBoxes = doc.getElementsByClassName("onewide"); // onewide s are inputs, childNodes are TDs
         /*   var kids = greatgparent.childNodes[0].childNodes;
            var l = kids.length;
            var allBoxes = new Array();
            var r = 0;
            for( var q = 0; q < l; ++q ) {
                var t = kids[q].tagName;
                if( t === "TD") {
                    allBoxes[r] = kids[q];
                    ++r;
                }
                doc.getElementById("statusBox" + x).innerHTML = "kid[" + q + "]: " + t;
                x = (x + 1)%nSbxs;
            } */
            var allBoxes = greatgparent.childNodes[0].childNodes;
            redBoxes(allBoxes);
            //alert("Entered: " + answer + ", should be: " + gprod + ". Press 'Enter' to continue.");
            alert("Entered: " + answer + ", should be gprod: " + gprod + " gans: " + gans + " srcid: " + srcid + " boxesdraged: " + boxesdragged + ". Press 'Enter' to continue.");
        } else {    
            var allBoxes = greatgparent.childNodes[0].childNodes;
            redBoxes(allBoxes);
            alert("Entered: " + answer + ", should be: " + gans + ". Press 'Enter' to continue.");
            //alert("Entered: " + answer + ", should be: gand" + gans + " gprod: " + gprod + " scrid: " + srcid + ". Press 'Enter' to continue.");
        }   
    }
}
function evalTbl(whatTable) {
    //var doc = document;
    var num = Number;
    //var parents = whatTable.childNodes;
    var parents = whatTable.childNodes[0].childNodes;
    var boxLen = 0;
    var boxes = new Array(8); // should i give it a worst case size? fixit
    var len = parents.length;
    //doc.getElementById("statusBox" + x).innerHTML = "evalTbl len: " + len;
    //x = (x + 1)%nSbxs;
    var parentNode = parents[0];
    // is all this really necessary? fixit
    for( var i = 0; i < len; ++i ) {
        if( ( parentNode = parents[i]).tagName === "TD" ) {
            var allBoxes = parentNode.childNodes;
            var ansBx = allBoxes[0];
            boxes[boxLen] = num(ansBx.value);
            //doc.getElementById("statusBox" + x).innerHTML = "boxes[" + boxLen + "]: " + boxes[boxLen];
            //x = (x + 1)%nSbxs;
            if( typeof( boxes[boxLen] ) === "number" ) { 
                ++boxLen;
            }
        }
    }
    // calculate the answer by adding each digit times appropiate ten2pow
    var multiplier = 0;
    var ten2pow = 1;
    for( var i = boxLen-1; i >= 0; --i ) {
        //doc.getElementById("statusBox" + x).innerHTML = "multiplier: " + multiplier + " boxes[" + i + "]: " + boxes[i];
        //x = (x + 1)%nSbxs;
        multiplier = multiplier + ten2pow*boxes[i];
        ten2pow = ten2pow*10;
    }
    return multiplier;
}
function putDraggableCopy( whatGhost ) {
    var doc = document;
    
    var testInput = doc.createElement("input");
    var whatId = whatGhost.id;
    var idlen = whatId.length;
    var newId = "d" + whatId.substring(1, idlen);
    var whatValue = null;
    var pos = getPosition(whatGhost);
    var xcoord = pos.x;
    var ycoord = pos.y;
    var leftPos = whatGhost.getAttribute("backHomeX");
    var topPos = whatGhost.getAttribute("backHomeY");
    //alert("whatId: " + whatId + " xcoord: " + xcoord + " ycoord: " + ycoord + " leftPos: " + leftPos + " topPos: " + topPos);
    
    var tag = whatGhost.tagName;
    if( tag === "TABLE") {
        whatValue = evalTbl(whatGhost);
        var parent = whatGhost.parentNode;
        
        // create either a label or a disabled input to replace table
        var replacement = doc.createElement("input");
        replacement.setAttribute("value",whatValue);
        replacement.disabled = true;
        replacement.style.position = "absolute";
        replacement.setAttribute("moved","pos1");
        replacement.setAttribute("backHomeX", leftPos );
        replacement.setAttribute("backHomeY", topPos );
        replacement.style.background = "#6a91c8"; // midrange
        replacement.style.color = "#0c2a5a";
        replacement.style.left = xcoord + "px";
        replacement.style.top = ycoord + "px";
        doc.body.appendChild(replacement);
        parent.removeChild( whatGhost );
        replacement.id = whatId;
        //var child = whatGhost.childNodes[0].tag;
        //var grandchild = whatGhost.childNodes[0].childNodes[0].tag;
        //doc.getElementById("statusBox" + x).innerHTML = "child: " + child + " grandchild: " + grandchild;
        //x = (x + 1)%nSbxs;
    } else {
        whatValue = whatGhost.value;
        whatGhost.style.background = "#6a91c8"; // midrange
        whatGhost.style.color = "#0c2a5a";

    }

    testInput.id = newId;
    testInput.type="text";
    testInput.setAttribute("value",whatValue);
    testInput.setAttribute("class","dragBox");
    testInput.style.position = "absolute";
    testInput.setAttribute("moved","pos1");
    testInput.setAttribute("backHomeX", leftPos );
    testInput.setAttribute("backHomeY", topPos );

    testInput.style.background = "#d2edf9";
    //testInput.style.background = "orange";
    testInput.style.color = "#3961a2";
    testInput.style.left = xcoord + "px";
    testInput.style.top = ycoord + "px";
    //testInput.disabled = true;
    doc.body.appendChild(testInput);
}
function redBoxes( allBoxes ) {
    var doc = document;
    var len = allBoxes.length;
    var leasDig = len - 1;
    for( var i = 0; i < len; ++i ) {
        if( allBoxes[i].tagName === "TD" ) {
            allBoxes[i].childNodes[0].style.color = "red";
            if( i === leasDig ){
                allBoxes[i].childNodes[0].focus();
            }
        }
    }
    var errs = Number(doc.getElementById("errs").value);
    doc.getElementById("errs").value = errs + 1;
}
function check( ev ) { // checks original factorization
    ev = ev || window.event;
    var ansBx = ev.target;
    //var x = 0;
    if (ev.which === 13 || ev.keyCode === 13) { // return
        var doc = document;
        var num = Number;
        var id = ansBx.id.toString();
        var pos = id.indexOf("_");
        var col = num(id.substr(pos+1, id.length));
        var row = num(id.substr(1,pos-1));
        //alert("row: " + row + " col: " + col);
        var checkingPrime = col%3 === 0;
        var answer = num(ansBx.value);
        if( checkingPrime ) {
            //alert("checking prime");
            var opCol = col + 1;
            var whatOp = num(doc.getElementById("g" + row + "_" + opCol ).value);
            //var test = whatOp%potentialFact;
            //alert("whatOp: " + whatOp + " whatOp mod potentialfact: " + test);
            if( whatOp%answer === 0 ) {
                //alert(potentialFact + " is a factor of " + whatOp);
                var len = allprimes.length;
                var isPrime = false;
                for( var i = 0; i < len; ++ i ) {
                    if(answer === allprimes[i] ) {
                        isPrime = true;
                        //alert(answer + " is prime");
                        break;
                    }
                }
                if( isPrime ) {
                    ansBx.style.color = "#11397a";
                    /* shadow 103, 104, 99     #676863 */
                    /* midrange 66, 112, 177   #4270b1 */
                    /* mountain 180, 197, 226  #b4c5e2 */
                    /* rock 226, 181, 161 pink #e2b5a1 */
                    /* snow 226, 238, 235      #e2eeeb */
                    /* water 57, 97, 162       #3961a2 */
                    ansBx.style.backgroundColor = "#b4c5e2";
                    ansBx.disabled = true;

                    var notDone = answer !== whatOp; 
                    if( notDone ) { // not done with this column
                        col = col + 1;
                        row = row + 1;
                        var nextIn = doc.getElementById( "g" + row + "_" + col );
                        nextIn.type = "text";
                        nextIn.color = "#11397a";
                        var nextTd = nextIn.parentNode;
                        nextTd.style.borderLeftColor = "#0c2a5a";
                        nextTd.style.borderBottomColor = "#0c2a5a";
                        nextIn.focus();
                        doc.getElementById("instr1").innerHTML = 
                                "What is " + whatOp + " divided by " + answer + "? (Enter)";
                    } else {
                        //alert("you're done now you can skip the one");
                        col = col + 3;
                        var colPlus2 = col + 1;
                        row = 0;
                        var nextOp = doc.getElementById( "g" + row + "_" + colPlus2 );
                        if( nextOp ) {
                            nextOp.type = "text";
                            var nextVal = nextOp.value;
                            doc.getElementById("instr1").innerHTML = 
                                "What prime number evenly divides " + nextVal + "? (Enter)";
                            var nextTd = nextOp.parentNode;
                            nextTd.style.borderLeftColor = "#0c2a5a";
                            nextTd.style.borderBottomColor = "#0c2a5a";
                            var nextIn = doc.getElementById( "g" + row + "_" + col );
                            nextIn.type = "text";
                            nextIn.focus();
                        } else {
                            var snow = "#e2eeeb";
                            var water = "#3961a2"; //"#3f66a1";
                            doc.body.style.backgroundColor = "#3961a2";
                            var win = window;
                            var hgt = num(win.innerHeight);
                            var wid = num(win.innerWidth);
                            var minDim = hgt < wid ? hgt : wid;
                            var frame = doc.getElementById("circles");                               	 
                            var img = doc.createElement("img");
                            img.style.position = "absolute";
                            var imgHgt = 0.75*minDim;
                            img.style.height = imgHgt + "px";
                            frame.style.height = imgHgt + "px";
                            //var topPos = hgt - imgHgt;
                            var imgWid = 1.05*imgHgt;
                            img.style.width = imgWid + "px";
                            frame.style.width = imgWid + "px";
                            frame.insertBefore(img, frame.childNodes[0]);
                            img.src = 'Images/factors.png'; // "url('Images/factors.png')";
                            doc.getElementById("instr1").style.color = "#3961a2";
                            doc.getElementById("instr2").style.color = "#3961a2";
                            whatHints = 'FactorsHints2.html';
                            var links = document.getElementsByTagName("a");
                            len = links.length;
                            for(var i=0;i<links.length;i++) {
                                if(links[i].href) {
                                    links[i].style.color = "black";//"#0c2a5a"; 
                                }
                            }  
                            movelabels();
                            var redValue = doc.getElementById("g0_4").value;
                            var blueValue = doc.getElementById("g0_1").value;
                            var greenValue = doc.getElementById("g0_7").value;
                            var redLabel = doc.getElementById("redLabel");
                            redLabel.style.color = "white";
                            redLabel.innerHTML = "Factors of ";
                            var redLabel2 = doc.getElementById("redLabel2");
                            redLabel2.style.color = "white";
                            redLabel2.innerHTML = redValue + " only";
                            var magentaLabel = doc.getElementById("magentaLabel");
                            magentaLabel.style.color = "white";
                            magentaLabel.innerHTML = "Factors of"; 
                            var magentaLabel2 = doc.getElementById("magentaLabel2");
                            magentaLabel2.style.color = "white";
                            magentaLabel2.innerHTML = redValue;
                            var magentaLabel3 = doc.getElementById("magentaLabel3");
                            magentaLabel3.style.color = "white";
                            magentaLabel3.innerHTML = "and";
                            var magentaLabel4 = doc.getElementById("magentaLabel4");
                            magentaLabel4.style.color = "white";
                            magentaLabel4.innerHTML = blueValue;
                            var yellowLabel = doc.getElementById("yellowLabel");
                            yellowLabel.style.color = "black";
                            yellowLabel.innerHTML = "Factors of";
                            var yellowLabel2 = doc.getElementById("yellowLabel2");
                            yellowLabel2.style.color = "black";    
                            yellowLabel2.innerHTML = redValue;
                            var yellowLabel3 = doc.getElementById("yellowLabel3");
                            yellowLabel3.style.color = "black";    
                            yellowLabel3.innerHTML = "and";
                            var yellowLabel4 = doc.getElementById("yellowLabel4");
                            yellowLabel4.style.color = "black";    
                            yellowLabel4.innerHTML = greenValue;
                            var whiteLabel = doc.getElementById("whiteLabel");
                            whiteLabel.style.color = "black";
                            whiteLabel.innerHTML = "Factors of all three";
                            var blueLabel = doc.getElementById("blueLabel");
                            blueLabel.style.color = "white";
                            blueLabel.innerHTML = "Factors of " + blueValue + " only";
                            var greenLabel = doc.getElementById("greenLabel");
                            greenLabel.style.color = "black";
                            greenLabel.innerHTML = "Factors of " + greenValue + " only";
                            var cyanLabel = doc.getElementById("cyanLabel");
                            cyanLabel.style.color = "black";
                            cyanLabel.innerHTML = "Factors of";
                            var cyanLabel2 = doc.getElementById("cyanLabel2");
                            cyanLabel2.style.color = "black";
                            cyanLabel2.innerHTML =  blueValue;
                            var cyanLabel3 = doc.getElementById("cyanLabel3");
                            cyanLabel3.style.color = "black";
                            cyanLabel3.innerHTML = "and";
                            var cyanLabel4 = doc.getElementById("cyanLabel4");
                            cyanLabel4.style.color = "black";
                            cyanLabel4.innerHTML = greenValue;

                            var tds = doc.getElementsByTagName("td");
                            len = tds.length;
                            for( var i = 0; i < len; ++i ) {
                                tds[i].style.borderColor = water; // "#3961a2"; 
                                var hasChild = tds[i].childNodes[1];
                                if( hasChild ) {
                                    var id = hasChild.id;
                                    if( id ) {                              
                                        var pos = id.indexOf("_");
                                        var col = num(id.substr(pos+1, id.length));                            
                                        //doc.getElementById("statusBox" + x).innerHTML = "child id is " + id + " column is " + col;
                                        //++x;
                                        if( (col+2)%3 === 0 ) { 
                                            hasChild.style.backgroundColor = water; // #3961a2"; 
                                            hasChild.style.color = snow; /* snow colored text  */
                                            var val = num(hasChild.value);
                                            if( val > 1 ) {
                                                tds[i].style.borderLeftColor =  snow;
                                                tds[i].style.borderBottomColor =  snow;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    ansBx.style.color = "red";    
                    doc.getElementById("instr1").innerHTML = answer + " is not prime.";
                    var errs = num(doc.getElementById("errs").value);
                    doc.getElementById("errs").value = errs + 1;
                }
            } else {
                ansBx.style.color = "red";   
                doc.getElementById("instr1").innerHTML = answer + " does not divide " + whatOp + " evenly.";
            }
        } else {
            var prevRow = row - 1;
            var prevCol = col - 1;
            var colPlus2;
            var prevOp = num(doc.getElementById("g" + prevRow + "_" + col).value);
            var prevPrime = num(doc.getElementById("g" + prevRow + "_" + prevCol).value);
            if( prevPrime*answer === prevOp ) {
                //var ghost = doc.getElementById( "g" + row + "_" + col );
                //ghost.type = "text";
                //ghost.value = answer;
                ansBx.style.color = "#11397a";
                ansBx.disabled = true;
                col = prevCol;
                doc.getElementById("instr1").innerHTML = 
                    "What prime number evenly divides " + answer + "? (Enter)";
                var nextIn = doc.getElementById( "g" + row + "_" + col );
                if( nextIn && !(!nextOp && answer === 1)) {
                    //doc.getElementById("statusBox" + x).innerHTML = "foc line 615";
                    //x = (x + 1)%nSbxs;
                    nextIn.type = "text";
                    nextIn.focus();
                } else {
                    ansBx.blur();
                }
            } else {
                ansBx.style.color = "red";
                doc.getElementById("instr1").innerHTML = prevOp + " divided by " + prevPrime + " is not " + answer + ".";
                var errs = num(doc.getElementById("errs").value);
                doc.getElementById("errs").value = errs + 1;
            }
        }
        return false;
    }
};
function getPos(e){ 
    var left = 0; 
    var top  = 0; 
    while (e.offsetParent){ 
        left += e.offsetLeft; 
	top  += e.offsetTop; 
        e     = e.offsetParent; 
    } 
    left += e.offsetLeft; 
    top  += e.offsetTop; 
    //left += 2;
    //top += 2;
    return {x:left, y:top}; 
}
function movelabels() {
    // move any previously moved drag boxes
    // don't allow any movement until window is maximized

    var w = window;
    var doc = document;
    var mat = Math;
    var num = Number;
    var hgt = num(w.innerHeight);
    var wid = num(w.innerWidth);
    var minDim = hgt < wid ? hgt : wid;        
    var frame = doc.getElementById("circles");
    if( frame ) {
        var imgHgt = 0.75*minDim;
        var topPos = hgt - imgHgt;
        var imgWid = 1.05*imgHgt;
        var leftPos = wid - imgWid;
        //alert( "hgt: " + hgt + " wid: " + wid + " imgHgt: " + imgHgt + " imgWid: " + imgWid + " topPos: " + topPos + " leftPos: " + leftPos);
        var img = frame.getElementsByTagName("img")[0];
        if( img ) {   
            img.style.height = imgHgt + "px";
            img.style.width = imgWid + "px";
            frame.style.height = imgHgt + "px";
            frame.style.width = imgWid + "px";
            var fullscr = w.fullScreen;
            var s = screen;
            var swid = num(s.width);
            var shgt = num(s.height);
            hgt = num(w.outerHeight);
            //alert("w.fullscreen: " + fullscr + " screen.width: " + swid + " screen.height: " + shgt + " w.width: " + wid + " w.height: " + hgt );
            var instr0 = doc.getElementById("instr0");
            var instr1 = doc.getElementById("instr1");
            var instr2 = doc.getElementById("instr2");
            if( fullscr ||
                ( wid === swid && shgt - 75 <= hgt && hgt <= shgt )) {
                //alert("screen is full size");
                //doc.getElementById("instr0").style.color = "#3961a2";
                var dragExists = doc.getElementsByClassName("dragBox");
                if( !dragExists[0] ) {
                    draggerSetup();
                } else {
                    instr0.style.color = "#e2eeeb";
                    instr1.style.color = "#e2eeeb";
                    
                    instr0.innerHTML = instr0txt;
                    instr1.innerHTML = instr1txt;
                    var in2 = instr2txt;
                    instr2.innerHTML = in2;
                    if( in2 === "What" ) {   
                        instr2.style.color = "#3961a2";
                    } else {
                        instr2.style.color = "#e2eeeb";
                    }
                    var mx = doc.getElementsByClassName("instrs").length;
                    for( var instIdx = 3; instIdx < mx; ++instIdx) {
                        var whatInstr = doc.getElementById("instr" + instIdx);
                        whatInstr.style.color = "#3961a2";
                        whatInstr.innerHTML = "What"; // keep the table rows the same size
                    }
                }
            } else {
                //alert("screen is NOT full size");
                instr0.style.color = "red";
                instr0.innerHTML = "Maximize your browser window";
                var mx = doc.getElementsByClassName("instrs").length;
                for( var instIdx = 1; instIdx < mx; ++instIdx) {
                    var whatInstr = doc.getElementById("instr" + instIdx);
                    whatInstr.style.color = "#3961a2";
                    whatInstr.innerHTML = "What"; // keep the table rows the same size
                }
            }
        }
        frame.style.left = leftPos + "px";  
        frame.style.top = topPos + "px";
        //var measPos = getPosition(frame);
        //alert("measured position top: " + measPos.y + " left: " + measPos.x );
        //frame.style.right = 0;
        //frame.style.bottom = 0;
        var prevX = prevLeft;
        var prevY = prevTop;
        redCenterX = leftPos + mat.round(0.5*imgWid);
        redCenterY = topPos + mat.round(0.349*imgHgt);
        blueCenterX = leftPos + mat.round(0.3*imgWid);
        blueCenterY = topPos + mat.round(0.6*imgHgt);
        greenCenterX = leftPos + mat.round(0.7*imgWid);
        greenCenterY = topPos + mat.round(0.6*imgHgt);
        redCenterX = leftPos + mat.round(0.5*imgWid);
        redCenterY = topPos + mat.round(0.349*imgHgt);
        blueCenterX = leftPos + mat.round(0.3*imgWid);
        blueCenterY = topPos + mat.round(0.6*imgHgt);
        greenCenterX = leftPos + mat.round(0.7*imgWid);
        greenCenterY = topPos + mat.round(0.6*imgHgt);
        radius = mat.round(0.333*imgWid);  
        redXpos = leftPos + mat.round(0.51*imgWid);
        magentaXpos = leftPos + mat.round(0.2*imgWid);
        yellowXpos = leftPos + mat.round(0.68*imgWid);
        whiteXpos = leftPos + mat.round(0.44*imgWid);
        blueXpos = leftPos + mat.round(0.08*imgWid);
        greenXpos = leftPos + mat.round(0.8*imgWid);
        cyanXpos = leftPos + mat.round(0.51*imgWid);
        /* redXpos = mat.round(0.51*imgWid);
        magentaXpos = mat.round(0.2*imgWid);
        yellowXpos = mat.round(0.68*imgWid);
        whiteXpos = mat.round(0.44*imgWid);
        blueXpos = mat.round(0.08*imgWid);
        greenXpos = mat.round(0.8*imgWid);
        cyanXpos = mat.round(0.51*imgWid); */
        redYpos = topPos + mat.round(0.06*imgHgt);
        magentaYpos = topPos + mat.round(0.34*imgHgt);
        yellowYpos = topPos + mat.round(0.34*imgHgt);
        whiteYpos = topPos + mat.round(0.41*imgHgt);
        blueYpos = topPos  + mat.round(0.53*imgHgt);
        greenYpos = topPos  + mat.round(0.53*imgHgt);
        cyanYpos = topPos + mat.round(0.71*imgHgt);
        /* redYpos = mat.round(0.06*imgHgt);
        magentaYpos = mat.round(0.34*imgHgt);
        yellowYpos = mat.round(0.34*imgHgt);
        whiteYpos = mat.round(0.41*imgHgt);
        blueYpos = mat.round(0.53*imgHgt);
        greenYpos = mat.round(0.53*imgHgt);
        cyanYpos = mat.round(0.71*imgHgt); */
        var allDragBoxes = doc.getElementsByClassName("dragBox");
        var dboxLen = allDragBoxes.length;   
        for( var i = 0; i < dboxLen; ++i ) {
            var whatBx = allDragBoxes[i];
            if( whatBx.getAttribute("moved") === "pos1") {
                var pos = getPos( whatBx );
                var xPos = pos.x + leftPos - prevX;
                var yPos = pos.y + topPos - prevY;
                whatBx.style.left = xPos + "px";
                whatBx.style.top = yPos + "px";
            }
        }
        allDragBoxes = doc.getElementsByClassName("deadBox");
        var dboxLen = allDragBoxes.length;   
        for( var i = 0; i < dboxLen; ++i ) {
            var whatBx = allDragBoxes[i];
            if( whatBx.getAttribute("moved") === "pos1") {
                var pos = getPos( whatBx );
                var xPos = pos.x + leftPos - prevX;
                var yPos = pos.y + topPos - prevY;
                whatBx.style.left = xPos + "px";
                whatBx.style.top = yPos + "px";
            }
        }
        prevTop = topPos;
        prevLeft = leftPos;
    }
    var home = doc.getElementById("home");
    var homepos = mat.round(hgt*0.76);
    home.style.marginTop = homepos + "px";
    var index = doc.getElementById("index");
    var indexpos = mat.round(hgt*0.80);
    index.style.marginTop = indexpos + "px";
    //alert("window size x: " + x + " y: " + y); // 1090, 742 // 1078, 727 // 1124, 758
    //if( 1000  < x && x < 1200 && 740 < y && y < 760 ) {
    

    var redLabel = doc.getElementById("redLabel");                    
    redLabel.style.marginTop = (mat.round(0.14*imgHgt)) + "px";
    redLabel.style.marginLeft = (mat.round(0.25*imgWid)) + "px";
    var redLabel2 = doc.getElementById("redLabel2");                    
    redLabel2.style.marginTop = (mat.round(0.17*imgHgt)) + "px";
    redLabel2.style.marginLeft = (mat.round(0.25*imgWid)) + "px";
    var magentaLabel = doc.getElementById("magentaLabel");
    magentaLabel.style.marginTop = (mat.round(0.33*imgHgt)) + "px";
    magentaLabel.style.marginLeft = (mat.round(0.32*imgWid)) + "px";
    var magentaLabel2 = doc.getElementById("magentaLabel2");
    magentaLabel2.style.marginTop = (mat.round(0.36*imgHgt)) + "px";
    magentaLabel2.style.marginLeft = (mat.round(0.32*imgWid)) + "px";
    var magentaLabel3 = doc.getElementById("magentaLabel3");
    magentaLabel3.style.marginTop = (mat.round(0.39*imgHgt)) + "px";
    magentaLabel3.style.marginLeft = (mat.round(0.32*imgWid)) + "px";
    var magentaLabel4 = doc.getElementById("magentaLabel4");
    magentaLabel4.style.marginTop = (mat.round(0.42*imgHgt)) + "px";
    magentaLabel4.style.marginLeft = (mat.round(0.32*imgWid)) + "px";
    var yellowLabel = doc.getElementById("yellowLabel");   
    yellowLabel.style.marginTop = (mat.round(0.33*imgHgt)) + "px";
    yellowLabel.style.marginLeft = (mat.round(0.54*imgWid)) + "px";
    var yellowLabel2 = doc.getElementById("yellowLabel2");
    yellowLabel2.style.marginTop = (mat.round(0.36*imgHgt)) + "px";
    yellowLabel2.style.marginLeft = (mat.round(0.56*imgWid)) + "px";
    var yellowLabel3 = doc.getElementById("yellowLabel3");
    yellowLabel3.style.marginTop = (mat.round(0.39*imgHgt)) + "px";
    yellowLabel3.style.marginLeft = (mat.round(0.59*imgWid)) + "px";
    var yellowLabel4 = doc.getElementById("yellowLabel4");
    yellowLabel4.style.marginTop = (mat.round(0.42*imgHgt)) + "px";
    yellowLabel4.style.marginLeft = (mat.round(0.61*imgWid)) + "px";
    var whiteLabel = doc.getElementById("whiteLabel");
    whiteLabel.style.marginTop = (mat.round(0.62*imgHgt)) + "px";
    whiteLabel.style.marginLeft = (mat.round(0.39*imgWid)) + "px";
    var blueLabel = doc.getElementById("blueLabel");
    blueLabel.style.marginTop = (mat.round(0.92*imgHgt)) + "px";
    blueLabel.style.marginLeft = (mat.round(0.18*imgWid)) + "px";
    var greenLabel = doc.getElementById("greenLabel");
    greenLabel.style.marginTop = (mat.round(0.92*imgHgt)) + "px";
    greenLabel.style.marginLeft = (mat.round(0.55*imgWid)) + "px";
    var cyanLabel = doc.getElementById("cyanLabel");
    cyanLabel.style.marginTop = (mat.round(0.7*imgHgt)) + "px";
    cyanLabel.style.marginLeft = (mat.round(0.35*imgWid)) + "px";
    var cyanLabel2 = doc.getElementById("cyanLabel2");
    cyanLabel2.style.marginTop = (mat.round(0.73*imgHgt)) + "px";
    cyanLabel2.style.marginLeft = (mat.round(0.36*imgWid)) + "px";
    var cyanLabel3 = doc.getElementById("cyanLabel3");
    cyanLabel3.style.marginTop = (mat.round(0.76*imgHgt)) + "px";
    cyanLabel3.style.marginLeft = (mat.round(0.37*imgWid)) + "px";
    var cyanLabel4 = doc.getElementById("cyanLabel4");
    cyanLabel4.style.marginTop = (mat.round(0.79*imgHgt)) + "px";
    cyanLabel4.style.marginLeft = (mat.round(0.38*imgWid)) + "px";
}
window.onload = function(){
    var doc = document;
    var win = window;
    var num = Number;
    var mat = Math;
    var hgt = num(win.innerHeight);
    var wid = num(win.innerWidth);
    minDim = hgt < wid ? hgt : wid;
    var el = doc.getElementById("g0_0");
    //doc.getElementById("statusBox" + x).innerHTML = "foc line 794";
    //x = (x + 1)%nSbxs;
    el.focus();
    //draggerSetup();
    /* make 'ems' a consistent unit by setting all fonts the same */  
    var style = window.getComputedStyle(el, null).getPropertyValue("font");
    var ths = doc.getElementsByTagName("th");
    var len = ths.length;
    for( var i = 0; i < len; ++i ) {
        ths[i].style.font = style;
    }
    var tds = doc.getElementsByTagName("td");
    len = tds.length;
    for( var i = 0; i < len; ++i ) {
        tds[i].style.font = style;
    }
    
    /* position the draggable values over the ghosts */
    var ghosts = doc.getElementById("ghosts"); 
    ghosts.style.marginTop  = "14px"; 
    ghosts.style.marginLeft  = "11px";
    var home = doc.getElementById("home");
    var homepos = mat.round(hgt*0.87);
    home.style.marginTop = homepos + "px";
    var index = doc.getElementById("index");
    var indexpos = mat.round(hgt*0.91);
    index.style.marginTop = indexpos + "px";

        
	
};
// start again button code
function startAgain() {
    var doc = document;
    var Num = Number;
    
    var errCt = Num(doc.getElementById("errs").value);
    var numAttmptd = Num(doc.getElementById("numAttmptd").value);
    var numWoErr = Num(doc.getElementById("numWoErr").value);
    var consWoErr = Num(doc.getElementById("consWoErr").value);

    //alert("boxNo = " + boxNo + " max = " + max + " errCt = " + errCt + " errMsg = " + errMsg);

    // update problem counts
    doc.getElementById("numAttmptd").value = numAttmptd + 1;
    if( errCt === 0 && completedSet ) {
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

    doc.getElementById('th-id2').submit();
}
window.onresize = function() {
    setTimeout( function() { movelabels(); }, 1000 );
    
};
