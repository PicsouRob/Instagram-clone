import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';

import ChangePhotoModal from './ChangePhotoModal';
import { firebaseApp } from '../../lib/firebase';

const validate = yup.object().shape({
    phone: yup.string(),
    website: yup.string(),
    username: yup.string().min(3).required(),
    gender: yup.string(),
    bio: yup.string(),
});

function EditCurrentUser({ user, setIndexSide }) {
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);
    const { bio, phone, website, username, docId,
        gender, fullName, emailAddress, avatar
    } = user;

    useEffect(() => {
        setIndexSide(0);
    }, [setIndexSide]);

    const submitUpdate = async (values) => {
        await firebaseApp.firestore().collection('users')
            .doc(docId).update(values);

        navigate(`/p/${username}`)
    }

    return (
        <motion.div class="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
        >
            {modal && (<ChangePhotoModal setModal={setModal} user={user} />)}
            <div class="">
                <div class="flex items-center gap-x-5 md:gap-x-10 gap-y-2">
                    <div class="w-auto md:w-[88px] -mrl-10">
                        {!avatar ? (
                            <Skeleton count={1} width={40} height={40} circle />
                        ) : (
                            <img alt="" src={avatar}
                                class="w-12 h-12 rounded-full float-left md:float-right"
                            />
                        )}
                    </div>
                    <div class="w-3/4 flex flex-col self-start">
                        <p class="text-sm font-bold">{username}</p>
                        <button class="text-blue-medium self-start text-[14px] font-bold"
                            onClick={() => setModal(true)}
                        >
                            Change Profile Photo
                        </button>
                    </div>
                </div>
            </div>
            <Formik
                initialValues={{
                    bio, phone, website, username, gender,
                }}
                validationSchema={validate}
                onSubmit={(values) => submitUpdate(values)}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                    <form class="text-sm text-[#262626] flex flex-col gap-y-5 pt-6">
                        <div class="flex flex-col md:flex-row items-center gap-x-10 gap-y-2">
                            <div class="self-start text-left md:text-right w-auto md:w-28">
                                <p class="font-bold text-sm">Name</p>
                            </div>
                            <div class="w-full">
                                <input type="text" value={fullName} name="fullName"
                                    onChange={handleChange} disabled
                                    class="border border-gray-primary text-sm px-2 py-1 bg-gray-background w-full rounded-sm"
                                />
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row gap-x-10 gap-y-2">
                            <div class="self-start text-left md:text-right w-auto md:w-28">
                                <p class="font-bold text-sm">Username</p>
                            </div>
                            <div class="w-full">
                                <input type="text" value={username}
                                    name="username"
                                    class="border border-gray-primary bg-gray-background mb-4 text-sm px-2 py-1 w-full rounded-sm"
                                    onChange={handleChange}
                                />
                                {touched.username && errors.username && (
                                    <p class="text-[12px] -mt-4 text-red-primary">{errors.username}</p>
                                )}
                                <span class="text-[#a7a7a7] text-[12px]">
                                    In most cases, you'll be able to change your username back to iampicsou for another 14 days. <a class="text-blue-medium" href="https://help.instagram.com/876876079327341">Learn more</a>
                                </span>
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row items-center gap-x-10 gap-y-2">
                            <div class="self-start text-left md:text-right w-auto md:w-28">
                                <p class="font-bold text-sm">Website</p>
                            </div>
                            <div class="w-full">
                                <input type="text" value={website} name="website"
                                    class="border border-gray-primary bg-gray-background text-sm px-2 py-1 w-full rounded-sm"
                                    onChange={handleChange}
                                    placeholder="http://example.com"
                                />
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row items-center gap-x-10 gap-y-2">
                            <div class="self-start text-left md:text-right w-auto md:w-28">
                                <p class="font-bold text-sm">Bio</p>
                            </div>
                            <div class="w-full">
                                <textarea value={values.bio || ""} name="bio"
                                    class="border border-gray-primary bg-gray-background text-sm px-2 py-1 w-full rounded-sm resize"
                                    placeholder="Personal Information" onChange={handleChange}
                                />
                                <div class="mt-4 text-[#a7a7a7]">
                                    <p class="font-bold">Personal Information</p>
                                    <p class="text-[12px]">
                                        Provide your personal information, even if the account is used for a business, a pet or something else. This won't be a part of your public profile.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row items-center gap-x-10 gap-y-2">
                            <div class="self-start text-left md:text-right w-auto md:w-28">
                                <p class="font-bold text-sm">Email</p>
                            </div>
                            <div class="w-full">
                                <input type="text" value={emailAddress || ""}
                                    name="emailAddress" disabled
                                    class="border border-gray-primary bg-gray-background text-sm px-2 py-1 w-full rounded-sm"
                                    onChange={handleChange}
                                />
                                {touched.emailAddress && errors.emailAddress && (
                                    <p class="text-[12px] text-red-primary">{errors.emailAddress}</p>
                                )}
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row items-center gap-x-10 gap-y-2">
                            <div class="self-start text-left md:text-right w-auto md:w-28">
                                <p class="font-bold text-sm">Phone Number</p>
                            </div>
                            <div class="w-full">
                                <input type="text" value={values.phone || ""} name="phone"
                                    class="border border-gray-primary bg-gray-background text-sm px-2 py-1 w-full rounded-sm"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row items-center gap-x-10 gap-y-2">
                            <div class="self-start text-left md:text-right w-auto md:w-28">
                                <p class="font-bold text-sm">Gender</p>
                            </div>
                            <div class="w-full">
                                <input type="text" value={values.gender || ""} name="gender"
                                    class="border border-gray-primary bg-gray-background text-sm px-2 py-1 w-full rounded-sm"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row items-center gap-x-10 gap-y-2 text-[#262626] font-bold">
                            <div class="self-start text-left md:text-right w-auto md:w-28">
                                Similar Account Suggestions
                            </div>
                            <div class="flex items-center gap-x-2">
                                <input type="checkbox" class="cursor-pointer" />
                                <span class="text-xs w-2/3">
                                    Include your account when recommending similar accounts people might want to follow. <a class="text-blue-medium" href="https://help.instagram.com/530450580417848">
                                        [?]
                                    </a>
                                </span>
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row items-center gap-x-10 gap-y-2">
                            <div class="hidden md:block w-28 text-right text-white select-none">Insta</div>
                            <div class="flex items-center justify-between w-full pt-5">
                                <button type="button"
                                    class={`${!errors ? "opacity-100" : "opacity-80"} text-white bg-blue-medium text-sm font-bold p-2 rounded`}
                                    onClick={() => handleSubmit()}
                                >
                                    Submit
                                </button>
                                <button class="text-blue-medium text-sm font-bold">
                                    Temporarily disable my account
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
        </motion.div>
    )
}

EditCurrentUser.propTypes = {
    user: PropTypes.object.isRequired,
    setIndexSide: PropTypes.func.isRequired
}

export default EditCurrentUser;