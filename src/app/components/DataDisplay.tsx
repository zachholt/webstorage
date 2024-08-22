'use client'

import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const DataDisplay = () => {
    const { data, isLoading, error } = useQuery<any[]>({
        queryKey: ['albums'],
        queryFn: async () => {
            return (await axios.get('https://jsonplaceholder.typicode.com/albums')).data
        },
    })

    return (
        <div >
            <div className="columns-1 sm:columns-2 md:columns-4 lg:columns-8 xl:columns-12 space-y-5 text-black">
                {data?.map((album) => (
                    <p className= "bg-white rounded-lg text-center" key={album.id}>{album.title}</p>
                ))}
            </div>
        </div>
    );
};

export default DataDisplay;