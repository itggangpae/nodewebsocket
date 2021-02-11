/*
$(function(){
	//jQuery 이용하여 canvas element 객체 얻기
	var ctx = $('#cv').get(0).getContext('2d');
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(0,0,200,200);
});
 */

/*
$(function(){
	//jQuery 이용하여 canvas element 객체 얻기
	var ctx = $('#cv').get(0).getContext('2d');
	ctx.strokeStyle = "#FF0000";
	ctx.lineWidth=5;
	ctx.beginPath();
	ctx.arc(200,200, 100, 0,2*Math.PI);
	ctx.stroke();
});
 */

/*
$(function(){
	//jQuery 이용하여 canvas element 객체 얻기
	var ctx = $('#cv').get(0).getContext('2d');
	ctx.strokeStyle = "#FF0000";
	ctx.lineWidth=5;
	ctx.beginPath();
	ctx.moveTo(100,100);
	ctx.lineTo(200,200);
	ctx.stroke();
});
 */

/*
$(function(){
	//jQuery 이용하여 canvas element 객체 얻기
	var ctx = $('#cv').get(0).getContext('2d');
	ctx.strokeStyle = "white";
	ctx.lineWidth=5;
	ctx.beginPath();
	var drawing = false;
	$('#cv').bind('mousedown', function(e){
		drawing=true;
		ctx.moveTo(e.pageX, e.pageY);
	}); $('#cv').bind('mousemove', function(e){
		if(drawing){
			ctx.lineTo(e.pageX, e.pageY);
			ctx.stroke();
		}
	});
	$('#cv').bind('mouseup', function(e){
		drawing=false;
	});
});
 */

var ctx;
var socket;

var msg = {
		line : {
			send : function(type, x, y) {
				console.log(type, x, y);
				socket.emit('linesend', {
					'type' : type,
					'x' : x,
					'y' : y,
					'color' : shape.color,
					'width' : shape.width
				});
			}
		}
}

$(document).ready(function() {
	socket = io.connect('http://' + window.location.host);

	// jQuery 이용하여 canvas element 객체 얻기
	ctx = $('#cv').get(0).getContext('2d');

	// jQuery bind 이용하여 canvas에 마우스 시작,이동,끝 이벤트 핸들러 등록
	$('#cv').bind('mousedown', draw.start);
	$('#cv').bind('mousemove', draw.move);
	$('#cv').bind('mouseup', draw.end);

	// 기본 모양 색상 설정
	shape.setShape();
	$('#clear').bind('click', draw.clear);

	//색상 배열
	var color_map = 
		[
			{'value':'white','name':'하얀색'},
			{'value':'red','name':'빨간색'},
			{'value':'orange','name':'주황색'},
			{'value':'yellow','name':'노란색'},
			{'value':'blue','name':'파랑색'}, 	
			{'value':'black','name':'검은색'}
			];

	//색상 선택 select 설정
	for(var key in color_map){
		$('#pen_color').append('<option value=' + color_map[key].value + '>' +  color_map[key].name + '</option>');
	}

	//두께 선택 select 설정
	for(var i = 2 ; i < 15 ; i++){
		$('#pen_width').append('<option value=' + i + '>' +  i + '</option>');
	}

	$('select').bind('change', shape.change);

	socket.on('linesend_toclient', function (data) {
		draw.drawfromServer(data);
	});


});

/*
var shape = {
		// 기본 색상,두께 설정
		color : 'white',
		width : 3,
		// 모양 변경 메서드
		setShape : function(color, width) {
			if (color != null)
				this.color = color;
			if (width != null)
				this.width = width;
			ctx.strokeStyle = this.color;
			ctx.lineWidth = this.width;
		}
}
 */

var shape = {
		// 기본 색상,두께 설정
		color : 'white',
		width : 3,

		change : function() {
			var color = $('#pen_color option:selected').val();
			var width = $('#pen_width option:selected').val();
			shape.setShape(color, width);
		},
		// 모양 변경 메서드
		setShape : function(color, width) {
			if (color != null)
				this.color = color;
			if (width != null)
				this.width = width;

			ctx.strokeStyle = this.color;
			ctx.lineWidth = this.width;

			ctx.clearRect(703, 0, 860, 90);
			ctx.beginPath();
			ctx.moveTo(710, 55);
			ctx.lineTo(820, 55);
			ctx.stroke();
		}
}	

//그리기 관련
var draw = {
		drawing : null,
		start : function(e) {
			ctx.beginPath();
			ctx.moveTo(e.pageX, e.pageY);
			this.drawing = true;
			msg.line.send('start',e.pageX,e.pageY);
		},
		move : function(e) {
			if (this.drawing) {
				ctx.lineTo(e.pageX, e.pageY);
				ctx.stroke();
				msg.line.send('move',e.pageX,e.pageY);

			}
		},
		end : function(e) {
			this.drawing = false;
			msg.line.send('end');

		},
		clear : function(){
			ctx.clearRect(0,0,cv.width, cv.height);
			msg.line.send('clear');
		},
		drawfromServer : function(data){
			if(data.type == 'start'){
				ctx.beginPath(); 
				ctx.moveTo(data.x,data.y);
				ctx.strokeStyle = data.color;
				ctx.lineWidth = data.width;
			}
			if(data.type == 'move'){
				ctx.lineTo(data.x,data.y);
				ctx.stroke();
			}
			if(data.type == 'end'){
			}
			if(data.type == 'clear'){
				ctx.clearRect(0, 0, cv.width,cv.height);
				shape.setShape();
			}
		}		

}

