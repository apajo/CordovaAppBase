/*
 * Enables/disables mobile specific functionality
 */
Core.extend("mode", function (Core) {
	var mode = 0;

	var MODE = {
		app : 0,
		browser : 1
	};

	return {
		isApp : function () {
			return mode === MODE.app
		},

		setMode : function (m) {
			mode = m;
		}
	}
});