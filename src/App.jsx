import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { fetchUserPlaces, updatesPlaces } from "./fetch.js";
import ErrorMessage from "./components/ErrorMessage.jsx";

function App() {
	const selectedPlace = useRef();
	const [userPlaces, setUserPlaces] = useState([]);
	const [isLoading, setisLoading] = useState(false);
	const [error, seterror] = useState(false);
	const [errorUpdatesPlaces, seterrorUpdatesPlaces] = useState(false);
	const [modalIsOpen, setModalIsOpen] = useState(false);

	function handleStartRemovePlace(place) {
		setModalIsOpen(true);
		selectedPlace.current = place;
	}

	function handleStopRemovePlace() {
		setModalIsOpen(false);
	}

	useEffect(() => {
		async function fetchPlaces() {
			setisLoading(true);
			try {
				const places = await fetchUserPlaces();
				setUserPlaces(places);
			} catch (error) {
				seterror({
					message: error.message || "Failed to fetch places.",
				});
			}
			setisLoading(false);
		}

		fetchPlaces();
    
	}, []);

	async function handleSelectPlace(selectedPlace) {
		setUserPlaces((prevPickedPlaces) => {
			if (!prevPickedPlaces) {
				prevPickedPlaces = [];
			}
			if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
				return prevPickedPlaces;
			}
			return [selectedPlace, ...prevPickedPlaces];
		});

		//Update user
		try {
			await updatesPlaces([selectedPlace, ...userPlaces]);
		} catch (err) {
			setUserPlaces(userPlaces);
			seterrorUpdatesPlaces({
				message: err.message || "Failed to fetch updates place 😢",
			});
		}
	}

	const handleRemovePlace = useCallback(
		async function handleRemovePlace() {
			setUserPlaces((prevPickedPlaces) =>
				prevPickedPlaces.filter(
					(place) => place.id !== selectedPlace.current.id
				)
			);

			try {
				await updatesPlaces(
					userPlaces.filter((place) => place.id !== selectedPlace.current.id)
				);
			} catch (error) {
				setUserPlaces(userPlaces);
				seterrorUpdatesPlaces({
					message: error.message || "Failed to delete 👎",
				});
			}

			setModalIsOpen(false);
		},
		[userPlaces]
	);

	function handleErrorModal() {
		seterrorUpdatesPlaces(null);
	}

	return (
		<>
			<Modal open={errorUpdatesPlaces} onClose={handleErrorModal}>
				{errorUpdatesPlaces && (
					<ErrorMessage
						title="An Error Occured ⚠"
						message={errorUpdatesPlaces.message}
						onConfirm={handleErrorModal}
					/>
				)}
			</Modal>
			<Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
				<DeleteConfirmation
					onCancel={handleStopRemovePlace}
					onConfirm={handleRemovePlace}
				/>
			</Modal>

			<header>
				<img src={logoImg} alt="Stylized globe" />
				<h1>PlacePicker</h1>
				<p>
					Create your personal collection of places you would like to visit or
					you have visited.
				</p>
			</header>
			<main>
				{error && (
					<ErrorMessage title="An error occured" message={error.message} />
				)}
				<Places
					title="I'd like to visit ..."
					fallbackText="Select the places you would like to visit below."
					places={userPlaces}
					onSelectPlace={handleStartRemovePlace}
					isLoading={isLoading}
					loadingText="Fetching your places..."
				/>

				<AvailablePlaces onSelectPlace={handleSelectPlace} />
			</main>
		</>
	);
}

export default App;
