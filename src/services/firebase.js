import { firebaseApp, FieldValue } from '../lib/firebase';

export async function isUsernameExist(username) {
    const result = await firebaseApp.firestore()
        .collection('users')
        .where('username', '==', username.toLowerCase())
        .get();

    return result.docs.length > 0;
}

export async function getUserByUsername(username) {
    const result = await firebaseApp.firestore()
        .collection('users')
        .where('username', '==', username.toLowerCase())
        .get();

    return result.docs.map((item) => ({
        ...item.data(), docId: item.id
    }));
}

export async function getUserById(userId) {
    const result = await firebaseApp.firestore().collection('users')
        .where('userId', '==', userId).get();

    const user = await result.docs.map((item) => ({
        ...item.data(), docId: item.id 
    }));

    return user;
}

export async function getSuggestedProfiles(userId, fallowing) {
    let query = firebaseApp.firestore().collection('users');
    
    if(fallowing.length > 0) {
        query = query.where('userId', 'not-in', [...fallowing, userId]);
    } else {
        query = query.where('userId', '!=', userId);
    }
    
    const result = await query.limit().get();

    const resultResponse = await result.docs.map((item) => ({
        ...item.data(), docId: item.id,
    }));
    
    const profiles = await Promise.all(
        resultResponse.map((profile) => {
            let isFallowingProfile = false;
            if(profile?.fallowing > 0 && profile?.fallowing.includes(userId)) {
                isFallowingProfile =  true;
            }

            return { ...profile, isFallowingProfile }
        })
    );

    return profiles;
}

export async function updateLoggedInUserFallowing(loggedInUserDocId, 
    profileId, isFallowingProfile
    ) {
    return firebaseApp.firestore().collection('users').doc(loggedInUserDocId)
    .update({
        fallowing: isFallowingProfile ? FieldValue.arrayRemove(profileId) :
                    FieldValue.arrayUnion(profileId),
    });
}

export async function updateFallowedUserFallowers(profileDocId, 
    loggedInUserDocId, isFallowingProfile
    ) {
    return firebaseApp.firestore().collection('users').doc(profileDocId)
    .update({
        fallowers: isFallowingProfile ? FieldValue.arrayRemove(loggedInUserDocId) : FieldValue.arrayUnion(loggedInUserDocId),
    });
}

export async function getPhotos(userId, fallowing) {
    const result = await firebaseApp.firestore()
        .collection('photos')
        .where('userId', "in", fallowing).get();

    const userFallowedPhotos = await result.docs.map((photo) => ({
        ...photo.data(), docId: photo.id
    }));

    const photosUserDetails = await Promise.all(
        userFallowedPhotos.map(async (photo) => {
            let isUserLikePhotos = false;
            if(photo.likes.includes(userId)) {
                isUserLikePhotos =  true;
            }

            const user = await getUserById(photo.userId);
            const { username } = user[0];

            return { username, ...photo, isUserLikePhotos };
        })
    );

    return photosUserDetails;
}

export async function getUserPhotosByUsername(user) {
    const result = await firebaseApp.firestore().collection('photos')
        .where('userId', '==', user.userId).get();

    return result.docs.map((item) => ({ 
        ...item.data(),  docId: item.id 
    }));
}

export async function isUserFallowingProfile(
    loggedInUsername, userProfileId
) {
    const result = await firebaseApp.firestore().collection('users')
        .where('username', '==', loggedInUsername)
        .where('fallowing', 'array-contains', userProfileId).get();

    const [ response = {} ] = await result.docs.map((item) => ({
        ...item.data(), docId: item.id
    }));

    return response.userId;
}

export async function toggleFallow(isFallowingProfile, 
    loggedInUserDocId, profileDocId, profileUserId, loggedInUserId
) {
    await updateLoggedInUserFallowing(loggedInUserDocId, profileUserId, isFallowingProfile);
    await updateFallowedUserFallowers(profileDocId, loggedInUserId, isFallowingProfile);
}

export async function loggedInUserPost(file, setUrl, userId) {
    const storageRef = await firebaseApp.storage().ref(file.name);

    storageRef.put(file).on('state_changed', (snap) => {
        console.log(snap);
    }, (err) => {
        console.log(err);
    }, async () => {
        const url = await storageRef.getDownloadURL();
        setUrl(url);
    });
}

export async function getRecentSearch(userId) {
    const result = await firebaseApp.firestore().collection('recent-search')
        .where('userId', '==', userId).get();

    const [recentUser] = await result.docs.map((recents) => ({
        ...recents.data(), docId: recents.id
    }));
    
    const res = await recentUser.recent.map((res) => res);
    let query = firebaseApp.firestore().collection('users');

    if(res.length > 0) {
        query = query.where('userId', 'in', res);
    } else {
        query = query.where('userId', '==', recentUser.docId);
    }

    const queryResult = await query.get();

    const response = await queryResult.docs.map((item) => ({
        ...item.data(), docId: item.id, searchId: recentUser.docId
    }));

    return response;
}

export async function getSearchProfiles(value) {
    const user = await firebaseApp.firestore()
        .collection('users').get();

    const result = await user.docs.map((item) => ({
        ...item.data(), docId: item.id
    }));

    const val = value.toLowerCase();
    const res = result.filter(({ username }) => username.toLowerCase().includes(val));

    return res;
}

export async function deleteSearchRecent(userProfile, isAdd, userId) {
    const result = await firebaseApp.firestore().collection('recent-search')
            .where('userId', '==', userId).get();
            
    const [recentUser] = await result.docs.map((recents) => ({
        ...recents.data(), docId: recents.id
    }));    
    
    return firebaseApp.firestore().collection('recent-search')
        .doc(recentUser.docId).update({
            recent: isAdd ? FieldValue.arrayUnion(userProfile.userId) :
                FieldValue.arrayRemove(userProfile.userId)
        });
}

export async function deleteAllSearchRecent(userId) {
    const result = await firebaseApp.firestore().collection('recent-search')
        .where('userId', '==', userId).get();
            
    const [recentUser] = await result.docs.map((recents) => ({
        ...recents.data(), docId: recents.id
    })); 

    return firebaseApp.firestore().collection('recent-search')
        .doc(recentUser.docId).update({
            recent: FieldValue.delete()
        });
}

export async function getPostByDocId(doc) {
    const result = await firebaseApp.firestore().collection('photos')
        .doc(doc).get();

    return result.data();
}