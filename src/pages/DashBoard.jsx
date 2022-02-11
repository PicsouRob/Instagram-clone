import React, { useEffect } from 'react';

import Header from '../components/Header';
import Timeline from '../components/Timeline';
import Sidebar from '../components/sidebar/Sidebar';
import LoggedInUserContext from '../context/loggedInUserContext';
import { useUser } from '../hooks/useUser';

function Home({ user: loggedInUser }) {
    const { user, setActiveUser } = useUser(loggedInUser.uid);

    useEffect(() => {
        document.title = "Instagram"
    }, []);

    return <LoggedInUserContext.Provider value={{ user, setActiveUser }}>
        <div class="relative w-full bg-gray-background mx-auto min-h-screen">
            <Header />
            <div class="container mx-auto max-w-screen-lg px-0 md:px-6">
                <div class="relative pt-20 sm:pt-24 grid grid-cols-1 md:grid-cols-3 gap-x-0 md:gap-x-8 w-full">
                    <Timeline />
                    <div class="hidden md:flex w-full md:col-span-1">
                        <Sidebar />
                    </div>
                </div>
            </div>
        </div>
    </LoggedInUserContext.Provider>
}

export default Home;