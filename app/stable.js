import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const apiUrl = "https://in-the-know.blobsandtrees.online/wp-json/wp/v2/posts";

const imagesApiUrl =
    "https://in-the-know.blobsandtrees.online/wp-json/wp/v2/media";

const TestIt = () => {
    const [showAnswer, setShowAnswer] = useState(false);

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [randomImageIndex, setRandomImageIndex] = useState(0); // Add state for random image index

    const [images, setImages] = useState([]); // Add state for random image index

    const [media, setMedia] = useState([]); // Add state for random image index

    const [answerImg, setAnswerImg] = useState(null); // Add state for random image index


    fetch(imagesApiUrl)
        .then((response) => response.json())
        .then((data) => {
            // Assuming data is an array of media items
            const imageUrls = data.map((item) => ({ uri: item.source_url }));
            setImages(imageUrls);

            const pics = data.map((item) => ({ item }));

            setMedia(pics);

            // Now you can use imageUrls to display the images in your React Native app
        })
        .catch((error) => {
            console.error("Error fetching images:", error);
        });

    // useEffect(() => {
    //     fetch(apiUrl)
    //         .then((response) => response.json())
    //         .then((posts) => {
    //             // Assuming posts is an array of questions
    //             const filteredQuestions = posts.filter(
    //                 (question) => question?.custom_fields?.custom_field1
    //             );
    //             setQuestions(shuffleArray(filteredQuestions));
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // }, []); // empty dependency array ensures the effect runs only once on mount

    useEffect(() => {
        fetch("https://in-the-know.blobsandtrees.online/wp-json/custom/v1/question-posts")
            .then((response) => response.json())
            .then((posts) => {
                //Assuming posts is an array of questions
                const filteredQuestions = posts.filter(
                    (question) => question?.question
                );
                setQuestions(shuffleArray(filteredQuestions));

                console.log(questions);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []); 

    const shuffleArray = (array) => {
        let currentIndex = array.length,
            temporaryValue,
            randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };

    const handleGoPress = () => {
        setCurrentIndex(currentIndex + 1);

        randomIndex = Math.floor(Math.random() * images.length);

        setRandomImageIndex(randomIndex)

        console.log(images[randomImageIndex]);

        setShowAnswer(false);
    };

    const handleSeeAnswerPress = () => {

        setShowAnswer(true);

    };

    const renderCard = (letter, index) => {
        return (
            <View style={[styles.card]}>
                {
                    <>
                        <Text style={styles.cardText}>
                            {
                                questions[currentIndex]?.question
                            }
                        </Text>
                        <View>
                            {showAnswer ? (
                                <>
                                    <Text
                                        onPress={() => handleGoPress()}
                                        style={{
                                            color: "white",
                                            padding: 8,
                                            alignSelf: "center",
                                            width: 80,
                                            height: 80,
                                            fontSize: 12,
                                            display: "flex",
                                            fontWeight: "bold",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "aqua",
                                            shadowColor: "#000000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 10,
                                            },
                                            shadowOpacity: 0.17,
                                            shadowRadius: 3.05,
                                            elevation: 10,
                                            borderRadius: 400,
                                        }}
                                    >
                                        <Entypo
                                            name="forward"
                                            size={34}
                                            color="white"
                                        />
                                    </Text>
                                    <Text
                                        style={{
                                            color: "white",
                                            padding: 8,
                                            marginTop: 6,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: "bold",
                                            justifyContent: "center",
                                            backgroundColor: "orange",
                                            shadowColor: "#000000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 10,
                                            },
                                            shadowOpacity: 0.17,
                                            shadowRadius: 3.05,
                                            elevation: 10,
                                            borderRadius: 4,
                                        }}
                                    >
                                        {
                                            questions[currentIndex]
                                                ?.answer
                                        }
                                    </Text>
                                </>
                            ) : (
                                <Text
                                    onPress={() => handleSeeAnswerPress()}
                                    style={{
                                        color: "white",
                                        padding: 8,
                                        width: 80,
                                        height: 80,
                                        fontWeight: "bold",
                                        fontSize: 12,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "aqua",
                                        shadowColor: "#000000",
                                        alignSelf: "center",
                                        shadowOffset: {
                                            width: 0,
                                            height: 10,
                                        },
                                        shadowOpacity: 0.17,
                                        shadowRadius: 3.05,
                                        elevation: 10,
                                        borderRadius: 400,
                                    }}
                                >
                                    <Entypo
                                        name="eye"
                                        size={34}
                                        color="white"
                                    />
                                </Text>
                            )}
                        </View>
                    </>
                }
            </View>
        );
    };

    return (
        <ImageBackground
            // source={images[randomImageIndex]}
            source={!showAnswer ? images[randomImageIndex] : questions[currentIndex]?.featured_media}

            resizeMode="cover"
            style={styles.container}
        >
            <Stack.Screen
                options={{
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerTitle: "Test it",
                }}
            />
            <View style={styles.grid}>{renderCard("A", 1)}</View>
        </ImageBackground>
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
        width: 320,
        height: "auto",
        color: "white",
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
        color: "white",
        padding: 12,
        fontSize: 14,
        fontWeight: "bold",
        textIndent: 8,
    },
});

export default TestIt;
