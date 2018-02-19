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
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		//get Initialize State
		this.state = {
			fishes: {},
			order: {}
		};
	}

	componentWillMount() {
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`,
		{
			context: this,
			state: 'fishes'
		});
	}

	componentWillUnmount(){
		base.removeBinding(this.ref);
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
			<Order fishes={this.state.fishes} order={this.state.order}
			/>
			<Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
			</div>
		);
	}
}

export default App;