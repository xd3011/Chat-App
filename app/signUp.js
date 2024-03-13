import { View, Text, Image, TouchableOpacity, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Octicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';

const SignUp = () => {
    const router = useRouter();
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [profile, setProfile] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !username || !password || !profile) {
            Alert.alert("Sign Up", "Please fill all the fields");
            return;
        }
        else {
            setLoading(true);
            let response = await register(email, password, username, profile);
            setLoading(false);
            console.log('got result: ', response);
            if (!response.success) {
                Alert.alert("Sign Up", response.message);
            };
        }
    }
    return (
        <CustomKeyboardView>
            <StatusBar style='dark' />
            <View className="flex-1 gap-12" style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }}>
                <View className="items-center">
                    <Image style={{ height: hp(20) }} resizeMode='contain' source={require('../assets/images/register.png')} />
                </View>
                <View className="gap-10">
                    <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">Sign Up</Text>
                    <View className="gap-4">
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                            <Octicons name='mail' size={hp(2.7)} color="gray" />
                            <TextInput
                                value={email}
                                onChangeText={(text) => { setEmail(text) }}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder='Email address'
                                placeholderTextColor="rgba(0,0,0,0.3)"
                            />
                        </View>
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                            <Feather name="user" size={24} color="black" />
                            <TextInput
                                value={username}
                                onChangeText={(text) => { setUsername(text) }}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder='Username'
                                placeholderTextColor="rgba(0,0,0,0.3)"
                            />
                        </View>
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                            <Octicons name='lock' size={hp(2.7)} color="gray" />
                            <TextInput
                                value={password}
                                onChangeText={(text) => { setPassword(text) }}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder='Password'
                                placeholderTextColor="rgba(0,0,0,0.3)"
                                secureTextEntry
                            />
                        </View>
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                            <Feather name="image" size={24} color="black" />
                            <TextInput
                                value={profile}
                                onChangeText={(text) => { setProfile(text) }}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder='Profile'
                                placeholderTextColor="rgba(0,0,0,0.3)"
                            />
                        </View>

                        <View>
                            {
                                loading ? (
                                    <View className="flex-row justify-center">
                                        <Loading size="hp(6.5)" />
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={handleRegister}
                                        style={{ height: hp(6.5), backgroundColor: 'rgb(99 102 241)', justifyContent: 'center', alignItems: 'center', borderRadius: 14 }}
                                        className='bg-indigo-500 rounded-xl justify-center items-center'
                                    >
                                        <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider">
                                            Sign Up
                                        </Text>
                                    </TouchableOpacity >
                                )
                            }
                        </View>
                        <View className="flex-row justify-center">
                            <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">Already have an account? </Text>
                            <Pressable onPress={() => {
                                router.push('signIn');
                            }}>
                                <Text style={{ fontSize: hp(1.8) }} className="font-bold text-indigo-500">Sign In</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </CustomKeyboardView>
    )
}

export default SignUp