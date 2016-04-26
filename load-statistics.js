jQuery(function($){				

	var flows = JSON.parse(localStorage.getItem('flows'));
	var dates = JSON.parse(localStorage.getItem('dates'));	

	function generate_histogram(flows, bins){
		var width = 500,
			height = 500,
			padding = 50,
			numBins = bins //default is 5
		var minFlow = d3.min(flows);
		var maxFlow = d3.max(flows);
		
		var histogram = d3.layout.histogram()
			.bins(numBins)
			(flows)

		var y = d3.scale.linear()
			.domain([0, flows.length])
			.range([0, height])

		var x = d3.scale.linear()
			.domain([0,d3.max(flows)])
			.range([0, width])

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")

		var canvas = d3.select("#chart").append("svg")
			.attr("width", width + padding)
			.attr("height", height + padding)
				.attr("transform","translate(20,0)")

		var group = canvas.append("g")
			.attr("transform","translate(0," + height + ")")
			.call(xAxis);

		var bars = canvas.selectAll(".bar")
			.data(histogram)
			.enter()
			.append("g")

		bars.append("rect")
			.attr("x", function(d) { return x(d.x); })
			.attr("y", function(d) { return 500 - y(d.y); })
			.attr("width", function(d) { return x(d.dx) })
			.attr("height", function(d) { return y(d.y); })
			.attr("fill", "steelblue")

		bars.append("text")
			.attr("x", function(d) { return x(d.x); })
			.attr("y", function(d) { return 500 - y(d.y); })
			.attr("fill", "#555")
			.attr("dx", function(d) { return x(d.dx)/2; })
			.attr("text-anchor", "middle")
			.text(function(d) { return d.y; })
	}

	$('input[type=checkbox]').change(function(e){
		var id = $(e.target).attr("id");
		switch(id){
			case 'freq':
				if($('#freq').is(':checked')){
					$('#freq-dist').fadeIn('slow').removeClass('hidden');
					generate_histogram(flows, 5);
				}else{
					$('.freq-dist-plot').remove();
				}
				break;
			case 'bp':
				break;
			case 'ts':
				break;
			case 'avg':
				break;
			case 'sd':
				break;
			case 'vari':
				break;
			case 'minmax':
				break;
			case 'corco':
				break;
			default:
				console.log('default');
				break;
		}
	});

	/*-----------------Histogram triggers --------------------------*/
	$("input[name='number-of-bins']").change(function(){
		console.log('changed');
		console.log(newValue);
		var newValue = $("input[name='number-of-bins']").val();
		if(newValue === parseInt(newValue,10)){
			generate_histgram(flows, newValue);
			console.log('function called');
		}else{
			alert('Number of bins must be an integer.')
		}
	});

	$("#slider-range").slider();/*
	    range: true,
	    min: 0,
	    max: flows.length-1,
	    values: [0, d3.max(flows) - 1],
	    slide: function( event, ui ) {
	    	$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        	/*var maxv = d3.min([ui.values[1], d3.max(flows)]);
    		var minv = d3.max([ui.values[0], 0]);
      	}
    });*/

/*    $( "#amount" ).val( "$" + $( "#slider-range" )
    	.slider( "values", 0 ) + " - $" + $( "#slider-range" ).slider( "values", 1 ) );

		    x.domain([minv, maxv-1]);
		    graph.transition().duration(750)
		      .select(".x.axis").call(xAxis);
		    graph.transition().duration(750)
		      .select(".path").attr("d", line(flows));

	    }
	});

*/

});