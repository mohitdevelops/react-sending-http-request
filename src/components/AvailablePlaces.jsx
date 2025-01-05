import Places from "./Places.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../fetch.js";
import { useFetch } from "../hooks/useFetch.js";

async function getSortedPlaces() {
	const places = await fetchAvailablePlaces();
	return new Promise((resolve) => {
		navigator.geolocation.getCurrentPosition((position) => {
			const sortedPlaces = sortPlacesByDistance(
				places,
				position.coords.latitude,
				position.coords.longitude
			);
			resolve(sortedPlaces);
		});
	});
}

export default function AvailablePlaces({ onSelectPlace }) {
	const {
		fetchedPlaces: availablePlaces,
		isLoading,
		error,
	} = useFetch(getSortedPlaces, []);

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
