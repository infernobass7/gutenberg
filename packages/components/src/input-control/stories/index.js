/**
 * External dependencies
 */
import { boolean, select, text } from '@storybook/addon-knobs';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import InputControl from '../';

export default {
	title: 'Components/InputControl',
	component: InputControl,
};

function Example() {
	const [ value, setValue ] = useState( '' );

	const props = {
		disabled: boolean( 'disabled', false ),
		hideLabelFromVision: boolean( 'hideLabelFromVision', false ),
		isFloatingLabel: boolean( 'isFloatingLabel', false ),
		isPressEnterToChange: boolean( 'isPressEnterToChange', false ),
		label: text( 'label', 'Value' ),
		placeholder: text( 'placeholder', 'Placeholder' ),
		size: select(
			'size',
			{
				default: 'default',
				small: 'small',
			},
			'default'
		),
		suffix: text( 'suffix', '' ),
		prefix: text( 'prefix', '' ),
	};

	const suffixMarkup = props.suffix ? <div>{ props.suffix }</div> : null;
	const prefixMarkup = props.prefix ? <div>{ props.prefix }</div> : null;

	return (
		<InputControl
			{ ...props }
			onChange={ ( v ) => setValue( v ) }
			prefix={ prefixMarkup }
			suffix={ suffixMarkup }
			value={ value }
		/>
	);
}

export const _default = () => {
	return <Example />;
};
