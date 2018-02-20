import React from 'react';
import { formatPrice } from '../helpers.js';

class Fish extends React.Component { 

	render() {
		const {details} = this.props;
		const isAvailable = details.status === 'available';
		const buttonText = isAvailable ? 'Add To Order' : 'Sold Out!';
		return (
			<li className="menu-fish">
			<img src={details.image} alt={details.name} />
				<h3>	
				{details.name} 
				<span className="price">{formatPrice(details.price)} </span>
				</h3>
			<p> {details.desc}</p>
			<button onClick={() => this.props.addToOrder(this.props.index)} disabled={!isAvailable} >{buttonText} </button>
			</li>
		);
	}
}
Fish.propTypes = {
	index: React.PropTypes.string,
	details: React.PropTypes.object,
	addToOrder: React.PropTypes.func
}


export default Fish;