/*
 * Add custom utils to the sandbox or core
 */
Core.extend("utils", function (core) {
	return {
        // Convert a number into string versiopn
        numberToText : function (num, declination) {
            var result = '',
                num = parseInt(num),
                numLen = String(num).length,
                firstDigit = Math.floor(num / Math.pow(10, numLen -1));
            
            var nums = ['null','üks', 'kaks', 'kolm','neli','viis','kuus','seitse','kaheksa','üheksa', 'kümme'],
                decs = ['', 'teist', 'kümmend', 'sada', 'tuhat'];
                
            if (typeof declination !== "undefined") {
                nums = ['nulli','ühe', 'kahe', 'kolme','nelja','viie','kuue','seitsme','kaheksa','üheksa', 'kümne'];
                decs = ['', 'teistkümne', 'kümne', 'saja', 'tuhande'];
            }
            
            if (numLen > 0) {
                result +=  (firstDigit > 0 ? nums[firstDigit] : '')+
                            (numLen > 1 ? decs[numLen] : '') + ' ' +
                            (num >= 10 ? core.utils.numberToText(String(num).substr(1), declination) : '');
            }
            
            return result.trim();
            
            var one = ['null','üks', 'kaks', 'kolm','neli','viis','kuus','seitse','kaheksa','üheksa', 'kümme'],
                two = ['üks', 'kaks', 'kolm', 'neli','viis','kuus','seitse','kaheksa','üheksa'];
            
            if (num <= 10) {
            result = one[num];
            }else if (num < 20) {
                result = two[num - 11] + 'teist';
            } else if (num < 100) {
                var small = parseInt(num % 10);
                result = one[parseInt(String(num).slice(0, 1))] + 'kümmend';
            } else if (num < 1000) {
                var small = parseInt(num % 100);
                result = one[parseInt(String(num).slice(0, 1))] + 'sada';

                if (small > 0) {result = result + ' ' + one[small];}
            }
            
            return result;
        },
        
		merge : function (a, b) {
			a = a || {};
			
			for(var i in b){if(b.hasOwnProperty(i)){
				a[i] = b[i];
			}}
			
			return a;
		},

		iterate : function (collection, callback, finish, options) {
			var options = core.utils.merge({
					delay : 1
				}, options);
			
			(function (collection, callback, finish) {
					var i = 0,
						keys = typeof collection == "object" ? Object.keys(collection) : [],
						step = function (collection, i) {
							if (i < keys.length) {
								callback(i, collection[keys[i]]);
								
								i++;
								
								setTimeout(function () {
									step(collection, i);
								}, options.delay);
							} else if (typeof finish === "function") {
								finish();
							}
						};
					
					step(collection, i);
			})(collection, callback, finish);
		},
		
		timestamp : {
			/*
			* Converts date (dd.mm.yyyy) string into timestamp
			*/
			fromDate : function (date, toMillisecs) {
				var d = date.split(".");
				
				if (d.length === 3) {
					return toMillisecs === true ? (new Date(parseInt(d[2]), parseInt(d[1]) - 1, parseInt(d[0]))).getTime() :
							parseInt((new Date(parseInt(d[2]), parseInt(d[1]) - 1, parseInt(d[0]))).getTime() / 1000);
				}
				
				return 0;
			},
			
			/*
			* Converts timestamp to date format (dd.mm.yyyy)
			*/
			toDate : function (timestamp, stringMonth) {
				var d = new Date(timestamp),
					months = ["Jaanuar", "Veebruar", "Märts","Aprill", "Mai", "Juuni","Juuli", "August", "September","Oktober", "November", "Detsember"];
				
				return	("0" + d.getDate()).slice(-2) + "."  +
						(stringMonth ? ' '+months[d.getMonth()]+' ' :
								("0" + (d.getMonth() + 1)).slice(-2) + ".") +
						d.getFullYear();
			},
			
			/*
			* Converts seconds into daytime format (hh:mm(:ss))
			* TODO: 
			*/
			toTime : function (time, showSeconds, isMillisecs) {
				var d = new Date(isMillisecs === true ? time : time * 1000),
					time = isMillisecs !== true ? time : time / 1000;
				
				return	("0" + d.getHours()).slice(-2) + ":"  +
						("0" + d.getMinutes()).slice(-2)  +
						(showSeconds ? (":" + ("0" +d.getSeconds()).slice(-2)) : "");
			},
			
			/*
			* Converts seconds into duration format (dd:hh:mm)
			*/
			toDuration : function (duration, showSeconds, isMillisecs) {
				duration = isMillisecs !== true ? duration : duration / 1000;
				
				return	(duration > 24 * 3600 ? Math.floor(duration / (24 * 3600)) + "p " : "") + // päev
						(duration > 3600 ? ("0" + Math.floor(duration / 3600) % 24).slice(-2) + "h" : "") + // tund
						(duration > 60 || !showSeconds ? ("0" + Math.floor(duration / 60) % 60).slice(-2) + "m " : "")+ // minut
						(showSeconds ? (("0" + parseInt(duration % 60)).slice(-2)+"s") : ""); // sekund
			},
			
			/*
			* Converts date (dd.mm.yyyy) string into timestamp
			*/
			toSentence : function (timestamp, age, isMillisecs) {
				timestamp = isMillisecs !== true ? timestamp : timestamp / 1000;
				
				if (age <  		1 * 60) {
					return "hetk tagasi";
				} else if (age < 10 * 60) {
					return "mõni minut tagasi";
				} else if (age < 20 * 60) {
					return "veerand tundi tagasi";
				} else if (age < 45 * 60) {
					return "pool tundi tagasi";
				} else if (age < 1.5 * 60 * 60) {
					return "tund aega tagasi";
				} else if (age < 2.5 * 60 * 60) {
					return "paar tundi tagasi";
				} else if (age < 12 * 3600) {
					return "täna " + Sandbox.utils.timestamp.toTime(timestamp);
				} else if (age < 24 * 3600) {
					return Sandbox.utils.timestamp.toTime(timestamp);
				} else {
					return	Sandbox.utils.timestamp.toDate(timestamp) + " " + 
							Sandbox.utils.timestamp.toTime(timestamp);
				}
			}
		}
	}
});


String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst = function() {
    return  this.stdTimezoneOffset() - this.getTimezoneOffset();
}