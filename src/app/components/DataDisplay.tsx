'use client';

import React, { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const DataDisplay = () => {
    const { data, isLoading, error } = useQuery<any[]>({
        queryKey: ['albums'],
        queryFn: async () => {
            try {
                const response = await axios.get('https://jsonplaceholder.typicode.com/albums');
                let albums = response.data;

                localStorage.setItem('albums', JSON.stringify(albums));

                const sort = localStorage.getItem('sort');
                if (sort === 'true') {
                    console.log('Sorting albums');
                    albums.sort((a, b) => a.title.localeCompare(b.title));
                }

                return albums;
            } catch (error) {
                console.error('Network request failed:', error);

                const backupAlbums = localStorage.getItem('albums');
                if (backupAlbums) {
                    let albums = JSON.parse(backupAlbums);

                    const sort = localStorage.getItem('sort');
                    if (sort === 'true') {
                        albums.sort((a, b) => a.title.localeCompare(b.title));
                    }

                    return albums;
                } else {
                    throw new Error('No network and no local data available.');
                }
            }
        },
    });

    const sortToggle = () => {
        const sort = localStorage.getItem('sort');
        if (sort === 'true') {
            localStorage.setItem('sort', 'false');
        } else {
            localStorage.setItem('sort', 'true');
        }
        location.reload()
    };

    const deleteAlbum = (albumId: number) => {
        let albums = JSON.parse(localStorage.getItem('albums') || '[]');
        albums = albums.filter((album: any) => album.id !== albumId);
        localStorage.setItem('albums', JSON.stringify(albums));
        location.reload()
    };

    const moveAlbumUp = (albumId: number) => {
        let albums = JSON.parse(localStorage.getItem('albums') || '[]');
        const index = albums.findIndex((album: any) => album.id === albumId);
    
        if (index > 0) {
            const [album] = albums.splice(index, 1);
            albums.splice(index - 1, 0, album); 
            localStorage.setItem('albums', JSON.stringify(albums));
            location.reload();
        }
    };
    
    const moveAlbumDown = (albumId: number) => {
        let albums = JSON.parse(localStorage.getItem('albums') || '[]');
        const index = albums.findIndex((album: any) => album.id === albumId);
    
        if (index < albums.length) {
            const [album] = albums.splice(index, 1);
            albums.splice(index + 1, 0, album); 
            localStorage.setItem('albums', JSON.stringify(albums));
            location.reload();
        }
    };

    
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;

    return (
        <div>
            {/* <button onClick={sortToggle}>Toggle Sort</button> */}
            <div className="columns-1 sm:columns-2 md:columns-4 lg:columns-8 xl:columns-12 space-y-5 text-black">
                {data?.map((album) => (
                    <p className="bg-white rounded-lg text-center" key={album.id}>
                        {album.id} {album.title}<br></br>
                        <button 
                            type="button" 
                            onClick={() => moveAlbumUp(album.id)} 
                            className="focus:outline-none text-white bg-blue-600 hover:bg-blue-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                        >
                            Up
                        </button>
                        <button 
                            type="button" 
                            onClick={() => deleteAlbum(album.id)} 
                            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        >
                            Delete
                        </button>
                        <button 
                            type="button" 
                            onClick={() => moveAlbumDown(album.id)} 
                            className="focus:outline-none text-white bg-blue-600 hover:bg-blue-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                        >
                            Down
                        </button>
                    </p>
                ))}
            </div>
        </div>
    );
};

export default DataDisplay;