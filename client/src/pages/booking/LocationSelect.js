/*global google*/
/*global gtag*/
import React, { Component } from "react";
import { Button, Container, Grid, Box } from "@material-ui/core";
import LocationField from "../../components/LocationField";
import Map from "../../components/Map";
import { connect } from "react-redux";
import { locationSelected, setStep } from "../../redux/actions";

class LocationSelect extends Component {
	constructor(props) {
		super(props);

		this.state = {
			directions: null,
			mapOffset: 230,
			pickup: props.location ? props.location.pickup : null,
			destination: props.location ? props.location.destination : null,
			distance: props.location ? props.location.distance : 0,
		};

		this.locationPanel = React.createRef();

		props.setStep(2);
		if (props.location) {
			this.showDirection(props.location.pickup, props.location.destination);
		}
	}

	componentDidMount() {
		gtag("js", new Date());
		gtag("config", "UA-156726482-1");
		if (window.fbq != null) {
			window.fbq("track", "PageView");
		}

		if (this.locationPanel.current) {
			this.setState({
				mapOffset: this.locationPanel.current.offsetHeight + 142,
			});
		}
	}

	showDirection = (pickup, destination) => {
		if (pickup && destination) {
			// this.getDistance(pickup.coordinate, destination.coordinate);
			const directionsService = new google.maps.DirectionsService();
			directionsService.route(
				{
					origin: pickup.coordinate,
					destination: destination.coordinate,
					travelMode: google.maps.TravelMode.DRIVING,
				},
				(result, status) => {
					if (status === google.maps.DirectionsStatus.OK) {
						this.setState({
							directions: result,
						});
						let distance =
							result && result.routes && result.routes.length && result.routes[0].legs && result.routes[0].legs.length && result.routes[0].legs[0].distance
								? result.routes[0].legs[0].distance.value
								: 0;
						this.setState({ distance: distance });
					} else {
						console.error(`error fetching directions ${result}`);
					}
				}
			);
		}
	};

	getDistance = async (pickup, destination) => {
		// await fetch(
		// 	`https://maps.googleapis.com/maps/api/distancematrix/json?origins=
		// 	${pickup.lat},${pickup.lng}&destinations=${destination.lat},${destination.lng}&key=${process.env.REACT_APP_GOOGLE_KEY}`
		// ).then((res) => {
		// 	console.log(res);
		// });
		// const latLong1 = new google.maps.LatLng(pickup.lat, pickup.lng);
		// const latLong2 = new google.maps.LatLng(destination.lat, destination.lng);
		// const distance = google.maps.geometry.spherical.computeDistanceBetween(
		// 	latLong1,
		// 	latLong2
		// );
		// this.setState({
		// 	distance: distance
		// });
	};

	pickupSelected = (data) => {
		this.setState({
			pickup: data,
		});
		this.showDirection(data, this.state.destination);
	};

	destinationSelected = (data) => {
		this.setState({
			destination: data,
		});
		this.showDirection(this.state.pickup, data);
	};

	onClickContinue = () => {
		const { pickup, destination, distance } = this.state;

		if (!pickup || !destination) {
			alert("Select pickup and destination");
			return;
		}

		this.props.history.push("/book/vehicle");
		this.props.locationSelected({
			pickup: pickup,
			destination: destination,
			distance: distance,
		});
	};

	render() {
		const { location } = this.props;
		const { directions, pickup, destination, distance, mapOffset } = this.state;
		return (
			<div>
				<Container maxWidth="md" ref={this.locationPanel}>
					<Grid container justify="center" className="location-panel">
						<Grid item sm={5} xs={12} style={{ paddingRight: 20 }}>
							<LocationField direction={0} placeSelected={this.pickupSelected} address={location && location.pickup ? location.pickup.address : null} />
						</Grid>
						<Grid item sm={5} xs={12} style={{ paddingRight: 20 }}>
							<LocationField
								direction={1}
								placeSelected={this.destinationSelected}
								address={location && location.destination ? location.destination.address : null}
							/>
						</Grid>
						<Grid item sm={2} xs={12}>
							<Button
								fullWidth
								className="lug-btn"
								style={{
									marginTop: 8,
								}}
								onClick={this.onClickContinue}
							>
								Continue
							</Button>
						</Grid>
					</Grid>
				</Container>
				<Box mt={1} mb={2}>
					Distance : {Number.parseFloat(distance / 1000).toFixed(2)}km
				</Box>

				<Map
					pickup={pickup ? pickup.coordinate : null}
					destination={destination ? destination.coordinate : null}
					directions={directions}
					width="100%"
					height={`calc(100vh - ${mapOffset}px)`}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	location: state.selectedLocation,
});

const mapDispatchToProps = (dispatch) => ({
	locationSelected: (location) => dispatch(locationSelected(location)),
	setStep: (value) => dispatch(setStep(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LocationSelect);
