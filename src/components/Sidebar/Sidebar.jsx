import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { lucidClassNames } from '../../util/style-helpers';
import { createClass, filterTypes } from '../../util/component-types';
import reducers from './Sidebar.reducers';
import SplitVertical from '../SplitVertical/SplitVertical';
import ChevronIcon  from '../Icon/ChevronIcon/ChevronIcon';
import Icon  from '../Icon/Icon';

const cx = lucidClassNames.bind('&-Sidebar');

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
 * `Sidebar` renders a side bar panel next to primary content.
 */
const Sidebar = createClass({
	displayName: 'Sidebar',

	reducers,

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
		/**
		 * isAnimated
		 */
		isAnimated: bool,
		/**
		 * onResize
		 */
		onResize: func,
		/**
		 * onExpand
		 */
		onExpand: func,
		/**
		 * onCollapse
		 */
		onCollapse: func,
	},

	components: {
		Bar: createClass({
			displayName: 'Sidebar.Bar',
			propTypes: {
				/**
				 * any valid React children
				 */
				children: node,
			},
		}),

		Primary: createClass({
			displayName: 'SplitVertical.Primary',
			propTypes: {
				/**
				 * any valid React children
				 */
				children: node,
			}
		}),
	},

	getDefaultProps() {
		return {
			isExpanded: true,
			isAnimated: true,
			width: 250,
			onResize: _.noop,
			onExpand: _.noop,
			onCollapse: _.noop,
		};
	},

	handleResize(width) {
		const {
			onResize,
		} = this.props;

		onResize(width);
	},

	handleExpanderClick(event) {
		const {
			isExpanded,
			onExpand,
			onCollapse,
		} = this.props;

		event.stopPropagation();
		return isExpanded ? onCollapse() : onExpand();
	},
	
	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
	},

	render() {
		const {
			children,
			className,
			isExpanded,
			isAnimated,
			width,
			...passThroughs
		} = this.props;

		const primaryProps = _.get(_.first(filterTypes(children, Sidebar.Primary)), 'props', {});
		const barProps = _.get(_.first(filterTypes(children, Sidebar.Bar)), 'props', {});

		return (
			<SplitVertical
				className={cx('&', className, {
					'&-is-animated': isAnimated,
					'&-is-expanded': isExpanded,
				})}
				isAnimated={isAnimated}
				isExpanded={isExpanded}
				onResize={this.handleResize}
				{...passThroughs}
			>
				<SplitVertical.LeftPane width={width} {...barProps}>
					<div className={cx('&-Bar-title')}>
						Title
					</div>
					<div className={cx('&-Bar-content')}>
						{barProps.children}
					</div>
				</SplitVertical.LeftPane>
				<SplitVertical.Divider className={cx('&-Divider')}>
					<div
						className={cx('&-expander')}
						onMouseDown={this.handleExpanderClick}
					>
						<ChevronIcon
							direction={isExpanded ? 'left' : 'right'}
						/>
					</div>
					<Icon
						className={cx('&-gripper')}
						width={2}
						height={16}
						viewBox='0 0 2 16'
					>
						<path d='M0,0.5h16v1H0V0.5z' />
						<path d='M0,2.5h16v1H0V2.5z' />
						<path d='M0,4.5h16v1H0V4.5z' />
						<path d='M0,6.5h16v1H0V6.5z' />
						<path d='M0,8.5h16v1H0V8.5z' />
						<path d='M0,10.5h16v1H0V10.5z' />
						<path d='M0,12.5h16v1H0V12.5z' />
						<path d='M0,14.5h16v1H0V14.5z' />
					</Icon>
				</SplitVertical.Divider>
				<SplitVertical.RightPane className={cx('&-Primary')} isPrimary {...primaryProps} />
			</SplitVertical>
		);
	}
});

export default Sidebar;
