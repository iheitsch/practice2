<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Plotting Curves</title>
<link rel="stylesheet" href="PlotCurves.css" type="text/css">
<script src="PlotCurves.js"></script>
</head>
<% 
// add horizontal and vertical lines fixit
int MAXPT = 10;
int MAXPTS = 21;
int MAXCURVES = 5;
double TOL = 0.00001;

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
int variation = 0;
int currentc = 0;
int numcurves = 0;
int [] par1 = new int[MAXCURVES];
int [] par2 = new int[MAXCURVES];
int [] par3 = new int[MAXCURVES];
int [] par4 = new int[MAXCURVES];
String whatcurves = "0";
String currcurve = "0";
String totcurves = "0";
String [] param1 = new String[MAXCURVES];
String [] param2 = new String[MAXCURVES];
String [] param3 = new String[MAXCURVES];
String [] param4 = new String[MAXCURVES];

String whatTable = "";
String tmp = "";    // temporary storage for newly gotten 
                    // request parameter      
String isSelected = "selected";
//String [] isNowSelected = new String[numsels];
String itype = "hidden";
String dbtype = "hidden";
String instrs = "Choose Curve Type";
String instr2 = "";

int numsels = 6;
String [] slctopts = { "Line", "Circle", "Ellipse", "Parabola", "Hyperbola", "Quadratic" };
String [] isNowSelected = { "Lines", "Circles", "Ellipses", "Parabolas", "Hyperbolas", "Quadratics" };
String numAttmptdV = "0";
String numWoErr = "0";
String consWoErr = "0";
String corrPerHr = "0";
String strtTime = String.valueOf(System.currentTimeMillis());
String errct = "0";  
String isinit = "false";
String indvar = "X";
String depvar = "Y";
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

numcurves = Integer.parseInt(totcurves);
String tmpStr;
for( idx = 0; idx <numcurves; ++idx ) {
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
	tmpStr = "whichparam4_" + idx;
	if(( tmp = request.getParameter(tmpStr)) != null) {
		param4[idx] = tmp.toString();
	}
}
boolean isLine = false;
boolean isCircle = false;
boolean isEllipse = false;

