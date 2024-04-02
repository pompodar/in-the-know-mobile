import React, { useState, useEffect } from "react";
import { TouchableOpacity, ImageBackground, View, Text, Button } from "react-native";
import Modal from "react-native-modal";
import { Stack, Link, router } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

 const apiUrl = "https://in-the-know.blobsandtrees.online/wp-json/wp/v2/posts";

export default function App() {

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [showAnswer, setShowAnswer] = useState(false);

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((posts) => {
                // Assuming posts is an array of questions
                const filteredQuestions = posts.filter(
                    (question) => question?.custom_fields?.custom_field1
                );
                setQuestions(shuffleArray(filteredQuestions));
            })
            .catch((error) => {
                console.error(error);
            });
    }, []); // empty dependency array ensures the effect runs only once on mount

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

        setShowAnswer(false);
    };

    const handleSeeAnswerPress = () => {
        setShowAnswer(true);
    };

    function back() {
        setIsModalVisible(false);
        router.replace("/");
    }

    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
            }}
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

            <ImageBackground
                style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                }}
                source={require("../assets/background.jpg")}
                resizeMode="cover"
            >
                <View
                    style={{
                        backgroundColor: "red",
                        padding: 30,
                        width: 290,
                        height: 290,
                        borderRadius: 150,
                        alignSelf: "center",
                        backgroundColor: "white",
                        shadowColor: "#000000",
                        shadowOffset: {
                            width: 0,
                            height: 10,
                        },
                        shadowOpacity: 0.17,
                        shadowRadius: 3.05,
                        elevation: 10,
                        position: "relative",
                    }}
                >
                    <TouchableOpacity>
                        <View
                            style={{
                                alignSelf: "center",
                                padding: 18,
                                position: "relative",
                                marginTop: 14,
                                color: "white",
                                textAlign: "center",
                                textAlignVertical: "center",
                                backgroundColor: "orangered",
                                shadowColor: "#000000",
                                shadowOffset: {
                                    width: 0,
                                    height: 10,
                                },
                                shadowOpacity: 0.17,
                                shadowRadius: 3.05,
                                elevation: 10,
                                borderRadius: 20,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    top: -46,
                                    alignSelf: "center",
                                    width: 50,
                                    height: 40,
                                    marginTop: 14,
                                    color: "white",
                                    textAlign: "center",
                                    textAlignVertical: "center",
                                    backgroundColor: "aqua",
                                    shadowColor: "#000000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 10,
                                    },
                                    shadowOpacity: 0.17,
                                    shadowRadius: 3.05,
                                    elevation: 10,
                                    borderRadius: 20,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onPress={handleGoPress}
                                title="Go"
                            >
                                Go
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    bottom: -36,
                                    alignSelf: "center",
                                    width: 150,
                                    height: 40,
                                    marginTop: 14,
                                    color: "white",
                                    textAlign: "center",
                                    textAlignVertical: "center",
                                    backgroundColor: "aqua",
                                    shadowColor: "#000000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 10,
                                    },
                                    shadowOpacity: 0.17,
                                    shadowRadius: 3.05,
                                    elevation: 10,
                                    borderRadius: 20,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onPress={handleSeeAnswerPress}
                            >
                                Show answer
                            </TouchableOpacity>

                            <Text
                                style={{
                                    color: "white",
                                }}
                            >
                                {
                                    questions[currentIndex]?.custom_fields
                                        ?.custom_field1
                                }
                            </Text>
                            {/* Render answer based on state or condition */}
                            <Text>
                                {showAnswer ? (
                                    <Text
                                        style={{
                                            display: "inline-block",
                                            marginTop: 20,
                                            color: "white",
                                        }}
                                    >
                                        {
                                            questions[currentIndex]
                                                ?.custom_fields?.custom_field2
                                        }
                                    </Text>
                                ) : (
                                    <div></div>
                                )}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Modal isVisible={isModalVisible}>
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: 1 == 1 ? "aqua" : "#e64a19",
                            borderRadius: 80,
                            width: 140,
                            height: 140,
                            padding: 30,
                            alignSelf: "center",
                            shadowColor: "#000000",
                            shadowOffset: {
                                width: 0,
                                height: 10,
                            },
                            shadowOpacity: 0.17,
                            shadowRadius: 3.05,
                            elevation: 10,
                        }}
                    >
                        <Text style={{ display: "none" }}>dummy</Text>
                        <Text>
                            {1 == 1 ? (
                                <Entypo
                                    name="emoji-happy"
                                    size={34}
                                    color="white"
                                />
                            ) : (
                                <Entypo
                                    name="emoji-neutral"
                                    size={34}
                                    color="white"
                                />
                            )}
                        </Text>
                        {3 < 5 ? (
                            <TouchableOpacity onPress={() => handleNext()}>
                                <AntDesign
                                    name="rightcircleo"
                                    size={22}
                                    style={{ marginTop: 8 }}
                                    color="white"
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={back}>
                                <AntDesign
                                    name="leftcircleo"
                                    size={22}
                                    style={{ marginTop: 8 }}
                                    color="white"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </Modal>
            </ImageBackground>
        </View>
    );
}
