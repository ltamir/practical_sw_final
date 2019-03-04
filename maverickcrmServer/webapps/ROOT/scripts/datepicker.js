function DatePicker (pickerId,onShowFunc) {
            this.dayNames=['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
            this.monthsNames=['Jan', 'Feb', 'Mar', 'Apr','May', 'Jun', 'Jun','Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            this.daySpaces=['', '', '', '', '', '', ''];
            this.dom = {picker:null,lblMonth:null, pickerTable:null, lblDate:null, calendar:null};
            this.value = null;
            this.guiState = 0;

            this.build=function(calculatedDate){
                let d = this.createDate(calculatedDate);
                this.dom.lblMonth.innerHTML = this.monthsNames[d.getMonth()] + ' ' + d.getFullYear();
                
                while(this.dom.calendar.childNodes.length > 2)
                    this.dom.calendar.removeChild(this.dom.calendar.lastChild);

                let currentm = d.getMonth();   
                d.setDate(1);
                let week = this.buildWeek(this.daySpaces);
                for(let i = 1; currentm == d.getMonth(); i++, d.setDate(i)){
                    week.childNodes[d.getDay()].innerHTML = this.padLeft(d.getDate());
                    let nodeDate = d.getDate();
                    let nodeMonth = d.getMonth();
                    let nodeYear = d.getFullYear();
                    week.childNodes[d.getDay()].addEventListener('click', function(){me.setPickedDate(nodeDate, nodeMonth, nodeYear)});
                    if(d.getDay() == 6){
                        this.dom.calendar.appendChild(week);
                        week = this.buildWeek(this.daySpaces);
                    }                    
                }
                this.dom.calendar.appendChild(week);
            };

            // ***** Month movements ***** //
           this.setMaxDay = function(calculatedDate, newMonth){
                let d = calculatedDate;
                let origMonth = d.getMonth();
                let currentDay = d.getDate();
                
                d.setMonth(newMonth);
               for(let day = currentDay-1; d.getMonth() != newMonth; --day, d.setMonth(origMonth), d.setDate(day));
               this.build(d);
                this.setSelectedDay(calculatedDate, true);
                this.calculatedDate = calculatedDate;
               if(d.getFullYear() < 1900){console.log(d.getFullYear());}
           };
           this.calculatedDate = null;
            this.nextMonth = function (){
                let monthInc = 1, yearInc = 0;
                let calculatedDate = (this.calculatedDate == null)?this.createDate(this.value):this.calculatedDate;
                if(calculatedDate.getMonth() == 11){
                    monthInc = -11;
                    calculatedDate.setFullYear(calculatedDate.getFullYear()+1);                  
                }
                this.setMaxDay(calculatedDate, (calculatedDate.getMonth()+monthInc));
            }
            this.prevMonth = function (){
                let monthInc = -1, yearInc = 0;
                let calculatedDate = (this.calculatedDate == null)?this.createDate(this.value):this.calculatedDate;
                if(calculatedDate.getMonth() == 0){
                    monthInc = 11;
                    calculatedDate.setFullYear(calculatedDate.getFullYear()-1);
                }
                this.setMaxDay(calculatedDate, (calculatedDate.getMonth()+monthInc));
            };

            // ***** Setters ***** //
            this.setJsonDate = function(jsonDate){
            	if(jsonDate == null){
                    this.value = null;
                    this.dom.lblDate.innerHTML = 'Set due date';
            	}else{
            		this.setValue(jsonDate.day, (jsonDate.month-1), jsonDate.year);
            	}
            };
            this.setValue = function (day, month, year){
                this.value = this.createDate(this.value);
                this.value.setFullYear(year);
            	this.value.setMonth(month);
                this.value.setDate(day);
            };         
            this.setCalculatedDate = function (calculatedDate, nodeDate){
            	this.setSelectedDay(calculatedDate, false);
            	// calculatedDate.setValue(calculatedDate, nodeDate);
                this.setSelectedDay(calculatedDate, true);
            };
            this.setPickedDate = function (nodeDate, nodeMonth, nodeYear){
                if(this.value !=null && this.value.getMonth() == nodeMonth) this.setSelectedDay(this.value, false);
                this.setValue(nodeDate, nodeMonth, nodeYear);
                this.setSelectedDay(this.value, true);
                this.setDisplayDate();
                this.calculatedDate = null;
            	this.hide();
            };
            
            // ***** Getters ***** //
            this.padLeft = (val)=>{return (val < 10)?'0'+val:val};
            this.getIsoDate = function (){
            	if(this.value == null) return '';
            	return this.value.getFullYear() + '-' + this.padLeft(this.value.getMonth()+1) + '-' + this.padLeft(this.value.getDate());
            };
            this.createDate = function(dateBase){
                if(dateBase == null)
                    return new Date();
                return new Date(dateBase);
            }
            this.getValue = ()=>{(this.value == null)?"":this.value}

            // ***** Display ***** //
            this.setDisplayDate = function (){
            	this.dom.lblDate.innerHTML = this.padLeft(this.value.getDate()) + '/' + this.padLeft(this.value.getMonth()+1) + '/' + this.value.getFullYear();
            };
            this.setSelectedDay = function(calculatedDate, isOn){
            	let d =this.createDate(calculatedDate);
            	d.setDate(1);
            	let week = Math.floor((d.getDay() + calculatedDate.getDate() - 1)/7);
            	week += 2;
            	if(isOn){
                	this.dom.calendar.childNodes[week].childNodes[calculatedDate.getDay()].style.fontWeight = 'bold';
                	this.dom.calendar.childNodes[week].childNodes[calculatedDate.getDay()].style.border = '1px inset grey';
            	}
            	else{
                	this.dom.calendar.childNodes[week].childNodes[calculatedDate.getDay()].style.fontWeight = 'normal';
                	this.dom.calendar.childNodes[week].childNodes[calculatedDate.getDay()].style.border = '';            		
            	}
            };
            this.show  = function (){
                this.dom.calendar.style.display = '';
                this.setSelectedDay(this.createDate(this.value), true);
                this.dom.picker.tabIndex = 1;
                this.dom.picker.focus();
                this.guiState = 1;
            };
            this.hide = function (){
                this.dom.calendar.style.display = 'none';
                this.dom.picker.blur();
                this.dom.picker.tabIndex = '';
                this.guiState = 0;
                this.calculatedDate = null;
            };
            this.toggle = function (){
                if(this.guiState == 0){
                    let calculatedDate = this.createDate(this.value);
                    this.build(calculatedDate);
                    this.show();
                }else{
                    this.hide();
                }
            };
            
            // ***** DOM builders ***** //
            this.buildWeek = function (values){
                let divRow = document.createElement('TR');
                
                for(let i = 0;i < 7; i++){
                    let day = document.createElement('TD');
                    day.innerHTML = values[i];
                    day.style.cursor = 'pointer';
                    divRow.appendChild(day);
                }
                return divRow;
            };
            this.buildTD = function(id, colspan, cursor, textAlign, title, data){
                let td = document.createElement('TD');
                td.id = pickerId + '_' + id;
                td.colSpan = colspan;
                td.style.cursor = cursor;
                td.style.textAlign = textAlign;
                td.title = title;
                td.innerHTML = data;
                return td;
            };
            this.createSpan = function(id, cursor, textAlign, title, data){
                let span = document.createElement('span');
                span.id = pickerId + '_' + id;
                span.style.cursor = cursor;
                span.style.textAlign = textAlign;
                span.title = title;
                span.innerHTML = data;
                return span;
            };            
            this.buildTBODY = function(id, display){
                let locTbody = document.createElement('TBODY');
                locTbody.id = this.dom.picker.id + '_' + id;
                locTbody.style.display = display;
                return locTbody;
            };
            this.buildTR = function(){return document.createElement('TR');};

            // ***** Initialization ***** //
            var me = this;

            this.dom.picker = document.getElementById(pickerId);
            this.dom.picker.onblur = function(){me.hide()};
            // date display
            this.dom.lblDate = this.createSpan(pickerId + '_' + 'lblDate', 'pointer', 'center', '', 'Set Due Date')
            this.dom.lblDate.onclick = function(){
            	if(onShowFunc != null)
            		if(onShowFunc() == false) return;
            	me.toggle();
            };
            this.dom.picker.appendChild(this.dom.lblDate);
            
            // calendar table
            this.dom.pickerTable = document.createElement('table');
            this.dom.picker.appendChild(this.dom.pickerTable);
            this.dom.calendar = this.buildTBODY('datePicker', 'none');
            this.dom.calendar.className = 'cssdropDown';
            this.dom.pickerTable.appendChild(this.dom.calendar);
            //month-year display and movement

            let tr = this.buildTR();
            this.dom.calendar.appendChild(tr);
            // previous month
            let td = this.buildTD(pickerId + 'prevMonth', 2, 'pointer', '', 'previous month', '');
            let img = document.createElement('IMG');
            img.src = 'images/date_prev.png';
            td.appendChild(img);
            td.addEventListener('click',function(){me.prevMonth();})
            tr.appendChild(td);
            //month name
            this.dom.lblMonth = this.buildTD('monthName', 3, '', 'center', '', '');
            tr.appendChild(this.dom.lblMonth);
            //next month
            td = this.buildTD(pickerId + 'nextMonth', 2, 'pointer', 'right', 'next month', '');
            img = document.createElement('IMG');
            img.src = 'images/date_next.png';
            td.appendChild(img);
            tr.appendChild(td);
            td.addEventListener('click',function(){me.nextMonth();})

            // calendar tbody
            this.dom.picker.appendChild(this.dom.calendar);
            
            this.dom.calendar.appendChild(this.buildWeek(this.dayNames));    
        }