<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Plotting Points</title>
<link rel="stylesheet" href="PlotCurves.css" type="text/css">
<script src="PlotCurves.js"></script>
</head>
<% 
int MAXPT = 10;
int MAXPTS = 21;
int MAXCURVES = 5;

int xsign = (int)(MAXPT*Math.random()) > 5 ? 1 : -1;
int xval = xsign*(int)(MAXPT*Math.random());
int ysign = (int)(MAXPT*Math.random()) > 5 ? 1 : -1;
int yval = xsign*(int)(MAXPT*Math.random());
int idx;
int jdx = 0;
int kdx = 0;
//String [] slctopts = new String[20];
int [] xpoints = new int[MAXPTS];
int [] ypoints = new int[MAXPTS]; 
int nPts = 21;
int nClrs = 4; 
// these need to be stored in the page and retrieved
int whatlines = 0;
int currline = 0;
int totlines = 0;
int [] rise = new int[MAXCURVES];
int [] run = new int[MAXCURVES];
int [] intercept = new int[MAXCURVES];
String whatcurves = "0";
String currcurve = "0";
String totcurves = "0";
String [] param1 = new String[MAXCURVES];
String [] param2 = new String[MAXCURVES];
String [] param3 = new String[MAXCURVES];

String whatTable = "";
String tmp = "";    // temporary storage for newly gotten 
                    // request parameter      
String isSelected = "selected";
//String [] isNowSelected = new String[jdx];
String itype = "hidden";
String dbtype = "hidden";
String instrs = "Choose Curve Type";
String instr2 = "";
//String instr4 = "";
//String comma = "";
jdx = 6;
String [] slctopts = { "Line", "Circle", " Ellipse", "Parabola", "Hyperbola", "Quadratic" };
String [] isNowSelected = { "Lines", "Circles", " Ellipses", "Parabolas", "Hyperbolas", "Quadratics" };
String numAttmptdV = "0";
String numWoErr = "0";
String consWoErr = "0";
String corrPerHr = "0";
String strtTime = String.valueOf(System.currentTimeMillis());
String errct = "0";  
String isinit = "false";
String indvar = "X";
String depvar = "Y";
//String ntermedstep = "";
//String ntermedstep2 = "";
String sgn = "";
String nmratr = "";
String dnmnatr = "";
int col = 0;

//retrieves the value of the DOM object with name="numAttmptdP"
if(( tmp = request.getParameter("numAttmptdP")) != null) {
    numAttmptdV = tmp.toString();
}

if(( tmp = request.getParameter("numWoErrP")) != null) {
    numWoErr = tmp.toString();
} 

if(( tmp = request.getParameter("consWoErrP")) != null) {
    consWoErr = tmp.toString();
} 

if(( tmp = request.getParameter("corrPerHrP")) != null) {
    corrPerHr = tmp.toString();
} 

if(( tmp = request.getParameter("strtTimeP")) != null) {
    strtTime = tmp.toString();
} 

if(( tmp = request.getParameter("initlzd")) != null) {
	isinit = tmp.toString();
} 

if(( tmp = request.getParameter("whichcurves")) != null) {
	whatcurves = tmp.toString();
}

if(( tmp = request.getParameter("whichcurve")) != null) {
	currcurve = tmp.toString();
}

if(( tmp = request.getParameter("allcurves")) != null) {
	totcurves = tmp.toString();
}

totlines = Integer.parseInt(totcurves);
String tmpStr;
for( idx = 0; idx <totlines; ++idx ) {
	tmpStr = "whichparam1_" + idx; 
	if(( tmp = request.getParameter(tmpStr)) != null) {
		param1[idx] = tmp.toString();
	}
	tmpStr = "whichparam2_" + idx;
	if(( tmp = request.getParameter(tmpStr)) != null) {
		param2[idx] = tmp.toString();
	}
	tmpStr = "whichparam3_" + idx;
	if(( tmp = request.getParameter(tmpStr)) != null) {
		param3[idx] = tmp.toString();
	}
}

