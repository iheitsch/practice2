<%-- 
    Document   : FractionArithmetic
    Created on : Jun 1, 2021, 2:28:58 PM
    Author     : irene
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Fraction Arithmetic</title>
        <link rel="stylesheet" href="FractionArithmetic.css" type="text/css">
        <script src="FractionArithmetic.js"></script>
        <script src="Reduce.js"></script>
</head>
<body>
<form id="th-id2">
<% 
    int possbl = 4;
    
    String instrs = "blank";
    String instr2 = "blank";
    String instr3 = "";//Click 'done' when finished";
    final int MAXROWS = 4;
    final int MAXCOLS = 3;
    final int MAXDEN = 25;
    int[] num = new int[MAXROWS];
    int[] den = new int[MAXROWS];
    int whol = 1;
    int maxwhol = 9;
    int nrows = 1;
    int ncols = 1;
    int ntwos = 7; // 6; // one more than actual max
    int nthrees = 4;
    int nfives = 3;
    String whatOp = "&divide";
    boolean isDivide = true;
    final double EXP = 2.4; //4.4;
    int twogen;
    int threegen;
    int fivegen;
    int gran = 100;
    int[] acttwos = new int[2];
    int[] actthrees = new int[2];
    int[] actfives = new int[2];
    int[] actbigs = new int[2];
    int d2fact;
    int d3fact;
    int d5fact;
    double max2;
    double max3;
    double max5;
    int numtwos;
    int numthrees;
    int numfives;
    int n2fact;
    int n3fact;
    int n5fact;
    
    boolean addCk = true;
    String isAdd = "checked";

    boolean subCk = false;
    String isCommonDenom = "";
    
    boolean mulCk = false;
    String isMul = "";
    
    boolean divCk = false;
    String isDiv = "";
    
    // checks is null on first rendition of page, will contain
    // last settings after that so they can be carried forward
    String[] checks = request.getParameterValues("selected");
    int len = 0;
    if( checks != null ) {
        len = checks.length;
        addCk = false;
        isAdd = "";
        subCk = false;
        isCommonDenom = "";
        mulCk = false;
        isMul = "";
        divCk = false;
        isDiv = "";
    }
    for( int i = 0; i < len; ++i ) {
        //System.out.println("checks[" + i + "]: " + checks[i]);
        if( checks[i].compareTo("Add") == 0 ) {
            addCk = true;
            isAdd = "checked";
        } else if( checks[i].compareTo("Sub") == 0 ) {
            subCk = true;
            isCommonDenom = "checked";
        } else if( checks[i].compareTo("Mul") == 0 ) {
            mulCk = true;
            isMul = "checked";       
        } else if( checks[i].compareTo("Div") == 0 ) {
            divCk = true;
            isDiv = "checked";
        }
    }
    
    boolean running = false;
    int indcatr = 0;
    String startHere = "d0_4";
    int lcm = 1;
    
    while( !running ) {
        indcatr = (int)(StrictMath.random()*possbl);
        if( indcatr == 0 && addCk ) {
            running = true;
            instrs = "Add these Fractions.";
            whatOp = "+";
            boolean sameden = (10*Math.random() > 8 );
            //int whatBig = 11;
            for( int i = 0; i < 2; ++i ) {
            	if( i == 1 && sameden ) {
            		acttwos[1] = acttwos[0];
            		actthrees[1] = actthrees[0];
            		actfives[1] = actfives[0];
            	} else {
            		/*
            		int bigsel = (int)(gran*5*Math.random());
            		
            		switch(bigsel) {
            			case 0:
            				whatBig = 11;
            				break;
            			case 1:
            				whatBig = 13;
            				break;
            			case 2:
            				whatBig = 17;
            				break;
            			case 3:
            				whatBig = 19;
            				break;
            			case 4: 
            				whatBig = 23;
            				break;
            		}
            		int biggen = (int)(gran*2*Math.random()); */
            		actbigs[i] = 0; //biggen > gran? 1 : 0;
            		fivegen = (int)(gran*(nfives-actbigs[i])*Math.random());
		            actfives[i] = fivegen > 2*gran? 2 : fivegen > gran? 1 : 0;
		            threegen = (int)(gran*(nthrees-actbigs[i]-actfives[i])*Math.random());
		            actthrees[i] = threegen > 3*gran? 3 : threegen > 2*gran? 2 : threegen > gran? 1 : 0;
		            twogen = (int)(gran*(ntwos-actbigs[i]-actfives[i]-actthrees[i])*Math.random());
		            acttwos[i] = twogen > 5*gran? 5 : twogen > 4*gran? 4 : twogen > 3*gran? 3 : twogen > 2*gran? 2 : twogen > gran? 1 : 0;
		            
		            
            	}
	            d2fact = (int)(StrictMath.pow(2,acttwos[i]));
	            d3fact = (int)(StrictMath.pow(3,actthrees[i]));
	            d5fact = (int)(StrictMath.pow(5,actfives[i]));
	            //int dbigfact = (int)(StrictMath.pow(whatBig,actbigs[i]));
	            den[i] = d2fact*d3fact*d5fact; //*dbigfact;
	
	            max2 = Double.valueOf((den[0]+1)*(1 - Math.random()));
	            numtwos = (int)(Math.log(max2)/Math.log(2));
	            if( numtwos < 0 ) {
	              numtwos = 0;
	            } else if( numtwos > ntwos - 1 ) {
	              numtwos = ntwos - 1;
	            }
	            n2fact = (int)(StrictMath.pow(2,numtwos));
	            System.out.println("den: " + den + " max2: " + max2 + " num2s: " + numtwos + " n2fact: " + n2fact);
	            max3 = Double.valueOf((den[0]/n2fact+1)*(1 - Math.random()));
	            numthrees = (int)(Math.log(max3)/Math.log(3));
	            numthrees = numthrees < 0? 0 : numthrees > nthrees - 1? nthrees - 1: numthrees;
	            //numthrees = (Double.valueOf((actthrees+1)*(1 - Math.pow(Math.random(),EXP)))).intValue();
	            n3fact = (int)(StrictMath.pow(3,numthrees));
	            max5 = Double.valueOf((den[0]/(n2fact*n3fact)+1)*(1 - Math.random())) ;
	            numfives = (int)(Math.log(max5)/Math.log(5));
	            numfives = numfives < 0? 0 : numfives > nfives - 1? nfives - 1: numfives;
	            n5fact = (int)(StrictMath.pow(5,numfives));
	            num[i] = n2fact*n3fact*n5fact;
	
	            //ncols = (int)(acttwos + actthrees + actfives);
            }
            int twodiff = 0;
            lcm = den[0];
            int tot0diff = 0;
            int tot1diff = 0;
            if( acttwos[0] > acttwos[1] ) {
            	twodiff = acttwos[0] - acttwos[1];
            	tot0diff += twodiff;
            } else {
            	twodiff = acttwos[1] - acttwos[0];
            	lcm *= (int)(StrictMath.pow(2,twodiff));
            	tot1diff += twodiff;
            }
            int threediff = 0;
            if( actthrees[0] > actthrees[1] ) {
            	threediff = actthrees[0] - actthrees[1];
            	tot0diff += threediff;;
            } else {
            	threediff = actthrees[1] - actthrees[0];
            	lcm *= (int)(StrictMath.pow(3,threediff));
            	tot1diff += threediff;
            }
            int fivediff = 0;
            if( actfives[0] > actfives[1] ) {
            	fivediff = actfives[0] - actfives[1];
            	tot0diff += fivediff;
            } else {
            	fivediff = actfives[1] - actfives[0];
            	lcm *= (int)(StrictMath.pow(5,fivediff));
            	tot1diff += fivediff;
            }
            ncols = tot0diff > tot1diff? tot0diff : tot1diff;
            ncols += 8; // fixit 1;
            instr2 = "Are both denominators the same?";
            //instr3 = "If so, copy " + den[0] + ", otherwise click after one of the fractions to insert a multiplying factor.";
        } else if( indcatr == 1 && subCk ) {
            running = true;
            instrs = "Subtract 2nd Fraction from the 1st";
            whatOp = "-";
            //nrows = 2 + 2; //(int)(StrictMath.random()*(MAXROWS-1));
            int maxcols = 0;
            ntwos = ntwos - 1;
            nthrees = nthrees - 1;
            nfives = nfives - 1;
            int x = -1;
            int y = 0;/*
            for( int i = 0; i < nrows; ++i ) {
                acttwos = (int)(StrictMath.random()*ntwos);
                actthrees = (int)(StrictMath.random()*nthrees);
                actfives = (int)(StrictMath.random()*nfives);
                int twofact = (int)(StrictMath.pow(2,acttwos));
                int threefact = (int)(StrictMath.pow(3,actthrees));
                int fivefact = (int)(StrictMath.pow(5,actfives));
                den[i] = twofact*threefact*fivefact;
                num[i] = (Double.valueOf((den[i])*(1 - Math.pow(Math.random(),EXP)))).intValue();
                ncols = (int)(acttwos + actthrees + actfives);
                if( ncols > maxcols ) {
                    maxcols = ncols;
                }
                if( i > 0 && num[i] != 0 && num[0] != 0 &&
                        den[i] != den[0] && den[i]%den[0] == 0 ) {
                    x = i;
                }
            } */
            ncols = maxcols;
            isDivide = false;
            if( x < 0 ) {
                for( int i = 0; i <= nrows; ++i ) {
                    for( int j = i+1; j < nrows; ++j ) {
                        if( den[j] != den[i] && num[j] != 0 && num[i] != 0 ) {
                            if( den[i]%den[j] == 0 ) {
                                x = i;
                                y = j;
                            } else if( den[j]%den[i] == 0 ) {
                                x = j;
                                y = i;
                            }  
                        }
                    }
                }

            }
            if( x >= 0 ) {
                startHere = "d" + y + "_1";
                instr2 = "What factor does " + den[x] + " have, but " + den[y] + " does not?";
            } else {
                running = false;
            }
        } else if( indcatr == 2 && mulCk ) {
            running = true;
            instrs = "Multiply these Fractions.";
            whatOp = "&times";
            //instr3 = " Click 'done' when reduced.";
            ntwos = ntwos - 1;
            nthrees = nthrees - 1;
            nfives = nfives - 1;
            twogen = (int)(gran*ntwos*Math.random());
            /*
            acttwos = twogen > 4*gran? 4 : twogen > 3*gran? 3 : twogen > 2*gran? 2 : twogen > gran? 1 : 0;
            d2fact = (int)(StrictMath.pow(2,acttwos));
            threegen = (int)(gran*nthrees*Math.random());
            actthrees = threegen > 2*0.7*gran? 2 : threegen > 0.7*gran? 1 : 0;
            d3fact = (int)(StrictMath.pow(3,actthrees));
            fivegen = (int)(gran*nfives*Math.random());
            actfives = fivegen > 0.7*gran? 1 : 0; // make fives more likely
            d5fact = (int)(StrictMath.pow(5,actfives));
            num[0] = d2fact*d3fact*d5fact;
*/
            max2 = Double.valueOf((num[0]+1)*(1 - Math.random()));
            numtwos = (int)(Math.log(max2)/Math.log(2));
            if( numtwos < 0 ) {
              numtwos = 0;
            } else if( numtwos > ntwos - 1 ) {
              numtwos = ntwos - 1;
            }
            n2fact = (int)(StrictMath.pow(2,numtwos));
            //System.out.println("num: " + num + " max2: " + max2 + " num2s: " + numtwos + " n2fact: " + n2fact);
            max3 = Double.valueOf((num[0]/n2fact+1)*(1 - Math.random()));
            numthrees = (int)(Math.log(max3)/Math.log(3));
            numthrees = numthrees < 0? 0 : numthrees > nthrees - 1? nthrees - 1: numthrees;
            //numthrees = (Double.valueOf((actthrees+1)*(1 - Math.pow(Math.random(),EXP)))).intValue();
            n3fact = (int)(StrictMath.pow(3,numthrees));
            max5 = Double.valueOf((num[0]/(n2fact*n3fact)+1)*(1 - Math.random()));
            numfives = (int)(Math.log(max5)/Math.log(5));
            numfives = numfives < 0? 0 : numfives > nfives - 1? nfives - 1: numfives;
            n5fact = (int)(StrictMath.pow(5,numfives));
            den[0] = n2fact*n3fact*n5fact;
/*
            ncols = (int)(acttwos + actthrees + actfives);
*/
            instr2 = "Copy the numerator: '" + num[0] + "' to the box under the 'divide by' sign";
           //startHere = "d1_1";
        } else if( indcatr == 3 && divCk ) {
            running = true;
            instrs = "Divide 1st Fraction by 2nd.";
            //instr3 = "Click 'done' when reduced.";
            whol = 1 + (int)(StrictMath.random()*maxwhol);
            ntwos = ntwos - 2;
            nthrees = nthrees - 2;
            nfives = nfives - 1;
            den[0] = 1;
            /*
            while( den[0] == 1 ) {
                twogen = (int)(gran*ntwos*Math.random());
                acttwos = twogen > 3*gran? 3 : twogen > 2*gran? 2 : twogen > gran? 1 : 0;
                d2fact = (int)(StrictMath.pow(2,acttwos));
                threegen = (int)(gran*nthrees*Math.random());
                actthrees = threegen > gran? 1 : 0;
                d3fact = (int)(StrictMath.pow(3,actthrees));
                fivegen = (int)(gran*nfives*Math.random());
                actfives = fivegen > gran? 1 : 0;
                d5fact = (int)(StrictMath.pow(5,actfives));
                // keep denominator from being too big and cumbersome
                if( acttwos == 3 && actthrees == 1 && actfives == 1 ) {
                    boolean cutthrees = 2*Math.random() > 1;
                    if( cutthrees ) {
                        d3fact = d3fact/3;
                    } else {
                        d5fact = d5fact/5;
                    }
                }
                den[0] = d2fact*d3fact*d5fact;
            }
            */

            max2 = Double.valueOf((den[0]+1)*(1 - Math.random()));
            numtwos = (int)(Math.log(max2)/Math.log(2));
            if( numtwos < 0 ) {
              numtwos = 0;
            } else if( numtwos > ntwos - 1 ) {
              numtwos = ntwos - 1;
            }
            n2fact = (int)(StrictMath.pow(2,numtwos));
            //System.out.println("num: " + num + " max2: " + max2 + " num2s: " + numtwos + " n2fact: " + n2fact);
            max3 = Double.valueOf((den[0]/n2fact+1)*(1 - Math.random()));
            numthrees = (int)(Math.log(max3)/Math.log(3));
            numthrees = numthrees < 0? 0 : numthrees > nthrees - 1? nthrees - 1: numthrees;
            //numthrees = (Double.valueOf((actthrees+1)*(1 - Math.pow(Math.random(),EXP)))).intValue();
            n3fact = (int)(StrictMath.pow(3,numthrees));
            max5 = Double.valueOf((den[0]/(n2fact*n3fact)+1)*(1 - Math.random()));
            numfives = (int)(Math.log(max5)/Math.log(5));
            numfives = numfives < 0? 0 : numfives > nfives - 1? nfives - 1: numfives;
            n5fact = (int)(StrictMath.pow(5,numfives));
            num[0] = n2fact*n3fact*n5fact;
/*
            ncols = (int)(acttwos + actthrees + actfives);
*/
            instr2 = "Copy the denominator of the fractional part of the mixed number: " + den[0];
        }
    }
