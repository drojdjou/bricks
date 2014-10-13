<?php

# Links:

# http://kb.mediatemple.net/questions/85/Using+.htaccess+rewrite+rules#gs
# https://developers.facebook.com/docs/sharing/best-practices
# https://developers.facebook.com/tools/debug/og/object/

$host = 'http://' . $_SERVER['SERVER_NAME'];
$url = $_SERVER['REQUEST_URI'];

$path = "/lab/share_fb/";

$red_url = $path . "result-red";
$blue_url =  $path . "result-blue";
$green_url =  $path . "result-green";

$red_image = $host . $path . "red.png";
$green_image = $host . $path . "green.png";
$blue_image = $host . $path . "blue.png";
$grey_image = $host . $path . "grey.png";

$share_url = $host . $path;

?>

<!DOCTYPE html>
<html>
<head>
<title>Facebook customized share brick</title>


<meta property='og:site_name' content='FB Share brick'/>

<?php 

switch($url) {
	case $red_url:
		echo "<meta property='og:title' content='Sharing the red result page'/>\n";
		echo "<meta property='og:image' content='" . $red_image . "'/>\n";
		echo "<meta property='og:url' content='" . $host . $red_url . "'/>\n";
		$share_url = $host . $red_url;
	break;

	case $green_url:
		echo "<meta property='og:title' content='Sharing the green result page'/>\n";
		echo "<meta property='og:image' content='" . $green_image . "'/>\n";
		echo "<meta property='og:url' content='" . $host . $green_url . "'/>\n";
		$share_url = $host . $green_url;
	break;

	case $blue_url:
		echo "<meta property='og:title' content='Sharing the blue result page'/>\n";
		echo "<meta property='og:image' content='" . $blue_image . "'/>\n";
		echo "<meta property='og:url' content='" . $host . $blue_url . "'/>\n";
		$share_url = $host . $blue_url;
	break;

	default:
		echo "<meta property='og:title' content='Sharing the homepage'/>\n";
		echo "<meta property='og:image' content='" . $grey_image . "'/>\n";
		echo "<meta property='og:url' content='" . $host . $path . "'/>\n";
	break;
}

?>



<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, minimal-ui">
<meta charset="UTF-8">

<style type="text/css">

body {
	background-color: #000;
	color: #00bb00;
	font-family: monospace;
	margin: 20px;
	font-size: 14px;
}

a {
	color: inherit;
	line-height: 1.5;
}

ul {
	list-style-type: none;
	padding: 0;
}

h1 {
	font-size: 1em;
	text-transform: uppercase;
	font-weight: normal;
}

button {
	background-color: #005dbd;
	color: #ffffff;
	border: 0;
	padding: 8px 20px 8px 20px;
	border-radius: 5px;
	text-shadow: 1px 1px 1px black;
	outline: none;
	text-transform: uppercase;
}

</style>

<script type="text/javascript">

var isRed = "<?=$url ?>".indexOf('red') > -1;
var isGreen = "<?=$url ?>".indexOf('green') > -1;
var isBlue = "<?=$url ?>".indexOf('blue') > -1;

if(isRed || isGreen || isBlue) {
	location.href = '<?php echo $host . $path; ?>'
}


</script>

</head>
<body>

	<h1>Facebook share test</h1>

	<p>Home is the entry page to the application and the only page the user will actually see. The red, green and blue pages are custom share pages. If the user hits one of these pages, he gets redirected back to the home page. It done using location.href in JS to bypass the Facebook bot, that apparently can't understand that type of redirection. It can understand both server side redirects and meta refresh.</p>

	<p>The buttons bellow allow to share each page separately. Regardless which page is shared, when someone clicks on the link that was shared on their Facebook wall, he will be redirected back to the home page. Red, green and blue pages should never be accesible to the user, unless the user has turned off Javascript.</p>

	<em>Current result page: </em>

	<?php 

	switch($url) {
		case $red_url:
			echo "red";
		break;

		case $green_url:
			echo "green";
		break;

		case $blue_url:
			echo "blue";
		break;

		default:
			echo "none, this is the default page";
		break;
	}


	?>

	</em>

	<ul>
		<li><a href="index.php">home</a></li>
		<li><a href="result-red">red</a></li>
		<li><a href="result-blue">blue</a></li>
		<li><a href="result-green">green</a></li>
	</ul>

	<ul>
		<li>SERVER_NAME: <?=$host?></li>
	</ul>

	<p><button id="fb-m">Share main</button></p>
	<p><button id="fb-r">Share red</button></p>
	<p><button id="fb-g">Share green</button></p>
	<p><button id="fb-b">Share blue</button></p>

<script type="text/javascript">

document.querySelector('#fb-m').addEventListener('click', function(e) {
	var url = 'https://www.facebook.com/sharer/sharer.php?u=<? echo $host . $path; ?>';
	var target = '_blank';
	var opts = 'height=400,width=600';
	window.open(url, target, opts);
});

document.querySelector('#fb-r').addEventListener('click', function(e) {
	var url = 'https://www.facebook.com/sharer/sharer.php?u=<? echo $host . $red_url; ?>';
	var target = '_blank';
	var opts = 'height=400,width=600';
	window.open(url, target, opts);
});

document.querySelector('#fb-g').addEventListener('click', function(e) {
	var url = 'https://www.facebook.com/sharer/sharer.php?u=<? echo $host . $green_url; ?>';
	var target = '_blank';
	var opts = 'height=400,width=600';
	window.open(url, target, opts);
});

document.querySelector('#fb-b').addEventListener('click', function(e) {
	var url = 'https://www.facebook.com/sharer/sharer.php?u=<? echo $host . $blue_url; ?>';
	var target = '_blank';
	var opts = 'height=400,width=600';
	window.open(url, target, opts);
});

</script>

<script>
if(location.host.indexOf('localhost') > -1 || location.host.indexOf('192.168') > -1) {
	document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
}
</script>

</body>
</head>