//retrieves the value of the DOM object with name="chs"
if(( tmp = request.getParameter("chs")) != null) {
	whatTable = tmp.toString();
	isSelected = "";
	for( kdx = 0; kdx < jdx; ++kdx ) {
		if( slctopts[kdx].equals(whatTable) ) {
			isNowSelected[kdx] = "selected";
        	itype = "text";

        	//comma = ",";
        	break;
        }
	}
    System.out.println("whatTable: " + whatTable);
    currline = 0;
    if( whatTable.equals("Line") ) {
		int sign = 2*Math.random() > 1? 1 : -1; 
    	whatlines = Integer.parseInt(whatcurves);
    	currline = Integer.parseInt(currcurve); 
    	int [] pfactors = {2, 3, 5, 7};
    	int plength = pfactors.length;
    	System.out.println("read from page and converted whatlines: " + whatlines + " currline: " + currline);
    	if( whatlines == 0 ) {
    		whatlines = 1 + (int)(3*Math.random());
    		currline = 0;
    		rise[0] = sign*(1 + (int)(9*Math.random()));
    		run[0] = 1 + (int)(9*Math.random()); 
       		// reduce
       		for( int i = 0; i < plength; ++i ) {
    	   		while( rise[0]%pfactors[i] == 0 && run[0]%pfactors[i] == 0 ) {
    	   			rise[0] = rise[0]/pfactors[i];
    	   			run[0] = run[0]/pfactors[i];
    	   		}
       		}
    		intercept[0] = (int)(20*Math.random()) - 10;
	    	if( whatlines == 1 ) {
	   			// same intercept
	    		totlines = 4;
	    		// generate all the lines at once and store in arrays
	    		for( idx = 1; idx < totlines; idx++ ) {
		    		sign = 2*Math.random() > 1? 1 : -1;
		    		//make sure you don't generate repeats
		    		boolean duplicate = true;
		    		while( duplicate ) {
		    			duplicate = false;
		   				rise[idx] = sign*(1 + (int)(9*Math.random()));
		   				run[idx] = 1 + (int)(9*Math.random());
		   				// reduce
		   	       		for( int i = 0; i < plength; ++i ) {
		   	    	   		while( rise[idx]%pfactors[i] == 0 && run[idx]%pfactors[i] == 0 ) {
		   	    	   			rise[idx] = rise[idx]/pfactors[i];
		   	    	   			run[idx] = run[idx]/pfactors[i];
		   	    	   		}
		   	       		}
		   				for( int i = 0; i < idx; ++i ) {
		   					if( (double)rise[i]/run[i] == (double)rise[idx]/run[idx]) {
		   						duplicate = true;
		   					}
		   				}
		    		}
	   				intercept[idx] = intercept[idx-1];   				
	    		}
	    	} else if( whatlines == 2 ) {
	    		// same slope
	   			totlines = MAXCURVES;
	   			for( idx = 1; idx < totlines; idx++ ) {
		   			rise[idx] = rise[idx-1];
		   			run[idx] = run[idx-1];
		    		//make sure you don't generate repeats
		   			boolean duplicate = true;
		    		while( duplicate ) {
		    			duplicate = false;
	    				intercept[idx] = (int)(20*Math.random()) - 10;
	    				for( int i = 0; i < idx; ++i ) {
		   					if( intercept[i] == intercept[idx] ) {
		   						duplicate = true;
		   					}
		   				}
		    		}
	   			}
	   		} else {
	   			// perpendicular
	    		totlines = 2;
	    		for( idx = 1; idx < totlines; idx++ ) {
	    			rise[idx] = -run[idx-1];
	    			run[idx] = rise[idx-1];
	   				intercept[idx] = (int)(20*Math.random()) - 10;	    			
	    		}
	   		}
    	} else {  		
    		currline += 1;
    		for( idx = 0; idx < totlines; idx++ ) {
    			// read all the slopes and intercepts so you can write them again		
    			rise[idx] = Integer.parseInt(param1[idx]);
    			run[idx] = Integer.parseInt(param2[idx]);
    			intercept[idx] = Integer.parseInt(param3[idx]);
    		}
   		}
  		//need to make these all integers, check for yval < -10 or > 10
   		double ypt;
   		nPts = 0; 
   		for( int i = 0; i < MAXPTS && currline < totlines; i += 1 ) {
    		xpoints[nPts] = (int)(i - 10);
   			ypt = rise[currline]*xpoints[nPts]/(double)run[currline] + intercept[currline];
   			ypoints[nPts] = (int)ypt;
   			if( ypoints[nPts] >= -10 && ypoints[nPts] <= 10 && (double)ypoints[nPts] == ypt ) {
   				nPts += 1;
   			}
		}
   		int arise = Math.abs(rise[currline]);
   		int arun = Math.abs(run[currline]);

   		String intermed = "";
   		if( !(arise == 1 && arun == 1) ) { 
   			intermed += arise;
   			if( arise != 1 ) {
   				nmratr = Integer.toString(arise);
   			}
   		}
		if( arun != 1 ) {
   			intermed = "(" + intermed;
   		}
   		if( rise[currline]*run[currline] < 0 ) {
	    	intermed = "-" + intermed;
	    	sgn = "-";
	    }
   		//if( !ntermedstep.equals("") ) {
   		//	ntermedstep = ntermedstep + indvar;
   		//}
	    if( arun != 1 ) {
	    	intermed += "/" + arun + ")";
   			dnmnatr = Integer.toString(arun);
	    }
   		instr2 = "Plot the line: " + depvar + " = ";
   		
	    instr2 += intermed;
	    instr2 += indvar;
	    if( intercept[currline] != 0 ) {
		    if( intercept[currline] < 0 ) {
		    	instr2 += " - ";
		    } else if( intercept[currline] > 0 ){
		    	instr2 += " + ";
		    }
	    	instr2 += Math.abs(intercept[currline]);
	    }
	    instrs = "Fill out as much of table as needed";
   		//whatcurves = Integer.toString(whatlines);
   		//currcurve = Integer.toString(currline);
   		//param1 = Double.toString(slope);
   		//param2 = Integer.toString(intercept);
    	System.out.println("after setting totlines: " + totlines + " whatlines: " + whatlines + " rise: " + rise[currline] + " run: " + run[currline] + " intercept: " + intercept[currline]);
    	//System.out.println("whatcurves: " + whatcurves + " curcurve: " + currcurve + " param1: " + param1 + " param2: " + param2);
    } 
} %>
<body>
<form id="plots">
<table id="whatpts">
<tr>
	<td class="pre" id="c-1_0"></td>
	<th class="title rem"><%=indvar%></th>
