import { Button } from '@/components/ui/button';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelsList } from '@/constants/options';
import { chatSession } from '@/service/AIModel';
import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { toast } from 'sonner';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { doc, setDoc } from "firebase/firestore";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { db } from '@/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
    const [formData, setFormData] = useState({
        noOfDays: '',
        location: null,
        budget: '',
        travelers: '',
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: (error) => console.log(error)
    });

    const OnGenerateTrip = async () => {
        const user = localStorage.getItem('user');
        if (!user) {
            setOpenDialog(true);
            return;
        }

        if (formData.noOfDays > 5 || !formData.location || !formData.budget || !formData.travelers) {
            toast("Please fill all details");
            return;
        }
        setLoading(true);
        const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', formData.location.label)
            .replace('{totalDays}', formData.noOfDays)
            .replace('{travelers}', formData.travelers)
            .replace('{budget}', formData.budget);

        const result = await chatSession.sendMessage(FINAL_PROMPT);
        setLoading(false);
        SaveAiTrip(result?.response?.text());
    };

    const SaveAiTrip = async (TripData) => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        const docId = Date.now().toString();
        await setDoc(doc(db, "AITrips", docId), {
            userSelection: formData,
            tripData: TripData,
            userEmail: user?.email,
            id: docId
        });
        setLoading(false);
        navigate('/view-trip/' + docId);
    };

    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'Application/json'
            }
        }).then((resp) => {
            localStorage.setItem('user', JSON.stringify(resp.data));
            setOpenDialog(false);
            OnGenerateTrip();
        });
    };

    return (
        <div className='px-4 sm:px-5 md:px-10 lg:px-20 xl:px-24 mt-10'>
            <h2 className='font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl'>
                Tell us your Travel Preferences 🏕️🌴
            </h2>
            <p className='mt-3 text-gray-500 text-base sm:text-lg md:text-xl lg:text-2xl sm:text-gray-400'>
                Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
            </p>
            <div className='mt-5 sm:mt-20 flex flex-col gap-10'>
                <div>
                    <h2 className='text-lg sm:text-xl my-3 font-medium'>
                        What is your destination of choice?
                    </h2>
                    <GooglePlacesAutocomplete
                        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                        selectProps={{
                            onChange: (v) => {
                                setFormData({
                                    ...formData,
                                    location: v,
                                });
                            },
                        }}
                        defaultValue={formData.location}
                    />
                </div>
                <div>
                    <h2 className='text-lg sm:text-xl my-3 font-medium'>
                        How many days are you planning your trip?
                    </h2>
                    <input
                        placeholder={'Ex. 3'}
                        type='number'
                        onChange={(e) => setFormData({ ...formData, noOfDays: e.target.value })}
                        className="w-full border p-2 rounded bg-white text-black"
                    />
                </div>
                <div>
                    <h2 className='text-lg sm:text-xl my-3 font-medium'>
                        What is your Budget?
                    </h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5'>
                        {SelectBudgetOptions.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => setFormData({ ...formData, budget: item.title })}
                                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${formData.budget === item.title ? 'shadow-lg border-black' : ''}`}
                            >
                                <h2 className='text-4xl'>{item.icon}</h2>
                                <h2 className='font-bold text-lg'>{item.title}</h2>
                                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className='text-lg sm:text-xl my-3 font-medium'>
                        Who do you plan on traveling with on your next adventure?
                    </h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5'>
                        {SelectTravelsList.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => setFormData({ ...formData, travelers: item.people })}
                                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${formData.travelers === item.people ? 'shadow-lg border-black' : ''}`}
                            >
                                <h2 className='text-4xl'>{item.icon}</h2>
                                <h2 className='font-bold text-lg'>{item.title}</h2>
                                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='mt-10 justify-end flex'>
            <Button 
                onClick={OnGenerateTrip} 
                disabled={loading} 
                className={`w-full sm:w-auto flex items-center justify-center p-2 rounded-lg transition-colors duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-blue-700'}`}
            >
                {loading ? <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : "Generate Trip"}
            </Button>
            </div>
            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription>
                            <img src='/logo.svg' alt="Logo" />
                            <h2 className='font-bold text-lg mt-7'>Sign In With Google</h2>
                            <p>Sign In to the App with Google Authentication securely</p>
                            <Button onClick={login} className='w-full mt-5 flex gap-4 items-center'><FcGoogle className='h-7 w-7' />Sign In With Google</Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateTrip;
