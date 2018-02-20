import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base.js';

class Inventory extends React.Component { 

	constructor() {
		super();
		this.renderInventory = this.renderInventory.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.renderLogIn = this.renderLogIn.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.logout = this.logout.bind(this);
		this.state = {
			uid: null,
			owner: null
		}

	}

	componentDidMount() {
		base.onAuth((user) => {
			console.log(user);
			if( user) {
				const storeRef = base.database().ref(this.props.storeId)
				storeRef.once('value', (snapshot)  => {
					const data = snapshot.val() || {};
					this.setState({
						uid:  user.uid
					});
				});
			}
		}) ;
	}

	handleChange(e,key) {
		const fish = this.props.fishes[key];
		const updatedFish = {...fish,
		 [e.target.name] : e.target.value
		}
		this.props.updateFish(key,updatedFish);
	}

	renderLogIn() {
		return (
			<nav className="login">
			<h2>Inventory</h2>
			<p> Sign in to manage your store's inventory</p>
			<button className="github" onClick={() => this.authenticate('github')}> Log In with Github </button>
			<button className="facebook" onClick={() => this.authenticate('facebook')}> Log In with Facebook </button>
			<button className="twitter" onClick={() => this.authenticate('twitter')}> Log In with Twitter </button>
			</nav>
		);
	}

	authenticate(provider) {
		var provider
		var storeID =this.props.storeId;

		if ( provider === 'github'){
			provider = new base.auth.GithubAuthProvider();
			provider.addScope('repo');
		}
		if ( provider === 'facebook') provider = new base.auth.FacebookAuthProvider();
		if ( provider === 'twitter') provider = new base.auth.TwitterAuthProvider();

		 base.auth()
		 .signInWithPopup(provider)
		 .then( authData => {
		 //grab the sotre info
			const storeRef = base.database().ref(storeID)
		// 	//query the firebase once for the store data
			storeRef.once('value', (snapshot)  => {
				const data = snapshot.val() || {};
				// if not owner, set current user
				if(!data.owner) {
					console.log("no owner");
					storeRef.set({
						owner: authData.user.uid,
					})
				}
				this.setState({
					uid:  authData.user.uid,
					owner: data.owner || authData.user.uid
				});
			});

		 } )
		 .catch(function(error) {
			console.log(error);
		});

	}
	logout() {
		base.unauth();
		this.setState(
		{
			uid: null
		}
		);
	}

	renderInventory(key) {
			const fish = this.props.fishes[key];
		return(
			<div className="fish-edit" key={key}>
			<input name="name" type="text" value={fish.name} placeholder="Fish name" onChange={(e) => this.handleChange(e,key) } />
			<input name="price" type="text" value={fish.price} placeholder="Fish price" onChange={(e) => this.handleChange(e,key) } />
			<select name="status" value={fish.status} onChange={(e) => this.handleChange(e,key) } >
				<option value="available"> Fresh! </option>
				<option value="unavailable"> Sold Out! </option>
			</select>
			<textarea name="desc" value={fish.desc} placeholder="Fish desc" onChange={(e) => this.handleChange(e,key) } />
			<input name="image"  type="text" value={fish.image} placeholder="Fish image" onChange={(e) => this.handleChange(e,key) } />
			<button onClick={()=> this.props.removeFish(key)} >Remove fish</button>
			</div>
		)
	}

	render() {
		const logout = <button onClick={this.logout}>Log Out!</button>
		//check if they are not logged in
		if(!this.state.uid) {
			return <div>{this.renderLogIn()} </div>
		}
		//check if they are the owner of the store
		if(this.state.uid !== this.state.owner){
			return (
				<div>
				<p> sorry , you are not the owner of this store </p>
				{logout}
				</div>
			)
		}
		console.log("they are the same");
		return (
			<div>
			<h2>Inventory</h2>
			{logout}
			{Object.keys(this.props.fishes).map(this.renderInventory)}
			<AddFishForm addFish={this.props.addFish}/>
			<button onClick={this.props.loadSamples}>Load Sample Fishes </button>
			</div>
		);
	}
}

Inventory.propTypes = {
	loadSamples: React.PropTypes.func,
	fishes: React.PropTypes.object,
	updateFish: React.PropTypes.func,
	removeFish: React.PropTypes.func,
    addFish: React.PropTypes.func,
    storeId: React.PropTypes.string
}

export default Inventory;