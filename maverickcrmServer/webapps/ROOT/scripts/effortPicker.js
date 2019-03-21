function EffortPicker (pickerId,onShowFunc) {
            this.dayNames=['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
            this.monthsNames=['Jan', 'Feb', 'Mar', 'Apr','May', 'Jun', 'Jun','Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            this.daySpaces=['', '', '', '', '', '', ''];
            this.dom = {picker:null, monthsEffort:null, daysEffort:null, hoursEffort:null, lblEffort:null, effortSetter:null};
            this.value = null;
            this.guiState = 0;

            // ***** Getters ***** //
            this.padLeft = (val)=>{return (val < 10)?'0'+val:val};
            this.getIsoDate = function (){
            	if(this.value == null) return '';
            	return this.value.getFullYear() + '-' + this.padLeft(this.value.getMonth()+1) + '-' + this.padLeft(this.value.getDate());
            };

            // ***** Display ***** //
            this.setDisplayDate = function (){
            	this.dom.lblDate.innerHTML = this.padLeft(this.value.getDate()) + '/' + this.padLeft(this.value.getMonth()+1) + '/' + this.value.getFullYear();
            };

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
                this.calculatedDate = null;
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
            this.createNumberInput = function(id, display, min, value){
                let input = document.createElement('INPUT');
                input.type = 'number';
                input.id = this.dom.picker.id + '_' + id;
                input.style.display = display;
                input.min = min;
                input.value = value;
                input.style.width = '3em';
                return input;
            };            

            // ***** Initialization ***** //
            var me = this;

            this.dom.picker = document.getElementById(pickerId);
            this.dom.picker.onblur = function(event){
            	let evt = window.event || event;
            	if(evt.relatedTarget == me.dom.monthsEffort || evt.relatedTarget == me.dom.daysEffort || evt.relatedTarget == me.dom.hoursEffort)
            		return;
            	me.hide()};
            this.dom.picker.onclick = function(event){
            	let evt = window.event || event;
            	if(evt.target == me.dom.monthsEffort || evt.target == me.dom.daysEffort || evt.target == me.dom.hoursEffort)
            		return;
//            	me.toggle();
            	};
            // date display
            this.dom.lblEffort = this.createSpan(pickerId + '_' + 'lblEffort', 'pointer', 'center', '', '00:00:00')
            this.dom.lblEffort.onclick = function(){
            	if(onShowFunc != null)
            		if(onShowFunc() == false) return;
            	me.toggle();
            };
            this.dom.picker.appendChild(this.dom.lblEffort);
            
            this.dom.effortSetter = this.createDIV('datePicker', 'none');
            this.dom.effortSetter.className = 'cssdropDown';
            
            this.dom.monthsEffort = this.createNumberInput('months', '', 0, 0);
            this.dom.effortSetter.appendChild(this.dom.monthsEffort);
            this.dom.daysEffort = this.createNumberInput('days', '', 0, 0);
            this.dom.effortSetter.appendChild(this.dom.daysEffort);
            this.dom.hoursEffort = this.createNumberInput('hours', '', 0, 0);
            this.dom.effortSetter.appendChild(this.dom.hoursEffort);            
            
            this.dom.picker.appendChild(this.dom.effortSetter);
   
        }