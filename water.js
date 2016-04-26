//Handles loading spreadsheet data and navigating between pages
jQuery(function($){

	var data;
	var dpoints;
	var comArr = [];
	var dates = [];
	var flows = [];

	function load_stats_interface(){
		$('#back-btn').removeClass('hidden');
		d3.select('#landing-page').style('display','none');
		$('#stat-wrap').fadeIn('slow').removeClass('hidden');
		$('body').removeClass('page2').addClass('page3');
		d3.select('#back-btn').style('margin-left')
	}

	function handleFileSelect(evt) {
	    var file = evt.target.files[0];
	    Papa.parse(file, {
			header: true,
			dynamicTyping: true,
			complete: function(results) {
				data = results;
				dpoints = data.data;
				var dpointArray = $.map(dpoints, function(value, index) {
					return [value];
				});
				for(i in dpointArray) {
					var obj = dpointArray[i];
					for(key in obj) {
						if(obj.hasOwnProperty(key)) {
							var value = obj[key];
							comArr.push(value);
						}
					}
				}
				for(i in comArr){
					var str = comArr[i];
					var temp = str.split(" ");   
					var date = temp[0];   
					var flow = parseInt(temp[1], 10);
					dates.push(date);
					flows.push(flow);

				}

				localStorage.setItem('dates', JSON.stringify(dates));
				localStorage.setItem('flows', JSON.stringify(flows));

				$('.read-success').fadeIn().removeClass('hidden');
				$('.read-fail').addClass('hidden');
				$('.submit-btn').fadeIn().removeClass('hidden');
				$('.reset-btn').fadeIn().removeClass('hidden');
			},
			error: function(){
				console.log('error');
				$('.read-fail').fadeIn().removeClass('hidden');
				$('.read-success').addClass('hidden');
			}
	    });
	}

	function load_second_page() {
		$('#landing-page').fadeIn('slow').removeClass('hidden');
		$('#footer').addClass('hidden');
		$('#header').removeClass('hidden');
		$('body').removeClass('page1').addClass('page2');
		$('#back-btn').addClass('hidden');
		d3.select('#stat-wrap').style('display','none');
	}

	//Triggering events
	$("#csv-file").change(handleFileSelect);
	$(".submit-btn").click(function(){
		load_stats_interface();
	});
	$(".submit-btn-splash").click(function(){
		load_second_page();
	});

	var file = $('#csv-file');
	$(".reset-btn").on("click", function () {
	    file.replaceWith( file = file.clone( true ) );
	    $('#file-status div').addClass('hidden');
	    d3.select('.read-success')
	    	.style('display',null);
	    d3.select('.reset-btn')
	    	.style('color','#ccc')
	    	.style('border-color','#ccc');
	    d3.select('.reset-btn:hover')
	    	.style('curser','default');
	});
	$('#back-btn').click(function(){
		var page = $('body').attr('class');
		switch(page){
			case 'page3':
				load_second_page();
				break;
			default:
				break;
		} 
	});
	$('#header .logo').click(function(){location.reload();});
});