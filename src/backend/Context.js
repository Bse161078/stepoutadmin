import React, { Component } from "react";
const { Provider, Consumer } = React.createContext();

// Note: You could also use hooks to provide state and convert this into a functional component.
class RootContext extends Component {
	state = {
		userTab: "3",
		eventTab: "1",
	};

	handleSetUserTab = (tab) => {
		this.setState({ userTab: tab });
	};
	handleSetEventTab = (tab) => {
		console.log("Context Event Tab:", tab);
		this.setState({ eventTab: tab });
	};
	render() {
		return (
			<Provider
				value={{
					eventTab: this.state.eventTab,
					userTab: this.state.userTab,
					handleSetEventTab: this.handleSetEventTab,
					handleSetUserTab: this.handleSetUserTab,
				}}
			>
				{this.props.children}
			</Provider>
		);
	}
}

export { RootContext, Consumer as RootConsumer };
