import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import UserContext from '../../context/user';
import FirebaseContext from '../../context/firebase';

function Action({ docId, totalLikes, likedPhoto, handleFocus }) {
    const { user: { uid: userId } } = useContext(UserContext);
    const { firebaseApp, FieldValue } = useContext(FirebaseContext);
    const [toggleLikePhoto, setToggleLikePhoto] = useState(likedPhoto);
    const [likes, setLikes] = useState(totalLikes);

    const handleLikePhoto = async () => {
        setToggleLikePhoto(like => !like);

        await firebaseApp.firestore().collection('photos')
            .doc(docId).update({
                likes: toggleLikePhoto ? FieldValue.arrayRemove(userId) :
                    FieldValue.arrayUnion(userId)
            });

        setLikes((likes) => toggleLikePhoto ? likes - 1 : likes + 1);
    }

    return <div class="px-4 py-1">
        <div class="flex items-center justify-between">
            <div class="flex gap-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" class={`h-8 w-8 ${toggleLikePhoto ? "fill-red text-red-primary" : "text-black-light"} cursor-pointer select-none`} fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    onClick={handleLikePhoto}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            handleLikePhoto();
                        }
                    }}
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 cursor-pointer select-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    onClick={handleFocus}
                    onKeyDown={(event) => {
                        if(event.key === 'Enter') {
                            handleFocus();
                        }
                    }}
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </div>
            <div class="cursor-pointer select-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            </div>
        </div>
        <div class="pt-1">
            <p class="text-sm font-bold">
                {likes === 1 ? `${likes} like` : `${likes} likes`}
            </p>
        </div>
    </div>;
}

Action.propTypes = {
    docId: PropTypes.string.isRequired,
    totalLikes: PropTypes.number.isRequired,
    likedPhoto: PropTypes.bool.isRequired,
    handleFocus: PropTypes.func.isRequired
}

export default Action;