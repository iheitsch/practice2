<%-- 
    Document   : ConvertFractions
    Created on : Aug 3, 2020, 3:36:58 PM
    Author     : khalid
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Convert Fractions</title>
        <link rel="stylesheet" href="ConvertFractions.css" type="text/css">
        <script src="ConvertFractions.js"></script>
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
    int ntwos = 6; // one more than actual max
    int nthrees = 4;
    int nfives = 3;
    String whatOp = "&divide";
    boolean isDivide = true;
    final double EXP = 2.4; //4.4;
    boolean showArros = false;
    int twogen;
    int threegen;
    int fivegen;
    int gran = 100;
    int acttwos = 0;
    int actthrees = 0;
    int actfives = 0;
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
    
    boolean simplifyCk = false;
    String isSimplify = "";

    boolean commonDenomCk = false;
    String isCommonDenom = "";
    
    boolean fracToMxCk = true;
    String isFracToMx = "checked";
    
    boolean mxToFracCk = false;
    String isMxToFrac = "";
    
    // checks is null on first rendition of page, will contain
    // last settings after that so they can be carried forward
    String[] checks = request.getParameterValues("selected");
    int len = 0;
    if( checks != null ) {
        len = checks.length;
        simplifyCk = false;
        isSimplify = "";
        commonDenomCk = false;
        isCommonDenom = "";
        fracToMxCk = false;
        isFracToMx = "";
        mxToFracCk = false;
        isMxToFrac = "";
    }
    for( int i = 0; i < len; ++i ) {
        //System.out.println("checks[" + i + "]: " + checks[i]);
        if( checks[i].compareTo("simplify") == 0 ) {
            simplifyCk = true;
            isSimplify = "checked";
        } else if( checks[i].compareTo("commonDenom") == 0 ) {
            commonDenomCk = true;
            isCommonDenom = "checked";
        } else if( checks[i].compareTo("fracToMx") == 0 ) {
            fracToMxCk = true;
            isFracToMx = "checked";       
        } else if( checks[i].compareTo("mxToFrac") == 0 ) {
            mxToFracCk = true;
            isMxToFrac = "checked";
        }
    }
    
    boolean running = false;
    int indcatr = 0;
    String startHere = "d0_1";
    
    while( !running ) {
        indcatr = (int)(StrictMath.random()*possbl);
        if( indcatr == 0 && simplifyCk ) {
            running = true;
            instrs = "Simplify this Fraction.";
            twogen = (int)(gran*ntwos*Math.random());
            acttwos = twogen > 5*gran? 5 : twogen > 4*gran? 4 : twogen > 3*gran? 3 : twogen > 2*gran? 2 : twogen > gran? 1 : 0;
            d2fact = (int)(StrictMath.pow(2,acttwos));
            threegen = (int)(gran*nthrees*Math.random());
            actthrees = threegen > 3*gran? 3 : threegen > 2*gran? 2 : threegen > gran? 1 : 0;
            d3fact = (int)(StrictMath.pow(3,actthrees));
            fivegen = (int)(gran*nfives*Math.random());
            actfives = fivegen > 2*gran? 2 : fivegen > gran? 1 : 0;
            d5fact = (int)(StrictMath.pow(5,actfives));
            den[0] = d2fact*d3fact*d5fact;

            max2 = new Double((den[0]+1)*(1 - Math.random()));
            numtwos = (int)(Math.log(max2)/Math.log(2));
            if( numtwos < 0 ) {
              numtwos = 0;
            } else if( numtwos > ntwos - 1 ) {
              numtwos = ntwos - 1;
            }
            n2fact = (int)(StrictMath.pow(2,numtwos));
            System.out.println("den: " + den + " max2: " + max2 + " num2s: " + numtwos + " n2fact: " + n2fact);
            max3 = new Double((den[0]/n2fact+1)*(1 - Math.random()));
            numthrees = (int)(Math.log(max3)/Math.log(3));
            numthrees = numthrees < 0? 0 : numthrees > nthrees - 1? nthrees - 1: numthrees;
            //numthrees = (new Double((actthrees+1)*(1 - Math.pow(Math.random(),EXP)))).intValue();
            n3fact = (int)(StrictMath.pow(3,numthrees));
            max5 = new Double((den[0]/(n2fact*n3fact)+1)*(1 - Math.random()));
            numfives = (int)(Math.log(max5)/Math.log(5));
            numfives = numfives < 0? 0 : numfives > nfives - 1? nfives - 1: numfives;
            n5fact = (int)(StrictMath.pow(5,numfives));
            num[0] = n2fact*n3fact*n5fact;

            ncols = (int)(acttwos + actthrees + actfives);
            instr2 = "Is there a number (besides 1) that evenly divides both " + num[0] + " and " + den[0] + "?";
            instr3 = "If so, enter it. Otherwise, click 'Done'";
        } else if( indcatr == 1 && commonDenomCk ) {
            running = true;
            instrs = "Use arrows to put these fractions in order, lowest at the top.";
            showArros = true;
            nrows = 2 + 2; //(int)(StrictMath.random()*(MAXROWS-1));
            int maxcols = 0;
            ntwos = ntwos - 1;
            nthrees = nthrees - 1;
            nfives = nfives - 1;
            int x = -1;
            int y = 0;
            for( int i = 0; i < nrows; ++i ) {
                acttwos = (int)(StrictMath.random()*ntwos);
                actthrees = (int)(StrictMath.random()*nthrees);
                actfives = (int)(StrictMath.random()*nfives);
                int twofact = (int)(StrictMath.pow(2,acttwos));
                int threefact = (int)(StrictMath.pow(3,actthrees));
                int fivefact = (int)(StrictMath.pow(5,actfives));
                den[i] = twofact*threefact*fivefact;
                num[i] = (new Double((den[i])*(1 - Math.pow(Math.random(),EXP)))).intValue();
                ncols = (int)(acttwos + actthrees + actfives);
                if( ncols > maxcols ) {
                    maxcols = ncols;
                }
                if( i > 0 && num[i] != 0 && num[0] != 0 &&
                        den[i] != den[0] && den[i]%den[0] == 0 ) {
                    x = i;
                }
            }
            ncols = maxcols;
            whatOp = "&times";
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
        } else if( indcatr == 2 && fracToMxCk ) {
            running = true;
            instrs = "Convert this Fraction to a Mixed Number.";
            //instr3 = " Click 'done' when reduced.";
            ntwos = ntwos - 1;
            nthrees = nthrees - 1;
            nfives = nfives - 1;
            twogen = (int)(gran*ntwos*Math.random());
            acttwos = twogen > 4*gran? 4 : twogen > 3*gran? 3 : twogen > 2*gran? 2 : twogen > gran? 1 : 0;
            d2fact = (int)(StrictMath.pow(2,acttwos));
            threegen = (int)(gran*nthrees*Math.random());
            actthrees = threegen > 2*0.7*gran? 2 : threegen > 0.7*gran? 1 : 0;
            d3fact = (int)(StrictMath.pow(3,actthrees));
            fivegen = (int)(gran*nfives*Math.random());
            actfives = fivegen > 0.7*gran? 1 : 0; // make fives more likely
            d5fact = (int)(StrictMath.pow(5,actfives));
            num[0] = d2fact*d3fact*d5fact;

            max2 = new Double((num[0]+1)*(1 - Math.random()));
            numtwos = (int)(Math.log(max2)/Math.log(2));
            if( numtwos < 0 ) {
              numtwos = 0;
            } else if( numtwos > ntwos - 1 ) {
              numtwos = ntwos - 1;
            }
            n2fact = (int)(StrictMath.pow(2,numtwos));
            //System.out.println("num: " + num + " max2: " + max2 + " num2s: " + numtwos + " n2fact: " + n2fact);
            max3 = new Double((num[0]/n2fact+1)*(1 - Math.random()));
            numthrees = (int)(Math.log(max3)/Math.log(3));
            numthrees = numthrees < 0? 0 : numthrees > nthrees - 1? nthrees - 1: numthrees;
            //numthrees = (new Double((actthrees+1)*(1 - Math.pow(Math.random(),EXP)))).intValue();
            n3fact = (int)(StrictMath.pow(3,numthrees));
            max5 = new Double((num[0]/(n2fact*n3fact)+1)*(1 - Math.random()));
            numfives = (int)(Math.log(max5)/Math.log(5));
            numfives = numfives < 0? 0 : numfives > nfives - 1? nfives - 1: numfives;
            n5fact = (int)(StrictMath.pow(5,numfives));
            den[0] = n2fact*n3fact*n5fact;

            ncols = (int)(acttwos + actthrees + actfives);
            instr2 = "Copy the numerator: '" + num[0] + "' to the box under the 'divide by' sign";
           //startHere = "d1_1";
        } else if( indcatr == 3 && mxToFracCk ) {
            running = true;
            instrs = "Convert this Mixed Number to a Fraction.";
            //instr3 = "Click 'done' when reduced.";
            whol = 1 + (int)(StrictMath.random()*maxwhol);
            ntwos = ntwos - 2;
            nthrees = nthrees - 2;
            nfives = nfives - 1;
            den[0] = 1;
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

            max2 = new Double((den[0]+1)*(1 - Math.random()));
            numtwos = (int)(Math.log(max2)/Math.log(2));
            if( numtwos < 0 ) {
              numtwos = 0;
            } else if( numtwos > ntwos - 1 ) {
              numtwos = ntwos - 1;
            }
            n2fact = (int)(StrictMath.pow(2,numtwos));
            //System.out.println("num: " + num + " max2: " + max2 + " num2s: " + numtwos + " n2fact: " + n2fact);
            max3 = new Double((den[0]/n2fact+1)*(1 - Math.random()));
            numthrees = (int)(Math.log(max3)/Math.log(3));
            numthrees = numthrees < 0? 0 : numthrees > nthrees - 1? nthrees - 1: numthrees;
            //numthrees = (new Double((actthrees+1)*(1 - Math.pow(Math.random(),EXP)))).intValue();
            n3fact = (int)(StrictMath.pow(3,numthrees));
            max5 = new Double((den[0]/(n2fact*n3fact)+1)*(1 - Math.random()));
            numfives = (int)(Math.log(max5)/Math.log(5));
            numfives = numfives < 0? 0 : numfives > nfives - 1? nfives - 1: numfives;
            n5fact = (int)(StrictMath.pow(5,numfives));
            num[0] = n2fact*n3fact*n5fact;

            ncols = (int)(acttwos + actthrees + actfives);
            instr2 = "Copy the denominator of the fractional part of the mixed number: " + den[0];
        }
    }