//retrieves the value of the DOM object with name="chs"
if(( tmp = request.getParameter("chs")) != null) {
	whatTable = tmp.toString();
	isSelected = "";
	for( kdx = 0; kdx < numsels; ++kdx ) {
		if( slctopts[kdx].equals(whatTable) ) {
			isNowSelected[kdx] = "selected";
        	itype = "text";

        	//comma = ",";
        	break;
        }
	}
    
    currentc = 0;
    variation = Integer.parseInt(whatcurves);
	currentc = Integer.parseInt(currcurve);
	//System.out.println("whatTable: " + whatTable + " variation: " + variation + " currentc: " + currentc);
	isLine = whatTable.equals("Line");
	isCircle = whatTable.equals("Circle");
	isEllipse = whatTable.equals("Ellipse");
	if( isLine ) {
		int sign = 2*Math.random() > 1? 1 : -1; 
    	 
    	int [] pfactors = {2, 3, 5, 7};
    	int plength = pfactors.length;
    	//System.out.println("read from page and converted variation: " + variation + " currentc: " + currentc);
    	if( variation == 0 ) {
    		variation = 1 + (int)(3*Math.random());
    		currentc = 0;
    		par1[0] = sign*(1 + (int)((MAXPT-1)*Math.random()));
    		par2[0] = 1 + (int)((MAXPT-1)*Math.random()); 
       		// reduce
       		for( int i = 0; i < plength; ++i ) {
    	   		while( par1[0]%pfactors[i] == 0 && par2[0]%pfactors[i] == 0 ) {
    	   			par1[0] = par1[0]/pfactors[i];
    	   			par2[0] = par2[0]/pfactors[i];
    	   		}
       		}
       		par3[0] = (int)(MAXPTS*Math.random()) - MAXPT;
	    	if( variation == 1 ) {
	   			// same intercept
	    		numcurves = 4;
	    		// generate all the lines at once and store in arrays
	    		for( idx = 1; idx < numcurves; idx++ ) {
		    		sign = 2*Math.random() > 1? 1 : -1;
		    		//make sure you don't generate repeats
		    		boolean duplicate = true;
		    		while( par2[idx] == 0 || duplicate ) {
		    			duplicate = false;
		   				par1[idx] = sign*(1 + (int)(9*Math.random()));
		   				par2[idx] = 1 + (int)((MAXPT-1)*Math.random());
		   				// reduce
		   	       		for( int i = 0; i < plength; ++i ) {
		   	    	   		while( par1[idx]%pfactors[i] == 0 && par2[idx]%pfactors[i] == 0 ) {
		   	    	   			par1[idx] = par1[idx]/pfactors[i];
		   	    	   			par2[idx] = par2[idx]/pfactors[i];
		   	    	   		}
		   	       		}
		   				for( int i = 0; i < idx; ++i ) {
		   					if( (double)par1[i]/par2[i] == (double)par1[idx]/par2[idx]) {
		   						duplicate = true;
		   					}
		   				}
		    		}
	   				par3[idx] = par3[idx-1];   				
	    		}
	    	} else if( variation == 2 ) {
	    		// same slope
	   			numcurves = MAXCURVES;
	   			for( idx = 1; idx < numcurves; idx++ ) {
		   			par1[idx] = par1[idx-1];
		   			par2[idx] = par2[idx-1];
		    		//make sure you don't generate repeats
		   			boolean duplicate = true;
		    		while( duplicate ) {
		    			duplicate = false;
	    				par3[idx] = (int)(MAXPTS*Math.random()) - MAXPT;
	    				for( int i = 0; i < idx; ++i ) {
		   					if( par3[i] == par3[idx] ) {
		   						duplicate = true;
		   						break;
		   					}
		   				}
		    		}
	   			}
	   		} else {
	   			// perpendicular
	    		numcurves = 2;
	    		for( idx = 1; idx < numcurves; idx++ ) {
	    			par1[idx] = -par2[idx-1];
	    			par2[idx] = par1[idx-1];
	   				par3[idx] = (int)(MAXPTS*Math.random()) - MAXPT;	    			
	    		}
	   		}
    	} else {  		
    		currentc += 1;
    		for( idx = 0; idx < numcurves; idx++ ) {
    			// read all the slopes and intercepts so you can write them again		
    			par1[idx] = Integer.parseInt(param1[idx]);
    			par2[idx] = Integer.parseInt(param2[idx]);
    			par3[idx] = Integer.parseInt(param3[idx]);
    		}
   		}
  		//need to make these all integers, check for yval < -10 or > 10
   		double ypt;
   		nPts = 0; 
   		for( int i = 0; i < MAXPTS && currentc < numcurves; i += 1 ) {
    		xpoints[nPts] = (int)(i - MAXPT);
   			ypt = par1[currentc]*xpoints[nPts]/(double)par2[currentc] + par3[currentc];
   			ypoints[nPts] = (int)ypt;
   			if( ypoints[nPts] >= -MAXPT && ypoints[nPts] <= MAXPT && (double)ypoints[nPts] == ypt ) {
   				nPts += 1;
   			}
		}
   		int arise = Math.abs(par1[currentc]);
   		int arun = Math.abs(par2[currentc]);

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
   		if( par1[currentc]*par2[currentc] < 0 ) {
	    	intermed = "-" + intermed;
	    	sgn = "-";
	    }
	    if( arun != 1 ) {
	    	intermed += "/" + arun + ")";
   			dnmnatr = Integer.toString(arun);
	    }
   		instr2 = "Plot the Line: " + depvar + " = "; 		
	    instr2 += intermed;
	    instr2 += indvar;
	    if( par3[currentc] != 0 ) {
		    if( par3[currentc] < 0 ) {
		    	instr2 += " - ";
		    } else if( par3[currentc] > 0 ){
		    	instr2 += " + ";
		    }
	    	instr2 += Math.abs(par3[currentc]);
	    }
	    instrs = "Fill out as much of table as needed";
    	//System.out.println("after setting totlines: " + numcurves + " variation: " + variation + " rise: " + par1[currentc] + " run: " + par2[currentc] + " intercept: " + par3[currentc]);
    } else if( isCircle || isEllipse ) { // end isLine 
    	//sometimes hangs fixit
    	// sometimes only generates two points fixit
    	int maxvar = isCircle? 2 : 3;
    	if( variation == 0 ) {
    		numcurves = 4;
    		variation = (int)(1 + maxvar*Math.random());
    		currentc = 0;
			
    		int maxrad = 1;
    		int minrad = 2;
    		int diff = 0;
    		int maxyc = 0;
    		int maxxc = 0;
    		while( maxrad <= minrad ) {
	    		par1[0] = (int)(1 + (MAXPT-1)*Math.random()); // radius try making it a multiple of five, no need to keep it 1/2 on the graph fixit
				par4[0] = par1[0]; 
	    		if( isEllipse ) { // other radius for ellipse
	    			par4[0] = (int)(1 + (MAXPT-1)*Math.random());
	    		}
	    		//double ratio = par1[0]/par4[0];
	    		diff = par4[0] - par1[0];
    			minrad = diff < 0? -diff + 1 : 1; // keeps radius from being 0 or negative
				par2[0] = (int)(MAXPTS*Math.random()) - MAXPT; // x center coordinate
				// need at least 3 point to specify a circle. Sine you're restricting points to integers
				// there needs to be at least half a circle or ellipse on the graph
				maxyc = Math.abs(par2[0]) + par4[0] > MAXPT? MAXPT - par4[0]: MAXPT;
				par3[0] = (int)(1 + (maxyc-1)*Math.random()) - maxyc/2; // y center coordinate
				// center coordinate plus radius cannot be off the graph for both x and y
				int minxdist = MAXPT - Math.abs(par2[0]);
				int minydist = MAXPT - Math.abs(par3[0]) - diff;
				// for diff < 0, 1st and 2nd smallest distance may both be distance to left or right edge
				int minodist = MAXPT + Math.abs(par3[0]) - diff;
				if( diff < 0 ) {
					minodist = MAXPT + Math.abs(par2[0]);
				}
				int frstsmallest = minxdist < minydist? minxdist : minydist;
				// find second smallest
				if( frstsmallest == minxdist ) {
					maxrad = minodist < minydist? minodist : minydist;
				} else {
					maxrad = minodist < minxdist? minodist : minxdist; 
				}
    		}
			//System.out.println("init var: " + variation + " cx0: " + par2[0] + " cy: " + par3[0] +  " rx: " + par1[0] + " ry: " + par4[0] + " maxrad: " + maxrad + " minrad: " + minrad);
    		if( variation == 1 ) { // vary x or y position
	    		numcurves = 4; // sometimes generates only 2 points fixit xc0 -8 yc0 1 xr0 3 yr0 9
	    		// xr: 3 xc: -8 yc: 3 yr: 9 currentc: 2
	    		// generate all the parameters at once and store in arrays
	    		for( idx = 1; idx < numcurves; idx++ ) {
		    		//make sure you don't generate repeats
		    		boolean duplicate = true;
		    		while( duplicate ) {
		    			duplicate = false;
		    			if( par4[0] <= par1[0] ) {
			    			par2[idx] = (int)(MAXPTS*Math.random()) - MAXPT; // x center coordinate
			    			// need at least 3 point to specify a circle. Sine you're restricting points to integers
			    			// there needs to be at least half a circle or ellipse on the graph.
			    			maxyc = Math.abs(par2[idx]) + par1[0] > MAXPT? MAXPT - par4[0]: MAXPT;
			    			par3[idx] = (int)(1 + (maxyc-1)*Math.random()) - maxyc/2; // y center coordinate
			   				for( int i = 0; i < idx; ++i ) {
			   					if( par2[i] == par2[idx] && par3[i] == par3[idx] ) {
			   						duplicate = true;
			   						break;
			   					}
			   				}
		    			} else {
		    				par3[idx] = (int)(MAXPTS*Math.random()) - MAXPT;
		    				maxxc = Math.abs(par3[idx]) + par4[0] > MAXPT? MAXPT - par1[0]: MAXPT;
			    			par2[idx] = (int)(1 + (maxxc-1)*Math.random()) - maxxc/2;
		    				for( int i = 0; i < idx; ++i ) {
			   					if( par2[i] == par2[idx] && par3[i] == par3[idx] ) {
			   						duplicate = true;
			   						break;
			   					}
			   				}
		    			}
		    		}
	    			par1[idx] = par1[idx-1];
	    			par4[idx] = par4[idx-1]; 
	    		}
			} else if( variation == 2 ) { // vary radius	
				numcurves = numcurves > maxrad - minrad? maxrad - minrad + 1: numcurves;
				for( idx = 1; idx < numcurves; idx++ ) {					
					// if numcurves > maxrad, this will infinite loop			
		    		boolean duplicate = true;
		    		while( duplicate ) {
		    			duplicate = false;
		    			par1[idx] = (int)(minrad + (1+maxrad-minrad)*Math.random());
		    			//System.out.println("par1[" + idx + "]: " + par1[idx]);
		   				for( int i = 0; i < idx; ++i ) {
		   					if( par1[i] == par1[idx] ) {
		   						duplicate = true;
		   					}
		   				}
		    		}
	    			par2[idx] = par2[idx-1];
	    			par3[idx] = par3[idx-1];
	    			par4[idx] = diff + par1[idx];
	    		}
			} else { // vary other radius
				numcurves = numcurves > maxrad - minrad? maxrad - minrad : numcurves;
				boolean varya = (int)(11*Math.random()) > 5; 
	    		
	    		for( idx = 1; idx < numcurves; idx++ ) {
	    			boolean duplicate = true;
		    		if( varya ) {
			    		par4[idx] = par4[idx-1];
		    			while( duplicate ) {
				    		duplicate = false;
			    			double rnum = (maxrad-1)*Math.random();
					    	par1[idx] = (int)(1 + rnum);
					    	//System.out.println("rnum: " + rnum + " radx[" + idx + "]: " + par1[idx]);
				   			for( int i = 0; i < idx; ++i ) {
				   				//System.out.println("i: " + i + " par1i: " + par1[i] + " par1[" + idx + "]: " + par1[idx] + " par4i: " + par4[i] + " par4[" + idx + "]: " + par4[idx]);
				   				if( par1[i] == par1[idx] && par4[i] == par4[idx] ) {
				   					duplicate = true;
				   				}
				   			}
				    	}
		    		} else {
		    			par1[idx] = par1[idx-1];
			    		while( duplicate ) {
			    			duplicate = false;
			    			double rnum = (maxrad+diff-1)*Math.random();
					    	par4[idx] = (int)(1 + rnum);
					    	//System.out.println("rnum: " + rnum + " rady[" + idx + "]: " + par4[idx]);
			   				for( int i = 0; i < idx; ++i ) {
				   				//System.out.println("i: " + i + " par1i: " + par1[i] + " par1[" + idx + "]: " + par1[idx] + " par4i: " + par4[i] + " par4[" + idx + "]: " + par4[idx]);
			   					if( par4[i] == par4[idx] && par1[i] == par1[idx]) {
			   						duplicate = true;
			   					}
			   				}
			    		}		    		
		    		}
		    		par2[idx] = par2[idx-1];
	    			par3[idx] = par3[idx-1];
	    			//System.out.println("xrad[" + idx + "]: " + par1[idx] + " yrad: " + par4[idx]);
				}
			}
    		//System.out.println("numcurves: " + numcurves + " maxrad: " + maxrad + " vratn: " + variation); 
    	} else {
	    	currentc += 1;
    		for( idx = 0; idx < numcurves; idx++ ) {
    			// read all the slopes and intercepts so you can write them again		
    			par1[idx] = Integer.parseInt(param1[idx]);
    			par2[idx] = Integer.parseInt(param2[idx]);
    			par3[idx] = Integer.parseInt(param3[idx]);
    			par4[idx] = Integer.parseInt(param4[idx]);
    		}
    	}
   		// go left to right accross top of circle, then right to left accross bottom
   		// need to make these all integers, check for yval < -10 or > 10
   		nPts = 0;
    	for( int i = 0; i < MAXPTS && currentc < numcurves; i += 1 ) {	
    		xpoints[nPts] = (int)(i - MAXPT);
    		double ypt = (double)(xpoints[nPts]-par2[currentc])/(double)par1[currentc];
    		ypt = Math.pow(ypt, 2.);
    		ypt = (double)par4[currentc]*Math.sqrt((1-ypt));
   			ypt = par3[currentc] + ypt;
   			ypoints[nPts] = ypt > 0? (int)((1000*ypt + 5)/1000) : (int)((1000*ypt - 5)/1000);
   			//System.out.println("x[" + nPts + "]: " + xpoints[nPts] + " ypt: " + ypt + " ypoints[" + nPts + "]: " + ypoints[nPts]);
   			if( ypoints[nPts] >= -MAXPT && ypoints[nPts] <= MAXPT && Math.abs((double)ypoints[nPts] - ypt) < .00001 ) {
   				nPts += 1;	   				
   			}
		}
		//boolean firstinst = true;
		//System.out.println("xr: " + par1[currentc] + " xc: " + par2[currentc] + " yc: " + par3[currentc] + " yr: " + par4[currentc]);
    	for( int i = MAXPTS - 1; i >= 0  && currentc < numcurves; i -= 1 ) {
    		xpoints[nPts] = (int)(i - MAXPT);
    		double ypt = (double)(xpoints[nPts]-par2[currentc])/(double)par1[currentc];
    		ypt = Math.pow(ypt, 2.);
    		ypt = (double)par4[currentc]*Math.sqrt((1-ypt));
    		double npt = par3[currentc] - ypt;
   			ypoints[nPts] = npt > 0? (int)((1000*npt + 5)/1000) : (int)((1000*npt - 5)/1000);
   			//System.out.println("x[" + nPts + "]: " + xpoints[nPts] + " npt: " + npt+ " ypoints[" + nPts + "]: " + ypoints[nPts]);
   			if( ypoints[nPts] >= -MAXPT && ypoints[nPts] <= MAXPT && Math.abs((double)ypoints[nPts] - npt) < TOL ) {
	   			boolean duplicate = false;
	   			for( int j = nPts-1; j >= 0; --j ) {
	   				if( xpoints[nPts] == xpoints[j] && ypoints[nPts] == ypoints[j] ) {
	   					duplicate = true;
	   					break;
	   				}
	   			}
	   			if( !duplicate ) {
	   				nPts += 1;
	   			}
   			}
		}
   		//System.out.println("done generating " + nPts + " points");
   		//for( int i = 0; i < nPts; ++i ) {
   			//System.out.println("xpoints[" + i + "]: " + xpoints[i] + " ypoints[" + i + "]: " + ypoints[i]);
   		//}
		String xcent = "X";
		if( par2[currentc] < 0 ) {
			xcent = "( X" + "+" + Math.abs(par2[currentc]) + " )";
		} else if (par2[currentc] > 0 ) {
			xcent = "( X" + "-" + Math.abs(par2[currentc]) + " )";
		}
		String ycent = "Y";
		if( par3[currentc] < 0 ) {
			ycent = "( Y" + "+" + Math.abs(par3[currentc]) + " )";
		} else if (par3[currentc] > 0 ) {
			ycent = "( Y" + "-" + Math.abs(par3[currentc]) + " )";
		}
		String rst = "";
		if( isCircle ) {
			rst = xcent + "<sup>2</sup> + " + ycent + "<sup>2</sup> = " + par1[currentc] + "<sup>2</sup>";
		} else {
			rst = "( " + xcent + "/" + par1[currentc] + " )" +  "<sup>2</sup> + ";
			rst += "( " + ycent + "/" + par4[currentc] + " )" +  "<sup>2</sup> = 1";
		}
		instr2 = "Plot the " + whatTable + ": " + rst;
		instrs = "Fill out as much of table as needed";
    }
    //System.out.println("user chose: " + whatTable + " numcurves: " + numcurves + " currentc: " + currentc);
} %>
<body>
<form id="plots">
<%	if( isLine ) { %>
<table id="whatpts">
<tr>
	<td class="pre" id="c-1_0"></td>
	<th class="hdr rem"><%=indvar%></th>
<% 	if( !dnmnatr.equals("") && (par3[currentc] != 0 || !nmratr.equals("")) ) { %>
			<td class="tmp"></td>
			<th class="hdr rem" id="on">
				<table>
				<tr>
				<div class="num" id="hn"><%=sgn%><%=indvar%></div>
				<div class="denom" id="ht"><%=dnmnatr%></div>
				</tr>
				</table>	
			</th>

<% 		if( !nmratr.equals("") && par3[currentc] != 0 ) { %>
			<td class="tmp"></td>
			<th class="hdr rem" id="om">
				<table>
				<tr>
				<div class="num" id="hm"><%=sgn%><%=nmratr%><%=indvar%></div>
				<div class="denom"><%=dnmnatr%></div>
				</tr>
				</table>	
			</th>
<% 		} %>
<% } 
	if( dnmnatr.equals("") && !nmratr.equals("") && par3[currentc] != 0 ) { %>
		<td class="tmp"></td>
		<th class="hdr rem" id="hn"><%=sgn%><%=nmratr%><%=indvar%></th>
<% } %>
	<td class="tmp"></td>
	<th class="hdr rem"><%=depvar%></th>
</tr>
<% for( int i = 0; i < nPts; ++i ) { 
	//String bkClr = "c" + i%nClrs; 
	String rclass = "r" + i;
	String xid = "x" + i;
	col = 0;
	String nid = "n" + i;
	String tid = "t" + i;
	String yid = "y" + i; 
	String hid = "h" + i;
	col = 0;
	String cid = "c" + i + "_" + col; %>
<tr>
<td class="pre" id="<%=cid%>" ></td>
<td class=" <%=rclass%> rem xpts" id="<%=xid%>" ><%=xpoints[i]%></td>
<% 	if( !dnmnatr.equals("") && (par3[currentc] != 0 || !nmratr.equals("")) ) { 
		col += 1;
		cid = "c" + i + "_" + col;
		tid = "t" + col + "_" + i; %>
		<td class="tmp" id="<%=cid%>"></td>
		<td class=" <%=rclass%> rem" >
			<input id="<%=tid%>" class="nput tBx" type="hidden" onkeydown="erase( event )" onkeyup="checkA( event )" >
		</td>
<%		if( !nmratr.equals("") && par3[currentc] != 0 ) { 
			col += 1;
			cid = "c" + i + "_" + col;
			nid = "n" + col + "_" + i;  %>
			<td class="tmp" id="<%=cid%>" ></td>
			<td class=" <%=rclass%> rem" >
				<input id="<%=nid%>" class="nput nBx" type="hidden" onkeydown="erase( event )" onkeyup="checkA( event )" >
			</td>
<% 		} %>
<% 	}
	if( dnmnatr.equals("") && !nmratr.equals("") && par3[currentc] != 0 ) { 
		col += 1;
		cid = "c" + i + "_" + col;
		nid = "n" + col + "_" + i; %>
		<td class="tmp" id="<%=cid%>" ></td>
		<td class=" <%=rclass%> rem" >
			<input id="<%=nid%>" class="nput nBx" type="hidden" onkeydown="erase( event )" onkeyup="checkA( event )" >
		</td>
<%	} 
	col += 1;
	cid = "c" + i + "_" + col; 
	yid = "y" + col + "_" + i; %>
<td class="tmp" id="<%=cid%>" ></td>
<td class=" <%=rclass%> rem" >
	<input id="<%=yid%>" class="nput ypts" type="hidden" onkeydown="erase( event )" onkeyup="checkA( event )" >
</td>
<td <%=rclass%> rem" >
	<input id="<%=hid%>" type="<%=dbtype%>" value="<%=ypoints[i]%>" >
</td>
</tr>

<% } %>
<tr>
<td class="pre invisible">__________</td>
<td class="tmp"></td>
<% 	if( !dnmnatr.equals("") && (par3[currentc] != 0 || !nmratr.equals("")) ) { %>
		<td class="tmp"></td>
		<td class="tmp"></td>
<%		if( !nmratr.equals("") && par3[currentc] != 0 ) { %>
			<td class="tmp"></td>
			<td class="tmp"></td>
<% 		} %>
<% 	}
	if( dnmnatr.equals("") && !nmratr.equals("") && par3[currentc] != 0 ) { %>
		<td class="tmp"></td>
		<td class="tmp"></td>
<%	} %>
<td class="tmp"></td>
<td class="tmp"></td>
<td class="tmp"></td>
</tr>
</table>
<% } else if( isCircle ) {
		String cclass = "l0";
		int cindx = 0;
		String nm = indvar;
		int xOffs = par2[currentc];
		boolean XisOff = xOffs != 0;
		if( XisOff ) {			
			String sin = " - ";
			if( xOffs < 0 ) {
				xOffs = Math.abs(xOffs);
				sin = " + ";
			}
			nm = indvar + sin + xOffs;
		} 		 
		String iid = "";
		String qid = ""; %>
<table id="whatpts">
<tr>
	<td class="pre" id="c-1_0"></td>
	<th class="hdr rem"><%=indvar%></th>	
<% 	if( XisOff ) { 
		cindx += 1;
		cclass = "l" + cindx;
		iid = "i" + cindx; 
		qid = "q" + cindx; %>
		<td class="tmp <%=cclass%>"></td>
		<th class="hdr rem  <%=iid%>" id="<%=qid%>"></th>
		<input type="hidden" id="<%=iid%>" value="<%=nm%>">	
<%		nm = "( " + nm + " )";
	} 
	cindx += 1;
	cclass = "l" + cindx;
	iid = "i" + cindx; 
	qid = "q" + cindx; %>
	<td class="tmp <%=cclass%>"></td>
	<th class="hdr rem  <%=iid%>" id="<%=qid%>"></th>
	<input type="hidden" id="<%=iid%>" value="<%=nm%><sup>2</sup>">
<%	cindx += 1;
	cclass = "l" + cindx;
	iid = "i" + cindx; 
	qid = "q" + cindx; %>
	<td class="tmp <%=cclass%>"></td>
	<th class="hdr rem  <%=iid%>" id="<%=qid%>"></th>
	<input type="hidden" id="<%=iid%>" value="<%=par1[currentc]%><sup>2</sup> - <%=nm%><sup>2</sup>">
<% 	if( par3[currentc] != 0 ) {
		cindx += 1;
		cclass = "l" + cindx;
		iid = "i" + cindx; 
		qid = "q" + cindx; 
		String ival = "+/- &#x221A <span class='oline'>";
		ival += par1[currentc];
		ival += "<sup>2</sup> - " + nm + "<sup>2</sup></span>"; %>
		<td class="tmp"></td>
		<th class="hdr rem  <%=iid%>" id="<%=qid%>"></th>
		<input type="hidden" id="<%=iid%>" value="<%=ival%>">		
<%	} %>
	<td class="tmp"></td>
	<th class="hdr rem"><%=depvar%></th>
</tr>
<% for( int i = 0; i < nPts; ++i ) { 
	String bkClr = "c" + i%nClrs; 
	String rclass = "r" + i; // for highlighting current row
	String xid = "x" + i;
	String yid = "y" + i;
	String hid = "h" + i;
	String mid = "m" + i;
	String sid = "s" + i;
	String did = "d" + i;
	String rid = "r" + i;
	col = 0;	 
	cindx = 0;
	String iclass = "i" + cindx;
	String cid = "c" + i + "_" + cindx;
	cclass = "l" + cindx; %>
<tr>
	<td class="pre" id="<%=cid%>" ></td>
	<td class=" <%=rclass%> rem xpts" id="<%=xid%>" ><%=xpoints[i]%></td>
	<% 	if( XisOff ) { 
		cindx += 1;
		cclass = "l" + cindx;
		iclass = "i" + cindx;
		cid = "c" + i + "_" + cindx; 
		mid = "m" + cindx + "_" + i; %>
		<td id="<%=cid%>" class="tmp <%=cclass%>"></td>
		<td class="rem <%=iclass%>  <%=rclass%>">
			<input type="hidden" id="<%=mid%>" class="mBx" onkeydown="erase( event )" onkeyup="checkA( event)">
		</td>
<%	} 
	cindx += 1;
	cclass = "l" + cindx;
	iclass = "i" + cindx;
	cid = "c" + i + "_" + cindx;
	sid = "s" + cindx + "_" + i; %>
	<td id="<%=cid%>" class="tmp <%=cclass%>"></td>
	<td class="rem <%=iclass%>  <%=rclass%>">
		<input type="hidden" id="<%=sid%>" class="sBx" onkeydown="erase( event )" onkeyup="checkA( event)">
	</td>
<%	cindx += 1;
	cclass = "l" + cindx;
	iclass = "i" + cindx;
	cid = "c" + i + "_" + cindx;
	did = "d" + cindx + "_" + i; %>
	<td id="<%=cid%>" class="tmp <%=cclass%>"></td>
	<td class="rem <%=iclass%>  <%=rclass%>">
		<input type="hidden" id="<%=did%>" class="dBx" onkeydown="erase( event )" onkeyup="checkA( event)">
	</td>
<% 	if( par3[currentc] != 0 ) { 
		cindx += 1;
		cclass = "l" + cindx;
		iclass = "i" + cindx;
		cid = "c" + i + "_" + cindx;
		rid = "r" + cindx + "_" + i; %>
		<td id="<%=cid%>" class="tmp <%=cclass%>"></td>
		<td class="rem <%=iclass%>  <%=rclass%>">
			<input type="hidden" id="<%=rid%>" class="rBx" onkeydown="erase( event )" onkeyup="checkA( event )">
		</td>
<%	} 
	cindx += 1;
	cid = "c" + i + "_" + cindx; 
	yid = "y" + cindx + "_" + i; %>
	<td  id="<%=cid%>" class="rem tmp" >
	<td class=" <%=rclass%> rem" >
		<input id="<%=yid%>" class="nput ypts" type="hidden" onkeydown="erase( event )" onkeyup="checkA( event )" >		
		<input id="<%=hid%>" type="<%=dbtype%>" value="<%=ypoints[i]%>" >
	</td>
</tr>
<% } %>
<tr>
<td class="pre invisible">__________</td><td></td><td></td><td></td>
</table>
<% } else if( isEllipse ) {
		String cclass = "l0";
		int cindx = 0;
		String nm = indvar;
		int xOffs = par2[currentc];
		boolean XisOff = xOffs != 0;
		if( XisOff ) {			
			String sin = " - ";
			if( xOffs < 0 ) {
				xOffs = Math.abs(xOffs);
				sin = " + ";
			}
			nm = indvar + sin + xOffs;
		} 		 
		String iid = "";
		String qid = ""; %>
<table id="whatpts">
<tr>
	<td class="pre" id="c-1_0"></td>
	<th class="hdr rem"><%=indvar%></th>	
<% 	if( XisOff ) { 
		cindx += 1;
		cclass = "l" + cindx;
		iid = "i" + cindx; 
		qid = "q" + cindx; %>
	<td class="tmp <%=cclass%>"></td>
	<th class="hdr rem  <%=iid%>" id="<%=qid%>"></th>
	<input type="hidden" id="<%=iid%>" value="<%=nm%>">	
<%		nm = "( " + nm + " )";
	}
	if( par1[currentc] != 1 ) {
		cindx += 1;
		cclass = "l" + cindx;
		iid = "i" + cindx; 
		qid = "q" + cindx; %>
	<td class="tmp <%=cclass%>"></td>
	<th class="hdr rem  <%=iid%>" id="<%=qid%>"></th>
	<input type="hidden" id="<%=iid%>" value="<%=nm%>/<%=par1[currentc]%>">
<% 	}
	cindx += 1;
	cclass = "l" + cindx;
	iid = "i" + cindx; 
	qid = "q" + cindx; %>
	<td class="tmp <%=cclass%>"></td>
	<th class="hdr rem  <%=iid%>" id="<%=qid%>"></th>
	<input type="hidden" id="<%=iid%>" value="(<%=nm%>/<%=par1[currentc]%>)<sup>2</sup>">
<%	cindx += 1;
	cclass = "l" + cindx;
	iid = "i" + cindx; 
	qid = "q" + cindx; 
	String ival = nm + "/" + par1[currentc];
	ival = "(" + ival + ")";
	ival = ival + "<sup>2</sup>";
	ival = "1 - " + ival;
	%>
	<td class="tmp <%=cclass%>"></td>
	<th class="hdr rem  <%=iid%>" id="<%=qid%>"></th>
	<input type="hidden" id="<%=iid%>" value="<%=ival%>">
<% 	if( par4[currentc] != 1 || par3[currentc] != 0 ) {  // radius is significant and y is offset 
		cindx += 1;
		cclass = "l" + cindx;
		iid = "i" + cindx; 
		qid = "q" + cindx; 		
		ival = "+/- &#x221A <span class='oline'>" + ival + "</span>"; %>
	<td class="tmp <%=cclass%>"></td>
	<th class="hdr rem  <%=iid%>" id="<%=qid%>"></th>
	<input type="hidden" id="<%=iid%>" value="<%=ival%>">
<% 	}
if( par4[currentc] != 1 && par3[currentc] != 0 ) {  // y is offset 
		cindx += 1;
		cclass = "l" + cindx;
		iid = "i" + cindx; 
		qid = "q" + cindx; 
		ival = "+/-" + par4[currentc] + " &#x221A <span class='oline'>" + ival + "</span>"; %>
	<td class="tmp <%=cclass%>"></td>
	<th class="hdr rem  <%=iid%>" id="<%=qid%>"></th>
	<input type="hidden" id="<%=iid%>" value="<%=ival%>">		
<%	} %>
	<td class="tmp"></td>
	<th class="hdr rem"><%=depvar%></th>
</tr>
<% for( int i = 0; i < nPts; ++i ) { 
	String bkClr = "c" + i%nClrs; 
	String rclass = "r" + i; // for highlighting current row
	String xid = "x" + i;
	String yid = "y" + i;
	String hid = "h" + i;
	cindx = 0;
	String mid;
	String tid;
	String sid;
	String did;
	String rid;
	String nid;	 
	String iclass = "i" + cindx;
	String cid = "c" + i + "_" + cindx;
	cclass = "l" + cindx; %>
<tr>
	<td class="pre" id="<%=cid%>" ></td>
	<td class=" <%=rclass%> rem xpts" id="<%=xid%>" ><%=xpoints[i]%></td>
<% 	if( XisOff ) { 
		cindx += 1;
		cclass = "l" + cindx;
		iclass = "i" + cindx;
		cid = "c" + i + "_" + cindx; 
		mid = "m" + cindx + "_" + i; %>
	<td id="<%=cid%>" class="tmp <%=cclass%>"></td>
	<td class="rem <%=iclass%>  <%=rclass%>">
		<input type="hidden" id="<%=mid%>" class="mBx" onkeydown="erase( event )" onkeyup="checkA( event)">
	</td>
<%	}
	if( par1[currentc] != 1 ) {
		cindx += 1;
		cclass = "l" + cindx;
		iclass = "i" + cindx;
		cid = "c" + i + "_" + cindx; 
		tid = "t" + cindx + "_" + i;%>
	<td id="<%=cid%>" class="tmp <%=cclass%>"></td>
	<td class="rem <%=iclass%>  <%=rclass%>">
		<input type="hidden" id="<%=tid%>" class="tBx" onkeydown="erase( event )" onkeyup="checkA( event)">
	</td>
<% 	}
	cindx += 1;
	cclass = "l" + cindx;
	iclass = "i" + cindx;
	cid = "c" + i + "_" + cindx;
	sid = "s" + cindx + "_" + i; %>
	<td id="<%=cid%>" class="tmp <%=cclass%>"></td>
	<td class="rem <%=iclass%>  <%=rclass%>">
		<input type="hidden" id="<%=sid%>" class="sBx" onkeydown="erase( event )" onkeyup="checkA( event)">
	</td>
<%	cindx += 1;
	cclass = "l" + cindx;
	iclass = "i" + cindx;
	cid = "c" + i + "_" + cindx; 
	did = "d" + cindx + "_" + i; %>
	<td id="<%=cid%>" class="tmp <%=cclass%>"></td>
	<td class="rem <%=iclass%>  <%=rclass%>">
		<input type="hidden" id="<%=did%>" class="dBx" onkeydown="erase( event )" onkeyup="checkA( event)">
	</td>
<% 	if( par4[currentc] != 1 || par3[currentc] != 0 ) { 
		cindx += 1;
		cclass = "l" + cindx;
		iclass = "i" + cindx;
		cid = "c" + i + "_" + cindx;
		rid = "r" + cindx + "_" + i; %>
	<td id="<%=cid%>" class="tmp <%=cclass%>"></td>
	<td class="rem <%=iclass%>  <%=rclass%>">
		<input type="hidden" id="<%=rid%>" class="rBx" onkeydown="erase( event )" onkeyup="checkA( event )">
	</td>
<%	}
	if( par4[currentc] != 1 && par3[currentc] != 0 ) {
		cindx += 1;
		cclass = "l" + cindx;
		iclass = "i" + cindx;
		cid = "c" + i + "_" + cindx; 
		nid = "n" + cindx + "_" + i; %>
	<td id="<%=cid%>" class="tmp <%=cclass%>"></td>
	<td class="rem <%=iclass%>  <%=rclass%>">
		<input type="hidden" id="<%=nid%>" class="nBx" onkeydown="erase( event )" onkeyup="checkA( event)">
	</td>
<%	}
	cindx += 1;
	cid = "c" + i + "_" + cindx;
	yid = "y" + cindx + "_" + i; %>
	<td  id="<%=cid%>" class="rem tmp" >
	<td class=" <%=rclass%> rem" >
		<input id="<%=yid%>" class="nput ypts" type="hidden" onkeydown="erase( event )" onkeyup="checkA( event )" >		
		<input id="<%=hid%>" type="<%=dbtype%>" value="<%=ypoints[i]%>" >
	</td>
</tr>
<% } %>
<tr>
	<td class="pre invisible">__________</td><td></td><td></td><td></td>
</table>
<% } %>
<span id="instrs"><%=instrs%></span>

