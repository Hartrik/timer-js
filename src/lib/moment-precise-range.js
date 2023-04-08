// moment-precise-range-1.3.0 https://github.com/codebox/moment-precise-range
if(void 0===moment&&"function"==typeof require)var moment=require("moment");!function(e){var n={nodiff:"",year:"year",years:"years",month:"month",months:"months",day:"day",days:"days",hour:"hour",hours:"hours",minute:"minute",minutes:"minutes",second:"second",seconds:"seconds",delimiter:" "};function t(e,t){return e+" "+n[t+(1===e?"":"s")]}function r(e,n,t,r,s,o,u){return{years:e,months:n,days:t,hours:r,minutes:s,seconds:o,firstDateWasLater:u}}e.fn.preciseDiff=function(n,t){return e.preciseDiff(this,n,t)},e.preciseDiff=function(s,o,u){var i,a=e(s),f=e(o);if(a.add(f.utcOffset()-a.utcOffset(),"minutes"),a.isSame(f))return u?r(0,0,0,0,0,0,!1):n.nodiff;if(a.isAfter(f)){var m=a;a=f,f=m,i=!0}else i=!1;var d=f.year()-a.year(),h=f.month()-a.month(),c=f.date()-a.date(),y=f.hour()-a.hour(),p=f.minute()-a.minute(),v=f.second()-a.second();if(v<0&&(v=60+v,p--),p<0&&(p=60+p,y--),y<0&&(y=24+y,c--),c<0){var D=e(f.year()+"-"+(f.month()+1),"YYYY-MM").subtract(1,"M").daysInMonth();c=D<a.date()?D+c+(a.date()-D):D+c,h--}return h<0&&(h=12+h,d--),u?r(d,h,c,y,p,v,i):function(e,r,s,o,u,i){var a=[];return e&&a.push(t(e,"year")),r&&a.push(t(r,"month")),s&&a.push(t(s,"day")),o&&a.push(t(o,"hour")),u&&a.push(t(u,"minute")),i&&a.push(t(i,"second")),a.join(n.delimiter)}(d,h,c,y,p,v)}}(moment);