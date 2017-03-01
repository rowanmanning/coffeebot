
module.exports = throttle;

function throttle(ms = 30000) {
	let shouldBeThrottled = false;
	return (request, response, next) => {
		request.shouldBeThrottled = shouldBeThrottled;
		if (!shouldBeThrottled) {
			shouldBeThrottled = true;
			setTimeout(() => { shouldBeThrottled = false; }, ms);
		}
		next();
	};
}
