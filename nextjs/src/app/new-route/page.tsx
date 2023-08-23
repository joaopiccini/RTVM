'use client';

import { FormEvent } from 'react';
import type { FindPlaceFromTextResponseData } from '@googlemaps/google-maps-services-js';

export function NewRoutePage() {
    async function searchPlaces(event: FormEvent) {
        event.preventDefault();
        const source = (document.getElementById('source') as HTMLInputElement).value;
        const destination = (document.getElementById('destination') as HTMLInputElement).value;

        const [sourceResponse, destionationResponse]: FindPlaceFromTextResponseData[] = await Promise.all([
            fetch(`http://localhos:3000/places?text=${source}`),
            fetch(`http://localhos:3000/places?text=${destination}`)
        ])
        
        const [sourcePlace, destionationPlace] = await Promise.all([
            sourceResponse.json(),
            destionationResponse.json()
        ])

        if (sourcePlace.status !== 'OK') {
            console.error(sourcePlace);
            alert('Não foi possível encontrar a origem');
            return;
        }

        if (destionationPlace.status !== 'OK') {
            console.error(destionationPlace);
            alert('Não foi possível encontrar a destino');
            return;
        }

        const placeSourceId = sourcePlace.candidates[0].place_id;
        const placeDestinationId = destionationPlace.candidates[0].place_id;

        const directionsResponse = await fetch(
            `http://localhos:3000/directions?originId=${placeSourceId}&destinationId=${placeDestinationId}`
        );

        const directionsData = directionsResponse.json();

    }
    return (
            <div>
                <h1>Nova rota</h1>
                <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={searchPlaces}>
                    <div>
                        <input id='source' type='text' placeholder='Origem'/>
                    </div>
                    <div>
                        <input id='destination' type='text' placeholder='Destino'/>
                    </div>
                    <button type='submit'>Pesquisar</button>
                </form>
            </div>
    );
}

export default NewRoutePage