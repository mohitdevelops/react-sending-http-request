import { useEffect, useState } from "react";

export function useFetch(fetchFunc, initialPlaces) {
	const [fetchedPlaces, setFetchedPlaces] = useState(initialPlaces);
	const [isLoading, setisLoading] = useState();
	const [error, seterror] = useState();
	useEffect(() => {
		async function fetchPlaces() {
			setisLoading(true);
			try {
				const places = await fetchFunc();
				setFetchedPlaces(places);
			} catch (error) {
				seterror({
					message: error.message || "Failed to fetch places.",
				});
			}
			setisLoading(false);
		}

		fetchPlaces();
	}, []);
	return { fetchedPlaces, isLoading, error, setFetchedPlaces };
}