<% 	if( !dnmnatr.equals("") && (intercept[currline] != 0 || !nmratr.equals("")) ) { %>
			<td class="tmp"></td>
			<th class="title rem" id="on">
				<table>
				<tr>
				<div class="num" id="hn"><%=sgn%><%=indvar%></div>
				<div class="denom" id="ht"><%=dnmnatr%></div>
				</tr>
				</table>	
			</th>

<% 		if( !nmratr.equals("") && intercept[currline] != 0 ) { %>
			<td class="tmp"></td>
			<th class="title rem" id="om">
				<table>
				<tr>
				<div class="num" id="hm"><%=sgn%><%=nmratr%><%=indvar%></div>
				<div class="denom"><%=dnmnatr%></div>
				</tr>
				</table>	
			</th>
<% 		} %>
<% } 
	if( dnmnatr.equals("") && !nmratr.equals("") && intercept[currline] != 0 ) { %>
		<td class="tmp"></td>
		<th class="title rem" id="hn"><%=sgn%><%=nmratr%><%=indvar%></th>
<% } %>
	<td class="tmp"></td>
	<th class="title rem"><%=depvar%></th>
</tr>
<% for( int i = 0; i < nPts; ++i ) { 
	String bkClr = "c" + i%nClrs; 
	//int x = (int)(10*Math.random());
	//int y = (int)(10*Math.random());
	String rclass = "r" + i;
	String xid = "x" + i;
	String nid = "n" + i;
	String tid = "t" + i;
	String yid = "y" + i; 
	col = 0;
	String cid = "c" + i + "_" + col; %>
<tr>
<td class="pre" id="<%=cid%>" ></td>
<td class="<%=bkClr%> <%=rclass%> rem xpts" id="<%=xid%>" ><%=xpoints[i]%></td>
<% 	if( !dnmnatr.equals("") && (intercept[currline] != 0 || !nmratr.equals("")) ) { 
		col += 1;
		cid = "c" + i + "_" + col; %>
		<td class="tmp" id="<%=cid%>"></td>
		<td class="<%=bkClr%> <%=rclass%> rem" >
			<input id="<%=tid%>" class="nput tBx" type="hidden" onkeydown="erase( event )" onkeyup="checkT( event )" >
		</td>
<%		if( !nmratr.equals("") && intercept[currline] != 0 ) { 
			col += 1;
			cid = "c" + i + "_" + col; %>
			<td class="tmp" id="<%=cid%>" ></td>
			<td class="<%=bkClr%> <%=rclass%> rem" >
				<input id="<%=nid%>" class="nput nBx" type="hidden" onkeydown="erase( event )" onkeyup="checkN( event )" >
			</td>
<% 		} %>
<% 	}
	if( dnmnatr.equals("") && !nmratr.equals("") && intercept[currline] != 0 ) { 
		col += 1;
		cid = "c" + i + "_" + col;%>
		<td class="tmp" id="<%=cid%>" ></td>
		<td class="<%=bkClr%> <%=rclass%> rem" >
			<input id="<%=nid%>" class="nput nBx" type="hidden" onkeydown="erase( event )" onkeyup="checkN( event )" >
		</td>
<%	} 
	col += 1;
	cid = "c" + i + "_" + col; %>
<td class="tmp" id="<%=cid%>" ></td>
<td class="<%=bkClr%> <%=rclass%> rem" >
	<input id="<%=yid%>" class="nput" type="hidden" onkeydown="erase( event )" onkeyup="checkY( event )" >
</td>
</tr>

<% } %>
<tr>
<td class="pre invisible">__________</td>
<td class="tmp"></td>
<% 	if( !dnmnatr.equals("") && (intercept[currline] != 0 || !nmratr.equals("")) ) { %>
		<td class="tmp"></td>
		<td class="tmp"></td>
<%		if( !nmratr.equals("") && intercept[currline] != 0 ) { %>
			<td class="tmp"></td>
			<td class="tmp"></td>
<% 		} %>
<% 	}
	if( dnmnatr.equals("") && !nmratr.equals("") && intercept[currline] != 0 ) { %>
		<td class="tmp"></td>
		<td class="tmp"></td>
<%	} %>
<td class="tmp"></td>
<td class="tmp"></td>
</tr>
</table>
<span id="instrs"><%=instrs%></span>

