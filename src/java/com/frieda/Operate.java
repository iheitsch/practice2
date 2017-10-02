/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.frieda;

/**
 *
 * @author frieda
 */
public class Operate {
   
    // least significant digit not always correct fixit
    // 7.1 / 243.7 = .2913 fixit
    public static int op( String operator, int MAX_DGTS, boolean decimalsCk,
            long operand1, int decPt1, long operand2, int decPt2, 
            int nDgts1, int nDgts2, boolean isNeg1, boolean isNeg2,
            long [] actualInt, String [] expl ) { 
        /*
        System.out.println("op just starting operator = " + operator + " decimalsCK = " + decimalsCk + "operand1 = " + operand1 );
        System.out.println("decPt1 = " + decPt1 + " operand2 = " + operand2 + " decPt2 = " + decPt2 + " nDgts1 = " + nDgts1 + " nDgts2 = " + nDgts2);
        System.out.println(" isNeg1 = " + isNeg1 + " isNeg2 = " + isNeg2);
        */
        long absOp1 = Math.abs(operand1);
        long absOp2= Math.abs(operand2);
        //boolean isNeg1 = operand1 < 0;
        //boolean isNeg2 = operand2 < 0;
        //int nDgts1 = absOp1 > 0 ? 1 + (int)Math.log10(absOp1) : 1;
        //int nDgts2 = absOp2 > 0 ? 1 + (int)Math.log10(absOp2) : 1;
        int thisMuchBigger = nDgts1 - decPt1 - (nDgts2 - decPt2);
        long round1down = operand1; // default is not rounded
        long round1up = operand1;
        long round2down = operand2;
        long round2up = operand2;
        int decPtAct = decPt1;

        int ten2pow = (int)Math.pow(10, nDgts1 - 1);
        // round to one significant digit
        if( ten2pow != 0 ) {            
            if( isNeg1 ) {
                round1up = ten2pow*(operand1/ten2pow);
                round1down = -ten2pow*((ten2pow + absOp1)/ten2pow);
            } else {
                round1up = ten2pow*((ten2pow + absOp1)/ten2pow);
                round1down = ten2pow*(operand1/ten2pow);
            }
        } else {
            // not sure how this would happen
            System.out.println("nDgts1 = " + nDgts1 + " ten2pow = " + ten2pow);
        }

        ten2pow = (int)Math.pow(10, nDgts2 - 1);
        // round to one significant digit
        if( ten2pow != 0 ) {         
            if( isNeg2 ) {
                round2up = ten2pow*(operand2/ten2pow);
                round2down = -ten2pow*((ten2pow + absOp2)/ten2pow);
            } else {
                round2up = ten2pow*((ten2pow + absOp2)/ten2pow);
                round2down = ten2pow*(operand2/ten2pow);
            }
        } else {
            // not sure how this would happen
            System.out.println("nDgts2 = " + nDgts2 + " ten2pow = " + ten2pow);
        }

        if( operator.compareTo("+") == 0 ||
            operator.compareTo("-") == 0 ) {   
            int factor1 = 1;
            int factor2 = 1;

            // line up the decimal points
            if( decPt1 < decPt2 ) {
                factor1 = (int)Math.pow(10,decPt2-decPt1);
                decPtAct = decPt2;
            } else if( decPt1 > decPt2 ) {
                factor2 = (int)Math.pow(10,decPt1-decPt2);
            }
            // If one operand is an order of magnitude bigger than the other,
            // round off to the same decimal place as the smaller number
            if( thisMuchBigger > 0 ) {
                // if there is no overlap
                int lsd = decPt1;
                if( absOp1 > 0 ) {
                    int copy = (int)absOp1;
                    while( 10*(copy/10) == copy ) {
                        lsd = lsd + 1;
                        copy = copy/10;
                    }
                }
                if( decPt2 - nDgts2 >= lsd ) {
                    round1up = operand1;
                    round1down = operand1;
                } else {
                    ten2pow = (int)Math.pow(10, nDgts1 - thisMuchBigger - 1);
                    if( ten2pow != 0 ) {
                        if( isNeg1 ) {
                            round1up = ten2pow*(operand1/ten2pow);
                            round1down = -ten2pow*((ten2pow + absOp1)/ten2pow);
                        } else {
                            round1up = ten2pow*((ten2pow + absOp1)/ten2pow);
                            round1down = ten2pow*(operand1/ten2pow);
                        }
                    }
                }
            } else if( thisMuchBigger < 0 ) {
                // if there is no overlap
                int lsd = decPt2;
                if( absOp2 > 0 ) {
                    int copy = (int)absOp2;
                    while( 10*(copy/10) == copy ) {
                        lsd = lsd + 1;
                        copy = copy/10;
                    }
                }
                if( decPt1 - nDgts1 >= decPt2 ) {
                    round2up = operand2;
                    round2down = operand2;
                } else {
                    ten2pow = (int)Math.pow(10, nDgts2 + thisMuchBigger - 1);
                    if( ten2pow != 0 ) {
                        if( isNeg2 ) {
                            round2up = ten2pow*(operand2/ten2pow);
                            round2down = -ten2pow*((ten2pow + absOp2)/ten2pow);
                        } else {
                            round2up = ten2pow*((ten2pow + absOp2)/ten2pow);
                            round2down = ten2pow*(operand2/ten2pow);
                        }
                    }
                }
            }
            /*
            System.out.println("op nDgts1 = " + nDgts1 + " decPt1 = " + decPt1 );
            System.out.println("op nDgts2 = " + nDgts2 + " decPt2 = " + decPt2 );
            System.out.println("op thisMuchBigger = " + thisMuchBigger + " ten2pow = " + ten2pow);
            */
            if( operator.compareTo("+") == 0 ) {
                // if real answer is positive, don't let lower range be negative
                if( operand1*Math.pow(10,-decPt1) + operand2*Math.pow(10, -decPt2) > 0 && 
                        round2down*Math.pow(10, -decPt2) + round1down*Math.pow(10, -decPt1) < 0 ) {
                    round1down = 0;
                    round2down = 0;
                // if real answer is negative, don't let upper range be positive
                } else if( operand1*Math.pow(10,-decPt1) + operand2*Math.pow(10, -decPt2)  < 0 && 
                        round2up*Math.pow(10, -decPt2) + round1up*Math.pow(10, -decPt1) > 0 ) {
                    round1up = 0;
                    round2up = 0;
                }
                actualInt[2] = (factor1*round1up + factor2*round2up);
                actualInt[1] = factor1*operand1 + factor2*operand2;
                actualInt[0] = (factor1*round1down + factor2*round2down); 
                if( isNeg2 ) {
                    expl[2] = Format.getFormat( round1up, decPt1 ) + " " + operator + 
                            " ( "  + Format.getFormat( round2up, decPt2 )  + " ) ";
                    expl[0] = Format.getFormat( round1down, decPt1 ) + " " + operator + 
                            " ( " + Format.getFormat( round2down, decPt2 ) + " ) ";
                } else {
                    expl[2] = Format.getFormat( round1up, decPt1 ) + " " + operator + 
                            " " + Format.getFormat( round2up, decPt2 );
                    expl[0] = Format.getFormat( round1down, decPt1 ) + " " + operator + 
                            " " + Format.getFormat( round2down, decPt2 );
                }
            } else {
                // if real answer is positive, don't let lower range be negative
                if( operand1*Math.pow(10,-decPt1) >= operand2*Math.pow(10, -decPt2) && 
                        round2up*Math.pow(10, -decPt2) > round1down*Math.pow(10, -decPt1) ) {
                    round1down = 0;
                    round2up = 0;
                // if real answer is negative, don't let upper range be positive
                } else if( operand1*Math.pow(10,-decPt1) < operand2*Math.pow(10, -decPt2) && 
                        round2down*Math.pow(10, -decPt2) < round1up*Math.pow(10, -decPt1) ) {
                    round1up = 0;
                    round2down = 0;
                }
                actualInt[2] = (factor1*round1up - factor2*round2down);
                actualInt[1] = factor1*operand1 - factor2*operand2;
                actualInt[0] = factor1*round1down - factor2*round2up;
                if( isNeg2 ) {
                    operator = "+";
                    round2down = -round2down;
                    round2up = -round2up;
                }
                expl[2] = Format.getFormat( round1up, decPt1 ) + " " + operator + 
                        " " + Format.getFormat( round2down, decPt2 );
                expl[0] = Format.getFormat( round1down, decPt1 ) + " " + operator + 
                        " " + Format.getFormat( round2up, decPt2 );
            }
            
        } else if(  operator.compareTo("*") == 0  ) {
            decPtAct = decPt1 + decPt2;
            //ten2pow = (int)Math.pow(10,decPtAct);
            if( isNeg1 && isNeg1 == isNeg2 ) {
                long tmp = round1up;
                round1up = round1down;
                round1down = tmp;
                tmp = round2up;
                round2up = round2down;
                round2down = tmp;
            } else if( isNeg1 ) {
                long tmp = round2up;
                round2up = round2down;
                round2down = tmp;  
            } else if( isNeg2 ) {
                long tmp = round1up;
                round1up = round1down;
                round1down = tmp;
            }

            actualInt[2] = round1up * round2up;
            actualInt[1] = operand1 * operand2;
            actualInt[0] = round1down * round2down;
            if( isNeg2 ) {
                expl[2] = Format.getFormat( round1up, decPt1 ) + " " + operator + 
                        " ( "  + Format.getFormat( round2up, decPt2 )  + " ) ";
                expl[0] = Format.getFormat( round1down, decPt1 ) + " " + operator + 
                        " ( " + Format.getFormat( round2down, decPt2 ) + " ) ";
            } else {
                expl[2] = Format.getFormat( round1up, decPt1 ) + " " + operator + 
                        " " + Format.getFormat( round2up, decPt2 );
                expl[0] = Format.getFormat( round1down, decPt1 ) + " " + operator + 
                        " " + Format.getFormat( round2down, decPt2 );
            }
            //System.out.println("op decPt1 " + decPt1 + " decPt2 " + decPt2 + " decPtAct " + decPtAct);
            //System.out.println("op " + operator + " round1up " + round1up + " round2up " + round2up + " actualInt[2] " + actualInt[2]);
            //System.out.println("op " + operator + " round1down " + round1down + " round2down " + round2down + " actualInt[2] " + actualInt[0]);
        // two might be a better lower bound than 1 fixit
        } else if(  operator.compareTo("/") == 0  ) {
            round2down = ten2pow;
            round2up = 10*ten2pow;

            if( decimalsCk ) {
                ten2pow = (int)Math.pow(10, MAX_DGTS + decPt2 - decPt1);
                decPtAct = MAX_DGTS;
            } else {
                ten2pow = 1;
                decPtAct = 0;
            }

            if( operand2 != 0 ) { // else error or maxint
                /*
                System.out.println("op ten2pow = " + ten2pow + " operand1 = " + operand1);
                actualInt[1] = (long)ten2pow*operand1;
                System.out.println("op ten2pow*operand1 actualInt[1] = " + actualInt[1]);
                actualInt[1] = 10*actualInt[1];
                System.out.println("10*actualInt[1] = " + actualInt[1]);
                System.out.println("operand2 = " + operand2);
                actualInt[1] = actualInt[1]  / operand2;
                System.out.println("divided by operand2 actualInt[1] = " + actualInt[1]);
                actualInt[1] = actualInt[1] + 5;
                System.out.println("plus 5 actualInt[1] = " + actualInt[1]);
                actualInt[1] = actualInt[1]/10;
                System.out.println("op divided by 10 actualInt[1] = " + actualInt[1]);
                */
                actualInt[1] = (10*ten2pow*absOp1  / absOp2 + 5)/10;
            } else { // not sure if this will work when it's not in the jsp page
                /*
                System.out.println("tried to divide by zero");
                System.out.println("operator = " + operator);
                System.out.println("MAX_DGTS " + MAX_DGTS);
                System.out.println("decimalsCk = " + decimalsCk);
                System.out.println("operand1 " + operand1);
                System.out.println("decPt1 " + decPt1);
                System.out.println("operand2 " + operand2);
                System.out.println("decPt2 " + decPt2);
                */
                actualInt[1] = 999999;
                //System.exit(1);
            }
            if( isNeg2 != isNeg1 ) {
                long tmp = round2down;
                round2down = round2up;
                round2up = tmp; 
                actualInt[1] = -actualInt[1];
            }

            if( round2up != 0 ) {
                actualInt[0] = (10*ten2pow*absOp1  / round2up + 5)/10; // ten2pow*operand1 / round2up;
            }
            if( round2down != 0 ) {
                actualInt[2] = (10*ten2pow*absOp1  / round2down + 5)/10; // ten2pow*operand1 / round2down;
            }
            if( isNeg2 != isNeg1 ) {
                actualInt[0] = -actualInt[0];
                actualInt[2] = -actualInt[2];
            }
            if( isNeg2 ) {
                round2down = -round2down;
                round2up = -round2up;
            } 
            if( isNeg2 ) {
                expl[0] = Format.getFormat( operand1, decPt1 ) + " " + operator + 
                        " ( " + Format.getFormat( round2up, decPt2 ) + " ) ";
                expl[2] =  Format.getFormat( operand1, decPt1 ) + " " + operator + 
                        " ( " + Format.getFormat( round2down, decPt2 ) + " ) ";
            } else {
                expl[0] = Format.getFormat( operand1, decPt1 ) + " " + operator + 
                        " " + Format.getFormat( round2up, decPt2 );
                expl[2] =  Format.getFormat( operand1, decPt1 ) + " " + operator + 
                        " " + Format.getFormat( round2down, decPt2 );
            }
        }
        //if( actualInt[1] == 0 ) {
        //    decPtAct = 0;
        //}

        //System.out.println("op finishing operator = " + operator + " decimalsCK = " + decimalsCk + "operand1 = " + operand1 );
        //System.out.println("decPt1 = " + decPt1 + " operand2 = " + operand2 + " decPt2 = " + decPt2 + " nDgts1 = " + nDgts1 + " nDgts2 = " + nDgts2);
        //System.out.println(" isNeg1 = " + isNeg1 + " isNeg2 = " + isNeg2);
        for( int q = 0; q < 3; q++ ){
            //System.out.println("actualIn[" + q + "] = " + actualInt[q] + " expl[" + q + "] = " + expl[q] );
        }
        //System.out.println("op finishing");
        return decPtAct;
    }

}
