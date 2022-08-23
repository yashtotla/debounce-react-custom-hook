import { useState, useEffect } from "react";
import useDebounce from "./useDebounce";

const App = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [results, setResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	
	useEffect(
		() => {
			if (debouncedSearchTerm) {
				setIsSearching(true);
				searchCharacters(debouncedSearchTerm).then((results) => {
					setIsSearching(false);
					setResults(results);
				});
			} else {
				setResults([]);
				setIsSearching(false);
			}
		},
		[debouncedSearchTerm] // Only call effect if debounced search term changes
	);
	return (
		<div className='flex flex-col justify-center p-16'>
			<input
				placeholder="Search TV Shows"
				onChange={(e) => setSearchTerm(e.target.value)}
				className='m-16 px-8 py-4 outline-slate-200 border text-center'
			/>
			{isSearching && <div className='text-4xl text-center'>Searching ...</div>}
			{!isSearching && 
			<div className='grid gap-8 grid-cols-4'>
				{results.map((result, index) => (
					<div key={index} className='p-4 rounded-lg shadow-xl border'>
						<div className='text-xl font-medium text-center py-4'>{result.show.name}</div>
						<img
							alt=''
							src={`${result.show.image?.original}`}
						/>
					</div>
				))}
			</div>}
		</div>
	);
}

const searchCharacters = (search) => {
	return fetch(
		`https://api.tvmaze.com/search/shows?q=${search}`,
		{
			method: "GET",
		}
	)
		.then((r) => r.json())
		.then((r) => r)
		.catch((error) => {
			console.error(error);
			return [];
		});
}

export default App;