<div>
<select id="chs" name="chs" class="slct" >   
	<option <%=isSelected%> >Select</option>
<% 	for( kdx = 0; kdx < jdx; ++kdx ) { 
		String sel = slctopts[kdx]; %>
		<option <%=isNowSelected[kdx]%> ><%=sel%></option>
<% 	} %>
</select>
</div>

<div id="instr2" >
<%=instr2%>
</div>
<div id="frame">
<svg id="xygraph" onmousedown="setMouseDown()" onmouseup="clearMouseDown()" onmousemove="checkCurve( event)">
</svg>
</div>

<table id="bottomleft">
<tr>
<td>
<div>
	    <a href="/" class="ndx">Home</a>         
</div>
<div>
	    <a href="index.html" class="ndx">Back to Practice Index</a>
</div>
</td>
<td class="invisible">_</td><td class="invisible">_</td><td class="invisible">_</td>
<td class="invisible">_</td><td class="invisible">_</td><td class="invisible">_</td>
<td>
<% if( !whatTable.equals("") ) { %>            
	<button type="button" onclick="skip()" id="skpBx">Another <%=whatTable%></button>
<% } %>
</td>
<td class="invisible">_</td><td class="invisible">_</td><td class="invisible">_</td>
<td class="invisible">_</td><td class="invisible">_</td><td class="invisible">_</td>
</tr>
</table>

