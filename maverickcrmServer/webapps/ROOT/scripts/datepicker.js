function DatePicker (pickerId) {
            this.dayNames=['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
            this.monthsNames=['Jan', 'Feb', 'Mar', 'Apr','May', 'Jun', 'Jun','Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            this.daySpaces=['', '', '', '', '', '', ''];
            this.dom = {picker:null,lblMonth:null, pickerHeader:null, lblDate:null, calendar:null};
            this.date={day:null, month:null, year:null, value:null, state:0};
                
            this.build=function(){
                let d= new Date(this.date.value);
                this.dom.lblMonth.innerHTML = this.monthsNames[this.date.month-1];
                
                while(this.dom.calendar.childNodes.length > 0)
                    this.dom.calendar.removeChild(this.dom.calendar.lastChild);

                let currentm = d.getMonth();   
                d.setDate(1);
                let week = this.buildWeek(this.daySpaces);
                for(let i = 1; currentm == d.getMonth(); i++, d.setDate(i)){
                    week.childNodes[d.getDay()].innerHTML = this.padLeft(d.getDate());
                    let nodeDate = d.getDate();
                    week.childNodes[d.getDay()].addEventListener('click', function(){me.setPickedDate(nodeDate)});
                    if(d.getDay() == 6){
                        this.dom.calendar.appendChild(week);
                        week = this.buildWeek(this.daySpaces);
                    }                    
                }
                this.dom.calendar.appendChild(week);
            };
           this.setMaxDay = function(){
        	   let d = new Date(this.date.value);
        	   let currentMonth = d.getMonth();
        	   d.setDate(this.date.day);
        	   for(let day = this.date.day; currentMonth != d.getMonth(); day = this.date.day, d=new Date(this.date.value), d.setDate(day))
        		   this.date.day--; 
        	   this.date.value.setDate(this.date.day);
           };
            this.nextMonth = function (){
            	this.setSelectedDay(false);
                if(this.date.month == 12){
                    this.date.value.setMonth(0);
                    this.date.value.setFullYear(++this.date.year);
                }else
                    this.date.value.setMonth(this.date.month++);
                this.date.month = (this.date.value.getMonth()+1);

            }
            this.prevMonth = function (){
            	this.setSelectedDay(false);
                if(this.date.month == 1){
                    this.date.value.setMonth(11);
                    this.date.value.setFullYear(--this.date.year);
                }else            
                    this.date.value.setMonth(--this.date.month -1);
                this.date.month = (this.date.value.getMonth()+1);
            };
            this.padLeft = (val)=>{return (val < 10)?'0'+val:val};
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
            this.getIsoDate = function (){
            	return this.date.year + '-' + this.padLeft(this.date.month) + '-' + this.padLeft(this.date.day);
            };
            this.setJsonDate = function(jsonDate){
            	this.setDate(jsonDate.day, jsonDate.month, jsonDate.year);
            };
            this.setDate = function (day, month, year){
            	this.date.value.setDate(day);
            	this.date.value.setMonth(month-1);
                this.date.value.setFullYear(year);
                this.date.day = this.date.value.getDate();
                this.date.month = (this.date.value.getMonth() + 1);
                this.date.year = this.date.value.getFullYear();
                this.setDisplayDate();
            };            
            this.setPickedDate = function (nodeDate){
            	this.setSelectedDay(false);
            	this.date.day = nodeDate;
            	this.setDate(this.date.day, this.date.month,this.date.year);
            	this.setSelectedDay(true);
            	this.hide();
            };
            
            this.setDisplayDate = function (){
            	this.dom.lblDate.innerHTML = this.padLeft(this.date.day) + '/' + this.padLeft(this.date.month) + '/' + this.date.year;
            };
            this.setSelectedDay = function(isOn){
            	let d = new Date(this.date.value);
            	d.setDate(1);
            	let week = Math.floor((d.getDay() + this.date.day)/7);
            	if(isOn){
                	this.dom.calendar.childNodes[week].childNodes[this.date.value.getDay()].style.fontWeight = 'bold';
                	this.dom.calendar.childNodes[week].childNodes[this.date.value.getDay()].style.border = '1px inset grey';
            	}
            	else{
                	this.dom.calendar.childNodes[week].childNodes[this.date.value.getDay()].style.fontWeight = 'normal';
                	this.dom.calendar.childNodes[week].childNodes[this.date.value.getDay()].style.border = '';            		
            	}
            };
            this.show  = function (){
                this.dom.pickerHeader.style.display = '';
                this.dom.calendar.style.display = '';
                if(this.date.day != null)this.setSelectedDay(true);
                this.dom.picker.tabIndex = 1;
                this.dom.picker.focus();
                
            };
            this.hide = function (){
                this.dom.pickerHeader.style.display = 'none';
                this.dom.calendar.style.display = 'none';
                this.dom.picker.tabIndex = -1;
            };
            this.toggle = function (){
                if(this.date.state == 0){
                    this.date.state = 1;
                    this.build();
                    this.show();
                }else{
                    this.date.state = 0;
                    this.hide();
                }
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
            this.buildTBODY = function(id, display){
                let locTbody = document.createElement('TBODY');
                locTbody.id = this.dom.picker.id + '_' + id;
                locTbody.style.display = display;
                return locTbody;
            };
            this.buildTR = function(){return document.createElement('TR');};
            var me = this;   
            this.dom.picker = document.getElementById(pickerId);
            let tbody = this.buildTBODY('dateContainer', '');
            let tr = this.buildTR();
            tbody.appendChild(tr);
            this.dom.lblDate = this.buildTD(pickerId + '_' + 'lblDate', 7, 'pointer', 'center', '', 'Set Date')
            this.dom.lblDate.onclick = function(){me.toggle()};
            tr.appendChild(this.dom.lblDate);
            this.dom.picker.appendChild(tbody);

            // month movement tbody
            this.dom.pickerHeader = this.buildTBODY('pickerHeader', 'none');
            tr = this.buildTR();
            this.dom.pickerHeader.appendChild(tr);
            // previous month
            let td = this.buildTD(pickerId + 'prevMonth', 2, 'pointer', '', 'previous month', '');
            let img = document.createElement('IMG');
            img.src = 'images/date_prev.png';
            td.appendChild(img);
            td.addEventListener('click',function(){me.prevMonth(); me.build();})
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
            td.addEventListener('click',function(){me.nextMonth(); me.build();})
            this.dom.picker.appendChild(this.dom.pickerHeader);

            // calendar tbody
            this.dom.calendar = this.buildTBODY('datePicker', 'none');
            this.dom.picker.appendChild(this.dom.calendar);

            this.date.value = new Date();
            this.date.month = (this.date.value.getMonth()+1);
            this.date.year = this.date.value.getFullYear();
            this.date.day = 1;
            this.dom.pickerHeader.appendChild(this.buildWeek(this.dayNames));    
        }