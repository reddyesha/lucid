export default {
	onExpand(state) {
		return {
			...state,
			isExpanded: true,
		};
	},

	onCollapse(state) {
		return {
			...state,
			isExpanded: false,
		};
	},

	onResize(state, width) {
		return {
			...state,
			width,
			isExpanded: true,
		};
	},
};
