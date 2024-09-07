import { useEffect, useState, useCallback } from "react";
import { Box, Spinner, Alert, Text, AlertIcon, Input, IconButton, Button, Image } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import PokCard from "./PokCard";
import debounce from 'lodash/debounce'; // Ensure lodash is installed

function PokCards() {
    const [pokemon, setPokemon] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 50; // Number of Pokémon to fetch per request
    const API = `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=`;

    const fetchPokemon = async (offset) => {
        try {
            setLoading(true);
            const response = await fetch(API + offset);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            const detailsPromises = data.results.map(async (curPok) => {
                const res = await fetch(curPok.url);
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                return data;
            });

            const detailsRes = await Promise.all(detailsPromises);
            setPokemon((prev) => [...prev, ...detailsRes]);
            setFilteredPokemon((prev) => [...prev, ...detailsRes]);
            setHasMore(data.results.length === LIMIT);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPokemon(offset);
    }, [offset]);

    // Debounced search function
    const handleSearch = useCallback(
        debounce((term) => {
            if (term.trim() === "") {
                setFilteredPokemon(pokemon);
            } else {
                const filtered = pokemon.filter(pok =>
                    pok.name.toLowerCase().includes(term.toLowerCase())
                );
                setFilteredPokemon(filtered);
            }
        }, 1000), // Adjust debounce delay as needed
        [pokemon]
    );

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm, handleSearch]);

    const handleLoadMore = () => {
        setOffset((prev) => prev + LIMIT);
    };

    if (loading && offset === 0) return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Spinner size="xl" color="blue.500" />
        </Box>
    );

    if (error) return (
        <Alert status='error' mb={4}>
            <AlertIcon />
            {error}
        </Alert>
    );

    return (
        <Box w='100%' display='flex' flexDirection='column' alignItems='center'>
            <Box bg='#000' position='sticky' top='0' zIndex='5' w='100%' mb={4} display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                <Image
                    src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
                    alt="Pokémon Logo"
                    mx='auto'
                    mb={4}
                />
                <Box display='flex' alignItems='center' mb={4}>
                    <Input
                        placeholder="Search Pokémon"
                        w='70vw'
                        bg='#fff'
                        mr={2}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <IconButton
                        colorScheme='blue'
                        aria-label="Search Pokémon"
                        icon={<SearchIcon />}
                        isLoading={loading} // Optional: Show loading indicator on search
                        onClick={() => { }} // No need for click handler
                    />
                </Box>
            </Box>
            <Box w='100%' h='100%' display='flex' flexWrap='wrap' justifyContent='center'>
                {filteredPokemon.length === 0 && !loading ? (
                    <Text>No Pokémon found</Text>
                ) : (
                    filteredPokemon.map((curPok) => (
                        <PokCard key={curPok.id} pokemondata={curPok} />
                    ))
                )}
            </Box>
            {hasMore && (
                <Button
                    mt={4}
                    colorScheme='blue'
                    isLoading={loading}
                    onClick={handleLoadMore}
                >
                    Load More
                </Button>
            )}
        </Box>
    );
}

export default PokCards;