%>


<div class="d3"><%=instrs%></div>
<div id="instr2" class="d4"><%=instr2%></div>
<div id="instr3" class="d4"><%=instr3%></div>
<div class="d1">
<table>
<%  if( indcatr < 2 && ( addCk || subCk ) ) {
		String nid = "";
		String did = "";
        //for( int i = 0; i < 2; ++i ) { 
            nid = "n0_0";
            did = "d0_0"; 
            String op = whatOp; 
            String oid = "o0_0"; %>
        <tr>
        <td>
            <table>
                <tr><td class="num">
                    <input disabled="true" value="<%=num[0]%>" id="<%=nid%>" onclick="show()" >  
                </td></tr>
                <tr><td>
                    <input disabled="true" value="<%=den[0]%>" id="<%=did%>" onclick="show()" >
                </td></tr>
            </table>
        </td>
       
<%      String itype = "text";
		String equalSgn = "=";
        
		nid = "n0_1";
        did = "d0_1"; 
        itype = "hidden";
        op = ""; %>
        <td id="<%=oid%>" class="sym"><%=op%></td>
		<td>
			
		    <table>
		        <tr><td> 
		            <input type="<%=itype%>" id="<%=nid%>" onkeyup="checkN( event )" 
		            onkeydown="erase( event )" value="">
		        </td></tr>
		        <tr><td>
		            <input type="<%=itype%>" id="<%=did%>" onkeyup="checkD( event )" 
		            onkeydown="erase( event )" value=""> 
		        </td></tr>
		    </table>
		</td>
<% 		itype = "text";
		op = whatOp; 
		oid = "o0_1"; 
		nid = "n0_2";
        did = "d0_2"; %>
        <td id="<%=oid%>" class="sym"><%=op%></td>
        <td>
            <table>
                <tr><td class="num">
                    <input disabled="true" value="<%=num[1]%>" id="<%=nid%>">  
                </td></tr>
                <tr><td>
                    <input disabled="true" value="<%=den[1]%>" id="<%=did%>">
                </td></tr>
            </table>
        </td>
<%  	itype = "hidden";
    	op = ""; //"&times"; 
    	oid = "o0_2"; 
		nid = "n0_3";
        did = "d0_3"; %>
    <td id="<%=oid%>" class="sym"><%=op%></td>
    <td>
        <table>
            <tr><td>
                <input type="<%=itype%>" id="<%=nid%>" onkeyup="checkN( event )" 
                onkeydown="erase( event )" value="">
            </td></tr>
            <tr><td>
                <input type="<%=itype%>" id="<%=did%>" onkeyup="checkD( event )" 
                onkeydown="erase( event )" value="">     
            </td></tr>
        </table>
    </td>

            

<%		itype = "text";
		String ntd = "num";
		for( int j = 0, k = 3; j < ncols; ++j ) {   
    		String eid = "e0" + "_" + k;
            k = k + 1;
            
            nid = "n0_" + k;
            did = "d0_" + k; 
            oid = "o0_" + k; 
            op = ""; // "&times";  %>
        <td class="sym" id="<%=eid%>"><%=equalSgn%></td>
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" id="<%=nid%>" onkeydown="erase( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeydown="erase( event )" value="">     
                </td></tr>
            </table>
        </td>
        <td id="<%=oid%>" class="sym"><%=op%></td>
    <%          k = k + 1; 
                nid = "n0" + "_" + k;
                did = "d0" + "_" + k; 
                itype = "hidden";
                ntd = "";
                equalSgn = "";
                oid = "o0_" + k;
                op = ""; // whatOp; %>

        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" id="<%=nid%>" onkeyup="checkN( event )" onkeydown="erase( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeyup="checkD( event )" onkeydown="erase( event )" value=""> 
                </td></tr>
            </table>
        </td>
        <td id="<%=oid%>" class="sym"><%=op%></td>
    <%          //itype = "text"; //"hidden";
                //equalSgn = "";
                //op = "";
                k = k + 1;
            nid = "n0" + "_" + k;
            did = "d0" + "_" + k; 
                 
            eid = "e0" + "_" + k; 
            oid = "o0_" + k;
            // op = "&times"; %>
        
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" id="<%=nid%>" onkeydown="erase( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeydown="erase( event )" value="">     
                </td></tr>
            </table>
        </td>
		<td id="<%=oid%>" class="sym"><%=op%></td>
    <%          k = k + 1; 
                nid = "n0" + "_" + k;
                did = "d0" + "_" + k; 
                //itype = "text"; //"hidden";
                ntd = "";
                //equalSgn = ""; %>
        
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" id="<%=nid%>" onkeyup="checkN( event )" onkeydown="erase( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeyup="checkD( event )" onkeydown="erase( event )" value=""> 
                </td></tr>
            </table>
        </td>
    <%          //itype = "hidden";
                ntd = "";
                //equalSgn = "";
                //op = "";
            }
    %>
        </tr>
    <%  } %> 

<tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <th colspan="2"><button type="button" onclick="checkAll()" id="chkBx">Done</button></th>
</tr>
<tr>
<th colspan="10" id="back">
	<div>
	      <a href="/" class="ndx">Home</a>
	</div>
	<div>
	      <a href="index.html" class="ndx">Back to Practice Index</a>
	</div>
</th>
</tr>
</table>

<table id="statusTable">
<% for( int i = 0, j = 1; i < 30; i += 2, j += 2 ) {
    String whatId = "statusBox" + i; 
    String whatId2 = "statusBox" + j; %>
    <tr>
    	<td><%=i%></td><td><div id="<%=whatId%>" style="color:white"></div></td>
    	<td><%=j%></td><td><div id="<%=whatId2%>" style="color:white"></div></td>
    </tr>
<% } %>
</table>

</div>

<%  String numAttmptdV = "0";
    String numWoErr = "0";
    String consWoErr = "0";
    String corrPerHr = "0";
    String strtTime = String.valueOf(System.currentTimeMillis());
    String errs = "0";
    String tmp = "";    // temporary storage for newly gotten 
                        // request parameter      

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
%>
<input type="hidden" id="strtTime" name="strtTimeP" value="<%=strtTime%>" class="shortbox">
<input type="hidden" id="startHere" name="startHere" value="<%=startHere%>" class="shortbox">

<div class="d5">
<table >
<tr>
    <th class="title">Score</th>     
</tr>
<tr>    
    <td><label>Problems Attempted</label></td>
    <td>
    <input type="text" id="numAttmptd" name="numAttmptdP" value="<%=numAttmptdV%>"
           class="blackbox">
    </td>
</tr>
<tr>
    <td><label>Completed Without Error</label></td>   
    <td>
    <input type="text" id="numWoErr" name="numWoErrP" value="<%=numWoErr%>"
           class="blackbox">
    </td>
</tr>
<tr>
    <td><label>Consecutive Without Error</label></td>   
    <td>
    <input type="text" id="consWoErr" name="consWoErrP" value="<%=consWoErr%>"
           class="blackbox">
    </td>
</tr>
<tr>
    <td><label>Correct Per Hour</label></td>   
    <td>
    <input type="text" id="corrPerHr" name="corrPerHrP" value="<%=corrPerHr%>"
           class="blackbox">
    </td>
</tr>
<tr>
    <td><label>Errors This Problem</label></td>
    <td><input type="text" id="errs" name="errs" value="<%=errs%>"
               class="blackbox"></td>
</tr>
</table>
<table >
<tr>
    <th class="title">Types of Problems</th>
</tr>
<tr><td><input type="checkbox" value="Add" name="selected" 
                   <%=isAdd%> onclick="zeroCounts()">
            <label>Add</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="Sub" name="selected" 
                   <%=isCommonDenom%> onclick="zeroCounts()">
            <label>Subtract</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="Mul" name="selected" 
                   <%=isMul%> onclick="zeroCounts()">
            <label>Multiply</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="Div" name="selected" 
                   <%=isDiv%> onclick="zeroCounts()">
            <label>Divide</label>
        </td>
</tr>
</table>
</div>


<input type="hidden" id="indcatr" value="<%=indcatr%>">
<input type="hidden" id="lcm" value="<%=lcm%>">
</form>

</body>
</html>