%>


<div class="d3"><%=instrs%></div>
<div id="instr2" class="d4"><%=instr2%></div>
<div id="instr3" class="d4"><%=instr3%></div>
<div class="d1">
<table>
<%  if( indcatr < 2 && ( simplifyCk || commonDenomCk ) ) {
        for( int i = 0; i < nrows; ++i ) { 
            String nclass = "n" + i; 
            String nid = "n" + i + "_0";
            String did = "d" + i + "_0"; %>
        <tr>
<%          if( showArros ) { 
                String upArroId = "u" + i; 
                String dnArroId = "d" + i; %>
    <td>
        <table>
                <tr><td>
                    <i onclick="move()" id="<%=upArroId%>" class="arrow up sym"></i>
                </td></tr>
                <tr><td>
                    <i onclick="move()"  id="<%=dnArroId%>" class="arrow down"></i>
                </td></tr>
        </table>
    </td>
    <%      } %>
        <td>
            <table>
                <tr><td class="num">
                    <input disabled="true" value="<%=num[i]%>" class="<%=nclass%>" id="<%=nid%>">  
                </td></tr>
                <tr><td>
                    <input disabled="true" value="<%=den[i]%>" id="<%=did%>">
                </td></tr>
            </table>
        </td>
    <%      String itype = "text";
            String equalSgn = "=";
            String op = whatOp;
            String ntd = "num";
            for( int j = 0, k = 0; j < ncols; ++j ) { 
                k = k + 1;
                nid = "n" + i + "_" + k;
                did = "d" + i + "_" + k; 
                String oid = "o" + i + "_" + k; 
                String eid = "e" + i + "_" + k; %>
    <td id="<%=oid%>" class="sym"><%=op%></td>
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" class="<%=nclass%>" id="<%=nid%>" onkeyup="checkN( event )" onkeydown="erase( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeyup="checkD( event )" onkeydown="erase( event )" value="">     
                </td></tr>
            </table>
        </td>
        <td class="sym" id="<%=eid%>"><%=equalSgn%></td>
    <%          k = k + 1; 
                nid = "n" + i + "_" + k;
                did = "d" + i + "_" + k; %>
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" class="<%=nclass%>" id="<%=nid%>" onkeyup="checkM( event )" onkeydown="erase( event )" value="">
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" id="<%=did%>" onkeyup="checkM( event )" onkeydown="erase( event )" value=""> 
                </td></tr>
            </table>
        </td>
    <%          itype = "hidden";
                ntd = "";
                equalSgn = "";
                op = "";
            }
    %>
        </tr>
    <%  } 
    }  else if( indcatr == 2 && fracToMxCk ) { %>
    <tr>
        <td>
            <table>
                <tr><td class="num">
                    <input disabled="true" value="<%=num[0]%>" id="onum">  
                </td></tr>
                <tr><td>
                    <input disabled="true" value="<%=den[0]%>" id="oden">
                </td></tr>
            </table>
        </td>
        <td class="sym">=</td>
        <td>
            <input onkeyup="checkWhl( event )" onkeydown="erase( event )" id="n0_1" class="whole">
        </td>
        <td>
            <table>
                <tr><td class="num">
                    <input onkeyup="checkFrcN( event )" onkeydown="erase( event )" id="n0_2">  
                </td></tr>
                <tr><td>
                    <input onkeyup="checkFrcD( event )" onkeydown="erase( event )" id="d0_2">
                </td></tr>
            </table>
        </td>
        <td class="sym">=</td>
        <td>
            <input onkeyup="checkWhl( event )" onkeydown="erase( event )" id="n0_3" class="whole">
        </td>
        <td>
            <table>
                <tr><td class="num">
                    <input onkeyup="checkFrcN( event )" onkeydown="erase( event )" id="n0_4">  
                </td></tr>
                <tr><td>
                    <input onkeyup="checkFrcD( event )" onkeydown="erase( event )" id="d0_4">
                </td></tr>
            </table>
        </td>
    </tr>
    <tr>
        <th colspan="1"></th><th colspan="3" class="bar"></th>
    </tr>
    <tr>
        <td>
            <input onkeyup="checkDen( event )" onkeydown="erase( event )" id="d0_0">
        </td>
        <td class="sym">
            )
        </td>
        <td>
            <input onkeyup="checkNum( event )" onkeydown="erase( event )" id="d0_1">
        </td>
    </tr>
     <tr>
        <td>
        </td>
        <td>
        </td>
        <td>
            <input onkeyup="checkProd( event )" onkeydown="erase( event )" id="n1_1">
        </td>
    </tr>
    <tr>
        <th colspan="2"></th><th colspan="1" class="bar"></th>
    </tr>
        <tr>
        <td>
        </td>
        <td>
        </td>
        <td>
            <input onkeyup="checkDiff( event )" onkeydown="erase( event )" id="d1_1">
        </td>
    </tr>
<%  } else if( indcatr == 3 && mxToFracCk ) { %>
    <tr>
        <td>
            <input disabled="true" value=<%=whol%> id="whlprt" class="whole">
        </td>
        <td>
            <table>
                <tr><td class="num">
                    <input disabled="true" value="<%=num[0]%>" id="onum">  
                </td></tr>
                <tr><td>
                    <input disabled="true" value="<%=den[0]%>" id="oden">
                </td></tr>
            </table>
        </td>
        <td class="sym">=</td>
        <td>
            <table>
                <tr>
                    <td class="num">
                    <input onkeyup="checkMprN( event )" onkeydown="erase( event )" id="n0_0" class="nput">  
                    </td>
                    <td class="num">&times</td>
                    <td class="num">
                    <input onkeyup="checkMprN( event )" onkeydown="erase( event )" id="n0_1" class="nput">  
                    </td>
                    <td class="num">+</td>
                    <td class="num">
                    <input onkeyup="checkMprN( event )" onkeydown="erase( event )" id="n0_2" class="nput">  
                    </td>
                </tr>
                <tr><th colspan="5">
                    <input onkeyup="checkMprD( event )" onkeydown="erase( event )" id="d0_1">
                </th></tr>
            </table>
        </td>
        <td class="sym">=</td>
        <td>
            <table>
                <tr><td class="num">
                    <input onkeyup="checkMprN( event )" onkeydown="erase( event )" id="n0_3" class="nput">  
                </td></tr>
                <tr><td>
                    <input onkeyup="checkMprD( event )" onkeydown="erase( event )" id="d0_3">
                </td></tr>
            </table>
        </td>
<%      
        String itype = "text";
        String equalSgn = "=";
        String op = whatOp;
        String ntd = "num";
        for( int j = 0, k = 3; j < ncols; ++j ) { 
            k = k + 1;
            String nid = "n0_" + k;
            String did = "d0_" + k; 
            String oid = "o" + k; 
            String eid = "e" + k; %>
        <td id="<%=oid%>" class="sym"><%=op%></td>
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" onkeyup="checkMprN( event )" onkeydown="erase( event )" id="<%=nid%>" class="nput">  
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" onkeyup="checkMprD( event )" onkeydown="erase( event )" id="<%=did%>">
                </td></tr>
            </table>
        </td>
        <td id="<%=eid%>" class="sym"><%=equalSgn%></td>
<%          k = k + 1; 
            nid = "n0_" + k;
            did = "d0_" + k; %>
        <td>
            <table>
                <tr><td class="<%=ntd%>">
                    <input type="<%=itype%>" onkeyup="checkMprN( event )" onkeydown="erase( event )" id="<%=nid%>" class="nput">  
                </td></tr>
                <tr><td>
                    <input type="<%=itype%>" onkeyup="checkMprD( event )" onkeydown="erase( event )" id="<%=did%>">
                </td></tr>
            </table>
        </td>
    
<%          itype = "hidden";
            ntd = "";
            equalSgn = "";
            op = "";
        }
    } else {
    }%> 
