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
		Split: createClass(),
	},

	getDefaultProps() {
		return {
			isExpanded: true,
		};
	},

	handleDragStart() {
		const { width: panel0Width } = this.refs.panel0.getBoundingClientRect();
		const { width: panel1Width } = this.refs.panel1.getBoundingClientRect();
		this.panel0StartWidth = panel0Width;
		this.panel1StartWidth = panel1Width;
	},

	handleDrag({dX, dY}) {
		this.refs.panel0.style.width =  this.panel0StartWidth + dX + 'px';
		this.refs.panel1.style.width =  this.panel1StartWidth - dX + 'px';
	},

	handleDragEnd({dX, dY}) {
		this.refs.panel0.style.width =  this.panel0StartWidth + dX + 'px';
		this.refs.panel1.style.width =  this.panel1StartWidth - dX + 'px';
		this.panel0StartWidth = null;
		this.panel1StartWidth = null;
	},

	componentWillReceiveProps(nextProps) {
		const { children } = this.props;

		if (this.props.isExpanded && !nextProps.isExpanded) {
			// get target and other panel
			const [panel0, panel1] = filterTypes(children, SplitVertical.Panel);
			const targetPanelIndex = panel1.props.isTarget ? 1 : 0;
			let targetPanelRef;
			let otherPanelRef;
			if (targetPanelIndex === 0) {
				targetPanelRef = this.refs.panel0;
				otherPanelRef = this.refs.panel1;
			} else {
				targetPanelRef = this.refs.panel1;
				otherPanelRef = this.refs.panel0;
			}

			const { width: targetPanelWidth } = targetPanelRef.getBoundingClientRect();
			const { width: otherPanelWidth } = otherPanelRef.getBoundingClientRect();
			this.lastWidths = {
				targetPanelWidth,
				otherPanelWidth,
			};

			targetPanelRef.style.width = '0';
			otherPanelRef.style.width = otherPanelWidth + targetPanelWidth + 'px';
		} else if (!this.props.isExpanded && nextProps.isExpanded) {
			// get target and other panel
			const [panel0, panel1] = filterTypes(children, SplitVertical.Panel);
			const targetPanelIndex = panel1.props.isTarget ? 1 : 0;
			let targetPanelRef;
			let otherPanelRef;
			if (targetPanelIndex === 0) {
				targetPanelRef = this.refs.panel0;
				otherPanelRef = this.refs.panel1;
			} else {
				targetPanelRef = this.refs.panel1;
				otherPanelRef = this.refs.panel0;
			}

			const lastWidth = this.lastWidths || {
				targetPanelWidth: 200,
				otherPanelWidth: 600,
			};

			targetPanelRef.style.width = lastWidth.targetPanelWidth + 'px';
			//otherPanelRef.style.width = lastWidth.otherPanelWidth + 'px';
			otherPanelRef.style.width	= '';
		}
	},
	render() {
		const {
			children,
			className,
			isExpanded,
			...passThroughs
		} = this.props;

		const [panel0, panel1] = filterTypes(children, SplitVertical.Panel);
		const split = _.first(filterTypes(children, SplitVertical.Split)) || (<SplitVertical.Split>&nbsp;</SplitVertical.Split>);

		return (
			<div {...passThroughs} className={cx('&', {
				'&-is-expanded': isExpanded,
			}, className)}>
				<div
					{...panel0.props}
					className={cx('&-Panel', {
						'&-Panel-has-set-width': panel0.props.hasSetWidth,
						'&-Panel-is-target': panel0.props.isTarget,
					}, panel0.props.className)}
					ref='panel0'
				/>
				<DragCaptureZone
					{...split.props}
					className={cx('&-Split', split.props.className)}
					onDragStart={this.handleDragStart}
					onDrag={this.handleDrag}
					onDragEnd={this.handleDragEnd}
				>{split.props.children}</DragCaptureZone>
				<div
					{...panel1.props}
					className={cx('&-Panel', {
						'&-Panel-has-set-width': panel1.props.hasSetWidth,
						'&-Panel-is-target': panel1.props.isTarget,
					}, panel1.props.className)}
					ref='panel1'
				/>
			</div>
		);
	}
});

export default SplitVertical;
