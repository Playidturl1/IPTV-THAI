function toSSL() {
var strLocation = location.href;

//must real www
if(strLocation.indexOf("localhost")=="-1") {
	if (location.protocol != 'https:')
		{
		 location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
		}
	}
}

function toNoneSSL() {
if (location.protocol == 'https:')
	{
	 location.href = 'http:' + window.location.href.substring(window.location.protocol.length);
	}
}