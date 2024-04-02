import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Stack } from "expo-router";

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const wordPairs = [
    { English: "April", Ukrainian: "Квітень" },
    { English: "August", Ukrainian: "Серпень" },
    { English: "CD", Ukrainian: "CD (Компакт-диск)" },
    { English: "December", Ukrainian: "Грудень" },
    { English: "February", Ukrainian: "Лютий" },
    { English: "Friday", Ukrainian: "П'ятниця" },
    { English: "I", Ukrainian: "Я" },
    { English: "Internet", Ukrainian: "Інтернет" },
    { English: "January", Ukrainian: "Січень" },
    { English: "July", Ukrainian: "Липень" },
    { English: "June", Ukrainian: "Червень" },
    { English: "K", Ukrainian: "K (Кіло)" },
    { English: "March", Ukrainian: "Березень" },
    { English: "May", Ukrainian: "Травень" },
    { English: "Monday", Ukrainian: "Понеділок" },
];

const generateCards = () => {
    // Shuffle the wordPairs array
    const shuffledWordPairs = shuffleArray(wordPairs);

    // Select the first 6 pairs to create the cards
    const selectedPairs = shuffledWordPairs.slice(0, 6);

    // Create cards from the selected pairs
    const cards = selectedPairs.flatMap((pair, index) => [
        { word: pair.English, language: "english", index },
        { word: pair.Ukrainian, language: "ukrainian", index },
    ]);

    // Shuffle the cards array
    const shuffledCards = shuffleArray(cards);

    return shuffledCards;
};

const MemoryGame = () => {
    const [cards, setCards] = useState(generateCards());
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (flippedIndices.length === 2) {
            const [index1, index2] = flippedIndices;
            const card1 = cards[index1];
            const card2 = cards[index2];
            if (card1.index === card2.index) {
                setCards((prevCards) =>
                    prevCards.map((card, index) =>
                        index === index1 || index === index2
                            ? { ...card, matched: true }
                            : card
                    )
                );
            }

            setDisabled(true);
            setTimeout(() => {
                setFlippedIndices([]);
                setDisabled(false);
            }, 1000);
        }
    }, [flippedIndices, cards]);

    const handleCardPress = (index) => {
        if (
            flippedIndices.length < 2 &&
            !flippedIndices.includes(index) &&
            !disabled
        ) {
            setFlippedIndices((prev) => [...prev, index]);
        }
    };

    const renderCard = (card, index) => {
        const isFlipped = flippedIndices.includes(index) || card.matched;
        return (
            <TouchableOpacity
                key={index}
                style={[styles.card, isFlipped && styles.cardFlipped]}
                onPress={() => handleCardPress(index)}
                disabled={isFlipped || flippedIndices.length >= 2 || disabled}
            >
                {isFlipped && <Text style={styles.cardText}>{card.word}</Text>}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Алфавіт",
                }}
            />
            <View
                style={{
                    position: "absolute",
                    width: 320,
                    height: 320,
                    backgroundColor: "aqua",
                    borderRadius: 200,
                    shadowColor: "#000000",
                    shadowOffset: {
                        width: 0,
                        height: 10,
                    },
                    shadowOpacity: 0.17,
                    shadowRadius: 3.05,
                    elevation: 10,
                }}
            ></View>
            <View style={styles.grid}>
                {cards.map((card, index) => renderCard(card, index))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        width: 300,
    },
    card: {
        width: 100,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e91e63",
        margin: 5,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 10,
        borderRadius: 4,
    },
    cardFlipped: {
        backgroundColor: "white",
    },
    cardText: {
        fontSize: 20,
    },
});

export default MemoryGame;
