import React from 'react';
import { formatPrice } from '../helpers.js';
import CSSTransitionGroup from 'react-addons-css-transition-group';
class Order extends React.Component { 

	constructor() {
		super();
		this.renderOrder = this.renderOrder.bind(this);
	}

	renderOrder(key) {
		const fish = this.props.fishes[key];
		const count = this.props.order[key];
		const removeBtn = <button onClick={()=> this.props.removeFromOrder(key)} >Remove fish</button>

		if(!fish || fish.status ==='unavailable'){
			return <li key={key} > Sorry, {fish ? fish.name: 'Fish'} is no longer available! {removeBtn}</li>
		}

		return (
			<li key={key}>
				<span>
				<CSSTransitionGroup
				component="span"
				className="count"
				transitionName="count"
				transitionEnterTimeout={250} 
				transitionLeaveTimeout={250}
				>
				<span key={count}>{count}</span>
				</CSSTransitionGroup>
				lbs {fish.name} {removeBtn}</span>
				<span className="price"> {formatPrice( count * fish.price)}</span>
				
			</li>
		)
	}

	render() {
		const orderIds = Object.keys(this.props.order);
		//adding up a bunch of things
		const total = orderIds.reduce((prevTotal, key) => {
			const fish = this.props.fishes[key];
			const count = this.props.order[key];
			const isAvailable = fish && fish.status === 'available';
			if(isAvailable) {
				return prevTotal + (count * fish.price || 0)
			}
			return prevTotal;
		}, 0); // the comma 0 is the start value 

		return (
			<div className="order-wrap">
				<h2>Your Order</h2>

				<CSSTransitionGroup
				className="order"
				component="ul"
				transitionName="order" 
				transitionEnterTimeout={500} 
				transitionLeaveTimeout={500}
				>
					{orderIds.map(this.renderOrder)}

					<li className="total">
					<strong> Total: </strong>
					{formatPrice(total)}
					</li>
				</CSSTransitionGroup>
			</div>
		)
	}
}

Order.propTypes = {
	order: React.PropTypes.object,
	fishes: React.PropTypes.object,
	removeFromOrder: React.PropTypes.func,
}

export default Order;