<span class=rightsd>
<div id="statustable" >
	<table>
	<% for( int i = 0, j = 1; i < 0; i += 2, j += 2 ) {
	    String whatId = "statusBox" + i; 
	    String whatId2 = "statusBox" + j; %>
	    <tr><td><%=i%></td><td><div id="<%=whatId%>"></div></td><td><%=j%></td><td><div id="<%=whatId2%>"></div></td></tr>
	<% } %>
	</table>
</div>

<div id="score">
<table >
<tr>
    <th class="title" colspan="2">Score</th>     
</tr>
<tr>    
    <td><label>Problems Attempted</label></td>
    <td>
    <input type="hidden" id="numAttmptd" name="numAttmptdP" value="<%=numAttmptdV%>"
           class="blackbox" ><%=numAttmptdV%>
    </td>
</tr>
<tr>
    <td><label>Completed Without Error</label></td>   
    <td>
    <input type="hidden" id="numWoErr" name="numWoErrP" value="<%=numWoErr%>"
           class="blackbox" ><%=numWoErr%>
    </td>
</tr>
<tr>
    <td><label>Consecutive Without Error</label></td>   
    <td>
    <input type="hidden" id="consWoErr" name="consWoErrP" value="<%=consWoErr%>"
           class="blackbox" ><%=consWoErr%>
    </td>
</tr>
<tr>
    <td><label>Correct Per Hour</label></td>   
    <td>
    <input type="hidden" id="corrPerHr" name="corrPerHrP" value="<%=corrPerHr%>"
           class="blackbox" ><%=corrPerHr%>
    </td>
</tr>
<tr>
    <td><label>Errors This Problem</label></td>
    <td><input type="text" id="errct" name="errct" value="<%=errct%>"
               class="blackbox" disabled >
    </td>
</tr>
</table>
</div>
<%-- are all these values text? if so, I need to convert when reading back --%>
<input type="hidden" id="strtTime" name="strtTimeP" value="<%=strtTime%>" class="shortbox">
<input type="hidden" id="lastPt" value="<%=nPts%>" class="shortbox">
<input type="hidden" id="initlzd" name="initlzd" value=<%=isinit%>>
<input type="hidden" id="whichcurves" name="whichcurves" value=<%=whatlines%>>
<input type="<%=dbtype%>" id="whichcurve" name="whichcurve" value=<%=currline%>>
<input type="<%=dbtype%>" id="allcurves" name="allcurves" value=<%=totlines%>>
<% for( jdx = 0; jdx < totlines; jdx++ ) {
	String id1 = "whichparam1_" + jdx;
	String id2 = "whichparam2_" + jdx;
	String id3 = "whichparam3_" + jdx; %>
	<input type="<%=dbtype%>" id="<%=id1%>" name="<%=id1%>" value=<%=rise[jdx]%>>
	<input type="<%=dbtype%>" id="<%=id2%>" name="<%=id2%>" value=<%=run[jdx]%>>
	<input type="<%=dbtype%>" id="<%=id3%>" name="<%=id3%>" value=<%=intercept[jdx]%>>
<% } %>
</span>
</form>
</body>
</html>