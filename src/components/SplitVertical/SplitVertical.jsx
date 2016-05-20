import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { lucidClassNames } from '../../util/style-helpers';
import { createClass, filterTypes } from '../../util/component-types';
import DragCaptureZone from '../DragCaptureZone/DragCaptureZone';

const cx = lucidClassNames.bind('&-SplitVertical');

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
 * `ResizableBox` renders a vertical split.
 */
const ResizableBox = createClass({
	displayName: 'ResizableBox',

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

	handleDragStart() {
		const { width } = this.domNode.getBoundingClientRect();
		this.startWidth = width;
	},

	handleDrag({dX, dY}) {
		this.domNode.style.width =  this.startWidth + dX + 'px';
	},

	handleDragEnd({dX, dY}) {
		this.domNode.style.width =  this.startWidth + dX + 'px';
		this.startWidth = null;
	},

	componentDidMount() {
		const domNode = ReactDOM.findDOMNode(this);
		this.domNode = domNode;
	},

	render() {
		const {
			children,
			className,
			...passThroughs
		} = this.props;

		return (
			<div {...passThroughs} className={cx('&-ResizableBox', className)}>
				{children}
				<DragCaptureZone
					className={cx('&-ResizableBox-right')}
					onDragStart={this.handleDragStart}
					onDrag={this.handleDrag}
					onDragEnd={this.handleDragEnd}
				/>
			</div>
		);
	}
});

/**
 * {"categories": ["helpers"]}
 *
 * `SplitVertical` renders a vertical split.
 */
const SplitVertical = createClass({
	displayName: 'SplitVertical',

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

	components: {
		Panel: createClass(),
	},

	render() {
		const {
			children,
			className,
			...passThroughs
		} = this.props;

		const panels = filterTypes(children, SplitVertical.Panel);

		return (
			<div {...passThroughs} className={cx('&', className)}>
				{_.map(panels, (panelElement, index) => (
					<ResizableBox {...panelElement.props} className={cx('&-Panel', panelElement.props.className)} key={index} />
				))}
			</div>
		);
	}
});

export default SplitVertical;
