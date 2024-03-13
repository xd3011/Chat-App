import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { blurhash, formatDate, getRoomId } from '../utils/common';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ChatItem = ({ item, index, router, noBorder, currentUser }) => {
    const [lastMessage, setLastMessage] = useState(undefined);
    useEffect(() => {
        let roomId = getRoomId(item?.userId, currentUser?.userId);
        const docRef = doc(db, 'rooms', roomId);
        const messageRef = collection(docRef, 'messages');
        const q = query(messageRef, orderBy('createdAt', 'desc'));
        let unsub = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map(doc => {
                return doc.data();
            });
            setLastMessage(allMessages[0] ? allMessages[0] : null);
        })
        return unsub;
    }, [])
    const openChatRoom = () => {
        router.push({ pathname: '/chatRoom', params: item })
    }

    const renderTime = () => {
        if (lastMessage) {
            let date = lastMessage?.createdAt;
            return formatDate(new Date(date?.seconds * 1000));
        }
        return 'Time';
    }
    const renderLastMessage = () => {
        if (typeof lastMessage === 'undefined') {
            return 'Loading...';
        }
        if (lastMessage) {
            if (currentUser?.userId == lastMessage?.userId) {
                return "You: " + lastMessage?.text;
            }
            return lastMessage?.text;
        } else {
            return `Say Hi ${item.username}`;
        }
    }
    return (
        <TouchableOpacity
            onPress={openChatRoom}
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 16,
                alignItems: 'center',
                gap: 10,
                marginBottom: 4,
                paddingBottom: 2,
                ...(noBorder ? {} : {
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0,0,0,0.1)'
                })
            }}
        >
            <Image
                style={{ height: hp(6), width: hp(6), borderRadius: 999 }}
                source={item?.profileUrl}
                placeholder={blurhash}
                transition={500}
            />
            <View className="flex-1 gap-1">
                <View className="flex-row justify-between">
                    <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-800">{item?.username}</Text>
                    <Text style={{ fontSize: hp(1.6) }} className="font-medium text-neutral-500">{renderTime()}</Text>
                </View>
                <Text style={{ fontSize: hp(1.6) }} className="font-medium text-neutral-500">{renderLastMessage()}</Text>
            </View>
        </TouchableOpacity>
    )

}

export default ChatItem