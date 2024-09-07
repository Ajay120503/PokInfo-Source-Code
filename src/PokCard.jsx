import { Box, Text, Image, Button, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, PopoverCloseButton, Stack } from '@chakra-ui/react';

function PokCard({ pokemondata }) {
    const { name, sprites, types, abilities, height, weight, stats, base_experience } = pokemondata;

    const statsMap = stats.reduce((acc, stat) => {
        acc[stat.stat.name] = stat.base_stat;
        return acc;
    }, {});

    return (
        <Box
            borderRadius='md'
            padding='4'
            margin='2'
            textAlign='center'
            background='#f0f0f0'
            boxShadow='md'
            borderWidth='1px'
            borderColor='gray.200'
            _hover={{
                transform: 'scale(1.05)',
                boxShadow: 'lg',
                transition: 'all 0.3s ease',
                background: 'gray.300'
            }}
            transition='all 0.3s ease'
        >
            <Image
                src={sprites.front_default}
                alt={name}
                boxSize='200px'
                objectFit='contain'
                mx='auto'
                borderRadius='md'
                borderWidth='1px'
                borderColor='gray.300'
            />
            <Text
                fontSize='2xl'
                fontFamily='Aladin'
                color='gray.600'
                fontWeight='semibold'
                mt='2'
            >
                {name.toUpperCase()}
            </Text>
            <Box mt='2'>
                <Text
                    fontSize='sm'
                    color='gray.500'
                    fontWeight='medium'
                >
                    {types.map((type) => type.type.name.toUpperCase()).join(", ")}
                </Text>
            </Box>
            <Popover>
                <PopoverTrigger>
                    <Button mt='4' colorScheme='teal'>
                        Description
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader fontWeight='semibold'>
                        Details of {name.charAt(0).toUpperCase() + name.slice(1)}
                    </PopoverHeader>
                    <PopoverBody bg='#e0e0e0'>
                        <Stack spacing={2} textAlign='start'>
                            <Text fontSize='sm' color='gray.900'>
                                <strong>Abilities:</strong> {abilities.map((ability) => ability.ability.name).join(", ")}
                            </Text>
                            <Text fontSize='sm' color='gray.900'>
                                <strong>Height:</strong> {height / 10} m
                            </Text>
                            <Text fontSize='sm' color='gray.900'>
                                <strong>Weight:</strong> {weight / 10} kg
                            </Text>
                            <Text fontSize='sm' color='gray.900'>
                                <strong>Speed:</strong> {statsMap.speed || 'N/A'}
                            </Text>
                            <Text fontSize='sm' color='gray.900'>
                                <strong>Experience:</strong> {base_experience}
                            </Text>
                            <Text fontSize='sm' color='gray.900'>
                                <strong>Attack:</strong> {statsMap.attack || 'N/A'}
                            </Text>
                        </Stack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Box>
    );
}

export default PokCard;
