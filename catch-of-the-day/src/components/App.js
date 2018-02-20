import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base.js';

class App extends React.Component {

	constructor() {
		super();
		//bind addfish to the component itself 
		this.addFish = this.addFish.bind(this);
		this.updateFish = this.updateFish.bind(this);
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		this.removeFish = this.removeFish.bind(this);
		this.removeFromOrder = this.removeFromOrder.bind(this);
		//get Initialize State
		this.state = {
			fishes: {},
			order: {}
		};
	}

	componentWillMount() {

		//this runs right before the <app> is rendered
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`,
		{
			context: this,
			state: 'fishes'
		});

		//check if there is any order in localStorage
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
		if(localStorageRef) {
			//Update our app component;s orfer state
			this.setState({
				order: JSON.parse(localStorageRef)
			});
		}
	}

	componentWillUnmount(){
		base.removeBinding(this.ref);
	}

	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
	}

	addFish(fish) {
		//update our state
		const fishes = {...this.state.fishes};
		//add in our new fish
		const timestamp = Date.now(); 
		fishes[`fish-${timestamp}`] = fish; 
		//set State
		this.setState({fishes});

		//same as
		//this.setState({fishes : fishes});
	}

	updateFish(key,updatedFish) {
		const fishes = {...this.state.fishes};
		fishes[key] = updatedFish;
		this.setState({ fishes });
	}

	removeFish(key) {
		const fishes = {...this.state.fishes};
		fishes[key] = null;
		this.setState({fishes});
	}

	loadSamples() {
		this.setState({
			fishes: sampleFishes,
		});
	}

	addToOrder(key) {
		//update our state
		const order = {...this.state.order};
		//add in our new fish
		order[key] = order[key] + 1 || 1;
		//update our state
		this.setState({order});
	}

	removeFromOrder(key) {
		//update our state
		const order = {...this.state.order};
		//add in our new fish
		delete order[key];
		//update our state
		this.setState({order});
	}

	render() {
		return (
			<div className="catch-of-the-day">
			<div className="menu">
				<Header tagline="Freshh Seafood Market"/>
				<ul className="list-of-fishes">
					{ 
						Object.keys(this.state.fishes)
						.map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
					}
				</ul>
			</div>
			<Order 
			removeFromOrder={this.removeFromOrder}
			fishes={this.state.fishes} 
			order={this.state.order}
			params={this.props.params}
			/>
			<Inventory 
			storeId={this.props.params.storeId}
			removeFish={this.removeFish}
			fishes={this.state.fishes} 
			addFish={this.addFish} 
			loadSamples={this.loadSamples} 
			updateFish={this.updateFish} />
			</div>
		);
	}
}

App.propTypes = {
	params: React.PropTypes.object.isRequired
}


export default App;