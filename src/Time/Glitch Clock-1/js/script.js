$(document).ready(function() {
	function second_passed() {
		$('.clock').removeClass('is-off');
	}

	setTimeout(second_passed, 2000)

	$('.switcher').on('click', function(e) {
		e.preventDefault();
		$('.screen').toggleClass('glitch');
	});
});

function SucroseSystemDate(Date) {
	if (Date.State) {
		var hours = Date.Hour;
		var seconds = Date.Second;
		var minutes = Date.Minute;

		var realTime = (hours < 10 ? '0' : '') + hours + ' : ' + (minutes < 10 ? '0' : '') + minutes + ' : ' + (seconds < 10 ? '0' : '') + seconds

		$('.time').html(realTime);
		$('.time').attr('data-time', realTime);
	}
}