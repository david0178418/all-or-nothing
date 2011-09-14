function Card(fill, color, shape, count, id) {
	var domRef,
		ctx,
		colorVal,
		fillVal,
		shapeVal,
		countVal,
		self,
		selector = '#card' + id,
		selected = GLOBAL.selected;
	
	function deal() {
		$('#board').append(domRef);
		if(!ctx) {
			ctx = $(selector + ' canvas')[0].getContext('2d');
			x = domRef;
			draw();
		}
		domRef.click(toggleSelect);
	}
	
	function createElement() {
		domRef = $('<div id="card' + id + '" class="card"><div><canvas width="112px" height="160px"></canvas></div></div>');
	}
	function removeElement() {
		domRef.remove();
	}
	
	function toggleSelect() {
		if(domRef.hasClass('selected')) {
			var index = selected.indexOf(self);
			selected.splice(index, 1);
			
			domRef.removeClass('selected');
		}
		else {
			domRef.addClass('selected');
			selected.push(self);
		}
	}
	
	function draw() {
		ctx.strokeStyle = 'rgb(' + colorVal + ')';
		
		
		if(fillVal == 'shaded') {
			ctx.fillStyle = 'rgba(' + colorVal + ',.35)';
		}
		else {
			ctx.fillStyle = 'rgb(' + colorVal + ')';
		}
		
		ctx.lineWidth = 4;
		
		switch(countVal) {
			case 1:
				ctx.translate(32, 54);
				shapeVal();
			break;
			case 2:
				ctx.translate(4, 54);
				shapeVal();
				ctx.translate(54, 0);
				shapeVal();
			break;
			case 3:
				ctx.translate(3, 5);
				shapeVal();
				ctx.translate(26, 52);
				shapeVal();
				ctx.translate(28, 52);
				shapeVal();
			break;
		}
		
	}
	
	function drawShadow() {return;
		ctx.shadowOffsetX = 3;
		ctx.shadowOffsetY = 3;
		ctx.shadowBlur = 5;
		ctx.shadowColor = "black";
	}
	
	function stopShadow() {
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 0;
	}
	
	function drawSquare() {
		drawShadow();
		
		switch(fillVal){
			case 'clear' :
				ctx.strokeRect(0, 0, 44, 44);
				break;
			case 'solid':
				ctx.fillRect(0, 0, 44, 44);
				break;
			case 'shaded':
				ctx.fillRect(0, 0, 44, 44);
				ctx.strokeRect(0, 0, 44, 44);
				break;
		}
	}
	
	function drawOval() {
		drawShadow();
		
		ctx.beginPath();
		ctx.arc(24, 24, 24, 0, Math.PI * 2, false);
		ctx.closePath();
		
		
		
		switch(fillVal){
			case 'clear' :
				ctx.stroke();
				break;
			case 'solid':
				ctx.fill();
				break;
			case 'shaded':
				ctx.fill();
				ctx.stroke();
				break;
		}
	}
	
	function drawTriangle() {
		drawShadow();
		
		ctx.beginPath();
		
		ctx.moveTo(0, 44);
		ctx.lineTo(22, 0);
		ctx.lineTo(44, 44);
		ctx.lineTo(0, 44);
		
		switch(fillVal){
			case 'clear' :
				ctx.stroke();
				break;
			case 'solid':
				ctx.fill();
				break;
			case 'shaded':
				ctx.fill();
				ctx.stroke();
				break;
		}
	}
	
	function getAttributeValues() {
		var colors	= GLOBAL.cardAttributes.color,
			fills	= GLOBAL.cardAttributes.fill,
			shapes	= GLOBAL.cardAttributes.shape,
			counts	= GLOBAL.cardAttributes.count;
		
		switch(color) {
			case colors.red		:
				colorVal = '201,32,32';
				break;
			
			case colors.green	:
				colorVal = '23,179,33';
				break;
			
			case colors.purple	:
				colorVal = '138,0,166';
				break;
		}
		
		switch(fill) {
			case fills.clear	:
				fillVal = 'clear';
				break;
				
			case fills.shaded	:
				fillVal = 'shaded';
				break;
				
			case fills.solid	:
				fillVal = 'solid';
				break;
		}
		
		switch(shape) {
			case shapes.triangle	:
				shapeVal = drawTriangle;
				break;
			
			case shapes.squiggle	:
				shapeVal = drawSquare;
				break;
				
			case shapes.oval		:
				shapeVal = drawOval;
				break;
				
		}
		
		switch(count) {
			case counts.one		:
				countVal = 1;
				break;
				
			case counts.two		:
				countVal = 2;
				break;
				
			case counts.three	:
				countVal = 3;
				break;
		}
	}
	
	getAttributeValues();
	createElement();
	
	self = {
		get remove() {
			return removeElement;
		},
		get deal() {
			return deal;
		},
		get toggleSelect() {
			return toggleSelect;
		},
		get fill() {
			return fill;
		},
		get color() {
			return color;
		},
		get shape() {
			return shape;
		},
		get count() {
			return count
		},
		get selected() {
			return domRef.hasClass('selected');
		}
	};
	
	return self;
}
