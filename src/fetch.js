export async function fetchAvailablePlaces() {
	const response = await fetch("http://localhost:3000/places");
	const responseData = await response.json();
	if (!response.ok) {
		throw new Error("Failed to fetch data ⚠!");
	}

	return responseData.places;
}

export async function updatesPlaces(places) {
	const response = await fetch("http://localhost:3000/user-places", {
		method: "PUT",
		body: JSON.stringify({ places: places }),
		headers: {
			"Content-type": "application/json",
		},
	});

	const responseData = await response.json();

	if (!response.ok) {
		throw new Error("Failed to update data...!!");
	}

	return responseData.message;
}

export async function fetchUserPlaces() {
	const response = await fetch("http://localhost:3000/user-places");
	const responseData = await response.json();
	if (!response.ok) {
		throw new Error("Failed to fetch user places ⚠!");
	} 
	
	return responseData.places;
}
