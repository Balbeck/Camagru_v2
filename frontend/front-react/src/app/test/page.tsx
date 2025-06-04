'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";


const CreateTotoButton = () => {

    const router = useRouter();


    const handleCreateTestUser = async () => {
        try {

            const res = await fetch('http://localhost:3000/user/testUser', {
                method: 'POST',
            });

            if (res.ok) {
                console.log(' 🙋🏼 [ New Toto testUser Created ] ')
                router.replace("/");
            } else {
                console.error(' 🙋🏼 [ New Toto testUser  ] ❌ Error');
            }
        } catch (error) {
            console.error(' 🙋🏼 [ LogOut ] ❌ Error: ', error);
        }
    };

    useEffect(() => {
        console.log(' 🙋🏼 [ CreateTotoButton Component Mounted ] ');
        handleCreateTestUser();
    }, []);

    return (
        <button
            onClick={handleCreateTestUser}
            className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition'
        >
            Create Toto
        </button>
    );

};

export default CreateTotoButton;
