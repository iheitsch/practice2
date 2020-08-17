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
    int indcatr = (int)(StrictMath.random()*possbl);
    String instrs = "blank";
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
    int acttwos;
    int actthrees;
    int actfives;
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
    
    if( indcatr < 1 ) {
        instrs = "Simplify this Fraction";
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
    } else if( indcatr < 2 ) {
        instrs = "Convert these Fractions to a Common Denominator and use Arrows to Put in Order, Lowest at the Top";
        showArros = true;
        nrows = 2 + 2; //(int)(StrictMath.random()*(MAXROWS-1));
        int maxcols = 0;
        ntwos = ntwos - 1;
        nthrees = nthrees - 1;
        nfives = nfives - 1;
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
        }
        ncols = maxcols;
        whatOp = "&times";
        isDivide = false;
    } else if( indcatr < 3 ) {
        // figure out what table is going to look for these before you go any further fixit
        instrs = "Convert this Fraction to a Mixed Number";
        ntwos = ntwos - 1;
        nthrees = nthrees - 1;
        nfives = nfives - 1;
        twogen = (int)(gran*ntwos*Math.random());
        acttwos = twogen > 4*gran? 4 : twogen > 3*gran? 3 : twogen > 2*gran? 2 : twogen > gran? 1 : 0;
        d2fact = (int)(StrictMath.pow(2,acttwos));
        threegen = (int)(gran*nthrees*Math.random());
        actthrees = threegen > 2*gran? 2 : threegen > gran? 1 : 0;
        d3fact = (int)(StrictMath.pow(3,actthrees));
        fivegen = (int)(gran*nfives*Math.random());
        actfives = fivegen > gran? 1 : 0;
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
        System.out.println("num: " + num + " max2: " + max2 + " num2s: " + numtwos + " n2fact: " + n2fact);
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
    } else if( indcatr < 4 ) {
        instrs = "Convert this Mixed Number to a Fraction";
        whol = 1 + (int)(StrictMath.random()*maxwhol);
        ntwos = ntwos - 3;
        nthrees = nthrees - 2;
        nfives = nfives - 1;
        twogen = (int)(gran*ntwos*Math.random());
        acttwos = twogen > 2*gran? 2 : twogen > gran? 1 : 0;
        d2fact = (int)(StrictMath.pow(2,acttwos));
        threegen = (int)(gran*nthrees*Math.random());
        actthrees = threegen > gran? 1 : 0;
        d3fact = (int)(StrictMath.pow(3,actthrees));
        fivegen = (int)(gran*nfives*Math.random());
        actfives = fivegen > gran? 1 : 0;
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
        System.out.println("num: " + num + " max2: " + max2 + " num2s: " + numtwos + " n2fact: " + n2fact);
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
    }
%>

<table>
<tr>
    <caption><%=instrs%></caption>
</tr>
<%  if( indcatr < 2 ) {
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
    }  else if( indcatr < 3 ) { %>
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
            <input onkeyup="checkWhl( event )" onkeydown="erase( event )" id="whlprt">
        </td>
        <td>
            <table>
                <tr><td class="num">
                    <input onkeyup="checkFrcN( event )" onkeydown="erase( event )" id="frcnum">  
                </td></tr>
                <tr><td>
                    <input onkeyup="checkFrcD( event )" onkeydown="erase( event )" id="frcden">
                </td></tr>
            </table>
        </td>
        <td class="sym">=</td>
        <td>
            <input onkeyup="checkWhl( event )" onkeydown="erase( event )" id="redprt">
        </td>
        <td>
            <table>
                <tr><td class="num">
                    <input onkeyup="checkFrcN( event )" onkeydown="erase( event )" id="rednum">  
                </td></tr>
                <tr><td>
                    <input onkeyup="checkFrcD( event )" onkeydown="erase( event )" id="redden">
                </td></tr>
            </table>
        </td>
    </tr>
    <tr>
        <th colspan="1"></th><th colspan="3" class="bar"></th>
    </tr>
    <tr>
        <td>
            <input onkeyup="checkDen( event )" onkeydown="erase( event )" id="dvsr">
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
            <input onkeyup="checkProd( event )" onkeydown="erase( event )" id="prod">
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
            <input onkeyup="checkDiff( event )" onkeydown="erase( event )" id="diff">
        </td>
    </tr>
<%  } else { %>
    <tr>
        <td>
            <input disabled="true" value=<%=whol%> id="whlprt">
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
                    <input onkeyup="checkMprN( event )" onkeydown="erase( event )" id="frcnum0">  
                    </td>
                    <td class="num">&times</td>
                    <td class="num">
                    <input onkeyup="checkMprN( event )" onkeydown="erase( event )" id="frcnum1">  
                    </td>
                    <td class="num">+</td>
                    <td class="num">
                    <input onkeyup="checkMprN( event )" onkeydown="erase( event )" id="frcnum2">  
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
                    <input onkeyup="checkMprN( event )" onkeydown="erase( event )" id="frcnum3">  
                </td></tr>
                <tr><td>
                    <input onkeyup="checkMprD( event )" onkeydown="erase( event )" id="frcden3">
                </td></tr>
            </table>
        </td>
        <td class="sym">&divide</td>
        <td>
            <table>
                <tr><td class="num">
                    <input onkeyup="checkMprN( event )" onkeydown="erase( event )" id="frcnum4">  
                </td></tr>
                <tr><td>
                    <input onkeyup="checkMprD( event )" onkeydown="erase( event )" id="frcden4">
                </td></tr>
            </table>
        </td>
        <td class="sym">=</td>
        <td>
            <table>
                <tr><td class="num">
                    <input onkeyup="checkMprN( event )" onkeydown="erase( event )" id="frcnum5">  
                </td></tr>
                <tr><td>
                    <input onkeyup="checkMprD( event )" onkeydown="erase( event )" id="frcden5">
                </td></tr>
            </table>
        </td>
    </tr>
<% } 
String numAttmptdV = "0";
    String numWoErr = "0";
    String consWoErr = "0";
    String corrPerHr = "0";
    String strtTime = String.valueOf(System.currentTimeMillis());
    String errs = "0";
    String tmp = "";      // temporary storage for newly gotten 
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
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <th colspan="2"><button type="button" onclick="check()" id="chkBx">Done</button></th>
    </tr>
    </table>
 
<input type="hidden" id="strtTime" name="strtTimeP" value="<%=strtTime%>" class="shortbox">
<div class="d5">
<table>
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
