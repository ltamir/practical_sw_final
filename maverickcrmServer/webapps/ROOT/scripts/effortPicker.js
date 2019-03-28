function EffortPicker (pickerId,onShowFunc, dayToMonth = 20, hourToDay = 9) {

            this.dom = {picker:null, lblEffort:null, effortSetter:null};
            this.monthsEffort = null;
            this.daysEffort = null;
            this.hoursEffort = null;
            this.guiState = 0;
            this.dayToMonth = dayToMonth;
            this.hourToDay = hourToDay;
            
            // ***** Getters ***** //
            this.padLeft = (val)=>{return (val < 10)?'0'+val:val};
            this.getValue = function(){
            	return {months:this.monthsEffort.value, days:this.daysEffort.value, hours:this.hoursEffort.value};
            }

            // ***** Setter ***** //
            this.setValue = function(months, days, hours){
            	this.monthsEffort.value = (months == '' || months == null)?0 : months;
            	this.daysEffort.value = (days == '' || days == null)?0 : days;
            	this.hoursEffort.value = (hours == '' || hours == null)?0 : hours;
            	this.setDisplay(months, days, hours);
            };
            
            this.setDisplay = function(months, days, hours){
            	this.dom.lblEffort.innerHTML = this.padLeft(months) + ':' + this.padLeft(days) + ':' + this.padLeft(hours);
            };
            
            this.setHoursValue = function(hours){
            	let mm = Number.parseInt(hours / this.dayToMonth / this.hourToDay);
            	hours = Number.parseInt(hours % (this.dayToMonth * this.hourToDay))
            	let dd = Number.parseInt(hours / this.hourToDay);
            	hours = Number.parseInt(hours % this.hourToDay);
            	let hh = Number.parseInt(hours)
            	this.setValue(mm, dd, hh);
            };            
            
            this.formatValue = function(val){
            	return Number.parseInt(val); // try - catch with undo upon exception
            }
            // ***** Display ***** //

            this.show  = function (){
                this.dom.effortSetter.style.display = 'block';
                this.dom.picker.tabIndex = 1;
                this.dom.picker.focus();
                this.guiState = 1;
            };
            this.hide = function (){
                this.dom.effortSetter.style.display = 'none';
                this.dom.picker.blur();
                this.dom.picker.tabIndex = '';
                this.guiState = 0;
                this.setDisplay(this.formatValue(this.monthsEffort.value),
                		this.formatValue(this.daysEffort.value),
                		this.formatValue(this.hoursEffort.value));
            };
            this.toggle = function (){
                if(this.guiState == 0){
                    this.show();
                }else{
                    this.hide();
                }
            };
            
            // ***** DOM builders ***** //
            this.createSpan = function(id, cursor, textAlign, title, data){
                let span = document.createElement('span');
                span.id = pickerId + '_' + id;
                span.style.cursor = cursor;
                span.style.textAlign = textAlign;
                span.title = title;
                span.innerHTML = data;
                return span;
            };            
            this.createDIV = function(id, display){
                let locTbody = document.createElement('DIV');
                locTbody.id = this.dom.picker.id + '_' + id;
                locTbody.style.display = display;
                return locTbody;
            };
            this.createNumberInput = function(id, display, placeholder, title){
                let input = document.createElement('INPUT');
                input.type = 'text';
                input.id = this.dom.picker.id + '_' + id;
                input.style.display = display;
                input.placeholder = placeholder;
                input.style.width = '1.3em';
                input.title = title;
                input.value = 0;
                input.onkeydown = function(event){
                	let char = parseInt(event.key, 10); //event.which || event.keyCode;
                	if(event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 39)
                		return;
                	if(event.keyCode == 13)
                		me.hide();
                	if(isNaN(char))
                		return false;
                	}
                input.onblur = function(event){
                	let evt = window.event || event;
                	if(evt.relatedTarget == me.monthsEffort || evt.relatedTarget == me.daysEffort || evt.relatedTarget == me.hoursEffort)
                		return;
                	
            		me.hide()
                	if(input.value.length == 0)
                		input.value = 0;
                	};                
                return input;
            };
            this.createImage = function(imgNode){
            	let img = document.createElement("IMG");
            	img.src = imgNode.src;
            	img.title = imgNode.title;
            	return img;
            }            

            // ***** Initialization ***** //
            var me = this;

            this.dom.picker = document.getElementById(pickerId);
            this.dom.picker.onblur = function(event){
            	let evt = window.event || event;
            	if(evt.relatedTarget == me.monthsEffort || evt.relatedTarget == me.daysEffort || evt.relatedTarget == me.hoursEffort)
            		return;
            	me.hide()};
            this.dom.picker.onclick = function(event){
            	let evt = window.event || event;
            	if(evt.target == me.monthsEffort || evt.target == me.daysEffort || evt.target == me.hoursEffort)
            		return;
            	};
            	
            // effort display
            this.dom.lblEffort = this.createSpan('lblEffort', 'pointer', 'center', '', '00:00:00');
            this.dom.lblEffort.title = 'Task effort in months : days : hours';
            this.dom.lblEffort.onclick = function(){
            	if(onShowFunc != null)
            		if(onShowFunc() == false) return;
            	me.toggle();
            };
            this.dom.picker.appendChild(this.dom.lblEffort);
            
            // effort setters
            this.dom.effortSetter = this.createDIV('datePicker', 'none');
            this.dom.effortSetter.className = 'cssdropDown';
            this.monthsEffort = this.createNumberInput('months', '', 0, 'months');
            this.dom.effortSetter.appendChild(this.monthsEffort);
            this.dom.effortSetter.appendChild(document.createTextNode(':'));
            this.daysEffort = this.createNumberInput('days', '', 0, 'days');
            this.dom.effortSetter.appendChild(this.daysEffort);
            this.dom.effortSetter.appendChild(document.createTextNode(':'));
            this.hoursEffort = this.createNumberInput('hours', '', 0, 'hours');
            this.dom.effortSetter.appendChild(this.hoursEffort);
            
            this.dom.picker.appendChild(this.dom.effortSetter);
   
        }