import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {
	// constructor() {
	// 	super(); 
	// 	this.goToStore = this.goToStore.bind(this);
	// }
	goToStore(event) {
		event.preventDefault();
		//Grab text from the box
		const storeId = this.storeInput.value;
		console.log(storeId);
		// go to from / to / store / :storeID
		this.context.router.transitionTo(`/store/${storeId}`);
	}

	// like function render() {}
	render() {
		//you can only return one parent element
		return(	
			<form className="store-selector" onSubmit={this.goToStore.bind(this)}>
			{/* Comment in jsx */}
			<h2>Please Enter A Store</h2>
			<input type="text" required placeholder="store Name" defaultValue={ getFunName() } ref={ (input)=> { this.storeInput = input }} />
			<button type="submit"> Visit Store </button>
			</form>
		);
	}
}

StorePicker.contextTypes = {
	router: React.PropTypes.object
}
export default StorePicker;