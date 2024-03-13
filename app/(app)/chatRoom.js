import { View, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import ChatRoomHeader from '../../components/ChatRoomHeader';
import MessageList from '../../components/MessageList';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import { useAuth } from '../../context/authContext';
import { db } from '../../firebaseConfig';
import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { getRoomId } from '../../utils/common';


const ChatRoom = () => {
    const item = useLocalSearchParams();
    const { user } = useAuth()
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        createRoomIfNotExists();
        let roomId = getRoomId(item?.userId, user?.userId);
        const docRef = doc(db, 'rooms', roomId);
        const messageRef = collection(docRef, 'messages');
        const q = query(messageRef, orderBy('createdAt', 'asc'));
        let unsub = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map(doc => {
                return doc.data();
            });
            setMessages([...allMessages]);
        })

        const KeyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow', updateScrollView
        )
        return () => {
            unsub();
            KeyboardDidShowListener.remove();
        }
    }, []);

    useEffect(() => {
        updateScrollView();
    }, [messages])

    const updateScrollView = () => {
        setTimeout(() => {
            scrollViewRef?.current?.scrollToEnd({ animated: true });
        }, 100)
    }

    const createRoomIfNotExists = async () => {
        let roomId = getRoomId(item?.userId, user?.userId);
        await setDoc(doc(db, "rooms", roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date())
        });
    }

    const handleSendMessage = async () => {
        let message = textRef.current.trim();
        if (!message) return;
        try {
            let roomId = getRoomId(item?.userId, user?.userId);
            const docRef = doc(db, 'rooms', roomId);
            const messageRef = collection(docRef, "messages");
            textRef.current = "";
            if (inputRef) inputRef?.current.clear();
            await addDoc(messageRef, {
                userId: user?.userId,
                text: message,
                profileUrl: user?.profileUrl,
                senderName: user?.username,
                createdAt: Timestamp.fromDate(new Date())
            });
        } catch (error) {
            Alert.alert('Message', error.message);
        }
    }

    return (
        <CustomKeyboardView inChat={true}>
            <View className='flex-1 bg-white'>
                <StatusBar style='dark' />
                <ChatRoomHeader user={item} router={router} />
                <View className="h-3 border-b border-neutral-300" />
                <View className="flex-1 justify-between bg-neutral-100 overflow-visible">
                    <View className="flex-1">
                        <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={user} />
                    </View>
                </View>
                <View style={{ paddingBottom: hp(2.7) }} className="pt-2 bg-neutral-100">
                    <View className="flex-row justify-between bg-white border p-2 border-neutral-300 rounded-full pl-5 mx-3">
                        <TextInput
                            ref={inputRef}
                            onChangeText={value => textRef.current = value}
                            placeholder='Type message .....'
                            placeholderTextColor="rgba(0,0,0,0.3)"
                            className="flex-1 mr-2 "
                            style={{ fontSize: hp(2) }}
                        />
                        <TouchableOpacity
                            onPress={handleSendMessage}
                            style={{
                                backgroundColor: '#E4E7EB',
                                padding: hp(0.7),
                                marginRight: 1,
                                borderRadius: 999
                            }}
                        >
                            <Feather name="send" size={hp(2.7)} color='#737373' />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </CustomKeyboardView >
    )
}

export default ChatRoom