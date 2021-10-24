<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" %>
<%@page import="java.sql.DriverManager"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="java.sql.Statement"%>
<%@page import="java.sql.Connection"%>
<% 	String id = request.getParameter("userid");
	String driver = "com.mysql.jdbc.Driver";
	String connectionUrl = "jdbc:mysql://localhost:3306/";
	String database = "dot2dots";
	String userid = "irene";
	String password = "ohgoOn";
	try {
		Class.forName(driver);
	} catch (ClassNotFoundException e) {
		e.printStackTrace();
	}
	Connection connection = null;
	Statement statement = null;
	ResultSet resultSet = null;
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Plotting Points</title>
<link rel="stylesheet" href="PlotPoints.css" type="text/css">
<script src="PlotPoints.js"></script>
</head>
<% // going to have to use a database with this one 
// start with random points 
int MAXPT = 10;
int MAXPTS = 100;

int xsign = (int)(MAXPT*Math.random()) > 5 ? 1 : -1;
int xval = xsign*(int)(MAXPT*Math.random());
int ysign = (int)(MAXPT*Math.random()) > 5 ? 1 : -1;
int yval = xsign*(int)(MAXPT*Math.random());
int idx = 0;
int jdx = 0;
int kdx = 0;
String [] slctopts = new String[20];
int [] xpoints = new int[MAXPTS];
int [] ypoints = new int[MAXPTS]; %>

<body>
<div id="preload">
	<img alt='' src='images/1up.gif' >
	<img alt='' src='images/1down.gif' >
	<img alt='' src='images/2up.gif' >
	<img alt='' src='images/2down.gif' >
	<img alt='' src='images/4up.gif' >
	<img alt='' src='images/4down.gif' >
	<img alt='' src='images/8up.gif' >
	<img alt='' src='images/8down.gif' >
	<img alt='' src='images/16up.gif' >
	<img alt='' src='images/16down.gif' >
	<img alt='' src='images/32up.gif' >
	<img alt='' src='images/32down.gif' >
	<img alt='' src='images/64up.gif' >
	<img alt='' src='images/64down.gif' >
	<img alt='' src='images/128up.gif' >
	<img alt='' src='images/128down.gif' >
	<img alt='' src='images/256up.gif' >
	<img alt='' src='images/256down.gif' >
</div>
<form id="plots">
<span>
<div id="instrs">Choose a Picture</div>
<% 	try{
		connection = DriverManager.getConnection(connectionUrl+database, userid, password);
		statement=connection.createStatement();
		String sql ="SELECT table_name FROM information_schema.tables WHERE table_schema = 'dot2dots'";
		resultSet = statement.executeQuery(sql);
		while(resultSet.next()){
			slctopts[jdx] = resultSet.getString("table_name");
			++jdx;
		}
		connection.close();
	} catch (Exception e) {
		e.printStackTrace();
	} 

    String whatTable = "";
    String tmp = "";    // temporary storage for newly gotten 
                        // request parameter      
	String isSelected = "selected";
    String [] isNowSelected = new String[jdx];
    String itype = "hidden";
    String instr2 = "";
    String comma = "";
	
    //retrieves the value of the DOM object with name="numAttmptdP"
    if(( tmp = request.getParameter("chs")) != null) {
        whatTable = tmp.toString();
        isSelected = "";
        for( kdx = 0; kdx < jdx; ++kdx ) {
        	if( slctopts[kdx].equals(whatTable) ) {
        		isNowSelected[kdx] = "selected";
        		itype = "text";
        	    instr2 = "Plot this point: ";
        	    comma = ",";
        		break;
        	}
        }
    } %>
<span>
<select id="chs" name="chs" class="slct" onchange="startAgain()" >   
		<option <%=isSelected%> >Select</option>
<% 	for( kdx = 0; kdx < jdx; ++kdx ) { 
		String sel = slctopts[kdx]; %>
		<option <%=isNowSelected[kdx]%> ><%=sel%></option>
<% 	} %>
</select>
</span>
<% 	try{
		connection = DriverManager.getConnection(connectionUrl+database, userid, password);
		statement=connection.createStatement();
		String sql ="select * from " + whatTable;
		resultSet = statement.executeQuery(sql);
		while(resultSet.next()){
			xpoints[idx] = resultSet.getInt("xval");
			ypoints[idx] = resultSet.getInt("yval");
			++idx;
		}
		connection.close();
	} catch (Exception e) {
		e.printStackTrace();
	} %>
<span id="instr2" ><%=instr2%><input type = "<%=itype%>" id="expX" disabled="true" value="<%=xpoints[0]%>"><%=comma%> 
<input type="<%=itype%>" id="expY" disabled="true" value="<%=ypoints[0]%>"></span>
<img src="images/allwhite.png" >
<div id="horizontal"></div>
<div id="vertical"></div>

<% 	for( int i = 0; i < MAXPTS; ++i ) { 
		String xid = "x" + i;
		String yid = "y" + i; %>
		<input id="<%=xid %>" type="hidden" value="<%=xpoints[i] %>">
		<input id="<%=yid %>" type="hidden" value="<%=ypoints[i] %>">
<% } %>
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
<td>
	    <button type="button" onclick="skip()" id="skpBx">Skip</button> 
</td>
<td class="invisible">_</td><td class="invisible">_</td><td class="invisible">_</td>
<td>    
        <button type="button" onclick="check()" id="chkBx">Done</button>
 </td>
</tr>
</table>
</span>
<span class=rightsd>
<div>
	<table>
	<% for( int i = 0, j = 1; i < 0; i += 2, j += 2 ) {
	    String whatId = "statusBox" + i; 
	    String whatId2 = "statusBox" + j; %>
	    <tr><td><%=i%></td><td><div id="<%=whatId%>"></div></td><td><%=j%></td><td><div id="<%=whatId2%>"></div></td></tr>
	<% } %>
	</table>
</div>
<%  String numAttmptdV = "0";
    String numWoErr = "0";
    String consWoErr = "0";
    String corrPerHr = "0";
    String strtTime = String.valueOf(System.currentTimeMillis());
    String errct = "0";  
    String isinit = "false";

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
%>
<div id="score">
<table >
<tr>
    <th class="title" colspan="2">Score</th>     
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
    <td><input disabled type="text" id="errct" name="errct" value="<%=errct%>"
               class="blackbox"></td>
</tr>
</table>
</div>
<input type="hidden" id="strtTime" name="strtTimeP" value="<%=strtTime%>" class="shortbox">
<input type="hidden" id="lastPt" value="<%=idx%>" class="shortbox">
<input type="hidden" id="initlzd" name="initlzd" value=<%=isinit%>>
</span>
</form>
</body>
</html>