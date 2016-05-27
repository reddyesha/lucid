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
	oneOfType,
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
		/**
		 * isExpanded
		 */
		isExpanded: bool,
	},

	components: {
		LeftPane: createClass({
			displayName: 'SplitVertical.LeftPane',
			propTypes: {
				/**
				 * any valid React children
				 */
				children: node,
				/**
				 * width
				 */
				width: oneOfType([number, string]),
				/**
				 * isPrimary
				 */
				isPrimary: bool,
			},
			getDefaultProps(){
				return {
					isPrimary: false,
				};
			},
		}),

		RightPane: createClass({
			displayName: 'SplitVertical.RightPane',
			propTypes: {
				/**
				 * any valid React children
				 */
				children: node,
				/**
				 * width
				 */
				width: oneOfType([number, string]),
				/**
				 * isPrimary
				 */
				isPrimary: bool,
			},
			getDefaultProps(){
				return {
					isPrimary: false,
				};
			},
		}),
		Divider: createClass(),
	},

	getDefaultProps() {
		return {
			isExpanded: true,
		};
	},

	handleDragStart() {
		this.panes = this.getPanes();
		const { secondaryRef, primaryRef } = this.panes;
		this.secondaryStartRect = secondaryRef.getBoundingClientRect();
		this.refs.inner.style.transition = 'all 0s';
		secondaryRef.style.transition = 'all 0s';
		primaryRef.style.transition = 'all 0s';
	},

	handleDrag({ dX }) {
		const {
			isExpanded,
		} = this.props;

		const {
			secondaryRef,
			secondary,
			right,
			primaryRef,
		} = this.panes;

		if (isExpanded) {
			secondaryRef.style.flexBasis = `${this.secondaryStartRect.width + dX * (secondary === right ? -1 : 1)}px`;
		} else {
			const overlapWidth = (secondary === right ? this.secondaryStartRect.width + dX: this.secondaryStartRect.width - dX);
			if (overlapWidth > 0) {
				if (secondary === right) {
					this.refs.inner.style.transform = `translateX(${overlapWidth}px)`;
					primaryRef.style.marginLeft = `${-1 * (overlapWidth)}px`;
				} else {
					this.refs.inner.style.transform = `translateX(${-1 * (overlapWidth)}px)`;
					primaryRef.style.marginRight = `${-1 * (overlapWidth)}px`;
				}
			} else {
				this.refs.inner.style.transform = 'translateX(0)';
				if (secondary === right) {
					primaryRef.style.marginLeft = '0';
				} else{
					primaryRef.style.marginRight = '0';
				}
				secondaryRef.style.flexBasis = `${dX * (secondary === right ? -1 : 1)}px`;
			}
		}
	},

	handleDragEnd({ dX }) {
		const {
			isExpanded,
		} = this.props;

		const {
			secondaryRef,
			secondary,
			right,
			primaryRef,
		} = this.panes;

		if (isExpanded) {
			secondaryRef.style.flexBasis = `${this.secondaryStartRect.width + dX * (secondary === right ? -1 : 1)}px`;
		} else {
			const overlapWidth = (secondary === right ? this.secondaryStartRect.width + dX: this.secondaryStartRect.width - dX);
			if (overlapWidth > 0) {
				if (secondary === right) {
					this.refs.inner.style.transform = `translateX(${overlapWidth}px)`;
					primaryRef.style.marginLeft = `${-1 * (overlapWidth)}px`;
				} else {
					this.refs.inner.style.transform = `translateX(${-1 * (overlapWidth)}px)`;
					primaryRef.style.marginRight = `${-1 * (overlapWidth)}px`;
				}
			} else {
				this.refs.inner.style.transform = 'translateX(0)';
				if (secondary === right) {
					primaryRef.style.marginLeft = '0';
				} else{
					primaryRef.style.marginRight = '0';
				}
				secondaryRef.style.flexBasis = `${dX * (secondary === right ? -1 : 1)}px`;
			}
		}
		this.refs.inner.style.transition = '';
		secondaryRef.style.transition = '';
		primaryRef.style.transition = '';
	},
	
	getPanes() {
		const { children } = this.props;
		const {
			leftPane: leftPaneRef,
			rightPane: rightPaneRef,
		} = this.refs;

		const leftPaneElement = _.first(filterTypes(children, SplitVertical.LeftPane));
		const rightPaneElement = _.first(filterTypes(children, SplitVertical.RightPane));
		let primaryElement, primaryRef;
		let secondaryElement, secondaryRef;

		if (leftPaneElement.props.isPrimary && !rightPaneElement.props.isPrimary) {
			primaryElement = leftPaneElement;
			primaryRef = leftPaneRef;
			secondaryElement = rightPaneElement;
			secondaryRef = rightPaneRef;
		} else {
			primaryElement = rightPaneElement;
			primaryRef = rightPaneRef;
			secondaryElement = leftPaneElement;
			secondaryRef = leftPaneRef;
		}

		return {
			left: leftPaneElement.props,
			right: rightPaneElement.props,
			primary: primaryElement.props,
			primaryRef,
			secondary: secondaryElement.props,
			secondaryRef,
		};
	},

	componentWillReceiveProps(nextProps) {
		const {
			primaryRef,
			secondaryRef,
			secondary,
			right,
		} = this.getPanes();

		if (this.props.isExpanded && !nextProps.isExpanded) { // collapse secondary
			const secondaryRect = secondaryRef.getBoundingClientRect();
			if (secondary === right) {
				this.refs.inner.style.transform = `translateX(${secondaryRect.width}px)`;
				primaryRef.style.marginLeft = `${-secondaryRect.width}px`;
			} else{
				this.refs.inner.style.transform = `translateX(-${secondaryRect.width}px)`;
				primaryRef.style.marginRight = `${-secondaryRect.width}px`;
			}
		} else if (!this.props.isExpanded && nextProps.isExpanded) { // expand secondary
			this.refs.inner.style.transform = 'translateX(0)';
			if (secondary === right) {
				primaryRef.style.marginLeft = '0';
			} else{
				primaryRef.style.marginRight = '0';
			}
		}
	},

	render() {
		const {
			children,
			className,
			isExpanded,
			...passThroughs
		} = this.props;

		const {
			left: leftPaneProps,
			right: rightPaneProps,
			secondary,
		} = this.getPanes();

		const dividerProps = _.get(_.first(filterTypes(children, SplitVertical.Divider)), 'props', {});

		return (
			<div {...passThroughs} className={cx('&', {
				'&-is-expanded': isExpanded,
			}, className)}>
				<div {...passThroughs} className={cx('&-inner')} ref='inner'>
					<div
						{..._.omit(leftPaneProps, 'width')}
						className={cx('&-LeftPane', {
							'&-is-secondary': leftPaneProps === secondary,
						}, leftPaneProps.className)}
						style={_.assign({}, {
							flexBasis: _.isNil(leftPaneProps.width) ? (leftPaneProps === secondary ? '49.825%' : null) : leftPaneProps.width
						}, leftPaneProps.style)}
						ref='leftPane'
					/>
					<DragCaptureZone
						{...dividerProps}
						className={cx('&-Divider', dividerProps.className)}
						onDragStart={this.handleDragStart}
						onDrag={this.handleDrag}
						onDragEnd={this.handleDragEnd}
					>{dividerProps.children || ' '}</DragCaptureZone>
					<div
						{..._.omit(rightPaneProps, 'width')}
						className={cx('&-RightPane', {
							'&-is-secondary': rightPaneProps === secondary,
						}, rightPaneProps.className)}
						style={_.assign({}, {
							flexBasis: _.isNil(rightPaneProps.width) ? (rightPaneProps === secondary ? '49.825%' : null) : rightPaneProps.width
						}, rightPaneProps.style)}
						ref='rightPane'
					/>
				</div>
			</div>
		);
	}
});

export default SplitVertical;
