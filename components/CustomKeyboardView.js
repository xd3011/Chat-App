import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React from 'react'

const ios = Platform.OS === 'ios';
const CustomKeyboardView = ({ children, inChat }) => {
    let kavConfig = {};
    let scrollViewConfig = {};
    if (inChat) {
        kavConfig = { keyboardVerticalOffset: 90 };
        scrollViewConfig = { contentContainerStyle: { flex: 1 } };
    }
    return (
        <KeyboardAvoidingView
            behavior={ios ? 'padding' : 'height'}
            {...kavConfig}
            style={{ flex: 1 }}
        >
            <ScrollView
                style={{ flex: 1 }}
                {...scrollViewConfig}
                bounces={false}
                showVerticalScrollIndicator={false}
            >
                {
                    children
                }
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default CustomKeyboardView