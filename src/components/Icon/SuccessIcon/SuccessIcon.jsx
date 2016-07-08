import _ from 'lodash';
import React from 'react';
import CheckIcon from '../CheckIcon/CheckIcon';
import { lucidClassNames } from '../../../util/style-helpers';
import { createClass, omitProps } from '../../../util/component-types';

const cx = lucidClassNames.bind('&-SuccessIcon');

/**
 *
 * {"categories": ["visual design", "icons"], "extend": "CheckIcon", "madeFrom": ["CheckIcon"]}
 *
 * A success icon.
 */
const SuccessIcon = createClass({
	displayName: 'SuccessIcon',
	propTypes: {
		...CheckIcon.propTypes,
	},

	render() {
		const {
			className,
			...passThroughs,
		} = this.props;

		return (
			<CheckIcon
				{...omitProps(passThroughs, SuccessIcon)}
				{..._.pick(passThroughs, _.keys(CheckIcon.propTypes))}
				className={cx('&', className)}
				isBadge
			/>
		);
	},
});

export default SuccessIcon;