</tr>
<tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <th colspan="2"><button type="button" onclick="check()" id="chkBx">Done</button></th>
</tr>
<tr>
<th colspan="6" id="back">
	<div>
	      <a href="/" class="ndx">Home</a>
	</div>
	<div>
	      <a href="index.html" class="ndx">Back to Practice Index</a>
	</div>
</th>
</tr>
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
<tr><td><input type="checkbox" value="simplify" name="selected" 
                   <%=isSimplify%> onclick="zeroCounts()">
            <label>Simplify</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="commonDenom" name="selected" 
                   <%=isCommonDenom%> onclick="zeroCounts()">
            <label>Find Common Denominator</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="fracToMx" name="selected" 
                   <%=isFracToMx%> onclick="zeroCounts()">
            <label>Fraction to Mixed Number</label>
        </td>
</tr>
<tr>
        <td><input type="checkbox" value="mxToFrac" name="selected" 
                   <%=isMxToFrac%> onclick="zeroCounts()">
            <label>Mixed Number to Fraction</label>
        </td>
</tr>
</table>
</div>

<table id="statusTable">
<% for( int i = 0, j = 1; i < 0; i += 2, j += 2 ) {
    String whatId = "statusBox" + i; 
    String whatId2 = "statusBox" + j; %>
    <tr><td><%=i%></td><td><div id="<%=whatId%>"></div></td><td><%=j%></td><td><div id="<%=whatId2%>"></div></td></tr>
<% } %>
</table>

<input type="hidden" id="indcatr" value="<%=indcatr%>">
</form>
</body>
</html>