<div>
<select id="chs" name="chs" class="slct" >   
	<option <%=isSelected%> >Select</option>
<% 	for( kdx = 0; kdx < numsels; ++kdx ) { 
		String sel = slctopts[kdx]; %>
		<option <%=isNowSelected[kdx]%> ><%=sel%></option>
<% 	} %>
</select>
</div>

<div id="instr2" >
<%=instr2%>
</div>
<div id="frame">
<svg id="xygraph" onmousedown="setMouseDown()" onmouseup="clearMouseDown()">
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
<input type="hidden" id="whichcurves" name="whichcurves" value=<%=variation%>>
<input type="<%=dbtype%>" id="whichcurve" name="whichcurve" value=<%=currentc%>>
<input type="<%=dbtype%>" id="allcurves" name="allcurves" value=<%=numcurves%>>
<% for( jdx = 0; jdx < numcurves; jdx++ ) {
	String id1 = "whichparam1_" + jdx;
	String id2 = "whichparam2_" + jdx;
	String id3 = "whichparam3_" + jdx;
	String id4 = "whichparam4_" + jdx; %>
	<input type="<%=dbtype%>" id="<%=id1%>" name="<%=id1%>" value=<%=par1[jdx]%>>
	<input type="<%=dbtype%>" id="<%=id2%>" name="<%=id2%>" value=<%=par2[jdx]%>>
	<input type="<%=dbtype%>" id="<%=id3%>" name="<%=id3%>" value=<%=par3[jdx]%>>
	<input type="<%=dbtype%>" id="<%=id4%>" name="<%=id4%>" value=<%=par4[jdx]%>>
<% } %>
</span>
</form>
</body>
</html>