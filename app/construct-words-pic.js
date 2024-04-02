import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, View, Text, TouchableOpacity, Image } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import Modal from "react-native-modal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, Link, router, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const ConstructWords = () => {
    const { words } = useLocalSearchParams();

    const initialSentences = ["акула", "бик", "вовк", "гриб", "ґудзик", "дим", "єнот", "жираф", "зуб", "їжак", "індик", "йогурт", "кіт", "лев", "мед", "ніж", "око", "пес", "ріг", "слон", "тигр", "удав", "фарба", "хліб", "цап", "щит"];

    const imagePaths = {
        акула: require("../assets/alph-pic/акула.png"),
        бик: require("../assets/alph-pic/бик.png"),
        вовк: require("../assets/alph-pic/вовк.png"),
        гриб: require("../assets/alph-pic/гриб.png"),
        ґудзик: require("../assets/alph-pic/ґудзик.png"),
        дим: require("../assets/alph-pic/дим.png"),
        єнот: require("../assets/alph-pic/єнот.png"),
        жираф: require("../assets/alph-pic/жираф.png"),
        зуб: require("../assets/alph-pic/зуб.png"),
        їжак: require("../assets/alph-pic/їжак.png"),
        індик: require("../assets/alph-pic/індик.png"),
        йогурт: require("../assets/alph-pic/йогурт.png"),
        кіт: require("../assets/alph-pic/кіт.png"),
        лев: require("../assets/alph-pic/лев.png"),
        мед: require("../assets/alph-pic/мед.png"),
        ніж: require("../assets/alph-pic/ніж.png"),
        око: require("../assets/alph-pic/око.png"),
        пес: require("../assets/alph-pic/пес.png"),
        ріг: require("../assets/alph-pic/ріг.png"),
        слон: require("../assets/alph-pic/слон.png"),
        тигр: require("../assets/alph-pic/тигр.png"),
        удав: require("../assets/alph-pic/удав.png"),
        фарба: require("../assets/alph-pic/фарба.png"),
        хліб: require("../assets/alph-pic/хліб.png"),
        цап: require("../assets/alph-pic/цап.png"),
        чай: require("../assets/alph-pic/чай.png"),
        щит: require("../assets/alph-pic/щит.png"),
    };



const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};


    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

    const [word, setWord] = useState("");

    const [currentWordToConstruct, setCurrentWordToConstruct] = useState("");

    const [sentenceNumber, setSentenceNumber] = useState(0);

    const [sentences, setSentences] = useState(
        shuffleArray([...initialSentences])
    );
    const [jumbledWords, setJumbledWords] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

    const [score, setScore] = useState(0);

    useEffect(() => {
        if (sentences.length > 0) {
            const sentence = sentences[0];
            const initialWordArray = sentence
                .split("")
                .map((word, index) => ({ key: `${index}`, label: word }));
            setJumbledWords(shuffleArray([...initialWordArray])); // Randomize the initial order
               setCurrentWordToConstruct(sentence);
        }
    }, [sentences]);

    const checkAnswer = () => {
        if (sentences.length === 0) {
            return;
        }

        setSentenceNumber(sentenceNumber + 1);

        const correctOrder = sentences[0].split("");
        const userOrder = jumbledWords.map((item) => item.label);
        const isAnswerCorrect = userOrder.join("") === correctOrder.join("");
        setWord(correctOrder.join(""));

        if (isAnswerCorrect) {
            setScore(score + 1);
        }
        setIsModalVisible(true);

        setModalContent(
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: isAnswerCorrect ? "aqua" : "#e64a19",
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
                    {isAnswerCorrect ? (
                        <Entypo name="emoji-happy" size={34} color="white" />
                    ) : (
                        <Entypo name="emoji-neutral" size={34} color="white" />
                    )}
                </Text>
                {sentenceNumber < 5 ? (
                    <TouchableOpacity onPress={() => nextSentence()}>
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
        );
    };

    const nextSentence = () => {
        const remainingSentences = [...sentences];
        remainingSentences.shift();
        setSentences(remainingSentences);
        setIsModalVisible(false);
    };

    function back() {
        setIsModalVisible(false);
        router.replace("/");
    }

    const [modalContent, setModalContent] = useState(null);

    const renderItem = ({ item, index, drag, isActive }) => (
        <TouchableOpacity
            style={{
                backgroundColor: isActive ? "#e91e63;" : "white",
                padding: 10,
                paddingLeft: 18,
                paddingRight: 18,
                margin: 10,
                borderRadius: 10,
                shadowColor: "#000000",
                shadowOffset: {
                    width: 0,
                    height: 10,
                },
                shadowOpacity: 0.17,
                shadowRadius: 3.05,
                elevation: 10,
            }}
            onLongPress={isModalVisible ? undefined : drag} // Disable dragging when the modal is visible
        >
            <Text
                style={{
                    fontSize: 22,
                    color: "#03a9f4",
                }}
            >
                {item.label}
            </Text>
        </TouchableOpacity>
    );

    const imageSource = imagePaths[currentWordToConstruct];

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
                    headerTitle: "Склади слова за картинкою",
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
                {sentences.length > 0 ? (
                    <View
                        style={{
                            padding: 0,
                            paddingVertical: 50,
                            width: 320,
                            height: 320,
                            borderRadius: 170,
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
                        <View
                            style={{
                                shadowColor: "#000000",
                                shadowOffset: {
                                    width: 0,
                                    height: 10,
                                },
                                shadowOpacity: 0.17,
                                shadowRadius: 3.05,
                                elevation: 10,
                                position: "absolute",
                                top: 24,
                                right: 24,
                                fontSize: 18,
                                width: 50,
                                height: 50,
                                backgroundColor: "#03a9f4",
                                borderRadius: 50,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontWeight: "bold",
                                }}
                            >
                                {score + " / 5"}
                            </Text>
                        </View>
                        <Text
                            style={{
                                alignSelf: "center",
                            }}
                        >
                            <Image
                                style={{
                                    width: 120,
                                    height: 120,
                                    marginTop: -50,
                                    alignSelf: "center",
                                }}
                                source={imageSource}
                            />
                        </Text>
                        <GestureHandlerRootView>
                            <DraggableFlatList
                                data={jumbledWords}
                                renderItem={renderItem}
                                horizontal
                                keyExtractor={(item) => item.key}
                                onDragEnd={({ data }) => setJumbledWords(data)}
                                style={{
                                    alignSelf: "center",
                                    margin: 18,
                                }}
                            />
                        </GestureHandlerRootView>
                        <TouchableOpacity onPress={() => checkAnswer()}>
                            <Text
                                style={{
                                    textAlign: "center",
                                    alignSelf: "center",
                                    width: 50,
                                    height: 50,
                                    color: "white",
                                    backgroundColor: "aqua",
                                    shadowColor: "#000000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 10,
                                    },
                                    shadowOpacity: 0.17,
                                    shadowRadius: 3.05,
                                    elevation: 10,
                                    borderRadius: 50,
                                }}
                            ></Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text>No more sentences to arrange.</Text>
                )}

                <Modal isVisible={isModalVisible} backdropOpacity={0.1}>
                    {modalContent}
                </Modal>
                <StatusBar hidden />
            </ImageBackground>
        </View>
    );
};

export default ConstructWords;
