import _ from 'lodash';
import React from 'react';
import { lucidClassNames } from '../../util/style-helpers';
import { createClass, filterTypes } from '../../util/component-types';
import DragCaptureZone from '../DragCaptureZone/DragCaptureZone';

const cx = lucidClassNames.bind('&-SplitHorizontal');

const {
	any,
	bool,
	func,
	node,
	number,
	object,
	string,
	oneOf,
} = React.PropTypes;

/**
 * {"categories": ["helpers"]}
 *
 * `SplitHorizontal` renders a vertical split.
 */
const SplitHorizontal = createClass({
	displayName: 'SplitHorizontal',

	propTypes: {
		/**
		 * Appended to the component-specific class names set on the root
		 * element. Value is run through the `classnames` library.
		 */
		className: any,
		/**
		 * any valid React children
		 */
		children: node,
	},

	render() {
		const {
			children,
			className,
			...passThroughs
		} = this.props;

		return (
			<div {...passThroughs} className={cx('&', className)}>
				{children}
			</div>
		);
	}
});

export default SplitHorizontal;
