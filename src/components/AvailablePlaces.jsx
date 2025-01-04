import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../fetch.js";

export default function AvailablePlaces({ onSelectPlace }) {
	const [isLoading, setisLoading] = useState(false);
	const [availablePlaces, setavailablePlaces] = useState([]);
	const [error, seterror] = useState(false);

	useEffect(() => {
		async function fetchData() {
			try {
				setisLoading(true);
				const places = await fetchAvailablePlaces();

				navigator.geolocation.getCurrentPosition((position) => {
					const sortedPlaces = sortPlacesByDistance(
						places,
						position.coords.latitude,
						position.coords.longitude
					);
					setavailablePlaces(sortedPlaces);
					setisLoading(false);
				});
			} catch (error) {
				seterror({
					message: error.message || "Could not fetch data, please try again",
				});
				setisLoading(false);
			}
		}

		fetchData();
	}, []);

	if (error) {
		return <ErrorMessage title="⚠ An Error Occured!" message={error.message} />;
	}

	return (
		<Places
			title="Available Places"
			places={availablePlaces}
			isLoading={isLoading}
			loadingText={"Fetching data..."}
			fallbackText="No places available."
			onSelectPlace={onSelectPlace}
		/>
	);
}
