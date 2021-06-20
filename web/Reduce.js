/**
 * 
 */
 // make it put the labels in the right color fixit
 function createRadioElement(label, name, checked, value, fun ) {
    var radioHtml = '<label id="' + value + '" > ' + label + '</label> ';
	radioHtml += '<input type="radio" name="' + name + '" ';
    if ( checked ) {
        radioHtml += ' checked="checked" ';
    }
	radioHtml += ' onclick="' + fun + '" ';
    radioHtml += '/>';
	
    var radioFragment = document.createElement('span');
    radioFragment.innerHTML = radioHtml;
    return radioFragment;
}
function skip() {
     document.getElementById("errs").value = 1;
     allgood = true;
     startAgain(); 
}
function reduce(  num, den ) {
    //alert("is " +  num + "/" + den + " reduced?");
    var ntwos = 0;
    var nthrees = 0;
    var nfives = 0;
    if(  num === 0 ) {
        //alert(" num: " +  num + ", so yes, reduced");
        return {n:num, d:1};
    }
    while(  num%2 === 0 && den%2 === 0 ) {
        ntwos = ntwos + 1;
         num =  num / 2;
        den = den / 2;
    }
    while(  num%3 === 0 && den%3 === 0 ) {
        nthrees = nthrees + 1;
         num =  num / 3;
        den = den / 3;
    }
    while(  num%5 === 0 && den%5 === 0 ) {
        nfives = nfives + 1; 
         num =  num / 5;
        den = den / 5;
    }
    //alert("reduced num: " + num + " den: " + den);
        //return true;
    return {n:num, d:den}; 
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
        var whatForm = doc.getElementById('th-id2');
        //whatForm.method = "get";
        whatForm.submit();
        return false;
    }
}