var Baseline = {

	set: function(props) {

		props = props || {};
		props.size = props.size || 24;
		props.width = props.width || 10;

		var cnv = document.createElement('canvas');
		var ctx = cnv.getContext('2d');
		cnv.width = props.width;
		cnv.height = props.size; 

		ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
		ctx.fillRect(0, props.size - 1, props.width, 1);

		// ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
		// ctx.fillRect(0, props.size * 0.5 - 1, props.width * 0.5, 1);

		document.body.style.backgroundImage = 'url(' + cnv.toDataURL() + ')';
	} 

}