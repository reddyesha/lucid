import React from 'react';
import { SplitVertical } from '../../../index';

export default React.createClass({
	render() {
		return(
			<SplitVertical>
				<SplitVertical.Panel style={{width: 200}}>
					FOOOOBARRR!!
				</SplitVertical.Panel>
				<SplitVertical.Panel>
					FOOOOBARRR!!
				</SplitVertical.Panel>
			</SplitVertical>
		);
	}
});
