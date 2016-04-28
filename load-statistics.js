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

		var xlabel = "Flow (cfs)"

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")

		var canvas = d3.select("#hist-chart").append("svg")
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

	function generate_bp(){
		var labels = true; // show the text labels beside individual boxplots?

		var margin = {top: 30, right: 50, bottom: 70, left: 50};
		var width = 800 - margin.left - margin.right;
		var height = 400 - margin.top - margin.bottom;
    var padding = 20;
    var midline = (height - padding) / 2;

    //initialize the x scale
    var xScale = d3.scale.linear().range([padding, width - padding]); 

    //initialize the x axis
    var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom");

		//initialize boxplot statistics
    var bpdata = [],
        outliers = [],
        minVal = Infinity,
        lowerWhisker = Infinity,
        q1Val = Infinity,
        medianVal = 0,
        q3Val = -Infinity,
        iqr = 0,
        upperWhisker = -Infinity,
        maxVal = -Infinity;

    //Calculate box plot statistics
    flows = flows.sort(d3.ascending);
    q1Val = d3.quantile(flows, .25),
    medianVal = d3.quantile(flows, .5),
    q3Val = d3.quantile(flows, .75),
    iqr = q3Val - q1Val,
    maxVal = flows[flows.length - 1];

    var index = 0;

    while (index < flows.length && lowerWhisker == Infinity) {
      if (flows[index] >= (q1Val - 1.5*iqr))
        lowerWhisker = flows[index];
      else
        outliers.push(flows[index]);
      index++;   
    }

    index = flows.length-1; // reset index to end of array

    //search for the upper whisker, the maximum value within q1Val + 1.5*iqr
    while (index >= 0 && upperWhisker == -Infinity) {
      if (flows[index] <= (q3Val + 1.5*iqr))
        upperWhisker = flows[index];
      else
        outliers.push(flows[index]);
      index--;
    }
    console.log(iqr);
    console.log(q3Val);
    console.log(q1Val);
    console.log(outliers);

    //map the domain to the x scale +10%
    xScale.domain([0,maxVal*1.10]);

    var svg = d3.select("#bp-chart")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    //append the axis
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0, " + (height - padding) + ")")
       .call(xAxis);

    //draw verical line for lowerWhisker
    svg.append("line")
       .attr("class", "whisker")
       .attr("x1", xScale(lowerWhisker))
       .attr("x2", xScale(lowerWhisker))
       .attr("stroke", "black")
       .attr("y1", midline - 10)
       .attr("y2", midline + 10);
  }

	$('input[type=checkbox]').change(function(e){
		var id = $(e.target).attr("id");
		switch(id){
			case 'freq':
				if($('#freq').is(':checked')){
					$('#freq-dist').fadeIn('slow').removeClass('hidden');
					generate_histogram(flows, 5);
				}else{
					$('.freq-dist').empty();
				}
				break;
			case 'bp':
				if($('#bp').is(':checked')){
					$('#bp-wrap').fadeIn('slow').removeClass('hidden');
					generate_bp();
				}else{
					$('.bp-chart').empty();
				}
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

	$("#slider-range").slider(); /*{
	    range: true,
	    min: 0,
	    max: flows.length-1,
	    values: [0, d3.max(flows) - 1],
	    slide: function( event, ui ) {
	    	/*$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        	var maxv = d3.min([ui.values[1], d3.max(flows)]);
    		var minv = d3.max([ui.values[0], 0]);
    		console.log( event, ui );
      	}
    });

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